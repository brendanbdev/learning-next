/* loading.tsx is a special Next.js file built on top of Suspense, it allows you to create fallback 
UI to show as a replacement while page content loads. It applies to all page.tsx files in the same 
folder. In this folder, I am also using "Route Groups" to make this loading file apply to only to the 
page.tsx file in the same folder without affecting the URL path structure. When you create a new 
folder using parentheses (), the name won't be included in the URL path.

So /dashboard/(overview)/page.tsx becomes /dashboard. 

You can also use route groups to separate your application into sections (e.g. (marketing) routes 
and (shop) routes) or by teams for larger applications.*/
import DashboardSkeleton from '@/app/ui/skeletons';

export default function Loading() {
    return <DashboardSkeleton />;
  }