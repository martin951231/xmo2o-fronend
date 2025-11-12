<template>
    <a-drawer :title="xtitle" :width="1000" :visible="visibleMaterial" @close="handleMaterialCancel()">
        <div class="message-suggestions-list-box">
            <div class="search-box" style="padding-bottom: 20px;">
                <a-row>
                    <a-col :md="10" :sm="24" class="suggestions_col">
                        <label style="margin-top: 5px;">时间筛选：</label>
                        <a-range-picker @change="dateOnChange" :allowClear="true" style="width: 300px;">
                            <a-icon slot="suffixIcon" type="calendar" />
                        </a-range-picker>
                    </a-col>
                    <a-col :md="2" :sm="24" class="suggestions_col_btn">
                        <a-button type="primary" icon="search" @click="searchList()">
                            查询
                        </a-button>
                    </a-col>
                </a-row>
            </div>
            <a-row>
                <a-col style="margin-bottom: 18px;">
                    <a-button type="primary" @click="addTextReply()" style="margin-right: 20px;" v-if="xtype==1 && role_addmaterial==1"> 添加回复文字
                    </a-button>
                    <a-button type="primary" @click="addImgReply()" style="margin-right: 20px;" v-if="xtype==3 && role_addmaterial==1"> 添加回复图片
                    </a-button>
                    <a-button type="primary" @click="addAudioReply()" style="margin-right: 20px;" v-if="xtype==2 && role_addmaterial==1"> 添加回复音频
                    </a-button>
                    <a-button type="danger" @click="delMaterialMany()" v-if="role_delmaterial==1">批量删除</a-button>
                </a-col>
            </a-row>
            <a-table :columns="columns" :data-source="data" class="components-table-demo-nested"
                :pagination="pagination" @change='table_change' :loading="loading" :row-key="record => record.material_id"
                :row-selection="rowSelection">
                 <div slot="xcontentaction" slot-scope="text, record,index">
                    <div v-if="record.xtype==1">
                        {{record.xcontent}}
                    </div>
                    <div v-else-if="record.xtype==2" >
                        <a :href="record.audio_url" target="_blank">{{record.audio_url}}</a>
                    </div>
                    <div v-else-if="record.xtype==3" class="previewimg">
                        <img v-for="(item,index) in record.word_imgs" :src="item" style="height:80px;margin-right: 10px;" preview="1">
                    </div>
                 </div>
                
                <span slot="action" slot-scope="text, record,index">
                    <a @click="editMaterial(record)" v-if="role_editmaterial==1"> 编辑 </a>
                    <a-divider type="vertical" v-if="role_delmaterial==1 && role_editmaterial==1" />
                    <a-popconfirm title="您确定将此条分类数据删除吗？" ok-text="确定" cancel-text="取消" @confirm="delMaterial(record,0)" v-if="role_delmaterial==1" >
                        <a href="#"> 删 除 </a>
                    </a-popconfirm>
                </span>
            </a-table>
        </div>
        
        <a-drawer :title="xaddtitle" :width="800" :visible="visibleAddMaterial" @close="handleAddMaterialCancel()">
                <div class="addMaterial">
                     <div v-if="xtype===1 || xtype==='1'">
                         <a-form-item label="回复内容" extra="回复的内容文字不能超过120个" required>
                             <a-textarea v-model.trim="xcontent" :max-length="120" style="width: 360px;height: 160px;"  @change="onTextAreaChange"/>
                             <span style="margin-left: 10px;">已输入 {{xcontent.length}} 个字</span>
                        </a-form-item>
            
                     </div>
                     
                    <div v-if="xtype===2 || xtype==='2'">
                        
                        <a-form-item label="音频名称" extra="音频名称30个字以内" >
                             <a-input v-model.trim="xname" :max-length="30" style="width: 310px;" placeholder="30个字以内"/>
                        </a-form-item>
                            <a-form-item label="回复音频" extra="上传的音频不能超过2M,只支持mp3格式" required >
                                  <a-upload
                                    name="file"
                                    action="/v20/public/index.php/community/village_api.ContentEngine/uploadVideo?pathname=soundAudio"
                                    class="file-upload"
                                    :multiple="audioMultiple"
                                    :file-list=fileAudioList
                                    @change="audioUploadChange" 
                                    :before-upload="audioBeforeUpload"
                                  >
                                    <a-button> <a-icon type="upload" />上传文件 </a-button>
                                  </a-upload>
                            </a-form-item>
                    </div> 
                    
                 <div v-if="xtype===3 || xtype==='3'">
                     <a-form-item label="回复图片" required class="uploadFile" >
                         <a-upload
                             action="/v20/public/index.php/community/village_api.ContentEngine/uploadFile?pathname=hotword" list-type="picture-card" accept=".png,.jpg"
                             :file-list="fileList"  @preview="handlePreview" @change="handleUploadChange" :before-upload="beforeUpload" :multiple="true">
                             <div v-if="fileList.length < 3">
                                 <a-icon type="plus" />
                                 <div class="ant-upload-text">
                                     上传图片
                                 </div>
                             </div>
                         </a-upload>
                         
                         <div class="desc" style="transform: translateY(-18px);">
                             已上传{{fileList.length}}张, 最多上传3张图片，上传的图片不能超过2M，只支持jpg,png,jpeg,gif
                         </div>
                         
                         <a-modal :visible="previewVisible" :footer="null" @cancel="handlePreviewCancel">
                             <img alt="example" style="width: 100%" :src="previewImage" />
                         </a-modal>
                    </a-form-item>
                 </div> 
                   <div :style="{
                         position: 'absolute',
                         right: 0,
                         bottom: 0,
                         width: '100%',
                         borderTop: '1px solid #e9e9e9',
                         padding: '30px',
                         background: '#fff',
                         textAlign: 'center',
                         zIndex: 1,
                         height: '180px'
                       }">
                       <a-button :style="{ marginRight: '90px' }" @click="handleAddMaterialCancel()">取消</a-button>
                       <a-button @click="handleMaterialSubmit()" type="primary">提交</a-button>
                   </div>
            </div>
        </a-drawer>
    </a-drawer>
</template>

<script>
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    import villageApi from '@/api/community/village'
    import materialPage from './materialList.vue';
    import {
        Collapse
    } from 'ant-design-vue';
    
    const columns =[{
                        title: '回复内容',
                        dataIndex: 'xcontent',
                        key: 'xcontent',
                        width: 450,
                        scopedSlots: {
                            customRender: 'xcontentaction'
                        }
                    },
                    {
                        title: '更新时间',
                        dataIndex: 'update_time_str',
                        key: 'update_time_str',
                        align: 'center',
                        width: 200,
                    },
                    {
                        title: '操作',
                        dataIndex: '',
                        key: '',
                        align: 'center',
                         width: 200,
                        scopedSlots: {
                            customRender: 'action'
                        }
                    },
                ];
    const data = [];
    export default {
        name: 'hotWordManageMaterial',
        filters: {

        },

        components: {
            'a-collapse': Collapse,
            'a-collapse-panel': Collapse.Panel,
        },
        data() {
            return {
                labelCol: {
                    xs: {
                        span: 10
                    },
                    sm: {
                        span: 3
                    }
                },
                pagination: {
                    pageSize: 10,
                    total: 10,
                    current: 1
                },
                search: {
                    keyword: '',
                    date:''
                },
                form: this.$form.createForm(this),
                loading: false,
                data,
                columns: columns,
                page: 1,
                confirmLoading: false,
                visibleMaterial: false,
                xcategory: {
                    'categoryname': '',
                    'cate_id': 0,
                    'xtype': 0,
                    'village_id': 0
                },
                xtype: 0,
                xtitle: '',
                selectedRowKeys: [],
                xaddtitle: '',
                visibleAddMaterial:false,
                fileList: [],
                fileAudioList:[],
                previewVisible:false,
                previewImage:'',
                word_imgs:[],
                audio_url:[],
                xcontent:'',
                xname:'',
                material_id:0,
                audioMultiple:true,
                role_addmaterial:0,
                role_editmaterial:0,
                role_delmaterial:0,
            };
        },
        activated() {

        },
        computed: {
            rowSelection() {
                return {
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log('selectedRowKeys', selectedRowKeys);
                        this.selectedRowKeys = selectedRowKeys;
                    },
                    onSelect: (record, selected, selectedRows, nativeEvent) => {
                        //console.log('record,',record,'selected',selected);
                    },
                }
            }
        },
        methods: {
            // 获取列表信息
            xList(xcategory,xtype) {
                this.xcategory = xcategory;
                this.xtype = xtype * 1;
                if (this.xtype == 1) {
                    this.xtitle = '回复文字【' + this.xcategory.categoryname + '】管理';
                } else if (this.xtype == 2) {
                    this.xtitle = '回复音频【' + this.xcategory.categoryname + '】管理';
                    this.columns=[
                        {
                            title: '音频标题',
                            dataIndex: 'xname',
                            key: 'xname',
                            width: 150,
                        },{
                        title: '回复内容',
                        dataIndex: 'xcontent',
                        key: 'xcontent',
                        width: 400,
                        scopedSlots: {
                            customRender: 'xcontentaction'
                        }
                    },
                    {
                        title: '更新时间',
                        dataIndex: 'update_time_str',
                        key: 'update_time_str',
                        align: 'center',
                        width: 200,
                    },
                    {
                        title: '操作',
                        dataIndex: '',
                        key: '',
                        align: 'center',
                         width: 200,
                        scopedSlots: {
                            customRender: 'action'
                        }
                    },
                ];
                } else if (this.xtype == 3) {
                    this.xtitle = '回复图片【' + this.xcategory.categoryname + '】管理';
                }
                this.getList();
                this.visibleMaterial = true;
            },
            handleMaterialCancel() {
                this.visibleMaterial = false;
            },
            getList() {
                this.loading = true;
                this.search.page = this.page;
                this.search.xtype = this.xtype;
                this.search.cate_id=this.xcategory.cate_id;
                this.request(villageApi.getHouseHotWordMaterialLists, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list;
                        this.role_addmaterial= res.role_addmaterial;
                        this.role_editmaterial= res.role_editmaterial;
                        this.role_delmaterial= res.role_delmaterial;
                        this.loading = false
                    })
            },
            bindOk() {
                this.getList();
            },
            delMaterial(record) {
                let postArr = {
                    material_ids: record.material_id,
                    village_id: record.village_id,
                    xtype: this.xtype
                };
                postArr.cate_id=this.xcategory.cate_id;
                this.request(villageApi.deleteHouseHotWordMaterialContent, postArr)
                    .then((res) => {
                        this.$message.success('删除成功')
                        setTimeout(() => {
                            this.confirmLoading = false
                            this.getList();
                        }, 1000)
                    })
            },
            delMaterialMany() {
                if (this.selectedRowKeys.length < 1) {
                    this.$message.error('请至少选择一项要删除的数据！')
                    return false;
                }
                console.log('material_ids', this.selectedRowKeys);
                let _this = this;
                let postArr = {
                    material_ids: this.selectedRowKeys.join(','),
                    xtype: this.xtype
                };
                postArr.cate_id=this.xcategory.cate_id;
                this.$confirm({
                    title: '确认删除',
                    content: '您确认要删除您选中的这些数据吗',
                    onOk() {
                        _this.request(villageApi.deleteHouseHotWordMaterialContent, postArr)
                            .then((res) => {
                                _this.$message.success('删除成功')
                                setTimeout(() => {
                                    _this.confirmLoading = false
                                    _this.getList()
                                }, 1000)
                            })
                    },
                    onCancel() {},
                });
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                console.log('e', e)
                if (e.current && e.current > 0) {
                    this.pagination.current = e.current;
                    this.page = e.current;
                    this.getList()
                }
            },
            // 日期切换，重新赋值
            dateOnChange(date, dateString) {
                this.search.date = dateString;
                console.log('search', this.search);
            },
            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.page = 1;
                let val = {
                    current: 1,
                    pageSize: 10,
                    total: 10
                }
                console.log('searchList')
                this.table_change(val)
            },
            // 进行重置
            resetList() {
                this.search = {
                    keyword: '',
                    page: 1
                };
                this.page = 1;
                this.getList()
            },
            handleMaterialSubmit() {
                let postArr = {};
                postArr.xtype=this.xtype;
                if (this.xtype == 1) {
                    /**文本**/
                    this.xname='';
                    if(this.xcontent.length<1){
                        this.$message.error('请填写回复内容！')
                        return false;
                    }
                    
                }else if(this.xtype == 2){
                    /**音频**/
                    if(!this.audio_url || this.audio_url.length<1){
                        this.$message.error('请上传回复音频文件！')
                        return false;
                    }
                }else if(this.xtype == 3){
                    /**图片**/
                    this.xname='';
                    if(!this.word_imgs || this.word_imgs.length<1){
                        this.$message.error('请上传回复图片文件！')
                        return false;
                    }
                }
                postArr.cate_id=this.xcategory.cate_id;
                postArr.material_id=this.material_id;
                postArr.xcontent=this.xcontent;
                postArr.xname=this.xname;
                postArr.word_imgs=this.word_imgs;
                postArr.audio_url=this.audio_url;
                this.confirmLoading = true;
                this.request(villageApi.saveHouseHotWordMaterialSetData, postArr).then((res) => {
                    this.confirmLoading = false;
                    if (this.material_id > 0) {
                        this.$message.success('编辑成功！')
                    } else {
                        this.$message.success('添加成功！')
                    }
                    this.handleAddMaterialCancel();
                    this.getList();
                })
            },
            
            editMaterial(record){
                this.material_id=record.material_id;
                this.xname='';
                if (this.xtype == 1) {
                    this.xcontent=record.xcontent;
                    this.xaddtitle='编辑回复文字';
                }else if(this.xtype == 2){
                    this.audioMultiple=false;
                    this.audio_url=record.audio_url;
                    this.xname=record.xname;
                    this.fileAudioList.push({uid:'audio'+record.material_id,url:this.audio_url,status:'done',name:this.audio_url});
                    this.xaddtitle='编辑回复音频';
                }else if(this.xtype == 3){
                    this.word_imgs=record.word_imgs;
                    record.word_imgs.map((img,idex)=>{
                         this.fileList.push({uid:'img'+idex,url:img,status:'done',name:'img'+idex});
                    })
                    this.xaddtitle='编辑回复图片';
                }
                this.visibleAddMaterial = true;
            },
            addTextReply() {
                this.xaddtitle='添加回复文字';
                this.visibleAddMaterial = true;
            },
            addImgReply() {
                this.xaddtitle='添加回复图片';
                this.visibleAddMaterial = true;
            },
            addAudioReply() {
                this.audioMultiple=true;
                this.xaddtitle='添加回复音频';
                this.visibleAddMaterial = true;
            },
            handleAddMaterialCancel(){
                this.xcontent='';
                this.xname='';
                this.word_imgs=[];
                this.audio_url=[];
                this.fileList= [];
                this.material_id=0;
                this.fileAudioList=[];
                this.previewVisible=false;
                this.previewImage='';
                this.visibleAddMaterial=false;
                this.audioMultiple=true;
            },
            onTextAreaChange(e){
                //console.log('textArea',e);
            },
            async handlePreview(file) {
                console.log('handlePreview',file);
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                if(file.response && file.response.data && file.response.data.url){
                    this.previewImage = file.response.data.url
                }else if(file.url){
                    this.previewImage = file.url;
                }else{
                    this.previewImage =file.preview;
                }
                this.previewVisible = true;
            },
            handleUploadChange({  fileList }) {
                console.log('fileList',fileList);
                let that = this
                that.fileList = fileList.slice(0, 3)
                that.word_imgs = []
                that.fileList.map(v=>{
                    if(v.response && v.response.data && v.response.data.url){
                        that.word_imgs.push(v.response.data.url)
                    }else if(v.url !=undefined && v.url){
                        that.word_imgs.push(v.url)
                    }
                })
            },
            audioUploadChange(fileinfo){
                console.log('fileinfo',fileinfo);
                this.fileAudioList=fileinfo.fileList
                this.audio_url= [];
                if(this.material_id>0 ){
                   this.fileAudioList.map((v,idx)=>{
                       if(v.response && v.response.data && v.response.data.url){
                           this.fileAudioList=[];
                           v.url=v.response.data.url;
                           this.fileAudioList.push(v);
                           this.audio_url.push({url:v.response.data.url,filename:v.name});
                           return ;
                       }
                   })
                }else{
                    this.fileAudioList.map((v,idx)=>{
                        if(v.response && v.response.data && v.response.data.url){
                            this.fileAudioList[idx].url=v.response.data.url;
                            this.audio_url.push({url:v.response.data.url,filename:v.name})
                        }else if(v.url !=undefined && v.url){
                            this.audio_url.push({url:v.url,filename:''})
                        }
                    })
                }
                console.log('fileAudioList',this.fileAudioList);
            },
            beforeUpload(file,fileList) {
                const isJpgOrPng = file.type === 'image/jpeg' ||file.type === 'image/jpg'|| file.type === 'image/png'|| file.type === 'image/gif';
                if (!isJpgOrPng) {
                    this.$message.error('You can only upload JPG file!');
                    return false;
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('Image must smaller than 2MB!');
                    return false;
                }
                return isJpgOrPng && isLt2M;
            },
            audioBeforeUpload(file){
                console.log('mfile',file);
                let ismp3 = false;
                if(file.type == 'audio/mpeg' || file.type == 'audio/x-mpeg' || file.type == 'audio/mp3'|| file.type == 'audio/x-mpeg-3' || file.type == 'audio/mpg' || file.type=="audio/x-mp3"|| file.type=="audio/mpeg3"|| file.type=="audio/x-mpeg3" ||file.type=="audio/x-mpg"||file.type=="audio/x-mpegaudio"){
                    ismp3=true;
                }
                if (!ismp3) {
                    this.$message.error('请上传mp3格式的音频文件!');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('音频文件大小不要超过 2MB!');
                }
                return ismp3 && isLt2M;
            },
            handlePreviewCancel() {
                this.previewVisible = false;
            },
        }
    };
</script>

<style lang="less" scoped>
    /deep/ .ant-form-item-control-wrapper {
        display: inline-block;
    }
    /deep/ .addMaterial .ant-form-item-label {
        vertical-align: top;
    }
    /deep/ .ant-upload-list-text{width: 650px;}
    .previewimg img{cursor: pointer;}
</style>
