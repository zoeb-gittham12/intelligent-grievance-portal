import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.string(),
});

export const complaintSchema = z.object({
    description: z.string().min(5),
});

export const api = {
    complaints: {
        list: {
            path: "/api/complaints/",
            responses: {
                200: { parse: (x: any) => x },
            },
        },
        create: {
            path: "/api/complaints/create/",
            method: "POST",
            input: complaintSchema,
            responses: {
                201: { parse: (x: any) => x },
            },
        },
        get: {
            path: "/api/complaints/:id/",
            responses: {
                200: { parse: (x: any) => x },
            },
        },
        updateStatus: {
            path: "/api/complaints/:id/status/",
            method: "PATCH",
            responses: {
                200: { parse: (x: any) => x },
            },
        },
    },
    auth: {
        register: {
            path: "/api/register",
            method: "POST",
            input: registerSchema,
            responses: {
                200: { parse: (x: any) => x },
            },
        },
    },
};

export function buildUrl(path: string, params: Record<string, any>) {
    let url = path;
    Object.keys(params).forEach((key) => {
        url = url.replace(`:${key}`, params[key]);
    });
    return url;
}
