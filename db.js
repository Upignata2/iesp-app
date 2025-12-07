import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users, articles, news, events, hymns, dailyWords, prayerReasons, serviceSchedules, galleryItems, contactSubmissions, campaigns, campaignDonations, userFavorites } from "./schema.js";
import { ENV } from './_core/env.js';
import crypto from "crypto";
let _db = null;
// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
    if (!_db && process.env.DATABASE_URL) {
        try {
            const isLocal = /\blocalhost\b|\b127\.0\.0\.1\b/.test(process.env.DATABASE_URL);
            const client = isLocal ? postgres(process.env.DATABASE_URL) : postgres(process.env.DATABASE_URL, { ssl: { rejectUnauthorized: false } });
            _db = drizzle(client);
        }
        catch (error) {
            console.warn("[Database] Failed to connect:", error);
            _db = null;
        }
    }
    return _db;
}
export async function upsertUser(user) {
    if (!user.openId) {
        return;
    }
    const db = await getDb();
    if (!db) {
        console.warn("[Database] Cannot upsert user: database not available");
        return;
    }
    try {
        const existingUser = await db.select().from(users).where(eq(users.openId, user.openId)).limit(1);
        if (existingUser.length > 0) {
            // Update existing user
            const updateData = {};
            if (user.name !== undefined)
                updateData.name = user.name;
            if (user.email !== undefined)
                updateData.email = user.email;
            if (user.loginMethod !== undefined)
                updateData.loginMethod = user.loginMethod;
            if (user.lastSignedIn !== undefined)
                updateData.lastSignedIn = user.lastSignedIn;
            if (user.role !== undefined)
                updateData.role = user.role;
            updateData.updatedAt = new Date();
            await db.update(users).set(updateData).where(eq(users.openId, user.openId));
        }
        else {
            // Insert new user
            const insertData = {
                openId: user.openId,
                name: user.name,
                email: user.email,
                loginMethod: user.loginMethod,
                role: user.role || (user.openId === ENV.ownerOpenId ? 'admin' : 'user'),
                lastSignedIn: user.lastSignedIn || new Date(),
            };
            await db.insert(users).values(insertData);
        }
    }
    catch (error) {
        console.error("[Database] Failed to upsert user:", error);
        throw error;
    }
}
export async function getUserByOpenId(openId) {
    const db = await getDb();
    if (!db) {
        console.warn("[Database] Cannot get user: database not available");
        return undefined;
    }
    const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function getUserByEmail(email) {
    const db = await getDb();
    if (!db)
        return undefined;
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result.length > 0 ? result[0] : undefined;
}
function createSalt() {
    return crypto.randomBytes(16).toString("hex");
}
function hashWithSalt(password, salt) {
    const key = crypto.scryptSync(password, salt, 64);
    return key.toString("hex");
}
export async function registerUserWithEmail(name, email, password) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    const existing = await getUserByEmail(email);
    if (existing)
        throw new Error("Email already exists");
    const salt = createSalt();
    const hash = hashWithSalt(password, salt);
    const insertData = {
        name,
        email,
        passwordHash: hash,
        passwordSalt: salt,
        loginMethod: "email",
        role: "user",
        lastSignedIn: new Date(),
    };
    await db.insert(users).values(insertData);
    return true;
}
export async function loginWithEmail(email, password) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    const u = await getUserByEmail(email);
    if (!u || !u.passwordSalt || !u.passwordHash)
        throw new Error("Invalid credentials");
    const computed = hashWithSalt(password, u.passwordSalt);
    if (computed !== u.passwordHash)
        throw new Error("Invalid credentials");
    await db.update(users).set({ lastSignedIn: new Date(), updatedAt: new Date() }).where(eq(users.id, u.id));
    return { id: u.id, name: u.name, email: u.email };
}
// Articles
export async function getArticles(limit = 20, offset = 0) {
    const db = await getDb();
    if (!db)
        return [];
    return db.select().from(articles).orderBy(desc(articles.createdAt)).limit(limit).offset(offset);
}
export async function getArticleById(id) {
    const db = await getDb();
    if (!db)
        return undefined;
    const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function createArticle(data) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    const result = await db.insert(articles).values(data);
    return result;
}
// News
export async function getNews(limit = 20, offset = 0) {
    const db = await getDb();
    if (!db)
        return [];
    return db.select().from(news).orderBy(desc(news.createdAt)).limit(limit).offset(offset);
}
export async function getNewsById(id) {
    const db = await getDb();
    if (!db)
        return undefined;
    const result = await db.select().from(news).where(eq(news.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function createNews(data) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    return db.insert(news).values(data);
}
// Events
export async function getEvents(limit = 20, offset = 0) {
    const db = await getDb();
    if (!db)
        return [];
    return db.select().from(events).orderBy(desc(events.startDate)).limit(limit).offset(offset);
}
export async function getEventById(id) {
    const db = await getDb();
    if (!db)
        return undefined;
    const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function createEvent(data) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    return db.insert(events).values(data);
}
// Hymns
export async function getHymns(limit = 100, offset = 0) {
    const db = await getDb();
    if (!db)
        return [];
    return db.select().from(hymns).orderBy(hymns.number).limit(limit).offset(offset);
}
export async function getHymnById(id) {
    const db = await getDb();
    if (!db)
        return undefined;
    const result = await db.select().from(hymns).where(eq(hymns.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function searchHymns(query) {
    const db = await getDb();
    if (!db)
        return [];
    return db.select().from(hymns).where(eq(hymns.title, query)).limit(20);
}
// Daily Words
export async function getDailyWord(date) {
    const db = await getDb();
    if (!db)
        return undefined;
    const result = await db.select().from(dailyWords).where(eq(dailyWords.date, date)).limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function getLatestDailyWord() {
    const db = await getDb();
    if (!db)
        return undefined;
    const result = await db.select().from(dailyWords).orderBy(desc(dailyWords.date)).limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function createDailyWord(data) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    return db.insert(dailyWords).values(data);
}
// Prayer Reasons
export async function getPrayerReasons(limit = 50, offset = 0) {
    const db = await getDb();
    if (!db)
        return [];
    return db.select().from(prayerReasons).orderBy(desc(prayerReasons.createdAt)).limit(limit).offset(offset);
}
export async function createPrayerReason(data) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    return db.insert(prayerReasons).values(data);
}
// Service Schedules
export async function getServiceSchedules() {
    const db = await getDb();
    if (!db)
        return [];
    return db.select().from(serviceSchedules).orderBy(serviceSchedules.dayOfWeek);
}
export async function createServiceSchedule(data) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    return db.insert(serviceSchedules).values(data);
}
// Gallery Items
export async function getGalleryItems(limit = 50, offset = 0) {
    const db = await getDb();
    if (!db)
        return [];
    return db.select().from(galleryItems).orderBy(desc(galleryItems.createdAt)).limit(limit).offset(offset);
}
export async function getGalleryItemsByEvent(eventId) {
    const db = await getDb();
    if (!db)
        return [];
    return db.select().from(galleryItems).where(eq(galleryItems.eventId, eventId));
}
export async function createGalleryItem(data) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    return db.insert(galleryItems).values(data);
}
// Contact Submissions
export async function createContactSubmission(data) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    return db.insert(contactSubmissions).values(data);
}
export async function getContactSubmissions(limit = 50, offset = 0) {
    const db = await getDb();
    if (!db)
        return [];
    return db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt)).limit(limit).offset(offset);
}
// Campaigns
export async function getCampaigns(limit = 20, offset = 0) {
    const db = await getDb();
    if (!db)
        return [];
    return db.select().from(campaigns).orderBy(desc(campaigns.createdAt)).limit(limit).offset(offset);
}
export async function getCampaignById(id) {
    const db = await getDb();
    if (!db)
        return undefined;
    const result = await db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function createCampaign(data) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    return db.insert(campaigns).values(data);
}
// Campaign Donations
export async function createCampaignDonation(data) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    return db.insert(campaignDonations).values(data);
}
export async function getCampaignDonations(campaignId) {
    const db = await getDb();
    if (!db)
        return [];
    return db.select().from(campaignDonations).where(eq(campaignDonations.campaignId, campaignId));
}
// User Favorites
export async function addUserFavorite(data) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    return db.insert(userFavorites).values(data);
}
export async function removeUserFavorite(userId, contentType, contentId) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    return db.delete(userFavorites).where(and(eq(userFavorites.userId, userId), eq(userFavorites.contentType, contentType), eq(userFavorites.contentId, contentId)));
}
export async function getUserFavorites(userId) {
    const db = await getDb();
    if (!db)
        return [];
    return db.select().from(userFavorites).where(eq(userFavorites.userId, userId));
}
