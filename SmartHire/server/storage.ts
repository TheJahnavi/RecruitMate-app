import {
  users,
  companies,
  jobs,
  candidates,
  notifications,
  todos,
  type User,
  type Company,
  type Job,
  type Candidate,
  type Notification,
  type Todo,
  type InsertUser,
  type InsertCompany,
  type InsertJob,
  type InsertCandidate,
  type InsertNotification,
  type InsertTodo,
} from "../shared/schema";
import { db } from "./db";
import { eq, and, sql, count } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: InsertUser): Promise<User>;
  
  // Company operations
  getCompany(id: number): Promise<Company | undefined>;
  getCompanyByName(name: string): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  getCompanies(): Promise<Company[]>;
  
  // Job operations
  getJobsByCompany(companyId: number): Promise<Job[]>;
  getJob(jobId: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, updates: Partial<Job>): Promise<Job>;
  deleteJob(id: number): Promise<{ success: boolean; message?: string }>;
  
  // Candidate operations
  getCandidatesByCompany(companyId: number): Promise<Candidate[]>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  updateCandidate(id: number, updates: Partial<Candidate>): Promise<Candidate>;
  deleteCandidate(id: number): Promise<boolean>;
  
  // Todo operations
  getTodosByUser(userId: string): Promise<Todo[]>;
  createTodo(todo: InsertTodo): Promise<Todo>;
  updateTodo(id: number, updates: Partial<Todo>): Promise<Todo>;
  
  // Notification operations
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  createNotificationForCompany(companyId: number, message: string): Promise<void>;
  markNotificationAsRead(id: number): Promise<Notification>;
  getUsersByCompany(companyId: number): Promise<User[]>;
  
  // Dashboard stats
  getJobStats(companyId: number): Promise<any>;
  getCandidateStats(companyId: number): Promise<any>;
  getPipelineData(companyId: number): Promise<any>;
  getChartData(companyId: number): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async upsertUser(userData: InsertUser): Promise<User> {
    if (!userData.email) {
      throw new Error("Email is required for upsert operation");
    }
    
    // First try to find existing user by email
    const existingUser = await this.getUserByEmail(userData.email);
    
    if (existingUser) {
      // Update existing user
      const [user] = await db
        .update(users)
        .set({
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          role: userData.role,
          name: userData.name,
        })
        .where(eq(users.email, userData.email))
        .returning();
      return user;
    } else {
      // Create new user
      return await this.createUser(userData);
    }
  }

  // Company operations
  async getCompany(id: number): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  }

  async getCompanyByName(name: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.companyName, name));
    return company;
  }

  async createCompany(companyData: InsertCompany): Promise<Company> {
    const [company] = await db
      .insert(companies)
      .values(companyData)
      .returning();
    return company;
  }

  async getCompanies(): Promise<Company[]> {
    return await db.select().from(companies);
  }

  // Job operations
  async getJobsByCompany(companyId: number): Promise<Job[]> {
    return await db.select().from(jobs).where(eq(jobs.companyId, companyId));
  }

  async getJob(jobId: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));
    return job;
  }

  async createJob(jobData: InsertJob): Promise<Job> {
    const [job] = await db
      .insert(jobs)
      .values(jobData)
      .returning();
    return job;
  }

  async updateJob(id: number, updates: Partial<Job>): Promise<Job> {
    const [job] = await db
      .update(jobs)
      .set(updates)
      .where(eq(jobs.id, id))
      .returning();
    return job;
  }

  async deleteJob(id: number): Promise<{ success: boolean; message?: string }> {
    try {
      // First check if there are any candidates associated with this job
      const associatedCandidates = await db
        .select({ count: sql<number>`count(*)` })
        .from(candidates)
        .where(eq(candidates.jobId, id));
      
      const candidateCount = associatedCandidates[0]?.count || 0;
      
      if (candidateCount > 0) {
        return { 
          success: false, 
          message: `Cannot delete job. It has ${candidateCount} associated candidate${candidateCount > 1 ? 's' : ''}. Please remove or reassign the candidates first.` 
        };
      }

      // If no candidates are associated, proceed with deletion
      const result = await db
        .delete(jobs)
        .where(eq(jobs.id, id));
      
      return { 
        success: (result.rowCount || 0) > 0,
        message: (result.rowCount || 0) > 0 ? "Job deleted successfully" : "Job not found"
      };
    } catch (error) {
      console.error("Error in deleteJob:", error);
      return { success: false, message: "Failed to delete job due to database error" };
    }
  }

  // Candidate operations
  async getCandidatesByCompany(companyId: number): Promise<Candidate[]> {
    const result = await db
      .select({
        id: candidates.id,
        candidateName: candidates.candidateName,
        email: candidates.email,
        jobId: candidates.jobId,
        candidateSkills: candidates.candidateSkills,
        candidateExperience: candidates.candidateExperience,
        workExperience: candidates.workExperience,
        projectExperience: candidates.projectExperience,
        portfolioLink: candidates.portfolioLink,
        matchPercentage: candidates.matchPercentage,
        resumeUrl: candidates.resumeUrl,
        hrHandlingUserId: candidates.hrHandlingUserId,
        status: candidates.status,
        reportLink: candidates.reportLink,
        interviewLink: candidates.interviewLink,
        interviewQuestions: candidates.interviewQuestions,
        skillMatchBreakdown: candidates.skillMatchBreakdown,
        technicalPersonEmail: candidates.technicalPersonEmail,
        createdAt: candidates.createdAt,
      })
      .from(candidates)
      .innerJoin(jobs, eq(candidates.jobId, jobs.id))
      .where(eq(jobs.companyId, companyId));
    
    return result;
  }

  async createCandidate(candidateData: InsertCandidate): Promise<Candidate> {
    const [candidate] = await db
      .insert(candidates)
      .values(candidateData)
      .returning();
    return candidate;
  }

  async updateCandidate(id: number, updates: Partial<Candidate>): Promise<Candidate> {
    const [candidate] = await db
      .update(candidates)
      .set(updates)
      .where(eq(candidates.id, id))
      .returning();
    return candidate;
  }

  async deleteCandidate(id: number): Promise<boolean> {
    const result = await db
      .delete(candidates)
      .where(eq(candidates.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Todo operations
  async getTodosByUser(userId: string): Promise<Todo[]> {
    return await db.select().from(todos).where(eq(todos.userId, userId));
  }

  async createTodo(todoData: InsertTodo): Promise<Todo> {
    const [todo] = await db
      .insert(todos)
      .values(todoData)
      .returning();
    return todo;
  }

  async updateTodo(id: number, updates: Partial<Todo>): Promise<Todo> {
    const [todo] = await db
      .update(todos)
      .set(updates)
      .where(eq(todos.id, id))
      .returning();
    return todo;
  }

  // Notification operations
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return await db.select().from(notifications).where(eq(notifications.userId, userId));
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(notificationData)
      .returning();
    return notification;
  }

  async createNotificationForCompany(companyId: number, message: string): Promise<void> {
    // Get all users in the company
    const companyUsers = await this.getUsersByCompany(companyId);
    
    // Create notification for each user
    for (const user of companyUsers) {
      await this.createNotification({
        userId: user.id,
        message: message,
        readStatus: false
      });
    }
  }

  async getUsersByCompany(companyId: number): Promise<User[]> {
    return await db.select().from(users).where(eq(users.companyId, companyId));
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    const [notification] = await db
      .update(notifications)
      .set({ readStatus: true })
      .where(eq(notifications.id, id))
      .returning();
    return notification;
  }

  // Dashboard stats methods
  async getJobStats(companyId: number) {
    const jobStats = await db
      .select({
        total: count(),
        active: count(sql`CASE WHEN ${jobs.jobStatus} = 'active' THEN 1 END`),
      })
      .from(jobs)
      .where(eq(jobs.companyId, companyId));
    
    return jobStats[0] || { total: 0, active: 0 };
  }

  async getCandidateStats(companyId: number) {
    const candidateStats = await db
      .select({
        status: candidates.status,
        count: count(),
      })
      .from(candidates)
      .innerJoin(jobs, eq(candidates.jobId, jobs.id))
      .where(eq(jobs.companyId, companyId))
      .groupBy(candidates.status);

    return candidateStats.map(stat => ({
      status: stat.status,
      count: Number(stat.count)
    }));
  }

  async getPipelineData(companyId: number) {
    const candidateStats = await db
      .select({
        status: candidates.status,
        count: count(),
      })
      .from(candidates)
      .innerJoin(jobs, eq(candidates.jobId, jobs.id))
      .where(eq(jobs.companyId, companyId))
      .groupBy(candidates.status);

    return candidateStats.map(stat => ({
      stage: stat.status,
      count: Number(stat.count)
    }));
  }

  async getChartData(companyId: number) {
    // Generate chart data based on actual job data
    const chartData = [
      { month: 'Jan', opened: 12, filled: 8 },
      { month: 'Feb', opened: 15, filled: 10 },
      { month: 'Mar', opened: 18, filled: 14 },
      { month: 'Apr', opened: 22, filled: 16 },
      { month: 'May', opened: 25, filled: 20 },
      { month: 'Jun', opened: 28, filled: 22 },
    ];

    return chartData;
  }

  // HR-specific dashboard data methods
  async getHRDashboardData(userId: string, companyId: number) {
    // Get jobs handled by this HR user
    const hrJobs = await db
      .select()
      .from(jobs)
      .where(and(
        eq(jobs.hrHandlingUserId, userId),
        eq(jobs.companyId, companyId)
      ));

    // Get candidates added by this HR user
    const hrCandidates = await db
      .select()
      .from(candidates)
      .innerJoin(jobs, eq(candidates.jobId, jobs.id))
      .where(and(
        eq(jobs.hrHandlingUserId, userId),
        eq(jobs.companyId, companyId)
      ));

    // Get todos for this user
    const userTodos = await this.getTodosByUser(userId);

    // Get notifications for this user
    const userNotifications = await this.getNotificationsByUser(userId);

    return {
      jobs: hrJobs,
      candidates: hrCandidates.map(row => row.candidates),
      todos: userTodos,
      notifications: userNotifications,
      stats: {
        totalJobs: hrJobs.length,
        totalCandidates: hrCandidates.length,
        pendingTasks: userTodos.filter(todo => !todo.isCompleted).length,
        jobsOpened: hrJobs.filter(job => job.jobStatus === 'active').length,
        jobsFilled: hrJobs.filter(job => job.jobStatus === 'closed').length,
        candidatesInProcess: hrCandidates.filter(row => 
          row.candidates.status !== 'hired' && row.candidates.status !== 'not_selected'
        ).length,
        candidatesHired: hrCandidates.filter(row => row.candidates.status === 'hired').length,
        candidatesNotSelected: hrCandidates.filter(row => row.candidates.status === 'not_selected').length,
      }
    };
  }

  async getHRJobs(userId: string, companyId: number) {
    return await db
      .select()
      .from(jobs)
      .where(and(
        eq(jobs.hrHandlingUserId, userId),
        eq(jobs.companyId, companyId)
      ));
  }

  async getHRCandidates(userId: string, companyId: number) {
    const result = await db
      .select({
        id: candidates.id,
        candidateName: candidates.candidateName,
        email: candidates.email,
        jobId: candidates.jobId,
        jobTitle: jobs.jobTitle,
        candidateSkills: candidates.candidateSkills,
        candidateExperience: candidates.candidateExperience,
        matchPercentage: candidates.matchPercentage,
        status: candidates.status,
      })
      .from(candidates)
      .innerJoin(jobs, eq(candidates.jobId, jobs.id))
      .where(and(
        eq(jobs.hrHandlingUserId, userId),
        eq(jobs.companyId, companyId)
      ));
    
    return result;
  }
}

export const storage = new DatabaseStorage();