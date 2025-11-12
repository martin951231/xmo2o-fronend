<template>
    <a-drawer :title="xtitle" :width="900" :visible="showvisible" @close="handleSubCancel()">
        <a-form :form="form">
            <div style="margin-top: 20px;margin-left: 50px;" class="editword" required>
                <a-form-item label="关键词名称" >
                    <a-input placeholder="请输入关键词名称(30字以内)" v-model.trim="postdata.wordname" style="width: 300px" :max-length="30" />
                </a-form-item>
                <a-form-item label="关键词类型" required >
                    <a-select style="width: 300px;" v-model="postdata.xtype" placeholder="请选择关键类型" @change="xtypeChange">
                        <a-select-option v-for="item in hotWordType" :value="item.xtype" >
                          {{ item.xtitle }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                
                 <div v-if="postdata.xtype*1>0">
                    <a-form-item label="类型" required >
                        <a-radio-group v-model="postdata.comfrom" style="margin-left: 10px;">
                            <a-radio :value="1">素材库</a-radio>
                            <a-radio :value="0">新增</a-radio>
                        </a-radio-group>
                    </a-form-item>
                </div>
                
                <div v-if="postdata.xtype===0 || postdata.xtype==='0'">
                    <a-form-item label="链接" required>
                        <div style="margin-left: 27px;" v-for="(item, index) in wordurllist" :key="index">
                            <div>
                                <a-input placeholder="请选择链接" v-model.trim="wordurllist[index].jumpurl" style="width: 300px"/>
                                <a-button  @click="$refs.funcModal.FunctionLibrary(index,'HouseHotWordManage')"> 功能库选择 </a-button>

                                <a-button v-if="index>0" @click="duration_reduce(index)" style="margin-left: 20px;"> 删除
                                </a-button>
                            </div>
                            <div>
                                <a-input placeholder="请填写显示名称(6字以内)" v-model.trim="wordurllist[index].showtitle"
                                    style="width: 300px" :max-length="6" /> <span v-if="index==0"> &nbsp;最多可添加10个</span>
                            </div>
                        </div>
                        <div style="text-align: center;margin-top: 15px;margin-bottom: 150px;">
                            <a-button @click="duration_add" v-if="show_add_button"> 添加 </a-button>
                        </div>
                    </a-form-item>
                 </div>
                 
                 <div v-if="postdata.xtype*1>0 && postdata.comfrom*1==0">
                     <div v-if="postdata.xtype===1 || postdata.xtype==='1'">
                         <a-form-item label="回复内容" extra="回复的内容文字不能超过120个" required>
                             <a-textarea v-model.trim="postdata.xcontent" :max-length="120" style="width: 360px;height: 160px;"  @change="onTextAreaChange"/>
                             <span style="margin-left: 10px;">已输入 {{postdata.xcontent.length}} 个字</span>
                        </a-form-item>

                     </div>
                     
                    <div v-if="postdata.xtype===2 || postdata.xtype==='2'">
                        <a-form-item label="音频名称" extra="音频名称30个字以内" >
                             <a-input v-model.trim="postdata.xname" :max-length="30" style="width: 310px;" placeholder="30个字以内"/>
                        </a-form-item>
                            <a-form-item label="回复音频" extra="上传的音频不能超过2M,只支持mp3格式" required >
                                  <a-upload
                                    name="file"
                                    action="/v20/public/index.php/community/village_api.ContentEngine/uploadVideo?pathname=soundAudio"
                                    class="file-upload"
                                    :multiple="false"
                                    :file-list=fileAudioList
                                    @change="audioUploadChange" 
                                    :before-upload="audioBeforeUpload"
                                  >
                                    <a-button> <a-icon type="upload" />上传文件 </a-button>
                                  </a-upload>
                            </a-form-item>
                    </div> 
                    
                 <div v-if="postdata.xtype===3 || postdata.xtype==='3'">
                     <a-form-item label="回复图片" required class="uploadFile">
                         <a-upload
                             action="/v20/public/index.php/community/village_api.ContentEngine/uploadFile?pathname=hotword" list-type="picture-card"
                             :file-list="fileList"  @preview="handlePreview" @change="handleUploadChange" :before-upload="beforeUpload">
                             <div v-if="fileList.length < 3">
                                 <a-icon type="plus" />
                                 <div class="ant-upload-text">
                                     上传图片
                                 </div>
                             </div>
                         </a-upload>
                         
                         <div class="desc" style="transform: translateY(-18px);">
                             已上传{{fileList.length}}张, 最多上传3张图片，上传的图片不能超过2M,只支持jpg,png,jpeg,gif
                         </div>
                         
                         <a-modal :visible="previewVisible" :footer="null" @cancel="handlePreviewCancel">
                             <img alt="example" style="width: 100%" :src="previewImage" />
                         </a-modal>
                    </a-form-item>
                 </div> 
            </div>
                <div v-else-if="postdata.xtype*1>0" >
                    <a-button  style="margin-left: 60px;" @click="$refs.materialModal.materialLibrary(postdata.xtype,0,'hotWordMaterialLibrary')"> 从素材库选择 </a-button>
                    <div v-if="material_type=='material_content'" style="margin-top: 20px;" >
                        <a-form-item label="选中的素材内容" >
                        <div v-if="is_del_material_info" style="width: 650px;display: inline-block;">
                              <span style="color: red;">所选素材内容数据已被删除，请重新选择！</span>
                        </div>  
                        <div v-else-if="material_info.xtype==1" style="width: 650px;display: inline-block;">
                            {{material_info.xcontent}}
                        </div>
                        <div v-else-if="material_info.xtype==2" style="width: 650px;display: inline-block;word-break: break-all;">
                             <div style="font-size: 16px;font-weight: bold;">{{material_info.xname}}</div>
                            <a :href="material_info.audio_url" target="_blank">{{material_info.audio_url}}</a>
                        </div>
                        <div v-else-if="material_info.xtype==3" class="previewimg">
                            <img v-for="(item,index) in material_info.word_imgs" :src="item" style="height:80px;margin-right: 10px;" preview="1">
                        </div>
                        </a-form-item>
                    </div>
                    <div v-else-if="material_type=='material_category'"  style="margin-top: 20px;" >
                         <a-form-item label="选中的素材分类" >
                             <div v-if="is_del_material_info" style="width: 600px;display: inline-block;">
                                   <span style="color: red;">所选素材分类数据已被删除，请重新选择！</span>
                             </div>
                             <div v-else-if="categoryname" style="width: 600px;display: inline-block;">
                                <span>{{categoryname}}</span>
                            </div>
                        </a-form-item>
                     </div>
                </div>
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
                <a-button :style="{ marginRight: '90px' }" @click="handleSubCancel()">取消</a-button>
                <a-button @click="handleSubmit()" type="primary">提交</a-button>
            </div>
        </a-form>
    <function-library :height='800' :width="1200" ref="funcModal" @ok="handleOk"/>
    
    <material-library :height='800' :width="1200" ref="materialModal" @ok="handleMaterialOk"/>
    
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
    import villageApi from '@/api/community/village';
    import FunctionLibrary from '../framework/FunctionLibrary.vue';
    import materialLibrary from './components/materialLibrary.vue';
    export default {
        name: 'hotWordManageEditword',
        components:{
            FunctionLibrary,
            materialLibrary,
        },
        data() {
            return {
                confirmLoading: false,
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 14
                },
                form: this.$form.createForm(this),
                xtitle: '新建关键词',
                word_id: 0,
                showvisible: false,
                postdata: {wordname:'',xtype:"0",comfrom:0,xcontent:'',xname:''},
                wordurllist: [{
                    showtitle: '',
                    jumpurl: ''
                }],
                rule_first: [],
                rule_last: [],
                show_add_button:false,
                hotWordType:[{xtype:"0",xtitle:"功能链接"},{xtype:"1",xtitle:"文字回复"},{xtype:"2",xtitle:"音频回复"},{xtype:"3",xtitle:"图片回复"}],
                fileList: [],
                fileAudioList:[],
                previewVisible:false,
                previewImage:'',
                word_imgs:[],
                audio_url:'',
                material_id:0,
                cate_id:0,
                categoryname:'',
                material_info:{},
                material_type:'',
                is_del_material_info:false,
            }
        },

        methods: {

            editword(word_id) {
                this.word_id=0;
                this.is_del_material_info=false;
                if (word_id && word_id > 0) {
                    this.word_id = word_id;
                    this.xtitle = '编辑查看';
                    this.getOneHotWord();
                }else{
                    this.postdata= {wordname:'',xtype:"0",comfrom:0,xcontent:'',xname:''};
                    this.wordurllist= [{
                        showtitle: '',
                        jumpurl: ''
                    }];
                    this.showvisible = true;
                    if(this.wordurllist.length<10){
                        this.show_add_button=true;
                    }
                }
            },
            getOneHotWord(){
                let postArr={word_id:this.word_id};
                this.request(villageApi.getOneHouseHotWord, postArr)
                    .then((res) => {
                            this.postdata.wordname=res.hotword.wordname;
                            this.postdata.xtype=res.hotword.xtype;
                            this.postdata.comfrom=res.hotword.comfrom;
                            this.postdata.xcontent=res.hotword.xcontent;
                            this.postdata.xname=res.hotword.showtitle;
                            if(res.wordurllist.length>0){
                                this.wordurllist=res.wordurllist;
                            }
                            this.showvisible = true;
                            if(this.wordurllist.length<10){
                                this.show_add_button=true;
                            }
                            if((this.postdata.xtype==2||this.postdata.xtype=='2') && res.hotword.audio_url){
                                this.audio_url=res.hotword.audio_url;
                                this.fileAudioList.push({uid:'audio'+res.hotword.id,url:this.audio_url,status:'done',name:this.audio_url});
                            }
                            if(res.hotword.comfrom>0){
                                this.material_id=res.hotword.material_id;
                                this.cate_id=res.hotword.cate_id;
                                this.categoryname=res.hotword.categoryname;
                                if(res.hotword.material_info){
                                    this.material_info=res.hotword.material_info ;
                                    this.is_del_material_info=false;
                                }else{
                                    this.is_del_material_info=true;
                                }
                                this.material_type=res.hotword.material_type;
                            }
                            if((this.postdata.xtype==3||this.postdata.xtype=='3') && res.hotword.word_imgs){
                                this.word_imgs=res.hotword.word_imgs;
                                this.word_imgs.map((img,idex)=>{
                                        this.fileList.push({uid:'img'+idex,url:img,status:'done',name:'img'+idex});
                            })
                        }
                    })
            },
            handleOk(url,index,cfromModel) {
                this.wordurllist[index].jumpurl=url;
            },
            handleMaterialOk(info,infotype,index){
                this.material_type=infotype;
                this.material_info=info;
                this.material_info.xtype=this.material_info.xtype*1;
                this.is_del_material_info=false;
                if(infotype=='material_category'){
                    //分类
                    this.material_id=0;
                    this.cate_id=info.cate_id*1;
                    this.categoryname=info.categoryname;
                }else if(infotype=='material_content'){
                    //内容
                    this.material_id=info.material_id*1;
                    this.cate_id=info.cate_id*1;
                    this.categoryname='';
                }
            },
            xtypeChange(vtype){
                console.log('xtypeChange',vtype);
                vtype=vtype*1;
                if(this.material_info && this.material_info.xtype && this.material_info.xtype!=vtype){
                    this.material_id=0;
                    this.cate_id=0;
                    this.categoryname='';
                    this.material_info={};
                    this.material_type='';
                }
            },
            onTextAreaChange(e){
                //console.log('textArea',e);
            },
            handleSubmit() {
                let that = this
                let postArr=that.postdata;
                if(that.postdata.wordname.length<1){
                    that.$message.error('关键词名称不能为空！')
                    return false;
                }
                let iserror=false;
                let xtype=postArr.xtype*1;
                let comfrom=postArr.comfrom*1;
                if(xtype==0 || xtype==='0'){
                    that.wordurllist.forEach(function(item, index) {
                        if(item.showtitle.length<1 || item.jumpurl.length<1 || (item.jumpurl.indexOf('http')!=0)){
                            iserror=true;
                        }
                    });
                    if(iserror){
                        that.$message.error('请将链接的每项字段都正确的填写完整！')
                        return false;
                    }
                }else if(xtype==1 || xtype==='1'){
                    /**文本**/
                    if(comfrom==1 && (that.cate_id<1 && that.material_id<1)){
                        that.$message.error('请从素材库中选择文字回复数据！')
                        return false;
                    }
                    if(comfrom<1 && (!postArr.xcontent || postArr.xcontent.length<1)){
                        that.$message.error('请填写回复内容！')
                        return false;
                    }
                }else if(xtype==2 || xtype==='2'){
                    /**音频**/
                    if(comfrom==1 && (that.cate_id<1 && that.material_id<1)){
                        that.$message.error('请从素材库中选择音频回复数据！')
                        return false;
                    }
                    if(comfrom<1 && (!that.audio_url || that.audio_url.length<10)){
                        that.$message.error('请上传回复音频文件！')
                        return false;
                    }
                }else if(xtype==3 || xtype==='3'){
                    /**图片**/
                    if(comfrom==1 && (that.cate_id<1 && that.material_id<1)){
                        that.$message.error('请从素材库中选择图片回复数据！')
                        return false;
                    }
                    if(comfrom<1 && (!that.word_imgs || that.word_imgs.length<1)){
                        that.$message.error('请上传回复图片文件！')
                        return false;
                    }
                }
                that.confirmLoading = true;
                postArr.word_id=that.word_id;
                postArr.wordurllist=that.wordurllist;
                postArr.word_imgs=that.word_imgs;
                postArr.audio_url=that.audio_url;
                postArr.material_id=that.material_id;
                postArr.cate_id=that.cate_id;
                postArr.material_info=that.material_info;
                console.log(postArr)
                that.request(villageApi.saveHotWordData, postArr).then((res) => {
                    that.confirmLoading = false;
                    if (that.word_id >0) {
                        that.$message.success('编辑成功！')
                    } else {
                        that.$message.success('添加成功！')
                    }
                    that.$emit('ok');
                    that.handleSubCancel();
                    
                })

            },
            handleSubCancel() {
                this.word_id=0;
                this.showvisible = false;
                this.confirmLoading = false;
                this.postdata={wordname:'',xtype:"0",comfrom:0,xcontent:'',xname:''};
                this.wordurllist= [{
                    showtitle: '',
                    jumpurl: ''
                }];
                
                this.fileList= [];
                this.fileAudioList=[];
                this.previewVisible=false;
                this.previewImage='';
                this.word_imgs=[];
                this.audio_url='';
                this.material_id=0;
                this.cate_id=0;
                this.categoryname='';
                this.material_info={};
                this.material_type='';
                this.is_del_material_info=false;
            },

            duration_add() {
                if(this.wordurllist.length>=9){
                    this.show_add_button=false;
                }
                this.wordurllist.push({
                    showtitle: '',
                    jumpurl: ''
                })
            },

            duration_reduce(index) {
                this.wordurllist.splice(index, 1)
                if(this.wordurllist.length<10){
                    this.show_add_button=true;
                }else{
                    this.show_add_button=false;
                }
            },
            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImage = file.url || file.preview;
                this.previewVisible = true;
            },
            handleUploadChange({  fileList }) {
                let that = this
                that.fileList = fileList;
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
                if(fileinfo.file.response && fileinfo.file.response.data && fileinfo.file.response.data.url){
                    this.audio_url=fileinfo.file.response.data.url;
                    this.fileAudioList[0].url=this.audio_url;
                }
                console.log('fileAudioList',this.fileAudioList);
                if(fileinfo.file.status=='removed' && fileinfo.fileList.length<1){
                    this.audio_url='';
                }
            },
            beforeUpload(file) {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg';
                if (!isJpgOrPng) {
                    this.$message.error('You can only upload JPG file!');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('Image must smaller than 2MB!');
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
        },
    }
</script>

<style lang="less" scoped>
    .form_title {
        font-size: 14px;
        font-weight: bold;
    }

    .generation_rules {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-top: 5px;
    }

    /deep/ .editword .ant-form-item-control-wrapper {
        display: inline-block;
    }
    
    /deep/ .editword .uploadFile .ant-form-item-control-wrapper {
        width: 520px;
    }
    /deep/ .editword .ant-form-item-label {
        vertical-align: top;
    }
    /deep/ .ant-upload-list-item-info{width: 95%;}
    /deep/ .ant-upload-list-item-card-actions {right: auto;}
    .previewimg img{cursor: pointer;}
    .footer_button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;

    }
</style>
