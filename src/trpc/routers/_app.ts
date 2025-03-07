import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { auth } from '@clerk/nextjs/server';
export const appRouter = createTRPCRouter({
    hello: protectedProcedure
        .input(
            z.object({
                text: z.string(),
            }),
        )
        .query((opts) => {
            const userId = opts.ctx.clerkUserId;
            const user = opts.ctx.user;

            return {
                greeting: `hello ${user.name}`
            };
        }),
});
// export type definition of API
export type AppRouter = typeof appRouter;