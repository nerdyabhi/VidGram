
import { categoriesRouter } from '@/modules/categories/server/procedure';
import { createTRPCRouter } from '../init';
import { studioRouter } from '@/modules/studio/server/procedure';
import { videosRouter } from '@/modules/videos/server/procedures';
import { videoViewsRouter } from '@/modules/video-views/server/procedure';
import { videoReactionsRouter } from '@/modules/video-reactions/server/procedure';
export const appRouter = createTRPCRouter({
    categories: categoriesRouter,
    studio: studioRouter,
    vidoes: videosRouter,
    videoViews: videoViewsRouter,
    videoReactions: videoReactionsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;