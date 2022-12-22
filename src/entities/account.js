class Account {
  constructor({ id, code, balanceInCents, userId }) {
    this.id = id;
    this.code = code;
    this.balanceInCents = balanceInCents;
    this.userId = userId;
  }
}

module.exports = Account;
