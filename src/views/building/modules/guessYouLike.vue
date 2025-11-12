<template>
  <a-modal :title="title" width="950px" :visible="visible" @cancel="handelCancle" @ok="handleSubmit">
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" layout="horizontal">
      <a-form-model-item label="推送商品总数量">
        <a-input-number v-model="form.total_num" :min="0"/>
      </a-form-model-item>
      <a-form-model-item label="商城商品">
        推荐权重：<a-input-number v-model="form.mall_weight" style="width: 100px;margin-right: 2rem;" />
        推荐排序：
        <a-select v-model="form.mall_sort_rule" style="width: 100px;margin-right: 2rem;">
          <a-select-option value="1">最新发布</a-select-option>
          <a-select-option value="2">销量最高</a-select-option>
        </a-select>

        状态：<a-switch v-model="form.mall_status" checked-children="开" un-checked-children="关" default-checked />
      </a-form-model-item>

      <a-form-model-item label="外卖店铺">
        推荐权重：<a-input-number v-model="form.shop_weight" style="width: 100px;margin-right: 2rem;" />
        推荐排序：
        <a-select v-model="form.shop_sort_rule" style="width: 100px;margin-right: 2rem;">
          <a-select-option value="1">最新发布</a-select-option>
          <a-select-option value="2">销量最高</a-select-option>
        </a-select>

        状态：<a-switch v-model="form.shop_status" checked-children="开" un-checked-children="关" default-checked />
      </a-form-model-item>

      <a-form-model-item label="团购商品">
        推荐权重：<a-input-number v-model="form.group_weight" style="width: 100px;margin-right: 2rem;" />
        推荐排序：
        <a-select v-model="form.group_sort_rule" style="width: 100px;margin-right: 2rem;">
          <a-select-option value="1">最新发布</a-select-option>
          <a-select-option value="2">销量最高</a-select-option>
        </a-select>

        状态：<a-switch v-model="form.group_status" checked-children="开" un-checked-children="关" default-checked />
      </a-form-model-item>

      <a-form-model-item label="餐饮店铺">
        推荐权重：<a-input-number v-model="form.dining_weight" style="width: 100px;margin-right: 2rem;" />
        推荐排序：
        <a-select v-model="form.dining_sort_rule" style="width: 100px;margin-right: 2rem;">
          <a-select-option value="1">最新发布</a-select-option>
          <a-select-option value="2">销量最高</a-select-option>
        </a-select>

        状态：<a-switch v-model="form.dining_status" checked-children="开" un-checked-children="关" default-checked />
      </a-form-model-item>
    </a-form-model>
  </a-modal>

</template>

<script>
import buildingPlatformApi from '@/api/building/index'

export default {
  name: "guessYouLike",
  components: {},
  data() {
    return {
      visible: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },

      title: '猜你喜欢',
      mall_id: 0,
      form: {
        total_num: 0,
        mall_weight: 0,
        mall_sort_rule: '1',
        mall_status: true,
        shop_weight: 0,
        shop_sort_rule: '1',
        shop_status: true,
        group_weight: 0,
        group_sort_rule: '1',
        group_status: true,
        dining_weight: 0,
        dining_sort_rule: '1',
        dining_status: true,
      }
    }
  },
  created() {

  },
  methods: {
    showModal(mall_id) {
      this.mall_id = mall_id;
      this.getGuessYouLike();
      this.visible = true;
    },
    handelCancle(){
      this.visible = false;
    },
    getGuessYouLike(){
      this.request(buildingPlatformApi.getGuessYouLike, {mall_id: this.mall_id}).then((res) => {
        if(typeof res.id !='undefined'){
          this.form = res;
          this.form.mall_status = this.form.mall_status == 1 ? true : false;
          this.form.shop_status = this.form.shop_status == 1 ? true : false;
          this.form.group_status = this.form.group_status == 1 ? true : false;
          this.form.dining_status = this.form.dining_status == 1 ? true : false;
          this.form.mall_sort_rule = this.form.mall_sort_rule + '';
          this.form.shop_sort_rule = this.form.shop_sort_rule + '';
          this.form.group_sort_rule = this.form.group_sort_rule + '';
          this.form.dining_sort_rule = this.form.dining_sort_rule + '';
        }
      }) 
    },
    handleSubmit(){
      console.log(this.form)
      this.form.mall_id = this.mall_id;
      this.request(buildingPlatformApi.setGuessYouLike, this.form).then((res) => {
          this.$message.success("保存成功");
          this.visible = false;
      })
    }
  }
}
</script>