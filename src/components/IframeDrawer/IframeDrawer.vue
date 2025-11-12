/**
*******************
*   @author 荣杰
*   @date 2023-04-20
*   @description 嵌入iframe且自定义宽高的抽屉组件
*******************
*/
<template>
  <div>
    <a-drawer
      :title="title"
      :placement="placement"
      :closable="closable"
      :visible="visible"
      :zIndex="zIndex"
      :width="width"
      :height="height"
      destroyOnClose
      @close="handleDrawerClose"
    >
      <iframe
        ref="childIframe"
        :style="drawerIframeStyle"
        :src="url"
        frameborder="no"
        name="Openadd"
        class="drawer-iframe"
      ></iframe>
    </a-drawer>
  </div>
</template>

<script>
export default {
  name: 'IframeDrawer',
  props: {},
  data() {
    return {
      url: '',
      id: '',
      title: '', //标题
      placement: 'right', //弹出方向 top、right、bottom、left 默认右侧right
      closable: false, //是否显示关闭按钮
      visible: false, //是否显示
      width: '256',
      height: '256',
      zIndex: 1000,
      drawerIframeStyle: {
        width: '100%',
        height: '100%'
      }
    }
  },
  methods: {
    // 打开弹框方法 value为打开弹框时传入的值
    openDrawer(value) {
      this.visible = true
      console.log(value, 'IframeDrawer')
      // 把传入的参数赋值到data里
      if (Object.keys(value).length) {
        Object.keys(value).forEach((item) => {
          this[item] = value[item]
        })
      }
    },
    //弹框关闭事件
    handleDrawerClose() {
      this.$emit('handleDrawerClose')
    },
    //关闭弹框
    closeVisible(){
        this.visible = false;
    },
  },
}
</script>

<style scoped>
.drawer-iframe{
    width: 100%;
    max-height: 88vh;
}
</style>
