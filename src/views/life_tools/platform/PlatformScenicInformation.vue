<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
 
   
    
    <h3><a>{{typeMap[type]}}</a></h3>
     <a-divider style="margin-top: 10px;" />


    <a-row style="margin-top: 20px;">
      <a-input-search placeholder="搜索资讯" style="width: 200px" @search="onSearch" />
      <a-button type="primary" @click="$refs.informationEditModel.addEditInformation(0, type)" style="margin: 10px 10px">
        {{ L('添加资讯') }}
      </a-button>
    </a-row>


    <a-table style="background: #ffffff" :columns="columns" rowKey="pigcms_id" :data-source="dataList"
      @change="changePage" :pagination="pagination">

      <span slot="show_type" slot-scope="text,item">
        {{text == 1 ? '永久显示': item.start_time_text + ' ~ ' + item.end_time_text }}
      </span>

      <!-- 操作栏 -->
      <span slot="action" slot-scope="text">
        <a class="inline-block" @click="$refs.informationEditModel.addEditInformation(text, type)"
          style="margin-right: 10px">{{ L('编辑') }}</a>
        <a class="inline-block" @click="delInformation(text)">{{ L('删除') }}</a>
      </span>

    </a-table>




    <information-edit @loadRefresh="getInformationList" ref="informationEditModel" />



  </div>
</template>

<script>
  import lifeToolsPlatformApi from "@/api/life_tools/platform";
  import InformationEdit from './modules/InformationEdit.vue'

  export default {
    components: {
      InformationEdit
    },

    data() {
      return {
        dataList: [],
        type: 'scenic',
        pagination: {
          pageSize: 10,
          total: 0,
          current: 1,
          page: 1
        },
        queryParams: {
          page_size: 0,
          page: 1,
          keywords: '',
          type: 'scenic'
        },
        typeMap:{
          'sports':'体育资讯',
          'scenic':'景区资讯'
        },
        columns: [{
            title: this.L('编号'),
            dataIndex: 'id',
            width: 80
          },
          {
            title: this.L('标题'),
            dataIndex: 'title'
          },
          {
            title: this.L('内容'),
            dataIndex: 'cont',
          },
          {
            title: this.L('显示时间'),
            dataIndex: 'show_type',
            key: 'show_type',
            width: 200,
            scopedSlots: {
              customRender: 'show_type'
            },
          },

          {
            title: this.L('浏览量'),
            dataIndex: 'view_count',
            width: 80
          },

          {
            title: this.L('添加时间'),
            dataIndex: 'add_time_text',
            width: 160
          },
          {
            title: this.L('操作'),
            dataIndex: 'pigcms_id',
            key: 'pigcms_id',
            width: 100,
            scopedSlots: {
              customRender: 'action'
            },
          },

        ],
      }
    },
    watch: {

    },
    created() {

    },
    mounted() {
      if (this.$route.query.type) {
        this.type = this.$route.query.type
      }
      this.getInformationList();
    },
    methods: {
      getInformationList() {
        this.queryParams.page_size = this.pagination.pageSize;
        this.queryParams.page = this.pagination.current;
        this.queryParams.type = this.type;
        this.request(lifeToolsPlatformApi.getInformationList, this.queryParams).then((res) => {
          this.dataList = res.data
          this.pagination.total = res.total
        })
      },
      changePage(page, pageSize) {
        this.pagination.current = page.current;
        this.getInformationList();
      },
      onSearch(text) {
        this.queryParams.keywords = text;
        this.getInformationList();
      },
      delInformation(pigcms_id){
        this.$confirm({
          title: '确定删除吗？',
          centered: true,
          onOk: () => {
            this.request(lifeToolsPlatformApi.delInformation, {pigcms_id}).then((res) => {
               this.$message.success(this.L('操作成功！'));
               this.getInformationList();
            })
          },
          onCancel() {},
        })
        
      }
    },
  }
</script>
