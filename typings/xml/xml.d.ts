declare var escapeForXML: any;
declare var Stream: any;
declare var DEFAULT_INDENT: string;
declare function xml(input: any, options: any): any;
declare function element(): {
    _elem: any;
};
declare function create_indent(character: any, count: any): string;
declare function resolve(data: any, indent: any, indent_count: any): any;
declare function format(append: any, elem: any, end: any): any;
declare function attribute(key: any, value: any): string;

declare module "xml"{
    export = xml;
}