'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class videoList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ userList, videoList }) {
      // define association here
      videoList.belongsTo(userList, { foreignKey: 'owner', targetKey: 'id' });
      userList.hasMany(videoList, { foreignKey: 'id', targetKey: 'owner' });
    }
  };
  videoList.init({
    videoName: DataTypes.STRING,
    videoScreenshot: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    video: DataTypes.STRING,
    owner: {
      type: DataTypes.INTEGER,
      references: [
        { //外來鍵 https://itbilu.com/nodejs/npm/EJarwPD8W.html
          model: 'userLists',
          key: 'id'
        },
        {
          model: 'videoJurisdictions',
          key: 'videoListId'
        }
      ],
    },
  }, {
    sequelize,
    modelName: 'videoList',
  });
  return videoList;
};