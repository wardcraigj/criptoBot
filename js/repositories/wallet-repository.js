'use strict';

var BaseRepository = require('./base-repository').BaseRepository;

class WalletRepository extends BaseRepository {

  createWallet(currency, apiKey, apiSecret, name, balance = 0) {
    return this.db.insert({
      currency: currency,
      api_key: apiKey,
      api_secret: apiSecret,
      name: name,
      balance: 0
    })
    .into('wallets')
    .then();
  }

  updateBalance(walletId, newAmount) {
    return this.db('wallets')
    .update('balance', newAmount)
    .where('wallet_id', walletId)
    .then();
  }

  getBalance(walletId) {
    return this.db.select('balance')
    .from('wallets')
    .where('wallet_id', '=', walletId)
    .first()
    .then();
  }
}

module.exports.WalletRepository = WalletRepository;