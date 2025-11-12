<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" style="width: 900px">
          <a-input
            v-decorator="['name', { initialValue: detail.name, rules: [{ required: true, message: '请输入姓名' }] }]"
            placeholder="请输入姓名"
            style="width: 260px"
          />
        </a-form-item>
        <a-form-item label="绑定账号" :labelCol="labelCol" :wrapperCol="wrapperCol" style="width: 900px">
          {{ detail.phone }}
        </a-form-item>
        <a-form-item label="抽成比例" :labelCol="labelCol" :wrapperCol="wrapperCol" style="width: 900px">
          <a-input-number
            :min="0"
            :max="100"
            v-decorator="[
              'team_percent',
              { initialValue: detail.team_percent, rules: [{ required: true, message: '请输入0-100之前数组' }] },
            ]"
            placeholder="请输入"
            style="width: 60px"
          />
          % <br />
          <span style="font-size: 12px; color: #999">技术主管抽取下级技术人员所在团队的订单抽成；不填写即为0</span>
        </a-form-item>
      </a-form>
      <div style="width: 900px; height: 3px; background: #eee; margin-left: -24px; margin-top: 30px"></div>
      <div style="height: 56px; line-height: 56px; font-size: 16px; margin-top: 20px">成员管理</div>
      <a-card :bordered="false">
        <a-table
          :columns="columns"
          :data-source="dataList"
          rowKey="id"
          :pagination="pagination"
          style="min-height: 100px"
        >
          <span slot="action" slot-scope="text, record">
            <a @click="delOne(record.id)">移出</a>
          </span>
        </a-table>
      </a-card>
    </a-spin>
  </a-modal>
</template>

<script>
import MarketingPlatformComponents from '@/api/new_marketing/platform'

export default {
  data() {
    return {
      director: [],
      title: '添加技术主管',
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
      form: null,
      detail: {
        id: 0,
        name: '',
        uid: '',
        team_percent: 0,
      },
      id: 0,
      columns: [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '绑定团队',
          dataIndex: 'team_name',
          key: 'team_name',
        },
        {
          title: '累计提成',
          dataIndex: 'team_commission',
          scopedSlots: { customRender: 'team_commission' },
        },
        {
          title: '添加时间',
          dataIndex: 'add_time',
          key: 'add_time',
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: false,
        onChange: this.onPageChange,
        // onShowSizeChange: this.onPageSizeChange,
        showTotal: (total) => `共 ${total} 条记录`,
      },
      dataList: [],
    }
  },
  mounted() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    edit(id) {
      this.dataList = []
      this.$set(this, 'detail', this.$options.data().detail)
      this.visible = true
      this.id = id
      this.getEditInfo()
      this.getArtisanList()
      this.title = '技术主管详情'
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.id = this.id
          this.request(MarketingPlatformComponents.getMarketingDirectorCreate, values)
            .then((res) => {
              if (this.id > 0) {
                this.$message.success('编辑成功')
              } else {
                this.$message.success('添加成功')
              }
              this.handleCancel()
              this.confirmLoading = false
              this.$emit('loaddata',{is_search: false})
            })
            .catch((error) => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
     onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.getArtisanList()
    },
    getEditInfo() {
      this.request(MarketingPlatformComponents.getMarketingDirectorInfo, {
        id: this.id,
      }).then((res) => {
        this.detail = res
      })
    },
    getArtisanList() {
      this.request(MarketingPlatformComponents.getMarketingDirectorRemove, {
        id: this.id,
        page: this.pagination.current,
        pageSize: this.pagination.pageSize
      }).then((res) => {
        this.dataList = res.list
         this.$set(this.pagination, 'total', res.count)
      })
    },
    // 删除
    delOne(id) {
      this.$confirm({
        title: '提示',
        content: '你确定要将该技术人员移出吗？',
        onOk: () => {
          this.request(MarketingPlatformComponents.getMarketingDirectorArtisan, { id: id }).then((res) => {
            this.getArtisanList()
          })
        },
        onCancel() {},
      })
    },
  },
}
</script>
<style scoped>
.ant-card-body {
  padding: 0;
}
.ant-form-item-label {
  width: 126px;
}
</style>