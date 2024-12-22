import { Hono } from "hono";
import { drizzle, D1Database } from "drizzle-orm/d1";
import { todos } from "./schema";

export type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/hello", (c) => c.text("Hello from Hono on Cloudflare Workers!"));

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const allTodos = await db.select().from(todos);
  return c.json(allTodos);
});

app.post("/add", async (c) => {
  const { title } = await c.req.json();
  const db = drizzle(c.env.DB);
  await db.insert(todos).values({ title });
  return c.json({ success: true });
});

export default app;
