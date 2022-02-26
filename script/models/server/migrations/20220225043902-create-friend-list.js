'use strict';

export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('FriendLists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      friend_id: {
        type: Sequelize.UUID
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'userLists',
          key: 'id'
        },
        allowNull: false
      },
      friend: {
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('FriendLists');
  }
};