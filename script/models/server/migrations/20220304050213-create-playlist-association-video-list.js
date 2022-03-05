'use strict';

export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('playlistAssociationVideoLists', {
      playlistId: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'playlists',
          key: 'id'
        },
        allowNull: false
      },
      videoListId: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'videoLists',
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('playlistAssociationVideoLists');
  }
};