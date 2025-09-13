"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
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
  TableHead,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Users, Briefcase, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { ErrorBoundary } from "../components/ErrorBoundary";
import { initializeDemoData, getDemoJobs, getDemoCandidates, getDemoChartData } from "../utils/demoData";

interface HRDashboardStats {
  totalJobs: number;
  totalCandidates: number;
  pendingTasks: number;
  jobsOpened: number;
  jobsFilled: number;
  candidatesInProcess: number;
  candidatesHired: number;
  candidatesNotSelected: number;
}

interface JobPosting {
  id: number;
  jobTitle: string;
  jobDescription: string;
  positionsCount: number;
  positionsFilled: number;
  jobStatus: string;
  candidates: number;
  hrHandlingUserId: string;
}

interface Candidate {
  id: number;
  candidateName: string;
  email: string;
  jobId: number;
  jobTitle: string;
  candidateSkills: string[];
  candidateExperience: number;
  matchPercentage: number;
  status: string;
}

export default function HRDashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [jobsDialogOpen, setJobsDialogOpen] = useState(false);
  const [candidatesDialogOpen, setCandidatesDialogOpen] = useState(false);

  console.log('HR Dashboard - Render started', { isAuthenticated, isLoading, user });

  // Initialize demo data on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeDemoData();
    }
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    console.log('HR Dashboard - Auth check effect', { isAuthenticated, isLoading });
    if (!isLoading && !isAuthenticated) {
      console.log('HR Dashboard - Not authenticated, redirecting to login');
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      // Use wouter's setLocation instead of window.location
      setTimeout(() => {
        setLocation("/login");
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast, setLocation]);

  // Fetch HR-specific dashboard data (demo mode)
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: async () => {
      console.log('Fetching dashboard stats...');
      
      // Check if we're in demo mode
      const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
      
      if (isDemoMode) {
        // Return demo data
        const demoJobs = getDemoJobs();
        const demoCandidates = getDemoCandidates();
        
        // Calculate stats based on demo data
        const stats = {
          totalJobs: demoJobs.length,
          totalCandidates: demoCandidates.length,
          pendingTasks: 0,
          jobsOpened: demoJobs.filter((job: any) => job.jobStatus === 'active').length,
          jobsFilled: demoJobs.filter((job: any) => job.jobStatus === 'closed').length,
          candidatesInProcess: demoCandidates.filter((candidate: any) => 
            candidate.status !== 'hired' && candidate.status !== 'not_selected').length,
          candidatesHired: demoCandidates.filter((candidate: any) => candidate.status === 'hired').length,
          candidatesNotSelected: demoCandidates.filter((candidate: any) => candidate.status === 'not_selected').length,
        };
        
        return { stats };
      }
      
      // In normal mode, make the API request
      const response = await apiRequest("/api/dashboard/stats", { method: "GET" });
      console.log('Dashboard stats response:', response);
      return response;
    },
    enabled: isAuthenticated,
    retry: false,
  });

  // Fetch jobs (filtered by company and user on backend or demo data)
  const { data: jobs = [], isLoading: jobsLoading, error: jobsError } = useQuery({
    queryKey: ["/api/jobs"],
    queryFn: async () => {
      console.log('Fetching jobs...');
      
      // Check if we're in demo mode
      const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
      
      if (isDemoMode) {
        // Return demo jobs filtered by HR user
        const demoJobs = getDemoJobs();
        const userJobs = demoJobs.filter((job: any) => job.hrHandlingUserId === user?.id);
        return userJobs;
      }
      
      // In normal mode, make the API request
      const response = await apiRequest("/api/jobs", { method: "GET" });
      console.log('Jobs response:', response);
      return response;
    },
    enabled: isAuthenticated,
    retry: false,
  });

  // Fetch candidates (filtered by company and user on backend or demo data)
  const { data: candidates = [], isLoading: candidatesLoading, error: candidatesError } = useQuery({
    queryKey: ["/api/candidates"],
    queryFn: async () => {
      console.log('Fetching candidates...');
      
      // Check if we're in demo mode
      const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
      
      if (isDemoMode) {
        // Return demo candidates filtered by HR user
        const demoCandidates = getDemoCandidates();
        const userCandidates = demoCandidates.filter((candidate: any) => candidate.hrHandlingUserId === user?.id);
        return userCandidates;
      }
      
      // In normal mode, make the API request
      const response = await apiRequest("/api/candidates", { method: "GET" });
      console.log('Candidates response:', response);
      return response;
    },
    enabled: isAuthenticated,
    retry: false,
  });

  // Log any errors
  useEffect(() => {
    if (dashboardError) console.error('Dashboard data error:', dashboardError);
    if (jobsError) console.error('Jobs data error:', jobsError);
    if (candidatesError) console.error('Candidates data error:', candidatesError);
  }, [dashboardError, jobsError, candidatesError]);

  // Fetch chart data (demo mode)
  const { data: chartData = [], isLoading: chartLoading, error: chartError } = useQuery({
    queryKey: ["/api/dashboard/chart-data"],
    queryFn: async () => {
      console.log('Fetching chart data...');
      
      // Check if we're in demo mode
      const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
      
      if (isDemoMode) {
        // Return demo chart data
        return getDemoChartData();
      }
      
      // In normal mode, make the API request
      const response = await apiRequest("/api/dashboard/chart-data", { method: "GET" });
      console.log('Chart data response:', response);
      return response;
    },
    enabled: isAuthenticated,
    retry: false,
  });

  // Log chart errors
  useEffect(() => {
    if (chartError) console.error('Chart data error:', chartError);
  }, [chartError]);

  // Show loading state
  if (isLoading || dashboardLoading || jobsLoading || candidatesLoading || chartLoading) {
    console.log('HR Dashboard - Loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state if not authenticated
  if (!isAuthenticated) {
    console.log('HR Dashboard - Not authenticated');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg text-foreground">You are not authenticated. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Show dashboard content
  console.log('HR Dashboard - Rendering content', { dashboardData, jobs, candidates, chartData });

  // Use dashboard data stats or fallback to calculated stats
  const stats = dashboardData?.stats || {
    totalJobs: jobs.length,
    totalCandidates: candidates.length,
    pendingTasks: 0,
    jobsOpened: jobs.filter((job: JobPosting) => job.jobStatus === 'active').length,
    jobsFilled: jobs.filter((job: JobPosting) => job.jobStatus === 'closed').length,
    candidatesInProcess: candidates.filter((candidate: Candidate) => 
      candidate.status !== 'hired' && candidate.status !== 'not_selected').length,
    candidatesHired: candidates.filter((candidate: Candidate) => candidate.status === 'hired').length,
    candidatesNotSelected: candidates.filter((candidate: Candidate) => candidate.status === 'not_selected').length,
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "filled":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "selected":
        return "bg-green-100 text-green-800";
      case "interview_scheduled":
        return "bg-blue-100 text-blue-800";
      case "interviewed":
        return "bg-purple-100 text-purple-800";
      case "applied":
        return "bg-gray-100 text-gray-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Prepare data for charts
  const jobStatusData = [
    { name: 'Active', value: stats?.jobsOpened || 0 },
    { name: 'Filled', value: stats?.jobsFilled || 0 },
    { name: 'In Process', value: stats?.candidatesInProcess || 0 },
  ];

  const candidateStatusData = candidates.reduce((acc: any[], candidate: Candidate) => {
    const existing = acc.find(item => item.name === candidate.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: candidate.status, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="min-h-screen bg-background">
      {/* Main content */}
      <div className="pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">HR Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user?.name || user?.email}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-pointer" onClick={() => setLocation('/hr/candidates')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                <Users className="h-4 w-4 text-blue-100" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCandidates}</div>
                <p className="text-xs text-blue-100">Candidates added by you</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white cursor-pointer" onClick={() => setLocation('/hr/jobs')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Job Positions</CardTitle>
                <Briefcase className="h-4 w-4 text-green-100" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalJobs}</div>
                <p className="text-xs text-green-100">Jobs you're handling</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white cursor-pointer" onClick={() => setLocation('/hr/candidates?filter=process')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Candidates in Process</CardTitle>
                <Clock className="h-4 w-4 text-purple-100" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.candidatesInProcess}</div>
                <p className="text-xs text-purple-100">Not hired or rejected</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Stacked Column Chart - Jobs Opened vs Filled */}
            <Card>
              <CardHeader>
                <CardTitle>Jobs Overview</CardTitle>
                <CardDescription>Jobs opened vs filled over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {chartLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading chart data...</p>
                  </div>
                ) : chartError ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Error loading chart data</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="opened" stackId="a" fill="#8884d8" name="Jobs Opened" />
                      <Bar dataKey="filled" stackId="a" fill="#82ca9d" name="Jobs Filled" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Funnel Chart - Hiring Pipeline */}
            <Card>
              <CardHeader>
                <CardTitle>Hiring Pipeline</CardTitle>
                <CardDescription>Candidate status distribution</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {chartLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading chart data...</p>
                  </div>
                ) : chartError ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Error loading chart data</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={candidateStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {candidateStatusData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bar Chart - Candidate Status Distribution */}
          <div className="grid grid-cols-1 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Status Distribution</CardTitle>
                <CardDescription>Number of candidates in each status</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {chartLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading chart data...</p>
                  </div>
                ) : chartError ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Error loading chart data</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={candidateStatusData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Candidates" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Jobs Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Job Postings</CardTitle>
                    <CardDescription>Current open positions</CardDescription>
                  </div>
                  <Button onClick={() => setJobsDialogOpen(true)}>View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Candidates</TableHead>
                      <TableHead>Positions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobsLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          Loading jobs...
                        </TableCell>
                      </TableRow>
                    ) : jobs.slice(0, 5).map((job: JobPosting) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.jobTitle}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={job.jobStatus === "active" ? "default" : job.jobStatus === "filled" ? "secondary" : "outline"}
                          >
                            {job.jobStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{job.candidates || 0}</TableCell>
                        <TableCell>{job.positionsFilled || 0}/{job.positionsCount || 1}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Candidates Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Candidates</CardTitle>
                    <CardDescription>Latest candidate applications</CardDescription>
                  </div>
                  <Button onClick={() => setCandidatesDialogOpen(true)}>View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Match %</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidatesLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          Loading candidates...
                        </TableCell>
                      </TableRow>
                    ) : candidates.slice(0, 5).map((candidate: Candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell className="font-medium">{candidate.candidateName}</TableCell>
                        <TableCell>{candidate.jobTitle || 'Unknown Position'}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={candidate.matchPercentage > 90 ? "default" : candidate.matchPercentage > 75 ? "secondary" : "outline"}
                          >
                            {candidate.matchPercentage || 0}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              candidate.status === "hired" ? "default" : 
                              candidate.status === "not_selected" ? "destructive" : 
                              candidate.status === "interview_scheduled" ? "secondary" : 
                              "outline"
                            }
                          >
                            {candidate.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

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
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Candidates</TableHead>
                  <TableHead>Positions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobsLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Loading jobs...
                    </TableCell>
                  </TableRow>
                ) : jobs.map((job: JobPosting) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.jobTitle}</TableCell>
                    <TableCell>{job.jobDescription || 'No description'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={job.jobStatus === "active" ? "default" : job.jobStatus === "filled" ? "secondary" : "outline"}
                      >
                        {job.jobStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{job.candidates || 0}</TableCell>
                    <TableCell>{job.positionsFilled || 0}/{job.positionsCount || 1}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>

        {/* Candidates Dialog */}
        <Dialog open={candidatesDialogOpen} onOpenChange={setCandidatesDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>All Candidates</DialogTitle>
              <DialogDescription>Complete list of candidates</DialogDescription>
            </DialogHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Match %</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidatesLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Loading candidates...
                    </TableCell>
                  </TableRow>
                ) : candidates.map((candidate: Candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">{candidate.candidateName}</TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>{candidate.jobTitle || 'Unknown Position'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {candidate.candidateSkills?.slice(0, 3).map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.candidateSkills?.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{candidate.candidateSkills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={candidate.matchPercentage > 90 ? "default" : candidate.matchPercentage > 75 ? "secondary" : "outline"}
                      >
                        {candidate.matchPercentage || 0}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          candidate.status === "hired" ? "default" : 
                          candidate.status === "not_selected" ? "destructive" : 
                          candidate.status === "interview_scheduled" ? "secondary" : 
                          "outline"
                        }
                      >
                        {candidate.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}