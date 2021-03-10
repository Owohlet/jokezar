'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('Users',  'email', Sequelize.STRING,)
    await queryInterface.addColumn('Users',  'password', Sequelize.STRING )


  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'email')
    await queryInterface.removeColumn('Users', 'password')
  }
};
