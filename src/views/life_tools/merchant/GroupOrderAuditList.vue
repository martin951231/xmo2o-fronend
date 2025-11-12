<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <h3><a>团体票购票审核</a></h3>
    <a-divider style="margin-top: 10px" />

    <!-- 筛选 -->
    <a-row style="margin: 20px 0; display: flex; align-items: center">
      <a-select style="width: 120px" :default-value="option1[0].label" @change="handleChange1">
        <a-select-option :value="item.key" v-for="(item, index) in option1" :key="item.key">{{
          item.label
        }}</a-select-option>
      </a-select>
      <a-input style="width: 15%" v-model="seatchValue" placeholder="景区名称/套餐名称" />
      <div class="flag">
        <p>状态:</p>
        <a-select style="width: 120px" :default-value="option2[0].label" @change="handleChange2">
          <a-select-option :value="item.key" v-for="(item, index) in option2" :key="item.key">{{
            item.label
          }}</a-select-option>
        </a-select>
      </div>
        <a-form-model-item label="预约时间范围" style="margin: 20px 30px; display: flex; align-items: center">
            <a-range-picker
                :ranges="{
            过去30天: [moment().subtract(30, 'days'), moment()],
            过去15天: [moment().subtract(15, 'days'), moment()],
            过去7天: [moment().subtract(7, 'days'), moment()],
            今日: [moment(), moment()],
          }"
                :value="searchForm.time"
                format="YYYY-MM-DD"
                @change="onDateRangeChange"
            />
        </a-form-model-item>
      <a-button type="primary" style="margin: 10px 10px 10px 3%" @click="seatch">搜索</a-button>
    </a-row>

    <!-- 表格 -->
    <a-table @change="changePage" rowKey="id" :columns="columns" :data-source="tabData" :pagination="pagination">
        <!-- 导游填写信息 -->
        <span slot="custom_form" slot-scope="custom_form">
        <span :title="custom_form">{{ custom_form ? custom_form : '审核查看详情' }}</span>
        </span>
      <!-- 景区名称 -->
      <span slot="tool_title" slot-scope="tool_title">
        <span>{{ tool_title ? tool_title : '无' }}</span>
      </span>
      <!-- 套餐名称 -->
      <span slot="ticket_title" slot-scope="ticket_title">
        <span>{{ ticket_title ? ticket_title : '无' }}</span>
      </span>
        <!-- 数量 -->
        <span slot="num" slot-scope="num">
        <span>{{ num ? num : '无' }}</span>
      </span>
        <!-- 订单金额 -->
        <span slot="price" slot-scope="price">
        <span>{{ price ? price : '无' }}</span>
      </span>
      <!-- 预约时间 -->
      <span slot="create_time" slot-scope="add_time">
        <span>{{ add_time ? add_time : '无' }}</span>
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
      <span slot="group_status" slot-scope="group_status">
        <span v-if="group_status == 0 || group_status == 10" style="color: #faad14">{{ group_status | filterStatus }}</span>
        <span v-else-if="group_status == 20" style="color: #52c41a">{{ group_status | filterStatus }}</span>
        <span v-else-if="group_status == 30 || group_status == 40" style="color: #f5222d">{{ group_status | filterStatus }}</span>
      </span>
      <!-- 操作 -->
      <span slot="operation" slot-scope="index, item">
        <a @click="showModal(item)">{{(item.group_status == 0 || item.group_status == 10) ? '审核' : ((item.group_status == 30 || item.group_status == 40) ? '' : '重新审核') }}</a>
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
<!--        <h3 style="font-weight: bold; margin: 0 0 20px 10px">旅行社信息</h3>-->
        <div class="info-list">
            <h4>门票信息</h4>
            <div>
                <span v-for="(item, index) in ticketItem" :key="index">
                    <span v-if="index == 'tool_title'" style="margin-left: 25px">{{ item }}</span>
                    <span v-if="index == 'ticket_title'" style="margin-left: 25px">{{ item }}</span>
                    <span v-if="index == 'num'" style="margin-left: 25px">数量：{{ item }}</span>
                    <span v-if="index == 'add_time'" style="margin-left: 25px">预约时间：{{ item }}</span>
                </span>
            </div>
            <h4 style="margin-top: 10px;">导游信息</h4>
          <div class="" v-for="(item, index) in guideItem" :key="index">
            <div class="" v-if="item.type == 'image'">
              <div class="info">
                <span>{{ item.title }}：</span>
                <div style="flex: 1">
                  <img
                    @click="previewImageClick(t)"
                    v-for="(t, i) in item.show_value"
                    :key="i"
                    alt="暂无图片"
                    :src="t"
                  />
                </div>
              </div>
            </div>
            <div v-else class="info">
              <span>{{ item.title }}：</span>
              <span>{{ item.show_value }}</span>
            </div>
          </div>
            <h4 style="margin-top: 10px;">游客信息</h4>
          <div class="border_info" v-for="(t, i) in touristsItem" :key="i">
              <div class="" v-for="(item, index) in t" :key="index">
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
import moment from 'moment';
export default {
  data() {
    return {
      queryParams: {
        page_size: 0,
        page: 1,
        status: 'all',
      },
        //搜索框表单
        searchForm: {
            keyword: '',
            type: 0,
            status: -1,
            time: [],
            begin_time: '', // 开始时间
            end_time: '', // 结束时间
        },
      submit: {
        group_order_id: '',
        status: '',
        note: '',
      },
      // 选择框1
      option1: [
        {
          key: '0',
          label: '景区名称',
        },
        {
          key: '1',
          label: '套餐名称',
        },
      ],

      option2: [
        {
          key: '50',
          label: '全部',
        },
        {
          key: '10',
          label: '未审核',
        },
        {
          key: '20',
          label: '审核成功',
        },
        {
          key: '30',
          label: '审核失败',
        },
        {
          key: '0',
          label: '未提交',
        },
        {
          key: '40',
          label: '已过期',
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
              title: '导游填写信息',
              dataIndex: 'custom_form',
              key: 'custom_form',
              ellipsis: true,
              width: '30%',
              scopedSlots: { customRender: 'custom_form' },
          },
          {
              title: '景区名称',
              dataIndex: 'tool_title',
              key: 'tool_title',
              width: 150,
              scopedSlots: { customRender: 'tool_title' },
          },
          {
              title: '套餐名称',
              dataIndex: 'ticket_title',
              key: 'ticket_title',
              width: 150,
              scopedSlots: { customRender: 'ticket_title' },
          },
          {
              title: '数量',
              dataIndex: 'num',
              key: 'num',
              width: 150,
              scopedSlots: { customRender: 'num' },
          },
          {
              title: '订单金额',
              dataIndex: 'price',
              key: 'price',
              width: 150,
              scopedSlots: { customRender: 'price' },
          },
          {
              title: '预约时间',
              dataIndex: 'add_time',
              key: 'add_time',
              scopedSlots: { customRender: 'add_time' },
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
              dataIndex: 'group_status',
              key: 'group_status',
              scopedSlots: { customRender: 'group_status' },
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
          value: '20',
          label: '通过',
        },
        {
          value: '30',
          label: '不通过',
        },
      ],
      // 审核弹框数据
      ticketItem: null,
      guideItem: null,
      touristsItem: null,
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
    this.getLifeToolsOrderList()
  },
  filters: {
    filterStatus(item) {
        let arr = {
            '0':'未提交',
            10:'未审核',
            20:'审核成功',
            30:'审核失败',
            40:'已过期'
        }
      return arr[item]
    },
  },
  methods: {
      moment,
    //分页筛选事件
    changePage(page, pageSize) {
      this.pagination.current = page.current
      this.getLifeToolsOrderList()
    },
    //列表接口
    getLifeToolsOrderList() {
      this.queryParams.page_size = this.pagination.pageSize
      this.queryParams.page = this.pagination.current
      this.request(lifeToolsMerchantApi.getOrderAuditList, this.queryParams).then((res) => {
        let arr = res.data;
        let custom_form = '';
        let ticketItem = '';
        let guideItem = '';
        let touristsItem = {};
        if (arr.length > 0) {
          arr.forEach((v, index) => {
            // 把审核信息都拼接起来
            // 每次最外层循环先清空custom_form
            custom_form = ''
            if(v.tour_guide_custom_form){
                v.tour_guide_custom_form.forEach((s) => {
                    if(s){
                        guideItem = s;
                        custom_form = ''
                        s.forEach((ss) => {
                            if (ss.type == 'image') return
                            custom_form += `${ss.title}:${ss.show_value}; `
                        })
                    }
                })
                v.custom_form = custom_form;
                v.guideItem = guideItem;
            }
            if(v.tourists_custom_form){
                v.touristsItem = v.tourists_custom_form;
            }
          })
        }
        this.tabData = arr
        this.pagination.total = res.total
      })
    },
    // 打开弹框
    showModal(item) {
      this.visible = true
      this.ticketItem = item
      this.guideItem = item.guideItem
      this.touristsItem = item.touristsItem
      this.submit.group_order_id = item.id
      this.submit.note = item.audit_msg
    },
    //搜索
    seatch() {
      if (this.nameFlag) {//套餐搜索
        this.queryParams.keyword_scenic_name = ''
        this.queryParams.keyword_ticket_name = this.seatchValue
      } else {
        this.queryParams.keyword_ticket_name = ''
        this.queryParams.keyword_scenic_name = this.seatchValue
      }
      this.getLifeToolsOrderList()
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
        this.queryParams.status = 0
      } else if (e == 10) {
        this.queryParams.status = 10
      } else if (e == 20) {
        this.queryParams.status = 20
      } else if (e == 30) {
        this.queryParams.status = 30
      } else if (e == 40) {
        this.queryParams.status =40
      }else{
        this.queryParams.status ='all'
      }
    },
    //确认提交
    handleOk(e) {
      if (!this.submit.status) {
        this.$message.info('请勾选是否审核通过单选框再提交')
        return
      }
      this.confirmLoading = true
      this.request(lifeToolsMerchantApi.orderAudit, this.submit)
        .then((res) => {
          this.visible = false
          this.confirmLoading = false
          this.submit.status = null
          this.getLifeToolsOrderList()
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
        this.submit.status = 20
      } else {
        this.submit.status = e.target.value
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

      // 监听日期选择变化
      onDateRangeChange(date, dateString) {
          // 更新搜索框表单数据
          this.$set(this.searchForm, 'time', [date[0], date[1]])
          this.$set(this.searchForm, 'begin_time', dateString[0])
          this.$set(this.searchForm, 'end_time', dateString[1])
          var start_time = dateString[0] ? dateString[0] : '';
          var end_time = dateString[1] ? dateString[1] : '';
          this.$set(this.queryParams, 'start_time', start_time)
          this.$set(this.queryParams, 'end_time', end_time)
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
.border_info {
    border-bottom: 1px #e5e3e3 solid;
    margin-bottom: 25px;
}
</style>