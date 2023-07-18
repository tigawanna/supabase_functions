//  get repo package json 

import { Router } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import { getOneRepoPackageJson } from "./helpers/pkg-json-helpers.ts";
import { logInfo } from "../../utils/loggers.ts";

export const pkgJsonRouter = new Router();
pkgJsonRouter
    .get("/", async (ctx) => {
    try {
      const authHeader = ctx.request.headers.get("Authorization");
      const searchParams = new URLSearchParams(ctx.request.url.search);
      const nameWithOwner = searchParams.get("nwo");

      if (!authHeader) {
        ctx.response.status = 401;
        ctx.response.body = "unauthorized , missing Bearer token header";
        return;
      }
      const [authType, token] = authHeader.split(" ");
      logInfo("token",token);
      if (authType !== "Bearer"||!token||(token && token.length<1)) {
        ctx.response.status = 401;
        ctx.response.body = "unauthorized , missing token ";
        return;
      }

      const [key,value] = token.split("_");
      // logInfo("key",key);
      // logInfo("value",value);
      if(key&&key!=="ghp"){
        ctx.response.status = 401;
        ctx.response.body = " invalid github token , hint github token usually start with ghp_";
        return;
      }

      if (!nameWithOwner) {
        ctx.response.status = 401;
        ctx.response.body = "required the nwo search param missing";
        return;
      }

      const pkg_json = await getOneRepoPackageJson(nameWithOwner, token);
      ctx.response.headers.set("Content-Type", "application/json");
      ctx.response.status = 200;
      ctx.response.body = pkg_json;
      return;
      

    } catch (error) {
      logInfo("error getting pkg-json", error);
      ctx.response.status = 500;
      ctx.response.body = error;

    }
  })


