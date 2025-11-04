import amqp from 'amqplib';

export async function connectRabbitMQ(url: string) {
  const conn = await amqp.connect(url);
  const channel = await conn.createChannel();
  await channel.assertExchange('smartpet.events', 'topic', { durable: false });
  return channel;
}

export async function publishEvent(channel: amqp.Channel, routingKey: string, payload: object) {
  channel.publish('smartpet.events', routingKey, Buffer.from(JSON.stringify(payload)));
}

export async function consumeEvent(channel: amqp.Channel, routingKey: string, handler: (msg: any) => void) {
  const q = await channel.assertQueue('', { exclusive: true });
  channel.bindQueue(q.queue, 'smartpet.events', routingKey);
  channel.consume(q.queue, msg => {
    if (msg) {
      handler(JSON.parse(msg.content.toString()));
      channel.ack(msg);
    }
  });
}