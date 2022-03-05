'use strict';

import uuid from 'uuid/v4';

export default (sequelize, DataTypes) => {
  const FriendList = sequelize.define('FriendList', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    friend_id: {
      type: DataTypes.UUID,
      defaultValue: uuid,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'userLists',
        key: 'id'
      },
      allowNull: false
    },
    friend: {
      type: DataTypes.INTEGER,
      references: {
        model: 'userLists',
        key: 'id'
      },
      allowNull: false
    },
  }, {});
  FriendList.associate = function ({ userList, friendList }) {
    // associations can be defined here
    userList.hasMany(friendList, { foreignKey: { name: 'id' }, targetKey: 'userId' });
    friendList.belongsTo(userList, { foreignKey: { name: 'userId', allowNull: true }, targetKey: 'id' });
  };
  return FriendList;
};