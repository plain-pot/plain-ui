import fecha from 'fecha'

export class PlainDate {

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

    get displayString(): string {
        if (!this.dateObject) return null
        return fecha.format(this.dateObject, this.displayFormat)
    }

    get valueString(): string {
        if (!this.dateObject) return null
        return fecha.format(this.dateObject, this.valueFormat)
    }

    /*---------------------------------------method-------------------------------------------*/

    setValue(value: string) {
        if (!value) {
            this.dateObject = null
        } else {
            this.dateObject = PlainDate.parse(value, this.valueFormat)
        }
    }

    setYear(year: number): void {
        if (!this.dateObject) {
            this.dateObject = PlainDate.defaultDate()
        }
        this.dateObject.setFullYear(year)
    }

    setMonthDate(month: number, date: number): void {
        if (!this.dateObject) {
            this.dateObject = PlainDate.defaultDate()
        }
        this.dateObject.setMonth(month, date)
    }

    setHour(hour: number): void {
        if (!this.dateObject) {
            this.dateObject = PlainDate.defaultDate()
        }
        this.dateObject.setHours(hour)
    }

    setMinute(minute: number): void {
        if (!this.dateObject) {
            this.dateObject = PlainDate.defaultDate()
        }
        this.dateObject.setMinutes(minute)
    }

    setSecond(second: number): void {
        if (!this.dateObject) {
            this.dateObject = PlainDate.defaultDate()
        }
        this.dateObject.setSeconds(second)
    }

    greaterThan(plainDate: PlainDate): boolean {
        if (this.dateObject == null) {
            console.error('greaterThan: self is null')
            return false
        }
        if (plainDate.dateObject == null) {
            console.error('greaterThan: target is null')
            return false
        }
        return this.dateObject.getTime() > plainDate.dateObject.getTime()
    }

    lessThan(plainDate: PlainDate) {
        if (this.dateObject == null) {
            console.error('lessThan: self is null')
            return false
        }
        if (plainDate.dateObject == null) {
            console.error('lessThan: target is null')
            return false
        }
        return this.dateObject.getTime() < plainDate.dateObject.getTime()
    }

    static defaultDate(): Date {
        const date = new Date()
        date.setMonth(0, 1)
        date.setHours(0, 0, 0)
        return date
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