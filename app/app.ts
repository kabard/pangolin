import * as Koa from 'koa';


import * as CONFIG from 'config';
import { Mainifest } from './manifest';
import { PluginType } from './plugin';
import { routes } from './routes';

const app = new Koa();

app.use(routes);
// build the config data
const param: PluginType = {
  app: app,
  config: CONFIG,
};
// Load all the Modules
const manifest = new Mainifest(param);
manifest.Load();

export const server = app.listen(CONFIG.get('port') || 3000);


console.log(`Server running on port ${CONFIG.get('port') || 3000}`);
