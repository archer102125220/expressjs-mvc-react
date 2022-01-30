'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class videoJurisdiction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ videoList, userList, videoJurisdiction }) {
      // define association here
      // https://sequelize.org/master/manual/assocs.html
      videoList.belongsToMany(userList, { through: videoJurisdiction, targetKey: 'id' });
      userList.belongsToMany(videoList, { through: videoJurisdiction, targetKey: 'ownider' });
    }
  };
  videoJurisdiction.init({
    videoListId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'videoLists',
        key: 'id'
      },
    },
    userListId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'userLists',
        key: 'id'
      },
    },
    watch: DataTypes.BOOLEAN,
    download: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'videoJurisdiction',
  });
  return videoJurisdiction;
};