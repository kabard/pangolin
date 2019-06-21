import { IConfig } from 'config';
// Define the params which should be passed to plugins from main
export type PluginType = {
    app: any,
    config: IConfig,
};
