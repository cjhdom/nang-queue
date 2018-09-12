let list = [];

let seq = 0;
let totalBounce = 0;

exports = module.exports = {
    select: function (guid) {
        const result = list.find(findByGuid(guid));
        return result || null
    },

    getTop: function (length) {
        return list.splice(0, length);
    },

    insert: function (guid) {
        const data = {
            guid,
            seq: seq++
        };
        list.push(data);
        return data
    },

    remove: function (guid, isBounce) {
        const index = list.findIndex(findByGuid(guid));
        if (index === -1) {
            return false;
        }

        list.splice(index, 1);
        isBounce && ++totalBounce;
        return true;
    },

    update: function (guid) {
        let index = list.findIndex(findByGuid(guid));
        if (!index) {
            return false;
        }

        const exp = new Date();
        const data = list[index];
        list[index] = Object.assign({}, data, {
            exp
        });

        return list[index];
    },

    length: function () {
        return list.length;
    },

    getSeq: function () {
        return seq;
    },

    getTopSeq: function () {
        return list[0] && list[0].seq || 0;
    },

    getTotalBounce: function () {
        return totalBounce;
    },

    get: function () {
        return list;
    }
};

function findByGuid(guid) {
    return (data, idx) => {
        return data.guid === guid;
    }
}

