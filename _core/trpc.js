const builder = {
    input: () => builder,
    query: (handler) => handler({ input: undefined, ctx: {} }),
    mutation: (handler) => handler({ input: undefined, ctx: {} }),
};
export const publicProcedure = builder;
export const protectedProcedure = builder;
export function router(o) { return o; }
