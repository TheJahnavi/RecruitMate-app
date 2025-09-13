"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Edit,
  Trash2,
  Star,
  Check,
  Building2,
  Users,
  Briefcase,
  UserCheck,
  Zap,
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

interface PlanFormData {
  name: string;
  price: string;
  currency: string;
  billingPeriod: string;
  maxCompanies: string;
  maxHRUsers: string;
  maxJobPostings: string;
  maxCandidates: string;
  aiAnalysisLimit: string;
  features: string;
  isActive: boolean;
  isPopular: boolean;
}

const defaultPlans: SubscriptionPlan[] = [
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
    features: ["Basic AI Resume Analysis", "Email Support", "Standard Reports"],
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
    maxHRUsers: -1, // unlimited
    maxJobPostings: -1,
    maxCandidates: -1,
    aiAnalysisLimit: -1,
    features: [
      "Unlimited AI Analysis",
      "White-label Solution",
      "Dedicated Support",
      "Custom Integrations",
      "Advanced Analytics",
      "SSO Integration",
    ],
    isActive: true,
    isPopular: false,
  },
];

export default function SubscriptionManagement() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(defaultPlans);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState<PlanFormData>({
    name: "",
    price: "",
    currency: "USD",
    billingPeriod: "monthly",
    maxCompanies: "",
    maxHRUsers: "",
    maxJobPostings: "",
    maxCandidates: "",
    aiAnalysisLimit: "",
    features: "",
    isActive: true,
    isPopular: false,
  });

  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      currency: "USD",
      billingPeriod: "monthly",
      maxCompanies: "",
      maxHRUsers: "",
      maxJobPostings: "",
      maxCandidates: "",
      aiAnalysisLimit: "",
      features: "",
      isActive: true,
      isPopular: false,
    });
  };

  const handleAddPlan = () => {
    setEditingPlan(null);
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      currency: plan.currency,
      billingPeriod: plan.billingPeriod,
      maxCompanies: plan.maxCompanies === -1 ? "unlimited" : plan.maxCompanies.toString(),
      maxHRUsers: plan.maxHRUsers === -1 ? "unlimited" : plan.maxHRUsers.toString(),
      maxJobPostings: plan.maxJobPostings === -1 ? "unlimited" : plan.maxJobPostings.toString(),
      maxCandidates: plan.maxCandidates === -1 ? "unlimited" : plan.maxCandidates.toString(),
      aiAnalysisLimit: plan.aiAnalysisLimit === -1 ? "unlimited" : plan.aiAnalysisLimit.toString(),
      features: plan.features.join("\\n"),
      isActive: plan.isActive,
      isPopular: plan.isPopular,
    });
    setIsAddDialogOpen(true);
  };

  const handleSavePlan = () => {
    const parseValue = (value: string) => {
      return value.toLowerCase() === "unlimited" ? -1 : parseInt(value) || 0;
    };

    const newPlan: SubscriptionPlan = {
      id: editingPlan?.id || Date.now(),
      name: formData.name,
      price: parseFloat(formData.price) || 0,
      currency: formData.currency,
      billingPeriod: formData.billingPeriod,
      maxCompanies: parseValue(formData.maxCompanies),
      maxHRUsers: parseValue(formData.maxHRUsers),
      maxJobPostings: parseValue(formData.maxJobPostings),
      maxCandidates: parseValue(formData.maxCandidates),
      aiAnalysisLimit: parseValue(formData.aiAnalysisLimit),
      features: formData.features.split("\\n").filter(f => f.trim()),
      isActive: formData.isActive,
      isPopular: formData.isPopular,
    };

    if (editingPlan) {
      setPlans(prev => prev.map(p => p.id === editingPlan.id ? newPlan : p));
      toast({ title: "Plan updated successfully" });
    } else {
      setPlans(prev => [...prev, newPlan]);
      toast({ title: "Plan created successfully" });
    }

    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleDeletePlan = (planId: number) => {
    setPlans(prev => prev.filter(p => p.id !== planId));
    toast({ title: "Plan deleted successfully" });
  };

  const formatLimit = (value: number) => {
    return value === -1 ? "Unlimited" : value.toLocaleString();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground">Manage subscription plans and pricing</p>
        </div>
        <Button onClick={handleAddPlan}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Plan
        </Button>
      </div>

      {/* Subscription Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.isPopular ? "border-blue-500 shadow-lg" : ""}`}>
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/{plan.billingPeriod}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditPlan(plan)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Plan</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the {plan.name} plan? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeletePlan(plan.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Limits */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Companies
                  </span>
                  <span className="font-medium">{formatLimit(plan.maxCompanies)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    HR Users
                  </span>
                  <span className="font-medium">{formatLimit(plan.maxHRUsers)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Job Postings
                  </span>
                  <span className="font-medium">{formatLimit(plan.maxJobPostings)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    Candidates
                  </span>
                  <span className="font-medium">{formatLimit(plan.maxCandidates)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    AI Analysis
                  </span>
                  <span className="font-medium">{formatLimit(plan.aiAnalysisLimit)}/month</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Features:</h4>
                <ul className="space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-3 h-3 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Status */}
              <div className="mt-4 pt-4 border-t">
                <Badge variant={plan.isActive ? "default" : "secondary"}>
                  {plan.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Plan Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Edit Plan" : "Add New Plan"}</DialogTitle>
            <DialogDescription>
              {editingPlan ? "Update the subscription plan details" : "Create a new subscription plan"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Professional"
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="29.99"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div>
                <Label htmlFor="billingPeriod">Billing Period</Label>
                <select
                  id="billingPeriod"
                  value={formData.billingPeriod}
                  onChange={(e) => setFormData(prev => ({ ...prev, billingPeriod: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            {/* Limits */}
            <div className="space-y-4">
              <h4 className="font-medium">Plan Limits</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxCompanies">Max Companies</Label>
                  <Input
                    id="maxCompanies"
                    value={formData.maxCompanies}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxCompanies: e.target.value }))}
                    placeholder="1 or unlimited"
                  />
                </div>
                <div>
                  <Label htmlFor="maxHRUsers">Max HR Users</Label>
                  <Input
                    id="maxHRUsers"
                    value={formData.maxHRUsers}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxHRUsers: e.target.value }))}
                    placeholder="10 or unlimited"
                  />
                </div>
                <div>
                  <Label htmlFor="maxJobPostings">Max Job Postings</Label>
                  <Input
                    id="maxJobPostings"
                    value={formData.maxJobPostings}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxJobPostings: e.target.value }))}
                    placeholder="25 or unlimited"
                  />
                </div>
                <div>
                  <Label htmlFor="maxCandidates">Max Candidates</Label>
                  <Input
                    id="maxCandidates"
                    value={formData.maxCandidates}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxCandidates: e.target.value }))}
                    placeholder="100 or unlimited"
                  />
                </div>
                <div>
                  <Label htmlFor="aiAnalysisLimit">AI Analysis Limit (per month)</Label>
                  <Input
                    id="aiAnalysisLimit"
                    value={formData.aiAnalysisLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, aiAnalysisLimit: e.target.value }))}
                    placeholder="50 or unlimited"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                rows={4}
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked as boolean }))}
                />
                <Label htmlFor="isActive">Active Plan</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPopular"
                  checked={formData.isPopular}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPopular: checked as boolean }))}
                />
                <Label htmlFor="isPopular">Mark as Popular</Label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSavePlan}>
                {editingPlan ? "Update Plan" : "Create Plan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}