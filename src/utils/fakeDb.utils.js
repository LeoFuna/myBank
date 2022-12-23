const simulateQuery = (whenResolved) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(whenResolved)
    }, 1000)
  })
}

module.exports = { simulateQuery };