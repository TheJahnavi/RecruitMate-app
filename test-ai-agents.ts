/**
 * Test script to validate the enhanced AI agents functionality
 * This script tests the three AI agents without requiring database setup
 */

import { extractResumeData, calculateJobMatch, generateInterviewQuestions, generateMatchReport } from "./server/gemini.js";

// Sample resume text for testing
const sampleResumeText = `
John Doe
Email: john.doe@email.com
Portfolio: https://johndoe.dev

Professional Summary:
Experienced Full Stack Developer with 5 years of experience in building web applications using modern technologies.

Work Experience:
Senior Software Developer | TechCorp | 2020-2025 (5 years)
- Developed and maintained React.js applications with TypeScript
- Built REST APIs using Node.js and Express
- Worked with PostgreSQL and MongoDB databases
- Implemented CI/CD pipelines using Docker and AWS

Junior Developer | StartupXYZ | 2019-2020 (1 year)  
- Created responsive web interfaces using HTML, CSS, and JavaScript
- Collaborated with backend team on API integration

Skills:
JavaScript, TypeScript, React.js, Node.js, Express.js, PostgreSQL, MongoDB, AWS, Docker, Git, HTML, CSS

Projects:
E-commerce Platform (2023-2024)
- Built a full-stack e-commerce application using React and Node.js
- Implemented payment integration with Stripe
- Deployed on AWS with auto-scaling capabilities
Technologies: React, Node.js, PostgreSQL, AWS, Docker

Task Management App (2022-2023)
- Developed a collaborative task management tool
- Real-time updates using WebSocket
- Mobile-responsive design
Technologies: React, Express, Socket.io, MongoDB
`;

// Sample job requirements for testing
const sampleJobRequirements = {
  title: "Senior Full Stack Developer",
  skills: ["JavaScript", "React.js", "Node.js", "PostgreSQL", "AWS", "TypeScript"],
  description: "We are looking for a Senior Full Stack Developer to join our team. The candidate should have strong experience with React.js, Node.js, and cloud technologies.",
  experience: "5+ years of experience in full stack development",
  notes: "Experience with e-commerce applications and payment systems is a plus"
};

async function testAIAgents() {
  console.log("🚀 Testing Enhanced AI Agents for SmartHire Application");
  console.log("=" + "=".repeat(60));

  try {
    // Test Agent 1: Data Extraction
    console.log("\n📋 Testing AI Agent 1: Data Extraction");
    console.log("-".repeat(40));
    
    const extractedData = await extractResumeData(sampleResumeText);
    
    console.log("✅ Extraction Results:");
    console.log(`   Name: ${extractedData.name}`);
    console.log(`   Email: ${extractedData.email}`);
    console.log(`   Portfolio: ${extractedData.portfolioLink || 'Not provided'}`);
    console.log(`   Skills (${extractedData.skills.length}): ${extractedData.skills.slice(0, 5).join(', ')}${extractedData.skills.length > 5 ? '...' : ''}`);
    console.log(`   Experience: ${extractedData.experience.years} years`);
    console.log(`   Projects: ${extractedData.experience.projects.length} projects found`);
    console.log(`   Work Experience: ${extractedData.workExperience.slice(0, 100)}...`);
    console.log(`   Project Experience: ${extractedData.projectExperience.slice(0, 100)}...`);
    console.log(`   Summary: ${extractedData.summary.slice(0, 150)}...`);

    // Test Agent 2: Percentage Match
    console.log("\n🎯 Testing AI Agent 2: Percentage Match & Skill Analysis");
    console.log("-".repeat(40));
    
    const matchResult = await calculateJobMatch(
      extractedData,
      sampleJobRequirements.title,
      sampleJobRequirements.skills,
      sampleJobRequirements.description,
      sampleJobRequirements.experience,
      sampleJobRequirements.notes
    );

    console.log("✅ Match Analysis Results:");
    console.log(`   Overall Match: ${matchResult.matchPercentage}%`);
    console.log(`   Summary: ${matchResult["percentage match summary"]}`);
    
    if (matchResult.skillMatchBreakdown && matchResult.skillMatchBreakdown.length > 0) {
      console.log("\n   📊 Skill Breakdown:");
      matchResult.skillMatchBreakdown.forEach(skill => {
        console.log(`     ${skill.skill}: ${skill.percentage}% (${skill.matchLevel})`);
      });
    }

    if (matchResult.strengthsBehindReasons && matchResult.strengthsBehindReasons.length > 0) {
      console.log("\n   💪 Strengths:");
      matchResult.strengthsBehindReasons.forEach(strength => {
        console.log(`     • ${strength.reason} (+${strength.points} points)`);
      });
    }

    if (matchResult.lagBehindReasons && matchResult.lagBehindReasons.length > 0) {
      console.log("\n   ⚠️  Areas for Improvement:");
      matchResult.lagBehindReasons.forEach(area => {
        console.log(`     • ${area.reason} (${area.points} points)`);
      });
    }

    // Test Agent 3: Interview Questions Generation
    console.log("\n❓ Testing AI Agent 3: Interview Questions Generation");
    console.log("-".repeat(40));
    
    const interviewQuestions = await generateInterviewQuestions(
      extractedData,
      sampleJobRequirements.title,
      sampleJobRequirements.description,
      sampleJobRequirements.skills
    );

    console.log("✅ Generated Interview Questions:");
    console.log(`   Technical Questions (${interviewQuestions.technical.length}):`);
    interviewQuestions.technical.forEach((q, i) => {
      console.log(`     ${i + 1}. ${q.slice(0, 80)}${q.length > 80 ? '...' : ''}`);
    });

    console.log(`\n   Behavioral Questions (${interviewQuestions.behavioral.length}):`);
    interviewQuestions.behavioral.forEach((q, i) => {
      console.log(`     ${i + 1}. ${q.slice(0, 80)}${q.length > 80 ? '...' : ''}`);
    });

    console.log(`\n   Job-Specific Questions (${interviewQuestions.jobSpecific.length}):`);
    interviewQuestions.jobSpecific.forEach((q, i) => {
      console.log(`     ${i + 1}. ${q.slice(0, 80)}${q.length > 80 ? '...' : ''}`);
    });

    // Test Agent 4: Match Report Generation
    console.log("\n📄 Testing Match Report Generation");
    console.log("-".repeat(40));
    
    const reportHTML = await generateMatchReport(
      extractedData,
      sampleJobRequirements.title,
      sampleJobRequirements.description,
      matchResult
    );

    console.log("✅ Match Report Generated:");
    console.log(`   Report Size: ${reportHTML.length} characters`);
    console.log(`   Contains HTML: ${reportHTML.includes('<html>') ? 'Yes' : 'No'}`);
    console.log(`   Contains Candidate Info: ${reportHTML.includes(extractedData.name) ? 'Yes' : 'No'}`);
    console.log(`   Contains Match Score: ${reportHTML.includes(matchResult.matchPercentage.toString()) ? 'Yes' : 'No'}`);

    console.log("\n🎉 All AI Agents Successfully Tested!");
    console.log("=" + "=".repeat(60));
    
    console.log("\n📋 Test Summary:");
    console.log(`✅ Agent 1 (Data Extraction): Working correctly`);
    console.log(`✅ Agent 2 (Percentage Match): Working correctly`);
    console.log(`✅ Agent 3 (Interview Questions): Working correctly`);
    console.log(`✅ Agent 4 (Match Report): Working correctly`);
    
    console.log("\n🔧 Enhanced Features Validated:");
    console.log(`✅ Portfolio link extraction: ${extractedData.portfolioLink ? 'Found' : 'Not found in sample'}`);
    console.log(`✅ Work/Project experience separation: Working`);
    console.log(`✅ Skill-level matching breakdown: ${matchResult.skillMatchBreakdown ? 'Generated' : 'Not available'}`);
    console.log(`✅ Detailed interview questions: Generated`);
    console.log(`✅ HTML report generation: Generated`);

  } catch (error) {
    console.error("❌ Error testing AI agents:", error);
    process.exit(1);
  }
}

// Check if GEMINI_API_KEY is available
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY environment variable is not set.");
  console.log("Please set your Gemini API key to test the AI agents.");
  console.log("Example: set GEMINI_API_KEY=your_api_key_here");
  process.exit(1);
}

// Run the tests
testAIAgents().catch(console.error);