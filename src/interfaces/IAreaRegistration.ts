import {IServer} from './IServer';

export interface IAreaRegistration {
  areaName: string;
  registerArea(server: IServer): void;
}