/* By adding the 'use server', you mark all the exported functions within the file as Server Actions. 
These server functions can then be imported and used in Client and Server components. You can also 
write Server Actions directly inside Server Components by adding "use server" inside the action. But 
here, we'll keep them all organized in a separate file. 

Good to know: In HTML, you'd pass a URL to the action attribute. This URL would be the destination 
where your form data should be submitted (usually an API endpoint). However, in React, the action 
attribute is considered a special prop - meaning React builds on top of it to allow actions to be 
invoked. Behind the scenes, Server Actions create a POST API endpoint. This is why you don't need to 
create API endpoints manually when using Server Actions. 

You can also read more about security with Server Actions for additional learning:
https://nextjs.org/learn/dashboard-app/mutating-data */
'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
/* revalidatePath clears the cache and triggers a new request to the server to revalidate the path 
specified in the argument, even if that is not the path being shown. */
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    /* Although there are a couple of methods you can use to extract the values of 'formData', here we 
    are using the .get(name) method. 
    
    Tip: If you're working with forms that have many fields, you may want to consider using the 
    entries() method with JavaScript's Object.fromEntries(). For example:
    const rawFormData = Object.fromEntries(formData.entries()) */
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;

    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
}