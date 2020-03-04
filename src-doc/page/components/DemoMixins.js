const DemoMixins = {
    data() {
        return {
            status: ['primary', 'success', 'warn', 'error', 'info'],
            shapes: ['fillet', 'round', 'square'],
            sizes: ['large', 'default', 'small'],
            aligns: ['left', 'center', 'right'],
        }
    },
    methods: {
        log(...arg) {
            console.log(...arg)
        },
    },
}

export default DemoMixins