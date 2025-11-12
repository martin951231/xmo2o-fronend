<template>
  <div class="ant-pro-page-header-wrap-children-content" style="margin: 24px 0 0">
    <a-card :bordered="false">
      <a-page-header
        class="page-header"
        title="热搜词列表"
      />
      <a-button type="primary" @click="add(cat_id)" style="margin-bottom: 10px;float: right;">新建搜索词</a-button>
      <div style="height: 50px"></div>
      <a-table
        :columns="columns"
        :data-source="data"
        rowKey="id"
        :pagination="false"
        style="min-height: 700px"
      >
            <span slot="sort" slot-scope="text, record">
              <a-input-number :min="0" step="1" style="width: 100px" v-model="record.sort"
                              @blur="handleSortChange(text,record.id)"/>
            </span>
        <span slot="action" slot-scope="text, record">
            <template>
              <a @click="$refs.createModal.edit(record.id,record.cat_id )">编辑</a>
              <a-divider type="vertical"/>
            </template>
            <a @click="delOne(record.id)">删除</a>
        </span>
      </a-table>
      <create-search-hot ref="createModal" @loaddata="getList"/>
    </a-card>
  </div>
</template>
<script>
import GroupPlatformApi from '@/api/group/platform'
import CreateSearchHot from "@/views/group/modules/CreateSearchHot";
import groupPlatformApi from "@/api/group/platform";

export default {
  name: 'GroupSearchHotList',
  components: {
    CreateSearchHot
  },
  data() {
    return {
      // 表头
      columns: [
        {
          title: '关键字',
          dataIndex: 'name',
        },
        {
          title: '排序',
          dataIndex: 'sort',
          scopedSlots: {
            customRender: 'sort',
          },
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: {
            customRender: 'action',
          },
        },
      ],
      data: [],
      cat_id: ''
    }
  },
  created() {
  },
  activated() {
    this.cat_id = this.$route.query.cat_id
    this.getList(this.cat_id)
  },
  mounted() {
  },
  watch: {
    '$route.query.cat_id'() {
      this.cat_id = this.$route.query.cat_id
      this.getList(this.cat_id)
    },
  },
  methods: {
    // 获取列表信息
    getList(cat_id) {
      this.request(GroupPlatformApi.getGroupSearchHotList, {cat_id: cat_id}).then((res) => {
        this.data = res.list
      })
    },
    // 设置排序
    handleSortChange(val, id) {
      this.request(GroupPlatformApi.saveSearchHotSort, {
        id: id,
        sort: val,
      }).then((res) => {
        this.getList(this.cat_id)
      })
    },
    // 新建
    add(cat_id) {
      this.$refs.createModal.add(cat_id)
    },
    // 返回装修页面
    btnClick() {
      alert(2)
      // this.$router.push({path: '/group/platform.groupRenovationCustomStore/index', query: {custom_id: custom_id}})
    },
    // 删除
    delOne(id) {
      this.$confirm({
        title: '提示',
        content: '确定删除该热搜词？',
        onOk: () => {
          this.request(GroupPlatformApi.delSearchHot, {id: id}).then((res) => {
            this.getList(this.cat_id)
          })
        },
        onCancel() {
        },
      });
    },
  }
}
</script>
<style scoped lang="less">
</style>