import fs from 'fs';
import swaggerUiDist from 'swagger-ui-dist';
import express from 'express';
import { getMetadataArgsStorage} from 'routing-controllers';
import {routingControllersToSpec} from 'routing-controllers-openapi';
import { getFromContainer, MetadataStorage } from 'class-validator';
import {validationMetadatasToSchemas} from 'class-validator-jsonschema';
import {OpenAPIObject} from 'openapi3-ts'

export const useSwagger = (
  server: any,
  swaggerPatch: string,
  swaggerJsonPatch: string,
  options: OpenAPIObject | any = {}
) => {
  const pathToSwaggerUi = swaggerUiDist.absolutePath();
  const indexContent = fs.readFileSync(`${pathToSwaggerUi}/index.html`)
    .toString()
    .replace('https://petstore.swagger.io/v2/swagger.json', swaggerJsonPatch);
  // you need to do this since the line below serves `index.html` at both routes
  server.get(`${swaggerPatch}/index.html`, (req: any, res: any) => res.send(indexContent));
  server.get(swaggerPatch, (req: any, res: any) => res.send(indexContent));
  server.use(swaggerPatch, express.static(pathToSwaggerUi));
  // initialize swagger-jsdoc
  //const swaggerSpec = swaggerJSDoc(options);
  // Generate a schema:
  const storage = getMetadataArgsStorage();
  const swaggerSpec = routingControllersToSpec(storage);
  // Parse class-validator classes into JSON Schema:
  const metadata = (getFromContainer(MetadataStorage) as any).validationMetadatas;
  const schemas = validationMetadatasToSchemas(metadata, {
    refPointerPrefix: '#/components/schemas/'
  });

  swaggerSpec.security = [{
    'bearerAuth': []
  }];

  swaggerSpec.components = swaggerSpec.components || {};
  swaggerSpec.components.schemas = schemas;
  swaggerSpec.components.securitySchemes = {
    bearerAuth: {
      type: 'apiKey',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header'
    }
  };
  swaggerSpec.info = {
    description: 'Open api documentation',
    title: 'A sample API',
    version: '1.0.0'
  };

  // serve swagger
  server.use(swaggerJsonPatch, (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.send({...swaggerSpec, ...options});
  });
  return server;
};