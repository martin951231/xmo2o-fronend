<template>

  <div  style="margin:0 0 0;padding:30px 25px;">
    <a-card title="住宅" style="width: 80%">
        <span>
          <label>单价</label>
        <a-input style="color:#333333;width: 15%;margin-left: 24px;" placeholder="请输入单价" v-model="price.house_price"/>
        </span>
      <span style="margin-left: 300px">
          <label>倍率</label>
        <a-input style="color:#333333;width: 15%;margin-left: 24px;" placeholder="请输入倍率" v-model="price.house_rate"/>
        </span>
    </a-card>
    <br/>
    <a-card title="商铺" style="width: 80%">
        <span>
          <label>单价</label>
        <a-input style="color:#333333;width: 15%;margin-left: 24px;" placeholder="请输入单价" v-model="price.shop_price"/>
        </span>
      <span style="margin-left: 300px">
          <label>倍率</label>
        <a-input style="color:#333333;width: 15%;margin-left: 24px;" placeholder="请输入倍率" v-model="price.shop_rate"/>
        </span>
    </a-card>
    <br/>
    <a-card title="办公" style="width: 80%">
        <span>
          <label>单价</label>
        <a-input style="color:#333333;width: 15%;margin-left: 24px;" placeholder="请输入单价" v-model="price.work_price"/>
        </span>
      <span style="margin-left: 300px">
          <label>倍率</label>
        <a-input style="color:#333333;width: 15%;margin-left: 24px;" placeholder="请输入倍率" v-model="price.work_rate"/>
        </span>
    </a-card>
    <br/>
    <a-button type="primary" @click="saveform">
      确定
    </a-button>
  </div>


</template>

<script>
  import configHouseMeterApi from '@/api/community/houseMeter'


  export default {
    name: 'price',
    data() {
      return {
        sortedInfo: null,
        pagination: {pageSize: 10, total: 10},
        page: 1,
        area_id: 0,
        bindVisible: false,
        confirmLoading: false,
        price: {
          house_price: '',
          house_rate: '',
          shop_price: '',
          shop_rate: '',
          work_price: '',
          work_rate: '',
        },
      };
    },
    activated() {
      this.price.house_price = ''
      this.price.house_rate = ''
      this.price.shop_price = ''
      this.price.shop_rate = ''
      this.price.work_price = ''
      this.price.work_rate = ''
      this.area_id = this.$route.query.area_id
      this.getAreaPriceList()
    },
    methods: {
      saveform() {
        console.log(this.area_id)
        this.confirmLoading = true
        this.request(configHouseMeterApi.meterElectricPriceAdd, {city_id: this.area_id, type: this.price})
          .then((res) => {
            this.$message.success('编辑成功')
            setTimeout(() => {
              this.form = this.$form.createForm(this)
              this.modelVisible = false
              this.confirmLoading = false
              this.$emit('ok')
            }, 1500)
          })
          .catch((error) => {
            this.confirmLoading = false
          })
      },
      // 获取收费标准列表信息
      getAreaPriceList() {
        this.request(configHouseMeterApi.getAreaPriceList, {city_id: this.area_id})
          .then((res) => {
            console.log('res', res)
            if (res) {
              for (let i = 0; i < res.length; i++) {
                if (res[i].house_type == 1) {
                  this.price.house_price = res[i].unit_price
                  this.price.house_rate = res[i].rate
                }
                if (res[i].house_type == 2) {
                  this.price.shop_price = res[i].unit_price
                  this.price.shop_rate = res[i].rate
                }
                if (res[i].house_type == 3) {
                  this.price.work_price = res[i].unit_price
                  this.price.work_rate = res[i].rate
                }
              }
            }
          })
      },
    }

  }
</script>
<style scoped>
  .ant-card-body {
    padding: 24px;
    zoom: 1;
  }

  </style>
