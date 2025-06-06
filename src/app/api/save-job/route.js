import { NextResponse } from 'next/server';
// ✅ KEEP ONLY ONE IMPORT
import { Pool } from 'pg';

// PostgreSQL connection setup
const pool = new Pool({
  user: 'job_admission_admin_user',
  host: 'dpg-d0u2lbemcj7s73998tlg-a.oregon-postgres.render.com',
  database: 'job_admission_admin',
  password: 'RYdl2nFz0bGBI2UnWFtOHEy5oJAogCz2',
  port: 5432
});

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM jobs');
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
   
export async function POST(request) {
  try {
    const body = await request.json();

   const {
  created_at,
  title,
  company,
  location,
  jobType,
  salaryMin,
  salaryMax,
  deadline,
  description,
} = body;

const createdAtUtc = created_at ? new Date(created_at).toISOString() : new Date().toISOString();

// If deadline is empty string or invalid date, set to null
const deadlineValue = deadline && deadline.trim() !== "" ? deadline : null;

await pool.query(
  `INSERT INTO jobs (created_at, title, company, location, job_type, salary_min, salary_max, deadline, description)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
  [createdAtUtc, title, company, location, jobType, salaryMin, salaryMax, deadlineValue, description]
);



    return NextResponse.json({ message: 'Job saved successfully!' }, { status: 200 });
  } catch (err) {
    console.error('Error saving job:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
