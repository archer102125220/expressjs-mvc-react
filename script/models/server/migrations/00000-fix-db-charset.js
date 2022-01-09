'use strict';

export default {
  up: (queryInterface) => {
    const { database, dialectOptions, dialect } = queryInterface.sequelize.config;
    const { charset } = dialectOptions, { collate } = dialectOptions;
    const mySql = `ALTER DATABASE ${database}
      CHARACTER SET ${charset || 'utf8'} COLLATE ${collate || 'utf8_general_ci'};`;
    const msSql = 'SELECT 11';

    return queryInterface.sequelize.query(dialect === 'mysql' ? mySql : msSql);
  },
  // down: (queryInterface, Sequelize) => { }
};