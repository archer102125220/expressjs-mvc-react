'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('videoJurisdictions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      videoId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'videoLists',
          key: 'id'
        },
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'userLists',
          key: 'id'
        },
        allowNull: false
      },
      watch: {
        type: Sequelize.BOOLEAN
      },
      download: {
        type: Sequelize.BOOLEAN
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('videoJurisdictions');
  }
};