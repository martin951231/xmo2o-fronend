<template>
  <a-modal
    title="新增押金账单"
    :visible="visible"
    :confirm-loading="loading"
    width="560px"
    @ok="submit"
    @cancel="visible = false"
  >
    <a-form-model :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
      <a-form-model-item label="押金分类" required>
        <a-select v-model="form.category_id" placeholder="请选择押金分类">
          <a-select-option v-for="item in categoryList" :key="item.id" :value="item.id">
            {{ item.cate_name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="押金金额" required>
        <a-input-number v-model="form.deposit_money" :min="0" :precision="1" :step="0.1" style="width: 100%" />
      </a-form-model-item>
      <a-form-model-item label="账单开始日期">
        <a-date-picker v-model="form.service_start_time" value-format="YYYY-MM-DD" style="width: 100%" />
      </a-form-model-item>
      <a-form-model-item label="账单结束日期">
        <a-date-picker v-model="form.service_end_time" value-format="YYYY-MM-DD" style="width: 100%" />
      </a-form-model-item>
      <a-form-model-item label="备注">
        <a-input v-model="form.remark" placeholder="请输入备注" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import moment from 'moment'
import villageApi from '@/api/community/village'

export default {
  name: 'DepositBillModal',
  data () {
    return {
      visible: false,
      loading: false,
      roomId: 0,
      categoryList: [],
      form: {
        category_id: undefined,
        deposit_money: undefined,
        service_start_time: '',
        service_end_time: '',
        remark: ''
      }
    }
  },
  methods: {
    open (roomId) {
      this.roomId = roomId
      const today = moment().format('YYYY-MM-DD')
      this.form = {
        category_id: undefined,
        deposit_money: undefined,
        service_start_time: today,
        service_end_time: today,
        remark: ''
      }
      this.visible = true
      this.getCategoryOptions()
    },
    getCategoryOptions () {
      this.request(villageApi.depositCategoryOptions, {}).then(res => {
        this.categoryList = res.list || []
      })
    },
    submit () {
      if (!this.form.category_id) {
        this.$message.warning('请选择押金分类')
        return
      }
      if (!this.form.deposit_money || Number(this.form.deposit_money) <= 0) {
        this.$message.warning('请输入押金金额')
        return
      }
      this.loading = true
      this.request(villageApi.depositBillCreate, {
        room_id: this.roomId,
        category_id: this.form.category_id,
        deposit_money: this.form.deposit_money,
        service_start_time: this.form.service_start_time,
        service_end_time: this.form.service_end_time,
        remark: this.form.remark
      }).then(() => {
        this.$message.success('押金账单已生成')
        this.visible = false
        this.$emit('ok')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
