<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :label="L('分类名称')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'cat_name',
              { initialValue: detail.cat_name, rules: [{ required: true, message: L('请输入分类名称') }] },
            ]"
          />
        </a-form-item>

        <a-form-item
          :label="L('上级分类')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="detail.cat_fid != 0 || catId <= 0"
          :help="L('不选择上级分类，则添加为一级分类')"
        >
          <a-select
            style="width: 320px"
            v-decorator="['cat_fid', { initialValue: detail.cat_fid ? detail.cat_fid : catFid }]"
          >
            <a-select-option :value="item.cat_id" v-for="item in categoryList">{{ item.cat_name }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :label="L('不营业时显示状态')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            style="width: 320px"
            v-decorator="[
              'show_method',
              { initialValue: detail.show_method },
              { rules: [{ required: true, message: L('请选择不营业时显示状态！') }] },
            ]"
          >
            <a-select-option :value="key" v-for="(item, key) in showMethod">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :label="L('排序值')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :help="L('排序值越高，在餐饮首页店铺列表排序越前')"
        >
          <a-input-number v-decorator="['cat_sort', { initialValue: detail.cat_sort }]" :min="0" />
        </a-form-item>
        <a-form-item :label="L('状态')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch
            :checked-children="L('开启')"
            :un-checked-children="L('关闭')"
            v-decorator="[
              'cat_status',
              { initialValue: detail.cat_status == 1 ? true : false, valuePropName: 'checked' },
            ]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import foodshopPlatformApi from '@/api/foodshop/platform'
export default {
  data() {
    return {
      title: this.L('新建分类'),
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 13,
        },
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      categoryList: [],
      showMethod: [],
      detail: {
        cat_id: 0,
        cat_fid: 0,
        cat_name: '',
        cat_status: 1,
        show_method: 0,
        cat_sort: '',
      },
      catId: '',
      catFid: '',
    }
  },
  // props: {
  //   catId: {
  //     type: [String,Number],
  //     default: ''
  //   },
  //   catFid: {
  //     type: [String,Number],
  //     default: ''
  //   }
  // },
  mounted() {
    this.getEditInfo()
    console.log(this.catFid)
  },
  methods: {
    add() {
      this.visible = true
      this.catId = '0'
      this.catFid = '0'
      this.title = this.L('新建分类')
      // this.getEditInfo()
      this.detail = {
        cat_id: 0,
        cat_fid: 0,
        cat_name: '',
        cat_status: 1,
        show_method: 0,
        cat_sort: '',
      }
    },
    edit(catId) {
      this.visible = true
      this.catId = catId
      this.getEditInfo()
      console.log(this.catId)
      console.log(this.title)
      if (this.catId > 0) {
        this.title = this.L('编辑分类')
      } else {
        this.title = this.L('新建分类')
      }
      console.log(this.title)
    },
    addSub(catFid) {
      //新建子分类
      this.title = this.L('新建分类')
      this.visible = true
      this.catFid = catFid
      this.catId = 0
      this.getEditInfo()
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.cat_id = this.catId
          this.request(foodshopPlatformApi.editSort, values)
            .then((res) => {
              if (this.catId > 0) {
                this.$message.success(this.L('编辑成功'))
              } else {
                this.$message.success(this.L('添加成功'))
              }
              setTimeout(() => {
                this.form = this.$form.createForm(this)
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', values)
              }, 1500)
            })
            .catch((error) => {
              this.confirmLoading = false
            })

          console.log('values', values)
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false
      setTimeout(() => {
        this.catId = '0'
        this.catFid = '0'
        this.form = this.$form.createForm(this)
      }, 500)
    },
    getEditInfo() {
      this.request(foodshopPlatformApi.getEditInfo, {
        cat_id: this.catId,
      }).then((res) => {
        this.categoryList = [
          {
            cat_id: '0',
            cat_name: this.L('请选择上级分类'),
          },
        ]
        this.categoryList = this.categoryList.concat(res.categoryList)
        this.showMethod = res.showMethod
        this.detail = {
          cat_id: 0,
          cat_fid: 0,
          cat_name: '',
          cat_status: 1,
          show_method: 0,
          cat_sort: '',
        }
        if (typeof res.detail == 'object') {
          this.detail = res.detail
        }
        console.log('detail1', typeof res.detail)
        console.log('detail', this.detail)
      })
    },
  },
}
</script>
