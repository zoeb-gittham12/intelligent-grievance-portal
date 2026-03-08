import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";

// Extend express-session type to include user id
declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

const SessionStore = MemoryStore(session);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Simple session setup for auth (since MVP relies on seeded credentials, not a full passport setup yet to keep it simple and match standard template)
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "super-secret-key",
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      }),
      cookie: { maxAge: 86400000 } // 24h
    })
  );

  // Auth Routes - Register
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      
      // Check if user already exists
      const existing = await storage.getUserByUsername(input.username);
      if (existing) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const user = await storage.createUser({
        username: input.username,
        password: input.password,
        role: input.role,
        department: input.department || null
      });

      req.session.userId = user.id;
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Auth Routes - Login
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByUsername(input.username);
      
      if (!user || user.password !== input.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(user);
  });

  // Complaint Routes
  app.get(api.complaints.list.path, async (req, res) => {
    const { status, department } = req.query;
    const filters: { status?: string, department?: string } = {};
    if (typeof status === 'string') filters.status = status;
    if (typeof department === 'string') filters.department = department;
    
    const complaints = await storage.getComplaints(filters);
    res.json(complaints);
  });

  app.get(api.complaints.get.path, async (req, res) => {
    const complaint = await storage.getComplaint(Number(req.params.id));
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json(complaint);
  });

  app.post(api.complaints.create.path, async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const input = api.complaints.create.input.parse(req.body);
      
      // Mock AI engine classification logic based on input text
      let predictedDepartment = "General";
      let predictedPriority = "Low";
      let confidenceScore = Math.floor(Math.random() * (99 - 70 + 1)) + 70; // 70-99
      
      const text = `${input.title} ${input.description}`.toLowerCase();
      if (text.includes("wifi") || text.includes("internet") || text.includes("network")) {
        predictedDepartment = "IT";
        predictedPriority = "Medium";
      } else if (text.includes("hostel") || text.includes("room") || text.includes("mess")) {
        predictedDepartment = "Hostel";
        predictedPriority = "High";
      } else if (text.includes("exam") || text.includes("marks") || text.includes("grade")) {
        predictedDepartment = "Academics";
        predictedPriority = "High";
      } else if (text.includes("harassment") || text.includes("ragging") || text.includes("security")) {
        predictedDepartment = "Disciplinary";
        predictedPriority = "Critical";
      }

      const complaint = await storage.createComplaint({
        ...input,
        userId: req.session.userId,
        predictedDepartment,
        predictedPriority,
        confidenceScore,
        status: "Pending"
      });
      res.status(201).json(complaint);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch(api.complaints.updateStatus.path, async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Checking if user is admin/staff could be done here, skipping strict check for MVP demo
    try {
      const input = api.complaints.updateStatus.input.parse(req.body);
      const updated = await storage.updateComplaintStatus(Number(req.params.id), input.status);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Seed database logic on startup
  async function seedDatabase() {
    const existingUsers = await storage.getUserByUsername("admin");
    if (!existingUsers) {
      const admin = await storage.createUser({ username: "admin", password: "password", role: "Admin", department: "Central" });
      const student1 = await storage.createUser({ username: "student1", password: "password", role: "Student", department: "Computer Science" });
      
      await storage.createComplaint({
        title: "No WiFi in Room 204",
        description: "The internet connection has been down for 2 days in the hostel.",
        category: "Infrastructure",
        userId: student1.id,
        predictedDepartment: "IT",
        predictedPriority: "High",
        confidenceScore: 92,
        status: "Pending"
      });

      await storage.createComplaint({
        title: "Discrepancy in Mid-Term Marks",
        description: "My marks for Database Systems are shown as 0.",
        category: "Academics",
        userId: student1.id,
        predictedDepartment: "Academics",
        predictedPriority: "High",
        confidenceScore: 88,
        status: "Resolved"
      });
    }
  }

  seedDatabase().catch(console.error);

  return httpServer;
}
