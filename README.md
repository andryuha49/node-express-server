# node-express-server
Simple node server with express


## Examples
```typescript
import {server} from 'node-express-server';
import {UsersController} from './controllers/usersController';

// Use i18n
server.useI18n({directory: __dirname + '/assets/i18n'});

// Use swagger
server.useSwagger('/api/swagger-ui');

// Use static
server.useStatic(__dirname + '/../clint');

// Use cors
server.useCors({origin: '*'});

// Use body parser
server.useBodyParser({limit: '50mb'});

// Use file upload
server.fileUpload();

// Use routing-controllers
server.useApi([UsersController]);

server.start(3001);
```
