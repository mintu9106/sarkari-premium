import { ImageResponse } from 'next/og';
import { getJobBySlug } from '@/lib/db';

export const alt = 'Sarkari Premium Job Details';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const runtime = 'nodejs';

export default async function Image({ params }) {
  const resolvedParams = await params;
  const job = await getJobBySlug(resolvedParams.slug);

  if (!job) {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', width: '1200px', height: '630px', background: '#0f172a', color: 'white', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
          Job Notification Not Found
        </div>
      ),
      { ...size }
    );
  }

  // Generate initials for the logo
  const initials = job.department
    ? job.department
        .split(' ')
        .map(w => w[0])
        .filter(c => c && c.match(/[A-Za-z]/))
        .slice(0, 4)
        .join('')
        .toUpperCase()
    : 'SP';

  // Format salary text length
  let salaryText = "As per official notification rules";
  if (job.salary) {
    salaryText = typeof job.salary === 'string' ? job.salary : 'Details inside';
    if (salaryText.length > 36) {
      salaryText = salaryText.substring(0, 35) + "...";
    }
  }

  // Colors based on category
  const colors = {
    'Central Govt Jobs': { main: '#f59e0b', gradient: 'linear-gradient(to bottom right, #0f172a, #1e1b4b)' },
    'State-wise Jobs': { main: '#f97316', gradient: 'linear-gradient(to bottom right, #0f172a, #2c1a04)' },
    'District-wise Jobs': { main: '#a855f7', gradient: 'linear-gradient(to bottom right, #0f172a, #25103f)' },
    'Admit Cards': { main: '#3b82f6', gradient: 'linear-gradient(to bottom right, #0f172a, #0c2340)' },
    'Results': { main: '#10b981', gradient: 'linear-gradient(to bottom right, #0f172a, #062f22)' }
  }[job.category] || { main: '#64748b', gradient: 'linear-gradient(to bottom right, #0f172a, #1e293b)' };

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          background: colors.gradient,
          color: 'white',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top bar header */}
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ background: '#f59e0b', color: 'black', padding: '8px 16px', borderRadius: '6px', fontWeight: '900', fontSize: '24px', letterSpacing: '1px' }}>
              SARKARI
            </span>
            <span style={{ fontWeight: '800', fontSize: '24px', letterSpacing: '1px' }}>
              PREMIUM
            </span>
          </div>
          <span style={{ background: colors.main, color: job.category === 'Central Govt Jobs' ? 'black' : 'white', padding: '8px 20px', borderRadius: '9999px', fontSize: '18px', fontWeight: 'bold' }}>
            {job.category}
          </span>
        </div>

        {/* Core content block */}
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center', width: '100%' }}>
          {/* Logo container with initials */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              borderRadius: '24px',
              background: `linear-gradient(to bottom right, ${colors.main}, #ffffff)`,
              color: 'black',
              fontSize: '44px',
              fontWeight: '900',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
              flexShrink: 0
            }}
          >
            {initials}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <span style={{ color: '#94a3b8', fontSize: '20px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {job.department}
            </span>
            <span style={{ fontSize: '46px', fontWeight: '900', marginTop: '6px', lineHeight: '1.2' }}>
              {job.title}
            </span>
          </div>
        </div>

        {/* Footer row */}
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #334155', paddingTop: '30px' }}>
          <div style={{ display: 'flex', gap: '50px' }}>
            {job.important_dates?.end_date && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px' }}>LAST DATE TO APPLY</span>
                <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#ef4444', marginTop: '4px' }}>{job.important_dates.end_date}</span>
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px' }}>SALARY SCALE</span>
              <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#10b981', marginTop: '4px' }}>{salaryText}</span>
            </div>
          </div>
          <span style={{ color: '#64748b', fontSize: '18px', fontWeight: 'bold' }}>sarkari-premium.vercel.app</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
