
export interface IPkgJson {
    name?: string;
    version?: string;
    description?: string;
    keywords?: string[];
    author?: string;
    license?: string;
    dependencies?: { [packageName: string]: string };
    devDependencies?: { [packageName: string]: string };
    scripts?: { [scriptName: string]: string };
}
