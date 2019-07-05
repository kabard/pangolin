import { PluginType } from './plugin';
import { ModelRegister } from './models/register';

/**
 * Mainifest(params:PluginType);
 * Triggers all different plugin into the system
 */
export class Mainifest {
  params: PluginType;
  plugins: Array<string>;
  constructor(params: PluginType) {
    this.params = params;
    this.plugins = this.params.config.get('plugins');
  }
  /**
   * Load();
   * Load all the plugins and trigger the initWebApp method
   */
  Load() {
    this.plugins.forEach( (eachPlugin: string) => {
      const plugin = require(eachPlugin);
      if (typeof plugin.initWebApp !== 'function') return;
      console.log('loading plugin %s on app', eachPlugin);
      plugin.initWebApp(this.params);
    });
  }
  RegisterModel() {
    this.params.app.models = ModelRegister();
  }
}