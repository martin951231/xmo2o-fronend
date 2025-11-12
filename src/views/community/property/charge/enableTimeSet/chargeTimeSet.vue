<template>
  <div class="account-community-config-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
          <a-form-item label="启用新版收费管理时间设置">
            <a-date-picker  format="YYYY-MM-DD"  :allowClear="false" @change="dayOnChange" placeholder="请选择日期" :value="moment(set.take_effect_time, 'YYYY-MM-DD')" :disabled-date="disabledDate"/>
             <!-- -->

            <div> 若不设置，则还是使用老版收费，新版的收费管理可以添加各类费用设置，但是无法生成费用；如果设置了启用新版收费的时间，到达时间后会直接按照新版的收费规则进行账单生成、收费，老版数据仅做展示使用，无法继续生成费用。</div>
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
  import newChargeApi from '@/api/community/property/packages';
  import moment from 'moment';
  export default {
    name: 'chargeTimeSet',
    data() {
      return {
        form: this.$form.createForm(this),
        set: {
          'take_effect_time': ' ',
        },
        show: true,
        dateDayFormat: 'YYYY-MM-DD',
        loginBtn:false
      }
    },
      mounted () {
      this.chargeTimeInfo()
    },
    methods: {
      moment,
      // 开始日期切换，重新赋值
      dayOnChange(date, dateString) {
        console.log('date', date)
        console.log('dateString', dateString)
        if (date==null){
          this.set.take_effect_time='0'
        }
        this.set.take_effect_time = dateString;
        this.$forceUpdate()
      },
      disabledDate(current) {
        return current && current < moment().endOf('day');
      },
      handleSubmit(e) {
        e.preventDefault()
        const indexParams={}
        indexParams.take_effect_time = this.set.take_effect_time
        this.request(newChargeApi.setChargeTime, indexParams)
          .then((res) => {
            console.log('res', res)
            if (res) {
              this.$message.success('更新成功！');
              this.chargeTimeInfo()
            }
            this.loginBtn = false;
          }).catch((error) => {
          this.loginBtn = false;
        })
      },

      // 获取设置信息
      chargeTimeInfo() {
        this.request(newChargeApi.chargeTimeInfo)
          .then((res) => {
            this.set=res
            console.log(res)
          })
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