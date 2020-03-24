const DemoMixins = {
    data() {
        const val = new Array(20).fill(null).reduce((ret, item, index) => {
            ret[index] = null
            return ret
        }, {})
        return {
            status: ['primary', 'success', 'warn', 'error', 'info'],
            shapes: ['fillet', 'round', 'square'],
            sizes: ['mini', 'normal', 'large'],
            aligns: ['left', 'center', 'right'],
            val,
        }
    },
    methods: {
        log(...arg) {
            console.log(...arg)
        },
    },
}

export default DemoMixins