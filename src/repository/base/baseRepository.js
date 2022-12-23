const { join } = require('path');
const { readFile, writeFile } = require("fs/promises");
const faker = require('faker');

class BaseRepository {
  constructor({ repository }) {
    this._repository = repository;
    this._databasePath = join(__dirname, '../../../', 'database');;
  }

  async _writeFileByPath(file) {
    return await writeFile(join(this._databasePath, `${this._repository}.json`), JSON.stringify(file));
  }

  async find(itemId) {
    const itemsFromDb = JSON.parse(await readFile(join(this._databasePath, `${this._repository}.json`), 'utf-8'));
    return itemsFromDb.find((element) => element.id === itemId);
  }

  async getAll() {
    const itemsFromDb = JSON.parse(await readFile(join(this._databasePath, `${this._repository}.json`), 'utf-8'));
    return itemsFromDb;
  }

  async update(itemId, payload) {
    const items = await this.getAll();
    let newItemData = {};
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        newItemData = {
          ...item,
          ...payload,
        };
        return newItemData;
      }
      return item;
    })

    await writeFile(join(this._databasePath, `${this._repository}.json`), JSON.stringify(updatedItems));

    return newItemData;
  }

  async create(payload) {
    const items = await this.getAll();
    items.push({
      id: faker.datatype.uuid(),
      ...payload
    });

    await this._writeFileByPath(items);

    return payload;
  }
};

module.exports = BaseRepository;
