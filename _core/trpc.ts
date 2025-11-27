export type Ctx = { req?: any; res?: any; user?: any };

type Proc = {
  input: (schema: any) => Proc;
  query: (handler: (opts: { input: any; ctx: Ctx }) => any) => any;
  mutation: (handler: (opts: { input: any; ctx: Ctx }) => any) => any;
};

const builder: Proc = {
  input: () => builder,
  query: (handler) => handler({ input: undefined, ctx: {} }),
  mutation: (handler) => handler({ input: undefined, ctx: {} }),
};

export const publicProcedure = builder;
export const protectedProcedure = builder;
export function router<T extends Record<string, any>>(o: T): T { return o; }
