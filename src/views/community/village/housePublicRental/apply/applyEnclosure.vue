<template>
    <a-modal :title="title" :width="1200" :footer="null" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"  @cancel="handleCancel">
        <span>
            <input  type="file" name="file" ref="tempUploadFile" v-on:change="uploadPic" style="display: none;"/>
            <a-button
                    type="primary"
                    style="margin-bottom: 5px"
                    @click="clickUpload()"
                    title="请选择需要上传的文件，大小不超过50M"
            >上传附件</a-button>
            <a v-if="uploadFileName" style="color: red;margin: 0 10px;">当前【{{uploadFileName}}】上传中</a>
            <a style="margin-left: 10px">类型支持：EXCEL、PDF、WORD、图片</a>
        </span>
        <a-table
                :columns="columns"
                :data-source="data"
                class="components-table-demo-nested"
                :pagination="pagination"
                @change='table_change'
                :loading="loading"
        >
            <span slot="see" slot-scope="text, record">
                <a v-if="record.file_url" @click="lookImg(record.file_url)">
                    <a v-if="record.is_image">查看图片</a>
                    <a v-else>下载文件</a>
                </a>
                <a v-else>--</a>
            </span>
            <span slot="desc" slot-scope="text, record">
                 <a-popconfirm
                         class="ant-dropdown-link"
                         title="确认删除?(操作后可能不能恢复！)"
                         ok-text="是"
                         cancel-text="否"
                         @confirm="deleteConfirm(record.file_id)"
                 ><a href="#">删除</a></a-popconfirm>
            </span>
        </a-table>
    </a-modal>
</template>
<style>

</style>
<script>
    import villageApi from '@/api/community/village'
    const columns = [
        { title: '文件名称',  dataIndex: 'file_remark', key: 'file_remark'},
        { title: '上传人', dataIndex: 'account', key: 'account' },
        { title: '查看', dataIndex: 'see', key: 'see',scopedSlots: { customRender:'see'}},
        { title: '上传时间', dataIndex: 'add_time', key: 'add_time',},
        { title: '操作', dataIndex: 'desc', key: 'desc',scopedSlots: { customRender:'desc'}},
    ];
    const data = [];
    export default {
        name: 'balanceList',
        filters: {

        },
        components:{
        },
        data() {
            return {
                reply_content: '',
                pagination: {current:1,  pageSize: 10, total:10 ,showTotal: total => `共 ${total} 条`},
                search: { uid:'',keyword: '', page: 1 },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                title:'',
                confirmLoading:false,
                uploadVisible:false,
                uploadFileName:false
            };
        },
        methods: {

            //附件列表
            getList(title='',template_id=0,value_id=0){
                if(title !=''){
                    this.title=title;
                    this.$set(this.pagination, 'current', 1)
                }
                if(template_id > 0){
                    this.search['template_id']=template_id;
                }
                if(value_id > 0){
                    this.search['value_id']=value_id;
                }
                this.uploadFileName=false;
                this.loading = true;
                this.search['page'] = this.pagination.current;
                this.request(villageApi.publicRentalEnclosureList, this.search).then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.loading = false;
                        this.confirmLoading=true;
                        this.visible=true;
                    })
            },
            //查看图片
            lookImg(url) {
                window.open(url, '_blank');
            },
            //删除
            deleteConfirm(id){
                this.request(villageApi.publicRentalEnclosureDel,{'id':id}).then((res) => {
                        this.getList();
                        this.$message.success('删除成功')
                    })
            },
            handleCancel() {
                this.visible = false;
                setTimeout(() => {
                    this.id = '0';
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            cancel() {},
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                let _this=this;
                console.log('e', e)
                if (e.current && e.current>0) {
                    _this.pagination.current = e.current;
                    _this.getList()
                }
            },
            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
            },
            // 进行重置
            resetList() {
                this.search.keyword='';
                this.search.page=1;
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
            },


            uploadPic(e) {
                let inputFile = e.target;
                this.uploadFileName=false;
                if (!inputFile.files || inputFile.files.length <= 0) {
                    return;
                }
                let file_msg = inputFile.files[0];
                let formData = new FormData();
                let data=this.search;
                let file_name='';
                formData.append('file', file_msg);
                this.loading = true;
                this.request(villageApi.publicRentalUpload,formData).then((res) => {
                    if(res){
                        this.uploadFileName=res.file.name;
                        file_name=res.file.name;
                        data['file']=res;
                        this.request(villageApi.publicRentalAddFile,data).then((res) => {
                            this.loading = false;
                            this.getList();
                            this.$message.success('【'+file_name+'】上传成功')
                        }).catch((error) => {
                            this.loading = false
                        })
                    }
                }).catch((error) => {
                    this.loading = false
                })
            },

            //上传文件
            clickUpload(){
                this.$refs.tempUploadFile.click();
            }
        }
    };
</script>