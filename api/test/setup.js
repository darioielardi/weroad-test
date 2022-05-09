/* eslint-disable @typescript-eslint/no-var-requires */
const { MikroORM } = require('@mikro-orm/core');
const ormConfig = require('../mikro-orm.config').default;

require('dotenv').config({ path: '.env.test' });

module.exports = async () => {
  const orm = await MikroORM.init({
    entities: ormConfig.entities,
    type: 'postgresql',
    clientUrl: process.env.DATABASE_URL,
  });

  const schemaGenerator = orm.getSchemaGenerator();

  await schemaGenerator.refreshDatabase();
  await schemaGenerator.clearDatabase();

  await orm.close();
};
