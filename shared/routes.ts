import { z } from "zod";
import { insertUserSchema, insertComplaintSchema, users, complaints, ROLES, type User } from "./schema";

export { insertUserSchema, insertComplaintSchema, ROLES, type User };

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  })
};

export const api = {
  auth: {
    register: {
      method: "POST" as const,
      path: "/api/register" as const,
      input: z.object({
        username: z.string().min(3, "Username must be at least 3 characters"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        role: z.enum(["Student", "Faculty", "HOD", "Admin"]),
        department: z.string().optional()
      }),
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
        409: z.object({ message: z.string() })
      }
    },
    login: {
      method: "POST" as const,
      path: "/api/login" as const,
      input: z.object({
        username: z.string(),
        password: z.string()
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    },
    logout: {
      method: "POST" as const,
      path: "/api/logout" as const,
      responses: {
        200: z.object({ message: z.string() })
      }
    },
    me: {
      method: "GET" as const,
      path: "/api/me" as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    }
  },
  complaints: {
    list: {
      method: "GET" as const,
      path: "/api/complaints" as const,
      input: z.object({
        status: z.string().optional(),
        department: z.string().optional()
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof complaints.$inferSelect>()),
      }
    },
    get: {
      method: "GET" as const,
      path: "/api/complaints/:id" as const,
      responses: {
        200: z.custom<typeof complaints.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    },
    create: {
      method: "POST" as const,
      path: "/api/complaints" as const,
      input: insertComplaintSchema,
      responses: {
        201: z.custom<typeof complaints.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      }
    },
    updateStatus: {
      method: "PATCH" as const,
      path: "/api/complaints/:id/status" as const,
      input: z.object({
        status: z.string()
      }),
      responses: {
        200: z.custom<typeof complaints.$inferSelect>(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
