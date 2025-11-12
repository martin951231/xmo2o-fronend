<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-card :bordered="false">
      <div class="search-box" style="margin-bottom: 10px;">
        是否开启评论审核：<a-switch :checked="party_build_switch" @change="openReplySwitch($event)" />
      </div>
      <a-table :columns="columns" :data-source="list"
               :pagination="pagination"
               @change="tableChange" >
        <span slot="action" slot-scope="text, record">
          <a v-show="!record.is_read" @click="actionRead(record.pigcms_id)">已读</a>
          <a-divider type="vertical"  v-show="!record.is_read"/>
            <a-popconfirm
              class="ant-dropdown-link"
              title="确认删除?"
              ok-text="是"
              cancel-text="否"
              @confirm="actionReply(record.pigcms_id,2)"
              @cancel="cancel"
            >
              <a href="#">删除</a>
            </a-popconfirm>
        </span>
        <span slot="status" slot-scope="text, record">
           <a-switch :checked="record.status==1?true:false" @change="onChange($event,record.pigcms_id)" />
        </span>
        <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
      </a-table>
    </a-card>
  </div>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    export default {
        name: 'getReplyList',
        data() {
            return {
                list:[],
                visible: false,
                confirmLoading: false,
                sortedInfo:null,
                pagination: { pageSize: 10, total:10 },
                search: { page: 1 },
                page: 1,
                build_id:'',
                checked:false,
                party_build_switch:false,
            };
        },
        // mounted(){
        //     this.getPartyBuildReply()
        // },
        computed:{
            columns() {
                let {
                    sortedInfo
                } = this;
                sortedInfo = sortedInfo || {};
                const columns = [
                    {
                        title: '评论内容',
                        dataIndex: 'content',
                        key: 'content',
                    },
                    {
                        title: '评论人',
                        dataIndex: 'nickname',
                        key: 'nickname',
                    },
                    {
                        title: '前台是否显示',
                        dataIndex: '',
                        key: 'status',
                        scopedSlots: {
                            customRender: 'status'
                        }
                    },
                    {
                        title: '回复时间',
                        dataIndex: 'add_time',
                        key: 'add_time',
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
        mounted(){
            this.build_id = this.$route.params.build_id;
            if(!this.build_id)
            {
                this.build_id = sessionStorage.getItem('lesson_build_id');
            }else{
                sessionStorage.setItem('lesson_build_id', this.build_id);
            }
            this.getPartyBuildReply();
        },
        methods: {
            callback(key) {
                console.log(key);
            },
            getPartyBuildReply() {
                this.search['page'] = this.page;
                this.search['build_id'] = this.build_id;
                this.request(streetCommunityApi.getPartyBuildReply, this.search)
                    .then((res) => {
                        if(res.list)
                        {
                            this.list = res.list;
                        }
                        if(res.party_build_switch == 1)
                        {
                            this.party_build_switch = true;
                        }else{
                            this.party_build_switch = false;
                        }
                        this.build_id = res.build_id;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                    })
            },
            tableChange(e) {
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.getPartyBuildReply()
                }
            },
            handleOks() {
                this.getPartyBuildReply();
            },
            cancel()
            {

            },
            //是否开启评论总开关
            openReplySwitch(checked)
            {
                let status = '';
                if(checked == true){
                    status = 1;
                    this.party_build_switch = true;
                }else{
                    status = 0;
                    this.party_build_switch = false;
                }
                this.request(streetCommunityApi.isSwitch,{'party_build_switch':status})
                    .then((res) => {
                        this.getPartyBuildReply()
                        this.$message.success('操作成功')
                    })
            },
            onChange(checked,id)
            {
                let status = '';
                if(checked == false)
                {
                    status = 3;
                }else{
                    status = 1;
                }
                this.actionReply(id,status);
            },
            actionRead(id)
            {
                this.request(streetCommunityApi.changeReplyStatus,{'pigcms_id':id,'is_read':1})
                    .then((res) => {
                        this.getPartyBuildReply()
                        this.$message.success('操作成功')
                    })
            },
            //1显示 2删除 3不显示
            actionReply(id,status=0)
            {
                this.request(streetCommunityApi.changeReplyStatus,{'pigcms_id':id,'status':status})
                    .then((res) => {
                        this.getPartyBuildReply()
                        this.$message.success('操作成功')
                    })
            }

        },
    };
</script>
<style>
  .table-operator{
    margin-bottom: 10px;
  }
</style>