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
https://nextjs.org/learn/dashboard-app/mutating-data 

Also, note how in the actions 'redirect' is being called outside of the try/catch blocks. This is 
because redirect works by throwing an error, which would be caught by the catch block. To avoid this, 
you can call redirect after try/catch. redirect would only be reachable if try is successful. */
'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
/* revalidatePath clears the cache and triggers a new request to the server to revalidate the path 
specified in the argument, even if that is not the path being shown. */
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
        .number()
        // We need this because coerce() will default to zero if the string is empty.
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

// In this example, the prop 'prevState' is not used, but it is still a required prop.
export async function createInvoice(prevState: State, formData: FormData) {
    /* 
    Validate form fields using Zod.

    safeParse() will return an object containing either a success or error field. This will help 
    handle validation more gracefully without having put this logic inside the try/catch block. 

    Although there are a couple of methods you can use to extract the values of 'formData', here we 
    are using the .get(name) method. 
    
    Tip: If you're working with forms that have many fields, you may want to consider using the 
    entries() method with JavaScript's Object.fromEntries(). For example:
    const rawFormData = Object.fromEntries(formData.entries()) 
    */
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // DELETE THIS
    console.log(`LOGGING "validatedFields": ${validatedFields}`);

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    // Insert data into the database
    try {
        await sql`
          INSERT INTO invoices (customer_id, amount, status, date)
          VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        // If a database error occurs, return a more specific error.
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }

    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(
    id: string,
    prevState: State,
    formData: FormData,
) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
          `;
    } catch (error) {
        return { message: 'Database Error: Failed to Update Invoice.' };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    throw new Error('Failed to Delete Invoice');
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Invoice.' };
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }