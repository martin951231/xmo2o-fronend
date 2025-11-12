<template>
  <a-modal :title="title" :width="1200" :visible="visible" :footer="null" :maskClosable="false" :confirmLoading="confirmLoading" @cancel="handleCancel">
    <span class="add-banner sel">
          <a @click="">{{title}}-列表</a>
        </span>
    <span class="add-banner">
          <a @click="$refs.createModal.addSlideShows(cat_id)">添加广告</a>
        </span>
    <hr/>
    <div class="prompt">广告背景颜色自定义</div>
    <a-card :bordered="false" >
      <a-table :columns="columns" :data-source="BannerList"
               :pagination="pagination"
               @change="tableChange" >
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.createModal.editSlideShows(record.id,cat_id)">编辑</a>
          <a-divider type="vertical" />
            <a-popconfirm
              class="ant-dropdown-link"
              title="确认删除?"
              ok-text="是"
              cancel-text="否"
              @confirm="deleteConfirm(record.id)"
              @cancel="cancel"
            >
              <a href="#">删除</a>
            </a-popconfirm>
        </span>
        <span slot="bg_color" slot-scope="text">
                <colorPicker v-model="text" disabled></colorPicker>
              </span>
        <span slot="url" slot-scope="text">
            <a :href="text" target="_blank">访问链接</a>
          </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
      </a-table>
    </a-card>

    <add-slide-show :height='800' :width="1200" ref="createModal" @ok="handleOks"/>
  </a-modal>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import addSlideShow from './addSlideShow.vue';
    const statusMap = {
        1: {
            status: 'success',
            text: '正常'
        },
        2: {
            status: 'default',
            text: '关闭'
        }
    }
    export default {
        name:'FourAdvertising',
        components: {
            addSlideShow
        },
        data() {
            return {
                title: '广告图',
                visible: false,
                confirmLoading: false,
                sortedInfo:null,
                BannerList: [],
                pagination: { pageSize: 10, total:10 },
                search: { page: 1 },
                page: 1,
                cat_id:0,
                cat_key:'street_four_adver',
                prompt:'',
            }
        },
        filters: {
            statusFilter (type) {
                return statusMap[type].text
            },
            statusTypeFilter (type) {
                return statusMap[type].status
            }
        },
        mounted() {
            this.BannerLists();
        },
        computed:{
            columns() {
                let {
                    sortedInfo
                } = this;
                sortedInfo = sortedInfo || {};
                const columns = [
                    {
                        title: '编号',
                        dataIndex: 'id',
                        key: 'id',
                    },
                    {
                        title: '名称',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        title: '链接地址',
                        key: 'url',
                        dataIndex: 'url',
                        scopedSlots: { customRender: 'url' },
                    },
                    {
                        title: '背景色',
                        key: 'bg_color',
                        dataIndex: 'bg_color',
                        scopedSlots: { customRender: 'bg_color' },
                    },
                    {
                        title: '最后操作时间',
                        key: 'last_time',
                        dataIndex: 'last_time',
                    },
                    {
                        title: '状态',
                        key: 'status',
                        dataIndex: 'status',
                        scopedSlots: { customRender: 'status' },
                    },
                    {
                        title: '操作',
                        key: 'action',
                        dataIndex: '',
                        scopedSlots: {
                            customRender: 'action'
                        }
                    },
                ];
                return columns;
            },
        },
        methods: {
            slideshowList() {
                this.title = '广告图'
                this.visible = true;
                this.BannerLists();
            },
            BannerLists() {
                this.search['page'] = this.page;
                this.search['cat_key'] = this.cat_key;
                let _this = this
                this.request(streetCommunityApi.getBannerList, this.search)
                    .then((res) => {
                        console.log('res', res)
                        this.BannerList = res.list;
                        this.cat_id = res.cat_id;
                        this.title = res.now_category.cat_name;
                        this.prompt = res.now_category.size_info;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                    })
            },
            tableChange(e) {
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.BannerLists()
                }
            },
            handleOks() {
                this.BannerLists();
            },
            deleteConfirm(id){
                this.request(streetCommunityApi.bannerDel,{'id':id})
                    .then((res) => {
                        this.BannerLists()
                        this.$message.success('删除成功')
                    })
            },
            cancel() {

            },
            handleCancel() {
                this.visible = false
            },
            customExpandIcon(props){
                console.log(props.record.children)
                if(props.record.children != undefined){
                    if(props.record.children.length > 0){
                        if (props.expanded) {
                            return <a style={{ color: 'black',marginRight:'8px' }} onClick={e=>{ props.onExpand(props.record, e);}}><a-icon  type='caret-down' style={{fontSize:16}}/></a >
                        } else {
                            return <a style={{ color: 'black',marginRight:'4px' }} onClick={e=>{ props.onExpand(props.record, e);}}><a-icon  type='caret-right' style={{fontSize:16}}/></a >
                        }
                    }else{
                        return <span style={{marginRight:'8px'}}></span>
                    }
                }else{
                    return <span style={{marginRight:'20px'}}></span>
                }
            }
        },
    }
</script>
<style>
  .ant-form-item label {
    width: 150px;
  }
  .tip-txt {
    margin-left:4px;font-size: 12px;
  }
  .add-box-tip {
    text-align: -webkit-center;
    padding: 0 6px;
    margin-left: 8px;
    border-radius: 15px;
    border: none;
  }
  .add-banner{
    font-size: 15px;
    margin: 13px;
  }
  hr{
    border:1px solid #eee;
  }
  .sel{
    border-bottom: 2px solid #3283FA;
    padding-bottom: 8px;
  }
  .prompt{
    border: 1px solid #d6e9c6;
    width: 95.5%;
    padding: 15px;
    margin-left: 25px;
    background-color: #dff0d8;
  }
</style>