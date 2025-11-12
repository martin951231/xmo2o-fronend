<template>
  <div style="margin-top: 20px;padding:20px;background-color: #fff;">
    <a-form-model layout="inline" :model="searchForm">
      <a-form-model-item label="活动名称">
        <a-input v-model="searchForm.name" placeholder="活动名称"></a-input>
      </a-form-model-item>
      <a-form-model-item label="状态">
        <a-select
          v-model="searchForm.status"
          style="width:115px;"
        >
          <a-select-option :value="-1">全部</a-select-option>
          <a-select-option :value="1">开启</a-select-option>
          <a-select-option :value="0">关闭</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" @click="submitForm(true)" class="ml-20">搜索</a-button>
        <a-button @click="resetForm()" class="ml-20">重置</a-button>
        <a-button type="primary" class="ml-20" @click="handleAdd">添加</a-button>
      </a-form-model-item>
      <a-form-model-item style="float: right;">
        <a-button type="primary" class="ml-20" @click="setConfig">配置提示语</a-button>
      </a-form-model-item>
    </a-form-model>
    <a-table rowKey="id" :columns="columns" :data-source="datalist" :pagination="pagination" bordered>
<!--      <span slot="image" slot-scope="text, record">-->
<!--        <img :src="text" style="width: 50px; height: 50px;"/>-->
<!--      </span>-->
      <span slot="send_num" slot-scope="text, record">
        <span v-if="text === 0">不限制</span>
        <span v-else>{{text}}</span>
      </span>
      <span slot="status" slot-scope="text, record">
        <a-popconfirm
          title="确定更改该活动状态吗"
          ok-text="是"
          cancel-text="否"
          @confirm="confirm(record.id,record.status)"
        >
          <a-switch checked-children="开启" un-checked-children="关闭" :checked="text === 1 ? true : false" />
        </a-popconfirm>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="() => handleEdit(record.id)">编辑</a>
        <a-divider type="vertical" />
<!--        <a-popover title="二维码">-->
<!--          <template slot="content">-->
<!--            <img style="width: 120px; height: 120px;" :src="record.ewm" alt="image" />-->
<!--          </template>-->
<!--          <a @click="() => showEwm(record.ewm, record.name)">二维码</a>-->
<!--        </a-popover>-->
        <a @click="() => exportEwm(record.id)">导出二维码</a>
        <a-divider type="vertical" />
        <a @click="() => handleRecord(record.id)">领取记录</a>
        <a-divider type="vertical" />
        <a @click="() => handleRecordList(record.id)">卡密列表</a>
      </span>
    </a-table>
    <!-- 添加 -->
    <addScan
      v-if="currentBtn.props === 'addScan'"
      :visible="addVisible"
      :title="currentBtn.title"
      @getDataList="getDataList"
      @handleCancel="addVisible = false"
    ></addScan>
    <!-- 编辑 -->
    <editScan
      v-else-if="currentBtn.props === 'editScan'"
      :visible="editVisible"
      :title="currentBtn.title"
      @getDataList="getDataList"
      @handleCancel="editVisible = false"
      :formData="currentBtn.data"
    ></editScan>
    <!-- 领取记录 -->
    <recordScan
      v-else-if="currentBtn.props === 'recordScan'"
      :visible="recordVisible"
      :title="currentBtn.title"
      @getDataList="getDataList"
      @handleCancel="recordVisible = false"
      :scanId="currentBtn.id"
    ></recordScan>
    <!-- 卡密列表 -->
    <recordListScan 
        ref="recordListScan"
      v-else-if="currentBtn.props === 'recordListScan'"
      :visible="recordListVisible"
      :title="currentBtn.title"
      @getDataList="getDataList"
      @handleCancel="recordListVisible = false"
      :scanId="currentBtn.id"
    ></recordListScan>
    <!-- 二维码 -->
    <a-modal
      title="下载二维码"
      :visible="ewmVisible"
      width="350px"
      @cancel="ewmCancel"
    >
      <template slot="footer">
        <a-button key="back" @click="ewmCancel">
          返回
        </a-button>
        <a-button key="submit" type="primary">
          <a :href="ewm" :download="ewmName">下载</a>
        </a-button>
      </template>
      <img style="width: 120px; height: 120px;" :src="ewm" alt="image" />
    </a-modal>
    <!-- 配置提示语 -->
    <a-modal
      title="配置提示语"
      :visible="setVisible"
      @cancel="setCancel"
      width="700px"
    >
      <template slot="footer">
        <a-button key="back" @click="setCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary" @click="setOk">
          确定
        </a-button>
      </template>
      <a-form-model layout="horizontal" :model="configForm" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="扫码领金额描述">
          <a-input v-model="configForm.scan_money_desc" placeholder="扫码领金额描述"></a-input>
          <span>备注：实际金额以“{金额}”代替</span>
        </a-form-model-item>
        <a-form-model-item label="扫码领积分描述">
          <a-input v-model="configForm.scan_score_desc" placeholder="扫码领积分描述"></a-input>
          <span>备注：实际积分以“{积分}”代替</span>
        </a-form-model-item>
        <a-form-model-item label="弹窗倒计时/秒">
          <a-input v-model="configForm.scan_timeout" placeholder="弹窗倒计时/秒" type="number"></a-input>
          <span>弹窗倒计时/秒</span>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 导出二维码 -->
    <export-add ref="ExportAddModal" :exportUrl="exportUrl" :queryParam="exportId"/>
  </div>
</template>
<script>

import scanPlatformApi from '@/api/scan/platform/index'
import addScan from '@/views/scan/platform/modules/addScan'
import editScan from '@/views/scan/platform/modules/editScan'
import recordScan from '@/views/scan/platform/modules/recordScan'
import recordListScan from '@/views/scan/platform/modules/recordListScan'
import moment from 'moment'
import ExportAdd from '@/views/common/export/ExportAdd.vue'


const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  // {
  //   title: '图片',
  //   dataIndex: 'image',
  //   scopedSlots: { customRender: 'image' },
  //   key: 'image',
  // },
  {
    title: '赠送余额数量',
    dataIndex: 'balance_deno',
    key: 'balance_deno',
  },
  {
    title: '赠送积分数量',
    dataIndex: 'score_deno',
    key: 'score_deno',
  },
  {
    title: '可领取数',
    dataIndex: 'send_num',
    scopedSlots: { customRender: 'send_num' },
    key: 'send_num',
  },
  {
    title: '已领取数',
    dataIndex: 'get_num',
    key: 'get_num',
  },
  {
    title: '开始时间',
    dataIndex: 'start_time',
    key: 'start_time',
  },
  {
    title: '结束时间',
    dataIndex: 'end_time',
    key: 'end_time',
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    key: 'status',
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',

  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];

export default {
  components: {
    addScan,
    editScan,
    recordScan,
    ExportAdd,
    recordListScan,
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      datalist: [],
      columns,
      addVisible: false, //添加
      editVisible: false, //编辑
      recordVisible: false, //记录
      recordListVisible: false, //卡密列表
      currentBtn: '', // 当前点击的操作按钮
      ewmVisible: false,
      setVisible: false,
      ewm: '',
      ewmName: '',
      configForm: {
        scan_money_desc: '',
        scan_score_desc: '',
        scan_timeout: '3'
      },
      //搜索框表单
      searchForm: {
        name: '', // 搜索名称
        status: -1,//上下架
      },
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
        showTotal: (total) => `共 ${total} 条记录`,
      },
      exportUrl: scanPlatformApi.exportEwm,
      exportId: {
        id: 0
      }
    };
  },
  created() {
    this.getDataList(false)
  },
  methods: {
    moment,
    // 获取table数据
    getDataList(is_search) {
      let params = {...this.searchForm}
      if (is_search === true) {
        params.page = 1
        this.$set(this.pagination, 'current', 1)
      } else {
        params.page = this.pagination.current
        this.$set(this.pagination, 'current', this.pagination.current)
      }
      params.pageSize = this.pagination.pageSize
      this.request(scanPlatformApi.index, params).then((res) => {
        this.datalist = res.data
        this.$set(this.pagination, 'total', res.total)
      })
    },
    // 提交搜索表单
    submitForm(is_search = false) {
      this.getDataList(is_search)
    },
    // 重置表单
    resetForm() {
      this.$set(this, 'searchForm', {name: '', status: -1})
      this.$set(this.pagination, 'current', 1)
      this.getDataList()
    },
    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.submitForm()
    },
    onPageSizeChange(page, pageSize) {
      this.$set(this.pagination, 'pageSize', pageSize)
      this.submitForm()
    },
    onChange(id, status) {
      let params = {
        id: id,
        status: 0
      }
      if (status === 0) {
        params.status = 1
      }
      this.request(scanPlatformApi.setStatus, params).then((res) => {
        this.$message.success('操作成功!');
        this.getDataList()
      })
    },
    handleAdd() {
      this.currentBtn = {
        'props': 'addScan',
        'title': '添加活动'
      }
      this.addVisible = true
    },
    handleEdit(id) {
      this.request(scanPlatformApi.editData, {id: id}, 'GET').then((res) => {
        res.status = res.status.toString()
        this.currentBtn = {
          'props': 'editScan',
          'title': '编辑活动',
          'data': res
        }
        this.editVisible = true
      })
    },
    handleRecord(id) {
        this.currentBtn = {
          'props': 'recordScan',
          'title': '领取记录',
          'id': id
        }
        this.recordVisible = true
    },
    handleRecordList(id) {
      this.currentBtn = {
          'props': 'recordListScan',
          'title': '卡密列表',
          'id': id
      }
      this.recordListVisible = true;
        this.$nextTick(()=>{
            this.$refs.recordListScan.setCurrent()
        })
    },
    confirm(id, status) {
      this.onChange(id, status)
    },
    showEwm(ewm, name) {
      this.ewm = ewm
      this.ewmName = name
      this.ewmVisible = true
    },
    ewmCancel() {
      this.ewmVisible = false;
    },
    setConfig() {
      this.request(scanPlatformApi.setConfig, {}, 'GET').then((res) => {
        this.$set(this.configForm, 'scan_money_desc', res.scan_money_desc)
        this.$set(this.configForm, 'scan_score_desc', res.scan_score_desc)
        this.$set(this.configForm, 'scan_timeout', res.scan_timeout)
      })
      this.setVisible = true
    },
    setCancel() {
      this.setVisible = false;
    },
    setOk() {
      this.submitConfig()
    },
    submitConfig() {
      if (this.configForm.scan_timeout < 0) {
        this.$message.error("弹窗倒计时不能小于0！");
        return false;
      }
      this.request(scanPlatformApi.setConfig, this.configForm, 'POST').then((res) => {
        this.$message.success('设置成功!', 1);
        setTimeout(() => {
          this.configForm = {}
          this.setVisible = false
          this.getDataList()
        },1000)
      })
    },
    exportEwm(id) {
      this.$set(this.exportId, 'id', id)
      this.$refs.ExportAddModal.exports()
    }
  },
};
</script>