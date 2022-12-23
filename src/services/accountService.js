const BaseRepository = require("../repository/base/baseRepository");

class AccountService {
  constructor() {
    this._accountsRepository = new BaseRepository({ repository: 'accounts' })
  }

  _formatValueInCentsToPtBrCurrency(valueInCents) {
    return new Intl.NumberFormat('pt-BR',{ style: 'currency', currency: 'BRL' }).format(valueInCents / 100);
  }

  async _getAccountByUserId(userId) {
    const accounts = await this._accountsRepository.getAll();
    const userAccount = accounts.find(account => account.userId === userId);
    return userAccount;
  }

  async _getAccountByCode(accountCode) {
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

  async transfer(userId, valueInCents, toCode, date) {
    const { balanceInCents } = await this._getAccountByUserId(userId)
    const newBalance = balanceInCents - valueInCents;
    if (newBalance < 0) throw new Error('Saldo insuficiente!');

    const toAccount = await this._getAccountByCode(toCode);
    const newToBalance = toAccount.balanceInCents + valueInCents;

    //Pensar sobre gravar na database pelo ReadFile and WriteFilre
    // const accountsFromDb = JSON.parse(await readFile(join(databasePath, 'accounts.json'), 'utf-8'));
    // accountsFromDb[1].balanceInCents = accountsFromDb[1].balanceInCents - valueInCents
    // await writeFile(join(databasePath, 'accounts.json'), JSON.stringify(accountsFromDb))

    return {
      fromPrevBalance: this._formatValueInCentsToPtBrCurrency(balanceInCents),
      fromNewBalance: this._formatValueInCentsToPtBrCurrency(newBalance),
      toPrevBalance: this._formatValueInCentsToPtBrCurrency(toAccount.balanceInCents),
      toNewBalance: this._formatValueInCentsToPtBrCurrency(newToBalance),
    }
  }
}

module.exports = AccountService;
