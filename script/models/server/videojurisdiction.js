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
      // videoList.belongsToMany(
      //   userList,
      //   {
      //     through: {
      //       model: videoJurisdiction,
      //     },
      //     foreignKey: 'videoListId',
      //     targetKey: 'id'
      //   }
      // );
      // userList.belongsToMany(
      //   videoList,
      //   {
      //     through: {
      //       model: videoJurisdiction,
      //     },
      //     foreignKey: 'userListId',
      //     targetKey: 'id'
      //   }
      // );

      videoList.hasMany(videoJurisdiction, { foreignKey: { name: 'id' }, targetKey: 'videoListId' });
      videoJurisdiction.belongsTo(videoList, { foreignKey: { name: 'videoListId', allowNull: true }, targetKey: 'id' });

      userList.hasMany(videoJurisdiction, { foreignKey: { name: 'id' }, targetKey: 'userListId' });
      videoJurisdiction.belongsTo(userList, { foreignKey: { name: 'userListId', allowNull: true }, targetKey: 'id' });
    }
  }
  videoJurisdiction.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
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