'use strict';

class BaseRepository {
  
  constructor() {
    this.db = require('knex')({
      dialect: 'sqlite3',
      debug: true,  // Enable global debug
      connection: {
        filename: 'cryptoBot.db'
      }
    });
  }
}
module.exports.BaseRepository = BaseRepository;
