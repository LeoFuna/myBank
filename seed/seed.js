const faker = require('faker');
const { join } = require('path');
const { writeFile } = require('fs/promises');
const User = require('../src/entities/user');
const Account = require('../src/entities/account');
const Transaction = require('../src/entities/transaction');

const seederBaseFolder = join(__dirname, '../', 'database');
const ITEMS_AMOUNT = 2;

const fullName = faker.name.findName();
const DEFAULT_PASSWORD = 123456;

const user = new User({
  id: faker.datatype.uuid(),
  name: fullName.split(' ')[0],
  lastName: fullName.split(' ')[1],
  cpf: faker.datatype.number({ min: 10000000000, max: 99999999999 }),
  password: DEFAULT_PASSWORD
})

const fullName2 = faker.name.findName();
const user2 = new User({
  id: faker.datatype.uuid(),
  name: fullName2.split(' ')[0],
  lastName: fullName2.split(' ')[1],
  cpf: faker.datatype.number({ min: 10000000000, max: 99999999999 }),
  password: DEFAULT_PASSWORD
})

const account = new Account({
  id: faker.datatype.uuid(),
  code: faker.datatype.number({ min: 1000, max: 9999 }),
  balanceInCents: faker.datatype.number({ min: 1000, max: 30000 }),
  userId: user.id
})

const account2 = new Account({
  id: faker.datatype.uuid(),
  code: faker.datatype.number({ min: 1000, max: 9999 }),
  balanceInCents: faker.datatype.number({ min: 1000, max: 30000 }),
  userId: user2.id
})

const transactions = [];

for(let index = 0; index<= ITEMS_AMOUNT; index ++) {
  const transaction = new Transaction({
    id: faker.datatype.uuid(),
    valueInCents: faker.datatype.number({ min: 1000, max: 3000 }),
    accountId: account.id,
    type: 'credit',
    createdAt: faker.date.past()
  })
  const transaction2 = new Transaction({
    id: faker.datatype.uuid(),
    valueInCents: faker.datatype.number({ min: 1000, max: 3000 }),
    accountId: account2.id,
    type: 'debit',
    createdAt: faker.date.past()
  })

  transactions.push(transaction);
  transactions.push(transaction2);
}

const generateFile = (filename, data) => writeFile(join(seederBaseFolder, filename), JSON.stringify(data));

(async () => {
  await generateFile('users.json', [user, user2])
  await generateFile('transactions.json', transactions)
  await generateFile('accounts.json', [account, account2])
})()