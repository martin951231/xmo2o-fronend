<template>
  <a-list :bordered="false" :grid="{ gutter: [24, 12], xs: 2, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }" :data-source="list">
    <a-list-item slot="renderItem" slot-scope="item">
      <a-card class="item" :bordered="false">
        <div slot="title" :class="`title-wrap ${type == 'classify' ? 'pd10-0' : ''}`">
          <a-row type="flex" align="middle">
            <a-col><a-avatar :src="item.cat_img ? item.cat_img : icon" class="img" /></a-col>
            <a-col class="title">{{ item.name }}</a-col>
          </a-row>
          <div class="meal" v-show="type == 'meal'">
            <div>套餐内容：</div>
            <div class="detail">
              <span class="type-name" v-for="(store, index) in item.store_detail" :key="index">
                <span class="cr-primary">{{ store.num }}</span
                ><span>个{{ store.type_name }}店铺</span><span class="plus">+</span>
              </span>
            </div>
          </div>
          <div class="cr-primary discount-icon" v-show="item.discount_type != 3"><span class="txt">有优惠</span></div>
        </div>

        <a-row type="flex" justify="space-between" align="middle">
          <a-col class="cr-primary txt">{{ currency + (item.year_price || 0) }}/年</a-col>
          <a-col>
            <a-button class="cr-primary btn" size="large" @click="goBuy(item.id)">立即购买</a-button>
          </a-col>
        </a-row>
      </a-card>
    </a-list-item>
  </a-list>
</template>

<script>
export default {
  props: ['icon', 'list', 'currency', 'type'],
  data() {
    return {}
  },
  methods: {
    goBuy(id) {
      this.$router.push({ path: '/new_marketing/merchant/PurchaseDetail', query: { type: this.type, id } })
    },
  },
}
</script>

<style scoped>
.item {
  box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}
.title {
  margin-left: 10px;
  margin-right: 20px;
  font-size: 18px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}
.cr-primary.txt {
  font-weight: bold;
  font-size: 22px;
}
.cr-primary.btn {
  border-color: #1890ff;
  border-radius: 5px;
}
.meal {
  margin-top: 20px;
  font-size: 16px;
}
.meal .detail {
  height: 48px;
  overflow: hidden;
  letter-spacing: 0;
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2; /*要显示的行数*/
  -webkit-box-orient: vertical;
  white-space: pre-line;
}
.meal .detail .type-name:last-child .plus {
  display: none;
}

.discount-icon {
  width: 0;
  height: 0;
  border: 60px solid transparent;
  border-bottom: 60px solid #eaf5ff;
  transform: rotateZ(45deg);
  position: absolute;
  right: -60px;
  top: -60px;
}
.discount-icon .txt {
  position: absolute;
  top: 25px;
  right: -23px;
  font-size: 14px;
}
.pd10-0 {
  padding: 10px 0;
}
</style>