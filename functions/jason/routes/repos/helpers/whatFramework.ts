import { RequiredDecodedPackageJson,TPkgType } from "./types.ts";

export function pkgTypeCondition(pkg: RequiredDecodedPackageJson): {
    pkg_type: TPkgType;
    condition: boolean;
} {
    if (pkg.devDependencies?.rakkasjs) {
        return { pkg_type: "Rakkasjs", condition: true };
    } else if (pkg.dependencies?.next) {
        return { pkg_type: "Nextjs", condition: true };
    } else if (pkg.dependencies?.react && pkg.dependencies?.["react-relay"]) {
        return { pkg_type: "React+Relay", condition: true };
    } else if (pkg.devDependencies?.vite && pkg.dependencies?.react) {
        return { pkg_type: "React+Vite", condition: true };
    } else if (pkg.devDependencies?.nodemon || pkg.dependencies?.nodemon || pkg.dependencies?.express) {
        return { pkg_type: "Nodejs", condition: true };
    } else if (pkg.dependencies?.angular) {
        return { pkg_type: "Angular", condition: true };
    } else if (pkg.dependencies?.vue) {
        return { pkg_type: "Vue", condition: true };
    } else if (pkg.dependencies?.svelte) {
        return { pkg_type: "Svelte", condition: true };
    } else if (pkg.dependencies?.solidjs) {
        return { pkg_type: "Solidjs", condition: true };
    } else if (pkg.dependencies?.qwik) {
        return { pkg_type: "Qwik", condition: true };
    } else if (pkg.dependencies?.redwood) {
        return { pkg_type: "Redwood", condition: true };
    } else if (pkg.dependencies?.remix) {
        return { pkg_type: "Remix", condition: true };
    } else if (pkg.dependencies?.ember) {
        return { pkg_type: "Ember", condition: true };
    } else if (pkg.dependencies?.preact) {
        return { pkg_type: "Preact", condition: true };
    } else if (pkg.dependencies?.knockout) {
        return { pkg_type: "Knockout", condition: true };
    } else if (pkg.dependencies?.lit) {
        return { pkg_type: "Lit", condition: true };
    } else if (pkg.dependencies?.nuxt) {
        return { pkg_type: "Nuxt", condition: true };
    } else if (pkg.dependencies?.sveltekit) {
        return { pkg_type: "SvelteKit", condition: true };
    } else if (pkg.dependencies?.solidstart) {
        return { pkg_type: "SolidStart", condition: true };
    } else if (pkg.dependencies?.qwikcity) {
        return { pkg_type: "QwikCity", condition: true };
    } else {
        return { pkg_type: "Others", condition: false };
    }
}
