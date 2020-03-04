const DemoMixins = {
    data() {
        return {
            status: ['primary', 'success', 'warn', 'error', 'info'],
            shapes: ['fillet', 'round', 'square'],
            sizes: ['small', 'default', 'large'],
            aligns: ['left', 'center', 'right'],
            val: {},
        }
    },
    methods: {
        log(...arg) {
            console.log(...arg)
        },
    },
}

export default DemoMixins