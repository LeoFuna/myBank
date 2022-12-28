## Use Case 01
Como usuário do sistema
Dado o número de um cliente
Deve ser possível ver o saldo disponível no formato `R$ XXX,XX`.

## Use Case 02
Como usuário do sistema
Para se fazer uma transação entre contas.
Dado o valor a ser retirado, o saldo atual e a conta de destino.
Deve ser feito o débito do referido valor na conta de origem e crédito na conta de destino.
Deve ser adicionada uma nova transaçao de débito na conta de origem, com data no formato `Date`
Deve ser adicionada uma nova transaçao de crédito na conta de destino, com data no formato `Date`

## Use Case 03
Como usuário do sistema
Dado o número da conta e valor
Deve ser possível fazer um depósito
Esse valor deve somar ao saldo total
Deve ser adicionada uma nova transaçao de crédito na conta, com data no formato `Date`.

## Use Case 04
Como usuário do sistema
Dado o número de uma conta e um periodo inicial e final
Deve ser possível ver todas as transações realizadas dentro do período
Deve ter o formato `20/03/22 - R$ 50,00`