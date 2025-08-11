// clear-db.js
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db'); // ajuste se o nome/path for outro
const db = new Database(dbPath);

db.prepare('DELETE FROM devolucoes').run();
db.prepare('DELETE FROM movimentacoes').run();
// opcional: economiza espaço em disco
db.prepare('VACUUM').run();

console.log('✅ Banco limpo com sucesso.');
