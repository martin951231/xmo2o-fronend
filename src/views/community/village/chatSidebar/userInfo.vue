<template>
  <div class="user_info">
    <div>
      <!--      基础信息-->
      <a-row>
        <a-col :span="19" :push="5">
          <p>
            <span class="community_name">{{ name }}</span>
            <span class="is_wx" v-if="is_wx">@微信</span>
            <span v-if="sex === '男'" ><a-icon type="man" :style="{ color: '#3399cc' }"/></span>
            <span v-else-if="sex === '女'" ><a-icon type="woman" :style="{ color: 'hotpink' }"/></span>
            <span v-else >未知</span>
          </p>
          <a-row>
            <a-col :span="10" :value="item.id" v-for="(item,index) in user_info" :key="index">
              <span class="label_col">{{item.name}}:</span>
              <span > {{item.value}}</span>
<!--              <span class="edit_btn" v-if="item.type === 'edit'" @click="changeLabel(bind_id)"><a-icon type="edit" /></span>-->
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="5" :pull="19">
          <img :src="imageUrl"/>
        </a-col>
      </a-row>
      <!--      统计数据-->
      <a-row type="flex" justify="start">
        <a-col class="statistical_data" :span="4" :value="item.id" v-for="(item,index) in statistical_data" :key="index">
          <p class="statistical_fir_p">{{ item.value }}</p>
          <p class="statistical_sec_p">{{ item.title }}</p>
        </a-col>
      </a-row>
      <!--      导航栏-->
      <a-tabs type="card" @change="callback">
        <a-tab-pane :key="index" :tab="item" :value="item.id" v-for="(item,index) in tab_list">
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="tab_components">
      <paymentRecord :is="currentTab" :usernum="usernum" :pigcmsId="bind_id" :name="name" v-if="visible" :villageId="village_id" :uid="uid" :key="currentTab"></paymentRecord>
    </div>
  </div>
</template>
<script>
import paymentRecord from './paymentRecord'
import trackInformation from './trackInformation'
import ownerInformation from './ownerInformation'
import workOrder from './workOrder'
import chatRecord from './chatRecord'
import decorationOrder from './decorationOrder'
import expressManagement from './expressManagement'
import depositManagement from '../charge/cashier/receivableOrderList'
import villageApi from '@/api/community/village'

export default {
  name: 'userInfo',
  components: {
    paymentRecord,
    trackInformation,
    ownerInformation,
    workOrder,
    chatRecord,
    decorationOrder,
    expressManagement,
    depositManagement
  },
  data () {
    return {
      visible: false,
      imageUrl: '',
      name: '',
      sex: '',
      user_info: [],
      statistical_data: [],
      chat_data: [],
      tab_list: [],
      bind_id: 0,
      usernum: '',
      village_id: 0,
      uid: 0,
      is_wx: false,
      currentTab: 'paymentRecord'
    }
  },
  beforeCreate () {
    var param = {
      pingcms_id: this.$route.query['pigcms_id']
    }
    this.request(villageApi.getCommunityUserInfo, param)
      .then((res) => {
        this.title = '业主详情'
        this.imageUrl = res.userInfo.avatar
        this.name = res.userInfo.name
        this.sex = res.userInfo.sex
        this.is_wx = res.userInfo.is_wx
        this.user_info = res.userData
        this.statistical_data = {
          total_money: res.total_money,
          order_count: res.order_count,
          chat_name: res.chat_name
        }
        this.tab_list = res.tab_list
        this.bind_id = res.userInfo.pigcms_id
        this.village_id = res.userInfo.village_id
        this.uid = res.userInfo.uid
        this.visible = true
      })
  },
  mounted () {
    this.usernum = this.$route.query['usernum']
    console.log(this.usernum)
  },
  methods: {
    handleCancel () {
      this.visible = false
      setTimeout(() => {
        this.id = '0'
        this.form = this.$form.createForm(this)
      }, 500)
    },
    changeLabel () {
      alert('修改标签')
    },
    callback (key) {
      console.log(this.usernum)
      this.currentTab = key
    }
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
.is_wx{
  font-size: 12px;
  color: #0BB20C;
  padding: 0 5px;
}
.community_name{
  padding: 0 5px;
}
.edit_btn{
  padding: 0 5px;
  cursor: pointer;
}
.user_info{
  padding: 20px 30px;
}
</style>