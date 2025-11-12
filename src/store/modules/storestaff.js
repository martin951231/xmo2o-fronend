const storestaff = {
  state: {
    nowOrderId: '',
    nowTableId: '',
    product: [],
    LEFT_CONTENT_STATES: 0,
    nowSelectgooodsNum: '',
    orderPageState: ''
  },
  mutations: {
    changeOrder (state, id) {
      this.state.storestaff.nowOrderId = id
    },
    changeTable (state, id) {
      this.state.storestaff.nowTableId = id
    },
    changeleftState (state, number) {
      this.state.storestaff.LEFT_CONTENT_STATES = number
    },
    changeShopcart (state, obj) {
      this.state.storestaff.product.push(obj)
      console.log(this.state.storestaff.product)
    },
    changenowSelectgooodsNum (state, number) {
      this.state.storestaff.nowSelectgooodsNum = number
    },
    changeorderPageState (state, type) {
      this.state.storestaff.orderPageState = type
    }
  },
  actions: {

  }
}

export default storestaff
