// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Level } = initSchema(schema);

export {
  Level
};