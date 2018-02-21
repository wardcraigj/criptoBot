'use strict';

var throttledQueue = require('throttled-queue');
var BaseService = require('./base-service').BaseService;

class TransactionService extends BaseService {

  constructor() {
    super();
    var coinbase = require('coinbase').Client;
    this.coinbaseClient = new coinbase({
      'apiKey': process.env.COINBASE_API_KEY,
      'apiSecret': process.env.COINBASE_API_SECRET
    });

    this.priceService = new (require('./js/services/price-service').PriceService)();
    this.SIMULATION_USD_WALLET_ID = 1;
    this.SIMULATION_BITCOIN_WALLET_ID = 2;

    this.walletRepo = new (require('../repositories/wallet-repository').WalletRepository)();
  }

  changeBalance(walletId, changeAmount) {
    var self = this;

    this.walletRepo.getBalance(walletId).then(function (currentBalance) {
      console.log(currentBalance.balance);
      self.walletRepo.updateBalance(walletId, currentBalance.balance + changeAmount);
    });
  }

  simulateBitcoinBuy() {
    var self= this;

    this.walletRepo.getBalance(this.SIMULATION_USD_WALLET_ID).then(function (currentUsdBalance) {

      self.priceService.getBuyPrice(function(price){
        var canBuy = self.determinePurchaseAmount(currentUsdBalance.balance, price);
        self.walletRepo.updateBalance(this.SIMULATION_USD_WALLET_ID, 0);
        self.walletRepo.updateBalance(this.SIMULATION_BITCOIN_WALLET_ID, canBuy);
      });
    });
  }

  simulateBitcoinSell() {
    var self= this;

    this.walletRepo.getBalance(this.SIMULATION_BITCOIN_WALLET_ID).then(function (currentBitcoinBalance) {

      self.priceService.getSellPrice(function(price){
        var sellValue = self.determineSaleAmount(currentBitcoinBalance.balance, price);
        self.walletRepo.updateBalance(this.SIMULATION_USD_WALLET_ID, sellValue);
        self.walletRepo.updateBalance(this.SIMULATION_BITCOIN_WALLET_ID, 0);
      });
    });
  }

  determinePurchaseAmount(balance, price) {

    return balance/price;
  }

  determineSaleAmount(balance, price) {

    return balance*price;
  }

}

module.exports.TransactionService = TransactionService;