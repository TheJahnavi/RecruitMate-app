// Script to set up the database with initial schema and data
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './shared/schema';
import { users, companies, jobs, candidates, notifications, todos } from './shared/schema';
import bcrypt from 'bcryptjs';

// Get database URL from environment variables
const databaseUrl = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_7Ral3qXEtoOb@ep-patient-queen-adkxp7ys-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

console.log('Setting up database with URL:', databaseUrl);

// Create connection pool
const pool = new Pool({ connectionString: databaseUrl });
const db = drizzle({ client: pool, schema });

async function setupDatabase() {
  try {
    console.log('Starting database setup...');
    
    // Create companies
    console.log('Creating companies...');
    const [techCorp] = await db.insert(companies).values({
      companyName: 'TechCorp Inc',
      companyDescription: 'A leading technology company',
      subscriptionPlan: 'Professional',
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    const [startupXYZ] = await db.insert(companies).values({
      companyName: 'StartupXYZ',
      companyDescription: 'An innovative startup',
      subscriptionPlan: 'Basic',
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    console.log('Companies created:', techCorp, startupXYZ);
    
    // Create users
    console.log('Creating users...');
    const [superAdmin] = await db.insert(users).values({
      id: 'sa-' + Date.now(),
      email: 'superadmin@smarthire.com',
      name: 'Super Admin User',
      passwordHash: await bcrypt.hash('password123', 10),
      role: 'Super Admin',
      accountStatus: 'active'
    }).returning();
    
    const [companyAdmin] = await db.insert(users).values({
      id: 'ca-' + Date.now(),
      email: 'admin@techcorp.com',
      name: 'TechCorp Admin',
      passwordHash: await bcrypt.hash('password123', 10),
      role: 'Company Admin',
      companyId: techCorp.id,
      accountStatus: 'active'
    }).returning();
    
    const [hr1] = await db.insert(users).values({
      id: 'hr1-' + Date.now(),
      email: 'hr1@techcorp.com',
      name: 'HR User 1',
      passwordHash: await bcrypt.hash('password123', 10),
      role: 'HR',
      companyId: techCorp.id,
      accountStatus: 'active'
    }).returning();
    
    const [hr2] = await db.insert(users).values({
      id: 'hr2-' + Date.now(),
      email: 'hr2@techcorp.com',
      name: 'HR User 2',
      passwordHash: await bcrypt.hash('password123', 10),
      role: 'HR',
      companyId: techCorp.id,
      accountStatus: 'active'
    }).returning();
    
    console.log('Users created:', superAdmin, companyAdmin, hr1, hr2);
    
    // Create jobs
    console.log('Creating jobs...');
    const [job1] = await db.insert(jobs).values({
      jobTitle: 'Frontend Developer',
      jobDescription: 'Develop responsive web applications using React and TypeScript',
      companyId: techCorp.id,
      hrHandlingUserId: hr1.id,
      positionsCount: 3,
      positionsFilled: 1,
      jobStatus: 'active',
      jobLocation: 'San Francisco, CA',
      jobType: 'Full-time',
      experienceRequired: '3+ years',
      skillsRequired: ['React', 'TypeScript', 'CSS', 'HTML'],
      salaryRange: '$90,000 - $120,000',
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-01-15')
    }).returning();
    
    const [job2] = await db.insert(jobs).values({
      jobTitle: 'Backend Engineer',
      jobDescription: 'Design and implement scalable backend services using Node.js',
      companyId: techCorp.id,
      hrHandlingUserId: hr1.id,
      positionsCount: 2,
      positionsFilled: 0,
      jobStatus: 'active',
      jobLocation: 'Remote',
      jobType: 'Full-time',
      experienceRequired: '5+ years',
      skillsRequired: ['Node.js', 'Express', 'MongoDB', 'AWS'],
      salaryRange: '$110,000 - $140,000',
      createdAt: new Date('2023-02-20'),
      updatedAt: new Date('2023-02-20')
    }).returning();
    
    const [job3] = await db.insert(jobs).values({
      jobTitle: 'UX Designer',
      jobDescription: 'Create intuitive user experiences for web and mobile applications',
      companyId: techCorp.id,
      hrHandlingUserId: hr2.id,
      positionsCount: 1,
      positionsFilled: 0,
      jobStatus: 'active',
      jobLocation: 'New York, NY',
      jobType: 'Full-time',
      experienceRequired: '4+ years',
      skillsRequired: ['Figma', 'Sketch', 'User Research', 'Prototyping'],
      salaryRange: '$85,000 - $110,000',
      createdAt: new Date('2023-03-10'),
      updatedAt: new Date('2023-03-10')
    }).returning();
    
    const [job4] = await db.insert(jobs).values({
      jobTitle: 'Data Scientist',
      jobDescription: 'Analyze complex datasets to drive business insights',
      companyId: techCorp.id,
      hrHandlingUserId: hr1.id,
      positionsCount: 2,
      positionsFilled: 1,
      jobStatus: 'closed',
      jobLocation: 'San Francisco, CA',
      jobType: 'Full-time',
      experienceRequired: '5+ years',
      skillsRequired: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
      salaryRange: '$120,000 - $150,000',
      createdAt: new Date('2023-01-05'),
      updatedAt: new Date('2023-03-15')
    }).returning();
    
    console.log('Jobs created:', job1, job2, job3, job4);
    
    // Create candidates
    console.log('Creating candidates...');
    const [candidate1] = await db.insert(candidates).values({
      candidateName: 'John Smith',
      email: 'john.smith@email.com',
      jobId: job1.id,
      candidateSkills: ['React', 'JavaScript', 'CSS', 'HTML'],
      candidateExperience: 4,
      workExperience: 'Frontend Developer at WebCorp (2 years), Junior Developer at StartUp (2 years)',
      projectExperience: 'E-commerce platform with React, Dashboard application with Redux',
      portfolioLink: 'https://github.com/johnsmith',
      matchPercentage: 85,
      resumeUrl: '/resumes/john_smith.pdf',
      hrHandlingUserId: hr1.id,
      status: 'resume_reviewed',
      reportLink: '/reports/john_smith.html',
      skillMatchBreakdown: JSON.stringify({
        strengths: ['Strong React experience', 'Good CSS skills'],
        areasForImprovement: ['Limited backend experience', 'No TypeScript experience']
      }),
      createdAt: new Date('2023-04-01'),
      updatedAt: new Date('2023-04-01')
    }).returning();
    
    const [candidate2] = await db.insert(candidates).values({
      candidateName: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      jobId: job1.id,
      candidateSkills: ['React', 'TypeScript', 'Redux', 'CSS'],
      candidateExperience: 5,
      workExperience: 'Senior Frontend Developer at TechCorp (3 years), Developer at Agency (2 years)',
      projectExperience: 'CRM application with React and TypeScript, Mobile app with React Native',
      portfolioLink: 'https://github.com/sarahjohnson',
      matchPercentage: 92,
      resumeUrl: '/resumes/sarah_johnson.pdf',
      hrHandlingUserId: hr1.id,
      status: 'interview_scheduled',
      reportLink: '/reports/sarah_johnson.html',
      interviewLink: 'https://meet.google.com/abc-defg-hij',
      technicalPersonEmail: 'tech.lead@techcorp.com',
      skillMatchBreakdown: JSON.stringify({
        strengths: ['Expert in React and TypeScript', 'Strong Redux experience'],
        areasForImprovement: ['Limited mobile development experience']
      }),
      createdAt: new Date('2023-04-05'),
      updatedAt: new Date('2023-04-10')
    }).returning();
    
    const [candidate3] = await db.insert(candidates).values({
      candidateName: 'Michael Brown',
      email: 'michael.brown@email.com',
      jobId: job2.id,
      candidateSkills: ['Node.js', 'Express', 'MongoDB', 'AWS'],
      candidateExperience: 6,
      workExperience: 'Backend Engineer at CloudTech (4 years), Developer at Startup (2 years)',
      projectExperience: 'Microservices architecture with Node.js, Cloud deployment with AWS',
      portfolioLink: 'https://github.com/michaelbrown',
      matchPercentage: 88,
      resumeUrl: '/resumes/michael_brown.pdf',
      hrHandlingUserId: hr1.id,
      status: 'hired',
      reportLink: '/reports/michael_brown.html',
      skillMatchBreakdown: JSON.stringify({
        strengths: ['Strong backend development skills', 'Cloud experience with AWS'],
        areasForImprovement: ['Limited frontend experience']
      }),
      createdAt: new Date('2023-03-20'),
      updatedAt: new Date('2023-04-01')
    }).returning();
    
    console.log('Candidates created:', candidate1, candidate2, candidate3);
    
    // Create notifications
    console.log('Creating notifications...');
    await db.insert(notifications).values({
      userId: hr1.id,
      message: 'New candidate Sarah Johnson matched for Frontend Developer position',
      readStatus: false,
      createdAt: new Date('2023-04-05')
    });
    
    await db.insert(notifications).values({
      userId: hr1.id,
      message: 'Interview scheduled with John Smith for tomorrow at 10:00 AM',
      readStatus: false,
      createdAt: new Date('2023-04-10')
    });
    
    await db.insert(notifications).values({
      userId: hr1.id,
      message: 'Candidate Michael Brown has been hired for Backend Engineer position',
      readStatus: true,
      createdAt: new Date('2023-04-01')
    });
    
    console.log('Notifications created');
    
    // Create todos
    console.log('Creating todos...');
    await db.insert(todos).values({
      userId: hr1.id,
      task: 'Review candidate resumes for Backend Engineer position',
      isCompleted: false
    });
    
    await db.insert(todos).values({
      userId: hr1.id,
      task: 'Schedule interview with Sarah Johnson',
      isCompleted: false
    });
    
    console.log('Todos created');
    
    console.log('Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();