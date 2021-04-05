'use strict';

export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('userLists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      account: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      avater: {
        type: process.env.BUFFER_IMAGE ? Sequelize.BLOB : Sequelize.STRING,
        allowNull: false
      },
      account_Id: {
        // type: Sequelize.INTEGER
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('userLists');
  }
};