
import { categoriesRouter } from '@/modules/categories/server/procedure';
import { createTRPCRouter } from '../init';
import { studioRouter } from '@/modules/studio/server/procedure';
import { videosRouter } from '@/modules/videos/server/procedures';
export const appRouter = createTRPCRouter({
    categories: categoriesRouter,
    studio: studioRouter,
    vidoes: videosRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;