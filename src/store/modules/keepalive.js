const keepalive = {
  state: {
    keepAlive: []
  },
  mutations: {
    setKeepAlive: (state, keepAlive) => {
      state.keepAlive = keepAlive;
    }
  }
}
export default keepalive;