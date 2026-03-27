import { drizzle } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import * as schema from "@shared/schema";

const client = new PGlite("./.data/postgres");

export const db = drizzle(client, { schema });
