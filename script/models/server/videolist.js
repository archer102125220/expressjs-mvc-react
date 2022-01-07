'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class videoList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.videoList.hasOne(models.userList, { foreignKey: 'id' });
      models.userList.hasMany(models.videoList, { foreignKey: 'owner' });
    }
  };
  videoList.init({
    videoName: DataTypes.STRING,
    video: DataTypes.STRING,
    owner: {
      type: DataTypes.INTEGER,
      references: { //外來鍵 https://itbilu.com/nodejs/npm/EJarwPD8W.html
        model: 'userLists',
        key: 'id'
      },
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'videoList',
  });
  return videoList;
};