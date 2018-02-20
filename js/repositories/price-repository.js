    'use strict';

var BaseRepository = require('./base-repository').BaseRepository;

class PriceRepository extends BaseRepository {
    
  addPriceToDatabase(time = Date.now(), buyPrice = 0, sellPrice = 0, spotPrice = 0) {

    var priceId = this.db.insert({
      spot_price: spotPrice,
      buy_price: buyPrice,
      sell_price: sellPrice,
      timestamp: time
    })
    .into('prices')
    .then(function (id) {
      console.log(id);
    });

  }

  getLastPriceTimestamp() {
    return 0;
  }

}

module.exports.PriceRepository = PriceRepository;