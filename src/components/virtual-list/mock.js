const mock = require('mockjs').mock

const list = []

list.push(...(mock({
    "array|10": [
        {
            "id|+1": 0,
            color: '@color',
            name: '@first',
            "star|1-10": '★',
        }
    ]
})).array)

console.log(JSON.stringify(list, null, 2))