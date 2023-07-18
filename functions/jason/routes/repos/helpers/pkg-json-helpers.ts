// deno-lint-ignore-file ban-ts-comment
import { logError, logInfo } from "../../../utils/loggers.ts";
import { getViewerRepos } from "./repos-helpers.ts";
import { DecodedPackageJson } from "./types.ts";
import { pkgTypeCondition } from "./whatFramework.ts";

// pass in the repo nameWithOwner and the viewer token and get the package.json back

export async function getOneRepoPackageJson(
  owner_repo: string,
  viewer_token: string,
) {
  try {
    const headersList = {
      Authorization: `bearer ${viewer_token}`,
    };
    const response = await fetch(
      `https://api.github.com/repos/${owner_repo}/contents/package.json`,
      {
        method: "GET",
        headers: headersList,
      },
    );

    const data = await response.json();

    if (data && data.encoding === "base64" && data.content) {
      const stringBuffer = atob(data.content);
      const pgkjson = JSON.parse(stringBuffer) as DecodedPackageJson;
      return await modifyPackageJson(pgkjson);
    }

    return data as DecodedPackageJson;
  } catch (error) {
    logError("error getOneRepoPackageJson  ", error.message);
    return error as DecodedPackageJson;
  }
}

export const mostFaveDepsList = [
  "tailwindcss",
  "supabase",
  "typescript",
  "react-router-dom",
  "react-icons",
  "firebase",
  "dayjs",
  "axios",
  "socket.io",
  "pocketbase",
  "react-to-print",
  "react-query",
  "rollup",
  "express",
  "graphql",
  "jest",
  "vitest",
  "nodemon",
];
//  modify package.json to addthe pkg_type
export function modifyPackageJson(pgkjson: DecodedPackageJson) {
  if ("name" in pgkjson) {
    const typeCondition = pkgTypeCondition(pgkjson);
    console.log("typeCondition", typeCondition);
    pgkjson["pkg_type"] = typeCondition.pkg_type;

    if (!pgkjson.dependencies || !pgkjson.devDependencies) {
      return pgkjson;
    }
    const alldeps = Object.keys(pgkjson.dependencies)
      .map((key) => {
        return key.split("^")[0];
      })
      .concat(
        Object.keys(pgkjson.devDependencies).map((key) => {
          return key.split("^")[0];
        }),
      );

    const favdeps = mostFaveDepsList.filter((key) => {
      return alldeps.find((dep) => {
        return dep === key;
      });
    });

    pgkjson["favdeps"] = favdeps;
    return pgkjson;
  }
  return pgkjson;
}

export async function recursiveFetchAllRepoPkgs(
  viewerToken: string,
  reposPkgJson: DecodedPackageJson[] = [],
  after: string | null = null,
  limit = 3,
): Promise<DecodedPackageJson[]> {
  logInfo("recursive cursor =", after);
  try {
    const all_repos = await getViewerRepos(viewerToken, after, limit);
    // logInfo("before error check", all_repos);

    if ("message" in all_repos || !("data" in all_repos)) {
      logError("error loading viewer repos ==> ", all_repos);
      throw new Error("error loading viewer repos: " + all_repos.message);
    }
    const reposList = all_repos.data.viewer.repositories.edges.map(
      (edge: any) => edge.node,
    );

    const repoPromises = reposList.map(async (repo: any) => {
      const pkgjson = await getOneRepoPackageJson(
        repo.nameWithOwner,
        viewerToken,
      );
      logInfo("repo name with owner in repo list", repo.nameWithOwner);
      if (pkgjson && "name" in pkgjson) {
        logInfo("pkgjson in repo list", pkgjson.name);
        return pkgjson;
      }
    });
    // logInfo("repoPromises", repoPromises);

    const resolvedReposPkgJson = (await Promise.allSettled(repoPromises))
      .filter(
        (data) => (data.status === "fulfilled" && (data.value)),
        // @ts-expect-error
      ).map((data) => data.value as DecodedPackageJson);
    // logInfo("resolvedReposPkgJson", resolvedReposPkgJson);
    const newReposPkgJson = reposPkgJson.concat(resolvedReposPkgJson);
    // Check if the array size matches the totalCount value
    if (newReposPkgJson.length < 3) {
      const next_cursor = all_repos.data.viewer.repositories.pageInfo.endCursor;
      // Fetch the next page of repositories
      logInfo("still less than total count refetching with =", next_cursor);
      return recursiveFetchAllRepoPkgs(
        viewerToken,
        newReposPkgJson,
        next_cursor,
      );
    }
    // logSuccess("newReposPkgJson", newReposPkgJson);
    return newReposPkgJson;
  } catch (error) {
    logError("error recursiveFetchAllRepos", error);
    throw error;
  }
}

export async function computeAllPkgJsons(viewer_token: string) {
  try {
    const all_repos = await getViewerRepos(viewer_token, null);

    if (
      all_repos &&
      ("message" in all_repos || !(all_repos && "data" in all_repos))
    ) {
      logError("error loading  viewer repos  ==> ", all_repos);
      throw new Error("error loading  viewer repos : " + all_repos.message);
    }

    const reposPkgJson: DecodedPackageJson[] = [];
    const totalConut = all_repos.data.viewer.repositories.totalCount;
    const reposList = all_repos.data.viewer.repositories.edges;

    for await (const repo of reposList) {
      const pkgjson = await getOneRepoPackageJson(
        repo.node.nameWithOwner,
        viewer_token,
      );
      if (pkgjson) {
        reposPkgJson.push(pkgjson);
      }
    }

    return reposPkgJson;
  } catch (err) {
    throw err;
  }
}
