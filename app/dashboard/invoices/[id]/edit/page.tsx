import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
/* Other than using the special error.tsx file, can handle errors gracefully is by using the notFound 
function with a not-found file. While error.tsx is useful for catching all errors, notFound can be 
used when you try to fetch a resource that doesn't exist. Also keep in mind that notFound will take 
precedence over error.tsx, so you can reach out for it when you want to handle more specific errors! */
import { notFound } from 'next/navigation';

/* 
In addition to 'searchParams', page components also accept a prop called 'params' which you can use 
to access the 'id'. 

UUIDs vs. Auto-incrementing Keys:
We use UUIDs instead of incrementing keys (e.g., 1, 2, 3, etc.). This makes the URL longer; however, 
UUIDs eliminate the risk of ID collision, are globally unique, and reduce the risk of enumeration 
attacks - making them ideal for large databases. However, if you prefer cleaner URLs, you might prefer 
to use auto-incrementing keys. 
*/
export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers(),
    ]);

    if (!invoice) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: '/dashboard/invoices' },
                    {
                        label: 'Edit Invoice',
                        href: `/dashboard/invoices/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form invoice={invoice} customers={customers} />
        </main>
    );
}