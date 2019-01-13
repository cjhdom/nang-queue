const HashMap = require('hashmap');
const kafka = require('../services/kafka-message');

let map = new HashMap();

exports = module.exports = {
    select: function select(guid) {
        return map.get(guid) || null
    },
    insert: function (guid) {
        const exp = +new Date() + (1000 * 10);
        const seq = map.size + 1;
        map.set(guid, {
            exp,
            seq
        });
        const data = {
            guid,
            exp,
            seq
        };
        kafka(JSON.stringify(data), 'NextActive');
        return data;
    },
    remove: function (guid) {
        return !map.delete(guid)
            .get(guid);
    },
    update: function (guid) {
        let data = map.get(guid);
        if (!data) {
            return new Error("not found");
        }

        const exp = +new Date() + (1000 * 10);
        map.delete(guid).set(guid, Object.assign({}, data, {exp}));

        return map.get(guid);
    },
    length: function () {
        return map.size;
    },
    forEach: function (iterator) {
        map.forEach(iterator)
    },
    get: function () {
        return map;
    }
};

