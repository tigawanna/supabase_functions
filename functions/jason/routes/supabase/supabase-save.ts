//  get repo package json

import { Router } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import { logInfo } from "../../utils/loggers.ts";
import { supabaseInsertManyPkgs, supabaseUpdateOnePkg } from "./helpers/supabase-helpers.ts";

export const supabasepkgsRouter = new Router();
supabasepkgsRouter
  .post("/bulk", async (ctx) => {
    try {
      const authHeader = ctx.request.headers.get("Authorization");
      if (!authHeader) {
        ctx.response.status = 401;
        ctx.response.body = "missing auth headers";
        return;
      }
      const [authType, token] = authHeader.split(" ");
      if (authType !== "Bearer") {
        ctx.response.status = 401;
        ctx.response.body = "missing bearer token";
        return;
      }

      const all_repos = await supabaseInsertManyPkgs(token);
      logInfo("all_repos", all_repos);

      //  handle response
      ctx.response.headers.set("Content-Type", "application/json");
      ctx.response.status = 200;
      ctx.response.body = { "success": all_repos }

    } catch (error) {
      logInfo("error getting pkg-json", error);
      ctx.response.status = 500;
      ctx.response.body = error;
    }
  })
  
  .post("/update", async (ctx) => {
    try {
      const authHeader = ctx.request.headers.get("Authorization");
      if (!authHeader) {
        ctx.response.status = 401;
        ctx.response.body = "missin auth headers";
        return;
      }
      const [authType, token] = authHeader.split(" ");
      if (authType !== "Bearer") {
        ctx.response.status = 401;
        ctx.response.body = "missing bearer token";
        return;
      }
      const body = await ctx.request.body();
      const requestBody = await body.value;
      
      if (!requestBody?.nameWithOwner){
        ctx.response.status = 400;
        ctx.response.body = "missing nameWithOwner body param";
        return
      }
    
      const nameWithOwner = requestBody?.nameWithOwner
      const all_repos = await supabaseUpdateOnePkg(token, nameWithOwner);
      logInfo("update_repo", all_repos);
      
      //  handle response
      ctx.response.headers.set("Content-Type", "application/json");
      ctx.response.status = 200;
      ctx.response.body = {"success":all_repos}

    } catch (error) {
      logInfo("error getting pkg-json", error);
      ctx.response.status = 500;
      ctx.response.body = error;
    }
  });
