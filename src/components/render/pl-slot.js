export default {
    name: 'pl-slot',
    props: {
        slots: {
            type: Array,
            required: true
        },
    },
    render(h) {
        return h('div', {
            class: 'pl-slot',
        }, [
            ...this.slots
        ])
    },
}
