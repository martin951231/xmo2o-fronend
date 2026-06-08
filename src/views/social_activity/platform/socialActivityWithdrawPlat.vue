<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
      <a-row>
        <a-col :span="12">
          <span class="mr-10">{{ L('提现时间:') }}</span>
          <a-range-picker
            style="width: 300px"
            v-model="dateRange"
            format="YYYY-MM-DD"
            @change="onDateChange"
          />
          <a-button type="primary" style="margin: 0 10px" @click="onSearch">
            {{ L('搜索') }}
          </a-button>
          <a-button style="margin: 0 10px" @click="onReset">
            {{ L('重置') }}
          </a-button>
        </a-col>
      </a-row>

      <a-table
        style="background: #ffffff;margin-top: 20px"
        :columns="columns"
        rowKey="id"
        :data-source="dataList"
        @change="changePage"
        :pagination="pagination"
      >
        <template slot="status" slot-scope="text">
            <span v-if="text === '通过'" class="text-green-600">{{ text }}</span>
            <span v-else-if="text === '拒绝'" class="text-red-600">{{ text }}</span>
            <span v-else class="text-orange-600">{{ text }}</span>
        </template>

        <template slot="operate" slot-scope="text,item">
            <a v-if="item.audit_status == 0" @click="auditWithdraw(item)">{{ L('审核') }}</a>
        </template>
      </a-table>

      <!-- 审核弹窗 -->
      <a-modal
        v-model="auditModalVisible"
        :title="L('提现审核')"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <div class="audit-form">
          <a-form-item :label="L('提现人')">
            {{ auditForm.realname }}
          </a-form-item>
          <a-form-item :label="L('提现金额')">
            {{ auditForm.amount }}
          </a-form-item>
          <a-form-item :label="L('备注')">
            {{ auditForm.remark }}
          </a-form-item>
          <a-form-item :label="L('提现时间')">
            {{ auditForm.create_time }}
          </a-form-item>
          <a-form-item :label="L('审核状态')">
            <a-radio-group v-model="auditForm.audit_status">
              <a-radio :value="10">{{ L('通过') }}</a-radio>
              <a-radio :value="20">{{ L('拒绝') }}</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="L('审核备注')">
            <a-textarea v-model="auditForm.audit_remark" rows="4" cols="50" :placeholder="L('请输入审核备注')" />
          </a-form-item>
        </div>
      </a-modal>
    </div>
  </template>

  <script>
  import socialActivityApi from '@/api/social_activity/platform/index'

  export default {
    data() {
      return {
        // 审核弹窗
        auditModalVisible: false,
        auditForm: {
          id: '',
          realname: '',
          amount: '',
          remark: '',
          create_time: '',
          audit_status: 10,
          audit_remark: ''
        },

        dataList:[],
        pagination: {
          pageSize: 10,
          total: 0,
          showTotal: (total) => `共 ${total} 条记录`,
          current: 1,
        },
        queryParams: {
          page_size: 10,
          page: 1,
          start_time: '',
          end_time: '',
        },
        dateRange: [],
        columns: [
          {
            title: this.L('提现人'),
            dataIndex: 'realname',
          },
          {
            title: this.L('提现金额'),
            dataIndex: 'amount',
          },
          {
            title: this.L('备注'),
            dataIndex: 'remark',
          },
          {
            title: this.L('提现时间'),
            dataIndex: 'create_time',
          },
          {
            title: this.L('状态'),
            dataIndex: 'status_text',
            scopedSlots: {
              customRender: 'status',
            },
          },
          {
            title: this.L('审核备注'),
            dataIndex: 'audit_remark',
          },
          {
            title: this.L('操作'),
            dataIndex: 'id',
            scopedSlots: {
              customRender: 'operate',
            },
          },
        ],
      }
    },
    watch: {
      $route() {
        this.getLists()
      },
    },
    mounted() {
      this.getLists()
    },
    methods: {
      // 获取提现列表
      getLists() {
        this.queryParams.page_size = this.pagination.pageSize
        this.queryParams.page = this.pagination.current
        this.request(socialActivityApi.getWithdrawList, this.queryParams).then((res) => {
          this.dataList = res.data
          this.pagination.total = res.total
        })
      },

      // 切换表格分页
      changePage(page, pageSize) {
        this.pagination.current = page.current
        this.getLists()
      },

      // 日期范围选择
      onDateChange(date, dateString) {
        this.queryParams.start_time = dateString[0]
        this.queryParams.end_time = dateString[1]
      },

      // 搜索
      onSearch() {
        this.pagination.current = 1
        this.getLists()
      },

      // 重置
      onReset() {
        this.dateRange = []
        this.queryParams.start_time = ''
        this.queryParams.end_time = ''
        this.pagination.current = 1
        this.getLists()
      },

      // 打开审核弹窗
      auditWithdraw(item) {
        this.auditForm = {
          id: item.id,
          realname: item.realname,
          amount: item.amount,
          remark: item.remark,
          create_time: item.create_time,
          audit_status: 10,
          audit_remark: ''
        }
        this.auditModalVisible = true
      },

      // 提交审核
      handleOk() {
        const params = {
          id: this.auditForm.id,
          audit_status: this.auditForm.audit_status,
          audit_remark: this.auditForm.audit_remark
        }
        this.request(socialActivityApi.auditWithdraw, params).then((res) => {
          this.$message.success(this.L('审核成功'))
          this.auditModalVisible = false
          this.getLists()
        })
      },

      // 取消审核
      handleCancel() {
        this.auditModalVisible = false
      },
    },
  }
  </script>
  <style scoped>
  .audit-form {
    max-width: 500px;
  }
  .audit-form /deep/ .ant-form-item {
    display: flex;
    margin-bottom: 16px;
  }
  .audit-form /deep/ .ant-form-item-label {
    width: 90px;
    flex-shrink: 0;
  }
  .audit-form /deep/ .ant-form-item-control {
    flex: 1;
  }
  .audit-form /deep/ .ant-radio-group {
    line-height: 32px;
  }
  </style>
