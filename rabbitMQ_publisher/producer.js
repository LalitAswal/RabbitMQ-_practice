const amqp = require('amqplib');
const config = require('./config')

class Producer {

    channel;

    async createChannel(){
        const  connection = await amqp.connect(config.rabbitMQ.url)
        this.channel = await connection.createChannel();

    }

    async publishMessage (routingKey, message){
        // verify that we are working on same channel
        if(!this.channel){
            await this.createChannel(); 
        }
        // using direct method of RabbitMQ
        console.log("----routingKey---------", routingKey)
        // if(routingKey == "info"){
            
        //     const exchangeName = config.rabbitMQ.exchangeName;
        //     await this.channel.assertExchange(exchangeName, "direct")
        // } else{
            const exchangeName = config.rabbitMQ.exchangeName;
            await this.channel.assertExchange(exchangeName, "direct")
        // }


        const logDetails = {
            logType:routingKey,
            message:message,
            dateTime: new Date(),
        }

        await this.channel.publish(exchangeName, routingKey,
            Buffer.from(JSON.stringify({logDetails})) 
            );

            console.log(` the message ${message} is sent to change ${exchangeName}`);
    }



}

module.exports = Producer;