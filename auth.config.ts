/* This file exports an authConfig object. This object will contain the configuration options for 
NextAuth.js. 

You can use the 'pages' option to specify the route for custom sign-in, sign-out, and error pages. 
This is not required, but by adding signIn: '/login' into our 'pages' option, the user will be 
redirected to our custom login page, rather than the NextAuth.js default page. */
import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    /* The 'authorized' callback is used to verify if the request is authorized to access a page via 
    Next.js Middleware. It is called before a request is completed, and it receives an object with 
    the 'auth' and 'request' properties. The 'auth' property contains the user's session, and the 
    'request' property contains the incoming request. */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  /* The 'providers' option is an array where you list different login options. For now, it's an empty 
  array to satisfy NextAuth config. */
  providers: [],
} satisfies NextAuthConfig;