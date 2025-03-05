import { timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { uuid, text, pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").unique().notNull(),
    name: text("name").notNull(),
    // add Banner field
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("updated_at").defaultNow().notNull(),

}, (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)])