import { getJobs } from '@/lib/db';
import { NextResponse } from 'next/server';

export const revalidate = 60; // Cache search index for 60 seconds

export async function GET() {
  try {
    const jobs = await getJobs();
    // Only return minimal payload needed for fuzzy searching
    const searchData = jobs.map(job => ({
      title: job.title,
      category: job.category,
      department: job.department,
      slug: job.slug,
      state: job.state,
      district: job.district
    }));
    return NextResponse.json(searchData);
  } catch (e) {
    console.error("Failed to compile search database index:", e);
    return NextResponse.json({ error: "Failed to compile search index" }, { status: 500 });
  }
}
