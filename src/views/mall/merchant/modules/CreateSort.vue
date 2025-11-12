<template>
  <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit"
           @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="分类名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', {initialValue:detail.name,rules: [{required: true, message: '请输入分类名称'}]}]"/>
        </a-form-item>

        <a-form-item  label="上级分类" :labelCol="labelCol" :wrapperCol="wrapperCol"
                     help="不选择上级分类，则添加为一级分类">
          <a-select style="width: 320px" v-decorator="['fid',{initialValue:detail.fid ? detail.fid : fid}]"
                    @change="change($event)">
            <a-select-option :key="item.id" :value="item.id" v-for="item in dataList">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="排序值" :labelCol="labelCol" :wrapperCol="wrapperCol" help="排序值越高，在商城首页店铺列表排序越前">
          <a-input-number v-decorator="['sort',{initialValue:detail.sort}]" :min="0"/>
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch checked-children="开启" un-checked-children="关闭"
                    v-decorator="['status',{initialValue:detail.status==1 ? true : false,valuePropName: 'checked'}]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import mallMerchantApi from '@/api/mall/merchant/index'

export default {
  props: {
    // 店铺id
    store_id: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      title: '新建分类',
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 7
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 13
        }
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      dataList: [],
      showMethod: [],
      detail: {
        id: 0,
        fid: 0,
        name: '',
        status: 1,
        store_id: 0,
        sort: '',
      },
      id: 0,
      fid: '请选择上级分类',

    }
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    // 获取父级分类信息
    getDataList() {
      this.request(mallMerchantApi.getAllGoodsSort, { store_id: this.store_id }).then((res) => {
        var categorylist = [{
          'id': '0',
          'name': '请选择上级分类',
          'level': '1'
        }]
        if (res.list.length) {
          categorylist = categorylist.concat(res.list)
        }
        this.$set(this, 'dataList', categorylist)
      })
    },
    add() {
      this.getDataList()
      this.visible = true
      this.id = '0'
      this.fid = '0'
      this.title = '新建分类'
      this.detail = {
        id: 0,
        fid: 0,
        name: '',
        status: 1,
        store_id: 0,
        sort: '',
      }
    },
    edit(id) {
      this.getDataList()
      this.visible = true
      this.id = id
      this.getEditInfo()
      if (this.id > 0) {
        this.title = '编辑分类'
      } else {
        this.title = '新建分类'
      }
      console.log(this.title)
    },
    addSub(fid, store_id) {
      this.getDataList()
      //新建子分类
      this.title = '新建分类'
      this.visible = true
      this.fid = fid
      this.id = 0
    },
    handleSubmit() {
      const {
        form: {
          validateFields
        }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.id = this.id
          values.store_id = this.store_id
          this.request(mallMerchantApi.editGoodsSort, values)
            .then((res) => {
              if (this.id > 0) {
                this.$message.success('编辑成功')
              } else {
                this.$message.success('添加成功')
              }
              setTimeout(() => {
                this.form = this.$form.createForm(this)
                this.visible = false
                this.confirmLoading = false
                this.$emit('loaddata', values)
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
        this.id = '0'
        this.fid = '0'
        this.form = this.$form.createForm(this)
      }, 500)
    },
    getEditInfo() {
      this.request(mallMerchantApi.getEditSort, {
        id: this.id,
        store_id: this.store_id
      })
        .then((res) => {
          this.showMethod = res.showMethod
          this.detail = {
            id: 0,
            fid: 0,
            name: '',
            status: 1,
            store_id: 0,
            sort: '',
          }
          if (typeof (res.list) == 'object') {
            this.detail = res.list
          }
          console.log('detail', this.detail)
        })
    },
    change(e){
      this.detail.fid = e;
    }
  },
}
</script>
