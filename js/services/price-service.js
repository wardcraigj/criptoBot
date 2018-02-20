'use strict';

var PriceRepository = require('../repositories/price-repository').PriceRepository;
var env = require('node-env-file');
env('.env');

class PriceService {
  
  constructor() {
    this.MAX_HISTORIC_DAYS = 30;
    this.HISTORIC_PRICE_INTERVAL_MILLESECONDS = 60000;

    this.priceRepo = new PriceRepository();
    this.dateFormat = require('date-and-time');
    
    var coinbase = require('coinbase').Client;
    
    this.coinbaseClient = new coinbase({'apiKey': process.env.COINBASE_API_KEY, 'apiSecret': process.env.COINBASE_API_SECRET});
    
  }

  populateHistoricalPrices() {

    var lastPriceTime = this.priceRepo.getLastPriceTimestamp();
    var currentTime = Date.now();
    var backLimitTime = currentTime - (this.MAX_HISTORIC_DAYS * 8.64e+7);

    var timeBack = lastPriceTime;

    if(lastPriceTime < backLimitTime) {
      timeBack = lastPriceTime;
    }

    // while(timeBack <= currentTime) {

    // }

  }

}

module.exports.PriceService = PriceService;