<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">

    <a-button type="primary" @click="$refs.categoryEditModel.add(0, queryParams.type)" style="margin: 10px 10px">
      {{ L('添加分类') }}
    </a-button>
    <a-table style="background: #ffffff" :columns="columns" rowKey="pigcms_id" :data-source="dataList"
      :pagination="false">
      
      <!-- 排序 -->
      <template slot="sort" slot-scope="text, record">
        <a-input-number  style="width: 4.125rem;text-align: center;" v-model="record.sort" @blur="pointerMove($event,record)"></a-input-number>
      </template>

      <!-- 操作栏 -->
      <span slot="action" slot-scope="text">
        <a class="inline-block" @click="$refs.categoryEditModel.add(text, queryParams.type)"
          style="margin-right: 10px">{{ L('编辑') }}</a>
        <a class="inline-block" @click="delCategory(text)">{{ L('删除') }}</a>
      </span>

    </a-table>
    <category-edit @loadRefresh="getList" ref="categoryEditModel" />
  </div>
</template>

<script>
  import lifeToolsPlatformApi from "@/api/life_tools/platform";
  import CategoryEdit from './modules/CategoryEdit.vue'

  export default {
    components: {
      CategoryEdit
    },

    data() {
      return {
        dataList: [],
        queryParams: {
          type: ''
        },
        columns: [
          {
            title: this.L('标题'),
            dataIndex: 'cat_name'
          },
          {
            title: this.L('排序'),
            dataIndex: 'sort',
            scopedSlots: {
              customRender: 'sort'
            },
          },

          {
            title: this.L('添加时间'),
            dataIndex: 'add_time',
          },
          {
            title: this.L('操作'),
            dataIndex: 'cat_id',
            key: 'cat_id',
            scopedSlots: {
              customRender: 'action'
            },
          },

        ],
      }
    },
    watch: {
      $route: {
          handler: function () {
            if (this.$route.path.indexOf('type') != -1) {
              this.queryParams.type = this.$route.path.slice(this.$route.path.indexOf('=') + 1)
            } else {
              this.queryParams.type = ''
            }
            if(this.queryParams.type) {
              this.getList()
            }
          },
      },
    },
    mounted() {
      if (this.$route.path.indexOf('type') != -1) {
        this.queryParams.type = this.$route.path.slice(this.$route.path.indexOf('=') + 1)
      }
 
        console.log(this.queryParams.type,'mounted')
      this.getList();
    },
    activated() {
        // console.log(this.$route.query,'query')
        // if (this.$route.query.type) {
        //   this.queryParams.type = this.$route.query.type
        // }
        // console.log(this.$route.query,'activated')
        // this.getList();
    },
    methods: {
      getList() {
        this.request(lifeToolsPlatformApi.getCategoryList, this.queryParams).then((res) => {
          this.dataList = res
        })
      },
      delCategory(cat_id){
        this.$confirm({
          title: '确定删除吗？',
          centered: true,
          onOk: () => {
            this.request(lifeToolsPlatformApi.categoryDel, {cat_id}).then((res) => {
               this.$message.success(this.L('操作成功！'));
               this.getList();
            })
          },
          onCancel() {},
        })
        
      },
      
      pointerMove(e, record){
        this.request(lifeToolsPlatformApi.categorySortEdit, {
          cat_id:record.cat_id,
          sort:record.sort,
        }).then(res => {
        this.getList();
        });

      },
    },
  }
</script>
