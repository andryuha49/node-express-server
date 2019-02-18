import express from 'express';
import {useExpressServer} from 'routing-controllers';
import {useSwagger} from './useSwagger';
import {useI18n} from './useI18n';

const server: any = express();

const defaultSwaggerPatch = '/api/swagger-ui';
const defaultSwaggerJsonPatch = '/api/v1/swagger.json';
// server.useSwagger = () => {
//   return useSwagger(server, defaultSwaggerPatch, defaultSwaggerJsonPatch);
// };

server.useSwagger = (swaggerPatch: string = '/api/swagger-ui', swaggerJsonPatch: string = '/api/v1/swagger.json') => {
  swaggerPatch = swaggerPatch || defaultSwaggerPatch;
  swaggerJsonPatch = swaggerJsonPatch || defaultSwaggerJsonPatch;
  return useSwagger(server, swaggerPatch, swaggerJsonPatch);
};

server.useI18n = (i18nConfig: any = null) => {
  return useI18n(server, i18nConfig);
};

server.useApi = (controllers: string[] | any[]) => {
  useExpressServer(server, { // register created express server in routing-controllers
    controllers: controllers // and configure it the way you need (controllers, validation, etc.)
  });
};

server.useStatic = (route: string, contentPath: string) => {
  server.use(route, express.static(contentPath));
};

/**
 * Start Express server
 */
server.start = (port: number, nameOrOptions: string | any, options: any = {}) => {
  let name = '';
  if (typeof nameOrOptions === 'object') {
    options = nameOrOptions;
    name = options.name;
  } else {
    name = nameOrOptions;
  }

  return server.listen(port, (callbackParams: any) => {
    console.log(
      '  App is running at http://localhost:%d in %s mode. Service: %s',
      port,
      server.get('env'),
      name
    );
    console.log('  Press CTRL-C to stop\n');
    if (options.callback) {
      options.callback(callbackParams);
    }
  });
};

export {server};