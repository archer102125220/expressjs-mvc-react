// import fs from 'fs';
// import path from 'path';
// import _ from 'lodash';
import _Sequelize from 'sequelize';
import databaseConfig, { pluginBatabases } from '@config/models/database';
// import userList from '@models/server/userlist';

// const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// const config = _.get(databaseConfig, env, {});
// console.log((databaseConfig[env] || {}) === _.get(databaseConfig, env, {}));
const config = databaseConfig[env] || {};
// const db = {};

let _sequelize = null;
if (config.use_env_variable) {
  _sequelize = new _Sequelize(process.env[config.use_env_variable], config);
} else {
  _sequelize = new _Sequelize(config.database, config.username, config.password, config);
}

// fs
//   .readdirSync(__dirname)
//   .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
//   .forEach((file) => {
//     // const model = _.invoke(_sequelize, 'import', path.join(__dirname, file));
//     const model = _sequelize.import(path.join(__dirname, file));
//     db[model.name] = model;
//   });

const db = {
  // userList:  _sequelize.import('userList', userList),
};
Object.keys(pluginBatabases).forEach((modelName) => {
  db[modelName] = _sequelize.import(modelName, pluginBatabases[modelName]);
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = _sequelize;
db.Sequelize = _Sequelize;

// module.exports = db;
export default db;
