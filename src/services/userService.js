class UserService {
  constructor(BaseRepository) {
    this._userRepository = new BaseRepository({ repository: 'users' });
  }

  async getUserData(userId) {
    const userData = await this._userRepository.find(userId);

    if (!userData) throw new Error('Usuário não encontrado');

    const { password, cpf, ...nonInsecureUserData } = userData;

    return nonInsecureUserData;
  }

  async changePassword({userId, newPassword, currentPassword}) {
    const { password } = await this._userRepository.find(userId);

    if (password !== currentPassword) throw new Error('Senha inválida!');

    return await this._userRepository.update(userId, { password: newPassword });
  }
}

module.exports = UserService;
