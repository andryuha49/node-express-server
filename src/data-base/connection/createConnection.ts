import {createConnection as createTypeOrmConnection} from 'typeorm';
import {SnakeCaseNamingStrategy} from './snakeCaseNamingStrategy';

function createConnection(entities: any[] = [], migrations: any[] = [], dbConfig: any) {

  const entitiesArray = []
    .concat(entities);
  const migrationsArray = ['migrations/*.js'].concat(migrations);

  return new Promise((resolve, reject) => {
    try {
      const conf = {
        ...dbConfig,
        migrationsTableName: '_migrations',
        migrations: migrationsArray,
        entities: entitiesArray,
        namingStrategy: new SnakeCaseNamingStrategy()
      };
      createTypeOrmConnection(conf).then((connection: any) => {
        resolve(connection);
      }).catch((e: any) => {
        reject(e);
      });

    } catch (e) {
      return reject(e);
    }
  });
}

export {createConnection};