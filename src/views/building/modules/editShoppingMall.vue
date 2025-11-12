<template>
  <div>
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item :label="L('商场名称')" prop="name">
        <a-input v-model="form.name" :placeholder="L('请输入商场名称')" />
      </a-form-model-item>
      <a-form-model-item :label="L('商场简称')" prop="short_name">
        <a-input v-model="form.short_name" :placeholder="L('请输入商场简称')" />
      </a-form-model-item>
      <a-form-model-item :label="L('绑定管理员')" prop="admin_ids">
        <a-tree-select 
          v-model="form.admin_ids" 
          style="width: 100%" 
          :tree-data="admin_user" 
          tree-checkable
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          search-placeholder="Please select" />
      </a-form-model-item>
      <a-form-model-item :label="L('联系电话')" prop="phone">
        <a-input v-model="form.phone" :placeholder="L('请输入联系电话')" />
      </a-form-model-item>
      <a-form-model-item :label="L('面积')" prop="area">
        <a-input v-model="form.area" :placeholder="L('请输入面积(m²)')" />
      </a-form-model-item>
      <a-form-model-item :label="L('商场位置')" prop="address">
        <a-input v-model="form.address" disabled="true" :placeholder="L('请选择商场位置')" />
        <a-button type="primary" @click="addressSet()">{{ L('设置') }}</a-button>
      </a-form-model-item>
      <a-form-model-item :label="L('状态')" prop="status">
        <a-switch
            v-model="form.status"
            :checked-children="L('开启')"
            :un-checked-children="L('关闭')"
        />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 10 }">
        <a-button type="primary" @click="submitForm('form')">
         {{L('保存')}} 
        </a-button>
      </a-form-model-item>
    </a-form-model>
    <MapPoints ref="MapPoints" model="pointPro" @selectCallBack="mapSelectPointConfirm"></MapPoints>
  </div>
</template>

<script>
import buildingPlatformApi from '@/api/building'
import MapPoints from '@/components/MapPoints/MapPoints'
import { coordinateFun } from '@/utils/util.js'

export default {
  name: 'editShoppingMall',
  components: {
    MapPoints,
  },
  data() {
    return {
      form: {
        name: '',
        short_name: '',
        admin_ids: [],
        lng: '',
        lat: '',
        address: '',
        phone: '',
        area: '',
        status: true,
      },
      admin_user: [],
      rules: {
        name: [
          { required: true, message: this.L('商场名称不能为空'), trigger: 'blur' },
        ],
        short_name: [
          { required: true, message: this.L('商场简称不能为空'), trigger: 'blur' },
        ],
        phone: [{ required: true, message: this.L('联系电话不能为空'), trigger: 'blur' }],
        area: [{ required: true, message: this.L('面积不能为空'), trigger: 'blur' }],
        admin_ids: [
          {
            type: 'array',
            required: true,
            message:  this.L('请选择绑定的管理员'),
            trigger: 'change',
          },
        ],
      },
    }
  },
  created() {
    this.getCanBindAdminUser()
  },
  methods: {
    getCanBindAdminUser() {
      this.request(buildingPlatformApi.getCanBindAdminUser).then((data) => {
        this.admin_user = data.map(item => ({
          title: item.account,
          value: item.id,
          key: item.id
        }));
      })
    },
    mapSelectPointConfirm(res) {
      let address = [res.address, res.name].filter((item) => item).join(' ')
      this.form.address = address || ''
      this.form.lat = res.lat || ''
      this.form.lng = res.lng || ''
    },
    formErrorMessage(errorObj = {}) {
      let errors = Object.values(errorObj).flat(Infinity)
      if (errors.length && errors[0].message) {
          this.$message.error(errors[0].message)
      }
    },
    addressSet() {
      this.$refs.MapPoints.open({ lat: this.form.lat, lng: this.form.lng }, this.L('商场地址'))
    },
    submitForm(formName) {
      console.log(this.form)
      this.$refs[formName].validate(valid => {
        if (valid) {
          //经纬度转换
          if(this.form.lng && this.form.lat){
              const {lng,lat} = coordinateFun(this.form.lng,this.form.lat,'submit');
              this.form.lng = lng
              this.form.lat = lat
          }
        
          this.request(buildingPlatformApi.saveShoppingMall, this.form).then((res) => {
              this.$message.success(this.L('保存成功'))
              this.$emit('refreshList');
          })
        } else {
          this.formErrorMessage(obj)
          return false;
        }
      });
    },
  },
}
</script>

<style scoped lang="less"></style>