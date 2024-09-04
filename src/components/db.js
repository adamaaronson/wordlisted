import Dexie from 'dexie';

const db = new Dexie('wordlisted');
db.version(1).stores({
  wordlists: '++id, name, contents',
});

export default db;
