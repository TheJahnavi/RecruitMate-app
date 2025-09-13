import { db } from "./db";
import { users, companies, jobs, candidates, notifications, todos } from "../shared/schema";
import { storage } from "./storage";
import { eq } from "drizzle-orm";

async function seedDatabase() {
  console.log("Seeding database with dummy data...");
  
  try {
    // Create a company
    const [techCorp] = await db.insert(companies).values({
      companyName: "TechCorp Inc",
      companyDescription: "A leading technology company",
      subscriptionPlan: "Professional",
      subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      isActive: true
    }).returning();
    
    console.log("Created company:", techCorp);
    
    // Create HR users
    const hrUsers = [
      {
        id: "hr-001",
        email: "hr1@techcorp.com",
        name: "HR User 1",
        role: "HR",
        companyId: techCorp.id,
        accountStatus: "active"
      },
      {
        id: "hr-002",
        email: "hr2@techcorp.com",
        name: "HR User 2",
        role: "HR",
        companyId: techCorp.id,
        accountStatus: "active"
      },
      {
        id: "hr-003",
        email: "hr3@techcorp.com",
        name: "HR User 3",
        role: "HR",
        companyId: techCorp.id,
        accountStatus: "active"
      }
    ];
    
    for (const userData of hrUsers) {
      const user = await storage.createUser(userData);
      console.log("Created HR user:", user);
    }
    
    // Create jobs handled by HR users
    const jobData = [
      {
        jobTitle: "Frontend Developer",
        jobDescription: "Develop responsive web applications using React and TypeScript",
        companyId: techCorp.id,
        hrHandlingUserId: "hr-001",
        positionsCount: 3,
        positionsFilled: 1,
        jobStatus: "active",
        jobLocation: "San Francisco, CA",
        jobType: "Full-time",
        experienceRequired: "3+ years",
        skillsRequired: ["React", "TypeScript", "CSS", "HTML"],
        salaryRange: "$90,000 - $120,000"
      },
      {
        jobTitle: "Backend Engineer",
        jobDescription: "Design and implement scalable backend services using Node.js",
        companyId: techCorp.id,
        hrHandlingUserId: "hr-001",
        positionsCount: 2,
        positionsFilled: 0,
        jobStatus: "active",
        jobLocation: "Remote",
        jobType: "Full-time",
        experienceRequired: "5+ years",
        skillsRequired: ["Node.js", "Express", "MongoDB", "AWS"],
        salaryRange: "$110,000 - $140,000"
      },
      {
        jobTitle: "UX Designer",
        jobDescription: "Create intuitive user experiences for web and mobile applications",
        companyId: techCorp.id,
        hrHandlingUserId: "hr-002",
        positionsCount: 1,
        positionsFilled: 0,
        jobStatus: "active",
        jobLocation: "New York, NY",
        jobType: "Full-time",
        experienceRequired: "4+ years",
        skillsRequired: ["Figma", "Sketch", "User Research", "Prototyping"],
        salaryRange: "$85,000 - $110,000"
      }
    ];
    
    const createdJobs = [];
    for (const job of jobData) {
      const createdJob = await storage.createJob(job);
      createdJobs.push(createdJob);
      console.log("Created job:", createdJob);
    }
    
    // Create candidates
    const candidateData = [
      {
        candidateName: "John Smith",
        email: "john.smith@email.com",
        jobId: createdJobs[0].id,
        candidateSkills: ["React", "JavaScript", "CSS", "HTML"],
        candidateExperience: 4,
        workExperience: "Frontend Developer at WebCorp (2 years), Junior Developer at StartUp (2 years)",
        projectExperience: "E-commerce platform with React, Dashboard application with Redux",
        portfolioLink: "https://github.com/johnsmith",
        matchPercentage: 85,
        resumeUrl: "/resumes/john_smith.pdf",
        hrHandlingUserId: "hr-001",
        status: "resume_reviewed",
        reportLink: "/reports/john_smith.html",
        skillMatchBreakdown: {
          strengths: ["Strong React experience", "Good CSS skills"],
          areasForImprovement: ["Limited backend experience", "No TypeScript experience"]
        }
      },
      {
        candidateName: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        jobId: createdJobs[0].id,
        candidateSkills: ["React", "TypeScript", "Redux", "CSS"],
        candidateExperience: 5,
        workExperience: "Senior Frontend Developer at TechCorp (3 years), Developer at Agency (2 years)",
        projectExperience: "CRM application with React and TypeScript, Mobile app with React Native",
        portfolioLink: "https://github.com/sarahjohnson",
        matchPercentage: 92,
        resumeUrl: "/resumes/sarah_johnson.pdf",
        hrHandlingUserId: "hr-001",
        status: "interview_scheduled",
        reportLink: "/reports/sarah_johnson.html",
        interviewLink: "https://meet.google.com/abc-defg-hij",
        technicalPersonEmail: "tech.lead@techcorp.com",
        skillMatchBreakdown: {
          strengths: ["Expert in React and TypeScript", "Strong Redux experience"],
          areasForImprovement: ["Limited mobile development experience"]
        }
      },
      {
        candidateName: "Michael Brown",
        email: "michael.brown@email.com",
        jobId: createdJobs[1].id,
        candidateSkills: ["Node.js", "Express", "MongoDB", "AWS"],
        candidateExperience: 6,
        workExperience: "Backend Engineer at CloudTech (4 years), Developer at Startup (2 years)",
        projectExperience: "Microservices architecture with Node.js, Cloud deployment with AWS",
        portfolioLink: "https://github.com/michaelbrown",
        matchPercentage: 88,
        resumeUrl: "/resumes/michael_brown.pdf",
        hrHandlingUserId: "hr-001",
        status: "hired",
        reportLink: "/reports/michael_brown.html",
        skillMatchBreakdown: {
          strengths: ["Strong backend development skills", "Cloud experience with AWS"],
          areasForImprovement: ["Limited frontend experience"]
        }
      }
    ];
    
    for (const candidate of candidateData) {
      const createdCandidate = await storage.createCandidate(candidate);
      console.log("Created candidate:", createdCandidate);
    }
    
    // Create notifications
    const notificationData = [
      {
        userId: "hr-001",
        message: "New candidate Sarah Johnson matched for Frontend Developer position",
        readStatus: false
      },
      {
        userId: "hr-001",
        message: "Interview scheduled with John Smith for tomorrow at 10:00 AM",
        readStatus: false
      },
      {
        userId: "hr-002",
        message: "New job posting for UX Designer has been approved",
        readStatus: false
      }
    ];
    
    for (const notification of notificationData) {
      const createdNotification = await storage.createNotification(notification);
      console.log("Created notification:", createdNotification);
    }
    
    // Create todos
    const todoData = [
      {
        userId: "hr-001",
        title: "Review candidate resumes for Backend Engineer position",
        description: "Review 5 new resumes and provide feedback",
        isCompleted: false,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
      },
      {
        userId: "hr-001",
        title: "Schedule interview with Sarah Johnson",
        description: "Coordinate with technical team for interview slot",
        isCompleted: false,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 day from now
      },
      {
        userId: "hr-002",
        title: "Prepare job description for Senior UX Designer",
        description: "Create detailed job description with required skills",
        isCompleted: true,
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    ];
    
    for (const todo of todoData) {
      const createdTodo = await storage.createTodo(todo);
      console.log("Created todo:", createdTodo);
    }
    
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run the seed function
seedDatabase();
