# node-express-server
Simple node server with express


## Examples
```typescript
import {Server} from 'node-express-server';
import {UsersController} from './controllers/usersController';
import {AuthArea} from './areas/authArea';

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
  .useApi({controllers: [UsersController]})
  // Register areas (IAreaRegistration)
  .registerAreas([AuthArea]);

  server.start(3001).then();
```

