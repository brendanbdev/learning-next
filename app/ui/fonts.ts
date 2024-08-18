/*
Next.js automatically optimizes fonts in the application when you use the 'next/font' module.

It downloads font files at build time and hosts them with your other static assets.

This means when a user visits your application, there are no additional network requests for
fonts which would impact performance.
*/
import { Inter, Lusitana } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });
// You need a "weight" attribute for the argument of "Lusitana()".
export const lusitana = Lusitana({ weight: ['400', '700'], subsets: ['latin'] });