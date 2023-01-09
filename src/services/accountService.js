const BaseRepository = require("../repository/base/baseRepository");
class AccountService {
  constructor({TransactionService, BaseRepository}) {
    this._accountsRepository = new BaseRepository({ repository: 'accounts' });
    this.transactionService = new TransactionService(BaseRepository);
  }

  _formatValueInCentsToPtBrCurrency(valueInCents) {
    return new Intl.NumberFormat('pt-BR',{ style: 'currency', currency: 'BRL' }).format(valueInCents / 100);
  }

  async _getAccountByUserId(userId) {
    const accounts = await this._accountsRepository.getAll();
    const userAccount = accounts.find(account => account.userId === userId);
    return userAccount;
  }

  async getAccountByCode(accountCode) {
    const accounts = await this._accountsRepository.getAll();
    const userAccount = accounts.find(account => account.code === accountCode);
    return userAccount;
  }

  async getBalance(userId) {
    const userAccount = await this._getAccountByUserId(userId);

    return { 
      balance: this._formatValueInCentsToPtBrCurrency(userAccount.balanceInCents),
    }
  }

  async transfer({userId, valueInCents, toCode}) {
    const fromAccount = await this._getAccountByUserId(userId)
    const newFromBalanceInCents = fromAccount.balanceInCents - valueInCents;
    if (newFromBalanceInCents < 0) throw new Error('Saldo insuficiente!');

    const toAccount = await this.getAccountByCode(toCode);
    const newToBalanceInCents = toAccount.balanceInCents + valueInCents;

    await this._accountsRepository.update(fromAccount.id, { balanceInCents: newFromBalanceInCents });
    await this._accountsRepository.update(toAccount.id, { balanceInCents: newToBalanceInCents });
   
    await this.transactionService.createNewTransaction({
      accountId: fromAccount.id,
      valueInCents,
      type: 'debit'
    });
    await this.transactionService.createNewTransaction({
      accountId: toAccount.id,
      valueInCents,
      type: 'credit'
    });

    return {
      fromPrevBalance: this._formatValueInCentsToPtBrCurrency(fromAccount.balanceInCents),
      fromNewBalance: this._formatValueInCentsToPtBrCurrency(newFromBalanceInCents),
      toPrevBalance: this._formatValueInCentsToPtBrCurrency(toAccount.balanceInCents),
      toNewBalance: this._formatValueInCentsToPtBrCurrency(newToBalanceInCents),
    }
  }

  async deposit({accountCode, valueInCents}) {
    const accountData = await this.getAccountByCode(accountCode);
    const newBalanceInCents = accountData.balanceInCents + valueInCents;

    await this._accountsRepository.update(accountData.id, { balanceInCents: newBalanceInCents });
    await this.transactionService.createNewTransaction({
      accountId: accountData.id,
      valueInCents,
      type: 'credit'
    });

    return { ...accountData, balanceInCents: newBalanceInCents }
  }

  async getExtract({ userId, initialDate, endDate }) {
    const account = await this._getAccountByUserId(userId);
    const extract = await this.transactionService.getTransactionsByAccountPerPeriod({
      accountId: account.id,
      initialDate,
      endDate
    })

    return extract;
  }
}

module.exports = AccountService;
