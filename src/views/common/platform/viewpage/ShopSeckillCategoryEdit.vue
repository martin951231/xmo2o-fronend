<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <div>
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item label="分类名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              v-decorator="[
                'name',
                { initialValue: detail.name, rules: [{ required: true, message: '请输入分类名称！' }] },
              ]"
              :disabled="detail.cat_id == 1"
            />
          </a-form-item>
          <a-form-item label="覆盖城市" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-tree-select
              v-model="selectCityList"
              style="width: 100%"
              :tree-data="areaList"
              :treeCheckStrictly="true"
              tree-checkable
              :show-checked-strategy="SHOW_PARENT"
              search-placeholder="请选择城市"
              :dropdownStyle="{ maxHeight: '200px' }"
              v-if="detail.cat_id != 1"
              v-decorator="[
                'city',
                { initialValue: selectCityList, rules: [{ required: true, message: '请选择覆盖城市！' }] },
              ]"
            />
            <label v-if="detail.cat_id == 1">全国</label>
          </a-form-item>
          <a-form-item label="排序值" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input-number
              style="width: 200px"
              v-decorator="[
                'sort',
                { initialValue: detail.sort, rules: [{ required: true, message: '请输入排序值！' }] },
              ]"
              v-if="detail.cat_id != 1"
            />
            <label v-if="detail.cat_id == 1">默认展示第一排</label>
          </a-form-item>
          <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-switch
              checked-children="开启"
              un-checked-children="关闭"
              v-decorator="['status', { initialValue: detail.status == 1 ? true : false, valuePropName: 'checked' }]"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </div>
  </a-modal>
</template>

<script>
import viewpagePlatformApi from '@/api/common/platform/viewpage'
import areaPlatformApi from '@/api/common/platform/area'

import CustomTooltip from '@/components/CustomTooltip/CustomTooltip'
import uploadApi from '@/api/common/uploads'
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT

export default {
  components: {
    CustomTooltip,
  },
  data() {
    return {
      title: '新建分类',
      visible: false,
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
      confirmLoading: false,
      uploadImg: '/v20/public/index.php' + uploadApi.uploadImg + '?upload_dir=/group/group_combine',
      form: this.$form.createForm(this),
      shareImageFileList: [],
      headers: {
        authorization: 'authorization-text',
      },
      detail: {
        cat_id: 0,
        name: '',
      },
      areaList: [],
      selectCityList: [],
      SHOW_PARENT,
    }
  },
  mounted() {},
  methods: {
    add() {
      this.visible = true
      this.id = '0'
      this.detail = {
        cat_id: 0,
        name: '',
        sort: 0,
      }
      this.title = '新建分类'
      this.selectCityList = []
      this.getSelectProvinceAndCity()
    },
    edit(catId) {
      this.visible = true
      this.cat_id = catId
      this.selectCityList = []
      this.getSelectProvinceAndCity()
      this.getEditInfo()
      if (this.cat_id > 0) {
        this.title = '编辑分类'
      } else {
        this.title = '新建分类'
      }
    },
    getEditInfo() {
      this.request(viewpagePlatformApi.getCategoryDetail, { cat_id: this.cat_id }).then((res) => {
        this.detail = res
        this.selectCityList = res.city_list
      })
    },
    getSelectProvinceAndCity() {
      this.request(areaPlatformApi.getSelectProvinceAndCity, { cat_id: this.cat_id }).then((res) => {
        this.areaList = [
          {
            title: '全部',
            value: 'all',
            key: 'all',
          },
        ]
        this.areaList = this.areaList.concat(res)
      })
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.cat_id = this.cat_id
          values.city_list = this.selectCityList
          if (this.selectCityList.length == 0 && this.detail.cat_id != 1) {
            this.$message.error('请选择覆盖城市')
            this.confirmLoading = false
            return
          }
          this.request(viewpagePlatformApi.editCategory, values)
            .then((res) => {
              if (this.cat_id > 0) {
                this.$message.success('编辑成功')
              } else {
                this.$message.success('添加成功')
              }
              setTimeout(() => {
                this.form = this.$form.createForm(this)
                this.visible = false
                this.confirmLoading = false
                this.$emit('handleUpdate', values)
              }, 1500)
            })
            .catch((error) => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.cat_id = '0'
      this.form = this.$form.createForm(this)
    },
  },
}
</script>
