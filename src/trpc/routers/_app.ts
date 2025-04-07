
import { categoriesRouter } from '@/modules/categories/server/procedure';
import { createTRPCRouter } from '../init';
import { studioRouter } from '@/modules/studio/server/procedure';
import { videosRouter } from '@/modules/videos/server/procedures';
import { videoViewsRouter } from '@/modules/video-views/server/procedure';
import { videoReactionsRouter } from '@/modules/video-reactions/server/procedure';
import { subscriptionsRouter } from '@/modules/subscriptions/ui/components/server/procedure';
import { commentsRouter } from '@/modules/comments/server/procedure';
import { commentReactionRouter } from '@/modules/comment-reactions/server/procedure';
import { suggestionsRouter } from '@/modules/suggestions/server/procedure';
// import { subscriptionsRouter } from '@/modules/subscriptions/ui/components/server/procedure';
export const appRouter = createTRPCRouter({
    categories: categoriesRouter,
    studio: studioRouter,
    vidoes: videosRouter,
    videoViews: videoViewsRouter,
    videoReactions: videoReactionsRouter,
    subscriptions: subscriptionsRouter,
    comments: commentsRouter,
    commentReactions: commentReactionRouter,
    suggestions: suggestionsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;