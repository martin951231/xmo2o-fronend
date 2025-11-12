<template>
  <div style=" padding:30px">
    <a-card :bordered="false" style="width: 100%">
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="小区月度已缴报表">
          <MonthList ref="myMonthList"/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="小区年度已缴报表" force-render>
          <YearList ref="myYearList" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="小区年度应收报表">
          <YearedList ref="myYearedList" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import MonthList from './villageModel/monthList.vue'
import YearList from './villageModel/yearList.vue'
import YearedList from './villageModel/yearedList.vue'
export default {
  name: 'villages_billing_report',

  components: { MonthList, YearList, YearedList },

  data() {
    return {
    };
  },
  methods: {
    callback(key) {
      if (key == '1') {
        this.$refs.myMonthList.getList()
        this.$refs.myMonthList.getChargeProjectList()

      }
      if (key == '2') {
        this.$refs.myYearList.getList()
        this.$refs.myYearList.getChargeProjectList()
      }
      if (key == '3') {
        // this.$refs.myYearedList.getList()
      }
    },
  },
};
</script>

<style scoped></style>