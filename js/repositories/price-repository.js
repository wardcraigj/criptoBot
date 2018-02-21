    'use strict';

var BaseRepository = require('./base-repository').BaseRepository;

class PriceRepository extends BaseRepository {
    
  addPriceToDatabase(time, spotPrice = 0, buyPrice = 0, sellPrice = 0) {

    var priceId = this.db.insert({
      spot_price: spotPrice,
      buy_price: buyPrice,
      sell_price: sellPrice,
      timestamp: time
    })
    .into('prices')
    .then(function (id) {
      console.log('inserted spot: ' +spotPrice + ' id: ' + id);
    });

  }

  getLastPriceTimestamp() {

    
    return this.db.select('timestamp').from('prices').orderBy('timestamp','desc').first().then();
  }

}

module.exports.PriceRepository = PriceRepository;