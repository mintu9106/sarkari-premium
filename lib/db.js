import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Initialize Supabase if env variables are available
const isSupabaseEnabled = !!(supabaseUrl && supabaseKey);
const supabase = isSupabaseEnabled ? createClient(supabaseUrl, supabaseKey) : null;

// Local JSON File Database Fallback
const LOCAL_DB_PATH = path.join(process.cwd(), 'jobs_db.json');

const fallbackJobs = [
  {
    id: "1",
    title: "UPSC Civil Services Exam 2026 Notification",
    department: "Union Public Service Commission (UPSC)",
    category: "Central Govt Jobs",
    state: null,
    district: null,
    block: null,
    municipality: null,
    overview: "UPSC has released the Civil Services Examination (CSE) 2026 notification for recruitment into administrative and civil services of the Central Government.",
    eligibility: "Bachelor's Degree in any discipline from a recognized university.",
    age_limit: "21 to 32 years (Relaxation applicable as per Govt rules).",
    salary: "Pay Level 10 (Rs. 56,100 to Rs. 1,77,500)",
    important_dates: {
      start_date: "2026-06-01",
      end_date: "2026-06-30",
      exam_date: "2026-09-15"
    },
    how_to_apply: "Candidates must apply online through the official UPSC portal. 1. Go to upsconline.nic.in, 2. Fill the One Time Registration (OTR), 3. Fill the Application Form Part-I and Part-II, 4. Pay the application fee, 5. Print confirmation page.",
    apply_link: "https://upsconline.nic.in",
    official_pdf_link: "https://www.upsc.gov.in/notifications",
    slug: "upsc-civil-services-exam-2026",
    meta_title: "UPSC CSE 2026 Notification: Apply Online for IAS/IFS",
    meta_description: "Apply online for UPSC Civil Services Exam 2026. Get recruitment details, eligibility criteria, important dates, and salary details for IAS/IFS exam.",
    content: `### Recruitment Highlights
- **Conducting Body**: Union Public Service Commission (UPSC)
- **Exam Name**: Civil Services Examination (CSE) 2026
- **Vacancies**: 1,000+ (Expected)
- **Selection Stage**: Prelims, Mains, and Interview

### Application Fee
| Category | Fee | Mode |
|---|---|---|
| General / OBC | Rs. 100/- | Online / Cash |
| Female / SC / ST / PwD | Rs. 0/- | Exempted |`,
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    title: "SSC CGL Recruitment 2026 Notification",
    department: "Staff Selection Commission (SSC)",
    category: "Central Govt Jobs",
    state: null,
    district: null,
    block: null,
    municipality: null,
    overview: "SSC CGL 2026 notification is out for Group B and Group C posts in various Ministries, Departments, and Organizations of the Govt of India.",
    eligibility: "Bachelor's Degree in any stream.",
    age_limit: "18 to 30 years (Varies by post).",
    salary: "Pay Level 4 to Level 8 (Rs. 25,500 to Rs. 1,51,100)",
    important_dates: {
      start_date: "2026-05-15",
      end_date: "2026-06-15",
      exam_date: "2026-08-20"
    },
    how_to_apply: "1. Visit the new SSC website (ssc.gov.in), 2. Register yourself, 3. Complete the online form, 4. Upload live photo & documents, 5. Pay fee of Rs. 100, 6. Submit form.",
    apply_link: "https://ssc.gov.in",
    official_pdf_link: "https://ssc.gov.in/candidate-portal",
    slug: "ssc-cgl-recruitment-2026",
    meta_title: "SSC CGL 2026 Recruitment: Apply Online for Group B & C",
    meta_description: "SSC CGL Recruitment 2026 online application is open. Find all important details including eligibility, age limit, posts list, and apply steps.",
    content: `### Recruitment Summary & Highlights
- **Conducting Body**: Staff Selection Commission (SSC)
- **Exam Name**: Combined Graduate Level (CGL) Exam 2026
- **Vacancies**: 15,000+ (Expected)
- **Selection Process**: Tier-I & Tier-II (CBT)

### Application Fee Details
| Category | Application Fee | Payment Mode |
|---|---|---|
| General / OBC / EWS | Rs. 100/- | Online (UPI, Net Banking, Card) |
| SC / ST / PwD / ESM | Rs. 0/- | Exempted |
| All Female Candidates | Rs. 0/- | Exempted |

### Important Exam Schedule
| Event | Date |
|---|---|
| Notification Release | 15th May 2026 |
| Online Application Start | 15th May 2026 |
| Last Date to Apply | 15th June 2026 |
| Last Date to Pay Fee | 16th June 2026 |
| Tier-I Exam Date | 20th August 2026 |

### Age Limit (As on 01-August-2026)
- **Minimum Age**: 18 Years
- **Maximum Age**: 27 - 32 Years (Depending on post)
- **Age Relaxation**: SC/ST: 5 years, OBC: 3 years, PwD: 10 years.

### Vacancy & Post-wise Eligibility Criteria
| Post Name | Department | Age Limit | Essential Eligibility |
|---|---|---|---|
| Assistant Section Officer (ASO) | Central Secretariat Service (CSS) | 20-30 Years | Bachelor's Degree in any discipline from a recognized University |
| Assistant Section Officer (ASO) | Intelligence Bureau (IB) | 18-30 Years | Bachelor's Degree in any discipline |
| Inspector (CGST & Central Excise) | CBIC | 18-30 Years | Bachelor's Degree in any discipline |
| Inspector (Preventive Officer) | CBIC | 18-30 Years | Bachelor's Degree in any discipline |
| Assistant Audit Officer (AAO) | C&AG | 18-30 Years | Bachelor's Degree (Desirable: CA/CS/MBA/M.Com) |
| Junior Statistical Officer (JSO) | M/o Statistics & Prog Implementation | 18-32 Years | Bachelor's Degree with 60% in Math at 12th level OR Bachelor's Degree with Statistics |`,
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    title: "Patna Block Extension Officer Recruitment 2026",
    department: "Bihar Staff Selection Commission (BSSC)",
    category: "District-wise Jobs",
    state: "Bihar",
    district: "Patna",
    block: "Danapur",
    municipality: null,
    overview: "BSSC invites application for local block-level Extension Officers in Patna District, specifically stationed under Danapur block administrations.",
    eligibility: "Graduate degree in Agriculture or Economics from a recognized university.",
    age_limit: "21 to 37 years as on 1st January 2026.",
    salary: "Rs. 35,400 to Rs. 1,12,400 (Pay Level 6)",
    important_dates: {
      start_date: "2026-05-10",
      end_date: "2026-06-10",
      exam_date: "2026-07-25"
    },
    how_to_apply: "1. Visit BSSC online application link, 2. Enter Patna District recruitment column, 3. Complete application for Danapur Block vacancy, 4. Pay fee online.",
    apply_link: "https://bssc.bihar.gov.in",
    official_pdf_link: null,
    slug: "patna-block-extension-officer-recruitment-2026",
    meta_title: "Patna Block Extension Officer Recruitment 2026 - Apply Online",
    meta_description: "Apply online for Block Extension Officer vacancies in Patna district (Danapur Block). Get eligibility, application steps, and dates.",
    content: `### Recruitment Highlights
- **District**: Patna
- **Block**: Danapur
- **Post**: Block Extension Officer
- **Total Posts**: 45 Vacancies

### Timeline
| Event | Date |
|---|---|
| Apply Start | 10th May 2026 |
| Apply Last Date | 10th June 2026 |
| Exam Date | 25th July 2026 |`,
    updated_at: new Date().toISOString()
  },
  {
    id: "4",
    title: "Kolkata Municipal Corporation Clerk Vacancy 2026",
    department: "West Bengal Municipal Service Commission (MSCWB)",
    category: "District-wise Jobs",
    state: "West Bengal",
    district: "Kolkata",
    block: null,
    municipality: "Kolkata MC",
    overview: "MSCWB is recruiting Junior Clerks for municipal administrative services within the Kolkata Municipal Corporation.",
    eligibility: "Madhyamik (10th) pass or equivalent with basic computer typing knowledge.",
    age_limit: "18 to 40 years (Relaxations for reserved categories).",
    salary: "Rs. 22,700 to Rs. 58,500 (Pay Level 6 as per ROPA 2019)",
    important_dates: {
      start_date: "2026-05-01",
      end_date: "2026-05-31",
      exam_date: "2026-07-12"
    },
    how_to_apply: "Candidates must apply online via MSCWB portal. Upload scan photo and signature, pay registration fee and print the completed receipt.",
    apply_link: "https://mscwb.org",
    official_pdf_link: "https://mscwb.org/recruitment-pdf",
    slug: "kolkata-municipal-corporation-clerk-vacancy-2026",
    meta_title: "Kolkata Municipal Corporation (KMC) Clerk Recruitment 2026",
    meta_description: "Apply for 120 Junior Clerk posts in Kolkata Municipal Corporation. 10th pass eligible. Complete application process, dates, fee details.",
    content: `### KMC Recruitment details
- **District**: Kolkata
- **Municipality**: Kolkata Municipal Corporation (KMC)
- **Position**: Junior Clerk
- **Total vacancies**: 120 Posts

### Fee Structure
| Category | Application Fee | Processing Fee | Total |
|---|---|---|---|
| UR / OBC | Rs. 150/- | Rs. 50/- | Rs. 200/- |
| SC / ST / PwD | Nil | Rs. 50/- | Rs. 50/- |`,
    updated_at: new Date().toISOString()
  },
  {
    id: "5",
    title: "Lucknow Block Health Assistant Recruitment 2026",
    department: "Uttar Pradesh National Health Mission (UP NHM)",
    category: "District-wise Jobs",
    state: "Uttar Pradesh",
    district: "Lucknow",
    block: "Chinhat",
    municipality: null,
    overview: "National Health Mission, Uttar Pradesh has announced recruitments for Health Assistants stationed under Chinhat block of Lucknow District.",
    eligibility: "Class 12 Intermediate with Diploma in Health Care or Auxiliary Nurse Midwifery (ANM).",
    age_limit: "18 to 40 years as on 1st July 2026.",
    salary: "Rs. 18,000 (Consolidated Monthly Honorarium)",
    important_dates: {
      start_date: "2026-05-18",
      end_date: "2026-06-18",
      exam_date: null
    },
    how_to_apply: "Apply online at upnrhm.gov.in. Register, select District-level Health Assistant, choose Lucknow District and Chinhat Block, fill the details.",
    apply_link: "https://upnrhm.gov.in",
    official_pdf_link: null,
    slug: "lucknow-block-health-assistant-recruitment-2026",
    meta_title: "Lucknow District Health Assistant Recruitment 2026: Apply Online",
    meta_description: "Apply online for Health Assistant vacancies in Lucknow district (Chinhat Block). Get salary, criteria, and timeline details.",
    content: `### Recruitment Overview
- **District**: Lucknow
- **Block**: Chinhat
- **Post Name**: Block Health Assistant
- **Monthly Honorarium**: Rs. 18,000/- PM

### Date Chart
| Event | Date |
|---|---|
| Registration Start | 18th May 2026 |
| Last Date to Register | 18th June 2026 |
| Merit List Declaration | July 2026 |`,
    updated_at: new Date().toISOString()
  },
  {
    id: "6",
    title: "UPSC Civil Services Prelims Exam Admit Card 2026",
    department: "Union Public Service Commission (UPSC)",
    category: "Admit Cards",
    state: null,
    district: null,
    block: null,
    municipality: null,
    overview: "Union Public Service Commission has released the e-Admit Cards for the Civil Services (Preliminary) Examination 2026.",
    eligibility: "Candidates who registered for UPSC CSE 2026 can download using registration ID.",
    age_limit: "N/A",
    salary: "N/A",
    important_dates: {
      start_date: "2026-05-24",
      end_date: "2026-06-15",
      exam_date: "2026-06-15"
    },
    how_to_apply: "1. Visit the UPSC OTR portal (upsconline.nic.in), 2. Enter Registration ID & Date of Birth, 3. Complete captcha verification, 4. Print Admit Card PDF.",
    apply_link: "https://upsconline.nic.in",
    official_pdf_link: "https://www.upsc.gov.in/admit-card",
    slug: "upsc-civil-services-prelims-exam-admit-card-2026",
    meta_title: "UPSC CSE Prelims Admit Card 2026 Out - Download Link",
    meta_description: "UPSC Civil Services Examination 2026 prelims admit cards are now available online. Download link, login guide, exam schedules inside.",
    content: `### Admit Card Notification
- **Admit Card Released**: 24th May 2026
- **Exam Date**: 15th June 2026
- **Download Mode**: Online only`,
    updated_at: new Date().toISOString()
  },
  {
    id: "7",
    title: "SSC GD Constable Exam Admit Card 2026",
    department: "Staff Selection Commission (SSC)",
    category: "Admit Cards",
    state: null,
    district: null,
    block: null,
    municipality: null,
    overview: "Staff Selection Commission is releasing the region-wise application status and e-Admit Cards for GD Constable recruitment examination 2026.",
    eligibility: "Registered candidates of SSC GD 2026.",
    age_limit: "N/A",
    salary: "N/A",
    important_dates: {
      start_date: "2026-05-20",
      end_date: "2026-06-10",
      exam_date: "2026-06-10"
    },
    how_to_apply: "1. Visit the official regional SSC website, 2. Click on 'Download Admit Card for Constable (GD)', 3. Enter Roll Number or Registration No., 4. Print Hall Ticket.",
    apply_link: "https://ssc.gov.in",
    official_pdf_link: null,
    slug: "ssc-gd-constable-exam-admit-card-2026",
    meta_title: "SSC GD Constable Admit Card 2026 Region-Wise out",
    meta_description: "Download region-wise SSC GD Constable Admit Cards. Check application status, region website links, exam center guidelines.",
    content: `### SSC GD Hall Ticket 2026
- **Status**: Region-wise rolling release active
- **Exam Period**: 10th June to 20th June 2026`,
    updated_at: new Date().toISOString()
  },
  {
    id: "8",
    title: "BPSC 69th CCE Final Merit List & Results 2026",
    department: "Bihar Public Service Commission (BPSC)",
    category: "Results",
    state: "Bihar",
    district: null,
    block: null,
    municipality: null,
    overview: "Bihar Public Service Commission has declared the final merit list and cut-off marks for the 69th Combined Competitive Examination (CCE).",
    eligibility: "Candidates who appeared in BPSC 69th Interviews.",
    age_limit: "N/A",
    salary: "N/A",
    important_dates: {
      start_date: "2026-05-24",
      end_date: null,
      exam_date: null
    },
    how_to_apply: "Download the final results PDF sheet directly from bpsc.bih.nic.in to search your roll number in the selected candidates list.",
    apply_link: "https://www.bpsc.bih.nic.in",
    official_pdf_link: "https://www.bpsc.bih.nic.in/results-pdf",
    slug: "bpsc-69th-cce-final-merit-list-results-2026",
    meta_title: "BPSC 69th CCE Final Results Declared: PDF Merit List",
    meta_description: "BPSC 69th Combined Competitive Exam final result is out. Download PDF sheet, merit rankings, category-wise cut off list.",
    content: `### Merit List Details
- **Result Status**: Declared on 24th May 2026
- **Total Selected Candidates**: 475 Posts filled
- **BPSC Web link**: bpsc.bih.nic.in`,
    updated_at: new Date().toISOString()
  },
  {
    id: "9",
    title: "IBPS PO XIV Online Exam Results Declared",
    department: "Institute of Banking Personnel Selection (IBPS)",
    category: "Results",
    state: null,
    district: null,
    block: null,
    municipality: null,
    overview: "IBPS has released the scores and provisional allotment lists for Probationary Officers (PO/MT) recruitment exam XIV.",
    eligibility: "Candidates who took the IBPS PO Main examination.",
    age_limit: "N/A",
    salary: "N/A",
    important_dates: {
      start_date: "2026-05-22",
      end_date: null,
      exam_date: null
    },
    how_to_apply: "Go to ibps.in, log in with your Registration Number and Password/Date of Birth to view your scorecard and provisional bank allotment.",
    apply_link: "https://www.ibps.in",
    official_pdf_link: null,
    slug: "ibps-po-xiv-online-exam-results-declared",
    meta_title: "IBPS PO XIV Provisional Allotment & Results Declared",
    meta_description: "Check IBPS PO XIV online exam final results. Log in to view provisional bank allotment status and official scorecards.",
    content: `### IBPS Results Summary
- **Declared on**: 22nd May 2026
- **Scorecard validity**: Till 31st March 2027
- **Official site**: ibps.in`,
    updated_at: new Date().toISOString()
  }
];

// Helper to get local data safely in serverless environments
function getLocalJobs() {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const fileData = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
      return JSON.parse(fileData);
    }
  } catch (e) {
    console.error("Local file database read failed, using code fallback:", e);
  }
  return fallbackJobs;
}

export async function getJobs(excludeExpired = false) {
  let data = [];
  if (isSupabaseEnabled) {
    try {
      const { data: dbData, error } = await supabase
        .from('jobs')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      data = dbData;
    } catch (e) {
      console.error("Supabase error, falling back to local database:", e);
      data = getLocalJobs();
    }
  } else {
    data = getLocalJobs();
  }
  
  const sorted = data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  
  if (excludeExpired) {
    const todayStr = new Date().toISOString().split('T')[0];
    return sorted.filter(job => {
      const isJobCategory = ['Central Govt Jobs', 'State-wise Jobs', 'District-wise Jobs'].includes(job.category);
      if (isJobCategory && job.important_dates && job.important_dates.end_date) {
        return job.important_dates.end_date >= todayStr;
      }
      return true;
    });
  }
  
  return sorted;
}

export async function getJobBySlug(slug) {
  if (isSupabaseEnabled) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error) throw error;
      return data;
    } catch (e) {
      console.error("Supabase error, falling back to local database:", e);
    }
  }

  // Local code/file fallback
  const jobs = getLocalJobs();
  return jobs.find(job => job.slug === slug) || null;
}

export async function upsertJob(jobData) {
  const normalizedData = {
    ...jobData,
    updated_at: new Date().toISOString()
  };

  if (isSupabaseEnabled) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .upsert(normalizedData, { onConflict: 'slug' })
        .select();
      if (error) throw error;
      return data[0];
    } catch (e) {
      console.error("Supabase upsert error, falling back to local database:", e);
    }
  }

  // Local file write with memory updates
  const jobs = getLocalJobs();
  const existingIdx = jobs.findIndex(job => job.slug === jobData.slug);
  if (existingIdx !== -1) {
    jobs[existingIdx] = {
      ...jobs[existingIdx],
      ...normalizedData
    };
  } else {
    if (!normalizedData.id) {
      normalizedData.id = Math.random().toString(36).substring(2, 11);
    }
    jobs.push(normalizedData);
  }
  
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(jobs, null, 2), 'utf-8');
  } catch (e) {
    console.error("Failed to write updated jobs back to disk (expected on serverless):", e);
  }
  return normalizedData;
}

export function getJobUrl(category, slug) {
  if (category === 'Admit Cards') {
    return `/admit-cards/${slug}`;
  }
  if (category === 'Results') {
    return `/results/${slug}`;
  }
  if (category === 'Govt Schemes') {
    return `/gov-schemes/${slug}`;
  }
  return `/jobs/${slug}`;
}

