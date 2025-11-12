<template>
  <div class="account-community-config-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
          <a-form-item
            label="断闸可二次激活电量设置"
          >
            当用户{{$store.getters.config.room_name}}电表的剩余电量
            <a-input style="color:#333333;width: 20%" v-model="set.electric_set"/>
            度时，电表关闸断电，并提醒用户，但用户可自行二次激活重新取电
          </a-form-item>

          <a-form-item
            label="断闸后需缴纳电费的电量设置"
          >
            当用户{{$store.getters.config.room_name}}电表的剩余电量
            <a-input style="color:#333333;width: 20%" v-model="set.price_electric_set"/>  度时，电表关闸断电，并提醒用户，但用户不可进行二次激活，需缴纳费用后才可激活电表
          </a-form-item>

          <a-form-item
            label="自动抄表扣费日期设置"
          >
           每 <a-select default-value="1" style="width: 120px" @change="handleChange" v-model="set.date_type">
            <a-select-option :value="1">
              月
            </a-select-option>
            <a-select-option :value="2">
              日
            </a-select-option>
          </a-select>
            <a-select default-value="1" style="width: 120px" v-if="show" v-model="set.dateMouth">
              <a-select-option :value="1">
                01
              </a-select-option>
              <a-select-option :value="2">
                02
              </a-select-option>
              <a-select-option :value="3">
                03
              </a-select-option>
              <a-select-option :value="4">
                04
              </a-select-option>
              <a-select-option :value="5">
                05
              </a-select-option>
              <a-select-option :value="6">
                06
              </a-select-option>
              <a-select-option :value="7">
                07
              </a-select-option>
              <a-select-option :value="8">
                08
              </a-select-option>
              <a-select-option :value="9">
                09
              </a-select-option>
              <a-select-option :value="10">
                10
              </a-select-option>
              <a-select-option :value="11">
                11
              </a-select-option>
              <a-select-option :value="12">
                12
              </a-select-option>

              <a-select-option :value="13">
                13
              </a-select-option>
              <a-select-option :value="14">
                14
              </a-select-option>
              <a-select-option :value="15">
                15
              </a-select-option>
              <a-select-option :value="16">
                16
              </a-select-option>
              <a-select-option :value="17">
                17
              </a-select-option>
              <a-select-option :value="18">
                18
              </a-select-option>
              <a-select-option :value="19">
                19
              </a-select-option>
              <a-select-option :value="20">
                20
              </a-select-option>
              <a-select-option :value="21">
                21
              </a-select-option>
              <a-select-option :value="22">
                22
              </a-select-option>
              <a-select-option :value="23">
                23
              </a-select-option>
              <a-select-option :value="24">
                24
              </a-select-option>

              <a-select-option :value="25">
                25
              </a-select-option>
              <a-select-option :value="26">
                26
              </a-select-option>
              <a-select-option :value="27">
                27
              </a-select-option>
              <a-select-option :value="28">
                28
              </a-select-option>
              <a-select-option :value="29">
                29
              </a-select-option>
              <a-select-option :value="30">
                30
              </a-select-option>
            </a-select>
            <a-time-picker format="HH:mm"  @change="dayOnChange" :value="moment(set.dateDay, 'HH:mm')" />
            电表设备自动进行抄表并扣除用户费用
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
            <a-button type="primary" html-type="submit" :loading="loginBtn">
              确定
            </a-button>
          </a-form-item>

        </a-form>

      </a-col>
    </a-row>
  </div>
</template>
<script>
  import moment from 'moment';
  import configHouseMeterApi from '@/api/community/houseMeter'

  export default {
    name: 'setElectric',
    data() {
      return {
        form: this.$form.createForm(this),
        set: {
          'electric_set': '',
          'price_electric_set': '',
          'dateMouth': '1',
          'dateDay': '23:00',
          'date_type': '',
          'close_time':'',
        },
        show: true,
        dateMouthFormat: 'YYYY-MM-DD HH:mm',
        dateDayFormat: 'YYYY-MM-DD HH:mm',
        loginBtn:false
      }
    },
    activated () {
      this.meterElectricSetInfo()
    },
    methods: {
      handleSubmit(e) {
        e.preventDefault()

        const indexParams={}
        indexParams.electric_set = this.set.electric_set
        indexParams.price_electric_set = this.set.price_electric_set
        indexParams.date_type = this.set.date_type
        indexParams.dateDay = this.set.dateDay
        indexParams.dateMouth = this.set.dateMouth
        this.request(configHouseMeterApi.meterElectricSetEdit, indexParams)
          .then((res) => {
            console.log('res', res)
            if (res) {
              this.$message.success('更新成功！');
              this.meterElectricSetInfo()
            }
            this.loginBtn = false;
          }).catch((error) => {
          this.loginBtn = false;
        })
      },

      // 获取电表设置信息
      meterElectricSetInfo() {
        this.request(configHouseMeterApi.meterElectricSetInfo)
          .then((res) => {
           this.set=res
            this.set.date_type=res.meter_reading_type
            if (res){
              this.set.close_time=res.meter_reading_date
              if (res.meter_reading_type == 1){
                this.show = true
                this.set.dateMouth=res.dateMouth
                this.set.dateDay=res.meter_reading_date
              }else{
                this.show = false
                this.set.dateDay=res.meter_reading_date
              }
            }

          })
      },
      handleChange(value){
        console.log(value)
        if (value=='1'){
          this.show = true
        }
        if (value=='2'){
          this.show = false
        }
      },
      moment,
      // 处理时间
      date_moment(time, dateFormat) {
        if (!time) {
          return '';
        }
        console.log('times1',time)
        console.log('dateFormat',dateFormat)
        let times = moment(time, dateFormat);
        console.log('times',times)
        return times;
      },
      // 开始日期切换，重新赋值
      mouthOnChange(date, dateString) {
        console.log('date', date)
        console.log('dateString', dateString)
        this.set.dateMouth = dateString;
      },
      // 开始日期切换，重新赋值
      dayOnChange(date, dateString) {
        console.log('date', date)
        console.log('dateString', dateString)
        if (date== null){
          dateString='00:00'
        }
        this.set.dateDay = dateString;
        this.$forceUpdate()
      },
    }
  }
</script>

<style lang="less" scoped>
  .account-community-config-info-view {
    margin: 30px 20px;
    background-color: white;
    padding: 30px;
  }

  .imgname {
    width: 80px;
  }
  .ant-col-12 {
    width: 70%;
  }
</style>