const DateUtil = {
    DEFAULT_FORMATTER: {
        'year': 'YYYY',
        'month': 'YYYY-MM',
        'date': 'YYYY-MM-DD',
    },
    getDefaultValueFormat(valueFormat, datetime, view) {
        return !!valueFormat ? valueFormat : datetime ? `${this.DEFAULT_FORMATTER[view]} HH:mm:ss` : this.DEFAULT_FORMATTER[view]
    },
    getDefaultDisplayFormat(displayFormat, datetime, view) {
        return !!displayFormat ? displayFormat : datetime ? `${this.DEFAULT_FORMATTER[view]} HH:mm:ss` : this.DEFAULT_FORMATTER[view]
    },
}

export {DateUtil}
