class User {
  constructor({ id, name, lastName, password, cpf }) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.cpf = cpf
    this.password = password;
  }
}

module.exports = User;
