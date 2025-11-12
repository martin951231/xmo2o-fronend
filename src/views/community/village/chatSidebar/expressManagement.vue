<template>
  <div> 
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="快递代收">
        <a-table
          :columns="expressCollection"
          :data-source="expressCollectionList"
          class="components-table-demo-nested"
          :pagination="paginationCollection"
          rowKey="id"
          @change='table_change_collection'
          :loading="loadingCollection"
        >
          <span slot="collect_info" slot-scope="text, record">
            <span>{{ record.express_name }}</span>
            <br/>
            <span>{{ record.express_no }}</span>
          </span>
          <span slot="action" slot-scope="text, record">
            <a @click="expressInfoFun(record.id)">详情</a>
            <a-divider type="vertical"/>
            <a @click="delExpress(record.id)">删除</a>
          </span>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="2" tab="快递代发" force-render>
        <a-table
          :columns="expressDelivery"
          :data-source="expressDeliveryList"
          class="components-table-demo-nested"
          :pagination="paginationDelivery"
          rowKey="id"
          @change='table_change_delivery'
          :loading="loadingDelivery"
        >
          <span slot="sendInfo" slot-scope="text, record">
            <span>姓名：{{ record.send_uname }}</span>
            <br/>
            <span>联系方式：{{ record.send_phone }}</span>
            <br/>
            <span>详细地址：{{ record.send_adress }}</span>
          </span>
          <span slot="collectInfo" slot-scope="text, record">
            <span>姓名：{{ record.collect_uname }}</span>
            <br/>
            <span>联系方式：{{ record.collect_phone }}</span>
            <br/>
            <span>详细地址：{{ record.collect_adress }}</span>
          </span>
        </a-table>
      </a-tab-pane>
    </a-tabs>
<!--    代发详情-->
    <a-modal title="快递详情" :width="900" :footer="null" v-if="visible" :visible="visible" :maskClosable="false" :confirmLoading="false" @cancel="handleCancel">
      <a-descriptions title="">
        <a-descriptions-item :label="item.title" v-for="(item,index) in expressInfo" :key="index" >
          <span>{{ item.value }}</span>
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>
<script>
import villageApi from "@/api/community/village"

const expressCollection = [
  { title: '快递信息', dataIndex: 'collect_info', key: 'collect_info', scopedSlots: { customRender: 'collect_info' } },
  { title: '收件人手机号', dataIndex: 'phone', key: 'phone' },
  { title: '收件人地址', dataIndex: 'collect_address', key: 'collect_address' },
  { title: '取件码', dataIndex: 'fetch_code', key: 'fetch_code' },
  { title: '送件费用', dataIndex: 'money', key: 'money' },
  { title: '状态', dataIndex: 'express_msg', key: 'express_msg' },
  { title: '预约代送时间', dataIndex: 'send_time', key: 'send_time' },
  { title: '添加时间', dataIndex: 'add_time', key: 'add_time' },
  { title: '操作', dataIndex: 'operation', key: 'operation', scopedSlots: { customRender: 'action' } }
]
const expressCollectionList = []

const expressDelivery = [
  { title: 'ID', dataIndex: 'send_id', key: 'send_id' },
  { title: '寄件人信息', dataIndex: 'send_phone', key: 'send_phone', width: 200, scopedSlots: { customRender: 'sendInfo' } },
  { title: '收件人信息', dataIndex: 'collect_phone', key: 'collect_phone', width: 200, scopedSlots: { customRender: 'collectInfo' } },
  { title: '物品重量', dataIndex: 'weightDesc', key: 'weightDesc' },
  { title: '文件类型', dataIndex: 'goods_type_text', key: 'goods_type_text' },
  { title: '快递公司', dataIndex: 'expressDesc', key: 'expressDesc' },
  { title: '代发费用', dataIndex: 'send_price', key: 'send_price' },
  { title: '备注', dataIndex: 'remarks', key: 'remarks' },
  { title: '提交时间', dataIndex: 'add_time', key: 'add_time' },
  { title: '最后导出时间', dataIndex: 'export_time', key: 'export_time' }
]
const expressDeliveryList = []

export default {
  name: 'expressManagement',
  data () {
    return {
      title: '',
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 7
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 13
        }
      },
      expressCollection,
      expressCollectionList,
      expressDelivery,
      expressDeliveryList,
      paginationCollection: { current: 1, pageSize: 10, total: 10 },
      paginationDelivery: { current: 1, pageSize: 10, total: 10 },
      loadingCollection: false,
      loadingDelivery: false,
      visible: false,
      expressInfo: [],
      type: 'collect'
    }
  },
  props: {
    pigcmsId: {
      type: Number,
      default: 0
    },
    uid: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.getExpressList(1)
  },
  methods: {
    // 代收分页
    table_change_collection (e) {
      let that = this
      if (e.current && e.current > 0) {
        that.$set(that.paginationCollection, 'current', e.current)
        that.getList()
      }
    },
    // 代发分页
    table_change_delivery (e) {
      let that = this
      if (e.current && e.current > 0) {
        that.$set(that.paginationDelivery, 'current', e.current)
        that.getList()
      }
    },
    // 获取快递列表
    getExpressList (t = 0) {
      if (this.type === 'collect') {
        this.loadingCollection = true
      } else {
        this.loadingDelivery = true
      }
      let param = {}
      if (t === 1) {
        if (this.type === 'collect') {
          this.$set(this.paginationCollection, 'current', 1)
          param['page'] = this.paginationCollection.current
        } else {
          this.$set(this.paginationDelivery, 'current', 1)
          param['page'] = this.paginationDelivery.current
        }
      }
      param['pigcms_id'] = this.pigcmsId
      param['uid'] = this.uid
      param['type'] = this.type
      console.log(param)
      this.request(villageApi.getExpressList, param)
        .then((res) => {
          console.log(res)
          if (this.type === 'collect') {
            this.paginationCollection.total = res.count ? res.count : 0
            this.paginationCollection.pageSize = res.total_limit ? res.total_limit : 10
            this.expressCollectionList = res.list
            this.loadingCollection = false
          } else {
            this.paginationDelivery.total = res.count ? res.count : 0
            this.paginationDelivery.pageSize = res.total_limit ? res.total_limit : 10
            this.expressDeliveryList = res.list
            this.loadingDelivery = false
          }
        })
    },
    // tab切换
    callback (key) {
      if (key === 1) {
        this.type = 'collect'
      } else {
        this.type = 'send'
      }
      this.getExpressList(1)
    },
    // 代收详情
    expressInfoFun (expressId) {
      let param = {
        id: expressId
      }
      this.request(villageApi.getExpressInfo, param)
        .then((res) => {
          this.expressInfo = res
          this.visible = true
        })
    },
    // 关闭弹窗
    handleCancel (e) {
      this.visible = false
    },
    // 删除快递
    delExpress (expressId) {
      let param = {
        id: expressId
      }
      this.request(villageApi.delExpress, param)
        .then((res) => {
          if (res.status === 1) {
            this.$message.success(res.msg)
            this.getExpressList(1)
          } else {
            this.$message.error(res.msg)
          }
        })
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
.tab_list{
  padding: 14px 0;
  text-align: center;
  font-size: 14px;
  border: 1px solid #ccc;
}
</style>