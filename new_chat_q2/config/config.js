import dotenv from "dotenv";
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

//Package.json
const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json')));
const nameMicroservice = packageJson.name;

//Server connection
const port = process.env.PORT || 3000;

//Mongo connection
const nameBD = "BD_Chat_costos"
const mongoUri = process.env.MONGO_URI + nameBD;


//Amqp connection
const amqpUrl = process.env.AMQP_URL;
const exchange = "new_chat";
const queueErrors = "Errores_Data";
const queue = "Q2";
const routingKey = "paso2";
const routingKeyNext = "paso3";
const max_cant_queue = 10;

export default { exchange, queueErrors, queue, amqpUrl, routingKey, routingKeyNext, max_cant_queue, port, nameMicroservice, nameBD, mongoUri };