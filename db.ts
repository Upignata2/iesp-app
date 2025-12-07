import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users, articles, news, events, hymns, dailyWords, prayerReasons, serviceSchedules, galleryItems, contactSubmissions, campaigns, campaignDonations, userFavorites, InsertArticle, InsertNews, InsertEvent, InsertHymn, InsertDailyWord, InsertPrayerReason, InsertServiceSchedule, InsertGalleryItem, InsertContactSubmission, InsertCampaign, InsertCampaignDonation, InsertUserFavorite } from "./schema";
import { ENV } from './_core/env';
import crypto from "crypto";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL, { ssl: { rejectUnauthorized: false } });
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect (RA=false), retrying with 'require'...", error);
      try {
        const client2 = postgres(process.env.DATABASE_URL, { ssl: 'require' });
        _db = drizzle(client2);
      } catch (error2) {
        console.warn("[Database] Fallback connect failed:", error2);
        _db = null;
      }
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
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
      const updateData: any = {};
      if (user.name !== undefined) updateData.name = user.name;
      if (user.email !== undefined) updateData.email = user.email;
      if (user.loginMethod !== undefined) updateData.loginMethod = user.loginMethod;
      if (user.lastSignedIn !== undefined) updateData.lastSignedIn = user.lastSignedIn;
      if (user.role !== undefined) updateData.role = user.role;
      updateData.updatedAt = new Date();
      
      await db.update(users).set(updateData).where(eq(users.openId, user.openId));
    } else {
      // Insert new user
      const insertData: InsertUser = {
        openId: user.openId,
        name: user.name,
        email: user.email,
        loginMethod: user.loginMethod,
        role: user.role || (user.openId === ENV.ownerOpenId ? 'admin' : 'user'),
        lastSignedIn: user.lastSignedIn || new Date(),
      };
      await db.insert(users).values(insertData);
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

function createSalt() {
  return crypto.randomBytes(16).toString("hex");
}

function hashWithSalt(password: string, salt: string) {
  const key = crypto.scryptSync(password, salt, 64);
  return key.toString("hex");
}

export async function registerUserWithEmail(name: string, email: string, password: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getUserByEmail(email);
  if (existing) throw new Error("Email already exists");

  const salt = createSalt();
  const hash = hashWithSalt(password, salt);

  const insertData: InsertUser = {
    name,
    email,
    passwordHash: hash as any,
    passwordSalt: salt as any,
    loginMethod: "email",
    role: "user",
    lastSignedIn: new Date(),
  };
  await db.insert(users).values(insertData);
  return true;
}

export async function loginWithEmail(email: string, password: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const u = await getUserByEmail(email);
  if (!u || !u.passwordSalt || !u.passwordHash) throw new Error("Invalid credentials");
  const computed = hashWithSalt(password, u.passwordSalt);
  if (computed !== u.passwordHash) throw new Error("Invalid credentials");
  await db.update(users).set({ lastSignedIn: new Date(), updatedAt: new Date() }).where(eq(users.id, u.id));
  return { id: u.id, name: u.name, email: u.email };
}

// Articles
export async function getArticles(limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(articles).orderBy(desc(articles.createdAt)).limit(limit).offset(offset);
}

export async function getArticleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createArticle(data: InsertArticle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(articles).values(data);
  return result;
}

// News
export async function getNews(limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(news).orderBy(desc(news.createdAt)).limit(limit).offset(offset);
}

export async function getNewsById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(news).where(eq(news.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createNews(data: InsertNews) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(news).values(data);
}

// Events
export async function getEvents(limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(events).orderBy(desc(events.startDate)).limit(limit).offset(offset);
}

export async function getEventById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createEvent(data: InsertEvent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(events).values(data);
}

// Hymns
export async function getHymns(limit: number = 100, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(hymns).orderBy(hymns.number).limit(limit).offset(offset);
}

export async function getHymnById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(hymns).where(eq(hymns.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function searchHymns(query: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(hymns).where(eq(hymns.title, query)).limit(20);
}

// Daily Words
export async function getDailyWord(date: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(dailyWords).where(eq(dailyWords.date, date)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getLatestDailyWord() {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(dailyWords).orderBy(desc(dailyWords.date)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createDailyWord(data: InsertDailyWord) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(dailyWords).values(data);
}

// Prayer Reasons
export async function getPrayerReasons(limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(prayerReasons).orderBy(desc(prayerReasons.createdAt)).limit(limit).offset(offset);
}

export async function createPrayerReason(data: InsertPrayerReason) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(prayerReasons).values(data);
}

// Service Schedules
export async function getServiceSchedules() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(serviceSchedules).orderBy(serviceSchedules.dayOfWeek);
}

export async function createServiceSchedule(data: InsertServiceSchedule) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(serviceSchedules).values(data);
}

// Gallery Items
export async function getGalleryItems(limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(galleryItems).orderBy(desc(galleryItems.createdAt)).limit(limit).offset(offset);
}

export async function getGalleryItemsByEvent(eventId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(galleryItems).where(eq(galleryItems.eventId, eventId));
}

export async function createGalleryItem(data: InsertGalleryItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(galleryItems).values(data);
}

// Contact Submissions
export async function createContactSubmission(data: InsertContactSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(contactSubmissions).values(data);
}

export async function getContactSubmissions(limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt)).limit(limit).offset(offset);
}

// Campaigns
export async function getCampaigns(limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(campaigns).orderBy(desc(campaigns.createdAt)).limit(limit).offset(offset);
}

export async function getCampaignById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCampaign(data: InsertCampaign) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(campaigns).values(data);
}

// Campaign Donations
export async function createCampaignDonation(data: InsertCampaignDonation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(campaignDonations).values(data);
}

export async function getCampaignDonations(campaignId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(campaignDonations).where(eq(campaignDonations.campaignId, campaignId));
}

// User Favorites
export async function addUserFavorite(data: InsertUserFavorite) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(userFavorites).values(data);
}

export async function removeUserFavorite(userId: number, contentType: string, contentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(userFavorites).where(and(eq(userFavorites.userId, userId), eq(userFavorites.contentType, contentType as any), eq(userFavorites.contentId, contentId)));
}

export async function getUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userFavorites).where(eq(userFavorites.userId, userId));
}
