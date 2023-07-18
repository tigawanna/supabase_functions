import { supabaseClient } from "../../../utils/helpers/supabaseClient.ts";
import { logError, logSuccess } from "../../../utils/loggers.ts";
import { recursiveFetchAllRepoPkgs,getOneRepoPackageJson } from "../../repos/helpers/pkg-json-helpers.ts";


export interface Supabaserepo_pkgs {
  id: bigint;
  created_at: string; // Assumes string format for timestamp with time zone
  name: string;
  description: string;
  type: string;
  dependencies: object; // Assumes object format for JSON data type
  devDependencies: object; // Assumes object format for JSON data type
  favdeps: string;
  pkg_type: string;
}

export async function supabaseInsertManyPkgs(token: string) {
  try {
    // const reposPkgJson = await computeAllPkgJsons(token);
    const reposPkgJson = await recursiveFetchAllRepoPkgs(token);
    
    const parsedRepos = reposPkgJson.filter((repo) => (repo && ("name" in repo) && repo.name && repo.pkg_type))
      .map((repo) => {
        if (repo && "name" in repo) {
          return {
            name: repo.name,
            nameWithOwner: repo.nameWithOwner,
            description: repo.description,
            type: repo.type,
            dependencies: repo.dependencies,
            devDependencies: repo.devDependencies,
            favdeps: repo.favdeps,
            pkg_type: repo.pkg_type,
          };
        }
      });
    const repo_insert_res = await batchCreateRepos(
      parsedRepos as unknown as Omit<Supabaserepo_pkgs, "id">,
    );
    logSuccess("repo_insert_res gotten=== ", repo_insert_res);
  } catch (error) {
    logError("error batchCreateRepos", error);
  }
}


export async function batchCreateRepos(parsedRepos: Omit<Supabaserepo_pkgs, "id">) {
  try {
    const { data, error } = await supabaseClient.from("repo_pkgs").upsert(
      parsedRepos,
    ).select<"", Supabaserepo_pkgs>();
    if (error) {
      throw error;
    }
    logSuccess("batch inserted  == ", data);
    return data;
  } catch (error) {
    logError("error batchCreateRepos", error);
  }
}

export async function supabaseUpdateOnePkg(token:string,nameWithOwner:string) {
  try {
    const pkg_json = await getOneRepoPackageJson(nameWithOwner,token) as unknown as  Supabaserepo_pkgs
    const { data, error } = await supabaseClient
      .from("repo_pkgs")
      .upsert(pkg_json)
      .eq("name", pkg_json.name)
      .select();
    if (error) {
      throw error;
    }
    logSuccess("batch inserted  == ", data);
    return data;
  } catch (error) {
    logError("error batchCreateRepos", error);
  }
}
