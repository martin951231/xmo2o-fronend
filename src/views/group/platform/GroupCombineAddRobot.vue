<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <div class="mt-20 ml-10 mr-10 mb-20">
      <a-form @submit="handleSubmit" :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 10 }" v-if="ajaxData">
        <a-form-item label="机器人数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            placeholder="请输入机器人数量"
            :min="0"
            step="1"
            style="width: 200px"
            v-decorator="[
              'number',
              { initialValue: ajaxData.number, rules: [{ required: true, message: '请输入机器人数量！' }] },
            ]"
          />
        </a-form-item>
        <a-form-item
          label="推荐人数"
          help="请设置用户推荐人数的范围"
          v-if="ajaxData.type == 'spread'"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input-group compact>
            <a-input-number
              style="width: 100px; text-align: center"
              v-decorator="[
                'nimi_people',
                { initialValue: ajaxData.number, rules: [{ required: true, message: '请输入推荐人数！' }] },
              ]"
            />
            ~
            <a-input-number
              style="width: 100px; text-align: center"
              v-decorator="[
                'max_people',
                { initialValue: ajaxData.number, rules: [{ required: true, message: '请输入推荐人数！' }] },
              ]"
            />
          </a-input-group>
        </a-form-item>

        <a-form-item
          label="支付时间段"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          class="date-content"
          v-if="ajaxData.type == 'buy'"
          :validate-status="showDateError ? 'error' : ''"
          :help="showDateError ? '时间段必填' : ''"
        >
          <a-range-picker
            @change="dateOnChange"
            :allowClear="true"
            style="width: 320px"
            v-decorator="[
              'date_range',
              {
                initialValue:
                  ajaxData.start_date == ''
                    ? null
                    : [moment(ajaxData.start_date, dateFormat), moment(ajaxData.end_date, dateFormat)],
              },
            ]"
          >
            <a-icon slot="suffixIcon" type="calendar" />
          </a-range-picker>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
import GroupPlatformApi from '@/api/group/platform'
import moment from 'moment'

export default {
  name: 'ShopForm',
  components: {},
  data() {
    return {
      title: '导入机器人',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      showDateError: false,
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
      //查询字段
      queryParam: {},
      // 表单数据
      ajaxData: {
        type: 'spread',
        start_date: '',
        end_date: '',
        id: 0,
      },

      //表单字段
      dateFormat: 'YYYY-MM-DD',
      headers: {
        authorization: 'authorization-text',
      },
    }
  },
  created() {
    this.form = this.$form.createForm(this)
  },
  mounted() {},
  methods: {
    moment,
    add(id, type) {
      this.ajaxData.id = id
      this.ajaxData.type = type
      this.visible = true
    },
    // handler
    handleSubmit(e) {
      // this.confirmLoading = true
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.start_date = this.ajaxData.start_date
          values.end_date = this.ajaxData.end_date
          values.type = this.ajaxData.type
          values.combine_id = this.ajaxData.id

          console.log(111111, values)
          // return
          this.request(GroupPlatformApi.addRobot, values).then((res) => {
            this.confirmLoading = false
            this.visible = false
            // 调用父页面方法
            this.$emit('handleUpdate', {})
            this.$message.success('保存成功')
            this.form = this.$form.createForm(this)
          })
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.form = this.$form.createForm(this)
    },
    dateOnChange(date, dateString) {
      this.ajaxData.start_date = dateString[0]
      this.ajaxData.end_date = dateString[1]
    },
  },
}
</script>
