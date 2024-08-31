/* This is called a root layout and is required. Any UI you add to the root layout will be shared 
across all pages in your application. You can use the root layout to modify your <html> and <body> 
tags, and add metadata. */
import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
 
/* You can include a metadata object from any layout.js or page.js file to add additional page 
information like title and description. Any metadata in layout.js will be inherited by all pages 
that use it. 

Lets say you wanted a custom title for a specific page. Just add a metadata object to the page itself. 
Metadata in nested pages will override the metadata in the parent.

Here, we are using 'title.template' field to avoid hardcoding values in every page file where we want 
custom metadata for that page. Add the template values in the page files. For example, in the invoices 
page, add:

export const metadata: Metadata = {
  title: 'Invoices',
}; */
export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Here, I am making Inter the primary font as well as adding the Tailwind antialiased class 
      which smooths out the font. */}
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
