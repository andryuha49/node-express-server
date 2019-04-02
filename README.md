# node-express-server
Simple node server with express


## Examples
```typescript
import {Server} from 'node-express-server';
import {ProductsController} from './controllers/productsController';
import {authAreaRegistration} from './areas/auth/authAreaRegistration';

const server = new Server();
server
  // Use i18n
  .useI18n({directory: __dirname + '/assets/i18n'})
  // Use swagger
  .useSwagger('/api/swagger-ui')
  // Use static
  .useStatic(__dirname + '/../clint')
  // Use cors
  .useCors({origin: '*'})
  // Use body parser
  .useBodyParser({limit: '50mb'})
  // Use file upload
  .useFileUpload()
  // Use routing-controllers
  .useApi({controllers: [ProductsController]})
  // Use custom express middleware
  .use(...)
  // Register areas (IAreaRegistration)
  .registerAreas([authAreaRegistration]);

  server.start(3001).then();
```
If you use 'typeorm' you can register db config using command:
```typescript
 server.addEntities([...]); // Add typeorm entities
 server.addMigrations([...]); // Add typeorm migrations
 // The input object is ConnectionOptions from typeorm
 server.registerDb({...});
```
### What is area?
The area is a simple module which has own controllers and another code.
For example
```typescript
import {IServer, IAreaRegistration} from 'node-express-server';

export class AuthAreaRegistration implements IAreaRegistration {
  areaName: string = 'auth';

  registerArea(server: IServer) {
    server.addControllers([...]); // Add controllers
    server.addEntities([...]); // Add typeorm entities
    server.addMigrations([...]); // Add typeorm migrations
    ...
  }
}
```
Example code structure
```
src
  areas
    auth
      controllers
        -usersController.ts
      entities
        -userEntity.ts
      repositories
        -usersRepository.ts
      -authAreaRegistration.ts
    ... // Enother areas
  controllers
    -productsController.ts
  entities
    -productEntity.ts
  helpers
  -index.ts
```
