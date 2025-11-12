<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <h3><a>寻人求助</a></h3>
        <a-divider style="margin-top: 10px;" />


        <a-input-search placeholder="请输入标题/内容/昵称/手机号" @search="onSearch" style="width: 280px" />

<a-tabs  :active-key="tabKey" @change="changeTab" style="margin-top: 20px;">
            
             <a-tab-pane v-for="pane in Tabpanes" :key="pane.key" :tab="pane.title">
                   
                    <a-table style="background: #ffffff;margin-top: 20px;" :columns="columns" rowKey="pigcms_id" :data-source="goodsList"
                        @change="changePage" :pagination="pagination">
                    
                    
                        <!-- 用户 -->
                        <span slot="user_name" slot-scope="text,item">
                             {{ item.user.nickname ? item.user.nickname : '' + '('+item.user.phone+')'}}
                        </span>  
                        
                        <!-- 是否解决 -->
                        <span slot="is_solve" slot-scope="text,item">
                            {{item.is_solve == 1 ? "已解决":"未解决"}}
                        </span>
                        
                        
                        <!-- 操作栏 -->
                        <span slot="action" slot-scope="text">
                            <a class="inline-block" style="margin-right: 10px" @click="$refs.helpNoticeDetailModel.showHelpNoticeDetail(text)">{{ L('查看详情') }}</a>
                            <a class="inline-block" style="margin-right: 10px" @click="delHelpNotice(text)">{{ L('删除') }}</a>
                            
                        </span>
                    
                    </a-table>
                   
                   
                   
            </a-tab-pane> 
        </a-tabs>
       

        

        <help-notice-detail @loadRefresh="getData" ref="helpNoticeDetailModel" />
    </div>
</template>

<script>
    import lifeToolsPlatformApi from "@/api/life_tools/platform";
    import helpNoticeDetail from "./modules/helpNoticeDetail.vue";

    const columns = []

    export default {
        components: {
            helpNoticeDetail
        },
        data() {
            return {
                Tabpanes:[
                    {
                        key: '0',
                        title: '全部'
                    },{
                        key: '1',
                        title: '已解决'
                    },{
                        key: '2',
                        title: '未解决'
                    },
                ],
                tabKey: "0",
                store_id: 0,
                queryParam: {
                    page: 1,
                    keywords: ''
                },
                goodsList: [],
                isAllCheck: false,
                pagination: {
                    pageSize: 10,
                    total: 0,
                    current: 1,
                    page: 1
                },
                columns: [
                    {
                        title: this.L('求助人姓名'),
                        dataIndex: 'name'
                    },
                    {
                        title: this.L('求助人电话'),
                        dataIndex: 'phone'
                    },
                    {
                        title: this.L('内容'),
                        dataIndex: 'cont'
                    },
                    {
                        title: this.L('用户'),
                        dataIndex: 'user.nickname',
                        key: 'user.nickname',
                        scopedSlots: {
                            customRender: 'user_name'
                        },
                    },
                    {
                        title: this.L('是否解决'),
                        dataIndex: 'is_solve',
                        key: 'is_solve',
                        scopedSlots: {
                            customRender: 'is_solve'
                        },
                    },
                    {
                        title: this.L('浏览量'),
                        dataIndex: 'view_count'
                    },
                    {
                        title: this.L('发布时间'),
                        dataIndex: 'create_time'
                    },
                    {
                        title: this.L('操作'),
                        dataIndex: 'pigcms_id',
                        key: 'pigcms_id',
                        scopedSlots: {
                            customRender: 'action'
                        },
                    }
                ],
            }
        },
        // watch: {
        //     $route() {
        //         console.log(this.$route.query.store_id, 'watch')
        //         if (this.$route.query.store_id) {
        //             this.store_id = this.$route.query.store_id
        //             this.getData()
        //         }
        //     },
        // },
        created() {
            // this.getData()
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData() {
                this.queryParam.page_size = this.pagination.pageSize
                this.queryParam.page = this.pagination.current;
                this.request(lifeToolsPlatformApi.getHelpNoticeList,this.queryParam).then((res)=>{
                    this.pagination.total = res.total
                    this.goodsList = res.data

                });
            },
            
            delHelpNotice(id) {

                this.$confirm({
                    title: '确定删除此内容?',
                    centered: true,
                    onOk: () => {

                        this.request(lifeToolsPlatformApi.delHelpNotice, { pigcms_id:id }).then((res) => {
                            this.$message.success('操作成功！')
                            this.getData() 


                        })
                    },
                    onCancel() {},
                })
            },
            //添加分类
            addBtn() {
                this.$router.push('/merchant/merchant.card/goodsSortEdit');
            },
            changePage(page, pageSize) {
                this.pagination.current = page.current;
                this.getData();
            },
            onSearch(val){
                this.queryParam.keywords = val;
                this.getData();
            },
            changeTab(key) {
                this.tabKey = key
                this.queryParam.is_solve = key
                this.getData();
            },
            // 改变开关状态
            switchChange(pigcms_id, status) {
                status = status ? 1 : 0 
                this.request(lifeToolsPlatformApi.changeHelpNoticeStatus, {
                    pigcms_id: pigcms_id,
                    is_solve: status
                }).then((res) => {
                    this.$message.success('操作成功！')
                    this.getData() 
                
                })
            },
        },
    }
</script>
