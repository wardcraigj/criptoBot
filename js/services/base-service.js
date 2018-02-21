'use strict';

var throttledQueue = require('throttled-queue');
var dateformat = require('dateformat');


class BaseService {

  constructor() {
    this.apithrottle = throttledQueue(5, 1000);
  }

  formatTimestampForCoinbase(timestamp) {
    timestamp = Math.round(timestamp / 1000) * 1000;

    return dateformat(new Date(timestamp), "yyyy-mm-dd");
  }
}

module.exports.BaseService = BaseService;