<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-card :bordered="false">
      <div class="search-box" style="margin-bottom: 10px;">
        是否开启评论审核：<a-switch :checked="lessons_meeting_witch" @change="openReplySwitch($event)" />
      </div>
      <a-table :columns="columns" :data-source="list"
               :pagination="pagination"
               @change="tableChange" >
        <span slot="action" slot-scope="text, record">
          <a v-show="!record.is_read" @click="actionReply(record.pigcms_id,2)">已读</a>
          <a-divider type="vertical"  v-show="!record.is_read"/>
            <a-popconfirm
              class="ant-dropdown-link"
              title="确认删除?"
              ok-text="是"
              cancel-text="否"
              @confirm="actionReply(record.pigcms_id,1)"
              @cancel="cancel"
            >
              <a href="#">删除</a>
            </a-popconfirm>
        </span>
        <span slot="status" slot-scope="text, record">
           <a-switch :checked="record.status==1?true:false" @change="onChange($event,record.pigcms_id,3)" />
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
                meeting_id:'',
                checked:false,
                lessons_meeting_witch:false,
            };
        },
        mounted(){
            this.meeting_id = this.$route.params.build_id;
            if(!this.meeting_id)
            {
                this.meeting_id = sessionStorage.getItem('lesson_meeting_id');
            }else{
                sessionStorage.setItem('lesson_meeting_id', this.meeting_id);
            }
            console.log('idddddd',this.$route.params);
            console.log('lesson_meeting_id',this.meeting_id);
            this.getMeetingReply();
        },
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
        methods: {
            callback(key) {
                console.log(key);
            },
            getMeetingReply() {
                this.search['page'] = this.page;

                this.search['meeting_id'] = this.meeting_id;
                this.request(streetCommunityApi.getReplyList, this.search)
                    .then((res) => {
                        console.log('res', res);
                        if(res.list)
                        {
                            this.list = res.list;
                        }
                        console.log(res.info.lessons_meeting_witch);
                        if(res.info.lessons_meeting_witch == 2)
                        {
                            this.lessons_meeting_witch = true;
                        }else{
                            this.lessons_meeting_witch = false;
                        }
                        this.meeting_id = res.meeting_id;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                    })
            },
            tableChange(e) {
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.getMeetingReply()
                }
            },
            handleOks() {
                this.getMeetingReply();
            },
            cancel()
            {

            },
            //是否开启评论总开关
            openReplySwitch(checked)
            {
                let status = '';
                if(checked == true){
                    status = 2;
                    this.lessons_meeting_witch = true;
                }else{
                    status = 1;
                    this.lessons_meeting_witch = false;
                }
                this.request(streetCommunityApi.openReplySwitch,{'status':status})
                    .then((res) => {
                        this.getMeetingReply()
                        this.$message.success('操作成功')
                    })
            },
            onChange(checked,id,type)
            {
                let status = '';
                if(checked == false)
                {
                    status = 2;
                }else{
                    status = 1;
                }
                this.actionReply(id,type,status);
            },
            //1删除 2已读 3前端是否显示
            actionReply(id,type,status=0)
            {
                this.request(streetCommunityApi.actionReply,{'id':id,'type':type,'status':status})
                    .then((res) => {
                        this.getMeetingReply()
                        if(type == 1)
                        {
                            this.$message.success('删除成功')
                        }else
                        {
                            this.$message.success('操作成功')
                        }

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