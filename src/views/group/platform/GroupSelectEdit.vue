<template>
  <div class="mt-20 ml-10 mr-10 mb-20">
    <a-form @submit="handleSubmit" :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 10 }" v-if="ajaxData">
      <a-card :title="title" :bordered="false">
        <a-form-item label="活动名称">
          <a-input
            placeholder="填写活动名称"
            v-decorator="[
              'title',
              { initialValue: ajaxData.title, rules: [{ required: true, message: '请输入活动名称！' },{ max: 6, message: '字数限制为6个字', trigger: 'blur' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="商品活动描述">
          <a-input
            placeholder="填写商品活动描述"
            v-decorator="[
              'desc',
              { initialValue: ajaxData.desc },
            ]"
          />
        </a-form-item>
        <a-form-item :label="t_label">
          <a-switch
            v-decorator="['status', { initialValue: ajaxData.status == 1 ? true : false, valuePropName: 'checked' }]"
            checked-children="是"
            un-checked-children="否"
            @change="switchStatus"
          />
        </a-form-item>
      </a-card>
      <a-card title="商品信息" :bordered="false" style="margin-top: 20px">
        <a-row type="flex" justify="space-between">
          <a-col>
            <div>
              <div><h1><b>{{title}}列表</b></h1></div>
              <div style="font-size: 12px;">已过期商品前端过滤不展示</div>
            </div>
          </a-col>
          <a-col>
            <div>
              <a-button type="primary" @click="selectGoodsClick">添加商品</a-button>
              <a-button
                type="danger"
                @click="delGoodsClick"
                v-if="selectedGoodsDetailList.length"
                style="margin-left: 20px"
              >删除
              </a-button
              >
            </div>
          </a-col>
        </a-row>
        <template>
          <div>
            <div style="margin-bottom: 16px">
              <span style="margin-left: 8px">
                <!-- <template v-if="hasSelected">
                  {{ `Selected ${selectedRowKeys.length} items` }}
                </template> -->
              </span>
            </div>
            <a-table
              :row-selection="{ selectedRowKeys: selectedGoodsList, onChange: onSelectChange }"
              rowKey="group_id"
              :columns="goodsColumns"
              :data-source="selectedGoodsDetailList"
            >
              <span slot="cfg_sort" slot-scope="text, record">
                <a-input-number :min="0" step="1" style="width: 100px" v-model="record.cfg_sort"/>
              </span>
              <span slot="use_count" slot-scope="text, record">
                <a-input-number
                  style="width: 100px"
                  :min="0"
                  v-model="record.use_count"
                  v-if="ajaxData.use_rule == 2"
                />
                <span v-if="ajaxData.use_rule == 1">不限次数</span>
              </span>
              <span slot="time" slot-scope="text, record">
                开始时间：{{ record.begin_time }}结束时间：{{ record.end_time }}
              </span>
              <span slot="sale_count" slot-scope="text, record">
                售出：{{ record.sale_count }} 份 原始库存：
                {{ record.count_num > 0 ? record.count_num : '无限制' }} 虚拟：{{ record.virtual_num }} 人
              </span>
              <span slot="action" slot-scope="text, record">
                <a @click="delGoods(record.group_id)">删除</a>
              </span>
            </a-table>
          </div>
        </template>
        <select-goods
          :visible.sync="selectGoodsVisible"
          :menuList="goodsSortList"
          :list="selectGoodsList"
          :selectType="2"
          :selectedList="selectedGoodsDetailList"
          @submit="onGoodsSelect"
          @onMenuSelect="onMenuSelect"
          @onSearch="goodsOnSearch"
        />
      </a-card>
      <a-form-item :wrapperCol="{ span: 24 }" class="text-left" style="margin: 20px 0">
        <a-button htmlType="submit" type="primary">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import GroupPlatformApi from '@/api/group/platform'
import SelectGoods from '../modules/SelectGoods'

// 选择的商品表头
const goodsColumns = [
  {
    title: '编号',
    dataIndex: 'group_id',
    width: '8%',
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: '10%',
  },
  {
    title: '商家名称',
    dataIndex: 'merchant_name',
    width: '10%',
  },
  {
    title: '价格',
    dataIndex: 'price',
    width: '8%',
  },
  {
    title: '销售概览',
    dataIndex: 'sale_count',
    width: '10%',
    scopedSlots: {
      customRender: 'sale_count',
    },
  },
  {
    title: '时间',
    dataIndex: 'time',
    width: '15%',
    scopedSlots: {
      customRender: 'time',
    },
  },
  {
    title: '排序',
    dataIndex: 'cfg_sort',
    width: '10%',
    scopedSlots: {
      customRender: 'cfg_sort',
    },
  },
  {
    title: '团购状态',
    dataIndex: 'status_str',
    width: '10%',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '15%',
    scopedSlots: {
      customRender: 'action',
    },
  },
]
export default {
  name: 'ShopForm',
  components: {
    SelectGoods,
  },
  data() {
    return {
      // 查询字段
      queryParam: {
        type: 1,// 优选商品
      },
      // 表单数据
      ajaxData: {
        title: '',
        desc: '',
        status: 2,
      },
      catArr: [],
      selectGoodsVisible: false,
      goodsColumns,
      form: null,
      // 商品分类列表
      goodsSortList: [],

      // 已选择的商品
      selectedGoodsDetailList: [],
      selectedGoodsList: [],
      selectGoodsList: [],
      title: '优选商品',
      t_label: '是否展示优选商品'
    }
  },
  created() {
    this.queryParam.cat_id = this.$route.query.cat_id
    this.queryParam.type = this.$route.query.type
    this.setTitle()
  },
  mounted() {
    this.getData()
    // this.getCategoryList()
    this.getCategoryListAll()
    this.setTitle()
  },
  activated() {
    this.getData()
  },
  watch: {
    '$route.query.cat_id'() {
      this.queryParam.cat_id = this.$route.query.cat_id
      this.getData()
      this.getCategoryListAll()
      this.setTitle()
    },
  },
  methods: {
    switchStatus(value) {

    },
    // 获取基本信息
    getData() {
      this.selectedGoodsDetailList = []
      this.form = this.$form.createForm(this)
      console.log('请求数据。。。。')
      this.request(GroupPlatformApi.getCfgInfo, this.queryParam).then((res) => {
        this.ajaxData = res.info
        this.selectedGoodsDetailList = res.group_list
        this.$forceUpdate()
      })
    },
    // 获取分类列表信息
    getCategoryList() {
      this.request(GroupPlatformApi.getGroupFirstCategorylist).then((res) => {
        var temp1 = {
          cat_id: 0,
          cat_name: '其他',
        }
        res.push(temp1)
        this.catArr = res
      })
    },
    getCategoryListAll() {
      this.request(GroupPlatformApi.getCategoryTree,{cat_id:this.$route.query.cat_id}).then((res) => {
        this.goodsSortList = res
      })
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.status = values.status ? 1 : 0
          values.cat_id = this.$route.query.cat_id
          values.type = this.$route.query.type
          values.goods_list = this.selectedGoodsDetailList
          console.log(values, 'values')
          // if (!values.goods_list.length) {
          //   this.$message.error('请添加商品')
          //   return false
          // }
          this.request(GroupPlatformApi.editCfgInfo, values).then((res) => {
            this.$message.success('保存成功')
            this.form = this.$form.createForm(this)
            if (this.$route.query.cat_id > 0) {
              this.$router.push('/group/platform.groupCategory/edit?cat_id='+this.$route.query.cat_id+'&cat_fid=0'+'&key=2')
            } else {
              this.$router.push('/group/platform.decorate/index')
            }
          })
        }
      })
    },
    // 获取商品列表
    getSelectGoodsList() {
      this.queryParam['flag'] = 'group_renovation'
      this.request(GroupPlatformApi.getGroupGoodsList, this.queryParam).then((res) => {
        this.selectGoodsList = res.list
      })
    },
    // 点击选择商品弹窗
    selectGoodsClick() {
      this.selectGoodsVisible = true
    },
    // 选择商品回调
    onGoodsSelect(e) {
      console.log(e, 'onGoodsSelect')
      this.selectedGoodsDetailList = e.goods
      this.selectGoodsVisible = false
    },
    // 选择商品分类
    onMenuSelect(e) {
      if(this.queryParam.sort_id == 0){
        this.queryParam.sort_id = e.id
      }
      this.queryParam.keywords = ''
      this.getSelectGoodsList()
    },
    // 批量删除已选择的商品
    delGoodsClick() {
      var selectedGoodsDetailList = []
      for (var i = 0; i < this.selectedGoodsDetailList.length; i++) {
        if (this.selectedGoodsList.indexOf(this.selectedGoodsDetailList[i].group_id) == -1) {
          selectedGoodsDetailList.push(this.selectedGoodsDetailList[i])
        }
      }
      this.selectedGoodsDetailList = selectedGoodsDetailList
      this.selectedGoodsList = []
    },
    // 删除已选择的商品
    delGoods(group_id) {
      var goodsList = []
      var goodsDetailList = []
      for (var i = 0; i < this.selectedGoodsList.length; i++) {
        if (group_id != this.selectedGoodsList[i]) {
          goodsList.push(this.selectedGoodsList[i])
        }
      }

      for (var i = 0; i < this.selectedGoodsDetailList.length; i++) {
        if (this.selectedGoodsDetailList[i].group_id != group_id) {
          goodsDetailList.push(this.selectedGoodsDetailList[i])
        }
      }
      this.selectedGoodsList = goodsList
      this.selectedGoodsDetailList = goodsDetailList
      // this.getCostPriceTotal()
    },
    // 搜索商品回调
    goodsOnSearch(e) {
      this.queryParam.sort_id = e.id
      this.queryParam.keywords = e.keywords
      this.getSelectGoodsList()
    },

    // 选择商品
    onSelectChange(selectedRowKeys) {
      this.selectedGoodsList = selectedRowKeys
    },
    // 设置排序
    handleSortChange(val, id) {
      this.request(GroupPlatformApi.editCfgSort, {
        id: id,
        sort: val,
      }).then((res) => {
        this.request(GroupPlatformApi.getRenovationGoodsList, this.queryParam).then((res) => {
          if (res.group_list.length) {
            this.selectedGoodsDetailList = res.group_list
          }
        })
      })
    },
    // 设置标题
    setTitle() {
      if(this.queryParam.cat_id > 0) {
        this.title = '精选商品'
        this.t_label = '是否展示精选商品'
      } else {
        this.title = '优选商品'
        this.t_label = '是否展示优选商品'
      }
    }
  }
}
</script>
<style scoped lang="less">
</style>