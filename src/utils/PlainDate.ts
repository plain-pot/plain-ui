import fecha from 'fecha'

class PlainDate {

    displayFormat: string = null                                        // 显示值格式字符串
    valueFormat: string = null                                          // 实际值格式字符串
    dateObject: Date = null                                             // 日期对象

    constructor(value, displayFormat, valueFormat) {
        this.displayFormat = displayFormat
        this.valueFormat = valueFormat

        if (!!value) {
            this.setValue(value)
        }
    }

    get year() {
        if (!!this.dateObject) return this.dateObject.getFullYear()
        else return null
    }

    get month() {
        if (!!this.dateObject) return this.dateObject.getMonth()
        else return null
    }

    get date() {
        if (!!this.dateObject) return this.dateObject.getDate()
        else return null
    }

    get hour() {
        if (!!this.dateObject) return this.dateObject.getHours()
        else return null
    }

    get minute() {
        if (!!this.dateObject) return this.dateObject.getMinutes()
        else return null
    }

    get second() {
        if (!!this.dateObject) return this.dateObject.getSeconds()
        else return null
    }

    get day() {
        if (!!this.dateObject) return this.dateObject.getDay()
        else return null
    }

    setValue(value: string) {
        if (!value) {
            this.dateObject = null
        } else {
            this.dateObject = PlainDate.parse(value, this.valueFormat)
        }
    }

    static format(dateObject: Date, formatString: string) {
        if (!dateObject) return null
        else {
            return fecha.format(dateObject, formatString)
        }
    }

    static parse(dateString: string, formatString: string) {
        if (!dateString) return null
        else {
            return fecha.parse(dateString, formatString)
        }
    }
}


export {PlainDate}