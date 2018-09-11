var kafka = require('kafka-node');

var HighLevelConsumer = kafka.HighLevelConsumer;
var Client = kafka.Client;
var topic = 'topic1';
var client = new Client('172.30.1.26:2181');
var topics = [{ topic: topic }];
var options = { autoCommit: true, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 };
var consumer = new HighLevelConsumer(client, topics, options);

var HighLevelProducer = kafka.HighLevelProducer;
var count = 10;
var rets = 0;
var producer = new HighLevelProducer(client);

producer.on('ready', function () {
    setInterval(send, 1000);
});

producer.on('error', function (err) {
    console.log('error', err);
});

function send () {
    var message = new Date().toString();
    producer.send([
        {topic: topic, messages: [message]}
    ], function (err, data) {
        if (err) console.log(err);
        else console.log('send %d messages', ++rets);
        if (rets === count) process.exit();
    });
}



consumer.on('message', function (message) {
    console.log(message);
});

consumer.on('error', function (err) {
    console.log('error', err);
});
