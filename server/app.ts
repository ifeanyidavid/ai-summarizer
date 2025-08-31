import { createRequestHandler } from "@react-router/express";
import express from "express";
import "react-router";
import type { ServerBuild } from "react-router";

declare module "react-router" {
  interface AppLoadContext {
    VALUE_FROM_EXPRESS: string;
  }
}

export const app = express();

app.use(
  createRequestHandler({
    build: async () => {
      // During build time, this import is handled by vite
      // @ts-ignore - virtual module that exists at runtime
      const build = await import("virtual:react-router/server-build");
      return build as unknown as ServerBuild;
    },
    getLoadContext() {
      return {
        VALUE_FROM_EXPRESS: "",
      };
    },
  })
);
