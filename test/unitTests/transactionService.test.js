const { describe, it } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const BaseRepository = require('../../src/repository/base/baseRepository');
const TransactionService = require('../../src/services/transactionService');
const validAccounts = require('../mocks/valid-accounts.json');

describe('Transaction Service tests', () => {
  let transactionService = {};

  before(() => {
    transactionService = new TransactionService(BaseRepository);
  })
  afterEach(() => {
    sinon.restore();
  })

  describe('No método createNewTransaction', () => {
    it('dado parâmetros válidos para uma trnasação, deve ser possível criar essa transação', async () => {
      const mockedAccountData = validAccounts[0];
      const mockedParams = {
        valueInCents: 1000,
        accountId: mockedAccountData.id,
        type: 'credit'
      };

      const createStub = sinon.stub(
        transactionService.transactionRepository,
        'create',
      );
      createStub.returns({ ...mockedParams, createdAt: new Date('2023-01-09T17:46:18.111Z') });

      const createData = await transactionService.createNewTransaction(mockedParams);

      expect(createData).to.be.deep.equal({ ...mockedParams, createdAt: new Date('2023-01-09T17:46:18.111Z') });
    })
    it('dado parâmetros com falta, deve mandar um Erro', async () => {
      const mockedAccountData = validAccounts[0];
      const mockedParams = {
        valueInCents: 1000,
        accountId: mockedAccountData.id,
        type: 'credit',
      };

      const createStub = sinon.stub(
        transactionService.transactionRepository,
        'create',
      );
      createStub.returns(mockedParams);

      const noTypePromise = transactionService.createNewTransaction({
        valueInCents: mockedParams.valueInCents,
        accountId: mockedParams.accountId,
      })

      const noAccountIdPromise = transactionService.createNewTransaction({
        valueInCents: mockedParams.valueInCents,
        type: mockedParams.type,
      })

      const noValueInCentsPromise = transactionService.createNewTransaction({
        accountId: mockedAccountData.id,
        type: mockedParams.type,
      })

      const promises = await Promise.allSettled([noTypePromise, noAccountIdPromise, noValueInCentsPromise])
        .catch((e) => {
          expect(e.message).to.be.equal('Dados inválidos!');
          expect(createStub.callCount).to.be.equal(0)
        });

      if (!promises.find(({ status }) => status === 'fulfilled')) {
        return;
      }

      expect(promises).to.be.an('error');
    })
  })
})