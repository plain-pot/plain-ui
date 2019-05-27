export default {
    name: 'pick',
    props: {
        align: {default: 'center'},
        width: {default: '32'},
        sort: {default: false},
        search: {default: false},
        placeLeft: {default: true},
        order: {default: 1000},
    },
    data() {
        const dataRows = []
        const pl_input = (val, dataRow) => {
            if (!!val) dataRows.push(dataRow)
            else {
                const index = dataRows.indexOf(dataRow)
                index > -1 && dataRows.splice(index, 1)
            }
        }
        return {
            dataRows,
            normal(h, dataRow) {
                return (
                    <pl-radio value={dataRows.indexOf(dataRow) > -1} onInput={e => pl_input(e, dataRow)}/>
                )
            },
        }
    },
}