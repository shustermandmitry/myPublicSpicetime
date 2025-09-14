class Collection {
  constructor(name) {
    this.name = name;
  }

  _ensureIndex() {}

  findOne(prop) {
    return this[prop];
  }

  upsert({ _id }, { v }) {
    this[_id] = v;
  }

  remove(prop) {
    delete this[prop];
  }
}

export const Meteor = {
  Collection,
  isDevelopment: true,
  setTimeout,
  clearTimeout,
  bindEnvironment: fn => fn,
  settings: {
    bots: {},
  },
  absoluteUrl: link => 'http://localhost:3000' + link,
};
