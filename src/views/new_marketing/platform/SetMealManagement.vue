<template>
  <!-- 套餐管理 -->
  <div>
    <a-card title="套餐管理" :bordered="false">
      <a-form-model
        layout="inline"
        ref="searchInfo"
        :model="searchInfo"
        style="margin-bottom: 30px"
        :labelCol="{ span: 4 }"
      >
        <a-row :gutter="24">
          <a-col :span="9">
            <a-form-model-item label="套餐名称" style="width: 100%">
              <a-input style="width: 300px" placeholder="请输入套餐名称" v-model="searchInfo.name" />
            </a-form-model-item>
          </a-col>
          <a-col :span="9">
            <a-form-model-item label="创建时间" style="width: 100%">
              <a-range-picker
                style="width: 300px"
                :ranges="{
                  过去30天: [moment().subtract(30, 'days'), moment()],
                  过去15天: [moment().subtract(15, 'days'), moment()],
                  过去7天: [moment().subtract(7, 'days'), moment()],
                  今日: [moment(), moment()],
                }"
                format="YYYY-MM-DD"
                v-model="searchInfo.time"
              >
                <a-icon slot="suffixIcon" type="calendar" />
              </a-range-picker>
            </a-form-model-item>
          </a-col>
          <a-col :span="6" style="text-align: right">
            <a-form-model-item>
              <a-button type="primary" htmlType="submit" @click="searchHandle">查询</a-button>
            </a-form-model-item>

            <a-form-model-item>
              <a-button @click="clearSearch">重置</a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <a-button type="primary" size="large" @click="showAdd = true" style="margin-bottom: 30px">创建套餐</a-button>

      <a-table :columns="columns" rowKey="id" :data-source="mealList" :pagination="pagination">
        <div slot="sort" slot-scope="text, record">
          <a-input-number :value="text" @change="handleChange($event, 'sort', record)" />
        </div>
        <span slot="action" slot-scope="text, record">
          <a-button type="link" @click="actionBtn($event, 'editMeal', record)">编辑</a-button>
          <a-button type="link" @click="actionBtn($event, 'deleteMeal', record)">删除</a-button>
        </span>
      </a-table>
    </a-card>

    <!-- 添加、编辑套餐 -->
    <a-modal 
      :title="modalTitle" 
      :width="640" 
      :visible="showAdd" 
      @cancel="showAdd = false" 
      style="max-height: calc(60vh + 110px);overflow:hidden;" 
      bodyStyle="max-height:60vh;overflow:auto;">
      <a-form-model
        ref="mealSetInfo"
        :model="mealSetInfo"
        :rules="mealSetInfoRules"
        :label-col="{ span: 4, offset: 0 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-form-model-item label="套餐名称" help="建议1-10字符内" prop="name">
          <a-input placeholder="请输入套餐名称" v-model="mealSetInfo.name" />
        </a-form-model-item>
        <a-form-model-item label="店铺详情" :wrapper-col="{ span: 16 }" prop="store_detail">
          <div v-for="(item, index) in mealSetInfo.store_detail" :key="index">
            <a-row type="flex">
              <a-col>店铺类型：</a-col>
              <a-col :span="16"
                ><a-cascader :options="storeTypeList" placeholder="请选择类型" v-model="item.type"
              /></a-col>
              <a-col>
                <a-icon
                  v-if="mealSetInfo.store_detail.length > 1"
                  class="dynamic-delete-button"
                  type="minus-circle-o"
                  :disabled="mealSetInfo.store_detail.length === 1"
                  @click="removeStore(index)"
                />
              </a-col>
            </a-row>
            <div class="mb-20"><span>数量：</span><a-input-number :min="0" v-model="item.num" /></div>
          </div>
          <div>
            <a-button style="color: #1890ff; border-color: #1890ff" icon="plus" @click="addStore">添加店铺</a-button>
          </div>
        </a-form-model-item>
        <a-form-model-item label="排序" prop="sort">
          <a-input-number v-model="mealSetInfo.sort" />
        </a-form-model-item>
        <a-form-model-item label="详情描述" :wrapper-col="{ span: 18 }" prop="remark">
          <a-textarea placeholder="请输入详细描述" :rows="4" v-model="mealSetInfo.remark" />
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button @click="showAdd = false">取消</a-button>
        <a-button htmlType="submit" type="primary" @click="saveMealSettings">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import marketingPlatformApi from '@/api/new_marketing/platform/index'
export default {
  data() {
    return {
      // 区域价格table
      columns: [
        {
          title: '套餐名称',
          dataIndex: 'name',
          align: 'center',
        },
        {
          title: '店铺数量',
          dataIndex: 'all_num',
          align: 'center',
        },
        {
          title: '下单总数量',
          dataIndex: 'order_count',
          align: 'center',
        },
        {
          title: '排序',
          dataIndex: 'sort',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'sort' },
        },

        {
          title: '创建时间',
          dataIndex: 'create_time',
          sortDirections: ['descend', 'ascend'],
          sorter: (a, b) => moment(a.place_time).unix() - moment(b.place_time).unix(),
          align: 'center',
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
        },
      ],
      mealList: [],
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
      searchInfo: {
        name: '',
        start_time: '',
        end_time: '',
        time: [],
      }, // 搜索参数
      showAdd: false,
      mealSetInfo: {
        name: '',
        store_detail: [{ type: [], num: 0 }],
        sort: 0,
        remark: '',
      }, // 套餐设置表单
      mealSetInfoRules: {
        name: [{ required: true, message: '请输入套餐名称！' }],
        store_detail: [{ required: true, message: '请添加店铺信息！' }],
      },
      store_detail: [], // 店铺详情列表
      storeTypeList: [], // 店铺类型列表
      modalTitle: '添加套餐',
    }
  },
  watch: {
    showAdd: {
      immediate: true,
      handler: function (val) {
        if (!val) {
          this.modalTitle = '添加套餐'
          this.mealSetInfo = this.$options.data().mealSetInfo
        }
      },
    },
  },

  created() {
    this.getStoreTypeList()
    this.getList()
  },
  methods: {
    moment,
    removeStore(index) {
      this.mealSetInfo.store_detail.splice(index, 1)
    },
    addStore() {
      this.mealSetInfo.store_detail.push({ type: [], num: 0 })
    },
    // 提交套餐设置信息
    saveMealSettings() {
      console.log('提交套餐信息', this.mealSetInfo)
      let type = this.mealSetInfo.id ? 'editMeal' : 'addMeal'
      this.request(marketingPlatformApi[type], this.mealSetInfo).then((res) => {
        this.$message.success('保存成功！', 1)
        this.showAdd = false
        this.clearSearch()
      })
    },
    handleChange(e, type, record) {
      record.sort = e
      if (this.sortTimer) clearTimeout(this.sortTimer)
      this.sortTimer = setTimeout(() => {
        this.request(marketingPlatformApi.editMeal, record).then((res) => {
          console.log('修改成功')
        })
      }, 500)
    },
    // action中的按钮
    actionBtn(e, type, record) {
      if (type == 'editMeal') {
        this.modalTitle = '编辑套餐'
        this.showAdd = true
        this.mealSetInfo = {
          name: record.name,
          store_detail: record.store_detail,
          sort: record.sort,
          remark: record.remark,
          id: record.id,
        }

        return
      }
      if (type == 'deleteMeal') {
        this.$confirm({
          title: '你确定要删除该套餐吗？',
          icon: (h) => {
            return h('a-icon', {
              props: {
                type: 'close-circle',
                theme: 'filled',
              },
              style: {
                color: '#f50f50',
              },
            })
          },
          onOk: () => {
            this.request(marketingPlatformApi.deleteMeal, { id: record.id }).then((res) => {
              this.$message.success('删除成功！', 1)
              this.clearSearch()
            })
          },
        })
        return
      }
    },
    // 查询按钮
    searchHandle(e) {
      e.preventDefault()
      if (this.searchInfo.time.length > 0) {
        this.searchInfo.start_time = this.searchInfo.time[0].format('YYYY-MM-DD')
        this.searchInfo.end_time = this.searchInfo.time[1].format('YYYY-MM-DD')
      } else {
        this.searchInfo.start_time = ''
        this.searchInfo.end_time = ''
      }
      this.getList(true)
    },
    // 重置按钮
    clearSearch() {
      this.searchInfo = this.$options.data().searchInfo
      this.getList(true)
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
    // 获取套餐列表
    getList(update = false) {
      if (update) {
        this.$set(this.pagination, 'current', 1)
        this.$set(this.pagination, 'pageSize', 10)
      }
      let params = {
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        ...this.searchInfo,
      }

      this.request(marketingPlatformApi.getMealList, params).then((res) => {
        this.mealList = res.data || []
        this.pagination.total = res.total
      })
    },
    // 获取店铺类型列表
    getStoreTypeList() {
      this.request(marketingPlatformApi.getStoreTypeList).then((res) => {
        this.storeTypeList = res
      })
    },
  },
}
</script>

<style scoped>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
  margin-left: 5px;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>