'use strict';

import uuid from 'uuid/v4';
import fs from 'fs';

export default (sequelize, DataTypes) => {
  const userList = sequelize.define('userList', {
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    avater: {
      type: DataTypes.STRING,
      defaultValue: process.env.BUFFER_IMAGE ? fs.readFileSync(__dirname + '/../public/assets/damage.png') : '/assets/damage.png',
    },
    account_Id: {
      type: DataTypes.UUID,
      defaultValue: uuid,
    },
    // references: { //外來鍵 https://itbilu.com/nodejs/npm/EJarwPD8W.html
    //   model: 'User', //資料表名稱
    //   key: 'id' //對應欄位
    // },
  }, {
    // tableName: 'userList',
  });
  // userList.associate = function (models) {
  //   // associations can be defined here
  // };

  return userList;
};