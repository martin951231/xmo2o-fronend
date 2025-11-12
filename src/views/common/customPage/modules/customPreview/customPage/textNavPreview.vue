<template>
  <div>
    <div v-if="content && content.list && content.list.length">
      <div
        v-for="(item, index) in content.list"
        :key="index"
        :style="{
          'background-color': content.bg_color
        }"
        class="nav-box flex flex-wrap"
      >
        <div class="text-left" style="width:100%">
          <a
            :href="item.link_url"
            class="mh-full block"
            :style="{
              color: content.font_color
            }"
          >
            <div class="flex justify-between align-center" style="height:100%">
              <span class="pr-10">{{ item.name || L('我是文本导航') }}</span>
              <span><a-icon type="right"/></span>
            </div>
          </a>
        </div>
      </div>
    </div>
    <!-- 没有文本导航时展示 -->
    <div class="empty-nav flex justify-between align-center" v-else>
      <span class="text-center">{{L('进入查看')}}</span>
      <span><a-icon type="right"/></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: [String, Object],
      default: ''
    }
  },
  data() {
    return {}
  }
}
</script>

<style scoped>
.nav-box {
  padding: 0 18px;
  width: 100%;
  min-height: 30px;
  word-break:break-all;
}

.empty-nav {
  height: 30px;
  width: 100%;
  padding: 0 18px;
  color: #000000;
}
</style>
