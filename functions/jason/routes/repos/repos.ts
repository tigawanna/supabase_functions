// routes/home.ts
import { Router} from "https://deno.land/x/oak@v12.6.0/mod.ts";

export const repoRouter = new Router();
repoRouter
    .get("/", (ctx) => {
        ctx.response.body = "Getting all repositories";
    })    
    .get("/:reviewId", (ctx) => {
        ctx.response.body = "Getting one repository";
    })
    .put("/", (ctx) => {
        ctx.response.body = "Create review route\n";
    })
