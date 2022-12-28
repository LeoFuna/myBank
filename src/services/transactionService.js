const BaseRepository = require("../repository/base/baseRepository");

class TransactionService {
  constructor() {
    this.transactionRepository = new BaseRepository({ repository: 'transactions' });
  }

  async _getTransactionsOrderedByDate() {
    const transactions = await this.transactionRepository.getAll();
    const sortedTransactions = transactions.sort((tran1, tran2) => {
      if (new Date(tran1.createdAt).getTime() > new Date(tran2.createdAt).getTime()) return -1;
      if (new Date(tran1.createdAt).getTime() < new Date(tran2.createdAt).getTime()) return 1;
      return 0;
    });
    return sortedTransactions;
  }

  _filterTransactionsByAccountAndPeriod({transactions, accountIdFilter, initialDate, endDate}) {
    return transactions.filter(({ accountId, createdAt }) => {
      const isFromAccountSelected = accountId === accountIdFilter;
      if (!initialDate || !endDate) return isFromAccountSelected;

      const isInPeriod = new Date(createdAt).getTime() >= new Date(initialDate).getTime() &&
        new Date(createdAt).getTime() <= new Date(endDate).getTime();
      return isFromAccountSelected && isInPeriod;
    });
  }

  async createNewTransaction({accountId, valueInCents, type}) {
    return await this.transactionRepository.create({
      valueInCents,
      accountId,
      type,
      createdAt: new Date(),
    })
  }

  async getTransactionsByAccountPerPeriod({ accountId, initialDate, endDate }) {
    const transactions = await this._getTransactionsOrderedByDate();

    const transactionsFromAccountByPeriod = this._filterTransactionsByAccountAndPeriod({
      transactions,
      accountIdFilter: accountId,
      endDate,
      initialDate,
    });

    const serializedTransactions = transactionsFromAccountByPeriod.reduce((acc, curr) => {
      const onDateCreatedAt = new Date(curr.createdAt);
      const formatedDate = new Intl.DateTimeFormat('pt-BR').format(onDateCreatedAt);
      const currencyFormated = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(curr.valueInCents / 100);

      return `${acc}\n${formatedDate} ${curr.type === 'credit' ? '+' : '-'} ${ currencyFormated }`;
    }, '');

    return serializedTransactions
  }
}

module.exports = TransactionService;
