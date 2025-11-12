<template>
  <a-button type="primary" v-show="false"> Open the message box </a-button>
</template>
<script>
import exportApi from '@/api/common/export'
const key = 'updatable'
export default {
  props: {
    //接收父页面数据
    exportUrl: '',
    queryParam: {},
  },
  data() {
    return {
      file_date: '',
      file_url: '',
    }
  },
  mounted() {},
  methods: {
    exports(
      t1 = '加载中,请耐心等待,数量越多时间越长。',
      t2 = '若长时间未成功导出，建议调整筛选条件减少导出数，然后分多次导出。'
    ) {
      this.request(this.exportUrl, this.queryParam).then((date) => {
        // 弹层提示
        if(date.file_url) {
            //下载成功
          this.$message.success({ content: '下载成功!', key, duration: 2 })
          location.href = date.file_url
          return
        }
        this.$message.loading({ content: t1, key, duration: 0 })
        console.log('添加导出计划任务成功')
        this.file_url = exportApi.downloadExportFile + '?id=' + date.export_id
        this.file_date = date

        this.CheckStatus()
      })
    },
    CheckStatus() {
      this.request(this.file_url, {
        id: this.file_date.export_id,
      }).then((res) => {
        if (res.error == 0) {
          //下载成功
          this.$message.success({ content: '下载成功!', key, duration: 2 })
          location.href = res.url
        } else {
          setTimeout(() => {
            this.CheckStatus()
            console.log('重复请求')
          }, 1000)
        }
      })
    },
  },
}
</script>
<style scoped>
</style>
