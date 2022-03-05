'use strict';

export default (sequelize, DataTypes) => {
  const playlistAssociationVideoList = sequelize.define('playlistAssociationVideoList', {
    playlistId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'playlists',
        key: 'id'
      },
      allowNull: false
    },
    videoListId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'videoLists',
        key: 'id'
      },
      allowNull: false
    },
  }, {});
  playlistAssociationVideoList.associate = function ({ playlist, videoList, playlistAssociationVideolist }) {
    // associations can be defined here
    playlist.belongsToMany(
      videoList,
      {
        through: {
          model: playlistAssociationVideolist,
        },
        foreignKey: 'playlistId',
        targetKey: 'id'
      }
    );
    videoList.belongsToMany(
      playlist,
      {
        through: {
          model: playlistAssociationVideolist,
        },
        foreignKey: 'videoListId',
        targetKey: 'id'
      }
    );

    playlist.hasMany(playlistAssociationVideolist, { foreignKey: { name: 'id' }, targetKey: 'playlistId' });
    playlistAssociationVideolist.belongsTo(playlist, { foreignKey: { name: 'playlistId', allowNull: true }, targetKey: 'id' });

    videoList.hasMany(playlistAssociationVideolist, { foreignKey: { name: 'id' }, targetKey: 'videoListId' });
    playlistAssociationVideolist.belongsTo(videoList, { foreignKey: { name: 'videoListId', allowNull: true }, targetKey: 'id' });
  };
  return playlistAssociationVideoList;
};