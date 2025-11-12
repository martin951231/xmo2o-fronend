<template>
 <a-modal
    title="添加商品-选择商品类型"
    :visible="visible"
    :width="600"
    @cancel="handleCancel"
    :footer = "null"
    >
  <div class="select-cate-content">
    <!-- 选择商品类型 -->
    <a-card class="select-cate-item" @click="goAdd('normal')">
      <div class="flex">
        <div class="left">
          <div class="title">
            团购商品
          </div>
          <div class="description">
            可用于添加服务商品、次卡、实物商品
          </div>
        </div>
        <div class="right icon">
          <a-icon type="right-circle" theme="twoTone"  style="font-size:24px;"/>
        </div>
      </div>
    </a-card>

    <a-card class="select-cate-item" @click="goAdd('booking_appoint')">
      <div class="flex">
        <div class="left">
          <div class="title">
            场次预约
          </div>
          <div class="description">
            区分全天不同时段，也可每天一价
          </div>
        </div>
        <div class="right icon">
          <a-icon type="right-circle" theme="twoTone"  style="font-size:24px;"/>
        </div>
      </div>
    </a-card>
    <a-card class="select-cate-item" @click="goAdd('cashing')">
      <div class="flex">
        <div class="left">
          <div class="title">
            代金券
          </div>
          <div class="description">
            消费可抵扣现金，利用优惠吸引到店
          </div>
        </div>
        <div class="right icon">
          <a-icon type="right-circle" theme="twoTone"  style="font-size:24px;"/>
        </div>
      </div>
    </a-card>
    <a-card class="select-cate-item" @click="goAdd('course_appoint')">
      <div class="flex">
        <div class="left">
          <div class="title">
            课程预约
          </div>
          <div class="description">
            针对教育类商家展示本店可学课程
          </div>
        </div>
        <div class="right icon">
          <a-icon type="right-circle" theme="twoTone"  style="font-size:24px;"/>
        </div>
      </div>
    </a-card>
  </div>
    </a-modal>
</template>

<script>
export default {
  data() {
    return {
      visible:false
    }
  },
  mounted() {
  },
  methods: {
    open(){
      this.visible = true
    },
    goAdd(type){
      switch(type){
        case 'normal': // 团购商品      
          this.$router.push({ path: '/merchant/merchant.group/goodsEdit' })
          break;
        case 'booking_appoint': // 场次预约
          this.$router.push({ path: '/merchant/merchant.group/bookingAppoint' })
          break;
        case 'cashing':// 代金券
          this.$router.push({ path: '/merchant/merchant.group/goodsCashingEdit' })
          break;
        case 'course_appoint':// 课程预约
          this.$router.push({ path: '/merchant/merchant.group/courseAppoint' })
          break;
      }
      this.visible = false
    },
    handleCancel(){
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
.select-cate-content {
  .select-cate-item { 
    cursor: pointer;  
    margin: 0 20px 10px 20px;
    .flex{
      justify-content:space-between;    
      align-items: center;
    }
    .left{
      flex-grow:2;
      .title {
        font-size: 20px;
        font-weight: 600;
        padding-bottom: 4px;
      }
    }
    .right{
      flex-grow:1
    }
  }
}
</style>
