import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware
app.use((req, res, next) => {
  // Allow requests from the frontend (Vite dev server)
  // Updated to allow multiple development ports
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://192.168.194.1:5174',
    'https://chandanasgit-recruit-mate-app.vercel.app'
  ];
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else if (process.env.NODE_ENV !== 'development') {
    res.header('Access-Control-Allow-Origin', '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Add a simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Add a root endpoint that redirects to the frontend
app.get('/', (req, res) => {
  res.redirect('/hr/dashboard');
});

(async () => {
  // Add memory monitoring
  const logMemoryUsage = () => {
    const used = process.memoryUsage();
    const usage = Object.keys(used).map(key => 
      `${key}: ${Math.round((used[key as keyof NodeJS.MemoryUsage] / 1024 / 1024) * 100) / 100} MB`
    ).join(', ');
    log(`Memory usage: ${usage}`);
  };

  // Log memory usage periodically
  setInterval(logMemoryUsage, 30000); // Every 30 seconds

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log the error with more details
    console.error('Server Error:', {
      status,
      message,
      stack: err.stack,
      url: _req.url,
      method: _req.method
    });

    res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    try {
      await setupVite(app, server);
    } catch (error) {
      console.error('Failed to setup Vite:', error);
      log('Continuing without Vite setup...');
    }
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 3001 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '3001', 10);
  
  // Try to listen on the specified port
  server.listen(port, '0.0.0.0', () => {
    log(`Server running on port ${port}`);
    logMemoryUsage(); // Log initial memory usage
  });
  
  // Handle errors more gracefully
  server.on('error', (err: any) => {
    if (err.message.includes('ENOTSUP')) {
      log(`Port ${port} not supported on this system, trying alternative approach...`);
      // Try with localhost only
      server.listen(port, 'localhost', () => {
        log(`Server running on localhost:${port}`);
      });
    } else if (err.code === 'EADDRINUSE') {
      log(`Port ${port} is already in use.`);
      // Try alternative ports in a sequence
      let attemptPort = port + 1;
      const maxAttempts = 10;
      let attempts = 0;
      
      const tryPort = () => {
        if (attempts >= maxAttempts) {
          log(`Could not find an available port after ${maxAttempts} attempts.`);
          process.exit(1);
        }
        
        const tryServer = server.listen(attemptPort, '0.0.0.0', () => {
          log(`Server running on port ${attemptPort}`);
        });
        
        tryServer.on('error', (tryErr: any) => {
          if (tryErr.code === 'EADDRINUSE') {
            attempts++;
            attemptPort++;
            tryPort();
          } else {
            throw tryErr;
          }
        });
      };
      
      tryPort();
    } else {
      log(`Server error: ${err.message}`);
      console.error('Server error details:', err);
      process.exit(1);
    }
  });
})();