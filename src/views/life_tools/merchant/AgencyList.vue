<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <h3><a>旅行社审核</a></h3>
    <a-divider style="margin-top: 10px" />

    <!-- 筛选 -->
    <a-row style="margin: 20px 0; display: flex; align-items: center">
      <a-select style="width: 120px" :default-value="option1[0].label" @change="handleChange1">
        <a-select-option :value="item.key" v-for="(item, index) in option1" :key="item.key">{{
          item.label
        }}</a-select-option>
      </a-select>
      <a-input style="width: 15%" v-model="seatchValue" placeholder="名称/手机号" />
      <div class="flag">
        <p>状态:</p>
        <a-select style="width: 120px" :default-value="option2[0].label" @change="handleChange2">
          <a-select-option :value="item.key" v-for="(item, index) in option2" :key="item.key">{{
            item.label
          }}</a-select-option>
        </a-select>
      </div>
      <a-button type="primary" style="margin: 10px 10px 10px 3%" @click="seatch">搜索</a-button>
    </a-row>

    <!-- 表格 -->
    <a-table @change="changePage" rowKey="id" :columns="columns" :data-source="tabData" :pagination="pagination">
      <!-- 名称 -->
      <span slot="name" slot-scope="name">
        <span>{{ name ? name : '无' }}</span>
      </span>
      <!-- 手机号 -->
      <span slot="phone" slot-scope="phone">
        <span>{{ phone ? phone : '无' }}</span>
      </span>
      <!-- 审核信息 -->
      <span slot="custom_form" slot-scope="custom_form">
        <span :title="custom_form">{{ custom_form ? custom_form : '无' }}</span>
      </span>
      <!-- 提交时间 -->
      <span slot="create_time" slot-scope="create_time">
        <span>{{ create_time ? create_time : '无' }}</span>
      </span>
      <!-- 审核时间 -->
      <span slot="audit_time" slot-scope="audit_time">
        <span>{{ audit_time ? audit_time : '无' }}</span>
      </span>
      <!-- 备注 -->
      <span slot="audit_msg" slot-scope="audit_msg">
        <span :title="audit_msg">{{ audit_msg ? audit_msg : '无' }}</span>
      </span>
      <!-- 状态 -->
      <span slot="status" slot-scope="status">
        <span v-if="status == 0" style="color: #faad14">{{ status | filterStatus }}</span>
        <span v-else-if="status == 1" style="color: #52c41a">{{ status | filterStatus }}</span>
        <span v-else-if="status == 2" style="color: #f5222d">{{ status | filterStatus }}</span>
      </span>
      <!-- 操作 -->
      <span slot="operation" slot-scope="index, item">
        <a @click="showModal(item)">{{ item.status == 0 ? '审核' : '重新审核' }}</a>
      </span>
    </a-table>
    <!-- 弹出框 -->
    <a-modal
      :maskClosable="false"
      destroyOnClose
      title="审核"
      width="46%"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="提交"
    >
      <div style="padding: 0 40px">
        <h3 style="font-weight: bold; margin: 0 0 20px 10px">旅行社信息</h3>
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
            <a-radio-group :options="plainOptions" :default-value="value1" @change="onChange1" />
          </div>
          <div class="info">
            <span>备注：</span>
            <a-textarea v-model="submit.note" :auto-size="{ minRows: 3, maxRows: 6 }" />
          </div>
        </div>
      </div>
    </a-modal>
    <!-- 图片弹出层 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewImageCancel">
      <img alt="暂无图片" style="width: 100%" :src="viewImg" />
    </a-modal>
  </div>
</template>

<script>
import lifeToolsMerchantApi from '@/api/life_tools/merchant'
export default {
  data() {
    return {
      queryParams: {
        page_size: 0,
        page: 1,
        keyword_name: '',
        keyword_phone: '',
        status: null,
      },
      submit: {
        travel_id: '',
        status: '',
        note: '',
      },
      // 选择框1
      option1: [
        {
          key: '0',
          label: '名称',
        },
        {
          key: '1',
          label: '手机号',
        },
      ],

      option2: [
        {
          key: '0',
          label: '全部',
        },
        {
          key: '1',
          label: '未审核',
        },
        {
          key: '2',
          label: '审核通过',
        },
        {
          key: '3',
          label: '审核不通过',
        },
      ],
      // 分页配置
      pagination: {
        pageSize: 10,
        total: 0,
        current: 1,
        page: 1,
      },
      // 表格配置
      columns: [
        {
          title: '名称',
          dataIndex: 'nickname',
          key: 'nickname',
          width: 150,
          scopedSlots: { customRender: 'nickname' },
        },
        {
          title: '手机号',
          dataIndex: 'phone',
          key: 'phone',
          width: 150,
          scopedSlots: { customRender: 'phone' },
        },
        {
          title: '旅行社审核信息',
          dataIndex: 'custom_form',
          key: 'custom_form',
          ellipsis: true,
          width: '30%',
          scopedSlots: { customRender: 'custom_form' },
        },
        {
          title: '提交时间',
          dataIndex: 'create_time',
          key: 'create_time',
          scopedSlots: { customRender: 'create_time' },
        },
        {
          title: '审核时间',
          dataIndex: 'audit_time',
          key: 'audit_time',
          scopedSlots: { customRender: 'audit_time' },
        },
        {
          title: '备注',
          dataIndex: 'audit_msg',
          key: 'audit_msg',
          ellipsis: true,
          scopedSlots: { customRender: 'audit_msg' },
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      // 表格数据
      tabData: [],
      plainOptions: [
        {
          value: '0',
          label: '通过',
        },
        {
          value: '1',
          label: '不通过',
        },
      ],
      // 审核弹框数据
      arletItem: null,
      viewImg: null,
      visible: false,
      value1: '',
      confirmLoading: false,
      previewVisible: false,
      nameFlag: false,
      seatchValue: '',
    }
  },
  created() {
    this.getLifeToolsList()
  },
  filters: {
    filterStatus(item) {
      let arr = ['未审核', '审核通过', '审核不通过']
      return arr[item]
    },
  },
  methods: {
    //分页筛选事件
    changePage(page, pageSize) {
      this.pagination.current = page.current
      this.getLifeToolsList()
    },
    //列表接口
    getLifeToolsList() {
      this.queryParams.page_size = this.pagination.pageSize
      this.queryParams.page = this.pagination.current
      this.request(lifeToolsMerchantApi.getTravelList, this.queryParams).then((res) => {
        let arr = res.data
        let custom_form = ''
        if (arr.length > 0) {
          arr.forEach((v, index) => {
            // 把审核信息都拼接起来
            // 每次最外层循环先清空custom_form
            custom_form = ''
            v.travel_agency_custom_form.forEach((s) => {
              if (s.type == 'image') return
              custom_form += `${s.title}:${s.show_value}; `
            })
            v.custom_form = custom_form
          })
        }
        this.tabData = arr
        this.pagination.total = res.total
      })
    },
    // 打开弹框
    showModal(item) {
      this.visible = true
      this.arletItem = item.travel_agency_custom_form
      this.submit.travel_id = item.id
      this.submit.note = item.audit_msg
    },
    //搜索
    seatch() {
      if (this.nameFlag) {
        this.queryParams.keyword_name = ''
        this.queryParams.keyword_phone = this.seatchValue
      } else {
        this.queryParams.keyword_phone = ''
        this.queryParams.keyword_name = this.seatchValue
      }
      this.getLifeToolsList()
    },
    handleChange1(e) {
      if (e == 0) {
        this.nameFlag = false
      } else if (e == 1) {
        this.nameFlag = true
      }
    },
    handleChange2(e) {
      if (e == 0) {
        this.queryParams.status = null
      } else if (e == 1) {
        this.queryParams.status = 0
      } else if (e == 2) {
        this.queryParams.status = 1
      } else if (e == 3) {
        this.queryParams.status = 2
      }
    },
    //确认提交
    handleOk(e) {
      if (!this.submit.status) {
        this.$message.info('请勾选是否审核通过单选框再提交')
        return
      }
      this.confirmLoading = true
      this.request(lifeToolsMerchantApi.agencyAudit, this.submit)
        .then((res) => {
          this.visible = false
          this.confirmLoading = false
          this.submit.status = null
          this.getLifeToolsList()
          this.$message.success(res.msg)
        })
        .catch((err) => {
          this.confirmLoading = false
        })
    },
    //取消弹框
    handleCancel(e) {
      this.visible = false
    },
    //单选事件
    onChange1(e) {
      if (e.target.value == 0) {
        this.submit.status = 1
      } else {
        this.submit.status = 2
      }
    },
    //查看图片
    previewImageClick(item) {
      this.viewImg = item
      this.previewVisible = true
    },
    //关闭图片
    previewImageCancel() {
      this.previewVisible = false
    },
  },
}
</script>
<style lang="less" scoped>
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
    margin-bottom: 24px;
    span:first-child {
      display: inline-block;
      width: 100px;
      text-align: right;
      margin-right: 8px;
    }
    img {
      cursor: pointer;
      min-width: 180px;
      width: 35%;
      height: 130px;
      margin-right: 20px;
    }
    .ant-input {
      width: 40%;
    }
  }
}
</style>