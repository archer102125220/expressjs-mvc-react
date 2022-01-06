'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class videoList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  videoList.init({
    videoName: DataTypes.STRING,
    video: DataTypes.STRING,
    owner: {
      type: DataTypes.INTEGER,
      references: {
        model: 'userLists',
        key: 'id'
      },
      allowNull: false
    },
    // userId: {
    //   type: Sequelize.DataTypes.INTEGER,
    //   references: {
    //     model: {
    //       tableName: 'users',
    //       schema: 'schema'
    //     },
    //     key: 'id'
    //   },
    //   allowNull: false
    // },
  }, {
    sequelize,
    modelName: 'videoList',
  });
  return videoList;
};