import { logError, logInfo } from "../../../utils/loggers.ts";
import { IGithubViewer,ViewerRepos,BadDataGitHubError } from "./types.ts";

export async function getGithubViewer(viewer_token: string) {
    try {
        const headersList = {
            "Accept": "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)",
            "Authorization": `Bearer ${viewer_token}`,
            "Content-Type": "application/json"
        }

        const response = await fetch("https://api.github.com/user", {
            method: "GET",
            headers: headersList
        });
        if (response.ok) {
            const data = await response.json() as unknown as IGithubViewer
            return data
        }
        throw await response.json()

    } catch (error) {
        logError("error in the getGithubViewer catch block  ==> ", error)
        throw error
    }
}

export async function getViewerRepos(viewer_token: string,after:string|null,limit=50) {
    // console.log("viewerr token  === ", viewer_token)
    const query = `
    query($first: Int!, $after: String) {
    viewer {
    repositories(first:$first,after: $after,isFork: false, orderBy: {field: PUSHED_AT, direction: DESC}) {
    totalCount
    pageInfo{
        endCursor
        startCursor
      }
    edges {
    cursor
      node {
        id
        name
        nameWithOwner
      }
    }    

    
    }
  }
}
`
    try {
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {

                "Authorization": `bearer ${viewer_token}`,
                "Content-Type": "application/json",
                "accept": "application/vnd.github.hawkgirl-preview+json"
            },
            body: JSON.stringify({
                query,
                variables: {
                    first:limit,
                    after:after
                },
                // operationName,
            }),
        })
        const data = await response.json() as unknown as ViewerRepos
    //    logInfo("all user repositories ===== ", data)

        if ("message" in data) {
            logError("throw error fetching viewer repos  ==> ", data)
            throw data
        }
      
        return data

    } catch (err) {
        console.log("catch error fetching viewer repos ==> ", err)
        return err as BadDataGitHubError
    }
}
