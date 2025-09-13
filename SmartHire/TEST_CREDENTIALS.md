# 🔑 SmartHire Test User Credentials

## Quick Reference Login Guide

### 🔐 **Super Admin Access**
```
Email: superadmin@smarthire.com
Password: password123
Role: Super Admin
Access: Full platform control, subscription management, analytics
```

### 🏢 **Company Admin Access**

#### TechCorp Inc (Professional Plan)
```
Email: admin@techcorp.com
Password: password123
Role: Company Admin
Company: TechCorp Inc
Features: Advanced AI, API access, 10 HR users, 25 jobs
```

#### StartupXYZ (Basic Plan)
```
Email: admin@startupxyz.com
Password: password123
Role: Company Admin  
Company: StartupXYZ
Features: Basic AI, 3 HR users, 5 jobs
```

### 👥 **HR User Access**

#### TechCorp HR Team
```
HR Manager:
Email: hr1@techcorp.com
Password: password123
Name: Michael Brown
Assigned Jobs: Senior Full Stack Developer, Backend Java Developer

HR Recruiter:
Email: hr2@techcorp.com
Password: password123
Name: Emily Davis
Assigned Jobs: Frontend React Developer
```

#### StartupXYZ HR Team
```
Email: hr@startupxyz.com
Password: password123
Name: David Wilson
Assigned Jobs: DevOps Engineer
```

#### InnovateLabs HR Team
```
Email: recruiter@innovatelabs.com
Password: password123
Name: Lisa Anderson
Assigned Jobs: Data Scientist
Subscription: Enterprise Plan (Unlimited features)
```

## 🎯 **Testing Scenarios by Role**

### **Super Admin Testing**
1. **Platform Overview**: View 5 companies, 7 users, 3 subscription plans
2. **Analytics Dashboard**: See subscription distribution, candidate status charts
3. **Subscription Management**: Edit plans, create new tiers, manage pricing
4. **Activity Monitoring**: View platform-wide notifications and activity

### **Company Admin Testing**
1. **Team Management**: Oversee HR team performance
2. **Subscription Monitoring**: Track usage vs plan limits
3. **Job Management**: Approve and manage job postings
4. **Company Analytics**: View company-specific statistics

### **HR Testing**
1. **Candidate Management**: Review 7 sample candidates with varying match %
2. **AI Resume Analysis**: Test with candidates having 65%-92.5% match rates
3. **Interview Scheduling**: Candidates with "Interview Scheduled" status
4. **Report Generation**: View AI-generated match reports

## 📊 **Sample Data for Testing**

### **High-Match Candidates** (85%+ match)
- **Alex Thompson**: 92.5% match - Full Stack Developer
- **Maria Rodriguez**: 88% match - Frontend Developer
- **James Chen**: 85.5% match - DevOps Engineer

### **Medium-Match Candidates** (70-84% match)
- **Lisa Wong**: 82% match - Full Stack Developer
- **Sarah Kim**: 78.5% match - Data Scientist (Hired)
- **David Park**: 75.5% match - Frontend Developer

### **Low-Match Candidates** (Below 70% match)
- **Robert Johnson**: 65% match - Backend Developer (Not Selected)

### **Candidate Statuses for Testing**
- **Interview Scheduled**: Alex Thompson, David Park
- **Resume Reviewed**: Maria Rodriguez, Lisa Wong
- **Report Generated**: James Chen
- **Hired**: Sarah Kim
- **Not Selected**: Robert Johnson

### **Job Postings Available**
1. **Senior Full Stack Developer** (TechCorp) - 2 positions
2. **Frontend React Developer** (TechCorp) - 1 position
3. **DevOps Engineer** (StartupXYZ) - 1 position
4. **Data Scientist** (InnovateLabs) - 2 positions
5. **Backend Java Developer** (TechCorp) - 3 positions

## 🔄 **Workflow Testing Path**

### **Complete Hiring Workflow**
1. **Login as HR**: Use any HR credentials
2. **View Job Assignments**: See jobs assigned to your HR account
3. **Review Candidates**: Check candidates for your assigned jobs
4. **AI Analysis**: View match percentages and detailed reports
5. **Take Actions**: Schedule interviews, generate reports, update status

### **Administrative Workflow**
1. **Login as Company Admin**: Monitor team activities
2. **Login as Super Admin**: Manage platform-wide settings
3. **Switch Between Roles**: Test role-based access controls
4. **View Analytics**: Check different dashboard views per role

## 🚀 **Quick Start Instructions**

1. **Setup Database**: Follow SETUP_DATABASE.md guide
2. **Run Seed Script**: `npx tsx seed.ts` in server directory
3. **Start Application**: Frontend and backend servers
4. **Begin Testing**: Use any credentials above to login
5. **Explore Features**: Navigate through role-specific interfaces

## 📱 **Testing Checklist**

### ✅ **Authentication Testing**
- [ ] Super Admin login works
- [ ] Company Admin login works  
- [ ] HR login works
- [ ] Role-based navigation displays correctly
- [ ] Unauthorized access is blocked

### ✅ **Feature Testing**
- [ ] Dashboard displays correct data per role
- [ ] Candidate data shows properly
- [ ] Job assignments work correctly
- [ ] AI match percentages display
- [ ] Subscription data appears correctly

### ✅ **Data Integrity**
- [ ] All 7 users can login successfully
- [ ] 5 companies appear in system
- [ ] 7 candidates with proper match data
- [ ] 5 job postings are accessible
- [ ] Notifications and todos display

---

**All passwords are**: `password123`
**Total test accounts**: 7 users across 3 roles
**Sample data**: Realistic business scenarios with complete workflows