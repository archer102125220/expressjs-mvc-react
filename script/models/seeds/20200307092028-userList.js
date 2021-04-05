'use strict';//seeds

import crypto from 'crypto';
import uuid from 'uuid/v4';
import fs from 'fs';
const sha = crypto.createHash('sha1');

export default {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    const avater = process.env.BUFFER_IMAGE ? fs.readFileSync(__dirname + '/../../public/images/damage.png') : '/images/damage.png';

    return queryInterface.bulkInsert('userLists', [{
      account: 'admin',
      password: sha.update('123').digest('hex'),
      email: 'example@example.com',
      avater,
      account_Id: uuid(),
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
