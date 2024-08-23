// 'use client' makes this is a Client Component, which means you can use event listeners and hooks.
'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
/* Debouncing is a programming practice that limits the rate at which a function can fire. In our 
case, you only want to query the database when the user has stopped typing. 

How Debouncing Works:

Trigger Event: When an event that should be debounced (like a keystroke in the search box) occurs, 
a timer starts.
Wait: If a new event occurs before the timer expires, the timer is reset.
Execution: If the timer reaches the end of its countdown, the debounced function is executed. 

You can implement debouncing in a few ways, including manually creating your own debounce function. 
To keep things simple, we'll use a library called use-debounce.

This function will wrap the contents of handleSearch, and only run the code after a specific time 
once the user has stopped typing. */
import { useDebouncedCallback } from 'use-debounce';
/* 'useSearchParams' allows you to access the parameters of the current URL. For example, the search 
params for this URL /dashboard/invoices?page=1&query=pending would look like this: 
{page: '1', query: 'pending'}. Also, this works on the client side, as opposed to using the 
searchParams prop.

'usePathname' lets you read the current URL's pathname. For example, for the route 
/dashboard/invoices, 'usePathname' would return '/dashboard/invoices'. 

'useRouter' enables navigation between routes within client components programmatically. There are 
multiple methods you can use. */
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    /* 'URLSearchParams' is a Web API that provides utility methods for manipulating the URL query 
    parameters. Instead of creating a complex string literal, you can use it to get the params string 
    like '?page=1&query=a'. */
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    // Updates the URL with the user's search data without reloading the page.
    replace(`${pathname}?${params.toString()}`);
    // console.log(term);
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        /* 
        defaultValue vs. value / Controlled vs. Uncontrolled
        
        If you're using state to manage the value of an input, you'd use the value attribute to make 
        it a controlled component. This means React would manage the input's state.
        
        However, since you're not using state, you can use defaultValue. This means the native input 
        will manage its own state. This is okay since you're saving the search query to the URL 
        instead of state. 
        */
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
