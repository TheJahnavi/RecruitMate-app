"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Building2,
  Users,
  Briefcase,
  UserCheck,
  Calendar,
  TrendingUp,
  Eye,
  Bell,
  BellRing,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import Layout from "../components/Layout";

interface CompanyDashboardStats {
  totalHRUsers: number;
  activeJobPostings: number;
  totalCandidates: number;
  candidatesHired: number;
  jobStats: {
    active: number;
    filled: number;
    pending: number;
  };
  candidateStats: {
    status: string;
    count: number;
    color: string;
  }[];
  monthlyTrends: {
    month: string;
    applications: number;
    hired: number;
  }[];
}

interface HRUser {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  lastLogin: string;
  jobsAssigned: number;
  candidatesManaged: number;
}

interface JobPosting {
  id: number;
  title: string;
  status: "active" | "filled" | "paused";
  applicants: number;
  hired: number;
  postedDate: string;
  hrAssigned: string;
}

interface Notification {
  id: string;
  type: "job" | "candidate" | "system";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

const COLORS = {
  primary: "#1E88E5",
  secondary: "#43A047",
  tertiary: "#FB8C00",
  danger: "#E53E3E",
  warning: "#ED8936",
  success: "#38A169",
  info: "#3182CE",
};

export default function CompanyAdminDashboard() {
  const [hrDialogOpen, setHrDialogOpen] = useState(false);
  const [jobsDialogOpen, setJobsDialogOpen] = useState(false);

  // Mock company data (would come from API based on logged-in company admin)
  const companyName = "TechCorp Inc";
  
  const mockStats: CompanyDashboardStats = {
    totalHRUsers: 5,
    activeJobPostings: 12,
    totalCandidates: 89,
    candidatesHired: 23,
    jobStats: {
      active: 12,
      filled: 8,
      pending: 3,
    },
    candidateStats: [
      { status: "Resume Reviewed", count: 34, color: COLORS.info },
      { status: "Interview Scheduled", count: 18, color: COLORS.warning },
      { status: "Interview Completed", count: 25, color: COLORS.tertiary },
      { status: "Hired", count: 23, color: COLORS.success },
      { status: "Rejected", count: 15, color: COLORS.danger },
    ],
    monthlyTrends: [
      { month: "Jan", applications: 45, hired: 8 },
      { month: "Feb", applications: 52, hired: 12 },
      { month: "Mar", applications: 38, hired: 9 },
      { month: "Apr", applications: 61, hired: 15 },
      { month: "May", applications: 43, hired: 11 },
      { month: "Jun", applications: 56, hired: 18 },
    ],
  };

  const mockHRUsers: HRUser[] = [
    {
      id: "hr-1",
      name: "Michael Brown",
      email: "hr1@techcorp.com",
      status: "active",
      lastLogin: "2024-01-15 10:30 AM",
      jobsAssigned: 4,
      candidatesManaged: 28,
    },
    {
      id: "hr-2",
      name: "Emily Davis",
      email: "hr2@techcorp.com",
      status: "active",
      lastLogin: "2024-01-15 09:15 AM",
      jobsAssigned: 3,
      candidatesManaged: 22,
    },
    {
      id: "hr-3",
      name: "Sarah Wilson",
      email: "hr3@techcorp.com",
      status: "inactive",
      lastLogin: "2024-01-10 02:45 PM",
      jobsAssigned: 2,
      candidatesManaged: 15,
    },
  ];

  const mockJobPostings: JobPosting[] = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      status: "active",
      applicants: 25,
      hired: 2,
      postedDate: "2024-01-08",
      hrAssigned: "Michael Brown",
    },
    {
      id: 2,
      title: "Frontend React Developer",
      status: "active",
      applicants: 18,
      hired: 1,
      postedDate: "2024-01-12",
      hrAssigned: "Emily Davis",
    },
    {
      id: 3,
      title: "Backend Java Developer",
      status: "filled",
      applicants: 22,
      hired: 3,
      postedDate: "2024-01-05",
      hrAssigned: "Michael Brown",
    },
    {
      id: 4,
      title: "DevOps Engineer",
      status: "active",
      applicants: 15,
      hired: 0,
      postedDate: "2024-01-14",
      hrAssigned: "Sarah Wilson",
    },
  ];

  const mockNotifications: Notification[] = [
    {
      id: "1",
      type: "candidate",
      title: "New Application",
      message: "Alex Thompson applied for Senior Full Stack Developer",
      timestamp: "2 hours ago",
      isRead: false,
    },
    {
      id: "2",
      type: "job",
      title: "Job Position Filled",
      message: "Backend Java Developer position has been filled",
      timestamp: "5 hours ago",
      isRead: false,
    },
    {
      id: "3",
      type: "system",
      title: "HR User Login",
      message: "Emily Davis logged in to the system",
      timestamp: "1 day ago",
      isRead: true,
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      filled: "secondary",
      paused: "destructive",
      inactive: "destructive",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Company Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome to {companyName} dashboard
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">HR Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalHRUsers}</div>
                <p className="text-xs text-muted-foreground">Active team members</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.activeJobPostings}</div>
                <p className="text-xs text-muted-foreground">Open positions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalCandidates}</div>
                <p className="text-xs text-muted-foreground">In pipeline</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Candidates Hired</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.candidatesHired}</div>
                <p className="text-xs text-muted-foreground">This quarter</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Candidate Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Candidate Status Distribution</CardTitle>
                <CardDescription>Distribution of candidates across different stages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockStats.candidateStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ status, count }) => `${status}: ${count}`}
                      >
                        {mockStats.candidateStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Applications and hires over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockStats.monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="applications" fill={COLORS.primary} name="Applications" />
                      <Bar dataKey="hired" fill={COLORS.secondary} name="Hired" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* HR Team Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>HR Team</CardTitle>
                    <CardDescription>Your HR team members</CardDescription>
                  </div>
                  <Button onClick={() => setHrDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add HR User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockHRUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.status === "active" ? "default" : "secondary"}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Job Postings Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Job Postings</CardTitle>
                    <CardDescription>Current job openings</CardDescription>
                  </div>
                  <Button onClick={() => setJobsDialogOpen(true)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View All Jobs
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applicants</TableHead>
                      <TableHead>Hired</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockJobPostings.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={job.status === "active" ? "default" : job.status === "filled" ? "secondary" : "outline"}
                          >
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{job.applicants}</TableCell>
                        <TableCell>{job.hired}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* HR Users Dialog */}
        <Dialog open={hrDialogOpen} onOpenChange={setHrDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>HR Team Members</DialogTitle>
              <DialogDescription>Manage your HR team</DialogDescription>
            </DialogHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Jobs Assigned</TableHead>
                  <TableHead>Candidates Managed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockHRUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === "active" ? "default" : "secondary"}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell>{user.jobsAssigned}</TableCell>
                    <TableCell>{user.candidatesManaged}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>

        {/* Jobs Dialog */}
        <Dialog open={jobsDialogOpen} onOpenChange={setJobsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>All Job Postings</DialogTitle>
              <DialogDescription>Complete list of job postings</DialogDescription>
            </DialogHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applicants</TableHead>
                  <TableHead>Hired</TableHead>
                  <TableHead>Posted Date</TableHead>
                  <TableHead>HR Assigned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockJobPostings.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={job.status === "active" ? "default" : job.status === "filled" ? "secondary" : "outline"}
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{job.applicants}</TableCell>
                    <TableCell>{job.hired}</TableCell>
                    <TableCell>{job.postedDate}</TableCell>
                    <TableCell>{job.hrAssigned}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
