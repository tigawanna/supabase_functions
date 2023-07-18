import { Router } from "https://deno.land/x/oak@v12.6.0/mod.ts";

export const indexRouter = new Router();
indexRouter
    .get("/", (ctx) => {
        ctx.response.body = "Getting all reviews route\n";
    })
    .put("/", (ctx) => {
        ctx.response.body = "Create review route\n";
    })

    .get("/:reviewId", (ctx) => {
        ctx.response.body = "Getting single review route\n";
    });

