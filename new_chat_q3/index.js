import './connections/server.js';
import { connectRabbitMQ } from './connections/amqp.js';
import config from "./config/config.js";
import { connectDB } from './connections/mongo.js';
import { services } from './services/services.js';

async function startConsumer() {
    try {
        await connectDB();
        const { queue, exchange } = config
        const { channel } = await connectRabbitMQ();
        channel.prefetch(config.max_cant_queue);// Limita la cantidad de mensajes que el servidor enviará al consumidor antes de recibir un ack 

        console.log("[✔] Conectado a RabbitMQ");

        channel.consume(queue, async (message) => {
            console.log(`\n🚀 Escuchando mensajes del routing key '${config.routingKey}'...`);
            const { id_chat, intento, libreria } = JSON.parse(message.content.toString()); //Extrae el contenido del mensaje y lo convierte en un objeto JSON

            const [res, id, error] = await services(id_chat, libreria) // Llama a la función services y le pasa el nombre de la colección
            if (res) {
                channel.ack(message) // Envía un ack al servidor para confirmar que el mensaje fue recibido
                console.log(`📝 Documento creado id_chat: ${id} , en la bases de datos: ${config.nameBD}`);
                channel.publish(exchange, config.routingKeyNext, Buffer.from(JSON.stringify({ id_chat, libreria, intento: 1 })));
                console.log(`📤 Enviando mensaje a ${config.routingKeyNext}`);
            } else {
                if (intento < 3) {
                    console.log(`🔄 Reintentando mensaje (${intento + 1}/3)...`);
                    channel.publish(exchange, config.routingKey, Buffer.from(JSON.stringify({ id_chat,intento: intento + 1, libreria })), { expiration: 5000 });
                } else {
                    channel.sendToQueue(config.queueErrors, Buffer.from(JSON.stringify(error)));
                    console.log(`💀 Enviando mensaje a ${config.queueErrors}`)
                }
                channel.ack(message)
            }
        })
    } catch (error) {
        const e = new CustomError(`Error desconocido en la creación del documento. ${error.message}`, { collecion , id_chat});
        console.log(`💀 Enviando mensaje a ${config.queueErrors}`)
        channel.ack(message)
        channel.sendToQueue(config.queueErrors, Buffer.from(JSON.stringify(e.res)));
    }

}

startConsumer();
console.log("hola mundo"); 