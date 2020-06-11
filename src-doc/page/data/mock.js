const fs = require('fs')
const path = require('path')
const mock = require('mockjs').mock

function generate() {
    [
        {file: 'data.json', num: 2000},
        {file: 'data-1.json', num: 50},
        {file: 'data-2.json', num: 200},
    ].forEach((item) => {
        fs.writeFileSync(path.resolve(__dirname, `./${item.file}`), JSON.stringify(
            (mock({
                [`array|${item.num}`]: [
                    {
                        "id|+1": 0,
                        color: '@color',
                        name: '@first',
                        date: '@date',
                        "star|1-10": '★',
                        "size|40-80": 60,
                        addr: '@county(true)',
                        url: '@url',
                        domain: '@domain',
                        protocol: '@protocol',
                        email: '@email',
                        ip: '@ip',
                    }
                ]
            })).array,
            null,
            2,
        ))
    })
}

generate()