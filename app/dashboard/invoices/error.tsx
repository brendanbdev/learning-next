/* An error file is a special Next.JS file that allows you to handle unexpected runtime errors and 
display fallback UI. It will apply to routs in the same folder and child routes. It needs to be a 
Client Component, and it accepts two props:
error: This object is an instance of JavaScript's native Error object.
reset: This is a function to reset the error boundary. When executed, the function will try to 
re-render the route segment. 

Another way you can handle errors gracefully is by using the notFound function with a not-found file. 
While error.tsx is useful for catching all errors, notFound can be used when you try to fetch a 
resource that doesn't exist. We are using the notFound function in 
/dashboard/invoices/[id]/edit/page.tsx, and the not-found file is in the same folder. 

Also keep in mind that notFound will take precedence over error.tsx, so you can reach out for it when 
you want to handle more specific errors! */
'use client';
 
import { useEffect } from 'react';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}