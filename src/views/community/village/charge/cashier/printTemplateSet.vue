<template>
    <div class="message-suggestions-list-box">
        <a-collapse accordion>
            <a-collapse-panel key="1" header="操作说明">
                自定义设置打印模板，可解决在电脑上打印账单，同时也支持针式三联打印机！建议使用新版打印模板
            </a-collapse-panel>
        </a-collapse>
        <div class="search-box">
            <a-row type="flex">
                <a-col :span="4">
                    <a-input-group compact>
                        <p style="margin-top: 5px;">模板名称：</p>
                        <a-input style="width: 170px" v-model="search.keyword" placeholder="请输入模板名称"/>
                    </a-input-group>
                </a-col>
                <a-col :span="1" style="margin-right: 10px">
                    <a-button type="primary" @click="templateList(1)">
                        查询
                    </a-button>
                </a-col>
                <a-col :span="1">
                    <a-button @click="resetList()">重置</a-button>
                </a-col>
                <a-col :span="16" style="text-align: right;" v-if="oldPrintTemplateList">
                    <router-link :to="{ path: oldPrintTemplateList }">
                    <a-button type="normal">老版打印模板</a-button>
                    </router-link>
                </a-col>
            </a-row>
        </div>
        <div class="add-box">
            <a-row>
                <a-col :span="4" v-if="role_addtemp==1">
                    <a-button type="primary" @click="addTemplate()">
                        添加模板
                    </a-button>
                </a-col>
            </a-row>
        </div>

        <a-table
            :columns="columns"
            :data-source="data"
            class="components-table-demo-nested"
            :pagination="pagination"
            :row-key="record => record.template_id"
            @change='table_change'
            :loading="loading" >

            <span slot="set" slot-scope="text, record">
                <!-- <a @click="$refs.PrintTemplate.add(record.template_id)">设置模板</a> -->
                <a @click="gotoTem(record.template_id, record.title)"  v-if="role_tempset==1" >设置模板</a>
            </span>

            <span slot="action" slot-scope="text, record">
                <a @click="addTemplate(record.template_id)"  v-if="role_edittemp==1" >编辑</a>
                <a-popconfirm
                    class="ant-dropdown-link"
                    title="确认删除模板吗?"
                    ok-text="确认"
                    cancel-text="取消"
                    @confirm="delTemplate(record.template_id)"
                     v-if="role_deltemp==1"
                    >
                    <a> | 删除</a>
                </a-popconfirm>
            </span>

        </a-table>

        <!--             添加模板-->
        <a-modal :title="title" :width="1100" :visible="visible" v-if="visible" :maskClosable="false" @cancel="handleCancel" @ok="handleSubmit">
            <div style="display: inline-block;width: 40%">
                <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-form-model-item required label="模板标题">
                        <a-input v-model="form.title" />
                    </a-form-model-item>
                    <a-form-model-item required label="模板类型">
                        <a-select v-model="form.type" placeholder="请选择模板类型" @change="templateTypeChange">
                            <a-select-option :value="1">模板一</a-select-option>
                            <a-select-option :value="2">模板二</a-select-option>
                            <a-select-option :value="3">模板三</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    
                    <a-form-model-item label="备注内容" v-if="form.type==3" >
                        <a-input v-model="form.bak_content" placeholder="40个字以内"  :maxLength="40"/>
                    </a-form-model-item>
                    
                    <a-form-model-item label="打印标题">
                        <a-input v-model="form.top_title" />
                    </a-form-model-item>
                    <a-form-model-item required label="一行列数">
                        <a-select v-model="form.col_num" placeholder="请选择模板类型">
                            <a-select-option :value="3">3</a-select-option>
                            <a-select-option :value="4">4</a-select-option>
                            <a-select-option :value="5">5</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="说明">
                        <a-textarea
                            v-model="form.desc"
                            placeholder="模板说明"
                            :auto-size="{ minRows: 3, maxRows: 5 }"
                        />
                    </a-form-model-item>
                    
                    <a-form-item label="上传盖章图片" v-if="is_aihorse_customized"  extra="请上传背景透明的png图片">
                            <div>
                                <a-upload
                                    list-type="picture-card"
                                    name="reply_pic"
                                    :data="{ upload_dir: 'village/room'}"
                                    :multiple="false"
                                    :file-list="fileListLast"
                                    action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                                    :before-upload="beforeUploadImg"
                                    @change="handleUploadChange"
                                    @preview="handleUploadPreview"
                                   
                                >
                                    <div v-if="seal_img.length<1">
                                        <a-icon type="plus"/>
                                        <div class="ant-upload-text">
                                            选择图片
                                        </div>
                                    </div>
                                </a-upload>
                                <a-modal :visible="previewImgVisible" :footer="null" @cancel="handlePreviewCancel">
                                    <img alt="example" style="width: 100%" :src="previewImageUrl"/>
                                </a-modal>
                            </div>
                    </a-form-item> 
                    
                </a-form-model>
            </div>
            <div style="display: inline-block;width: 60%;vertical-align: top;">     
                <h3><span v-if="form.type==1">【模板一】</span><span v-else-if="form.type==2">【模板二】</span><span v-else-if="form.type==3">【模板三】</span>效果图：</h3>
                
                <p v-for="(item,index) in templateTypeArr" v-if="templateType === item.id" :key="index">
                    <img style="width: 100%" :src="item.url" />
                </p>
            </div>
        </a-modal>
        <printTemplate v-if="showTemplate" :templateName='templateName' :showTemplate="showTemplate" @closeThis="closeDialog" :tempateId="tempateId"/>
    </div>
</template>
<script>
    import villageApi from '@/api/community/village'
    import printTemplate from './printTemplate'

    const columns = [
        { title: '编号', dataIndex: 'template_id', key: 'template_id' },
        { title: '模板名称', dataIndex: 'title', key: 'title' },
        { title: '模板类型', dataIndex: 'type_txt', key: 'type_txt' },
        { title: '打印标题', dataIndex: 'top_title', key: 'top_title' },
        { title: '一行列数', dataIndex: 'col_num', key: 'col_num' },
        { title: '说明', dataIndex: 'desc', key: 'desc' },
        { title: '设置模板', dataIndex: 'set', key: 'set', scopedSlots: { customRender: 'set' } },
        { title: '操作', dataIndex: 'opera', key: 'opera', scopedSlots: { customRender: 'action' } }
    ]
    const data = []
    export default {
        name: 'printTemplateSet',
        data () {
            return {
                search: { keyword: '' },
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                pagination: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                data,
                columns,
                title: '添加',
                templateType: 1,
                templateId: 0,
                templateTypeArr: [],
                loading: false,
                form: {
                    title: '',
                    type: 1,
                    col_num: 3,
                    top_title: '',
                    desc: '',
                    bak_content:''
                },
                visible: false,
                showTemplate: false,
                tempateId: 0,
                templateName: '',
                oldPrintTemplateList: '',
                role_addtemp:0,
                role_deltemp:0,
                role_edittemp:0,
                role_tempset:0,
                is_aihorse_customized:0,
                previewImageUrl:'',
                seal_img:'',
                previewImgVisible:false,
                fileListLast:[],
            }
        },
        components: {
            printTemplate
        },
        mounted () {
            this.templateList()
        },
        methods: {
            gotoTem(id, name){
                this.tempateId = id*1
                this.templateName = name
                this.showTemplate = true
            },
            closeDialog(){
                this.showTemplate = false
            },
            // 列表
            templateList (t = 0) {
                this.loading = true
                this.imgloading=false;
                this.previewImgVisible=false;
                if (t === 1) {
                    this.$set(this.pagination, 'current', 1)
                }
                this.search['limit'] = this.pagination.pageSize
                this.search['page'] = this.pagination.current
                this.request(villageApi.templateList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.templateTypeArr = res.templateTypeArr
                        if (res.oldPrintTemplateList) {
                            this.oldPrintTemplateList = res.oldPrintTemplateList
                        } else {
                            this.oldPrintTemplateList = ''
                        }
                        
                        if(res.role_addtemp!=undefined){
                            this.role_addtemp=res.role_addtemp;
                            this.role_deltemp=res.role_deltemp;
                            this.role_edittemp=res.role_edittemp;
                            this.role_tempset=res.role_tempset;
                        }else{
                            this.role_addtemp=0;
                            this.role_deltemp=0;
                            this.role_edittemp=0;
                            this.role_tempset=0;
                        }
                        this.is_aihorse_customized=0;
                        if(res.is_aihorse_customized!=undefined){
                            this.is_aihorse_customized=res.is_aihorse_customized;
                        }
                        this.loading = false
                    })
            },

             handleUploadChange({fileList}) {
                    this.fileListLast=fileList;
                if (fileList.length > 0) {
                       let len = fileList.length - 1
                       let infoImg=fileList[len];
                       if (infoImg.status == 'done') {
                              this.seal_img = infoImg.response && infoImg.response.data ? infoImg.response.data:'';
                       }
                    }else{
                       this.seal_img='';
                   }
                   console.log('seal_img',this.seal_img)
                },
                beforeUploadImg(file) {
                  const isJpgOrPng = file.type === 'image/png';
                  if (!isJpgOrPng) {
                     this.$message.error('请上传PNG类型图片！');
                  }
                  return isJpgOrPng ;
                  /*
                  const isLt2M = file.size / 1024 / 1024 < 2;
                  if (!isLt2M) {
                    this.$message.error('Image must smaller than 2MB!');
                  }
                  return isJpgOrPng && isLt2M;
                  */
                  
                },
              handlePreviewCancel() {
                  this.previewImgVisible=false;
                  this.previewImageUrl='';
              },
             handleUploadPreview() {
                  this.previewImageUrl = this.seal_img;
                  this.previewImgVisible = true;
              },
            onTableChange(page,pageSize){
                this.page=page
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.templateList()
                console.log('onTableChange==>', page, pageSize)
            },
            // 表格中变动  这里只针对页面页数切换
            table_change (e) {
                console.log('e', e)
                if (e.current && e.current > 0) {
                    this.page = e.current
                    this.pagination.current = e.current
                    this.templateList()
                }
            },
            resetList () {
                this.search = { keyword: '' }
                this.templateList()
            },
            // 新增及编辑
            addTemplate (id = 0) {
                this.visible = true
                this.seal_img='';
                this.fileListLast=[];
                this.templateId = id
                this.title = '添加'
                // 编辑
                if (id > 0) {
                    this.title = '编辑'
                    let param = {
                        template_id: id
                    }
                    this.request(villageApi.getTemplateDetail, param)
                        .then((res) => {
                            this.form.title = res.data.title
                            this.form.type = res.data.type
                            this.templateType = res.data.type
                            this.form.col_num = res.data.col_num
                            this.form.top_title = res.data.top_title
                            this.form.desc = res.data.desc
                            if(res.data.bak_content!= undefined && res.data.bak_content){
                                this.form.bak_content = res.data.bak_content
                            }
                            if(res.data.seal_img){
                                this.seal_img=res.data.seal_img;
                                this.fileListLast.push({'uid':'seal_img000','name':'seal_img000','status':'done','url':this.seal_img});
                            }
                        })
                }
            },
            // 弹出层取消
            handleCancel () {
                this.visible = false
                this.templateId = 0
                this.templateType = 1
                this.form = {
                    title: '',
                    type: 1,
                    col_num: 3,
                    top_title: '',
                    desc: ''
                }
                this.fileListLast=[];
                this.seal_img='';
            },
            // 弹出层确认按钮
            handleSubmit () {
                this.form['template_id'] = this.templateId
                this.form.seal_img=this.seal_img;
                this.request(villageApi.templateAdd, this.form)
                    .then((res) => {
                        this.templateList(1)
                        this.$message.success('添加成功')
                        this.handleCancel()
                    })
            },
            // 切换模板类型 展示不同效果
            templateTypeChange (value) {
                this.templateType = value
            },
            // 删除模板
            delTemplate (id) {
                let param = {
                    template_id: id
                }
                this.request(villageApi.delTemplate, param)
                    .then((res) => {
                        this.templateList(1)
                        this.$message.success('删除成功')
                    })
            }
        }
    }
</script>
<style lang="less" scoped>
    .message-suggestions-list-box {
        margin: 30px 20px;
        background-color: white;
    }
    .message-suggestions-list-box .search-box {
        padding: 20px 20px 0;
    }
    .message-suggestions-list-box .add-box {
        padding: 20px 20px 0;
    }
    .message-suggestions-list-box .components-table-demo-nested {
        padding: 20px;
    }
    .message-suggestions-list-box .message_box {
        padding: 20px;
    }
    .lbsf{
        float: right;margin-right: 24px;
    }
    .padding-tp10{
      padding-top: 15px;
      padding-bottom: 15px;
    }
    /deep/.ant-col-4{
        width: 30%;
    }
</style>