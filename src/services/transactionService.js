const BaseRepository = require("../repository/base/baseRepository");

class TransactionService {
  constructor({ accountService }) {
    this.transactionRepository = new BaseRepository({ repository: 'transactions' });
    this.accountService = accountService;
  }

  async createNewTransaction({accountCode, valueInCents, type}) {
    const { id } = await this.accountService.getAccountByCode(accountCode);
    return await this.transactionRepository.create({
      valueInCents,
      accountId: id,
      type,
      createdAt: new Date(),
    })
  }
}

module.exports = TransactionService;
