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
  Calendar,
  Check,
  CreditCard,
  Star,
  Users,
  Briefcase,
  UserCheck,
  Zap,
  Crown,
  Package,
  Building2,
} from "lucide-react";

interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  currency: string;
  billingPeriod: string;
  maxCompanies: number;
  maxHRUsers: number;
  maxJobPostings: number;
  maxCandidates: number;
  aiAnalysisLimit: number;
  features: string[];
  isActive: boolean;
  isPopular: boolean;
}

interface CurrentSubscription {
  id: number;
  planName: string;
  status: "active" | "expired" | "cancelled";
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  usageStats: {
    hrUsersUsed: number;
    jobsPosted: number;
    candidatesAdded: number;
    aiAnalysisUsed: number;
  };
  planDetails: SubscriptionPlan;
}

const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 1,
    name: "Basic",
    price: 29,
    currency: "USD",
    billingPeriod: "monthly",
    maxCompanies: 1,
    maxHRUsers: 3,
    maxJobPostings: 5,
    maxCandidates: 50,
    aiAnalysisLimit: 25,
    features: [
      "Basic AI Resume Analysis",
      "Email Support",
      "Standard Reports",
      "Basic Job Posting",
      "Candidate Management"
    ],
    isActive: true,
    isPopular: false,
  },
  {
    id: 2,
    name: "Professional",
    price: 79,
    currency: "USD",
    billingPeriod: "monthly",
    maxCompanies: 1,
    maxHRUsers: 10,
    maxJobPostings: 25,
    maxCandidates: 250,
    aiAnalysisLimit: 100,
    features: [
      "Advanced AI Analysis",
      "Interview Questions Generation",
      "Priority Support",
      "Custom Reports",
      "API Access",
      "Advanced Analytics",
      "Bulk Operations"
    ],
    isActive: true,
    isPopular: true,
  },
  {
    id: 3,
    name: "Enterprise",
    price: 199,
    currency: "USD",
    billingPeriod: "monthly",
    maxCompanies: 5,
    maxHRUsers: -1, // Unlimited
    maxJobPostings: -1, // Unlimited
    maxCandidates: -1, // Unlimited
    aiAnalysisLimit: -1, // Unlimited
    features: [
      "Unlimited AI Analysis",
      "White-label Solution",
      "Dedicated Support",
      "Custom Integrations",
      "Advanced Analytics",
      "SSO Integration",
      "Multi-company Management",
      "Custom Workflows"
    ],
    isActive: true,
    isPopular: false,
  },
];

const mockCurrentSubscription: CurrentSubscription = {
  id: 1,
  planName: "Professional",
  status: "active",
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  autoRenew: true,
  usageStats: {
    hrUsersUsed: 5,
    jobsPosted: 12,
    candidatesAdded: 89,
    aiAnalysisUsed: 67,
  },
  planDetails: mockSubscriptionPlans[1], // Professional plan
};

export default function CompanyAdminSubscription() {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

  const formatLimit = (limit: number) => {
    return limit === -1 ? "Unlimited" : limit.toString();
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.round((used / limit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  const handleViewPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setUpgradeDialogOpen(true);
  };

  const daysUntilExpiry = () => {
    const today = new Date();
    const expiryDate = new Date(mockCurrentSubscription.endDate);
    const timeDiff = expiryDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">SmartHire</span>
              </div>
              <div className="ml-10 flex space-x-8">
                <a
                  href="/"
                  className="text-gray-500 hover:text-gray-700 px-1 pt-1 text-sm font-medium"
                >
                  Dashboard
                </a>
                <a
                  href="/company-admin/subscription"
                  className="text-blue-600 border-b-2 border-blue-600 px-1 pt-1 text-sm font-medium"
                >
                  Subscription
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-4">Company Admin - TechCorp Inc</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground">Manage your subscription plan and billing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Subscription */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Plan Card */}
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-blue-600" />
                Current Subscription - {mockCurrentSubscription.planName}
                {mockCurrentSubscription.planDetails.isPopular && (
                  <Badge className="bg-blue-100 text-blue-800">Most Popular</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Your active subscription plan details and usage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plan Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    ${mockCurrentSubscription.planDetails.price}
                  </div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {daysUntilExpiry()}
                  </div>
                  <div className="text-sm text-muted-foreground">days left</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-sm font-medium">Status</div>
                  <Badge 
                    variant={mockCurrentSubscription.status === "active" ? "default" : "destructive"}
                    className="mt-1"
                  >
                    {mockCurrentSubscription.status.charAt(0).toUpperCase() + 
                     mockCurrentSubscription.status.slice(1)}
                  </Badge>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-sm font-medium">Auto Renew</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {mockCurrentSubscription.autoRenew ? "Enabled" : "Disabled"}
                  </div>
                </div>
              </div>

              {/* Usage Statistics */}
              <div>
                <h3 className="font-semibold mb-4">Usage Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        HR Users
                      </span>
                      <span className="text-sm">
                        {mockCurrentSubscription.usageStats.hrUsersUsed} / {formatLimit(mockCurrentSubscription.planDetails.maxHRUsers)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          getUsagePercentage(mockCurrentSubscription.usageStats.hrUsersUsed, mockCurrentSubscription.planDetails.maxHRUsers) >= 90
                            ? "bg-red-600" 
                            : getUsagePercentage(mockCurrentSubscription.usageStats.hrUsersUsed, mockCurrentSubscription.planDetails.maxHRUsers) >= 70
                            ? "bg-yellow-600"
                            : "bg-green-600"
                        }`}
                        style={{ 
                          width: `${Math.min(100, getUsagePercentage(mockCurrentSubscription.usageStats.hrUsersUsed, mockCurrentSubscription.planDetails.maxHRUsers))}%` 
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Job Postings
                      </span>
                      <span className="text-sm">
                        {mockCurrentSubscription.usageStats.jobsPosted} / {formatLimit(mockCurrentSubscription.planDetails.maxJobPostings)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          getUsagePercentage(mockCurrentSubscription.usageStats.jobsPosted, mockCurrentSubscription.planDetails.maxJobPostings) >= 90
                            ? "bg-red-600" 
                            : getUsagePercentage(mockCurrentSubscription.usageStats.jobsPosted, mockCurrentSubscription.planDetails.maxJobPostings) >= 70
                            ? "bg-yellow-600"
                            : "bg-green-600"
                        }`}
                        style={{ 
                          width: `${Math.min(100, getUsagePercentage(mockCurrentSubscription.usageStats.jobsPosted, mockCurrentSubscription.planDetails.maxJobPostings))}%` 
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        Candidates
                      </span>
                      <span className="text-sm">
                        {mockCurrentSubscription.usageStats.candidatesAdded} / {formatLimit(mockCurrentSubscription.planDetails.maxCandidates)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          getUsagePercentage(mockCurrentSubscription.usageStats.candidatesAdded, mockCurrentSubscription.planDetails.maxCandidates) >= 90
                            ? "bg-red-600" 
                            : getUsagePercentage(mockCurrentSubscription.usageStats.candidatesAdded, mockCurrentSubscription.planDetails.maxCandidates) >= 70
                            ? "bg-yellow-600"
                            : "bg-green-600"
                        }`}
                        style={{ 
                          width: `${Math.min(100, getUsagePercentage(mockCurrentSubscription.usageStats.candidatesAdded, mockCurrentSubscription.planDetails.maxCandidates))}%` 
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        AI Analysis
                      </span>
                      <span className="text-sm">
                        {mockCurrentSubscription.usageStats.aiAnalysisUsed} / {formatLimit(mockCurrentSubscription.planDetails.aiAnalysisLimit)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          getUsagePercentage(mockCurrentSubscription.usageStats.aiAnalysisUsed, mockCurrentSubscription.planDetails.aiAnalysisLimit) >= 90
                            ? "bg-red-600" 
                            : getUsagePercentage(mockCurrentSubscription.usageStats.aiAnalysisUsed, mockCurrentSubscription.planDetails.aiAnalysisLimit) >= 70
                            ? "bg-yellow-600"
                            : "bg-green-600"
                        }`}
                        style={{ 
                          width: `${Math.min(100, getUsagePercentage(mockCurrentSubscription.usageStats.aiAnalysisUsed, mockCurrentSubscription.planDetails.aiAnalysisLimit))}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Plan Features */}
              <div>
                <h3 className="font-semibold mb-3">Current Plan Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {mockCurrentSubscription.planDetails.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing Info */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Billing Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Start Date:</span>
                    <span>{new Date(mockCurrentSubscription.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>End Date:</span>
                    <span>{new Date(mockCurrentSubscription.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Billing:</span>
                    <span>${mockCurrentSubscription.planDetails.price} on {new Date(mockCurrentSubscription.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Plans */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Available Plans
              </CardTitle>
              <CardDescription>
                Explore other subscription options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockSubscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    plan.name === mockCurrentSubscription.planName
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleViewPlan(plan)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      {plan.name}
                      {plan.isPopular && (
                        <Star className="h-4 w-4 text-yellow-500" />
                      )}
                    </h3>
                    {plan.name === mockCurrentSubscription.planName && (
                      <Badge variant="default">Current</Badge>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{plan.billingPeriod}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>HR Users: {formatLimit(plan.maxHRUsers)}</div>
                    <div>Job Posts: {formatLimit(plan.maxJobPostings)}</div>
                    <div>Candidates: {formatLimit(plan.maxCandidates)}</div>
                    <div>AI Analysis: {formatLimit(plan.aiAnalysisLimit)}/month</div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={() => handleViewPlan(plan)}
                  >
                    {plan.name === mockCurrentSubscription.planName ? "View Current Plan" : "View Details"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Plan Details Dialog */}
      <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {selectedPlan?.name} Plan Details
              {selectedPlan?.isPopular && (
                <Badge className="bg-yellow-100 text-yellow-800">Most Popular</Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Detailed information about the {selectedPlan?.name} subscription plan
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-6">
              {/* Pricing */}
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  ${selectedPlan.price}
                </div>
                <div className="text-muted-foreground">
                  per {selectedPlan.billingPeriod}
                </div>
              </div>

              {/* Limits */}
              <div>
                <h3 className="font-semibold mb-3">Plan Limits</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      {formatLimit(selectedPlan.maxHRUsers)} HR Users
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      {formatLimit(selectedPlan.maxJobPostings)} Job Postings
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">
                      {formatLimit(selectedPlan.maxCandidates)} Candidates
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">
                      {formatLimit(selectedPlan.aiAnalysisLimit)} AI Analysis/month
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold mb-3">Features Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {selectedPlan.name === mockCurrentSubscription.planName ? (
                  <Button className="flex-1" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      // Handle upgrade logic
                      console.log("Contact admin for plan change:", selectedPlan.name);
                      setUpgradeDialogOpen(false);
                    }}
                  >
                    Contact Admin for Upgrade
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => setUpgradeDialogOpen(false)}
                >
                  Close
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                * Plan changes require Super Admin approval and may involve billing adjustments
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}