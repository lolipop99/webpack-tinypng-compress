declare class TinyPNGPlugin {
    apply(compiler: any): void;
    tinyCompress(assets: any, filename: any): Promise<{}>;
    uploadPic(data: any): Promise<{}>;
    downloadPic(url: any): Promise<{}>;
}
export = TinyPNGPlugin;
