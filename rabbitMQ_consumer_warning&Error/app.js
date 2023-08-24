const amqp = require('amqplib');



async function warningErrorConsumer()  {
    try {
        
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
    
        await channel.assertExchange("infoExchange", "direct");
    
        const q= await channel.assertQueue("warningErrorQueue");
        await channel.bindQueue(q.queue, "logExchange", "warningError");// warningError
    
        channel.consume(q.queue, (msg)=>{
            const data = JSON.parse(msg.content);
    
            console.log(data);
            channel.ack(msg);
        })
    } catch (error) {
        console.log("errrrr=======> warning error====>",error);
        throw error;
    }
}

warningErrorConsumer()