/* The advantage of employing Middleware for this task is that the protected routes will not even 
start rendering until the Middleware verifies the authentication, enhancing both the security and 
performance of your application. 

Here you're initializing NextAuth.js with the authConfig object and exporting the auth property. 
You're also using the 'matcher' option from Middleware to specify that it should run on specific 
paths. 

When you define middleware in a Next.js application, it is automatically integrated into the request 
handling process. The middleware you export in middleware.ts is executed for every request that 
matches the paths specified by the matcher configuration. */
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export default NextAuth(authConfig).auth;
 
export const config = {
  /* 
  https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  
  Regex Breakdown:
  
  '/((?!api|_next/static|_next/image|.*\\.png$).*)'

  '/': The pattern starts at the root, meaning it applies to all paths starting from the base URL.

  '(?!...)': This is a negative lookahead assertion, which checks that the path does not start with 
  any of the specified patterns. In this case, the patterns are:

    'api': Matches paths starting with '/api'.

    '_next/static': Matches paths starting with '/_next/static'.

    '_next/image': Matches paths starting with '/_next/image'.

    '.*\\.png$': Matches paths ending with '.png' (e.g., '/image.png').

  '.*': This part matches any character ('.') zero or more times ('*'), allowing for any path that 
  doesn't match the exclusions in the negative lookahead. 
  */
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};