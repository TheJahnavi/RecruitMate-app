import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";

neonConfig.webSocketConstructor = ws;

// Use a mock database URL for development if not set
const databaseUrl = process.env.DATABASE_URL || "postgresql://mock:mock@localhost:5432/smarthire";

// Add connection pooling configuration to prevent memory issues
export const pool = new Pool({ 
  connectionString: databaseUrl,
  // Add connection pooling settings to prevent memory leaks
  max: 10, // Maximum number of clients in the pool
  min: 2,  // Minimum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

export const db = drizzle({ 
  client: pool, 
  schema,
  // Add logger in development for debugging
  logger: process.env.NODE_ENV === 'development'
});