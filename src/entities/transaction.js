class Transaction {
  constructor({ id, valueInCents, type, accountId, createdAt }) {
    this.id = id,
    this.valueInCents = valueInCents,
    this.type = type,
    this.accountId = accountId,
    this.createdAt = createdAt
  }
}

module.exports = Transaction;
