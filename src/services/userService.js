const BaseRepository = require("../repository/base/baseRepository");

class UserService {
  constructor({ users }) {
    this._userRepository = new BaseRepository({ repository: users })
  }

  async getUserData(userId) {
    const { password, cpf, ...nonInsecureUserData } = await this._userRepository.find(userId);
    return nonInsecureUserData;
  }
}

module.exports = UserService;
