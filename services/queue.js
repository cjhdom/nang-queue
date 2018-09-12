const active = require('../models/active');
const waiting = require('../models/waiting');

let totalPass = 0;
const maxActiveLength = 1;

exports = module.exports = {};

exports.get = function () {
    const activeData = active.get();
    const waitingData = waiting.get();
    return {
        activeData,
        waitingData
    }
}

exports.select = function (guid) {
    const activeData = active.select(guid);
    const waitingData = waiting.select(guid);
    return getResult(activeData, waitingData);
};

exports.insert = function (guid) {
    const waitingData = waiting.select(guid);
    const activeData = active.select(guid);

    const resultCode = getResultCode(activeData, waitingData);

    if (resultCode === 0) {
        if (active.length() < maxActiveLength) {
            active.insert(guid);
        } else {
            waiting.insert(guid);
        }
    }

    // penalty
    if (waitingData) {
        waiting.remove(guid);
        waiting.insert(guid);
    }

    return exports.select(guid);
};

exports.update = function (guid) {
    const activeData = active.select(guid);

    if (activeData) {
        return active.update(guid);
    } else {
        return new Error("not found");
    }
};

exports.remove = function (guid) {
    waiting.remove(guid);
    active.remove(guid);
};

exports.moveWaitToActive = function () {
    const activeWaitingLength = active.length();
    if (waiting.length() > 0 && activeWaitingLength < maxActiveLength) {
        const lengthDif = maxActiveLength - activeWaitingLength;
        const newActiveList = waiting.getTop(lengthDif);
        newActiveList.forEach(na => {
            na.guid && exports.insert(na.guid);
        });
        totalPass += newActiveList.length;
        console.log('moved', newActiveList.length, 'to active list');
    }
};

exports.killExpiredActive = function () {
    let removeList = [];
    active.forEach((val, key) => {
        if (val.exp <= +new Date()) {
            removeList.push(key);
        }
    });
    removeList.forEach(val => active.remove(val));
};

exports.getTotalPass = function () {
    return totalPass;
};

function getResult(activeData, waitingData) {
    return {
        resultCode: getResultCode(activeData, waitingData),
        resultData: getResultData(activeData, waitingData)
    }
}

function getResultCode(activeData, waitingData) {
    return activeData ? 2 : waitingData ? 1 : 0;
}

function getResultData(activeData, waitingData) {
    return activeData || waitingData || null;
}