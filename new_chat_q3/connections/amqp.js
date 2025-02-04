import amqp from "amqplib";
import config from "../config/config.js";

export async function connectRabbitMQ() {
    const { amqpUrl, exchange, queueErrors, queue, routingKey } = config;
    try {
        const connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();

        await channel.assertExchange(exchange, 'direct', { durable: true });// Crea el exchange new_chat
        await channel.assertQueue(queue, { durable: true });// Crea la cola Q0
        await channel.bindQueue(queue, exchange, routingKey);// Asocia la cola Q0 al exchange new_chat con la routingKey paso1  

        await channel.assertQueue(queueErrors, { durable: true });// Crea la cola Errores_Data
        
        return { connection, channel };
    } catch (error) {
        console.error("[❌] Error conectando a RabbitMQ:", error);
        process.exit(1);
    }
}
