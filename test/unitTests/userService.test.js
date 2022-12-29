const { describe, it } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const UserService = require('./../../src/services/userService');
const validUsers = require('./../mocks/valid-users.json');

describe('User Service testes', () => {
  let userService = {};

  before(() => {
    userService = new UserService();
  })
  afterEach(() => {
    sinon.restore();
  })

  describe('No método getUserData', () => {
    it('dado um userId válido, deve ser possível pegar os dados do usuário', async () => {
      const mockedUserData = validUsers[0];
      
      const stub = sinon.stub(
        userService._userRepository,
        'find',
      );
      stub.withArgs(mockedUserData.id).returns(mockedUserData)

      const userData = await userService.getUserData(mockedUserData.id);

      const { password, cpf, ...nonPrivatedData } = mockedUserData;

      expect(userData).to.be.deep.equal(nonPrivatedData);
    })
    it('dado um userId não existente, deve mandar um Erro com mensagem usuário não encontrado', async () => {
      const invalidUserId = 'not real Id';

      const stub = sinon.stub(
        userService._userRepository,
        'find',
      );
      stub.withArgs(invalidUserId).returns(null);

      const resp = await userService.getUserData(invalidUserId)
        .catch((e) => {
          expect(e.message).to.be.equal('Usuário não encontrado');
        })
      if (!resp) {
        return;
      }
      expect(resp).to.be.an('error');
    })
  })
})