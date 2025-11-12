/**
*******************
*   @author 郑亚莉
*   @date 2020-05-28
*   @description 颜色选择器
*******************
*/
<template>
  <div class="color-picker">
    <colorPicker class="color-box" v-model="colorInfo" v-on:change="headleChangeColor" :disabled="disabled"/>
    <p class="color-name">{{ colorInfo }}</p>
  </div>
</template>

<script>
export default {
  name: 'CustomColorPicker',
  components: {},
  data() {
    return {
      colorInfo: ''
    }
  },
  props: {
    color: {
      type: String,
      default: '#ffffff'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    color: {
      handler (val) {
        console.log(val)
        if (val) {
          this.$nextTick(function () {
					this.colorInfo = val
				})
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.colorInfo = this.color
  },
  methods: {
    headleChangeColor(val) {
      this.$emit('update:color', val)
    },
  },
}
</script>

<style scoped lang="less">
.color-picker {
  margin: 10px;
  display: flex;
  justify-content: flex-start;
  /deep/ .m-colorPicker .box{
    width: 220px !important
  }
  .color-box {
    z-index: 999;
    /deep/ .colorBtn {
      width: 80px;
      height: 30px;
      border: 1px solid #666666;
    }
  }
  .color-name {
    display: inline-block;
    margin: 0px 20px;
    line-height: 30px;
    vertical-align: middle;
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
