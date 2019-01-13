var kafka = require('kafka-node');

var Client = kafka.Client;
// var client = new Client('59.6.40.128:2181');
var client = new Client('172.30.1.31:2181');

var HighLevelProducer = kafka.HighLevelProducer;
var producer = new HighLevelProducer(client);
var isReady = false;

producer.on('ready', function () {
    console.log('ready!');
    isReady = true;
});

producer.on('error', function (err) {
    console.log('producer error', err);
    isReady = false;
});

/*var options = { autoCommit: true, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024, groupId: '1q2w3e4r' };
var consumer = new kafka.HighLevelConsumer(client, [{topic: 'Monitoring'}, {topic: 'Statistics'}], options);

consumer.on('message', function (message) {
    console.log('received', message);
});

consumer.on('error', function (err) {
    console.log('consumer error', err);
});*/

exports = module.exports = function (message, topic) {
    isReady && producer.send([
        {topic: topic, messages: message}
    ], function (err, data) {
        if (err) console.log(err);
        else console.log('send messages', JSON.stringify(data));
    });
};