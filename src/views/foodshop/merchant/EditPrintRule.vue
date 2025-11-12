<template>
  <div class="mt-20 ml-10 mr-10 mb-20">
    <a-form @submit="handleSubmit" :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }" v-if="detail">
      <a-card :title="L('基本信息')" :bordered="false">
        <a-form-item :label="L('小票类型')">
          <a-radio-group v-decorator="['reciept_type', { initialValue: reciept_type }]" @change="onRecieptTypeChange">
            <a-radio :value="1">{{ L('普通小票') }}</a-radio>
            <a-radio :value="2">{{ L('标签小票') }}</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="打印机规则名称">
          <a-input
            v-decorator="[
              'name',
              { initialValue: detail.name, rules: [{ required: true, message: L('请输入打印规则名称') }] },
            ]"
            :aria-placeholder="L('请输入打印机规则名称')"
          />
        </a-form-item>
        <a-form-item :label="L('打印张数')">
          <a-select
            style="width: 200px"
            v-decorator="['number', { initialValue: detail.number, rules: [{ required: true }] }]"
            :disabled="reciept_type == 2"
          >
            <a-select-option v-for="number in numberList" :key="number.key">{{ number.name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-card>

      <a-card :title="L('打印设置')" :bordered="false" style="margin-top: 20px">
        <a-form-item :label="L('打印类型')" v-if="reciept_type == 1">
          <div>
            <a-checkbox-group
              v-decorator="[
                'print_type',
                { initialValue: detail.print_type, rules: [{ required: true, message: L('请选择打印类型') }] },
              ]"
              @change="printTypeChange"
            >
              <a-checkbox :value="type.value" v-for="(type, index) in plainOptions" :key="index">
                {{ type.label }}
              </a-checkbox>
            </a-checkbox-group>
          </div>
        </a-form-item>

        <template v-if="frontShow && reciept_type == 1">
          <a-form-item :label="L('打印前台小票内容')">
            <a-checkbox-group @change="onChange" v-decorator="['front_print', { initialValue: detail.front_print }]">
              <a-checkbox :value="type.value" v-for="(type, index) in frontPrintOptions" :key="index">
                {{ type.label }}
              </a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </template>
        <template>
          <div v-if="backShow || reciept_type == 2">
            <a-form-item :label="L('打印后厨小票内容')" v-if="reciept_type == 1">
              <a-checkbox-group @change="onChange" v-decorator="['back_print', { initialValue: detail.back_print }]">
                <a-checkbox :value="type.value" v-for="(type, index) in backPrintOptions" :key="index">
                  {{ type.label }}
                </a-checkbox>
              </a-checkbox-group>
            </a-form-item>
            <a-form-item :label="L('档口选项')">
              <a-radio-group
                @change="onDangkouChange"
                v-decorator="['dangkou_select', { initialValue: dangkouSelect }]"
              >
                <a-radio :value="index" v-for="(type, index) in dangkouSelectOption" :key="index">{{ type }}</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item :label="L('分档口打印类型')" v-if="fenDangkouShow">
              <a-radio-group
                @change="onFenDangkouChange"
                v-for="type in fendangkouSelectOption"
                :key="type.value"
                v-decorator="['fendangkou_select', { initialValue: detail.fendangkou_select }]"
              >
                <a-radio :value="type.value">{{ type.label }}</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item :label="L('选择打印分类')" v-if="fenDangkouShow && fenDangkouTypeShow == 1">
              <a-tree-select
                :value="selectedGoodsSortList"
                tree-checkable
                show-clear
                show-checked-strategy="SHOW_PARENT"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :placeholder="L('请选择分类')"
                v-decorator="['dangkou_select_goods', { initialValue: selectedGoodsSortList }]"
                @change="onGoodsSortChange"
              >
                <a-tree-select-node
                  v-for="one in goodsSortList"
                  :key="one.sort_id"
                  :value="one.sort_id"
                  :title="one.sort_name"
                  :disabled="false"
                >
                </a-tree-select-node>
              </a-tree-select>
            </a-form-item>
            <a-form-item :label="L('选择打印商品')" v-if="fenDangkouShow && fenDangkouTypeShow == 2">
              <a-button type="primary" @click="selectGoodsClick">{{ L('添加商品') }}</a-button>
              <template>
                <div>
                  <div style="margin-bottom: 16px">
                    <span style="margin-left: 8px">
                      <!-- <template v-if="hasSelected">
                  {{ `Selected ${selectedRowKeys.length} items` }}
                </template> -->
                    </span>
                  </div>
                  <a-table rowKey="goods_id" :columns="goodsColumns" :data-source="selectedGoodsDetailList">
                    <span slot="action" slot-scope="text, record">
                      <a @click="delGoods(record.goods_id)">{{ L('删除') }}</a>
                    </span></a-table
                  >
                </div>
              </template>
            </a-form-item>
          </div>
        </template>
      </a-card>
      <a-card :title="L('打印设备')" :bordered="false" style="margin-top: 20px">
        <template>
          <div>
            <div style="margin-bottom: 16px" v-if="have_print_role == 1">
              <span style="margin-left: 8px">
                <template v-if="reciept_type == 1">
                  <router-link
                    :to="{
                      path: '/merchant/merchant.iframe/menu_49',
                      query: { store_id: queryParam.store_id },
                    }"
                  >
                    <a-button class="icon_btn">{{ L('添加打印机') }}</a-button>
                  </router-link>
                </template>
                <template v-else>
                  <router-link
                    :to="{
                      path: '/merchant/merchant.iframe/menu_10101',
                      query: { store_id: queryParam.store_id },
                    }"
                  >
                    <a-button class="icon_btn">添加打印机</a-button>
                  </router-link>
                </template>
              </span>
            </div>
            <a-table
              :row-selection="{ selectedRowKeys: selectedPrintList, onChange: onSelectChange }"
              rowKey="pigcms_id"
              :columns="columns"
              :data-source="printList"
            />
          </div>
        </template>
        <select-goods
          :visible.sync="selectGoodsVisible"
          :storeId="queryParam.store_id"
          :menuList="goodsSortList"
          :list="selectGoodsList"
          :selectedList="selectedGoodsDetailList"
          @submit="onGoodsSelect"
          @onMenuSelect="onMenuSelect"
          @onSearch="goodsOnSearch"
        />
      </a-card>
      <a-form-item :wrapperCol="{ span: 24 }" class="text-left" style="margin: 20px 0">
        <a-button htmlType="submit" type="primary">{{ L('提交') }}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import FormItem from '@/components/FormItem/FormItem'
import { transferFormValue } from '@/utils/util'
import foodshopMerchantApi from '@/api/foodshop/merchant'
import { TreeSelect } from 'ant-design-vue'
import SelectGoods from '@/components/SelectGoods/SelectGoods'

const numberList = [
  {
    key: 1,
    name: 1,
  },
  {
    key: 2,
    name: 2,
  },
  {
    key: 3,
    name: 3,
  },
  {
    key: 4,
    name: 4,
  },
  {
    key: 5,
    name: 5,
  },
]

const plainOptions = []
const dangkouSelectOption = []
const fendangkouSelectOption = []
const frontPrintOptions = []
const backPrintOptions = []
// 打印机表头
const columns = []
// 选择的商品表头
const goodsColumns = []

const defaultDetail = {
  name: '',
  number: 1,
  print_type: ['1', '2'],
  front_print: ['1', '2', '3'],
  back_print: ['1', '2'],
  dangkou_select: 0,
}

export default {
  name: 'ShopForm',
  components: {
    FormItem,
    SelectGoods,
  },
  data() {
    return {
      visible: false,
      title: this.L('添加'),
      //查询字段
      queryParam: {},

      //表单字段
      defaultDetail,
      detail: {
        name: '',
        number: 1,
        print_type: ['1', '2'],
        front_print: ['1', '2', '3'],
        back_print: ['1', '2'],
        dangkou_select: 0,
        fendangkou_select: 1,
      },
      dangkouSelect: 0,
      // 是否有添加打印机的权限
      have_print_role: 0,

      // 打印机列表
      printList: [],
      // 商品分类列表
      goodsSortList: [],

      // 已选择的商品
      selectedGoodsList: [],
      selectedGoodsDetailList: [],
      // 已选择的商品分类
      selectedGoodsSortList: [],
      // 已选择的打印机
      selectedPrintList: [],

      // 选项值
      plainOptions,
      frontPrintOptions,
      backPrintOptions,
      dangkouSelectOption,
      fendangkouSelectOption,
      // 打印机张数
      numberList,
      goodsColumns,

      //打印机列表
      columns,
      selectedRowKeys: [],
      form: this.$form.createForm(this),

      fenDangkouShow: false,
      fenDangkouTypeShow: 1,

      //弹窗选择商品
      selectGoodsVisible: false,
      selectGoodsList: [],

      getDataStatus: true,

      backShow: true,
      frontShow: true,

      // 小票类型：1-普通小票，2-标签小票
      reciept_type: 1,
    }
  },
  watch: {
    $route() {
      console.log('watch-----------')
      if (this.$route.query.store_id != undefined) {
        this.queryParam.store_id = this.$route.query.store_id
        this.queryParam.id = this.$route.query.id
        this.reciept_type = this.$route.query.reciept_type || 1
        this.getPrintList()
        this.getGoodsSortList()
        this.getDataStatus = false
      }
      this.$set(this, 'detail', null)
      this.$nextTick(() => {
        this.getData()
      })
    },
  },
  created() {
    this.plainOptions = [
      {
        value: '1',
        label: this.L('前台小票'),
      },
      {
        value: '2',
        label: this.L('后厨小票'),
      },
      {
        value: '3',
        label: this.L('排号小票'),
      },
    ]
    this.goodsColumns = [
      {
        title: this.L('商品名称'),
        dataIndex: 'name',
        width: '50%',
      },
      {
        title: this.L('商品分类'),
        dataIndex: 'sort_name',
        width: '35%',
      },
      {
        title: this.L('操作'),
        dataIndex: 'action',
        width: '15%',
        scopedSlots: {
          customRender: 'action',
        },
      },
    ]
    this.columns = [
      {
        title: this.L('打印机名称'),
        dataIndex: 'name',
      },
      {
        title: this.L('打印类型'),
        dataIndex: 'print_type_txt',
      },
      {
        title: this.L('纸张类型'),
        dataIndex: 'paper_txt',
      },
    ]
    this.backPrintOptions = [
      {
        value: '1',
        label: this.L('一菜一单'),
      },
      {
        value: '2',
        label: this.L('整单打印'),
      },
    ]
    this.frontPrintOptions = [
      {
        value: '1',
        label: this.L('客看单'),
      },
      {
        value: '2',
        label: this.L('预结账单'),
      },
      {
        value: '3',
        label: this.L('结账单'),
      },
    ]
    this.fendangkouSelectOption = [
      {
        value: 1,
        label: this.L('打印指定分类'),
      },
      {
        value: 2,
        label: this.L('打印指定商品'),
      },
    ]
    this.dangkouSelectOption = [this.L('同一档口'), this.L('分档口')]
  },
  mounted() {
    console.log('mounted-----------')
    if (this.getDataStatus) {
      this.queryParam.store_id = this.$route.query.store_id
      this.queryParam.id = this.$route.query.id
      this.reciept_type = this.$route.query.reciept_type || 1
      this.getData()
      this.getPrintList()
      this.getGoodsSortList()
    }
  },
  destroyed() {},
  methods: {
    add() {},
    // 选择打印机事件
    onSelectChange(selectedRowKeys) {
      this.selectedPrintList = selectedRowKeys
      console.log(selectedRowKeys, 'selectedRowKeys')
    },
    printTypeChange(value) {
      this.backShow = value.join(',').indexOf('2') != -1 ? true : false
      console.log(this.backShow, ' this.backShow')
      this.frontShow = value.join(',').indexOf('1') != -1 ? true : false
    },
    // 选择商品分类事件
    onGoodsSortChange(value) {
      this.selectedGoodsSortList = value
    },
    // 点击选择商品弹窗
    selectGoodsClick() {
      this.selectGoodsVisible = true
    },
    // 选择商品回调
    onGoodsSelect(e) {
      console.log(e, 'onGoodsSelect')
      this.selectedGoodsDetailList = e.goods
      this.selectedGoodsList = e.ids
      this.selectGoodsVisible = false
    },
    // 选择商品分类
    onMenuSelect(e) {
      this.queryParam.sort_id = e.id
      this.queryParam.keywords = ''
      this.getSelectGoodsList()
    },
    // 删除已选择的商品
    delGoods(goods_id) {
      var goodsList = []
      var goodsDetailList = []
      for (var i = 0; i < this.selectedGoodsList.length; i++) {
        if (goods_id != this.selectedGoodsList[i]) {
          goodsList.push(this.selectedGoodsList[i])
        }
      }

      for (var i = 0; i < this.selectedGoodsDetailList.length; i++) {
        if (this.selectedGoodsDetailList[i].goods_id != goods_id) {
          goodsDetailList.push(this.selectedGoodsDetailList[i])
        }
      }
      this.selectedGoodsList = goodsList
      this.selectedGoodsDetailList = goodsDetailList
    },
    // 搜索商品回调
    goodsOnSearch(e) {
      this.queryParam.sort_id = e.id
      this.queryParam.keywords = e.keywords
      this.getSelectGoodsList()
    },
    onDangkouChange(value) {
      if (value.target.value == 1) {
        this.fenDangkouShow = true
      } else {
        this.fenDangkouShow = false
      }
      console.log(this.fenDangkouShow, 'value')
    },
    onFenDangkouChange(value) {
      if (value.target.value == 1) {
        this.fenDangkouTypeShow = 1
      } else {
        this.fenDangkouTypeShow = 2
      }
    },
    // 获取规则详情
    getData() {
      this.detail = []
      this.$forceUpdate()
      console.log('222222222222222222222', this.queryParam['id'])
      if (this.queryParam['id']) {
        this.request(foodshopMerchantApi.getPrintRuleDetail, this.queryParam).then((res) => {
          this.detail = res
          this.selectedPrintList = res.print_list
          this.selectedGoodsList = res.goods_list
          this.selectedGoodsDetailList = res.goods_detail_list
          this.selectedGoodsSortList = res.goods_sort_list
          this.fenDangkouShow = res.dangkou_select
          this.detail.fendangkou_select = res.dangkou_select == 2 ? 2 : 1
          this.dangkouSelect = res.dangkou_select ? 1 : 0
          this.fenDangkouTypeShow = this.detail.fendangkou_select

          if(this.reciept_type != res.reciept_type){
            this.reciept_type = res.reciept_type
            this.getPrintList()
          }

          // 是否显示后厨小票相关设置
          if (res.print_type && res.print_type.length) {
            this.backShow = res.print_type.join(',').indexOf('2') != -1 ? true : false
            this.frontShow = res.print_type.join(',').indexOf('1') != -1 ? true : false
          }
          console.log(this.detail, ' this.detail')
        })
      } else {
        console.log('333333333333333333')
        this.detail = this.defaultDetail
        this.selectedPrintList = []
        this.selectedGoodsList = []
        this.selectedGoodsDetailList = []
        this.selectedGoodsSortList = []
        this.fenDangkouTypeShow = 0
        this.dangkouSelect = 0
        this.frontShow = true
        console.log(this.detail, 'detail-----------')
      }
      this.$set(this, 'detail', this.detail)
    },
    // 获取打印机列表
    getPrintList() {
      this.queryParam.is_bind_rule = 1
      this.queryParam.reciept_type = this.reciept_type
      this.request(foodshopMerchantApi.storePrintList, this.queryParam).then((res) => {
        this.printList = res.list
        this.have_print_role = res.have_print_role
      })
    },
    // 获取商品分类列表
    getGoodsSortList() {
      this.request(foodshopMerchantApi.selectSortList, this.queryParam).then((res) => {
        this.goodsSortList = res
      })
    },
    // 获取商品列表
    getSelectGoodsList() {
      this.request(foodshopMerchantApi.getPrintGoodsList, this.queryParam).then((res) => {
        this.selectGoodsList = res.list
      })
    },

    onChange(value) {
      console.log(value)
    },
    onSelect() {
      console.log(...arguments)
      console.log(this.cate_value)
    },
    onRecieptTypeChange(value) {
      this.reciept_type = value.target.value
      this.selectedPrintList = []
      this.getPrintList()
      if (this.reciept_type == 1) {
        this.$set(this.detail, 'print_type', this.defaultDetail.print_type)
        this.$set(this.detail, 'front_print', this.defaultDetail.front_print)
        this.$set(this.detail, 'back_print', this.defaultDetail.back_print)
      } else {
        this.$set(this.detail, 'print_type', [])
        this.$set(this.detail, 'front_print', [])
        this.$set(this.detail, 'back_print', [])
      }
    },
    // 提交数据
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.store_id = this.queryParam.store_id
          values.print_list = this.selectedPrintList
          values.id = this.queryParam.id
          values.reciept_type = this.reciept_type
          values.number = this.reciept_type == 1 ? values.number : 1
          if (values.dangkou_select > 0 && values.fendangkou_select == 2) {
            // 选中商品
            values.dangkou_select_goods = this.selectedGoodsList
          }

          // if (this.cate_value.length < 1) {
          //   this.$message.error('请选择店铺分类')
          //   return false
          // }

          console.log(111111, values)
          this.request(foodshopMerchantApi.editPrintRule, values).then((res) => {
            this.$message.success(this.L('保存成功'))
            this.$router.push({ path: '/merchant/merchant.foodshop/printRule', query: { store_id: values.store_id } })
          })
        }
      })
    },
  },
}
</script>
