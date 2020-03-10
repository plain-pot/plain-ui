const fs = require('fs')
const path = require('path')

const mock = require('mockjs').mock

const length = 2000

fs.writeFileSync(path.resolve(__dirname, './data.json'), JSON.stringify(
    (mock({
        [`array|${length}`]: [
            {
                "id|+1": 0,
                color: '@color',
                name: '@first',
                date: '@date',
                "star|1-10": '★',
            }
        ]
    })).array,
    null,
    2,
))