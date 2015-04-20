declare module 'xml' {
    function xmls(input?: any, options?: any): string;
    export = xmls;
}
declare module 'glob' {
    function globs(paths: string, options: any, callback: (err: any, files: string[]) => void): any;
    export = globs;
}
