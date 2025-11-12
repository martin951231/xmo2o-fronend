<template>
    <a-modal :title="title" :width="1150" :visible="true" v-if="visible" :footer="null" :maskClosable="false" @cancel="handleCancel">
      <!--      导航栏-->
      <a-tabs type="card" @change="callback">
        <a-tab-pane key="receivableOrderList" tab="应收账单" v-if="is_receivableOrderList"></a-tab-pane>
        <a-tab-pane key="payableOrderList" tab="已缴账单"></a-tab-pane>
      </a-tabs>
      <div class="tab_components">
        <receivableOrderList :is="currentTab" v-if="visible" :pigcmsId="bind_id" :village_id="village_id" :usernum="usernum" :key="currentTab"></receivableOrderList>
      </div>
    </a-modal>
</template>
<script>
import receivableOrderList from '../charge/cashier/receivableOrderList'
import payableOrderList from '../charge/cashier/payableOrderList'

export default {
  name: 'paymentList',
  components: {
    receivableOrderList,
    payableOrderList
  },
  data () {
    return {
      visible: false,
      title: '缴费清单',
      currentTab: 'receivableOrderList',
      bind_id: 0,
      usernum: '',
      village_id:0,
      is_receivableOrderList:true,
    }
  },
  methods: {
    handleCancel () {
      this.visible = false
      setTimeout(() => {
        this.form = this.$form.createForm(this)
      }, 500)
    },
    accountsReceivable (pigcmsId,villageId,usernum) {
      this.currentTab = 'receivableOrderList';
      if(villageId!=undefined && villageId){
          this.village_id = villageId;
      }
      if(usernum!=undefined && usernum){
          this.usernum = usernum;
      }
      this.bind_id = pigcmsId;
      this.visible = true
      console.log('pigcmsId',pigcmsId);
      console.log('villageId',villageId);
      console.log('usernum',usernum);
    },
    callback (key) {
      this.currentTab = key
    }
  }
}
</script>
<style>
.tab_components .message-suggestions-list-box{
  margin: 0;
}
.tab_components .message-suggestions-list-box .components-table-demo-nested{
  padding: 0;
}
.tab_components .message-suggestions-box-1{
  margin: 0;
}
.tab_components .message-suggestions-box-1 .components-table-demo-nested{
  padding: 0;
}
</style>