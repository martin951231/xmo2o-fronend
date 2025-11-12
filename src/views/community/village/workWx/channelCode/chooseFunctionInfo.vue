<template>
  <a-modal :title="title" :width="900" :visible="visible" :footer="null" :maskClosable="false" :confirmLoading="confirmLoading"  @cancel="handleCancel">
    <div id="components-table-demo-size">
        <a-table 
        :columns="columns" 
        :data-source="contentList" 
        size="small" 
        @change="tableChange"
        :pagination="pagination">
        <span slot="linkContent" slot-scope="text,record" class="table-operation">
           <a :href="record.content" target="_blank">访问链接</a>
        </span>
        <span slot="operation" slot-scope="text,record" class="table-operation">
            <a slot="action" @click="handleOk(record)">选择</a>
        </span>

        </a-table>
    </div>
  </a-modal>
</template>
<script>
import villageApi from '@/api/community/village'
import { getSystemName } from '@/utils/util'
const columns = [
  {
    title: '标题',
    dataIndex: 'title',
  },
  { title: '操作', key: 'content', scopedSlots: { customRender: 'linkContent' } },
  {
    title: '所属分组',
    dataIndex: 'name',
  },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
];

export default {
  name: 'chooseFunctionInfo',
  data() {
    return {
      contentList: [],
      columns,
      title: '选择功能',
      visible: false,
      confirmLoading: false,
      page: 1,
      pagination: { pageSize: 10, total:10 },
      tokenName: '',
      sysName: ''
    };
  },
  methods: {
    chooseInfo() {
        this.title='选择功能',
        this.visible = true;
        let sysName = getSystemName(location.hash);
        if (sysName) {
        this.tokenName = sysName + '_access_token';
        this.sysName = sysName;
        } else {
            this.sysName = 'village';
        }
        this.getContentList();
    },
    handleCancel() {
        this.visible = false
    },
    handleOk(record) {
        console.log('record',record);
        this.$emit('ok', record)
        this.visible = false;
    },
    tableChange(e) {
        if (e.current && e.current>0) {
            this.page = e.current;
            this.getContentList()
        }
    },
    // 获得列表
    getContentList() {
        this.loading = true;
        let queryParam = {};
        queryParam['page'] = this.page;
        queryParam['type'] = 4; // 1文本 2图片 3文件 4功能库
        if (this.tokenName) {
            queryParam['tokenName'] = this.tokenName;
        }
        this.request(villageApi.getContentList, queryParam).then((res) => {
            this.contentList = res.list;
            console.log('queryParam', res);
            if(res.list && res.list.length>0) {
                this.pagination.total = res.count ? res.count : 0
                this.pagination.pageSize = res.total_limit ? res.total_limit : 10
            }
            this.loading = false
        })
    },
  }
};
</script>
<style>
#components-table-demo-size h4 {
  margin-bottom: 16px;
}
</style>
