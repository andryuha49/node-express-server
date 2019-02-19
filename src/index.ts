import express from 'express';
import {useExpressServer} from 'routing-controllers';
import {useSwagger} from './useSwagger';
import {useI18n} from './useI18n';
import errorHandler from 'errorhandler';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

const server: any = express();

/**
 * Error Handler. Provides full stack - remove for production
 */
if (server.get('env') !== 'production') {
  server.use(errorHandler());
  server.use(morgan('dev')) // :method :url :status :response-time ms - :res[content-length]
}

server.useBodyParser = (options: any = null) => {
  server.use(bodyParser.json(options)) // Parse application/json
    .use(bodyParser.raw(options)) // Parse application/x-www-form-urlencoded
    .use(bodyParser.urlencoded(options));
};

server.fileUpload = (options: any = null) => {
  server.use(fileUpload(options));
};

server.useCors = (corsOptions: any = null) => {
  server.use(cors(corsOptions));
};

server.useSwagger = (swaggerPatch: string = '/api/swagger-ui', swaggerJsonPatch: string = '/api/v1/swagger.json') => {
  swaggerPatch = swaggerPatch || '/api/swagger-ui';
  swaggerJsonPatch = swaggerJsonPatch || '/api/v1/swagger.json';
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