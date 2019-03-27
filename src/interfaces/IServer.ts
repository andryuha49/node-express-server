export interface IServer {
  addControllers(controllers: any[]): void;
  addEntities(entities: any[]): void;
  addMigrations(migrations: any[]): void;
}