'use strict';

var PriceRepository = require('../repositories/price-repository').PriceRepository;
var throttledQueue = require('throttled-queue');
var BaseService = require('./base-service').BaseService;

class PriceService extends BaseService {

  constructor() {
    super();
    this.MAX_HISTORIC_DAYS = 30;
    this.HISTORIC_PRICE_INTERVAL_MILLESECONDS = 86400 * 1000;

    var coinbase = require('coinbase').Client;
    this.coinbaseClient = new coinbase({
      'apiKey': process.env.COINBASE_API_KEY,
      'apiSecret': process.env.COINBASE_API_SECRET
    });

    this.priceRepo = new PriceRepository();
  }

  populateHistoricalPrices() {

    var self = this;
    var currentTime = Date.now();
    var backLimitTime = currentTime - (this.MAX_HISTORIC_DAYS * 8.64e+7);

    this.priceRepo.getLastPriceTimestamp().then(function (lastPriceTime) {
      var timeBack = 0;

      if (lastPriceTime) {
        timeBack = lastPriceTime.timestamp + self.HISTORIC_PRICE_INTERVAL_MILLESECONDS;
      }

      if (timeBack < backLimitTime) {
        timeBack = backLimitTime;
      }

      for (var i = timeBack; i <= currentTime; i = i + self.HISTORIC_PRICE_INTERVAL_MILLESECONDS) {
        self.populateSpotPriceForTimestamp(i);
        i += self.HISTORIC_PRICE_INTERVAL_MILLESECONDS;
      }
    });
  }

  populateSpotPriceForTimestamp(timestamp) {
    var dateString = this.formatTimestampForCoinbase(timestamp);
    var self = this;

    this.apithrottle(function () {
      self.coinbaseClient.getSpotPrice({ 'currencyPair': 'BTC-USD', 'date': dateString }, function (err, price) {

        if (price) {
          self.priceRepo.addPriceToDatabase(timestamp, price.data.amount);
        } else {
          console.log(err);
        }
      });
    });
  }
}

module.exports.PriceService = PriceService;