import express from 'express';
import cors from 'cors';
import {RoutingControllersOptions, useExpressServer} from 'routing-controllers';
import {ConnectionOptions, MigrationInterface} from 'typeorm';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';
import morgan from 'morgan';

import {IServer} from './interfaces/IServer';
import {createConnection} from './data-base';
import {useI18n} from './useI18n';
import {useSwagger} from './useSwagger';
import {IAreaRegistration} from './interfaces/IAreaRegistration';
import {IConstructable} from './interfaces/IConstructable';

function registerCommonMiddleware(server: any) {
  server.use(express.json());
  /**
   * Error Handler. Provides full stack - remove for production
   */
  if (server.get('env') !== 'production') {
    server.use(errorHandler());
    server.use(morgan('dev')) // :method :url :status :response-time ms - :res[content-length]
  }
}

function registerAllAreas(server: IServer, areas: IConstructable<IAreaRegistration>[]) {
  for (let i = 0; i < areas.length; i++) {
    const areaRegistration = areas[i];
    const area = new areaRegistration();
    area.registerArea(server);
  }
}

export class Server implements IServer {
  private controllers?: any[] = [];
  private entities: any[] = [];
  private migrations: MigrationInterface[] = [];
  private areas: IConstructable<IAreaRegistration>[] = [];
  private server: any = null;
  private dbConfig: any = null;
  private apiOptions: RoutingControllersOptions = {};

  constructor(existingExpressServer?: any) {
    this.server = existingExpressServer || express();
  }

  addControllers(controllers: any[]): void {
    this.controllers.push(...controllers);
  }

  addEntities(entities: any[]): void {
    this.entities.push(...entities);
  }

  addMigrations(migrations: any[]): void {
    this.migrations.push(...migrations);
  }

  registerDb(dbConfig: ConnectionOptions) {
    this.dbConfig = dbConfig;
    return this;
  }

  registerAreas(areas: IConstructable<IAreaRegistration>[]) {
    this.areas.push(...areas);
    return this;
  }

  useCors(corsOptions: any) {
    this.server.use(cors(corsOptions));
    return this;
  }

  useI18n(i18nConfig: any = null) {
    useI18n(this.server, i18nConfig);
    return this;
  }

  useSwagger(swaggerPatch: string = '/api/swagger-ui', swaggerJsonPath: string = '/api/v1/swagger.json') {
    swaggerPatch = swaggerPatch || '/api/swagger-ui';
    swaggerJsonPath = swaggerJsonPath || '/api/v1/swagger.json';
    useSwagger(this.server, swaggerPatch, swaggerJsonPath);
    return this;
  };

  useBodyParser(options: any = null) {
    this.server.use(bodyParser.json(options)) // Parse application/json
      .use(bodyParser.raw(options)) // Parse application/x-www-form-urlencoded
      .use(bodyParser.urlencoded(options));
    return this;
  };

  useFileUpload(options: any = null) {
    this.server.use(fileUpload(options));
    return this;
  };

  useStatic(route: string, contentPath: string) {
    this.server.use(route, express.static(contentPath));
    return this;
  }

  useApi(apiOptions: RoutingControllersOptions) {
    this.apiOptions = apiOptions;
    return this;
  }

  use(middleware: any) {
    this.server.use(middleware);
    return this;
  }

  async start(port: number, nameOrOptions: string | any, options: any = {}) {
    let name = '';
    if (typeof nameOrOptions === 'object') {
      options = nameOrOptions;
      name = options.name;
    } else {
      name = nameOrOptions;
    }

    const server: any = this.server;
    registerCommonMiddleware(server);
    registerAllAreas(this, this.areas);

    if (this.dbConfig !== null) {
      await createConnection(this.entities, this.migrations, this.dbConfig);
    }
    if (this.controllers.length > 0) {
      if (this.apiOptions && this.apiOptions.controllers) {
        this.apiOptions.controllers.push(...this.controllers);
      }
      useExpressServer(server, { // register created express server in routing-controllers
        controllers: this.controllers, // and configure it the way you need (controllers, validation, etc.)
        ...this.apiOptions
      });
    }
    return new Promise((resolve, reject) => {
      try {
        server.listen(port, () => {
          console.log(
            '  App is running at http://localhost:%d in %s mode. Service: %s',
            port,
            server.get('env'),
            name
          );
          console.log('  Press CTRL-C to stop\n');

          return resolve(server);
        });
      } catch (e) {
        return reject(e);
      }
    });
  }
}