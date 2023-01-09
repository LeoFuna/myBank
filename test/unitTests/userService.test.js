const { describe, it } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const UserService = require('./../../src/services/userService');
const validUsers = require('./../mocks/valid-users.json');
const BaseRepository = require('../../src/repository/base/baseRepository');

describe('User Service testes', () => {
  let userService = {};

  before(() => {
    userService = new UserService(BaseRepository);
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

  describe('No método changePassword', () => {
    it('dado todos os dados válidos, deve ser possível alterar a senha do usuário', async () => {
      const mockedUserData = validUsers[0];
      
      const findStub = sinon.stub(
        userService._userRepository,
        'find',
      );
      findStub.withArgs(mockedUserData.id).returns(mockedUserData);
      const updateStub = sinon.stub(
        userService._userRepository,
        'update',
      );
      updateStub.withArgs(mockedUserData.id, { password: 654321 }).returns({ ...mockedUserData, password: 654321 });

      const userData = await userService.changePassword({ userId: mockedUserData.id, newPassword: 654321, currentPassword: 123456 });

      expect(userData).to.be.deep.equal({ ...mockedUserData, password: 654321 });
    })
    it('dado senha antiga inválida, não deve alterar senha e apresentar erro', async () => {
      const mockedUserData = validUsers[0];
      
      const findStub = sinon.stub(
        userService._userRepository,
        'find',
      );
      findStub.withArgs(mockedUserData.id).returns(mockedUserData);
      const updateStub = sinon.stub(
        userService._userRepository,
        'update',
      );
      updateStub.withArgs(mockedUserData.id, { password: 654321 }).returns({ ...mockedUserData, password: 654321 });

      const userData = await userService.changePassword({ userId: mockedUserData.id, newPassword: 654321, currentPassword: 111111 })
        .catch((e) => {
          expect(e.message).to.be.equal('Senha inválida!');
          expect(updateStub.callCount).to.have.equal(0);
        });

      if (!userData) {
        return;
      }
      expect(userData).to.be.an('error');
    })
  })
})