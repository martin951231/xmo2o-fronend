<template>
  <div class="header-bar">
    <div class="header-title">{{title}}</div>
    <div v-if="projectItem.length > 0" class="project-item flex justify-center">
<!--      :style="`width:calc( (100% / ${projectItem.length}) - 2rem );`"-->
      <div v-for="(item,index) in projectItem">
        <div class="flex header-label" >
          <span class="label-text">{{ item.label }}</span>
        </div>
        <div :class="`label-content label-color_${index}`">
          <span>{{ item.value.join(' / ') }}</span>
          <span>{{ item.unit }}</span>
        </div>
      </div>
    </div>
    <!-- 科技感发光线条组件 -->
    <div class="glow-line-container">
      <div class="glow-line-wrapper">
        <div class="left-glow-line"></div>
        <div class="right-glow-line"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Header',
  components: {
  },
  props: {
    title:{
      type: String,
      default: ''
    },
    projectItem:{
      type: Array,
      default: []
    },
  },
  watch: {},
  computed: {},
  mounted() {

  },
  data: function () {
    return {

    }
  },
  methods: {

  },
}
</script>

<style scoped lang="less">
@import "../css/header.less";
</style>