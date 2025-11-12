<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :destroyOnClose="true"
  >
    <div class="detail-content">
      <a-card title="基本信息" :bordered="false">
        <a-row>
          <a-col :span="8" class="table-title"> 订单编号 </a-col>
          <a-col :span="16">
            {{ detail.real_orderid }}
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8" class="table-title">订单名称 </a-col>
          <a-col :span="16"> {{ detail.order_name }} </a-col>
        </a-row>
      </a-card>

      <a-card title="订单信息" :bordered="false">
        <a-row>
          <a-col :span="6" class="table-title"> 订单类型 </a-col>
          <a-col :span="6"> {{ detail.order_type }} </a-col>
          <a-col :span="6" class="table-title left-border"> 订单状态 </a-col>
          <a-col :span="6">{{ detail.order_status }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="6" class="table-title"> 数量 </a-col>
          <a-col :span="6"> {{ detail.num }} </a-col>
          <a-col :span="6" class="table-title left-border"> 总价 </a-col>
          <a-col :span="6">{{ detail.total_money }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="6" class="table-title" v-if="detail.add_time"> 下单时间 </a-col>
          <a-col :span="6" v-if="detail.add_time"> {{ detail.add_time }} </a-col>
          <a-col :span="6" class="table-title left-border" v-if="detail.pay_time"> 付款时间 </a-col>
          <a-col :span="6" v-if="detail.pay_time"> {{ detail.pay_time }} </a-col>
        </a-row>
        <a-row>
          <a-col :span="6" class="table-title" v-if="detail.can_use_day"> 优惠组合有效期 </a-col>
          <a-col :span="6" v-if="detail.can_use_day"> {{ detail.can_use_day }} 天</a-col>
          <a-col :span="6" class="table-title left-border" v-if="detail.can_use_end_time"> 订单有效期 </a-col>
          <a-col :span="6" v-if="detail.can_use_end_time">{{ detail.can_use_end_time }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="6" class="table-title" v-if="detail.can_use_count"> 总核销次数 </a-col>
          <a-col :span="6" v-if="detail.can_use_count"> {{ detail.can_use_count }} </a-col>
          <a-col :span="6" class="table-title left-border" v-if="detail.can_use_count"> 未使用核销次数 </a-col>
          <a-col :span="6" v-if="detail.can_use_count">{{ detail.now_use_count }}</a-col>
        </a-row>
      </a-card>
      <a-card
        title="消费记录"
        :bordered="false"
        v-if="detail.is_group_combine && detail.status != 3 && detail.status != 4"
      >
        <a-row v-if="detail.is_group_combine">
          <a-col :span="24" class="table-title">
            <a-table
              :columns="orderColumns"
              :data-source="detail.has_used_goods"
              rowKey="order_id"
              class="components-table-demo-nested"
              :pagination="false"
            >
            </a-table>
          </a-col>
        </a-row>
      </a-card>
      <a-card title="用户信息" :bordered="false">
        <a-row>
          <a-col :span="6" class="table-title"> 用户ID </a-col>
          <a-col :span="6"> {{ detail.uid }} </a-col>
          <a-col :span="6" class="table-title left-border"> 用户昵称 </a-col>
          <a-col :span="6">{{ detail.nickname }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="6" class="table-title"> 订单手机号 </a-col>
          <a-col :span="6">{{ detail.phone }} </a-col>
          <a-col :span="6" class="table-title left-border"> 用户手机号 </a-col>
          <a-col :span="6">{{ detail.phone }}</a-col>
        </a-row>
      </a-card>
      <a-card title="支付信息" :bordered="false" v-if="detail.paid == 1">
        <a-row>
          <a-col :span="6" class="table-title"> 支付方式 </a-col>
          <a-col :span="6"> {{ detail.pay_type_str }} </a-col>
        </a-row>
        <a-row v-if="detail.card_discount > 0">
          <a-col :span="6" class="table-title"> 商家会员卡折扣 </a-col>
          <a-col :span="6"> {{ detail.card_discount }}折 </a-col>
        </a-row>
        <a-row v-if="detail.use_ecard_price > 0">
          <a-col :span="6" class="table-title"> 平台E卡支付 </a-col>
          <a-col :span="6"> ¥{{ detail.use_ecard_price }} </a-col>
        </a-row>
        <a-row v-if="detail.balance_pay > 0">
          <a-col :span="6" class="table-title"> 余额支付金额 </a-col>
          <a-col :span="6"> ¥{{ detail.balance_pay }} </a-col>
        </a-row>
        <a-row v-if="detail.payment_money > 0">
          <a-col :span="6" class="table-title"> 在线支付金额 </a-col>
          <a-col :span="6"> ¥{{ detail.payment_money }} </a-col>
        </a-row>
      </a-card>

      <a-card title="订单操作" :bordered="false" v-if="detail.status != 3 && detail.status != 4">
        <a-row type="flex" align="middle">
          <a-col :span="6" class="table-title"> 备注 </a-col>
          <a-col :span="18" class="table-title flex">
            <div style="display: flex; align-items: center">
              <div style="width: 60%">
                <a-textarea v-model="detail.note_info"></a-textarea>
              </div>
              <div style="width: 40%; margin-left: 10px"><a-button @click="editOrderNote">提交</a-button></div>
            </div>
          </a-col>
        </a-row>
      </a-card>
      <a-card title="" v-if="(detail.status == 3 || detail.status == 4) && detail.cancel_reason">
        <a-row type="flex" align="middle">
          <a-col :span="24" class="table-title"> 取消原因：{{ detail.cancel_reason }} </a-col>
        </a-row>
      </a-card>
    </div>
    <a-spin :spinning="confirmLoading"> </a-spin>
    <template slot="footer">
      <a-button key="back" @click="handleCancel"> 关闭 </a-button>
    </template>
  </a-modal>
</template>

<script>
import groupPlatformApi from '@/api/group/platform'
import CustomTooltip from '@/components/CustomTooltip/CustomTooltip'

export default {
  components: {
    CustomTooltip,
  },
  data() {
    return {
      title: '订单详情',
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 13,
        },
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),

      detail: {},
      // 订单表头
      orderColumns: [
        {
          title: '验证店铺',
          dataIndex: 'store_name',
          width: '20%',
        },
        {
          title: '团购商品',
          dataIndex: 'name',
          width: '20%',
        },
        {
          title: '商品成本价',
          dataIndex: 'price',
          width: '13%',
        },
        {
          title: '消费密码',
          dataIndex: 'group_pass',
          width: '18%',
        },
        {
          title: '验证店员',
          dataIndex: 'staff_name',
          // sorter: true,
          width: '12%',
        },
      ],
    }
  },
  mounted() {
    console.log(this.catFid)
  },
  methods: {
    show(orderId) {
      this.visible = true
      this.detail.order_id = orderId
      this.orderDetail()
    },

    orderDetail() {
      this.request(groupPlatformApi.getOrderDetail, {
        order_id: this.detail.order_id,
      }).then((res) => {
        this.detail = res
      })
    },
    // 修改订单备注
    editOrderNote() {
      this.request(groupPlatformApi.editOrderNote, {
        order_id: this.detail.order_id,
        note_info: this.detail.note_info,
      }).then((res) => {
        this.$message.success(res.msg)
      })
    },
    handleCancel() {
      // 关闭弹窗

      this.visible = false
    },
  },
}
</script>

<style scoped>
.detail-content {
  max-height: 600px;
  overflow-y: auto;
}
.detail-content >>> .ant-row .ant-col,
.detail-content >>> .ant-row-flex .ant-col {
  padding: 6px 4px;
}
.detail-content >>> .ant-row,
.detail-content >>> .ant-row-flex {
  /* border-bottom: 1px solid #e8e8e8; */
}
.left-border {
  /* border-left: 1px solid #e8e8e8; */
  padding-left: 10px;
}
.table-title {
  font-weight: bold;
  color: black;
}
.table-title-1 {
  font-weight: bold;
  font-size: 16px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: black;
}
.table-title-2 {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
  color: black;
}
</style>
