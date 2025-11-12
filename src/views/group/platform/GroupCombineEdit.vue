<template>
  <div class="mt-20 ml-10 mr-10 mb-20">
    <a-form @submit="handleSubmit" :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 10 }" v-if="ajaxData">
      <a-card title="基本信息" :bordered="false">
        <a-form-item label="优惠组合名称">
          <a-input
            placeholder="填写优惠组合名称"
            v-decorator="[
              'title',
              { initialValue: ajaxData.title, rules: [{ required: true, message: '请输入优惠组合名称！' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="优惠组合类型" help="如果该优惠组合中有不同类型的商品，可选其他">
          <a-select
            style="width: 210px"
            v-decorator="['cat_id', { initialValue: ajaxData.cat_id }]"
            v-if="catArr.length"
          >
            <a-select-option :value="item.cat_id" :key="item.cat_id" v-for="item in catArr">{{
              item.cat_name
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="优惠组合价格">
          <a-input-number
            placeholder="请输入价格"
            :precision="2"
            :min="0"
            step="1"
            style="width: 200px"
            v-decorator="[
              'price',
              { initialValue: ajaxData.price, rules: [{ required: true, message: '请输入价格！' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="优惠组合原价"
          ><a-input-number
            placeholder="请输入原价"
            :precision="2"
            :min="0"
            step="1"
            style="width: 200px"
            v-decorator="[
              'old_price',
              { initialValue: ajaxData.old_price, rules: [{ required: true, message: '请输入原价！' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="可使用优惠组合券次数" help="可限制用户消费的总次数">
          <a-input-number
            placeholder="请输入次数"
            style="width: 200px"
            :min="1"
            v-decorator="[
              'can_use_count',
              { initialValue: ajaxData.can_use_count, rules: [{ required: true, message: '请输入整数！' }] },
            ]"
            @change="canUseCountChange"
          />
        </a-form-item>
        <a-form-item label="组合商品使用规则" help="该项可规定用户消费时每件商品的消费方式">
          <a-select
            style="width: 210px"
            v-decorator="['use_rule', { initialValue: String(ajaxData.use_rule) }]"
            @change="useRuleChange"
          >
            <a-select-option value="1">每件商品可重复使用</a-select-option>
            <a-select-option value="2">每件商品限制次数使用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="优惠组合有效天数"
          help="从用户下单当天计算，到期后将不能使用该优惠组合。若想设置月卡或年卡只需设置对应的天数即可"
          ><a-input-number
            style="width: 200px"
            placeholder="请输入具体天数"
            :min="1"
            v-decorator="[
              'can_use_day',
              { initialValue: ajaxData.can_use_day, rules: [{ required: true, message: '请输入有效天数！' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="优惠组合开始时间" help="开始时间 结束时间 是用于限制用户前端展示的，不影响有效期。">
          <a-date-picker
            show-time
            format="YYYY-MM-DD HH:mm"
            placeholder="选择开始时间精确到时分"
            @change="onChangeStartTime"
            @ok="onOkStartTime"
            v-decorator="[
              'start_time',
              {
                initialValue: ajaxData.start_time == '' ? null : moment(ajaxData.start_time, dateFormat),
                rules: [{ required: true, message: '选择开始时间' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="优惠组合结束时间" help="开始时间 结束时间 是用于限制用户前端展示的，不影响有效期。">
          <a-date-picker
            show-time
            format="YYYY-MM-DD HH:mm"
            placeholder="选择结束时间精确到时分"
            @change="onChangeEndTime"
            @ok="onOkEndTime"
            v-decorator="[
              'end_time',
              {
                initialValue: ajaxData.end_time == '' ? null : moment(ajaxData.end_time, dateFormat),
                rules: [{ required: true, message: '选择结束时间' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="组合商品库存" help="商品原始总库存，库存填写-1 则代表无限量">
          <a-input-number
            :min="-1"
            v-decorator="[
              'stock_num',
              { initialValue: ajaxData.stock_num, rules: [{ required: true, message: '请输入库存！' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="用户限购数" help="用户可购买上限，填写0 则代表不限购"
          ><a-input-number
            :min="0"
            v-decorator="[
              'limit_number',
              { initialValue: ajaxData.limit_number, rules: [{ required: true, message: '请输入大于等于0的整数！' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="优惠组合主图色">
          <color-picker :color.sync="ajaxData.main_color" />
        </a-form-item>
        <a-form-item label="优惠组合banner图" help="建议750*600px">
          <a-upload
            name="reply_pic"
            :file-list="bannerFileList"
            :action="uploadImg"
            :headers="headers"
            @change="bannerImgChange"
          >
            <a-button> <a-icon type="upload" /> 上传图片</a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="优惠组合分享图" help="宽度建议750px，高度会跟随等比例展示。">
          <a-upload
            name="reply_pic"
            :action="uploadImg"
            :file-list="shareFileList"
            :headers="headers"
            @change="shareImgChange"
          >
            <a-button> <a-icon type="upload" /> 上传图片 </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="推广海报背景图" help="用户分享海报背景图，系统左下角将自动生成二维码。尺寸1080*1920">
          <a-upload
            name="reply_pic"
            :action="uploadImg"
            :file-list="sharePosterFileList"
            :headers="headers"
            @change="sharePosterImgChange"
          >
            <a-button> <a-icon type="upload" /> 上传图片 </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="优惠组合分享标题" help="未填写默认为组合活动名称">
          <a-input placeholder="请输入内容" v-decorator="['share_title', { initialValue: ajaxData.share_title }]" />
        </a-form-item>
        <a-form-item label="优惠组合分享副标题" help="未填写默认为 点击进入">
          <a-input placeholder="请输入内容" v-decorator="['share_desc', { initialValue: ajaxData.share_desc }]" />
        </a-form-item>
        <a-form-item label="优惠组合使用规则" help="">
          <a-textarea
            placeholder="请输入内容"
            v-decorator="['rule_detail', { initialValue: ajaxData.rule_detail }]"
            :rows="4"
          />
        </a-form-item>
        <a-form-item label="购买后可取消订单" help="">
          <a-switch
            v-decorator="[
              'can_cancel',
              { initialValue: ajaxData.can_cancel == 1 ? true : false, valuePropName: 'checked' },
            ]"
            checked-children="是"
            un-checked-children="否"
            @change="switchCanCancel"
          />
        </a-form-item>
        <a-form-item v-if="ajaxData.can_cancel == 0" label="分享佣金金额" help="用户推广组合套餐成功下单后获得的金额">
          <a-input-number
            placeholder="请输入佣金金额"
            :precision="2"
            :min="0"
            step="1"
            style="width: 200px"
            v-decorator="['spread_money', { initialValue: ajaxData.spread_money }]"
          />
        </a-form-item>
        <a-form-item label="活动状态">
          <a-switch
            v-decorator="['status', { initialValue: ajaxData.status == 1 ? true : false, valuePropName: 'checked' }]"
            checked-children="开启"
            un-checked-children="关闭"
            @change="switchStatus"
          />
        </a-form-item>
      </a-card>
      <a-card title="商品信息" :bordered="false" style="margin-top: 20px">
        <div style="display: flex; justify-content: space-between">
          <div>
            <a-button type="primary" @click="selectGoodsClick">添加商品</a-button>
            <a-button
              type="danger"
              @click="delGoodsClick"
              v-if="selectedGoodsDetailList.length"
              style="margin-left: 20px"
              >删除</a-button
            >
          </div>
          <div>
            <div>当前优惠组合可使用次数 {{ can_use_count }}</div>
            <div>
              商品总成本价<span style="color: red"> ￥{{ cost_price_total }} </span>
            </div>
          </div>
        </div>
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
              <span slot="cost_price" slot-scope="text, record">
                <a-input-number :precision="2" :min="0" step="1" style="width: 100px" v-model="record.cost_price" />
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
                <p>售出：{{ record.sale_count }} 份</p>
                <p>原始库存：{{ record.count_num > 0 ? record.count_num : '无限制' }}</p>
                <p>虚拟：{{ record.virtual_num }} 人</p>
                  
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
import { transferFormValue } from '@/utils/util'
import GroupPlatformApi from '@/api/group/platform'
import uploadApi from '@/api/common/uploads'
import moment from 'moment'
import ColorPicker from '@/components/ColorPicker/ColorPicker'
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
    title: '成本价',
    dataIndex: 'cost_price',
    width: '10%',
    scopedSlots: {
      customRender: 'cost_price',
    },
  },
  {
    title: '用户使用次数',
    dataIndex: 'use_count',
    width: '10%',
    scopedSlots: {
      customRender: 'use_count',
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
    ColorPicker,
    SelectGoods,
  },
  data() {
    return {
      //查询字段
      queryParam: {},
      // 表单数据
      ajaxData: {
        name: '',
        cat_id: 0,
        use_rule: '1',
        start_time: '',
        end_time: '',
        stock_num: 1000,
        limit_number: 0,
        banner_img: '',
        share_img: '',
      },

      //表单字段
      timeFormat: 'HH:mm',
      dateFormat: 'YYYY-MM-DD HH:mm',
      headers: {
        authorization: 'authorization-text',
      },
      catArr: [],
      uploadImg: '/v20/public/index.php' + uploadApi.uploadImg + '?upload_dir=/group/group_combine',
      bannerFileList: [],
      sharePosterFileList: [],
      shareFileList: [],
      selectGoodsVisible: false,
      goodsColumns,
      form: null,
      can_use_count: 0,
      has_use_count: 0,
      // 商品分类列表
      goodsSortList: [],

      // 已选择的商品
      selectedGoodsDetailList: [],
      selectedGoodsList: [],
      selectGoodsList: [],
    }
  },
  computed: {
    cost_price_total() {
      let price = 0
      for (var i = 0; i < this.selectedGoodsDetailList.length; i++) {
        let cost_price = this.selectedGoodsDetailList[i].cost_price || 0
        price = price + parseFloat(cost_price)
      }
      return price
    },
  },
  watch: {
    $route() {
      this.getData()
    },
  },
  created() {
    this.form = this.$form.createForm(this)
  },
  mounted() {
    this.getData()
    this.getCategoryList()
    this.getCategoryListAll()
  },
  methods: {
    moment,
    getData() {
      this.ajaxData = null
      this.selectedGoodsDetailList = []
      this.can_use_count = 0
      this.bannerFileList = []
      this.shareFileList = []
      this.sharePosterFileList = []
      this.form = this.$form.createForm(this)
      console.log('getData')
      if (this.$route.query.id != undefined) {
        this.queryParam['combine_id'] = this.$route.query.id
      } else {
        this.queryParam['combine_id'] = 0
      }
      if (this.queryParam['combine_id'] > 0) {
        this.request(GroupPlatformApi.getGroupCombineDetail, this.queryParam).then((res) => {
          this.ajaxData = res
          console.log(this.ajaxData, 'this.ajaxData')
          this.selectedGoodsDetailList = res.group_list
          this.can_use_count = res.can_use_count
          if (res.banner_img) {
            let img = {
              uid: '1',
              name: res.banner_img,
              status: 'done',
              url: res.banner_img,
            }
            this.bannerFileList.push(img)
          }
          if (res.share_img) {
            let img = {
              uid: '2',
              name: res.share_img,
              status: 'done',
              url: res.share_img,
            }
            this.shareFileList.push(img)
          }
          if (res.share_poster_img) {
            let img = {
              uid: '2',
              name: res.share_poster_img,
              status: 'done',
              url: res.share_poster_img,
            }
            this.sharePosterFileList.push(img)
          }
          this.$forceUpdate()
        })
      } else {
        this.ajaxData = {
          name: '',
          cat_id: 0,
          use_rule: '1',
          start_time: '',
          end_time: '',
          stock_num: 1000,
          limit_number: 0,
          banner_img: '',
          share_img: '',
        }
      }
    },
    getCostPriceTotal() {
      this.cost_price_total = 0
      for (var i = 0; i < this.selectedGoodsDetailList.length; i++) {
        this.cost_price_total = this.cost_price_total + parseFloat(this.selectedGoodsDetailList[i].cost_price)
      }
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
      this.request(GroupPlatformApi.getCategoryTree).then((res) => {
        this.goodsSortList = res
      })
    },
    // handler
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.start_time = moment(values.start_time).format(this.dateFormat)
          values.end_time = moment(values.end_time).format(this.dateFormat)
          values.can_cancel = values.can_cancel ? 1 : 0
          values.status = values.status ? 1 : 0
          values.combine_id = this.$route.query.id
          values.banner_img = this.ajaxData.banner_img
          values.share_img = this.ajaxData.share_img
          values.share_poster_img = this.ajaxData.share_poster_img
          values.goods_list = this.selectedGoodsDetailList
          values.main_color = this.ajaxData.main_color
          console.log(values, 'values')
          if (values.banner_img == '') {
            this.$message.error('请上传优惠组合背景图')
            return false
          }
          if (values.share_img == '') {
            this.$message.error('请上传优惠组合分享图')
            return false
          }
          if (values.share_poster_img == '') {
            this.$message.error('请上传分享海报图')
            return false
          }

          let count = 0
          for (var i = 0; i < this.selectedGoodsDetailList.length; i++) {
            let count1 = this.selectedGoodsDetailList[i].use_count || 0
            count = count + parseFloat(count1)
          }

          if (this.selectedGoodsDetailList && this.selectedGoodsDetailList.length) {
            let cost_price_empty =
              this.selectedGoodsDetailList.filter((item) => {
                if (item.cost_price === '' || item.cost_price === null || item.cost_price === undefined) {
                  return item
                }
              }) || []
            if (cost_price_empty.length) {
              this.$message.error('请输入商品成本价')
              return
            }
          }

          console.log(this.ajaxData, 'this.ajaxData ')
          if (values.use_rule == 2) {
            for (var i = 0; i < this.selectedGoodsDetailList.length; i++) {
              let count1 = this.selectedGoodsDetailList[i].use_count || 0
              if (count1 <= 0) {
                this.$message.error('请输入商品用户使用次数')
                return
              }
            }
          }
          if (values.use_rule == 2 && count != this.can_use_count) {
            this.$message.error('商品的用户使用次数之和与可使用优惠组合券次数必须一致')
            return false
          }
          console.log(111111, values)
          // return
          this.request(GroupPlatformApi.editGroupCombine, values).then((res) => {
            this.$message.success('保存成功')
            this.form = this.$form.createForm(this)
            this.$router.push('/group/platform.groupCombine/index')
          })
        }
      })
    },
    handleDragDataChange(val) {
      console.log(val)
    },
    onChangeStartTime(value) {
      console.log(value, 'value   ')
    },
    onOkStartTime() {},
    onChangeEndTime() {},
    onOkEndTime() {},
    switchStatus(value) {
      // this.ajaxData.status = value
    },
    switchCanCancel(value) {
      this.ajaxData.can_cancel = value
    },
    canUseCountChange(value) {
      this.can_use_count = value
    },
    useRuleChange(value) {
      this.ajaxData.use_rule = value
      if (value == 1) {
        for (var i = 0; i < this.selectedGoodsDetailList.length; i++) {
          this.selectedGoodsDetailList[i].use_count = ''
        }
      }
    },
    // 上传banner图
    bannerImgChange(info) {
      // 图片列表
      let fileList = [...info.fileList]

      fileList = fileList.slice(-1)
      fileList = fileList.map((file) => {
        if (file.response) {
          file.url = file.response.data.full_url
          this.ajaxData.banner_img = info.file.response.data.image
        }
        return file
      })
      this.bannerFileList = fileList
      console.log(this.bannerFileList, 'this.bannerFileList')

      if (info.file.status === 'done') {
        console.log('done')
      } else if (info.file.status === 'error') {
        console.log('error')
        this.$message.error(`${info.file.name} 上传失败.`)
      }
    },
    // 上传背景图
    shareImgChange(info) {
      // 图片列表
      let fileList = [...info.fileList]

      fileList = fileList.slice(-1)
      fileList = fileList.map((file) => {
        if (file.response) {
          file.url = file.response.data.full_url
          this.ajaxData.share_img = info.file.response.data.image
        }
        return file
      })
      this.shareFileList = fileList
      if (info.file.status === 'done') {
        // this.$message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败.`)
      }
    },
    // 上传海报图
    sharePosterImgChange(info) {
      // 图片列表
      let fileList = [...info.fileList]

      fileList = fileList.slice(-1)
      fileList = fileList.map((file) => {
        if (file.response) {
          file.url = file.response.data.full_url
          this.ajaxData.share_poster_img = info.file.response.data.image
        }
        return file
      })
      this.sharePosterFileList = fileList

      if (info.file.status === 'done') {
        console.log('done')
      } else if (info.file.status === 'error') {
        console.log('error')
        this.$message.error(`${info.file.name} 上传失败.`)
      }
    },

    // 获取商品列表
    getSelectGoodsList() {
      this.request(GroupPlatformApi.getGroupCombineGoodsList, this.queryParam).then((res) => {
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
      // this.getCostPriceTotal()
    },
    // 选择商品分类
    onMenuSelect(e) {
      this.queryParam.sort_id = e.id
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
      // this.getCostPriceTotal()
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
  },
}
</script>
