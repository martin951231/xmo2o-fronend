/**
*******************
*   @author 郑亚莉
*   @date 2020-04-28
*   @description 嵌入iframe且自定义宽高的弹框组件
*******************
*/
<template>
  <div>
    <a-modal
      key="has-footer"
      :title="title"
      :width="width"
      :visible="visible"
      :centered="centered"
      :confirmLoading="confirmLoading"
      @cancel="handleClose"
      destroyOnClose
      :zIndex="zIndex"
      v-if="button && button.length"
    >
      <iframe
        ref="childIframe"
        class="iframe-style"
        :style="'height:' + (JSON.stringify(height).indexOf('%') === -1 ? height + 'px' : '600px')"
        :src="url"
        frameborder="no"
        name="Openadd"
      ></iframe>
      <template slot="footer">
        <a-button
          v-for="(item, index) of button"
          :key="index"
          @click="handleButtonClick(item)"
          :type="item.name === '关闭' ? '' : 'primary'"
          >{{ item.name }}</a-button
        >
      </template>
    </a-modal>
    <a-modal
      v-else
      key="no-footer"
      :centered="centered"
      :title="title"
      :width="width"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @cancel="handleClose"
      :footer="null"
      destroyOnClose
      :zIndex="zIndex"
    >
      <iframe
        ref="childIframe"
        class="iframe-style"
        :style="'height:' + (JSON.stringify(height).indexOf('%') === -1 ? height + 'px' : '600px')"
        :src="url"
        frameborder="no"
      ></iframe>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'IframeDialog',
  props: {},
  data() {
    return {
      url: '',
      title: '',
      width: 600,
      height: 600,
      lock: undefined,
      resize: false,
      background: '',
      button: [],
      id: '',
      fixeds: true,
      closefun: null,
      left: 0,
      top: 0,
      padding: 0,
      confirmLoading: false,
      visible: false,
      centered: false,
      zIndex: 1000,
    }
  },
  methods: {
    // 打开弹框方法 value为打开弹框时传入的值
    openDialog(value) {
      this.visible = true
      // console.log(value)
      // 把传入的参数赋值到data里
      if (Object.keys(value).length) {
        Object.keys(value).forEach((item) => {
          this[item] = value[item]
        })
      }
    },
    // 弹框按钮点击
    handleButtonClick(item) {
      if (item.name !== '关闭') {
        this.$emit('handleOk', item)
      } else {
        this.$emit('handleClose')
      }
    },
    handleClose() {
      this.$emit('handleClose')
    },
  },
}
</script>

<style scoped>
.iframe-style {
  width: 100%;
  height: 100%;
}
</style>
