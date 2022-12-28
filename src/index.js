const UserService = require("./services/userService");
const AccountService = require("./services/accountService");
const TransactionService = require("./services/transactionService");

const userService = new UserService();
const transactionService = new TransactionService();
const accountService = new AccountService({ transactionService });

(async () => {
  const useDate = await userService.getUserData('7086aadf-0445-4c1a-9b3c-63cfc971b063');
  const balance = await accountService.getBalance('7086aadf-0445-4c1a-9b3c-63cfc971b063')
  const transferResponse = await accountService.transfer({
    userId: '7086aadf-0445-4c1a-9b3c-63cfc971b063',
    valueInCents: 1000,
    toCode: 8083
  })
  const depositResponse = await accountService.deposit({ accountCode: 3906, valueInCents: 1000});
  const extract = await accountService.getExtract({
    userId: '7086aadf-0445-4c1a-9b3c-63cfc971b063',
  })

  console.log(useDate)
  console.log(balance)
  console.log(transferResponse)
  console.log(depositResponse)
  console.log(`\nExtrato: \n` ,extract)
})()