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
              <div style="font-size: 12px;">已过期组合前端过滤不展示</div>
            </div>
          </a-col>
          <a-col>
            <div>
              <a-button type="primary" @click="selectGoodsClick">添加组合</a-button>
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
            <a-table
              :row-selection="{ selectedRowKeys: selectedGoodsList, onChange: onSelectChange }"
              rowKey="combine_id"
              :columns="goodsColumns"
              :data-source="selectedGoodsDetailList"
            >
              <span slot="detail_url" slot-scope="text">
                <a @click="$refs.SeeH5QrcodeModal.showModal(text)" class="ant-btn-link pointer">查看二维码</a>
              </span>
              <span slot="cfg_sort" slot-scope="text, record">
                <a-input-number :min="0" step="1" style="width: 100px" v-model="record.cfg_sort"/>
              </span>
              <span slot="start_time" slot-scope="text, record"> {{ text }}至{{ record.end_time }} </span>
              <span slot="can_use_day" slot-scope="text"> {{ text }}天 </span>
              <span slot="action" slot-scope="text, record">
                <a @click="delGoods(record.combine_id)">删除</a>
              </span>
            </a-table>
          </div>
        </template>

        <select-combine-goods
          :visible.sync="selectGoodsVisible"
          :menuList="goodsSortList"
          :list="selectGoodsList"
          :selectedList="selectedGoodsDetailList"
          @submit="onGoodsSelect"
          @onMenuSelect="onMenuSelect"
          @onSearch="goodsOnSearch"
        />
        <see-h5-qrcode ref="SeeH5QrcodeModal"/>
      </a-card>
      <a-form-item :wrapperCol="{ span: 24 }" class="text-left" style="margin: 20px 0">
        <a-button htmlType="submit" type="primary">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import GroupPlatformApi from '@/api/group/platform'
import SelectCombineGoods from '../modules/SelectCombineGoods'
import SeeH5Qrcode from '@/views/common/qrcode/SeeH5Qrcode.vue'

// 选择的商品表头
const goodsColumns = [
  {
    title: '优惠组合名称',
    dataIndex: 'title',
    scopedSlots: {customRender: 'title'},
  },
  {
    title: '优惠组合类型',
    dataIndex: 'cat_name',
  },
  {
    title: '查看二维码',
    dataIndex: 'detail_url',
    scopedSlots: {
      customRender: 'detail_url',
    },
    width: '10%',
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
    title: '优惠组合活动时间',
    dataIndex: 'start_time',
    // sorter: true,
    width: '15%',
    scopedSlots: {
      customRender: 'start_time',
    },
  },
  {
    title: '优惠组合有效期',
    dataIndex: 'can_use_day',
    width: '15%',
    scopedSlots: {
      customRender: 'can_use_day',
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '8%',
    scopedSlots: {
      customRender: 'status',
    },
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
    SelectCombineGoods,
    SeeH5Qrcode
  },
  data() {
    return {
      // 查询字段
      queryParam: {
        type: 2,// 超值组合
        page: 0,
        cat_id: 0,
        is_renovation: 1
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
      title: '超值组合设置',
      t_label: '是否展示超值组合'
    }
  },
  created() {
    this.getData()
    this.setTitle()
  },
  mounted() {
    this.getData()
    this.getCategoryListAll()
    this.setTitle()
  },
  watch: {
    '$route.query.type'() {
      this.queryParam.cat_id = this.$route.query.cat_id
      this.queryParam.type = this.$route.query.type
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
      this.queryParam['cat_id'] = this.$route.query.cat_id
      console.log('请求数据。。。。')
      console.log(this.queryParam)
      this.request(GroupPlatformApi.getCfgInfo, this.queryParam).then((res) => {
        this.ajaxData = res.info
        this.selectedGoodsDetailList = res.group_list
        this.$forceUpdate()
      })
    },
    getCategoryListAll() {
      this.request(GroupPlatformApi.getCategoryTree,{cat_id:this.$route.query.cat_id}).then((res) => {
        res.map(item => {
          item.children = []
          return item
        })
        if (this.$route.query.cat_id == 0) {
          var temp1 = {
            sort_name: '其他',
            sort_id: 0,
            key: 0,
            children: []
          }
          res.unshift(temp1)
        }
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
          if (!values.goods_list.length) {
            this.$message.error('请添加商品')
            return false
          }
          this.request(GroupPlatformApi.editCombineCfgInfo, values).then((res) => {
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
      this.request(GroupPlatformApi.groupCombineList, this.queryParam).then((res) => {
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
      let combine_id = []
      this.selectedGoodsDetailList.map((item) => {
        combine_id.push(item.combine_id)
      })
      e.goods.map((itm) => {
        if (combine_id.indexOf(itm.combine_id) == -1) {
          this.selectedGoodsDetailList.push(itm)
        }
      })
      this.selectGoodsVisible = false
    },
    // 选择商品分类
    onMenuSelect(e) {
      this.queryParam.cat_id = e.id
      this.queryParam.keywords = ''
      this.getSelectGoodsList()
    },
    // 批量删除已选择的商品
    delGoodsClick() {
      var selectedGoodsDetailList = []
      for (var i = 0; i < this.selectedGoodsDetailList.length; i++) {
        if (this.selectedGoodsList.indexOf(this.selectedGoodsDetailList[i].combine_id) == -1) {
          selectedGoodsDetailList.push(this.selectedGoodsDetailList[i])
        }
      }
      this.selectedGoodsDetailList = selectedGoodsDetailList
      this.selectedGoodsList = []
    },
    // 删除已选择的商品
    delGoods(combine_id) {
      var goodsList = []
      var goodsDetailList = []
      for (var i = 0; i < this.selectedGoodsList.length; i++) {
        if (combine_id != this.selectedGoodsList[i]) {
          goodsList.push(this.selectedGoodsList[i])
        }
      }

      for (var i = 0; i < this.selectedGoodsDetailList.length; i++) {
        if (this.selectedGoodsDetailList[i].combine_id != combine_id) {
          goodsDetailList.push(this.selectedGoodsDetailList[i])
        }
      }
      this.selectedGoodsList = goodsList
      this.selectedGoodsDetailList = goodsDetailList
    },
    // 搜索商品回调
    goodsOnSearch(e) {
      this.queryParam.sort_id = e.id
      this.queryParam.keyword = e.keywords
      this.getSelectGoodsList()
    },

    // 选择商品
    onSelectChange(selectedRowKeys) {
      this.selectedGoodsList = selectedRowKeys
    },
    // 设置排序
    handleSortChange(val, id) {
      this.request(GroupPlatformApi.editCombineCfgSort, {
        id: id,
        sort: val,
      }).then((res) => {
        this.request(GroupPlatformApi.getRenovationCombineGoodsList, this.queryParam).then((res) => {
          if (res.group_list.length) {
            this.selectedGoodsDetailList = res.group_list
          }
        })
      })
    },
    // 设置标题
    setTitle() {
      if(this.queryParam.cat_id > 0) {
        this.title = '超值联盟设置'
        this.t_label = '是否展示超值联盟'
      } else {
        this.title = '超值组合设置'
        this.t_label = '是否展示超值组合'
      }
    }
  }
}
</script>
<style scoped lang="less">
</style>