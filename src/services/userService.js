const BaseRepository = require("../repository/base/baseRepository");

class UserService {
  constructor() {
    this._userRepository = new BaseRepository({ repository: 'users' })
  }

  async getUserData(userId) {
    const { password, cpf, ...nonInsecureUserData } = await this._userRepository.find(userId);
    return nonInsecureUserData;
  }

  async changePassword(userId, newPassword, currentPassword) {
    const { password } = await this._userRepository.find(userId);

    if (password !== currentPassword) throw new Error('Senha inválida!');

    return await this._userRepository.update(userId, { password: newPassword });
  }
}

module.exports = UserService;
