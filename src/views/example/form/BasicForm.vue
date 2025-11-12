<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <!-- <a-form @submit="handleSubmit" :form="form">
      <div v-for="item of data" :key="item.name">
        <a-form-item
          v-if="item.name=='rich_text'"
          :label="item.title"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <rich-text :info.sync="item.value" />
        </a-form-item>
        <a-form-item
          v-if="item.name=='color_picker'"
          :label="item.title"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <color-picker :color.sync="item.value" />
        </a-form-item>
        <form-item
          v-else
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :title="item.title"
          :name="item.name"
          :type="item.type"
          :required="item.required"
          :value="item.value"
          :tips="item.tips"
          :digits="item.digits"
          :url="item.url"
          :max="item.max"
          :min="item.min"
          :selectArray="item.selectArray"
          :rows="item.rows"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
          :switchChecked="item.switchChecked"
          @dataFormat="handleFormData"
        ></form-item>
      </div>
      <a-form-item :wrapperCol="{ span: 24 }" style="text-align: left;">
        <a-button htmlType="submit" type="primary">提交</a-button>
      </a-form-item>
    </a-form>-->

    <!-- 测试 拖拽 -->
    <!-- <a-layout id="components-layout-demo-top-side-2">
      <a-layout-header class="header">11</a-layout-header>
      <a-layout>
        <a-layout-sider width="200" style="background: #fff">
          <div style="width: 200px">
            <drag-box
              :list="list"
              :deleteable="true"
              :defaultSelect="false"
              @handleChange="handleDragDataChange"
            />
          </div>
        </a-layout-sider>
        <a-layout-content
          :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
        >Content</a-layout-content>
      </a-layout>
    </a-layout>-->

    <!-- order-card -->
    <!-- <div v-for="item of orderList" :key="item.order_no">
      <order-card :content="item" />
    </div>-->

    <!--测试 选择商品弹框 -->
    <a-button type="primary" @click="showModal">选择商品</a-button>
    <select-shop-goods
      :visible.sync="visible"
      :menuList="menuList"
      :list="productList"
      @onSearch="onSearch"
      @onMenuSelect="onMenuSelect"
      @submit="goodsSubmit"
    />
  </a-card>
</template>

<script>
const data = []
for (let i = 0; i < 46; i++) {
  data.push({
    id: i,
    name: `product ${i}`,
    code: 'P122541312315',
    pic: `https://picsum.photos/id/${i}/60/60`,
    price: '$56',
    remark: '多规格',
    selected: i % 3 == 0 ? true : false,
  })
}
import FormItem from '@/components/FormItem/FormItem'
import ColorPicker from '@/components/ColorPicker/ColorPicker'
import RichText from '@/components/RichText/RichText'
import DragBox from '@/components/DragBox/DragBox'
import { transferFormValue, dateToDateString } from '@/utils/util'
import OrderCard from './modules/OrderCard'
import SelectShopGoods from '@/components/SelectShopGoods/SelectShopGoods'
export default {
  name: 'BaseForm',
  components: {
    FormItem,
    ColorPicker,
    RichText,
    DragBox,
    OrderCard,
    SelectShopGoods,
  },
  data() {
    return {
      visible: false,
      description: '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
      labelCol: { lg: { span: 6 }, sm: { span: 7 } },
      // 右侧表单填写项占空
      wrapperCol: { lg: { span: 14 }, sm: { span: 17 } },
      formDataHandle: {},
      value: 1,
      data: [],
      // form
      form: this.$form.createForm(this),
      selectArray: [
        { title: 'testtitle', value: 'testvalue' },
        { title: 'testtitle2', value: 'testvalue2' },
        { title: 'testtitle3', value: 'testvalue3' },
      ],
      radioOptions: [
        { label: 'Apple', value: '1' },
        { label: 'Pear', value: '2' },
        { label: 'Orange', value: '3', disabled: true },
      ],
      defaultFileList: [
        {
          uid: '1',
          name: 'xxx.png',
          status: 'done',
          response: 'Server Error 500', // custom error message to show
          url: 'http://www.baidu.com/xxx.png',
        },
        {
          uid: '2',
          name: 'yyy.png',
          status: 'done',
          url: 'http://www.baidu.com/yyy.png',
        },
        {
          uid: '3',
          name: 'zzz.png',
          status: 'error',
          response: 'Server Error 500', // custom error message to show
          url: 'http://www.baidu.com/zzz.png',
        },
      ],
      fileList: [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-2',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-3',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-4',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-5',
          name: 'image.png',
          status: 'error',
        },
      ],
      richTextInfo: '<p>test</p><h1>22</h2>',
      list: [
        {
          title: '一级菜单',
          id: 3,
          fid: 0,
          children: [],
        },
        {
          title: '试试拖我吧',
          id: 1,
          fid: 0,
          children: [
            {
              title: '111',
              id: 8,
              fid: 1,
            },
          ],
        },
        {
          title: '是不是很酷',
          id: 2,
          fid: 0,
        },
        {
          title: 'test',
          id: 12,
          fid: 0,
          children: [
            {
              title: 'test1',
              id: 121,
              fid: 12,
            },
            {
              title: 'test2',
              id: 1212,
              fid: 12,
            },
            {
              title: 'test3',
              id: 123,
              fid: 12,
            },
          ],
        },
      ],
      orderList: [
        {
          order_no: '1001',
          order_time: '今日17:50',
        },
      ],
      menuList: [
        {
          id: 1,
          title: '一级菜单',
          children: [
            {
              id: 2,
              title: '二级菜单',
              children: [
                {
                  id: 3,
                  title: '三级菜单',
                },
                {
                  id: 7,
                  title: 'test',
                },
              ],
            },
          ],
        },
        {
          id: 4,
          title: '只有二级菜单',
          children: [
            {
              id: 5,
              title: '2222',
              children: null,
            },
          ],
        },
        {
          id: 6,
          title: '只有一级菜单',
          children: null,
        },
      ],
      productList: data,
    }
  },
  computed: {
    draggingInfo() {
      return this.dragging ? 'under drag' : ''
    },
  },
  mounted() {
    this.getData()
  },
  methods: {
    showModal() {
      this.visible = true
    },
    onSearch(value) {
      console.log('onSearch', value)
    },
    onMenuSelect(id) {
      console.log('onMenuSelect', id)
    },
    goodsSubmit(value) {
      console.log('submit', value)
    },
    getData() {
      this.data = [
        {
          title: 'input标题',
          name: 'input_text',
          type: 'text',
          required: true,
          value: 'zhengyali',
          disabled: false,
        },
        {
          title: '只能输入url地址',
          name: 'input_url',
          type: 'text',
          required: false,
          value: '',
          url: true,
          tips: '只能输入url哦',
        },
        {
          title: 'select选择框',
          name: 'select',
          type: 'select',
          required: false,
          value: 'testkey',
          selectArray: this.selectArray,
        },
        {
          title: '时间选择',
          name: 'time_pick',
          type: 'time',
          required: false,
          value: '11:11',
        },
        {
          title: '时间选择，默认没选时间',
          name: 'time_pick_2',
          type: 'time',
          required: false,
          value: '',
        },
        {
          title: '日期选择',
          name: 'date_pick',
          type: 'date',
          required: false,
          value: '2020-01-01',
        },
        {
          title: '日期选择，默认没选日期',
          name: 'date_pick_2',
          type: 'date',
          required: false,
          value: '',
        },
        {
          title: '开关',
          name: 'switch111',
          type: 'switch',
          required: false,
          value: 1,
        },
        {
          title: '开关2',
          name: 'switch22',
          type: 'switch',
          required: false,
          value: 0,
        },
        {
          title: 'radio单选',
          name: 'radio',
          type: 'radio',
          required: false,
          value: '1',
          selectArray: this.radioOptions,
        },
        {
          title: '数字输入框',
          name: 'input_number',
          type: 'text',
          required: false,
          value: '100',
          digits: true,
          number: true,
          tips: '这个是提示呢。这个只能输入数字而且是整数哦！',
        },
        {
          title: '上传文件',
          name: 'file_upload',
          type: 'file',
          required: false,
          value: this.defaultFileList,
        },
        {
          title: '上传图片',
          name: 'image_upload',
          type: 'image',
          required: false,
          value: '',
          tips: '据说图片只能上传一张',
        },
        {
          title: '富文本',
          name: 'rich_text',
          type: 'richtext',
          required: false,
          value: '<p>test</p>',
        },
        {
          title: '颜色选择器',
          name: 'color_picker',
          type: 'color',
          required: false,
          value: '#ff0000',
        },
      ]
    },
    handleFormData(value) {
      // this.formDataHandle = {...this.formDataHandle,...value}
      // console.log(this.formDataHandle)
    },
    // handler
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log('Received values of form1: ', values)
          // let formData = JSON.parse(JSON.stringify(values));
          let formData = { ...values }

          // 富文本
          const richText = this.data.find((item) => {
            return item['name'] == 'rich_text'
          })
          if (richText) {
            formData.rich_text = richText.value
          }
          // 颜色选择
          const colors = this.data.find((item) => {
            return item['name'] == 'color_picker'
          })
          if (colors) {
            formData.color_picker = colors.value
          }
          // 要转换的数据类型
          const types = ['switch', 'date', 'time']
          // transferFormValue(this.data, formData, types)
          // 要转化的字段和类型
          const types2 = { date_pick: 'date', date_pick_2: 'date', time_pick: 'time', time_pick_2: 'time' }
          dateToDateString(formData, types2)
          // 最后的数据
          console.log('Received values of form2: ', formData)
        }
      })
    },
    handleDragDataChange(val) {
      console.log(val)
    },
  },
}
</script>
