<template>
  <div class="mt-20 ml-10 mr-10 mb-20">
    <a-form @submit="handleSubmit" :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 10 }" v-if="ajaxData">
      <a-card :title="L('基本信息')" :bordered="false">
        <a-form-item :label="L('店铺名称')">
          <a-input disabled v-decorator="['name', { initialValue: ajaxData.name }]" />
        </a-form-item>
        <a-form-item
          :label="L('店铺图片')"
          :help="L('读取店铺列表 商家图片的第一张图片作为餐饮店铺logo图使用，如需修改可在店铺管理--店铺描述里修改')"
        >
          <img style="height: 70px; border: 1px solid #ddd" :src="ajaxData.logo" />
        </a-form-item>
        <a-form-item :label="L('店铺公告')">
          <template slot="help">
            <div>1. {{ L('用于前台店铺菜单页展示公告信息') }}</div>
            <div>
              2.
              {{
                L(
                  '介绍中不得含有虚假的、冒充、利用他人名义的、容易构成法律、法规和政策禁止的内容，公告字符数建议4-120个'
                )
              }}
            </div>
          </template>
          <a-textarea v-decorator="['store_notice', { initialValue: ajaxData.store_notice }]" :rows="4" />
        </a-form-item>
      </a-card>
      <a-card :title="L('服务信息')" :bordered="false" style="margin-top: 20px">
        <a-form-item :label="L('是否开启在线预订')">
          <a-switch
            v-decorator="['is_book', { initialValue: ajaxData.is_book == 1 ? true : false, valuePropName: 'checked' }]"
            :checked-children="L('开启')"
            :un-checked-children="L('关闭')"
            @change="switchBookType"
          />
        </a-form-item>
        <template v-if="is_book">
          <a-form-item :label="L('预订方式')">
            <a-radio-group @change="changeBookType" v-decorator="['book_type', { initialValue: ajaxData.book_type }]">
              <a-radio :value="1">{{ L('提前选桌') }}</a-radio>
              <a-radio :value="2">{{ L('提前选菜') }}</a-radio>
            </a-radio-group>
          </a-form-item>
          <template v-if="book_table_show">
            <a-form-item :label="L('预订时间')">
              <a-time-picker
                v-decorator="[
                  'book_start',
                  {
                    initialValue: ajaxData.book_start == '' ? null : moment(ajaxData.book_start, 'HH:mm'),
                    rules: [{ required: true, message: L('请选择预定时间~') }],
                  },
                ]"
                format="HH:mm"
                :placeholder="L('开始时间')"
              />
              <span class="ml-10 mr-10">{{ L('至') }}</span>
              <a-time-picker
                v-decorator="[
                  'book_stop',
                  { initialValue: ajaxData.book_stop == '' ? null : moment(ajaxData.book_stop, 'HH:mm') },
                ]"
                format="HH:mm"
                :placeholder="L('结束时间')"
              />
            </a-form-item>
            <a-form-item :label="L('预订间隔时长')" :help="L('两个可预订时间之间相隔的时长')">
              <a-input-number
                v-decorator="[
                  'book_time',
                  { initialValue: ajaxData.book_time, rules: [{ required: true, message: L('请填写预定间隔时长~') }] },
                ]"
              />
              <span class="ml-10">{{ L('分钟') }}</span>
            </a-form-item>
            <a-form-item :label="L('可提前几天预订下单')">
              <a-input-number
                v-decorator="[
                  'book_day',
                  {
                    initialValue: ajaxData.book_day,
                    rules: [{ required: true, message: L('请填写可提前几天预订下单~') }],
                  },
                ]"
                :min="1"
                :max="100"
              />
              <span class="ml-10">天</span>
            </a-form-item>
            <a-form-item :label="L('定金取消时长')" :help="L('至少提前多久取消订单才可退订金')">
              <a-input-number
                v-decorator="[
                  'cancel_time',
                  {
                    initialValue: ajaxData.cancel_time,
                    rules: [{ required: true, message: L('请填写定金取消时长~') }],
                  },
                ]"
                :min="0"
              />
              <span class="ml-10">{{ L('分钟') }}</span>
            </a-form-item>
          </template>
        </template>
        <a-form-item
          :label="L('是否开启扫码落座')"
          :help="
            L(
              '即是否支持用户到店后自己主动扫桌台码/通用码落座桌台位置；设置不开启，则只支持店员手动帮助用户落座；建议开启前，请先下载桌台/通用二维码'
            )
          "
        >
          <a-switch
            v-decorator="[
              'take_seat_by_scan',
              { initialValue: ajaxData.take_seat_by_scan == '1' ? true : false, valuePropName: 'checked' },
            ]"
            :checked-children="L('开启')"
            :un-checked-children="L('关闭')"
          />
        </a-form-item>
        <a-form-item :label="L('结算方式')">
          <a-radio-group
            v-decorator="['settle_accounts_type', { initialValue: ajaxData.settle_accounts_type }]"
            @change="changeSettlementType"
          >
            <a-radio :value="1">{{ L('先吃后付') }}</a-radio>
            <a-radio :value="2">{{ L('先付后吃') }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :label="L('就餐方式')"
          v-if="settle_accounts_type == 2"
          :help="L('该配置只对用户端的【扫通用码且先付后吃】模式下生效')"
        >
          <a-radio-group v-decorator="['dining_type', { initialValue: ajaxData.dining_type }]">
            <a-radio :value="1">{{ L('堂食') }}</a-radio>
            <a-radio :value="2">{{ L('自取') }}</a-radio>
            <a-radio :value="3">{{ L('自取or堂食') }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label="L('拼桌方式')" :help="L('拼桌方式只针对于有桌台号的订单生效')">
          <a-radio-group v-decorator="['share_table_type', { initialValue: ajaxData.share_table_type }]">
            <a-radio :value="2">{{ L('拼桌') }}</a-radio>
            <a-radio :value="1">{{ L('多人点餐') }}</a-radio>
            <a-radio :value="3">{{ L('一桌一单(关闭多人的点餐)') }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :label="L('是否开启在线支付')"
          :help="
            L(
              '即是否支持用户自己主动在线结算订单；设置不支持，则用户只可联系店员在柜台结算；该配置只对用户端的【先吃后付】模式下生效'
            )
          "
        >
          <a-switch
            v-decorator="[
              'open_online_pay',
              { initialValue: ajaxData.open_online_pay == 1 ? true : false, valuePropName: 'checked' },
            ]"
            :checked-children="L('开启')"
            :un-checked-children="L('关闭')"
          />
        </a-form-item>
        <a-form-item :label="L('人均消费')">
          <a-input-number
            v-decorator="['mean_money', { initialValue: ajaxData.mean_money }]"
            :min="0"
            :formatter="(value) => L('￥') + ` ${value}`"
          />
        </a-form-item>
        <a-form-item :label="L('店铺所属分类')" required>
          <a-tree-select
            show-search
            style="width: 100%"
            :value="cate_value"
            tree-checkable
            show-checked-strategy="SHOW_PARENT"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :placeholder="L('请选择分类')"
            allow-clear
            multiple
            tree-default-expand-all
            @change="onChange"
            @search="onSearch"
            @select="onSelect"
          >
            <a-tree-select-node
              v-for="one in categoryTreeData"
              :key="one.key"
              :value="one.value"
              :title="one.title"
              :disabled="true"
            >
              <a-tree-select-node
                v-for="two in one.category_list"
                :key="two.key"
                :value="two.value"
                :title="two.title"
              />
            </a-tree-select-node>
          </a-tree-select>
        </a-form-item>
        <a-form-item label="扫码点餐背景图">
            <a-row class="color-red">扫码点餐背景图建议上传750*1334的图片</a-row>
            <a-row>
                <div class="clearfix">
                  <a-upload
                        action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                        accept="image/*"
                        list-type="picture-card"
                        :file-list="scan_order_bg_img"
                        name="reply_pic"
                        @preview="handlePreviewImg"
                        :data="{ upload_dir: 'store/merchant' }"
                        @change="handleUploadImg($event,'scan_order_bg_img')"
                    >
                        <a-icon type="plus" />
                        <div class="ant-upload-text">{{ L('上传') }}</div>
                    </a-upload>
                </div>
            </a-row>
        </a-form-item>
      </a-card>
      <a-card :title="L('排号信息')" :bordered="false" style="margin-top: 20px">
        <a-form-item :label="L('是否开启在线排号')">
          <a-switch
            v-decorator="[
              'queue_is_open',
              { initialValue: ajaxData.queue_is_open == 1 ? true : false, valuePropName: 'checked' },
            ]"
            :checked-children="L('开启')"
            :un-checked-children="L('关闭')"
          />
        </a-form-item>
        <a-form-item :label="L('叫号模板配置')" :help="L('排号号码用{$a}表示')">
          <a-input v-decorator="['queue_content', { initialValue: ajaxData.queue_content }]" />
        </a-form-item>
      </a-card>
      <a-card :title="L('打印配置')" :bordered="false" style="margin-top: 20px">
        <a-form-item :label="L('是否开启分单打印')"
                     :help="
            L(
              '开启后，同一个订单如果不同次下单，分次展示商品（如：第1次下单 商品 ，第2次下单 商品）。关闭后不区分批次，直接展示订单的全部商品'
            )
          "
        >
          <a-switch
            v-decorator="[
              'print_type',
              { initialValue: ajaxData.print_type == 1 ? true : false, valuePropName: 'checked' },
            ]"
            :checked-children="L('开启')"
            :un-checked-children="L('关闭')"
          />
        </a-form-item>
      </a-card>
      <a-form-item :wrapperCol="{ span: 24 }" class="text-left" style="margin: 20px 0">
        <a-button htmlType="submit" type="primary">{{ L('提交') }}</a-button>
      </a-form-item>
    </a-form>
    <a-modal v-model="previewVisible" :footer="null" :title="L('查看图片')">
        <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import FormItem from '@/components/FormItem/FormItem'
import { transferFormValue } from '@/utils/util'
import foodshopMerchantApi from '@/api/foodshop/merchant'
import moment from 'moment'
import { imgUploadHandle, imgUploadFileListHandle, getBase64 } from '@/utils/util.js'
export default {
  name: 'ShopForm',
  components: {
    FormItem,
  },
  data() {
    return {
      //查询字段
      queryParam: {},
      // 表单数据
      ajaxData: null,

      //表单字段
      store_name: '',
      is_book: false,
      book_type: 1,
      book_start: '00:00:00',
      book_stop: '00:00:00',
      book_time: 0,
      book_day: 0,
      cancel_time: 60,
      take_seat_by_scan: false,
      settle_accounts_type: 1,
      dining_type: 1,
      share_table_type: 1,
      open_online_pay: false,
      mean_money: 0,
      queue_is_open: 0,
      queue_content: '',
      print_type:0,

      //店铺分配树状
      categoryTreeData: [],
      cate_value: [],
      value: 1,
      form: null,
      book_table_show: true,
      scan_order_bg_img: [],
      previewVisible: false,
      previewImage: '',
    }
  },
  watch: {
    $route() {
      if (this.$route.path == '/merchant/merchant.foodshop/shopEdit' && this.$route.query.store_id != undefined) {
        this.ajaxData = this.$options.data().ajaxData
        this.getData()
      }
    },
  },
  //  activated() {
  //     this.getData()
  //   },
  mounted() {
    this.form = this.$form.createForm(this)
    this.getData()
  },
  methods: {
    moment,
    handleOpenChange(book_start) {
      this.book_start = book_start
    },
    handleClose() {
      this.book_start = false
      this.book_stop = false
    },
    getData() {
      if (this.$route.query.store_id != undefined) {
        this.queryParam['store_id'] = this.$route.query.store_id
      } else {
        this.queryParam['store_id'] = 0
      }
      this.request(foodshopMerchantApi.getShopDetail, this.queryParam).then((res) => {
        this.ajaxData = res
        this.categoryTreeData = res.category
        this.cate_value = res.current_cate
        this.is_book = res.is_book == 1 ? true : false
        console.log(this.is_book)

        this.form.setFieldsValue({
          is_book: this.is_book,
          settle_accounts_type: res.settle_accounts_type,
        })

        this.book_table_show = res.book_type == 1 ? true : false
        this.settle_accounts_type = res.settle_accounts_type
        this.queue_is_open = res.queue_is_open
        this.print_type = res.print_type
        this.queue_content = res.queue_content
        this.scan_order_bg_img = res.scan_order_bg_img ? imgUploadFileListHandle([res.scan_order_bg_img], 'image') : []
        this.$forceUpdate()
      })
    },
    switchBookType(value) {
      this.is_book = value
    },
    onChange(value) {
      this.cate_value = value
    },
    onSearch() {},
    onSelect() {
      console.log(this.cate_value)
    },
    changeSettlementType(e) {
      console.log(e)
      this.settle_accounts_type = e.target.value
    },
    changeIsBook(value) {
      this.is_book = value
    },
    changeBookType(value) {
      if (value.target.value == 1) {
        this.book_table_show = true
      } else {
        this.book_table_show = false
      }
    },
    // handler
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.book_start = moment(values.book_start).format('HH:mm')
          values.book_stop = moment(values.book_stop).format('HH:mm')
          values.store_id = this.$route.query.store_id
          values.cate_id_arr = this.cate_value
          values.is_book = this.is_book
          if(this.scan_order_bg_img.length){
            const {response} = this.scan_order_bg_img[0]
            values.scan_order_bg_img = response.data.fileUrl || response.data 
          }else{
            values.scan_order_bg_img = ''
          }
          if (this.cate_value.length < 1) {
            this.$message.error(this.L('请选择店铺分类'))
            return false
          }
          console.log(111111, values)
          this.request(foodshopMerchantApi.shopEdit, values).then((res) => {
            this.$message.success(this.L('保存成功'))
            this.$router.push('/merchant/merchant.foodshop/storeList')
          })
        }
      })
    },
    handleDragDataChange(val) {
      console.log(val)
    },
    // 预览图片
    async handlePreviewImg(file) {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        this.previewImage = file.url || file.preview
        this.previewVisible = true
    },
    // 上传图片
    handleUploadImg(info,type) {
        const { fileList = [], resultData = {} } = imgUploadHandle(info)
        this[type] = fileList
    },
  },
}
</script>
