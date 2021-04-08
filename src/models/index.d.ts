import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Level {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly parentID?: string;
  constructor(init: ModelInit<Level>);
  static copyOf(source: Level, mutator: (draft: MutableModel<Level>) => MutableModel<Level> | void): Level;
}