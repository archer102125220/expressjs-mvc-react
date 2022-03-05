'use strict';

import uuid from 'uuid/v4';

export default (sequelize, DataTypes) => {
  const Playlist = sequelize.define('playlist', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: DataTypes.STRING,
    playlist_id: {
      type: DataTypes.UUID,
      defaultValue: uuid,
    },
  }, {});
  // Playlist.associate = function (models) {
  //   // associations can be defined here
  // };
  return Playlist;
};