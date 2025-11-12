<template>
  <div class="antv-chart-mini">
    <div class="chart-wrapper" :style="{ height: 46 }">
      <v-chart :force-fit="true" :height="height" :data="data" :padding="[36, 5, 18, 5]">
        <v-tooltip />
        <v-bar position="x*y" />
      </v-chart>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MiniBar',
  props: {
    title: {
      type: String,
      default: '',
    },
    height: {
      type: Number,
      default: 100,
    },
    data: {
      type: Array,
      default: () => {
        return []
      },
    },
    scale: {
      type: Array,
      default: () => {
        return [
          {
            dataKey: 'x',
            min: 2,
          },
          {
            dataKey: 'y',
            title: '时间',
            min: 1,
            max: 22,
          },
        ]
      },
    },
    tooltip: {
      type: Array,
      default: () => {
        return [
          'x*y',
          (x, y) => ({
            name: x,
            value: y,
          }),
        ]
      },
    },
  },
  data() {
    return {}
  },
}
</script>

<style lang="less" scoped>
@import 'chart';
</style>
