<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <a-tabs default-active-key="0" @change="tabChange">
      <a-tab-pane :key="item.key" :tab="item.label" v-for="item in tabList"></a-tab-pane>
    </a-tabs>
    <!-- 筛选 -->
    <a-row style="margin: 10px 0; display: flex; align-items: center">
      <div class="flag" style="margin-left: 20px">
        <p>商品名称/优惠券名称:</p>
        <a-input style="width: 250px" v-model="queryParams.key" placeholder="商品名称/优惠券名称" />
      </div>
      <div class="flag">
        <p>类型:</p>
        <a-select style="width: 160px" v-model="queryParams.type">
          <a-select-option :value="item.id" v-for="(item, index) in option1" :key="item.id">{{
            item.name
          }}</a-select-option>
        </a-select>
      </div>
      <a-button type="primary" style="margin: 10px 10px 10px 3%" @click="search">搜索</a-button>
    </a-row>
    <a-row type="flex" align="middle" class="center" v-if="tabIndex == 0">
      <div class="btn_list">
        <a-button type="primary" style="margin: 10px 20px" @click="addClick">{{ L('新增') }}</a-button>
        <a-button type="danger" style="margin: 10px 20px" @click="deleltClick">{{ L('删除') }}</a-button>
        <a-button type="primary" style="margin: 10px 20px" @click="toPageClick">{{ L('分类管理') }}</a-button>
      </div>
    </a-row>
    <!-- 数据列表 -->
    <a-table
    v-if="tabIndex == 0"
      style="background: #ffffff"
      :columns="columns"
      rowKey="id"
      :data-source="dataList"
      :pagination="pagination"
      :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onParkingChange,
      }"
    >
      <span slot="sort" slot-scope="text, record">
        <a-input-number :min="0" id="inputNumber" :value="record.sort" @blur="setListSort($event, record)" />
      </span>
      <!-- 操作栏 -->
      <span slot="operation" slot-scope="text, record">
        <a class="inline-block" @click="editList(record)">{{ L('编辑') }}</a>
        <a style="color: red; margin-left: 10px" class="inline-block" @click="delList(record)">{{ L('删除') }}</a>
      </span>
    </a-table>
   <a-table
    v-else-if="tabIndex == 1"
      style="background: #ffffff"
      :columns="columns1"
      rowKey="id"
      :data-source="dataList"
      :pagination="pagination"
    >
      <span slot="sort" slot-scope="text, record">
        <a-input-number :min="0" id="inputNumber" :value="record.sort" @blur="setListSort($event, record)" />
      </span>
      <!-- 操作栏 -->
      <span slot="operation" slot-scope="text, record">
        <a class="inline-block" @click="editList(record)">{{ L('编辑') }}</a>
        <a style="color: red; margin-left: 10px" class="inline-block" @click="delList(record)">{{ L('删除') }}</a>
      </span>
    </a-table>
    <!-- 新建弹框 -->
    <a-modal
      :centered="true"
      :maskClosable="false"
      destroyOnClose
      width="60%"
      v-model="visible"
      :title="titles"
      @ok="addOk"
    >
      <div class="newBox">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="类型">
            <a-select style="width: 160px" v-model="form.type">
              <a-select-option :value="item.id" v-for="(item, index) in shopType" :key="item.id">{{
                item.name
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="选择商家优惠券" v-if="form.type == 2">
            <a-select style="width: 160px" v-model="form.coupon_id">
              <a-select-option :value="item.coupon_id" v-for="(item, index) in coupon_idList" :key="item.coupon_id">{{
                item.name
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="商品名称" v-if="form.type == 1" prop="name">
            <a-input v-model="form.name" placeholder="请输入商品名称" />
          </a-form-model-item>
          <a-form-model-item label="商品分类" prop="goods_type">
            <a-select style="width: 160px" v-model="form.goods_type">
              <a-select-option :value="item.id" v-for="(item, index) in goods_typeList" :key="item.id">{{
                item.name
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="兑换积分" prop="points">
            <a-input style="width: 120px" v-model="form.points" placeholder="请输入积分" />
          </a-form-model-item>
          <a-form-model-item label="剩余库存" v-if="form.type == 1" prop="num">
            <a-input style="width: 120px" v-model="form.num" placeholder="请输入剩余库存" />
          </a-form-model-item>
          <a-form-model-item label="领取地址" v-if="form.type == 1" prop="address">
            <a-input v-model="form.address" placeholder="请输入领取地址" />
          </a-form-model-item>
          <a-form-model-item label="领取地址经纬度" v-if="form.type == 1" prop="lat_lng">
            <a-input :disabled="true" v-model="form.lat_lng" style="width: 200px" placeholder="请选择位置" />
            <a @click="mapPointClick" style="margin-left: 5px">地图选点</a>
          </a-form-model-item>
          <a-form-model-item label="兑换后有效天数" prop="effective_days" v-if="form.type == 1">
            <a-input style="width: 120px" v-model="form.effective_days" placeholder="请输入天数" /><span
              >&nbsp; 天</span
            >
          </a-form-model-item>
          <a-form-model-item label="上传图片" v-if="form.type == 1" prop="image">
            <a-upload
              action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
              list-type="picture-card"
              name="reply_pic"
              :data="{ upload_dir: 'shop/pictures' }"
              :file-list="fileList"
              @preview="handlePreview"
              @change="handleChange"
            >
              <div v-if="fileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
          </a-form-model-item>
          <a-form-model-item label="排序">
            <a-input-number :min="0" id="inputNumber" v-model="form.sort" />
          </a-form-model-item>
          <a-form-model-item label="详情">
            <rich-text :info.sync="form.content" />
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
    <map-point @loadRefresh="setLongLat" ref="mapPointModel" />
  </div>
</template>
<script>
import cardMerchantApi from '@/api/card/merchant'
import mapPoint from './modules/mapPoint.vue'
import RichText from '@/components/RichText/RichText'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
export default {
  data() {
    return {
      tabList: [
        {
          key: '0',
          label: '兑换商品列表',
        },
        {
          key: '1',
          label: '兑换列表',
        },
      ],
      // 选择框1
      option1: [
        {
          id: 0,
          name: '全部',
        },
        {
          id: 1,
          name: '商品',
        },
        {
          id: 2,
          name: '优惠券',
        },
      ],
      shopType: [
        {
          id: 1,
          name: '商品',
        },
        {
          id: 2,
          name: '优惠券',
        },
      ],
      visible: false,
      previewVisible: false,
      titles: '新建',
      //table表格头部
      columns: [
        {
          title: this.L('商品名称/优惠券名称'),
          dataIndex: 'name',
          ellipsis: true,
          width: 300,
        },
        {
          title: this.L('类型'),
          dataIndex: 'type',
        },
        {
          title: this.L('所需积分'),
          dataIndex: 'points',
          ellipsis: true,
        },
        {
          title: this.L('剩余库存'),
          dataIndex: 'num',
          ellipsis: true,
        },
        {
          title: this.L('领取地址'),
          dataIndex: 'address',
          ellipsis: true,
        },
        {
          title: this.L('排序'),
          dataIndex: 'sort',
          ellipsis: true,
          scopedSlots: { customRender: 'sort' },
        },
        {
          title: this.L('操作'),
          width: 150,
          scopedSlots: { customRender: 'operation' },
        },
      ],
      columns1: [
          {
          title: this.L('商品名称/优惠券名称'),
          dataIndex: 'name',
          ellipsis: true,
          width: 300,
        },
        {
          title: this.L('类型'),
          dataIndex: 'type',
        },
        {
          title: this.L('所需积分'),
          dataIndex: 'points',
          ellipsis: true,
        },
        {
          title: this.L('数量'),
          dataIndex: 'num',
          ellipsis: true,
        },
        {
          title: this.L('核销店员'),
          dataIndex: 'staff_name',
          ellipsis: true,
        },
        {
          title: this.L('兑换时间'),
          dataIndex: 'create_time',
          ellipsis: true,
        },
      ],
      //列表数据
      dataList: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
      },
      selectedRowKeys: [],
      listId: 0,
      lsitType: 'add',
      queryParams: {
        page: 1,
        pageSize: 0,
        key: '',
        type: 0,
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      rules: {
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        points: [{ required: true, message: '请输入兑换积分', trigger: 'blur' }],
        num: [{ required: true, message: '请输入剩余库存', trigger: 'blur' }],
        address: [{ required: true, message: '请输入领取地址', trigger: 'blur' }],
        lat_lng: [{ required: true, message: '请选择领取地址经纬度', trigger: 'blur' }],
        effective_days: [{ required: true, message: '请输入有效天数', trigger: 'blur' }],
        image: [{ required: true, message: '请上传图片', trigger: 'blur' }],
        goods_type: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
        coupon_id: [{ required: true, message: '请选择商家优惠券', trigger: 'blur' }],
      },
      form: {
        type: 1, //类型id
        name: '', //姓名
        goods_type: '', //商品分类
        points: '', //需兑换积分
        num: '', //库存
        address: '', //领取地址
        lat: '', //领取地址纬度
        long: '', //领取地址经度
        effective_days: '', //有效天数
        image: '', //图片
        coupon_id: '', //商品优惠券id
        sort: 0, //排序
        lat_lng: '',
        content: ''//详情
      },
      fileList: [],
      previewImage: '',
      goods_typeList: [],
      coupon_idList: [],
      tabIndex: 0
    }
  },
  components: {
    mapPoint,
    RichText,
  },

  created() {
    //商品分类
    this.request(cardMerchantApi.goodsTypeList, { page: 0 }).then((res) => {
      this.goods_typeList = res
    })
    //商家优惠券列表
    this.request(cardMerchantApi.couponList, {}).then((res) => {
      this.coupon_idList = res
    })
    this.getDataList()
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy()
    next()
  },
  methods: {
    //去分类管理页面
    toPageClick() {
      this.$router.push({
        path: '/merchant/card.merchant/pointGoodsType',
      })
    },
    //搜索
    search() {
      this.pagination.current = 1
      if(this.tabIndex == 0){
        this.getDataList()
      }else{
        this.getGoodsExchangeList();
      }
    },
    // 获取table数据
    getDataList() {
      ;(this.queryParams.page = this.pagination.current),
        (this.queryParams.pageSize = this.pagination.pageSize),
        this.request(cardMerchantApi.goodsList, this.queryParams).then((res) => {
          this.dataList = res.data
          this.$set(this.pagination, 'total', res.total)
        })
    },
    //获取兑换商品列表
    getGoodsExchangeList() {
      ;(this.queryParams.page = this.pagination.current),
        (this.queryParams.pageSize = this.pagination.pageSize),
        this.request(cardMerchantApi.goodsExchangeList, this.queryParams).then((res) => {
          this.dataList = res.data
          this.$set(this.pagination, 'total', res.total)
        })
    },
    tabChange(e) {
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.queryParams.key = ''
      this.queryParams.type = 0
      this.tabIndex = e
      if (e == 0) {
        this.getDataList()
      } else {
        this.getGoodsExchangeList()
      }
    },
    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      if(this.tabIndex == 0){
        this.getDataList()
      }else{
        this.getGoodsExchangeList();
      }
    },
    onPageSizeChange(page, pageSize) {
      this.$set(this.pagination, 'current', 1)
      this.$set(this.pagination, 'pageSize', pageSize)
      if(this.tabIndex == 0){
        this.getDataList()
      }else{
        this.getGoodsExchangeList();
      }
    },
    toSetPage(type) {
      const totalPage = Math.ceil(
        (this.pagination.total - (type == 1 ? 1 : this.dataList.length)) / this.pagination.pageSize
      ) // 总页数
      this.pagination.current = this.pagination.current > totalPage ? totalPage : this.pagination.current
      this.pagination.current = this.pagination.current < 1 ? 1 : this.pagination.current
    },
    //列表单选多选
    onParkingChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    //新建
    addClick() {
      this.titles = '新建兑换商品'
      this.lsitType = 'add'
      this.visible = true
      this.fileList = []
      this.form = {
        type: 1, //类型id
        name: '', //姓名
        goods_type: '', //商品分类
        points: '', //需兑换积分
        num: '', //库存
        address: '', //领取地址
        lat: '', //领取地址纬度
        long: '', //领取地址经度
        effective_days: '', //有效天数
        image: '', //图片
        coupon_id: '', //商品优惠券id
        sort: 0, //排序
        lat_lng: '',
        edit_type: 0, //修改类型（0：修改基本信息，1：修改排序）
        content: ''
      }
    },
    //编辑列表
    editList(e) {
      this.titles = '编辑兑换商品'
      this.lsitType = 'deit'

      this.request(cardMerchantApi.goodsDetail, {
        id: e.id,
      }).then((res) => {
        this.visible = true
        this.form = res
        this.form.lat_lng = res.long + ',' + res.lat
        this.fileList = [
          {
            uid: '1',
            name: 'image.png',
            url: res.image,
          },
        ]
      })
    },
    // 单个删除
    delList(e) {
      this.$confirm({
        title: '是否删除该条数据?',
        centered: true,
        onOk: () => {
          this.request(cardMerchantApi.goodsDel, {
            id: [e.id],
          }).then((res) => {
            this.toSetPage(1)
            this.$message.success('删除成功')
            this.getDataList()
          })
        },
      })
    },
    //多选删除
    deleltClick() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.warning('请选择单个或多个列表')
        return
      }
      this.$confirm({
        title: '是否删除单个或多个列表数据?',
        centered: true,
        onOk: () => {
          this.request(cardMerchantApi.goodsDel, {
            id: this.selectedRowKeys,
          }).then((res) => {
            this.toSetPage(2)
            this.$message.success('删除成功')
            this.selectedRowKeys = []
            this.getDataList()
          })
        },
      })
    },
    //弹框确认按钮
    addOk() {
      console.log(this.form)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.lsitType == 'add') {
            this.request(cardMerchantApi.goodsAdd, this.form).then((res) => {
              this.$message.success('添加成功')
              this.visible = false
              this.getDataList()
            })
          } else {
            this.request(cardMerchantApi.goodsEdit, this.form).then((res) => {
              this.$message.success('编辑成功')
              this.visible = false
              this.getDataList()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //失去焦点
    setListSort(e, item) {
      if (e.target._value != item.sort) {
        let params = {
          id: item.id,
          sort: e.target._value,
          edit_type: 1,
        }
        this.request(cardMerchantApi.goodsEdit, params).then((res) => {
          this.$message.success('修改成功')
          this.getDataList()
        })
      }
    },
    handleCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange({ fileList }) {
      this.fileList = fileList
      if (fileList[0] && fileList[0].response) {
        this.form.image = fileList[0].response.data
      } else {
        this.form.image = ''
      }
    },
    mapPointClick() {
      this.$refs.mapPointModel.selectPoint()
    },
    //地图选点事件
    setLongLat(longlat) {
      this.form.lat_lng = longlat
      this.form.long = longlat.split(',')[0]
      this.form.lat = longlat.split(',')[1]
    },
  },
}
</script>
<style scoped lang="less">
.center {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.textarea-wrapper {
  position: relative;
  display: block;
  .m-textarea {
    padding: 8px 12px;
    padding-bottom: 25px;
    height: 100%;
  }
  .m-count {
    color: #808080;
    position: absolute;
    font-size: 12px;
    bottom: 0px;
    right: 12px;
  }
}
.newBox {
  max-height: 70vh;
  overflow-y: scroll;
  .customFormWrap {
    padding: 20px 20px 0 20px;
    background: #fafafa;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    border: 1px solid rgb(235, 238, 245);
  }
}
.flag {
  margin-left: 2%;
  display: inline-flex;
  align-items: center;
  p {
    margin-bottom: 0;
    margin-right: 10px;
  }
}
</style>
