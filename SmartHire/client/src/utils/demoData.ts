// Demo data for HR dashboard
export const demoJobs = [
  {
    id: 1,
    jobTitle: "Frontend Developer",
    jobDescription: "Develop responsive web applications using React and TypeScript",
    companyId: 1,
    hrHandlingUserId: "hr-001",
    positionsCount: 3,
    positionsFilled: 1,
    jobStatus: "active",
    jobLocation: "San Francisco, CA",
    jobType: "Full-time",
    experienceRequired: "3+ years",
    skillsRequired: ["React", "TypeScript", "CSS", "HTML"],
    salaryRange: "$90,000 - $120,000",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15")
  },
  {
    id: 2,
    jobTitle: "Backend Engineer",
    jobDescription: "Design and implement scalable backend services using Node.js",
    companyId: 1,
    hrHandlingUserId: "hr-001",
    positionsCount: 2,
    positionsFilled: 0,
    jobStatus: "active",
    jobLocation: "Remote",
    jobType: "Full-time",
    experienceRequired: "5+ years",
    skillsRequired: ["Node.js", "Express", "MongoDB", "AWS"],
    salaryRange: "$110,000 - $140,000",
    createdAt: new Date("2023-02-20"),
    updatedAt: new Date("2023-02-20")
  },
  {
    id: 3,
    jobTitle: "UX Designer",
    jobDescription: "Create intuitive user experiences for web and mobile applications",
    companyId: 1,
    hrHandlingUserId: "hr-002",
    positionsCount: 1,
    positionsFilled: 0,
    jobStatus: "active",
    jobLocation: "New York, NY",
    jobType: "Full-time",
    experienceRequired: "4+ years",
    skillsRequired: ["Figma", "Sketch", "User Research", "Prototyping"],
    salaryRange: "$85,000 - $110,000",
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2023-03-10")
  },
  {
    id: 4,
    jobTitle: "Data Scientist",
    jobDescription: "Analyze complex datasets to drive business insights",
    companyId: 1,
    hrHandlingUserId: "hr-001",
    positionsCount: 2,
    positionsFilled: 1,
    jobStatus: "closed",
    jobLocation: "San Francisco, CA",
    jobType: "Full-time",
    experienceRequired: "5+ years",
    skillsRequired: ["Python", "Machine Learning", "SQL", "Statistics"],
    salaryRange: "$120,000 - $150,000",
    createdAt: new Date("2023-01-05"),
    updatedAt: new Date("2023-03-15")
  }
];

export const demoCandidates = [
  {
    id: 1,
    candidateName: "John Smith",
    email: "john.smith@email.com",
    jobId: 1,
    jobTitle: "Frontend Developer",
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
    },
    createdAt: new Date("2023-04-01"),
    updatedAt: new Date("2023-04-01")
  },
  {
    id: 2,
    candidateName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    jobId: 1,
    jobTitle: "Frontend Developer",
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
    },
    createdAt: new Date("2023-04-05"),
    updatedAt: new Date("2023-04-10")
  },
  {
    id: 3,
    candidateName: "Michael Brown",
    email: "michael.brown@email.com",
    jobId: 2,
    jobTitle: "Backend Engineer",
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
    },
    createdAt: new Date("2023-03-20"),
    updatedAt: new Date("2023-04-01")
  },
  {
    id: 4,
    candidateName: "Emily Davis",
    email: "emily.davis@email.com",
    jobId: 2,
    jobTitle: "Backend Engineer",
    candidateSkills: ["Python", "Django", "PostgreSQL", "Docker"],
    candidateExperience: 4,
    workExperience: "Backend Developer at DataCorp (3 years), Software Engineer at Startup (1 year)",
    projectExperience: "Data pipeline with Python, REST API with Django",
    portfolioLink: "https://github.com/emilydavis",
    matchPercentage: 78,
    resumeUrl: "/resumes/emily_davis.pdf",
    hrHandlingUserId: "hr-001",
    status: "report_generated",
    reportLink: "/reports/emily_davis.html",
    skillMatchBreakdown: {
      strengths: ["Strong Python and Django skills", "Database experience"],
      areasForImprovement: ["Limited cloud experience", "No JavaScript experience"]
    },
    createdAt: new Date("2023-04-08"),
    updatedAt: new Date("2023-04-12")
  },
  {
    id: 5,
    candidateName: "David Wilson",
    email: "david.wilson@email.com",
    jobId: 1,
    jobTitle: "Frontend Developer",
    candidateSkills: ["Vue.js", "JavaScript", "CSS", "HTML"],
    candidateExperience: 3,
    workExperience: "Frontend Developer at WebStudio (2 years), Junior Developer at Agency (1 year)",
    projectExperience: "E-commerce site with Vue.js, Admin dashboard with Vuex",
    portfolioLink: "https://github.com/davidwilson",
    matchPercentage: 72,
    resumeUrl: "/resumes/david_wilson.pdf",
    hrHandlingUserId: "hr-001",
    status: "not_selected",
    reportLink: "/reports/david_wilson.html",
    skillMatchBreakdown: {
      strengths: ["Good JavaScript skills", "Experience with CSS frameworks"],
      areasForImprovement: ["Limited React experience", "No TypeScript experience"]
    },
    createdAt: new Date("2023-04-03"),
    updatedAt: new Date("2023-04-15")
  }
];

export const demoNotifications = [
  {
    id: 1,
    userId: "hr-001",
    message: "New candidate Sarah Johnson matched for Frontend Developer position",
    readStatus: false,
    createdAt: new Date("2023-04-05")
  },
  {
    id: 2,
    userId: "hr-001",
    message: "Interview scheduled with John Smith for tomorrow at 10:00 AM",
    readStatus: false,
    createdAt: new Date("2023-04-10")
  },
  {
    id: 3,
    userId: "hr-001",
    message: "Candidate Michael Brown has been hired for Backend Engineer position",
    readStatus: true,
    createdAt: new Date("2023-04-01")
  },
  {
    id: 4,
    userId: "hr-002",
    message: "New job posting for UX Designer has been approved",
    readStatus: false,
    createdAt: new Date("2023-03-10")
  },
  {
    id: 5,
    userId: "hr-001",
    message: "Reminder: Review candidate resumes for Backend Engineer position",
    readStatus: false,
    createdAt: new Date("2023-04-08")
  }
];

export const demoTodos = [
  {
    id: 1,
    userId: "hr-001",
    title: "Review candidate resumes for Backend Engineer position",
    description: "Review 5 new resumes and provide feedback",
    isCompleted: false,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
  },
  {
    id: 2,
    userId: "hr-001",
    title: "Schedule interview with Sarah Johnson",
    description: "Coordinate with technical team for interview slot",
    isCompleted: false,
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 day from now
  },
  {
    id: 3,
    userId: "hr-001",
    title: "Follow up with Michael Brown on onboarding",
    description: "Send welcome package and setup initial meeting",
    isCompleted: true,
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: 4,
    userId: "hr-002",
    title: "Prepare job description for Senior UX Designer",
    description: "Create detailed job description with required skills",
    isCompleted: true,
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  }
];

export const demoChartData = [
  { month: 'Jan', opened: 12, filled: 8 },
  { month: 'Feb', opened: 15, filled: 10 },
  { month: 'Mar', opened: 18, filled: 14 },
  { month: 'Apr', opened: 22, filled: 16 },
  { month: 'May', opened: 25, filled: 20 },
  { month: 'Jun', opened: 28, filled: 22 },
];

// Function to initialize demo data in localStorage
export function initializeDemoData() {
  if (typeof window !== 'undefined') {
    // Check if demo data already exists
    if (!localStorage.getItem('demoJobs')) {
      localStorage.setItem('demoJobs', JSON.stringify(demoJobs));
    }
    
    if (!localStorage.getItem('demoCandidates')) {
      localStorage.setItem('demoCandidates', JSON.stringify(demoCandidates));
    }
    
    if (!localStorage.getItem('demoNotifications')) {
      localStorage.setItem('demoNotifications', JSON.stringify(demoNotifications));
    }
    
    if (!localStorage.getItem('demoTodos')) {
      localStorage.setItem('demoTodos', JSON.stringify(demoTodos));
    }
    
    if (!localStorage.getItem('demoChartData')) {
      localStorage.setItem('demoChartData', JSON.stringify(demoChartData));
    }
    
    // Set demo mode
    localStorage.setItem('demoMode', 'true');
    
    console.log('Demo data initialized');
  }
}

// Function to get demo data from localStorage
export function getDemoJobs() {
  if (typeof window !== 'undefined') {
    const jobs = localStorage.getItem('demoJobs');
    return jobs ? JSON.parse(jobs) : [];
  }
  return [];
}

export function getDemoCandidates() {
  if (typeof window !== 'undefined') {
    const candidates = localStorage.getItem('demoCandidates');
    return candidates ? JSON.parse(candidates) : [];
  }
  return [];
}

export function getDemoNotifications(userId: string) {
  if (typeof window !== 'undefined') {
    const notifications = localStorage.getItem('demoNotifications');
    const allNotifications = notifications ? JSON.parse(notifications) : [];
    return allNotifications.filter((n: any) => n.userId === userId);
  }
  return [];
}

export function getDemoTodos(userId: string) {
  if (typeof window !== 'undefined') {
    const todos = localStorage.getItem('demoTodos');
    const allTodos = todos ? JSON.parse(todos) : [];
    return allTodos.filter((t: any) => t.userId === userId);
  }
  return [];
}

export function getDemoChartData() {
  if (typeof window !== 'undefined') {
    const chartData = localStorage.getItem('demoChartData');
    return chartData ? JSON.parse(chartData) : [];
  }
  return [];
}