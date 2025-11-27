import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
export const appRouter = router({
    auth: router({
        me: publicProcedure.query(() => null),
        logout: publicProcedure.mutation(() => ({ success: true })),
        register: publicProcedure
            .input(z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6) }))
            .mutation(async ({ input }) => {
            await db.registerUserWithEmail(input.name, input.email, input.password);
            return { success: true };
        }),
        login: publicProcedure
            .input(z.object({ email: z.string().email(), password: z.string().min(6) }))
            .mutation(async ({ input }) => {
            const user = await db.loginWithEmail(input.email, input.password);
            return { success: true, user };
        }),
    }),
    // Articles Router
    articles: router({
        list: publicProcedure
            .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
            .query(({ input }) => db.getArticles(input.limit, input.offset)),
        getById: publicProcedure
            .input(z.object({ id: z.number() }))
            .query(({ input }) => db.getArticleById(input.id)),
        create: protectedProcedure
            .input(z.object({
            title: z.string(),
            description: z.string().optional(),
            content: z.string(),
            imageUrl: z.string().optional(),
        }))
            .mutation(({ input, ctx }) => db.createArticle({
            ...input,
            authorId: ctx.user?.id,
        })),
    }),
    // News Router
    news: router({
        list: publicProcedure
            .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
            .query(({ input }) => db.getNews(input.limit, input.offset)),
        getById: publicProcedure
            .input(z.object({ id: z.number() }))
            .query(({ input }) => db.getNewsById(input.id)),
        create: protectedProcedure
            .input(z.object({
            title: z.string(),
            description: z.string().optional(),
            content: z.string(),
            imageUrl: z.string().optional(),
        }))
            .mutation(({ input, ctx }) => db.createNews({
            ...input,
            authorId: ctx.user?.id,
        })),
    }),
    // Events Router
    events: router({
        list: publicProcedure
            .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
            .query(({ input }) => db.getEvents(input.limit, input.offset)),
        getById: publicProcedure
            .input(z.object({ id: z.number() }))
            .query(({ input }) => db.getEventById(input.id)),
        create: protectedProcedure
            .input(z.object({
            title: z.string(),
            description: z.string().optional(),
            content: z.string().optional(),
            imageUrl: z.string().optional(),
            location: z.string().optional(),
            startDate: z.date(),
            endDate: z.date().optional(),
        }))
            .mutation(({ input }) => db.createEvent(input)),
    }),
    // Hymns Router
    hymns: router({
        list: publicProcedure
            .input(z.object({ limit: z.number().default(100), offset: z.number().default(0) }))
            .query(({ input }) => db.getHymns(input.limit, input.offset)),
        getById: publicProcedure
            .input(z.object({ id: z.number() }))
            .query(({ input }) => db.getHymnById(input.id)),
        search: publicProcedure
            .input(z.object({ query: z.string() }))
            .query(({ input }) => db.searchHymns(input.query)),
    }),
    // Daily Word Router
    dailyWord: router({
        getByDate: publicProcedure
            .input(z.object({ date: z.string() }))
            .query(({ input }) => db.getDailyWord(input.date)),
        getLatest: publicProcedure
            .query(() => db.getLatestDailyWord()),
        create: protectedProcedure
            .input(z.object({
            date: z.string(),
            title: z.string(),
            content: z.string(),
            reference: z.string().optional(),
        }))
            .mutation(({ input }) => db.createDailyWord(input)),
    }),
    // Prayer Reasons Router
    prayerReasons: router({
        list: publicProcedure
            .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
            .query(({ input }) => db.getPrayerReasons(input.limit, input.offset)),
        create: protectedProcedure
            .input(z.object({
            title: z.string(),
            description: z.string(),
            priority: z.enum(["low", "medium", "high"]).default("medium"),
        }))
            .mutation(({ input }) => db.createPrayerReason(input)),
    }),
    // Service Schedules Router
    serviceSchedules: router({
        list: publicProcedure
            .query(() => db.getServiceSchedules()),
        create: protectedProcedure
            .input(z.object({
            dayOfWeek: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
            serviceName: z.string(),
            startTime: z.string(),
            endTime: z.string().optional(),
            location: z.string().optional(),
        }))
            .mutation(({ input }) => db.createServiceSchedule(input)),
    }),
    // Gallery Router
    gallery: router({
        list: publicProcedure
            .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
            .query(({ input }) => db.getGalleryItems(input.limit, input.offset)),
        getByEvent: publicProcedure
            .input(z.object({ eventId: z.number() }))
            .query(({ input }) => db.getGalleryItemsByEvent(input.eventId)),
        create: protectedProcedure
            .input(z.object({
            title: z.string(),
            description: z.string().optional(),
            mediaUrl: z.string(),
            mediaType: z.enum(["image", "video"]),
            eventId: z.number().optional(),
        }))
            .mutation(({ input, ctx }) => db.createGalleryItem({
            ...input,
            uploadedBy: ctx.user?.id,
        })),
    }),
    // Contact Router
    contact: router({
        submit: publicProcedure
            .input(z.object({
            name: z.string(),
            email: z.string().email(),
            subject: z.string(),
            message: z.string(),
        }))
            .mutation(({ input }) => db.createContactSubmission(input)),
        list: protectedProcedure
            .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
            .query(({ input }) => db.getContactSubmissions(input.limit, input.offset)),
    }),
    // Campaigns Router
    campaigns: router({
        list: publicProcedure
            .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
            .query(({ input }) => db.getCampaigns(input.limit, input.offset)),
        getById: publicProcedure
            .input(z.object({ id: z.number() }))
            .query(({ input }) => db.getCampaignById(input.id)),
        create: protectedProcedure
            .input(z.object({
            title: z.string(),
            description: z.string().optional(),
            content: z.string().optional(),
            imageUrl: z.string().optional(),
            goal: z.number().optional(),
            paymentMethods: z.string(),
            endDate: z.date().optional(),
        }))
            .mutation(({ input }) => db.createCampaign({
            ...input,
            status: "active",
        })),
        getDonations: publicProcedure
            .input(z.object({ campaignId: z.number() }))
            .query(({ input }) => db.getCampaignDonations(input.campaignId)),
        donate: publicProcedure
            .input(z.object({
            campaignId: z.number(),
            amount: z.number(),
            paymentMethod: z.enum(["pix", "mercadopago", "credit_card"]),
        }))
            .mutation(({ input, ctx }) => db.createCampaignDonation({
            ...input,
            userId: ctx.user?.id,
            status: "pending",
        })),
    }),
    // Favorites Router
    favorites: router({
        list: protectedProcedure
            .query(({ ctx }) => db.getUserFavorites(ctx.user.id)),
        add: protectedProcedure
            .input(z.object({
            contentType: z.enum(["article", "news", "event", "hymn"]),
            contentId: z.number(),
        }))
            .mutation(({ input, ctx }) => db.addUserFavorite({
            userId: ctx.user.id,
            contentType: input.contentType,
            contentId: input.contentId,
        })),
        remove: protectedProcedure
            .input(z.object({
            contentType: z.enum(["article", "news", "event", "hymn"]),
            contentId: z.number(),
        }))
            .mutation(({ input, ctx }) => db.removeUserFavorite(ctx.user.id, input.contentType, input.contentId)),
    }),
});
