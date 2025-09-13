"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import Layout from "../components/Layout";
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
  DialogTrigger,
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
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
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
  CreditCard,
  Bell,
  BellRing,
  Plus,
  Edit,
  Trash2,
  Eye,
  Briefcase,
  User,
} from "lucide-react";

interface Company {
  id: number;
  companyName: string;
  logoUrl?: string;
  adminEmail: string;
  adminName: string;
  subscriptionPlan: string;
  hrCount: number;
  jobPostings: number;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  totalCandidates: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "Company Admin" | "HR";
  status: "active" | "inactive";
  lastLogin?: string;
}

interface DashboardStats {
  totalCompanies: number;
  totalHRAccounts: number;
  totalSubscriptions: number;
  subscriptionBreakdown: {
    name: string;
    count: number;
    value: number;
    color: string;
  }[];
  candidateStats: {
    status: string;
    count: number;
    color: string;
  }[];
  jobStats: {
    openings: number;
    hired: number;
    waiting: number;
  };
}

interface Notification {
  id: string;
  type: "account" | "job" | "subscription" | "candidate";
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

export default function SuperAdminDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [newCompanyForm, setNewCompanyForm] = useState({
    companyName: "",
    adminName: "",
    adminEmail: "",
    subscriptionPlan: "",
    logoUrl: "",
  });

  // Mock company data
  const mockCompanies: Company[] = [
    {
      id: 1,
      companyName: "TechCorp Inc",
      logoUrl: "https://via.placeholder.com/150x150/1E88E5/FFFFFF?text=TC",
      adminEmail: "admin@techcorp.com",
      adminName: "John Smith",
      subscriptionPlan: "Professional",
      hrCount: 5,
      jobPostings: 12,
      status: "active",
      createdAt: "2024-01-15",
      totalCandidates: 156,
    },
    {
      id: 2,
      companyName: "StartupXYZ",
      logoUrl: "https://via.placeholder.com/150x150/43A047/FFFFFF?text=SX",
      adminEmail: "admin@startupxyz.com",
      adminName: "Sarah Johnson",
      subscriptionPlan: "Basic",
      hrCount: 2,
      jobPostings: 3,
      status: "active",
      createdAt: "2024-02-01",
      totalCandidates: 45,
    },
    {
      id: 3,
      companyName: "InnovateLabs",
      logoUrl: "https://via.placeholder.com/150x150/FB8C00/FFFFFF?text=IL",
      adminEmail: "admin@innovatelabs.com",
      adminName: "Michael Chen",
      subscriptionPlan: "Enterprise",
      hrCount: 15,
      jobPostings: 25,
      status: "active",
      createdAt: "2023-12-10",
      totalCandidates: 320,
    },
    {
      id: 4,
      companyName: "DataSolutions Co",
      logoUrl: "https://via.placeholder.com/150x150/8E24AA/FFFFFF?text=DS",
      adminEmail: "admin@datasolutions.com",
      adminName: "Emily Rodriguez",
      subscriptionPlan: "Professional",
      hrCount: 8,
      jobPostings: 18,
      status: "active",
      createdAt: "2024-01-20",
      totalCandidates: 210,
    },
    {
      id: 5,
      companyName: "CloudTech Systems",
      logoUrl: "https://via.placeholder.com/150x150/E53E3E/FFFFFF?text=CT",
      adminEmail: "admin@cloudtech.com",
      adminName: "David Wilson",
      subscriptionPlan: "Basic",
      hrCount: 3,
      jobPostings: 6,
      status: "inactive",
      createdAt: "2024-03-01",
      totalCandidates: 78,
    },
  ];

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setEditMode(false);
    setNewCompanyForm({
      companyName: "",
      adminName: "",
      adminEmail: "",
      subscriptionPlan: "",
      logoUrl: "",
    });
    setCompanyDialogOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setEditMode(true);
    setNewCompanyForm({
      companyName: company.companyName,
      adminName: company.adminName,
      adminEmail: company.adminEmail,
      subscriptionPlan: company.subscriptionPlan,
      logoUrl: company.logoUrl || "",
    });
    setCompanyDialogOpen(true);
  };

  const handleSaveCompany = () => {
    // Here you would normally make an API call to save the company
    console.log("Saving company:", newCompanyForm);
    setCompanyDialogOpen(false);
    // Reset form
    setNewCompanyForm({
      companyName: "",
      adminName: "",
      adminEmail: "",
      subscriptionPlan: "",
      logoUrl: "",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      inactive: "secondary",
      suspended: "destructive",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Mock data for demo
  const mockStats: DashboardStats = {
    totalCompanies: mockCompanies.length,
    totalHRAccounts: mockCompanies.reduce((sum, company) => sum + company.hrCount, 0),
    totalSubscriptions: mockCompanies.filter(c => c.status === "active").length,
    subscriptionBreakdown: [
      { name: "Basic", count: 15, value: 15, color: COLORS.info },
      { name: "Professional", count: 18, value: 18, color: COLORS.primary },
      { name: "Enterprise", count: 5, value: 5, color: COLORS.secondary },
    ],
    candidateStats: [
      { status: "Resume Reviewed", count: 234, color: COLORS.info },
      { status: "Interview Scheduled", count: 89, color: COLORS.warning },
      { status: "Report Generated", count: 156, color: COLORS.tertiary },
      { status: "Hired", count: 67, color: COLORS.success },
      { status: "Not Selected", count: 143, color: COLORS.danger },
    ],
    jobStats: {
      openings: 89,
      hired: 67,
      waiting: 145,
    },
  };

  const mockNotifications: Notification[] = [
    {
      id: "1",
      type: "account",
      title: "New Company Account",
      message: "TechCorp Inc. registered with Professional plan",
      timestamp: "2 hours ago",
      isRead: false,
    },
    {
      id: "2",
      type: "job",
      title: "Job Posted",
      message: "Senior Developer position opened",
      timestamp: "4 hours ago",
      isRead: false,
    },
    {
      id: "3",
      type: "subscription",
      title: "Subscription Upgrade",
      message: "ABC Corp upgraded to Enterprise",
      timestamp: "1 day ago",
      isRead: true,
    },
  ];

  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Super Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Platform overview and management
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalCompanies}</div>
                <p className="text-xs text-muted-foreground">Active companies</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">HR Accounts</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalHRAccounts}</div>
                <p className="text-xs text-muted-foreground">Total HR users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalSubscriptions}</div>
                <p className="text-xs text-muted-foreground">Active subscriptions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">Pending alerts</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Subscription Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription Distribution</CardTitle>
                <CardDescription>Breakdown of companies by subscription plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockStats.subscriptionBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, count }) => `${name}: ${count}`}
                      >
                        {mockStats.subscriptionBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Candidate Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Candidate Statistics</CardTitle>
                <CardDescription>Overview of candidate pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockStats.candidateStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill={COLORS.primary} name="Candidates" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Companies Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Companies</CardTitle>
                    <CardDescription>Registered companies on the platform</CardDescription>
                  </div>
                  <Button onClick={() => setCompanyDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Company
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCompanies.slice(0, 5).map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <img 
                              src={company.logoUrl} 
                              alt={company.companyName} 
                              className="w-8 h-8 rounded mr-2"
                            />
                            {company.companyName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{company.adminName}</div>
                          <div className="text-xs text-muted-foreground">{company.adminEmail}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{company.subscriptionPlan}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={company.status === "active" ? "default" : "secondary"}
                          >
                            {company.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedCompany(company);
                                setEditMode(true);
                                setCompanyDialogOpen(true);
                              }}
                            >
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
              </CardContent>
            </Card>

            {/* Recent Notifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Notifications</CardTitle>
                    <CardDescription>Latest platform alerts</CardDescription>
                  </div>
                  <Button variant="outline">
                    <BellRing className="mr-2 h-4 w-4" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockNotifications.slice(0, 5).map((notification) => (
                    <div 
                      key={notification.id} 
                      className="flex items-start p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className={`p-2 rounded-full mr-3 ${
                        notification.type === "account" ? "bg-blue-100 text-blue-600" :
                        notification.type === "job" ? "bg-green-100 text-green-600" :
                        notification.type === "subscription" ? "bg-purple-100 text-purple-600" :
                        "bg-orange-100 text-orange-600"
                      }`}>
                        {notification.type === "account" && <Users className="h-4 w-4" />}
                        {notification.type === "job" && <Briefcase className="h-4 w-4" />}
                        {notification.type === "subscription" && <CreditCard className="h-4 w-4" />}
                        {notification.type === "candidate" && <User className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-sm text-muted-foreground">{notification.message}</div>
                        <div className="text-xs text-muted-foreground mt-1">{notification.timestamp}</div>
                      </div>
                      {!notification.isRead && (
                        <Badge variant="destructive" className="h-2 w-2 p-0 rounded-full" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add/Edit Company Dialog */}
        <Dialog open={companyDialogOpen} onOpenChange={setCompanyDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editMode ? "Edit Company" : "Add New Company"}</DialogTitle>
              <DialogDescription>
                {editMode ? "Edit company details" : "Add a new company to the platform"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={newCompanyForm.companyName}
                  onChange={(e) => setNewCompanyForm({...newCompanyForm, companyName: e.target.value})}
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminName">Admin Name</Label>
                <Input
                  id="adminName"
                  value={newCompanyForm.adminName}
                  onChange={(e) => setNewCompanyForm({...newCompanyForm, adminName: e.target.value})}
                  placeholder="Enter admin name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={newCompanyForm.adminEmail}
                  onChange={(e) => setNewCompanyForm({...newCompanyForm, adminEmail: e.target.value})}
                  placeholder="Enter admin email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subscriptionPlan">Subscription Plan</Label>
                <Select 
                  value={newCompanyForm.subscriptionPlan}
                  onValueChange={(value) => setNewCompanyForm({...newCompanyForm, subscriptionPlan: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
                <Input
                  id="logoUrl"
                  value={newCompanyForm.logoUrl}
                  onChange={(e) => setNewCompanyForm({...newCompanyForm, logoUrl: e.target.value})}
                  placeholder="Enter logo URL"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setCompanyDialogOpen(false)}>
                  Cancel
                </Button>
                <Button>
                  {editMode ? "Update Company" : "Add Company"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}