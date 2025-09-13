# SmartHire Database Setup Guide

## 📋 Prerequisites

1. **PostgreSQL Database**: Ensure you have a PostgreSQL database running
2. **Environment Variables**: Set up your `.env` file with database connection
3. **Dependencies**: Install all required packages

## 🔧 Step 1: Environment Setup

Create a `.env` file in your server directory:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/smarthire"

# AI Configuration
GEMINI_API_KEY="your_gemini_api_key_here"

# Server Configuration
PORT=3000
```

## 📦 Step 2: Install Dependencies

```powershell
# Navigate to server directory
cd server

# Install dependencies
npm install

# Install additional required packages if not already installed
npm install bcryptjs drizzle-orm @google/generative-ai
```

## 🗄️ Step 3: Database Migration

Run the database migration to create all tables:

```powershell
# Generate and run migrations
npm run db:generate
npm run db:push
```

## 🌱 Step 4: Seed Database with Dummy Data

Run the seed script to populate your database:

```powershell
# Option 1: Run seed script directly
npx tsx seed.ts

# Option 2: If you have a seed command in package.json
npm run seed
```

## ✅ Step 5: Verify Data

After seeding, you should see this output:
```
✅ Database seeding completed successfully!
📊 Summary:
   - Companies: 5
   - Users: 7
   - Subscription Plans: 3
   - User Subscriptions: 3
   - Jobs: 5
   - Candidates: 7
   - Notifications: 10
   - ToDos: 12
```

## 🔑 Test Login Credentials

### Super Admin
- **Email**: superadmin@smarthire.com
- **Password**: password123

### Company Admins
- **TechCorp**: admin@techcorp.com / password123
- **StartupXYZ**: admin@startupxyz.com / password123

### HR Users
- **TechCorp HR1**: hr1@techcorp.com / password123
- **TechCorp HR2**: hr2@techcorp.com / password123
- **StartupXYZ HR**: hr@startupxyz.com / password123
- **InnovateLabs HR**: recruiter@innovatelabs.com / password123

## 🚀 Step 6: Start the Application

```powershell
# Start the backend server
npm run dev

# In another terminal, start the frontend
cd ../client
npm run dev
```

## 🔍 Testing Features

### Super Admin Features
1. Login with superadmin@smarthire.com
2. View platform statistics and charts
3. Manage subscription plans
4. Monitor company activity

### Company Admin Features  
1. Login with company admin credentials
2. Manage job postings
3. View team performance
4. Monitor subscription usage

### HR Features
1. Login with HR credentials
2. View assigned job postings
3. Review candidate applications
4. Use AI resume analysis tools

## 🎯 Sample Test Scenarios

### Resume Upload Testing
1. Login as HR user
2. Navigate to Upload page
3. Test AI agents with sample resumes
4. Review match percentages and reports

### Super Admin Testing
1. Login as Super Admin
2. View dashboard analytics
3. Create/edit subscription plans
4. Monitor platform activity

### Multi-Role Testing
1. Test login with different role types
2. Verify role-based navigation
3. Check permission restrictions
4. Test data visibility per role

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

### Seeding Errors
- Check for existing data conflicts
- Verify all dependencies are installed
- Ensure proper database permissions

### Login Issues
- Verify bcrypt is properly installed
- Check password hashing implementation
- Ensure user records exist in database

## 📝 Notes

- All passwords are hashed using bcrypt
- Dummy data includes realistic business scenarios
- Sample candidates have varying match percentages
- Notifications and todos provide workflow context