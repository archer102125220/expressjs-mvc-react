'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('videoLists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      videoName: {
        type: Sequelize.STRING
      },
      videoScreenshot: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      video: {
        type: Sequelize.STRING
      },
      video_Id: {
        // type: Sequelize.INTEGER
        type: Sequelize.UUID
      },
      owner: {
        type: Sequelize.INTEGER,
        references: {
          model: 'userLists',
          key: 'id'
        },
        allowNull: false
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
    await queryInterface.dropTable('videoLists');
  }
};