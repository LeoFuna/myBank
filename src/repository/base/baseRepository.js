const { simulateQuery } = require("../../utils/fakeDb.utils");

class BaseRepository {
  constructor({ repository }) {
    this._repository = repository;
  }

  async find(itemId) {
    const itemFound = await simulateQuery(this._repository.find((element) => element.id === itemId));
    return itemFound;
  }
};

module.exports = BaseRepository;
