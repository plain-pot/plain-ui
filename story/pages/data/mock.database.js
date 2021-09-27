/*
const fs = require('fs')
const path = require('path')
const mock = require('mockjs').mock

const createGeneratoe = (options) => {
    const {length} = options
    return () => {
        return options[Math.floor(Math.random() * length)]
    }
}

const nextFlag = createGeneratoe(['Y', 'N'])
const nextSelect = createGeneratoe(['potential', 'store', 'consumer'])

function generate() {
    const data = (mock({
        [`array|${100}`]: [
            {
                id: '@guid',
                created_at: '@datetime',
                created_by: '@first',
                updated_at: '@datetime',
                updated_by: '@first',
                normal_text: '@first',
                long_text: '@paragraph',
                'number_val|1-100': 100,
                flag: nextFlag,
                select_val: nextSelect,
                color_val: '@color',
                date_val: '@datetime',
                time_val: '@time',
                parent_id: '',
                image_id: '',
            }
        ]
    })).array;

    fs.writeFileSync(path.resolve(__dirname, `./demo.json`), JSON.stringify(data, null, 2,))
}

generate()
*/
