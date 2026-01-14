import { createTRPCRouter } from "../init";
import { workfllowsRouter } from "@/features/workflows/server/routers";

export const appRouter = createTRPCRouter({
  workflows: workfllowsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
