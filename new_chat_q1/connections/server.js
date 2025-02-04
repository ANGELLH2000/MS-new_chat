import express from 'express'
import config from '../config/config.js'

const { port, nameMicroservice } = config
const app = express();
app.get('/', (req, res) => {
    res.send(`${nameMicroservice} esta corriendo en cloud run`);
});
app.listen(port, () => {
    console.log(`${nameMicroservice} esta corriendo en el puerto ${port}`);
})