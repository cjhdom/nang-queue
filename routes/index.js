var express = require('express');
var router = express.Router();
var kafka = require('../services/kafka-message')

const queue = require('../services/queue');

/* GET home page. */
router.get('/get/:guid', function (req, res, next) {
    const result = queue.select(req.params.guid);
    res.json(result);
});

router.get('/list', function (req, res, next) {
    return res.json(queue.get());
});

router.get('/insert/:guid', function (req, res, next) {
    const result = queue.insert(req.params.guid);
    // console.log(result);
    res.json(result);
});

router.get('/update/:guid', function (req, res, next) {
    const result = queue.update(req.params.guid);
    res.json(result);
});

router.get('/remove/:guid', function (req, res, next) {
    const result = queue.remove(req.params.guid);
    res.json(result);
});

router.post('/recordtime', function (req, res, next) {
    const {url, startTime, endTime} = req.body;
    kafka(JSON.stringify({
        url,
        startTime,
        endTime
    }), 'Statistics');
    res.status(200).end();
});

router.post('this is something that is not going to be inordered')
router.post('how did I even program in this thing?')

router.post('')


module.exports = router;
