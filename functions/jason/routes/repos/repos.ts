// routes/home.ts
import { Router} from "https://deno.land/x/oak@v12.6.0/mod.ts";
import { recursiveFetchAllRepoPkgs } from "./helpers/pkg-json-helpers.ts";
import { logError, logSuccess } from "../../utils/loggers.ts";
import { getViewerRepos } from "./helpers/repos-helpers.ts";

export const repoRouter = new Router();
repoRouter
    .get("/", async(ctx) => {
        try{
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
            const repos = await recursiveFetchAllRepoPkgs(token);
            logSuccess("all_repos query success", repos);
            ctx.response.body = repos
        }catch(err){
            logError("error getting all repos", err);
            ctx.response.status = 500;
            ctx.response.body = err;
        }

    })    
    .get("/slice", async(ctx) => {
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
            const repos = await getViewerRepos(token,null,2);
            logSuccess("all_repos query success", repos);
            ctx.response.body = repos
        } catch (err) {
            logError("error getting all repos", err);
            ctx.response.status = 500;
            ctx.response.body = err;
        }

    })
    .put("/", (ctx) => {
        ctx.response.body = "Create review route\n";
    })
