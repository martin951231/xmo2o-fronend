<template>
  <div>
    <div v-if="empty === false" class="payment-record" ref="paymentRecord" id="paymentRecord">
      <div class="payment-list" @click="$refs.PopupEditModel.accountsReceivable(pigcmsId,villageId,usernum)">缴费清单</div>
      <keep-alive>
        <a-steps progress-dot size="small" :current="0" direction="vertical">
          <a-step status="finish" :title="item.pay_time" v-for="(item,index) in log_list" :key="index" >
          <span slot="description">
            支付{{ item.order_name+item.pay_money }}元
          </span>
          </a-step>
        </a-steps>
      </keep-alive>
    </div>
    <a-empty :image="simpleImage" v-if="empty" class="empty">
      <span slot="description">暂无数据</span>
    </a-empty>
    <paymentList ref="PopupEditModel" v-if="visible" @ok="addActive"/>
  </div>
</template>
<script>
    import villageApi from '@/api/community/village'
    import paymentList from './paymentList'
    import { Empty } from 'ant-design-vue'
    import Vue from 'vue'
    Vue.use(Empty)

    export default {
      name: 'paymentRecord',
      props: {
        villageId: {
          type: Number,
          default: 0
        },
        usernum:{
           type: String,
           default: ''
        },
        pigcmsId: {
          type: Number,
          default: 0
        },
        uid: {
          type: Number,
          default: 0
        }
      },
      components: {
        paymentList
      },
      data () {
        return {
          flag: true,
          inner: '',
          search_most: 'search_most',
          log_list: [],
          simpleImage: '',
          visible: true,
          empty: false,
          page: 0
        }
      },
      created () {
        this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
        this.searchMostLog()
      },
      methods: {
        searchMostLog () {
          if (this.search_most === 'un_search_most') {
            return false
          }
          this.page++
          var param = {
            village_id: this.villageId,
            uid: this.uid,
            page: this.page
          }
          this.request(villageApi.getLivingPaymentLog, param)
            .then((res) => {
              if (res.list.lenght !== 0) {
                this.log_list = this.log_list.concat(res.list)
                if (this.log_list.length === 0) {
                  this.empty = true
                }
                if (res.next_page === true) {
                  this.flag = true
                }
              }
            })
        },
        onScroll (event) {
          if (!event.bubbles) {
            this.inner = this.$refs.paymentRecord
            if ((this.inner.clientHeight + this.inner.scrollTop) >= this.inner.scrollHeight) { // 为true时证明已经到底，可以请求接口
              if (this.flag) { // 设一个滚动事件的开关，（在data里面声明 flag: true）默认为true
                this.flag = false
                this.height = this.inner.offsetHeight
                this.searchMostLog()
              }
            }
          }
        },
        addActive () {
          this.visible = false
        }
      },
      mounted () {
        this.inner = this.$refs.paymentRecord
        this.inner.addEventListener('scroll', this.onScroll, true)
      },
      destroyed () {
        this.inner.removeEventListener('scroll', this.onScroll, true)
      }
    }
</script>
<style>
.statistical_data{
  margin: 20px 20px;
  padding: 14px 0;
  text-align: center;
  background-color: #eee;
  font-size: 14px;
}
.statistical_fir_p{
  font-size: 16px;
}
.statistical_data p{
  margin: 0 0;
}
.tab_list{
  padding: 14px 0;
  text-align: center;
  font-size: 14px;
  border: 1px solid #ccc;
}
.search_most{
  margin: auto;
  width: 105px;
  background-color: #0A8DE4;
  color: #FFF;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}
.un_search_most{
  margin: auto;
  width: 105px;
  background-color: #CCCCCC;
  color: #FFF;
  padding: 5px 10px;
  border-radius: 5px;
}
.ant-steps-dot .ant-steps-item-content{
  width: 80% !important;
}
.payment-record{
  height: 340px;
  overflow-y: scroll;
}
.payment-list{
  position: absolute;
  padding: 5px 10px;
  background-color: #0a94ff;
  border-radius: 5px;
  right: 75px;
  color: #FFF;
  cursor: pointer;
  z-index: 999;
}
</style>