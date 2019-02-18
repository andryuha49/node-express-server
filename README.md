# node-express-server
Simple node server with express


## Examples
```typescript
import {server} from 'node-express-server';
import {UsersController} from './controllers/usersController';

// Use i18n
server.useI18n({directory: __dirname + '/assets/i18n'});

// Use routing-controllers
server.useApi([UsersController]);

// Use swagger
server.useSwagger('/api/swagger-ui');

// Use static
server.useStatic(__dirname + '/../clint');

server.start(3001);
```
