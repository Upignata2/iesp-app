import { integer, text, timestamp, varchar, pgTable, pgEnum } from "drizzle-orm/pg-core";
/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
// Enums for PostgreSQL
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);
export const dayOfWeekEnum = pgEnum("dayOfWeek", ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
export const mediaTypeEnum = pgEnum("mediaType", ["image", "video"]);
export const contactStatusEnum = pgEnum("contactStatus", ["pending", "read", "responded"]);
export const campaignStatusEnum = pgEnum("campaignStatus", ["active", "inactive", "completed"]);
export const paymentMethodEnum = pgEnum("paymentMethod", ["pix", "mercadopago", "credit_card"]);
export const donationStatusEnum = pgEnum("donationStatus", ["pending", "completed", "failed"]);
export const contentTypeEnum = pgEnum("contentType", ["article", "news", "event", "hymn"]);
export const users = pgTable("users", {
    /**
     * Surrogate primary key. Auto-incremented numeric value managed by the database.
     * Use this for relations between tables.
     */
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
    openId: varchar("openId", { length: 64 }).unique(),
    name: text("name"),
    email: varchar("email", { length: 320 }),
    passwordHash: text("passwordHash"),
    passwordSalt: text("passwordSalt"),
    loginMethod: varchar("loginMethod", { length: 64 }),
    role: roleEnum("role").default("user").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
// Articles (Artigos)
export const articles = pgTable("articles", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    content: text("content").notNull(),
    imageUrl: text("imageUrl"),
    authorId: integer("authorId"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
// News (Notícias)
export const news = pgTable("news", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    content: text("content").notNull(),
    imageUrl: text("imageUrl"),
    authorId: integer("authorId"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
// Events (Eventos)
export const events = pgTable("events", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    content: text("content"),
    imageUrl: text("imageUrl"),
    location: varchar("location", { length: 255 }),
    startDate: timestamp("startDate").notNull(),
    endDate: timestamp("endDate"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
// Hymns (Hinário)
export const hymns = pgTable("hymns", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    number: integer("number").notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    lyrics: text("lyrics").notNull(),
    author: varchar("author", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
// Daily Word (Palavra do Dia)
export const dailyWords = pgTable("dailyWords", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    date: varchar("date", { length: 10 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    reference: varchar("reference", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
// Prayer Reasons (Motivo de Oração)
export const prayerReasons = pgTable("prayerReasons", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    priority: priorityEnum("priority").default("medium").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
// Service Schedules (Horário dos Cultos)
export const serviceSchedules = pgTable("serviceSchedules", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    dayOfWeek: dayOfWeekEnum("dayOfWeek").notNull(),
    serviceName: varchar("serviceName", { length: 255 }).notNull(),
    startTime: varchar("startTime", { length: 5 }).notNull(),
    endTime: varchar("endTime", { length: 5 }),
    location: varchar("location", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
// Gallery Items (Galeria de Fotos/Vídeos)
export const galleryItems = pgTable("galleryItems", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    mediaUrl: text("mediaUrl").notNull(),
    mediaType: mediaTypeEnum("mediaType").notNull(),
    eventId: integer("eventId"),
    uploadedBy: integer("uploadedBy"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
// Contact Submissions (Formulário de Contato)
export const contactSubmissions = pgTable("contactSubmissions", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    message: text("message").notNull(),
    status: contactStatusEnum("status").default("pending").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
// Campaigns (Campanhas)
export const campaigns = pgTable("campaigns", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    content: text("content"),
    imageUrl: text("imageUrl"),
    goal: integer("goal"),
    collected: integer("collected").default(0).notNull(),
    paymentMethods: varchar("paymentMethods", { length: 255 }).notNull(),
    status: campaignStatusEnum("status").default("active").notNull(),
    startDate: timestamp("startDate").defaultNow().notNull(),
    endDate: timestamp("endDate"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
// Campaign Donations (Doações para Campanhas)
export const campaignDonations = pgTable("campaignDonations", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    campaignId: integer("campaignId").notNull(),
    userId: integer("userId"),
    amount: integer("amount").notNull(),
    paymentMethod: paymentMethodEnum("paymentMethod").notNull(),
    transactionId: varchar("transactionId", { length: 255 }),
    status: donationStatusEnum("status").default("pending").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
// User Favorites (Favoritos do Usuário)
export const userFavorites = pgTable("userFavorites", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("userId").notNull(),
    contentType: contentTypeEnum("contentType").notNull(),
    contentId: integer("contentId").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});
