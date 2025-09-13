import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/use-toast";
import { isUnauthorizedError } from "../lib/authUtils";
import { apiRequest } from "../lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Plus, Search, Edit, Trash2, Briefcase, CheckCircle, FileText, XCircle } from "lucide-react";
import AddJobModal from "../components/AddJobModal";
import { initializeDemoData, getDemoJobs } from "../utils/demoData";

export default function Jobs() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hrFilter, setHrFilter] = useState("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Initialize demo data on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeDemoData();
    }
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: jobs = [], isLoading: jobsLoading, error } = useQuery<any[]>({
    queryKey: ["/api/jobs"],
    queryFn: async () => {
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
      return response;
    },
    enabled: isAuthenticated,
    retry: false,
  });

  // Mock HR users for filter
  const hrUsers = [
    { id: "hr-001", name: "HR User 1" },
    { id: "hr-002", name: "HR User 2" },
    { id: "hr-003", name: "HR User 3" },
  ];

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: number) => {
      // Check if we're in demo mode
      const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
      
      if (isDemoMode) {
        // In demo mode, just remove from localStorage
        const demoJobs = getDemoJobs();
        const updatedJobs = demoJobs.filter((job: any) => job.id !== jobId);
        localStorage.setItem('demoJobs', JSON.stringify(updatedJobs));
        return { success: true };
      }
      
      // In normal mode, make the API request
      await apiRequest(`/api/jobs/${jobId}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({
        title: "Success",
        description: "Job deleted successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
    },
  });

  const handleDeleteJob = (jobId: number) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      deleteJobMutation.mutate(jobId);
    }
  };

  const handleEditJob = (job: any) => {
    setEditingJob(job);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingJob(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>;
      case 'closed':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Closed</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredJobs = jobs?.filter((job: any) => {
    const matchesSearch = job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.jobDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.jobStatus === statusFilter;
    const matchesHr = hrFilter === "all" || job.hrHandlingUserId === hrFilter;
    
    return matchesSearch && matchesStatus && matchesHr;
  }) || [];

  if (isLoading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground" data-testid="page-title">Job Management</h1>
            <p className="text-muted-foreground mt-1">Create and manage job postings</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} data-testid="add-job-button" className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add New Job
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobs?.length || 0}</div>
              <p className="text-xs text-muted-foreground">All job postings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobs?.filter((job: any) => job.jobStatus === 'active').length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Currently open</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Jobs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobs?.filter((job: any) => job.jobStatus === 'draft').length || 0}
              </div>
              <p className="text-xs text-muted-foreground">In draft state</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Closed Jobs</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobs?.filter((job: any) => job.jobStatus === 'closed').length || 0}
              </div>
              <p className="text-xs text-muted-foreground">No longer accepting</p>
            </CardContent>
          </Card>
        </div>

        {/* Table Card */}
        <Card>
          {/* Table Controls */}
          <CardHeader className="border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 max-w-sm"
                  data-testid="search-input"
                />
              </div>
              
              {/* Filters */}
              <div className="flex space-x-3">
                {/* HR Handling User Filter */}
                <Select value={hrFilter} onValueChange={setHrFilter}>
                  <SelectTrigger className="w-[180px]" data-testid="hr-filter">
                    <SelectValue placeholder="All HR Users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All HR Users</SelectItem>
                    {hrUsers.map((hr) => (
                      <SelectItem key={hr.id} value={hr.id}>
                        {hr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Job Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]" data-testid="status-filter">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          {/* Jobs Table */}
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Added By</TableHead>
                    <TableHead>HR Handling</TableHead>
                    <TableHead>Job Description</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Positions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobsLoading ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">
                        Loading jobs...
                      </TableCell>
                    </TableRow>
                  ) : filteredJobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                        No jobs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredJobs.map((job: any) => (
                      <TableRow key={job.id} className="hover:bg-muted/50" data-testid={`job-row-${job.id}`}>
                        <TableCell className="font-medium">{job.jobTitle}</TableCell>
                        <TableCell>{job.id}</TableCell>
                        <TableCell>{job.addedByUserId || 'N/A'}</TableCell>
                        <TableCell>{job.hrHandlingUserId || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate">{job.jobDescription || 'No description'}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {job.skillsRequired?.slice(0, 3).map((skill: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {job.skillsRequired?.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{job.skillsRequired.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{job.experienceRequired || 'Not specified'}</TableCell>
                        <TableCell>{job.positionsCount || 1} positions</TableCell>
                        <TableCell>
                          {getStatusBadge(job.jobStatus)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditJob(job)}
                              data-testid={`edit-job-${job.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteJob(job.id)}
                              className="text-destructive hover:text-destructive"
                              data-testid={`delete-job-${job.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {filteredJobs.length > 0 && (
              <div className="px-6 py-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">{Math.min(filteredJobs.length, 10)}</span> of{" "}
                    <span className="font-medium">{filteredJobs.length}</span> results
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                      1
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Job Modal */}
        {showAddModal && (
          <AddJobModal
            job={editingJob}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}