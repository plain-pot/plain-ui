export default {
    name: 'pl-scope-slot',
    props: {
        scopeSlotFunc: {
            type: Function,
            required: true
        },
        data: {},
    },
    render(h) {
        return (
            <div class="pl-scope-slot">
                {!!this.scopeSlotFunc && this.scopeSlotFunc(this.data)}
            </div>
        )
    },
}
