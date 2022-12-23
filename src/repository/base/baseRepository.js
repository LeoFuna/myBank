const { join } = require('path');
const { readFile } = require("fs/promises");
class BaseRepository {
  constructor({ repository }) {
    this._repository = repository;
    this._databasePath = join(__dirname, '../../../', 'database');;
  }

  async find(itemId) {
    const itemsFromDb = JSON.parse(await readFile(join(this._databasePath, `${this._repository}.json`), 'utf-8'));
    return itemsFromDb.find((element) => element.id === itemId);
  }

  async getAll() {
    const itemsFromDb = JSON.parse(await readFile(join(this._databasePath, `${this._repository}.json`), 'utf-8'));
    return itemsFromDb;
  }
};

module.exports = BaseRepository;
