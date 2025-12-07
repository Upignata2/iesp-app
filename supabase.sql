DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
    CREATE TYPE role AS ENUM ('user','admin');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'priority') THEN
    CREATE TYPE priority AS ENUM ('low','medium','high');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dayOfWeek') THEN
    CREATE TYPE "dayOfWeek" AS ENUM ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mediaType') THEN
    CREATE TYPE "mediaType" AS ENUM ('image','video');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contactStatus') THEN
    CREATE TYPE "contactStatus" AS ENUM ('pending','read','responded');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'campaignStatus') THEN
    CREATE TYPE "campaignStatus" AS ENUM ('active','inactive','completed');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'paymentMethod') THEN
    CREATE TYPE "paymentMethod" AS ENUM ('pix','mercadopago','credit_card');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'donationStatus') THEN
    CREATE TYPE "donationStatus" AS ENUM ('pending','completed','failed');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contentType') THEN
    CREATE TYPE "contentType" AS ENUM ('article','news','event','hymn');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "openId" varchar(64) UNIQUE,
  name text,
  email varchar(320),
  "passwordHash" text,
  "passwordSalt" text,
  "loginMethod" varchar(64),
  role role NOT NULL DEFAULT 'user',
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "lastSignedIn" timestamp NOT NULL DEFAULT now()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS "passwordHash" text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "passwordSalt" text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "openId" varchar(64);
ALTER TABLE users ADD COLUMN IF NOT EXISTS "loginMethod" varchar(64);
ALTER TABLE users ADD COLUMN IF NOT EXISTS role role;
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';
ALTER TABLE users ALTER COLUMN role SET NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now();
ALTER TABLE users ALTER COLUMN "createdAt" SET NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now();
ALTER TABLE users ALTER COLUMN "updatedAt" SET NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "lastSignedIn" timestamp DEFAULT now();
ALTER TABLE users ALTER COLUMN "lastSignedIn" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS users_openid_unique ON users ("openId");
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

CREATE TABLE IF NOT EXISTS articles (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar(255) NOT NULL,
  description text,
  content text NOT NULL,
  "imageUrl" text,
  "authorId" integer,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles ("createdAt");

CREATE TABLE IF NOT EXISTS news (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar(255) NOT NULL,
  description text,
  content text NOT NULL,
  "imageUrl" text,
  "authorId" integer,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_created_at ON news ("createdAt");

CREATE TABLE IF NOT EXISTS events (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar(255) NOT NULL,
  description text,
  content text,
  "imageUrl" text,
  location varchar(255),
  "startDate" timestamp NOT NULL,
  "endDate" timestamp,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_start_date ON events ("startDate");
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events ("createdAt");

CREATE TABLE IF NOT EXISTS hymns (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  number integer NOT NULL UNIQUE,
  title varchar(255) NOT NULL,
  lyrics text NOT NULL,
  author varchar(255),
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "dailyWords" (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  date varchar(10) NOT NULL UNIQUE,
  title varchar(255) NOT NULL,
  content text NOT NULL,
  reference varchar(255),
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "prayerReasons" (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar(255) NOT NULL,
  description text NOT NULL,
  priority priority NOT NULL DEFAULT 'medium',
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prayer_reasons_created_at ON "prayerReasons" ("createdAt");

CREATE TABLE IF NOT EXISTS "serviceSchedules" (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "dayOfWeek" "dayOfWeek" NOT NULL,
  "serviceName" varchar(255) NOT NULL,
  "startTime" varchar(5) NOT NULL,
  "endTime" varchar(5),
  location varchar(255),
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_service_schedules_day_of_week ON "serviceSchedules" ("dayOfWeek");

CREATE TABLE IF NOT EXISTS "galleryItems" (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar(255) NOT NULL,
  description text,
  "mediaUrl" text NOT NULL,
  "mediaType" "mediaType" NOT NULL,
  "eventId" integer,
  "uploadedBy" integer,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_items_event_id ON "galleryItems" ("eventId");
CREATE INDEX IF NOT EXISTS idx_gallery_items_uploaded_by ON "galleryItems" ("uploadedBy");
CREATE INDEX IF NOT EXISTS idx_gallery_items_created_at ON "galleryItems" ("createdAt");

CREATE TABLE IF NOT EXISTS "contactSubmissions" (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar(255) NOT NULL,
  email varchar(320) NOT NULL,
  subject varchar(255) NOT NULL,
  message text NOT NULL,
  status "contactStatus" NOT NULL DEFAULT 'pending',
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON "contactSubmissions" ("createdAt");

CREATE TABLE IF NOT EXISTS campaigns (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar(255) NOT NULL,
  description text,
  content text,
  "imageUrl" text,
  goal integer,
  collected integer NOT NULL DEFAULT 0,
  "paymentMethods" varchar(255) NOT NULL,
  status "campaignStatus" NOT NULL DEFAULT 'active',
  "startDate" timestamp NOT NULL DEFAULT now(),
  "endDate" timestamp,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns (status);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns ("createdAt");

CREATE TABLE IF NOT EXISTS "campaignDonations" (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "campaignId" integer NOT NULL,
  "userId" integer,
  amount integer NOT NULL,
  "paymentMethod" "paymentMethod" NOT NULL,
  "transactionId" varchar(255),
  status "donationStatus" NOT NULL DEFAULT 'pending',
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_campaign_donations_campaign_id ON "campaignDonations" ("campaignId");
CREATE INDEX IF NOT EXISTS idx_campaign_donations_status ON "campaignDonations" (status);

CREATE TABLE IF NOT EXISTS "userFavorites" (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "userId" integer NOT NULL,
  "contentType" "contentType" NOT NULL,
  "contentId" integer NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON "userFavorites" ("userId");
CREATE INDEX IF NOT EXISTS idx_user_favorites_content ON "userFavorites" ("contentType","contentId");

