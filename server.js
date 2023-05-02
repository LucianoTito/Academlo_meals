require('dotenv').config();
const app = require('./app');
const { db } = require('./database/config');
const initModel = require('./models/initModel');

//LA AUTENTICACIÓN CON LA BASE DE DATOS
db.authenticate()
  .then(() => console.log('Database Authenticated ✔'))
  .catch((error) => console.log(error));

//RELACIONES SQL
initModel();

//LA SINCRONIZACIÓN CON LA BASE DE DATOS
db.sync()
  .then(() => console.log('Database Synced! ✔'))
  .catch((error) => console.log(error));

console.log('Somos campeones del mundo ⭐⭐⭐!');

const port = +process.env.PORT || 3200;
app.listen(port, () => {
  console.log(`App Running on port ${port}`);
});
