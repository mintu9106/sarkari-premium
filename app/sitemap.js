import { getJobs, getJobUrl } from '@/lib/db';

export default async function sitemap() {
  const baseUrl = 'https://sarkari-premium-gilt.vercel.app';
  
  // 1. Core static routes
  const staticRoutes = [
    '',
    '/jobs',
    '/admit-cards',
    '/results',
    '/gov-schemes',
    '/central-jobs',
    '/about',
    '/contact',
    '/disclaimer',
    '/privacy'
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Dynamic detail pages from database
  try {
    const jobs = await getJobs();
    const dynamicRoutes = jobs.map(job => {
      const path = getJobUrl(job.category, job.slug);
      return {
        url: `${baseUrl}${path}`,
        lastModified: new Date(job.updated_at || new Date()),
        changeFrequency: job.category === 'Govt Schemes' ? 'weekly' : 'daily',
        priority: job.category === 'Govt Schemes' ? 0.7 : 0.6,
      };
    });

    return [...staticRoutes, ...dynamicRoutes];
  } catch (e) {
    console.error("Error generating sitemap:", e);
    return staticRoutes;
  }
}
