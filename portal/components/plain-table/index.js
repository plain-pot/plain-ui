export const PLAIN_TABLE_STATUS = {
    normal: 'normal',
    insert: 'insert',
    update: 'update',
    select: 'select',
}

export const PlainTableController = {
    tables: [],
    add(table) {
        this.tables.push(table)
    },
    remove(table) {
        const index = this.tables.indexOf(table)
        if (index > -1) this.tables.splice(index, 1)
    },
    get(option) {
        for (let i = 0; i < this.tables.length; i++) {
            const table = this.tables[i];
            if (table.option === option) return table
        }
        return null
    },
}
