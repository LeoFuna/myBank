const BaseRepository = require("../repository/base/baseRepository");
const AccountService = require("./accountService");

class TransactionService {
  constructor() {
    this.transactionRepository = new BaseRepository({ repository: 'transactions' })
  }

  async createNewTransaction({accountCode, valueInCents, type}) {
    const accountService = new AccountService();
    const { id } = await accountService.getAccountByCode(accountCode);
    return await this.transactionRepository.create({
      valueInCents,
      accountId: id,
      type,
      createdAt: new Date(),
    })
  }
}

module.exports = TransactionService;
