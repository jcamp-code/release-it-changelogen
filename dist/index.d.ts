import { ResolvedChangelogConfig, ChangelogConfig, GitCommit } from 'changelogen';
import { Plugin } from 'release-it';

interface IContext {
    config: ResolvedChangelogConfig;
    commits: GitCommit[];
    recommendedVersion: string;
    recommendedIncrement: string;
}
interface IVersionInfo {
    increment?: string;
    isPreRelease?: boolean;
    latestVersion?: string;
    preReleaseId?: string;
}
declare class ChangelogenPlugin extends Plugin {
    changelogenConfig: ResolvedChangelogConfig;
    markdown: string;
    constructor(...args: any[]);
    getInitialOptions(options: any, namespace: any): any;
    getIncrementedVersion(options: IVersionInfo): Promise<string>;
    getIncrementedVersionCI(options: IVersionInfo): Promise<string>;
    getChangelog(_latestVersion: any): Promise<string>;
    bump(version: any): Promise<void>;
    beforeRelease(): Promise<void>;
    release(): void;
    afterRelease(): void;
    getChangelogen(versionInfo?: IVersionInfo, overrides?: Partial<ChangelogConfig>): Promise<IContext>;
}
declare function bumpVersion(commits: GitCommit[], config: ChangelogConfig, opts?: IVersionInfo): {
    newVersion?: undefined;
    increment?: undefined;
} | {
    newVersion: string;
    increment: string;
};

export { bumpVersion, ChangelogenPlugin as default };
