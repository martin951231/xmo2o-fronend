<template>
  <div class="mt-20 ml-10 mr-10 mb-20 bg-ff pt-10 pb-10 pl-10 pr-10" style="padding: 20px; overflow: hidden">
    <div class="card-box">
      <div class="card-list"  v-for="(item, index) in cardList" :key="index">
        <div class="card-item">
          <div class="title">
            <span>{{ item.all_txt }}</span>
            <a-tooltip placement="right" v-if="item.note">
              <template slot="title">
                <span>{{ item.note }}</span>
              </template>
              <a-icon type="info-circle" />
            </a-tooltip>
          </div>
          <div class="price">
            <a-statistic :value="item.all_money" valueStyle="font-size:28px;" />
          </div>
          <div class="percentage">
            <div>
              {{ L('周同比') }}
              <a-icon type="caret-down" style="color: red; margin: 0 6px" v-if="item.week_data < 0" />
              <a-icon type="caret-up" style="color: #5ac725; margin: 0 6px" v-if="item.week_data >= 0" />{{
                item.week_data
              }}
              ％
            </div>
            <div>
              {{ L('日环比') }}
              <a-icon type="caret-down" style="color: red; margin: 0 6px" v-if="item.day_data < 0" />
              <a-icon type="caret-up" style="color: #5ac725; margin: 0 6px" v-if="item.day_data >= 0" />{{
                item.day_data
              }}
              ％
            </div>
          </div>
          <div class="info">
            {{ item.day_txt }} <span style="margin-left: 10px" v-if="item.day_per_type == 1">¥</span>
            {{ item.day_per }}
          </div>
        </div>
      </div>
    </div>
    <!-- 表格区域 -->
    <div class="table-box">
      <a-row type="flex">
        <a-row type="flex" class="mb-20">
          <a-col style="display: flex" class="mr-20">
            <span class="nowrap">{{ L('搜索') }}：</span>
            <a-select style="width: 100px" v-model="searchParams.search_type">
              <a-select-option v-for="item in searchSelectOption" :value="item.value" :key="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
            <a-input style="width: 60%" v-model="searchParams.keywords" :placeholder="L('请输入')" />
          </a-col>
          <a-col class="mr-20">
            <span>{{ L('日期') }}：</span>
            <a-select style="width: 100px" v-model="searchParams.date_type">
              <a-select-option :value="1">{{ L('建卡时间') }}</a-select-option>
              <a-select-option :value="2">{{ L('兑换时间') }}</a-select-option>
            </a-select>
            <a-range-picker
              :value="[
                searchParams.start_date ? moment(searchParams.start_date, 'YYYY-MM-DD') : null,
                searchParams.end_date ? moment(searchParams.end_date, 'YYYY-MM-DD') : null,
              ]"
              @change="timeOnChange"
            />
          </a-col>
        </a-row>
        <a-col>
          <a-button type="primary" class="mr-20" @click="search"> {{ L('搜索') }} </a-button>
          <a-button class="mr-20" type="primary" @click="addCard"> {{ L('新建实体卡') }} </a-button>
          <a-button type="primary" @click="exportCard"> <a-icon type="download" /> {{ L('导出') }} </a-button>
        </a-col>
      </a-row>
      <a-table class="mt-20" rowKey="id" :columns="columns" :data-source="list" :pagination="pagination">
        <!-- QrcodeModal -->
        <span slot="qr_code" slot-scope="text, record">
          <a @click="qrCodeModal(record)">{{ L('查看') }}</a>
        </span>
        <span slot="user" slot-scope="text, record">
          <span v-if="record.nickname || record.phone">{{ record.nickname + '/' + record.phone }}</span>
        </span>
        <span slot="money" slot-scope="text, record">
          <span>{{ record.use_money + '/' +  record.money}}</span>
        </span>
        <!-- 操作栏 -->
        <span slot="action" slot-scope="text, record">
          <span class="cr-primary pointer mr-20" @click="detailItem(record)">{{ L('消费详情') }}</span>
          <span class="cr-primary pointer font-gray" @click="delItem(record)">{{ L('删除') }}</span>
        </span>
      </a-table>
    </div>
    <a-modal
      :visible="modalVisible"
      :title="modalTitle"
      :destroyOnClose="true"
      width="30%"
      @cancel="modalVisible = false"
      @ok="handleOk"
    >
      <a-form-model
        ref="ruleForm"
        :rules="rules"
        :model="modalForm"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 10 }"
      >
        <a-form-model-item :label="L('卡号前缀')" required prop="card_prefix">
          <a-input v-model="modalForm.card_prefix" :placeholder="L('请输入')" />
        </a-form-model-item>
        <a-form-model-item :label="L('卡号位数')" required prop="start_no">
          <a-col :span="10"><a-input v-model="modalForm.start_no" :placeholder="L('请输入')" /> </a-col>
<!--          <a-col :span="4" style="text-align: center"><span>&#45;&#45;</span></a-col>
          <a-col :span="10"><a-input v-model="modalForm.end_no" :placeholder="L('请输入')" /> </a-col>-->
        </a-form-model-item>
        <a-form-model-item :label="L('实体卡金额')" required prop="money">
          <a-input v-model="modalForm.money" :placeholder="L('请输入')" />
        </a-form-model-item>
        <a-form-model-item :label="L('数量')" required prop="total">
          <a-input v-model="modalForm.total" :placeholder="L('请输入')" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      :visible="modalConsumptionVisible"
      :title="L('消费详情')"
      :destroyOnClose="true"
      width="60%"
      @cancel="modalConsumptionVisible = false"
      :footer="null"
    >
      <div>
        <a-table
          rowKey="id"
          :columns="consumptionColumns"
          :data-source="consumptionList"
          :pagination="consumptionPagination"
        ></a-table>
      </div>
    </a-modal>
    <qr-code-modal ref="qrCodeModal" />
  </div>
</template>

<script>
import Vue from 'vue'
import { statistic } from 'ant-design-vue'
Vue.use(statistic)
import MerchantApi from '@/api/merchant/application/index'
import QrCodeModal from '@/components/QrcodeModal/QrcodeModal'
import moment from 'moment'
export default {
  data() {
    return {
      searchSelectOption: [
        {
          value: 1,
          label: 'id',
        },
        {
          value: 2,
          label: '实体卡号',
        },
        {
          value: 3,
          label: '总金额',
        },
        {
          value: 4,
          label: '卡密',
        },
        {
          value: 5,
          label: '绑定用户',
        },
      ],
      searchParams: {
        search_type: 1,
        start_date: '',
        end_date: '',
        page: 1,
        pageSize: 10,
        keywords: '',
        date_type: 1,
      },
      columns: [
        {
          title: this.L('ID'),
          dataIndex: 'id',
        },
        {
          title: this.L('实体卡号'),
          dataIndex: 'card_no',
        },
        {
          title: this.L('金额/总金额'),
          dataIndex: 'money',
          scopedSlots: {
            customRender: 'money',
          },
        },
        {
          title: this.L('卡密'),
          dataIndex: 'carmi',
        },
        {
          title: this.L('激活二维码'),
          dataIndex: 'qr_code',
          scopedSlots: {
            customRender: 'qr_code',
          },
        },
        {
          title: this.L('绑定用户'),
          dataIndex: 'user',
          scopedSlots: {
            customRender: 'user',
          },
        },
        {
          title: this.L('兑换时间'),
          dataIndex: 'exchange_time',
        },
        {
          title: this.L('建卡时间'),
          dataIndex: 'add_time',
        },
        {
          title: this.L('操作'),
          key: 'action',
          scopedSlots: {
            customRender: 'action',
          },
        },
      ],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
        showTotal: (total) => `共 ${total} 条记录`,
      },
      list: [],
      modalVisible: false,
      modalConsumptionVisible: false,
      modalTitle: this.L('新建实体卡'),
      modalForm: {
        card_prefix: '', //卡前缀
        start_no: '', //开始数
        end_no: '', //结束数
        money: '', //金额
        total: '', //数量
      },
      rules: {
        card_prefix: [{ required: true, message: this.L('请输入卡号前缀'), trigger: 'blur' }],
        start_no: [{ required: true, message: this.L('请输入卡号范围'), trigger: 'blur' }],
        money: [{ required: true, message: this.L('请输入实体卡金额'), trigger: 'blur' }],
        total: [{ required: true, message: this.L('请输入数量'), trigger: 'blur' }],
      },
      modalWidth: '30%',
      consumptionColumns: [
        {
          title: this.L('店铺'),
          dataIndex: 'store_name',
        },
        {
          title: this.L('类型'),
          dataIndex: 'type_txt',
        },
        {
          title: this.L('消费金额'),
          dataIndex: 'money',
        },
        {
          title: this.L('消费时间'),
          dataIndex: 'add_time',
        },
      ],
      consumptionList: [],
      consumptionPagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: this.onConsumptionPageChange,
        onShowSizeChange: this.onConsumptionPageSizeChange,
        showTotal: (total) => `共 ${total} 条记录`,
      },
      cardList: [],
    }
  },
  components: { QrCodeModal },
  created() {
    this.getList()
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy()
    next()
  },
  methods: {
    moment,
    getList() {
      this.searchParams.page = this.pagination.current
      this.searchParams.pageSize = this.pagination.pageSize
      this.request(MerchantApi.getPhysicalCardList, this.searchParams).then((res) => {
        this.list = res.data
        this.cardList = res.statistics_list
        this.$set(this.pagination, 'total', res.total)
      })
    },
    //获取与详情列表
    getListDetail(e) {
      let params = {
        page: this.consumptionPagination.current,
        pageSize: this.consumptionPagination.pageSize,
        id: e.id,
      }
      this.request(MerchantApi.getPhysicalCardOrderList, params).then((res) => {
        this.consumptionList = res.data
        this.$set(this.consumptionPagination, 'total', res.total)
      })
    },
    timeOnChange(date, dateString) {
      this.searchParams.start_date = dateString[0]
      this.searchParams.end_date = dateString[1]
    },
    //新建实体卡
    addCard() {
      this.modalVisible = true
      Object.keys(this.modalForm).forEach((key) => {
        this.modalForm[key] = ''
      })
    },
    //搜索
    search() {
      this.pagination.current = 1
      this.getList()
    },
    //详情
    detailItem(e) {
      this.modalConsumptionVisible = true
      this.getListDetail(e)
    },
    qrCodeModal(e) {
      this.$nextTick(() => {
        this.$refs.qrCodeModal.showModal(true, { qrcode: e.qr_code }, 1, this.L('查看二维码'))
      })
    },
    //删除
    delItem(e) {
      this.$confirm({
        title: this.L('确定删除吗?'),
        content: this.L('删除将无法恢复'),
        okText: this.L('是'),
        okType: 'danger',
        cancelText: this.L('否'),
        onOk: () => {
          this.request(MerchantApi.delPhysicalCard, { id: e.id }).then((res) => {
            this.$message.success(this.L('删除成功！'))
            this.getList()
          })
        },
      })
    },
    //导出
    exportCard() {
      this.request(MerchantApi.exportPhysicalCard, this.searchParams).then((res) => {
        if (res.file_url) {
          window.open(res.file_url)
        }
      })
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (!this.modalForm.start_no) {
            this.$message.warning(this.L('请填写卡号位数'))
            return
          }

          this.request(MerchantApi.addPhysicalCard, this.modalForm).then((res) => {
            this.modalVisible = false
            this.$message.success(this.L('添加成功！'))
            this.getList()
          })
        } else {
          return false
        }
      })
    },

    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.getList()
    },
    onPageSizeChange(page, pageSize) {
      this.$set(this.pagination, 'pageSize', pageSize)
      this.getList()
    },
    onConsumptionPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.getListDetail()
    },
    onConsumptionPageSizeChange(page, pageSize) {
      this.$set(this.pagination, 'pageSize', pageSize)
      this.getListDetail()
    },
  },
}
</script>

<style lang="less" scoped>
.card-box {
  display: flex;
  flex-wrap: wrap;
  .card-list{
    width: 25%;
  }
  .card-item {
    border: 1px solid #eee;
    width: 80%;
    padding: 15px;
    min-width: 200px;
    margin: 0 auto;
    margin-bottom: 20px;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .price {
      font-weight: bold;
      margin-top: 5px;
    }
    .percentage {
      display: flex;
      justify-content: space-between;
      margin: 18px 0;
    }
    .info {
      border-top: 1px solid #eee;
      padding-top: 10px;
    }
  }
}
.table-box {
  margin-top: 60px;
}
.nowrap {
  display: flex;
  align-items: center;
  white-space: nowrap;
}
</style>