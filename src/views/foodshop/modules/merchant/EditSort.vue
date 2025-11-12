<template>
  <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :label="L('分类名称')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'sort_name',
              { initialValue: detail.sort_name, rules: [{ required: true, message: L('请输入分类名称！') }] },
            ]"
          />
        </a-form-item>
        
        <a-form-item :label="L('分类下产品折扣率')" :labelCol="labelCol" :wrapperCol="wrapperCol" help="0~10之间的数字，支持一位小数！8代表8折，8.5代表85折，0与10代表无折扣">
          <a-input
            v-decorator="[
              'sort_discount',
              { initialValue: detail.sort_discount, rules: [{ required: true, message: L('请输入分类下产品折扣率！') }] },
            ]"
          />
        </a-form-item>

        <a-form-item :label="L('售卖时间')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            @change="onDataTypeChange"
            v-decorator="['all_date', { initialValue: detail.all_date, rules: [{ required: true }] }]"
            name="date_type"
          >
            <a-radio :value="1">{{ L('全时段售卖') }}</a-radio>
            <a-radio :value="0">{{ L('自定义时间') }}</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :label="L('选择时间段')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          class="date-content"
          v-if="detail.all_date == 0"
          :validate-status="showDateError ? 'error' : ''"
          :help="showDateError ? L('时间段必填') : ''"
        >
          <a-range-picker
            @change="dateOnChange"
            :allowClear="true"
            style="width: 320px"
            v-decorator="[
              'date_range',
              {
                initialValue:
                  detail.show_start_date == ''
                    ? null
                    : [moment(detail.show_start_date, dateFormat), moment(detail.show_end_date, dateFormat)],
              },
            ]"
          >
            <a-icon slot="suffixIcon" type="calendar" />
          </a-range-picker>
          <a-checkbox-group
            :options="weekList"
            @change="onWeekChange"
            v-decorator="['week', { initialValue: detail.week }]"
          />
        </a-form-item>
        <a-form-item :label="L('售卖时间段')" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="detail.all_date == 0">
          <a-radio-group
            @change="onTimeTypeChange"
            v-decorator="['all_time', { initialValue: detail.all_time, rules: [{ required: true }] }]"
            name="time_type"
          >
            <a-radio :value="1">{{ L('全时段售卖') }}</a-radio>
            <a-radio :value="0">{{ L('自定义时间') }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :label="L('选择时间段')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          class="date-content"
          v-if="detail.all_time == 0 && detail.all_date == 0"
        >
          <a-time-picker
            :format="timeFormat"
            v-decorator="[
              'show_start_time',
              { initialValue: detail.show_start_time == '' ? null : moment(detail.show_start_time, timeFormat) },
            ]"
          />
          <a-time-picker
            :format="timeFormat"
            v-decorator="[
              'show_end_time',
              { initialValue: detail.show_end_time == '' ? null : moment(detail.show_end_time, timeFormat) },
            ]"
          />
          <a-time-picker
            :format="timeFormat"
            v-decorator="[
              'show_start_time2',
              { initialValue: detail.show_start_time2 == '' ? null : moment(detail.show_start_time2, timeFormat) },
            ]"
          />
          <a-time-picker
            :format="timeFormat"
            v-decorator="[
              'show_end_time2',
              { initialValue: detail.show_end_time2 == '' ? null : moment(detail.show_end_time2, timeFormat) },
            ]"
          />
          <a-time-picker
            :format="timeFormat"
            v-decorator="[
              'show_start_time3',
              { initialValue: detail.show_start_time3 == '' ? null : moment(detail.show_start_time3, timeFormat) },
            ]"
          />
          <a-time-picker
            :format="timeFormat"
            v-decorator="[
              'show_end_time3',
              { initialValue: detail.show_end_time3 == '' ? null : moment(detail.show_end_time3, timeFormat) },
            ]"
          />
        </a-form-item>

        <a-form-item :label="L('排序值')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="['sort', { initialValue: detail.sort }]" />
        </a-form-item>
      </a-form>
    </a-spin>

    <template slot="footer">
      <a-popconfirm
        v-if="detail.sort_id"
        class="ant-dropdown-link"
        style="float: left"
        :title="L('确认删除?')"
        :ok-text="L('确定')"
        :cancel-text="L('取消')"
        @confirm="delSort()"
        @cancel="cancel"
      >
        <a-button>{{ L('删除分类') }}</a-button>
      </a-popconfirm>
      <a-button key="back" @click="handleCancel">{{ L('取消') }}</a-button>
      <a-button key="submit" type="primary" @click="handleSubmit">{{ L('确定') }}</a-button>
    </template>
  </a-modal>
</template>

<script>
import moment from 'moment'
import foodshopMerchantApi from '@/api/foodshop/merchant'
import { dateToDateString } from '@/utils/util'
import CustomTooltip from '@/components/CustomTooltip/CustomTooltip'

export default {
  components: {
    CustomTooltip,
  },
  data() {
    return {
      title: '新建分类',
      showDateError: false,

      timeFormat: 'HH:mm',
      dateFormat: 'YYYY-MM-DD',
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
      dateSelect: '', // 日期选择
      timeSelect: '', // 时间选择
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      categoryList: [],
      showMethod: [],
      detail: {
        sort_name: '',
        sort_discount: 0,
        sort_id: 0,
        store_id: this.$route.query.store_id,
        print_id: '',
        is_open_print: 0,
        show_start_date: '',
        show_end_date: '',
        week: [
          this.L('星期日'),
          this.L('星期一'),
          this.L('星期二'),
          this.L('星期三'),
          this.L('星期四'),
          this.L('星期五'),
          this.L('星期六'),
        ],
        show_start_time: '',
        show_end_time: '',
        show_start_time2: '',
        show_end_time2: '',
        show_start_time3: '',
        show_end_time3: '',
        all_date: 1,
        all_time: 1,
        date_range: '',
      },

      weekList: [
        this.L('星期日'),
        this.L('星期一'),
        this.L('星期二'),
        this.L('星期三'),
        this.L('星期四'),
        this.L('星期五'),
        this.L('星期六'),
      ],
      printList: [],
    }
  },
  mounted() {
    console.log(this.catFid)
  },
  methods: {
    moment,
    add(storeId) {
      this.visible = true
      this.detail = {
        sort_name: '',
        sort_discount: 0,
        sort_id: 0,
        store_id: storeId,
        print_id: '',
        is_open_print: 0,
        show_start_date: '',
        show_end_date: '',
        week: [
          this.L('星期日'),
          this.L('星期一'),
          this.L('星期二'),
          this.L('星期三'),
          this.L('星期四'),
          this.L('星期五'),
          this.L('星期六'),
        ],
        show_start_time: '',
        show_end_time: '',
        show_start_time2: '',
        show_end_time2: '',
        show_start_time3: '',
        show_end_time3: '',
        all_date: 1,
        all_time: 1,
        date_range: '',
      }
      // this.getStorePrintList()
    },
    edit(storeId, sortId) {
      this.visible = true
      this.detail.sort_id = sortId
      this.detail.store_id = storeId
      // this.getEditInfo()
      if (this.detail.sort_id > 0) {
        this.title = this.L('编辑分类')
      } else {
        this.title = this.L('新建分类')
      }
      console.log(this.detail.sort_id)
      // this.getStorePrintList()
      this.getEditInfo()
    },
    handleSubmit() {
      const {
        form: { setFields, validateFields, getFieldError },
      } = this

      validateFields((errors, values) => {
        if (values.date_range == null && this.detail.all_date == 0) {
          this.showDateError = true
          return
        } else {
          this.showDateError = false
        }
        if (!errors) {
          values.sort_id = this.detail.sort_id
          values.store_id = this.detail.store_id
          values.show_start_date = this.detail.show_start_date
          values.show_end_date = this.detail.show_end_date

          // 格式化日期
          const type = {
            show_start_time: 'time',
            show_end_time: 'time',
            show_start_time2: 'time',
            show_end_time2: 'time',
            show_start_time3: 'time',
            show_end_time3: 'time',
          }
          dateToDateString(values, type)

          this.confirmLoading = true

          this.request(foodshopMerchantApi.editSort, values)
            .then((res) => {
              if (this.detail.sort_id) {
                this.$message.success(this.L('编辑成功'))
              } else {
                this.$message.success(this.L('添加成功'))
              }
              // 调用父页面方法
              this.$emit('handleUpdate', {})
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
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false
      // this.getEditInfo()
      this.form = this.$form.createForm(this)
    },
    getEditInfo() {
      this.request(foodshopMerchantApi.geSortDetail, {
        sort_id: this.detail.sort_id,
      }).then((res) => {
        this.detail = res
      })
    },
    // 获得打印机列表
    getStorePrintList() {
      this.request(foodshopMerchantApi.storePrintList, {
        store_id: this.detail.store_id,
      }).then((res) => {
        this.printList = res.list
      })
    },
    onDataTypeChange(val) {
      this.detail.all_date = val.target.value
    },
    dateOnChange(date, dateString) {
      this.detail.show_start_date = dateString[0]
      this.detail.show_end_date = dateString[1]
    },
    onWeekChange(e) {},
    onTimeTypeChange(val) {
      this.detail.all_time = val.target.value
    },
    printChange() {},
    // 删除分类
    delSort() {
      this.request(foodshopMerchantApi.delSort, { sort_id: this.detail.sort_id })
        .then((res) => {
          this.$message.success(this.L('删除成功'))
          // 调用父页面方法
          this.$emit('handleUpdate', {})
          this.form = this.$form.createForm(this)
          this.visible = false
          this.confirmLoading = false
        })
        .catch((error) => {
          this.confirmLoading = false
        })
    },
    // 取消删除
    cancel() {},
  },
}
</script>
