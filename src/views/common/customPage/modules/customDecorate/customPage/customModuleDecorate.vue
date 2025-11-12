<template>
  <div>
    <!-- 组件描述 -->
    <componentDesc :content="desc"></componentDesc>

    <div class="content">
      <div class="sub-title flex align-center justify-between">
        <span>{{L('自定义页面模块：')}}</span>
        <a-button type="primary" ghost @click="indexSetOpt()" v-if="formData&&!formData.id">
          <span style="padding:0 10px;">{{L('添加')}}</span>
        </a-button>
      </div>

      <div class="select-page flex align-center justify-between" v-if="formData&&formData.id">
        <span style="max-width:300px" class="text-els">{{ formData.page_title}}</span>
        <span>
          <a-icon type="edit" @click="indexSetOpt()"></a-icon>
          <a-icon type="delete" @click="delCueMod()"></a-icon>
        </span>
      </div>

      
    </div>
    <!-- 微页面弹框 -->
    <selectCustomPage ref="selectCustomPage" @getIndexPageOpt="getIndexPageOpt" :isCustomModule="true"></selectCustomPage>
  </div>
</template>

<script>
import componentDesc from '@/views/common/customPage/modules/common/componentDesc'
import selectCustomPage from '@/views/common/customPage/modules/customPage/selectCustomPage'

export default {
  components: {
    componentDesc,
    selectCustomPage
  },
  props: {
    // 表单数据
    formContent: {
      type: [String, Object],
      default: ''
    }
  },
  data() {
    return {
      desc: {
        title: this.L('自定义模块')
      },
      formData: ''
    }
  },
  computed: {
    // 来源source source_id
    sourceInfo() {
      return this.$store.state.customPage.sourceInfo
    },
    pageInfo() {
      return this.$store.state.customPage.pageInfo
    }
  },
  watch: {
    formData: {
      deep: true,
      handler(val) {
        this.$emit('updatePageInfo', val)
      }
    }
  },
  mounted() {
    if (this.formContent) {
      this.formData = {}
      for (let k in this.formContent) {
        this.$set(this.formData, k, this.formContent[k])
      }
    }

  },
  methods: {
    // 获取微页面
    getIndexPageOpt(res) {
      let current = res.current || ''
      if (current) {
        this.$set(this.formData, 'page_title', current.page_title || current.page_title == 0?current.page_title:'')
        this.$set(this.formData, 'id', current.id || '')
      }
    },
    // 更换 打开微页面列表
    indexSetOpt() {
      this.$refs.selectCustomPage.openModal({
        id: this.formData.id,
        sourceInfo: this.sourceInfo
      })
    },
    // 删除当前微页面
    delCueMod() {
      this.formData = {}
    }
  }
}
</script>

<style scoped>
.content {
  padding: 24px;
  width: 100%;
}
.sub-title {
  font-size: 14px;
  font-weight: 400;
  color: #323233;
}
.select-page {
  margin-top: 20px;
  padding: 0 14px;
  height: 36px;
  background: #edf4ff;
  border: 1px solid #155bd4;
  border-radius: 4px;
  color: #155bd4;
  box-sizing: border-box;
}
.select-page >>> .anticon {
  padding: 0 10px;
  font-size: 14px;
}
</style>
