import * as Koa from 'koa';

const mount = require('koa-mount');
const serve = require('koa-static');
import { Mainifest } from './manifest';
import { PluginType } from './plugin';
import { routes } from './routes';
import { setDefaultENV } from './setEnv';

const app = new Koa();

app.use(mount('/admin', routes));
app.use(mount('/dashboard', serve('admin_dashboard/dist')));
// add default configs
setDefaultENV();

// load config once default environment are laoded;
import * as CONFIG from 'config';
// build the config data
const param: PluginType = {
  app: app,
  config: CONFIG,
};

// Load all the Modules
const manifest = new Mainifest(param);
// Load all the schemas
manifest.RegisterModel(CONFIG);
manifest.Load();

export const server = app.listen(CONFIG.get('port') || 3000);


console.log(`Server running on port ${CONFIG.get('port') || 3000}`);
