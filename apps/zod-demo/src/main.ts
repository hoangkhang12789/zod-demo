import { serve } from "@hono/node-server";
import { Hono } from "hono";
import TestZodDecoratorController from "./api/test-zod-decorator/test-zod-decorator.controller.js";
import { logger as HonoLogger } from "hono/logger";
import { swaggerConfig } from "./utils/swagger-config.js";


const app = new Hono();

// swaggerConfig(app, "test")

app.use("*", HonoLogger());
app.route("test", TestZodDecoratorController);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
