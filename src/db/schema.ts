// src/db/schema.ts
import { pgTable, text, serial, bigint, varchar, timestamp, boolean, integer, numeric } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  vkId: bigint("vk_id", { mode: "number" }).unique().notNull(),
  avatarUrl: text("avatar_url"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  screenName: text("screen_name"),
  role: varchar("role", { length: 20 }).default("Участник"),
  tags: text("tags").array().default([]),
  status: varchar("status", { length: 50 }).default("Не прибыл"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ticketTypes = pgTable("ticket_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).unique().notNull(),
  description: text("description"),
  price: numeric("price").default("0"),
  includesMerch: boolean("includes_merch").default(false),
});

export const tickets = pgTable("tickets", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  userId: bigint("user_id", { mode: "number" }).references(() => users.id),
  ticketTypeId: integer("ticket_type_id").references(() => ticketTypes.id),
  code: varchar("code", { length: 100 }).unique().notNull(),
  status: varchar("status", { length: 30 }).default("Активен"),
  purchasedAt: timestamp("purchased_at").defaultNow(),
  usedAt: timestamp("used_at"),
});

export const merch = pgTable("merch", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
});

export const ticketTypeMerch = pgTable("ticket_type_merch", {
  id: serial("id").primaryKey(),
  ticketTypeId: integer("ticket_type_id").references(() => ticketTypes.id),
  merchId: integer("merch_id").references(() => merch.id),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventAttendance = pgTable("event_attendance", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  userId: bigint("user_id", { mode: "number" }).references(() => users.id),
  eventId: integer("event_id").references(() => events.id),
  status: varchar("status", { length: 30 }).default("Не прибыл"),
  time: timestamp("time").defaultNow()
});
