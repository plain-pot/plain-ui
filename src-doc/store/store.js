const store = new window.Vuex.Store({
    state: {
        count: 20
    },
    mutations: {
        increment(state, n) {
            state.count += n
        }
    }
})

export default store