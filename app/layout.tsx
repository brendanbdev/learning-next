/* This is called a root layout and is required. Any UI you add to the root layout will be shared 
across all pages in your application. You can use the root layout to modify your <html> and <body> 
tags, and add metadata. */
import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';

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
