'use strict';

var BaseRepository = require('./base-repository').BaseRepository;

class PriceRepository extends BaseRepository {

  addPriceToDatabase(time, spotPrice = 0, buyPrice = 0, sellPrice = 0) {

    return this.db.insert({
      spot_price: spotPrice,
      buy_price: buyPrice,
      sell_price: sellPrice,
      timestamp: time
    })
      .into('prices')
      .then(function (id) {
        console.log('inserted id: ' + id + ' spot: ' + spotPrice  + ' buy: ' + buyPrice + ' sell: ' + sellPrice);
      });
  }

  getLastPriceTimestamp() {

    return this.db.select('timestamp').from('prices').orderBy('timestamp', 'desc').first().then();
  }

  getMostRecentPriceRelativeToTimestamp(timestamp= Date.now()){

    return this.db.select('*')
    .from('prices')
    .where('timestamp','<', timestamp)
    .orderBy('timestamp', 'desc')
    .first()
    .then();
  }
}

module.exports.PriceRepository = PriceRepository;