<template>
  <div>
    <!-- 筛选 -->
    <a-row style="margin: 10px 0; display: flex; align-items: center">
      <a-select style="width: 120px" v-model="queryParmas.search_type">
        <a-select-option :value="item.key" v-for="(item, index) in option1" :key="item.key">{{
          item.label
        }}</a-select-option>
      </a-select>
      <a-input style="width: 250px" v-model="queryParmas.keywords" placeholder="请输入" />
      <div class="flag">
        <p>状态:</p>
        <a-select style="width: 120px" v-model="queryParmas.status">
          <a-select-option :value="item.key" v-for="(item, index) in option2" :key="item.key">{{
            item.label
          }}</a-select-option>
        </a-select>
      </div>
      <a-button type="primary" style="margin: 10px 10px 10px 3%" @click="search">搜索</a-button>
    </a-row>
    <!-- 数据列表 -->
    <a-table
      style="background: #ffffff"
      :columns="columns"
      rowKey="id"
      :data-source="dataList"
      :pagination="pagination"
    >
      <span slot="status" slot-scope="text, record">
        <span v-if="record.status == 0" style="color: #faad14">{{ record.status_text }}</span>
        <span v-else-if="record.status == 1" style="color: #52c41a">{{ record.status_text }}</span>
        <span v-else style="color: red">{{ record.status_text }}</span>
      </span>
      <!-- 操作栏 -->
      <span slot="operation" slot-scope="text, record">
        <a @click="examine(record)">{{ record.status != 0 ? L('重新审核') : L('审核') }}</a>
      </span>
    </a-table>

    <!-- 新建弹框 -->
    <!-- 弹出框 -->
    <a-modal destroyOnClose title="审核" width="45%" :centered="true" v-model="visible" @ok="handleOk" okText="提交">
      <div style="padding: 0 40px" class="newBox">
        <div class="info-list" v-if="detail">
          <div>
            <div class="info">
              <span class="h3">订单信息：</span>
            </div>
            <div class="info">
              <span>订单编号：</span>
              <span>{{ detail.real_orderid }}</span>
            </div>
            <div class="info">
              <span>订单状态：</span>
              <span>{{ detail.status_text }}</span>
            </div>
            <div class="info">
              <span>下单时间：</span>
              <span>{{ detail.add_time_text }}</span>
            </div>
            <div class="info">
              <span>报名费用：</span>
              <span>{{ detail.price }}</span>
            </div>
            <div class="info">
              <span>是否支付：</span>
              <span>{{ detail.paid == 1?'已支付':'未支付' }}</span>
            </div>
            <div class="info">
              <span>支付时间：</span>
              <span>{{ detail.paid_time_text }}</span>
            </div>
            <div class="info">
              <span>积分抵扣数：</span>
              <span>{{ detail.system_score_money }}</span>
            </div>
            <div class="info">
              <span>平台优惠券的金额：</span>
              <span>{{ detail.coupon_price }}</span>
            </div>
            <div class="info">
              <span class="h3">活动信息：</span>
            </div>
            <div class="info">
              <span>活动名称：</span>
              <span>{{ detail.competition.title }}</span>
            </div>
            <div class="info">
              <span>活动日期：</span>
              <span>{{ detail.competition.date }}</span>
            </div>
            <div class="info">
              <span>活动简介：</span>
              <span v-html="detail.competition.content"></span>
            </div>
            <div class="info">
              <span>活动地址：</span>
              <span>{{ detail.competition.address }}</span>
            </div>
          </div>
          <div class="info">
            <span class="h3">用户提交表单信息：</span>
          </div>
        </div>
        <div class="info-list">
          <div class="" v-for="(item, index) in arletItem" :key="index">
            <div class="" v-if="item.type == 'image'">
              <div class="info">
                <span>{{ item.title }}：</span>
                <div style="flex: 1">
                  <img
                    @click="previewImageClick(items)"
                    v-for="(items, indexs) in item.show_value"
                    :key="indexs"
                    alt="暂无图片"
                    :src="items"
                  />
                </div>
              </div>
            </div>
            <div v-else class="info">
              <span>{{ item.title }}：</span>
              <span>{{ item.show_value }}</span>
            </div>
          </div>
          <div class="info">
            <span>是否审核通过：</span>
            <a-radio-group v-model="submit.status" :options="plainOptions" />
          </div>
          <div class="info">
            <span>备注：</span>
            <a-textarea v-model="submit.note" :auto-size="{ minRows: 3, maxRows: 6 }" />
          </div>
        </div>
      </div>
    </a-modal>
    <!-- 图片弹出层 -->
    <a-modal v-model="previewVisible" :footer="null">
      <img alt="暂无图片" style="width: 100%" :src="viewImg" />
    </a-modal>
  </div>
</template>
<script>
import lifeToolsPlatformApi from '@/api/life_tools/platform/index'
export default {
  data() {
    return {
      // 选择框1
      option1: [
        {
          key: 1,
          label: '名称',
        },
        {
          key: 2,
          label: '手机号',
        },
        {
          key: 3,
          label: '赛事名称',
        },
      ],
      option2: [
        {
          key: null,
          label: '全部',
        },
        {
          key: 0,
          label: '待审核',
        },
        {
          key: 1,
          label: '审核通过',
        },
        {
          key: 2,
          label: '审核不通过',
        },
      ],
      plainOptions: [
        {
          value: 1,
          label: '通过',
        },
        {
          value: 2,
          label: '不通过',
        },
      ],
      visible: false,
      titles: '新建',
      //table表格头部
      columns: [
        {
          title: this.L('名称'),
          dataIndex: 'nickname',
          ellipsis: true,
        },
        {
          title: this.L('手机号'),
          dataIndex: 'phone',
          ellipsis: true,
        },
        {
          title: this.L('审核信息'),
          dataIndex: 'audit_info',
          ellipsis: true,
          scopedSlots: { customRender: 'audit_info' },
        },
        {
          title: this.L('赛事名称'),
          dataIndex: 'title',
          ellipsis: true,
        },
        {
          title: this.L('提交时间'),
          dataIndex: 'submit_time',
          ellipsis: true,
        },
        {
          title: this.L('审核时间'),
          dataIndex: 'audit_time',
          ellipsis: true,
        },
        {
          title: this.L('备注'),
          dataIndex: 'remark',
          ellipsis: true,
          scopedSlots: { customRender: 'remark' },
        },
        {
          title: this.L('状态'),
          dataIndex: 'status',
          ellipsis: true,
          scopedSlots: { customRender: 'status' },
        },
        {
          title: this.L('操作'),
          width: 150,
          scopedSlots: { customRender: 'operation' },
        },
      ],
      //列表数据
      dataList: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
      },
      arletItem: [],
      viewImg: '',
      submit: {
        status: 0,
        note: '',
      },
      queryParmas: {
        keywords: '',
        search_type: 1,
        status: null,
        page: 1,
      },
      previewVisible: false,
      detail: null,
      userInfo: null
    }
  },
  created() {
    this.getDataList()
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy()
    next()
  },
  methods: {
    //搜索
    search() {
      this.pagination.current = 1
      this.getDataList()
    },

    // 获取table数据
    getDataList() {
      this.queryParmas.page = this.pagination.current
      this.queryParmas.page_size = this.pagination.pageSize
      this.request(lifeToolsPlatformApi.getMyAuditList, this.queryParmas).then((res) => {
        this.dataList = res.data
        this.$set(this.pagination, 'total', res.total)
        this.$emit('totalNum', res.total)
      })
    },
    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.getDataList()
    },
    onPageSizeChange(page, pageSize) {
      this.$set(this.pagination, 'current', 1)
      this.$set(this.pagination, 'pageSize', pageSize)
      this.getDataList()
    },
    // 点击列表审核
    examine(e) {
      this.userInfo = e;
      this.request(lifeToolsPlatformApi.getMyAuditInfo, { id: e.id }).then((res) => {
        this.detail = res
        this.arletItem = res.custom_form
        this.submit.note = res.remark
        this.submit.status = res.audit_status == 0 ? 1 : res.audit_status
        this.visible = true
      })
    },
    //审核确定
    handleOk() {
      let params = {
        status: this.submit.status,
        remark: this.submit.note,
        id: this.detail.id,
      }
      this.request(lifeToolsPlatformApi.audit, params).then((res) => {
        this.visible = false
        this.getDataList()
      })
    },
    //查看图片
    previewImageClick(item) {
      this.viewImg = item
      this.previewVisible = true
    },
  },
}
</script>
<style scoped lang="less">
.center {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.textarea-wrapper {
  position: relative;
  display: block;
  .m-textarea {
    padding: 8px 12px;
    padding-bottom: 25px;
    height: 100%;
  }
  .m-count {
    color: #808080;
    position: absolute;
    font-size: 12px;
    bottom: 0px;
    right: 12px;
  }
}
.newBox {
  max-height: 70vh;
  overflow-y: scroll;
  .customFormWrap {
    padding: 20px 20px 0 20px;
    background: #fafafa;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    border: 1px solid rgb(235, 238, 245);
  }
}
.flag {
  margin-left: 2%;
  display: inline-flex;
  align-items: center;
  p {
    margin-bottom: 0;
    margin-right: 10px;
  }
}
.info-list {
  .info {
    display: flex;
    margin-bottom: 20px;
    span:first-child {
      display: inline-block;
      width: 150px;
      text-align: right;
      margin-right: 8px;
    }
    img {
      cursor: pointer;
      min-width: 180px;
      width: 35%;
      height: 130px;
      margin-right: 20px;
      object-fit: cover
    }
    .ant-input {
      width: 40%;
    }
    .h3{
      font-weight: bold;
      font-size: 16px;
      color: #333;
    }
  }
}
</style>
