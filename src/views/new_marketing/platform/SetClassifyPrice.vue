<template>
  <!-- 店铺价格设置 -->
  <div class="relative container">
    <a-card title="店铺价格设置" :bordered="false" v-show="!showAreaPriceDetail">
      <div class="mb-20">平台为不同省创建不同的店铺（套餐）价格</div>
      <div class="mb-20"><a-button type="primary" @click="showAreaAdd = true">创建地区价格</a-button></div>
      <a-table :columns="areaPriceColumns" rowKey="id" :data-source="areaPriceList" :pagination="areaPagination">
        <div slot="region" slot-scope="text">
          <span v-for="(item, index) in text" :key="index" class="ml-10">{{ item }}</span>
        </div>
        <div slot="sort" slot-scope="text, record, index">
          <a-input-number :value="text" @change="areaHandleChange($event, 'sort', record, index)" />
        </div>
        <div slot="status" slot-scope="text, record, index">
          <a-switch
            checked-children="开"
            un-checked-children="关"
            :checked="text ? true : false"
            @change="areaHandleChange($event, 'status', record, index)"
          />
        </div>
        <span slot="action" slot-scope="text, record">
          <a-button type="link" @click="actionBtn($event, 'editAreaPrice', record)">编辑</a-button>
          <a-button type="link" @click="actionBtn($event, 'deleteAreaPrice', record)">删除</a-button>
        </span>
      </a-table>

      <!-- 创建区域信息 -->
      <a-modal
        title="创建地区价格"
        :width="640"
        :destroyOnClose="true"
        :visible="showAreaAdd"
        @cancel="showAreaAdd = false"
      >
        <a-form-model
          ref="areaPriceForm"
          :model="areaPriceForm"
          :rules="areaPriceFormRules"
          :label-col="{ span: 4, offset: 4 }"
          :wrapper-col="{ span: 10 }"
        >
          <a-form-model-item label="区域名称" prop="name">
            <a-input placeholder="输入目标区域名称" v-model="areaPriceForm.name" />
          </a-form-model-item>
          <a-form-model-item label="绑定区域">
            <a-select mode="multiple" :showArrow="true" placeholder="请选择区域" v-model="areaPriceForm.region">
              <a-select-option v-for="item in region_list" :key="item.area_id">
                {{ item.area_name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="排序">
            <a-input-number v-model="areaPriceForm.sort" />
          </a-form-model-item>
          <a-form-model-item label="状态">
            <a-switch checked-children="开" un-checked-children="关" v-model="areaPriceForm.status" />
          </a-form-model-item>
        </a-form-model>
        <template slot="footer">
          <a-button @click="showAreaAdd = false">取消</a-button>
          <a-button htmlType="submit" type="primary" @click="saveAreaPriceForm">确定</a-button>
        </template>
      </a-modal>
    </a-card>

    <div v-show="showAreaPriceDetail">
      <div>
        <a-card :bordered="false">
          <div slot="title">
            <!-- 面包屑 -->
            <a-breadcrumb>
              <a-breadcrumb-item
                ><span class="pointer" @click="showAreaPriceDetail = false">店铺价格设置</span></a-breadcrumb-item
              >
              <a-breadcrumb-item><span class="cr-primary">创建价格详情</span></a-breadcrumb-item>
            </a-breadcrumb>
          </div>

          <a-form-model
            ref="areaPriceForm"
            :model="areaPriceForm"
            :rules="areaPriceFormRules"
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 10 }"
          >
            <a-row>
              <a-col :span="2" class="title">基本信息</a-col>
            </a-row>
            <a-form-model-item label="区域名称" prop="name">
              <a-input placeholder="输入目标区域名称" v-model="areaPriceForm.name" />
            </a-form-model-item>
            <a-form-model-item label="绑定区域">
              <a-select mode="multiple" :showArrow="true" placeholder="请选择区域" v-model="areaPriceForm.region">
                <a-select-option v-for="item in region_list" :key="item.area_id">
                  {{ item.area_name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="排序">
              <a-input-number v-model="areaPriceForm.sort" />
            </a-form-model-item>
            <a-form-model-item label="状态">
              <a-switch checked-children="开" un-checked-children="关" v-model="areaPriceForm.status" />
            </a-form-model-item>
          </a-form-model>
        </a-card>

        <a-card
          style="margin-top: 20px"
          :bordered="false"
          :tab-list="tabList"
          :active-tab-key="activeTab"
          @tabChange="onTabChange"
        >
          <div v-if="activeTab === 'classify'">
            <!-- 分类价格设置 -->
            <div class="mb-20">
              店铺主分类编辑为必设置项，若不设置 此区域商家购买时该店铺分类不展示；且子分类店铺年费支持单独设置
            </div>
            <a-table
              rowKey="cat_id"
              :columns="classifyPriceColumns"
              :data-source="classifyPriceList"
              :pagination="classifyPagination"
            >
              <div slot="sort" slot-scope="text, record">
                <a-input-number :value="text" @change="classifyHandleChange($event, 'sort', record)" />
              </div>
              <span slot="year_price" slot-scope="text">
                <span v-if="text == '未设置' || text == '0.00'" style="color: #1890ff">未设置</span>
                <span v-else>{{ text }}</span>
              </span>
              <span slot="discount_type" slot-scope="text">
                <span v-if="text == 1">周年优惠</span>
                <span v-else-if="text == 2">单独设置</span>
                <span v-else-if="text == 3">不设置优惠</span>
                <span v-else style="color: #1890ff">未设置</span>
              </span>
              <span slot="action" slot-scope="text, record">
                <a-button type="link" @click="actionBtn($event, 'editClassifyPrice', record)">编辑</a-button>
              </span>
            </a-table>
          </div>
          <div v-else>
            <!-- 套餐价格设置 -->
            <a-table rowKey="id" :columns="mealColumns" :data-source="areaMealList" :pagination="mealPagination">
              <span slot="year_price" slot-scope="text">
                <span v-if="text == '未设置' || text == '0.00'" style="color: #1890ff">未设置</span>
                <span v-else>{{ text }}</span>
              </span>
              <span slot="discount_type" slot-scope="text">
                <span v-if="text == 1">周年优惠</span>
                <span v-else-if="text == 2">单独设置</span>
                <span v-else-if="text == 3">不设置优惠</span>
                <span v-else style="color: #1890ff">未设置</span>
              </span>
              <span slot="status" slot-scope="text, record, index">
                <a-switch
                  checked-children="开"
                  un-checked-children="关"
                  :checked="text ? true : false"
                  @change="mealHandleChange($event, 'status', record, index)"
                />
              </span>
              <span slot="action" slot-scope="text, record">
                <a-button type="link" @click="actionBtn($event, 'editMealPrice', record)">编辑</a-button>
              </span>
            </a-table>
          </div>
        </a-card>
      </div>

      <!-- 编辑分类价格  -->
      <a-modal
        :title="classifyPriceForm.name"
        :width="660"
        :destroyOnClose="true"
        :visible="showClassifyEdit"
        @cancel="showClassifyEdit = false"
      >
        <a-form-model
          ref="classifyPriceForm"
          :model="classifyPriceForm"
          :rules="classifyPriceFormRules"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-form-model-item
            label="统一年费"
            :help="`年费为1/年的收费标准${
              classifyPriceForm.is_children == 1 ? '' : '，若子分类店铺未设置年费则以主分类年费为准'
            }`"
            prop="year_price"
          >
            <a-input-number :min="0" v-model="classifyPriceForm.year_price" /><span class="ml-10">元</span>
          </a-form-model-item>
          <a-form-model-item label="优惠方式" :wrapper-col="{ span: 20 }" prop="discount_type">
            <a-radio-group name="radioGroup" v-model="classifyPriceForm.discount_type">
              <a-radio :value="1"> 周年优惠 </a-radio>
              <a-radio :value="2"> 单独设置 </a-radio>
              <a-radio :value="3"> 不设置优惠 </a-radio>
            </a-radio-group>
            <div v-show="classifyPriceForm.discount_type == 1">
              <a-row type="flex">
                <a-col>设置优惠率：</a-col>
                <a-col :span="20"
                  ><a-input-number :min="0" :max="100" v-model="classifyPriceForm.discount_rate" /><span class="ml-10"
                    >%</span
                  ></a-col
                >
              </a-row>
              <div class="gray-tips">
                若优惠率5%，则周期1年按标准年费，周期2年总价按标准年费的95折，周期3年总价为9折...
              </div>
            </div>
            <div v-show="classifyPriceForm.discount_type == 2">
              <div v-for="(item, index) in classifyPriceForm.manual_price" :key="index">
                <a-row type="flex">
                  <a-col>第{{ item.year }}年费用：</a-col>
                  <a-col :span="16"
                    ><a-input-number :min="0" v-model="item.price" /><span class="ml-10">元</span
                    ><span class="gray-tips ml-10">第{{ item.year }}年的单独年费</span></a-col
                  >
                  <a-col>
                    <a-icon
                      v-show="index > 1"
                      class="dynamic-delete-button"
                      type="minus-circle-o"
                      @click="removeYearPrice(index)"
                    />
                  </a-col>
                </a-row>
              </div>
              <div>
                <a-button
                  style="margin-left: -20px"
                  type="link"
                  icon="plus"
                  @click="addYearPrice"
                  v-show="classifyPriceForm.manual_price.length < 4"
                  >添加购买年限</a-button
                >
              </div>
            </div>
          </a-form-model-item>
          <a-form-model-item label="排序" prop="sort" v-if="classifyPriceForm.cat_id">
            <a-input-number v-model="classifyPriceForm.sort" />
          </a-form-model-item>
          <a-form-model-item label="状态" prop="status" v-if="classifyPriceForm.package_id">
            <a-switch checked-children="开" un-checked-children="关" v-model="classifyPriceForm.status" />
          </a-form-model-item>
        </a-form-model>
        <template slot="footer">
          <a-button @click="showClassifyEdit = false">取消</a-button>
          <a-button htmlType="submit" type="primary" @click="saveClassifyPriceForm">确定</a-button>
        </template>
      </a-modal>

      <!-- 底部按钮 -->
      <div class="footer flex align-center bg-ff">
        <a-button @click="showAreaPriceDetail = false">取消</a-button>
        <a-button type="primary" class="ml-20" @click="saveAreaPriceForm">保存</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import marketingPlatformApi from '@/api/new_marketing/platform/index'
const areaPriceColumns = [
  // 区域价格table
  {
    title: '区域名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '绑定区域',
    dataIndex: 'region',
    align: 'center',
    scopedSlots: {
      customRender: 'region',
    },
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: '10%',
    align: 'center',
    scopedSlots: { customRender: 'sort' },
  },
  {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    scopedSlots: { customRender: 'status' },
  },
  {
    title: '创建时间',
    dataIndex: 'add_time',
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
]
const classifyPriceColumns = [
  {
    title: '店铺分类名称',
    dataIndex: 'cat_name',
    key: 'cat_name',
  },
  {
    title: '年费',
    dataIndex: 'year_price',
    key: 'year_price',
    align: 'center',
    scopedSlots: {
      customRender: 'year_price',
    },
  },
  {
    title: '优惠方式',
    dataIndex: 'discount_type',
    key: 'discount_type',
    align: 'center',
    scopedSlots: {
      customRender: 'discount_type',
    },
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: '10%',
    align: 'center',
    scopedSlots: { customRender: 'sort' },
  },
  {
    title: '状态',
    dataIndex: 'status_type',
    key: 'status_type',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
  },
]
const mealColumns = [
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
    title: '年费',
    dataIndex: 'year_price',
    align: 'center',
    scopedSlots: {
      customRender: 'year_price',
    },
  },
  {
    title: '优惠方式',
    dataIndex: 'discount_type',
    align: 'center',
    scopedSlots: {
      customRender: 'discount_type',
    },
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
  },
  {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    scopedSlots: { customRender: 'status' },
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
]
export default {
  data() {
    return {
      showAreaPriceDetail: false, // 地区价格详情
      areaPriceColumns: areaPriceColumns,
      areaPriceList: [],
      areaPagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: (page, pagesize) => this.onPageChange(page, pagesize, 'areaPagination'),
        onShowSizeChange: (page, pagesize) => this.onPageSizeChange(page, pagesize, 'areaPagination'),
        showTotal: (total) => `共 ${total} 条记录`,
      },
      areaPriceForm: {
        name: '',
        region: [],
        sort: 0,
        status: true,
        id: '',
      },
      areaPriceFormRules: {
        name: [{ required: true, trigger: 'blur', message: '请输入区域名称！' }],
      },
      showAreaAdd: false,
      region_list: [], // 地区选择列表
      tabList: [
        {
          key: 'classify',
          tab: '分类店铺价格',
        },
        {
          key: 'meal',
          tab: '套餐设置',
        },
      ],
      activeTab: 'classify', // 1分类店铺价格设置  2套餐设置
      classifyPriceList: [],
      classifyPagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: (page, pagesize) => this.onPageChange(page, pagesize, 'classifyPagination'),
        onShowSizeChange: (page, pagesize) => this.onPageSizeChange(page, pagesize, 'classifyPagination'),
        showTotal: (total) => `共 ${total} 条记录`,
      },
      expandedRowKeys: [],
      classifyPriceColumns: classifyPriceColumns,
      showClassifyEdit: false, // 显示分类价格编辑弹窗
      classifyPriceForm: {
        name: '',
        id: '',
        region_id: '',
        cat_id: '',
        year_price: 0,
        discount_type: 1,
        discount_rate: 0,
        manual_price: [
          { year: 2, price: 0 },
          { year: 3, price: 0 },
        ],
        sort: 0,
        area_id: '',
        status: true,
        package_id: '',
      },
      classifyPriceFormRules: {
        year_price: [{ required: true, message: '请填写统一年费！' }],
        discount_type: [{ required: true}],
      },
      areaFormTimer: null,
      classifyPriceFormTimer: null,
      mealStatusTimer: null,
      mealColumns: mealColumns,
      areaMealList: [],
      mealPagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: (page, pagesize) => this.onPageChange(page, pagesize, 'mealPagination'),
        onShowSizeChange: (page, pagesize) => this.onPageSizeChange(page, pagesize, 'mealPagination'),
        showTotal: (total) => `共 ${total} 条记录`,
      },
    }
  },
  watch: {
    showAreaAdd: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.areaPriceForm = this.$options.data().areaPriceForm
        }
      },
    },
    showClassifyEdit: {
      immediate: true,
      handler: function (val) {
        if (!val) {
          this.classifyPriceForm = this.$options.data().classifyPriceForm
        } else {
          console.log('表单数据', this.classifyPriceForm)
        }
      },
    },
    showAreaPriceDetail: {
      immediate: true,
      handler: function (val) {
        if (!val) {
          this.areaPriceForm = this.$options.data().areaPriceForm
        } else {
          this.getClassifyPriceList()
          this.getAreaMealList()
        }
      },
    },
  },
  created() {
    this.getAreaList()
  },
  activated() {
    this.showAreaPriceDetail = false
  },
  methods: {
    mealHandleChange(value, type, record, index) {
      clearTimeout(this.mealStatusTimer)
      record.status = value ? 1 : 0
      this.areaMealList.splice(index, 1, record)
      this.mealStatusTimer = setTimeout(() => {
        let params = {
          package_id: record.id,
          area_id: this.areaPriceForm.id,
          status: value ? 1 : 0,
        }
        this.request(marketingPlatformApi.saveAreaMealStatus, params).then((res) => {
          this.getAreaMealList()
        })
      }, 800)
    },
    getAreaMealList() {
      this.request(marketingPlatformApi.getAreaMealList, { area_id: this.areaPriceForm.id }).then((res) => {
        console.log('区域套餐列表', res)
        this.areaMealList = res.data
      })
    },
    areaHandleChange(value, type, record, index) {
      clearTimeout(this.areaFormTimer)
      if (type == 'status') {
        record[type] = value ? 1 : 0
      } else {
        record[type] = value
      }
      this.areaPriceList.splice(index, 1, record)
      this.areaPriceForm = {
        name: record.name,
        region: record.region_id,
        sort: record.sort,
        status: record.status == 1,
        id: record.id,
      }
      this.areaFormTimer = setTimeout(() => {
        this.saveAreaPriceForm(false)
      }, 800)
    },
    classifyHandleChange(value, type, record) {
      console.log(type, value)
      clearTimeout(this.classifyPriceFormTimer)
      record[type] = value
      if (!Array.isArray(record.manual_price)) {
        record.manual_price = []
        record.region_id = this.areaPriceForm.id
        record.discount_type = 0
      }

      this.classifyPriceForm = record
      this.classifyPriceFormTimer = setTimeout(() => {
        this.saveClassifyPriceForm(false)
      }, 800)
    },
    saveClassifyPriceForm(update = true) {
      let params = JSON.parse(JSON.stringify(this.classifyPriceForm))
      if (update) {
        if (params.year_price <= 0 || (params.discount_type == 1 && params.discount_rate == 0)) {
          let msg = params.year_price <= 0 ? '统一年费请设置大于0的数字！' : '优惠率请设置大于0的数字！'
          this.$message.error(msg)
          return false
        }
        params.manual_price = params.manual_price.map((item) => item.price)
      }

      if (params.status != undefined) {
        params.status = params.status ? 1 : 0
      }

      let api = params.cat_id ? 'saveClassifyPriceForm' : 'saveAreaMealForm'
      this.request(marketingPlatformApi[api], params).then((res) => {
        update && this.$message.success('保存成功！', 1)
        this.showClassifyEdit = false
        params.cat_id ? this.getClassifyPriceList(true) : this.getAreaMealList(true)
      })
    },
    addYearPrice() {
      this.classifyPriceForm.manual_price.push({
        year: this.classifyPriceForm.manual_price.length + 2,
        price: 0,
      })
    },
    removeYearPrice(index) {
      this.classifyPriceForm.manual_price.pop()
    },
    saveAreaPriceForm(update = true) {
      if (!this.areaPriceForm.name) {
        this.$message.error('请输入区域名称')
        return
      }

      let params = JSON.parse(JSON.stringify(this.areaPriceForm))
      params.status = params.status ? 1 : 0
      // console.log('提交参数', params)
      this.request(marketingPlatformApi.saveAreaPriceForm, params).then((res) => {
        update && this.$message.success('保存成功！', 1)
        this.showAreaPriceDetail = false
        this.showAreaAdd = false
        this.getAreaList(true)
      })
    },
    onTabChange(e) {
      this.activeTab = e
    },

    // action中的按钮
    actionBtn(e, type, record) {
      // 编辑套餐价格
      if (type == 'editMealPrice') {
        const { id, status, discount_type, discount_rate, manual_price, name, year_price } = record
        let formData = {
          is_children: 1,
          name,
          year_price,
          discount_type: discount_type || 1,
          discount_rate,
          manual_price: [
            { year: 2, price: 0 },
            { year: 3, price: 0 },
          ],
          area_id: this.areaPriceForm.id,
          status: status == 1,
          package_id: id,
        }
        if (Array.isArray(manual_price) && manual_price.length > 0) {
          formData.manual_price = manual_price.map((item, index) => {
            item = {
              year: index + 2,
              price: item,
            }
            return item
          })
        }
        this.classifyPriceForm = formData
        this.showClassifyEdit = true
        return
      }

      // 编辑分类价格
      if (type == 'editClassifyPrice') {
        let { cat_name, cat_id, is_children, id = '', year_price, discount_rate, discount_type, manual_price } = record
        if (year_price == '未设置') year_price = 0
        if (discount_rate == null) discount_rate = 0
        let formData = {
          name: cat_name,
          id,
          region_id: this.areaPriceForm.id,
          cat_id,
          year_price,
          discount_type: discount_type || 1,
          discount_rate,
          manual_price: [
            { year: 2, price: 0 },
            { year: 3, price: 0 },
          ],
          sort: record.sort,
          is_children,
        }
        if (Array.isArray(manual_price) && manual_price.length > 0) {
          formData.manual_price = manual_price.map((item, index) => {
            item = {
              year: index + 2,
              price: item,
            }
            return item
          })
        }
        this.classifyPriceForm = formData
        this.showClassifyEdit = true
        return
      }

      // 编辑地区信息
      if (type == 'editAreaPrice') {
        this.showAreaPriceDetail = true
        this.areaPriceForm = {
          name: record.name,
          region: record.region_id,
          sort: record.sort,
          status: record.status == 1,
          id: record.id,
        }
        return
      }
      // 删除地区信息
      if (type == 'deleteAreaPrice') {
        this.$confirm({
          title: '你确定要删除该地区吗？',
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
            this.request(marketingPlatformApi.deleteAreaPriceForm, { id: record.id }).then((res) => {
              this.$message.success('删除成功！', 1)
              this.getAreaList()
            })
          },
        })
        return
      }
    },

    // 页码变化
    onPageChange(page, pageSize, type) {
      this.$set(this[type], 'current', page)
      if (type == 'areaPagination') {
        this.getAreaList()
        return
      }
      if (type == 'classifyPagination') {
        this.getClassifyPriceList()
        return
      }
      if (type == 'mealPagination') {
        this.getAreaMealList()
        return
      }
    },
    onPageSizeChange(page, pageSize, type) {
      this.$set(this[type], 'pageSize', pageSize)
      this.$set(this[type], 'current', 1)
      if (type == 'areaPagination') {
        this.getAreaList()
        return
      }
      if (type == 'classifyPagination') {
        this.getClassifyPriceList()
        return
      }
      if (type == 'mealPagination') {
        this.getAreaMealList()
        return
      }
    },

    getAreaList(update = false) {
      if (update) {
        this.$set(this.areaPagination, 'current', 1)
      }
      let params = {
        page: this.areaPagination.current,
        pageSize: this.areaPagination.pageSize,
      }
      this.request(marketingPlatformApi.getAreaList, params).then((res) => {
        this.areaPriceList = res.data || []
        this.region_list = res.region_list || []
        this.$set(this.areaPagination, 'total', res.total || 0)
      })
    },

    // 获取分类店铺价格
    getClassifyPriceList(update = false) {
      if (update) {
        this.$set(this.classifyPagination, 'current', 1)
      }
      let params = {
        page: this.classifyPagination.current,
        pageSize: this.classifyPagination.pageSize,
        id: this.areaPriceForm.id,
      }
      this.request(marketingPlatformApi.getClassifyPriceList, params).then((res) => {
        this.region_list = res.region_list || []
        this.classifyPriceList = res.classes_price_list.data
        this.$set(this.classifyPagination, 'total', res.classes_price_list.total || 0)
      })
    },
  },
}
</script>

<style scoped>
.container {
  padding-bottom: 50px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.footer {
  padding: 0 30px;
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  height: 50px;
  justify-content: flex-end;
  box-shadow: 0 -2px 4px -2px #cccccc;
  z-index: 2;
}
.container >>> .ant-tabs .ant-tabs-large-bar .ant-tabs-tab {
  font-size: 14px;
}
.title {
  white-space: nowrap;
  padding-right: 10px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}
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
.gray-tips {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}
</style>