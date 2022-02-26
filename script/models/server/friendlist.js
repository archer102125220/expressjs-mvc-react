'use strict';

import uuid from 'uuid/v4';

export default (sequelize, DataTypes) => {
  const FriendList = sequelize.define('FriendList', {
    id: DataTypes.INTEGER,
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
  FriendList.associate = function (models) {
    // associations can be defined here
  };
  return FriendList;
};