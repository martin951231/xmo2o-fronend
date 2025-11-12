<template>
<div class="page">
    <a-page-header class="page-header" title="完善公司招聘类信息，更有利于展示您的企业" />
    <a-form-model style="margin-top: 20px" :model="form" :label-col="{ span: 2 }" :wrapper-col="{ span: 8 }" ref="ruleForm" :rules="rules">

        <a-form-model-item
                label="公司照片"
                :colon="false"
                help="限上传10张，建议尺寸900*500"
                :rules="{required: true}"
        >
            <div class="clearfix">
                <a-upload
                        name="pic"
                        :action="uploadImg"
                        list-type="picture-card"
                        :file-list="imgUploadList"
                        :multiple="true"
                        @preview="handlePreview"
                        @change="handleImgChange"
                >
                    <div v-if="imgUploadList.length < 10">
                        <a-icon type="plus" />
                        <div class="ant-upload-text">上传图片</div>
                    </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleImgCancel">
                    <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
            </div>
        </a-form-model-item>

        <a-form-model-item :colon="false" ref="name" prop="name" label="公司名称">
            <a-input v-model="form.name" placeholder="请输入公司名称"/>
        </a-form-model-item>

        <a-form-model-item  :colon="false" ref="short_name" prop="short_name" label="公司简称">
            <a-input v-model="form.short_name" placeholder="限5个字"/>
        </a-form-model-item>

        <a-form-model-item label="公司经纬度">
            <a-row>
                <a-col>
                    <a-button @click="$refs.MapModal.showMap({lng:form.long,lat:form.lat})">
                        点击选取经纬度
                    </a-button>
                </a-col>
                <a-col>
                    {{form.long}},{{form.lat}}
                </a-col>
            </a-row>
        </a-form-model-item>

        <a-form-model-item label="公司规模" :colon="false">
            <a-select v-model="form.people_scale">
                <a-select-option value="1">小于50人</a-select-option>
                <a-select-option value="2">50~100人</a-select-option>
                <a-select-option value="3">101-200人</a-select-option>
                <a-select-option value="4">201~500人</a-select-option>
                <a-select-option value="5">500人~1000人以上</a-select-option>
            </a-select>
        </a-form-model-item>

        <a-form-model-item label="融资状态" :colon="false">
            <a-select v-model="form.financing_status">
                <a-select-option value="1">未融资</a-select-option>
                <a-select-option value="2">天使轮</a-select-option>
                <a-select-option value="3">A轮</a-select-option>
                <a-select-option value="4">B轮</a-select-option>
                <a-select-option value="5">C轮</a-select-option>
                <a-select-option value="6">D轮及以上</a-select-option>
                <a-select-option value="7">已上市</a-select-option>
                <a-select-option value="8">不需要融资</a-select-option>
            </a-select>
        </a-form-model-item>

        <a-form-model-item label="公司性质" :colon="false">
            <a-select v-model="form.nature">
                <a-select-option value="1">民营</a-select-option>
                <a-select-option value="2">国企</a-select-option>
                <a-select-option value="3">外企</a-select-option>
                <a-select-option value="4">合资</a-select-option>
                <a-select-option value="5">股份制企业</a-select-option>
                <a-select-option value="6">事业单位</a-select-option>
                <a-select-option value="7">个体</a-select-option>
                <a-select-option value="8">其他</a-select-option>
            </a-select>
        </a-form-model-item>

        <a-form-model-item label="公司行业" :colon="false">
            <a-cascader
                    v-model="form.defaultIndustry"
                    placeholder="未选择"
                    :options="industryLists"
                    expand-trigger="hover"
            />
        </a-form-model-item>

        <a-form-model-item label="公司介绍" :colon="false" ref="intro" prop="intro" >
            <a-input v-model="form.intro" type="textarea" :rows="4" />
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ offset: 2 }">
            <a-button type="primary" @click="onSubmit">
                保存
            </a-button>
        </a-form-model-item>
    </a-form-model>

    <!--地图-->
    <choose-point ref="MapModal" @updatePosition="updatePosition"/>
</div>

</template>

<script>
    import recruitMerchantApi from '@/api/recruit/merchant';
    import uploadApi from '@/api/common/uploads'
    import ChoosePoint from "./modules/ChoosePoint";

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    export default {
        name: "Company",
        components: {
            ChoosePoint,
        },
        data() {
          return {
              form:{
                  name:'',
                  short_name:'',
                  long: "",//'经度',
                  lat: "",// '纬度',
                  people_scale:"1",
                  financing_status: "1",
                  nature: "1",
                  intro:"",
                  images:[],
                  defaultIndustry:[]
              },
              // 预览图片
              previewVisible: false,
              previewImage: '',
              imgUploadList: [

              ], // 上传图片列表
              // 上传图片地址
              uploadImg: '/v20/public/index.php/common/common.UploadFile/uploadPic?type=company',

              //行业
              industryLists:[],
              rules: {
                  name: [{required: true, message: '公司名称不能为空', trigger: 'blur'}],
                  intro: [{required: true, message: '公司介绍不能为空', trigger: 'blur'}],
                  short_name:[{ max: 5, message: '公司简称限5个字', trigger: 'blur' }],
              },
          }
        },
        mounted() {
            this.syncIndustrySelect();
            this.getCompanyInfo();
        },
        methods: {
            syncIndustrySelect() {
                this.request(recruitMerchantApi.industryTree, {})
                    .then((res) => {
                        this.industryLists = res;
                    })
                    .catch((error) => {
                    })
            },
            getCompanyInfo() {
                this.request(recruitMerchantApi.getInfo, {})
                    .then((res) => {
                        this.form.name = res.name;
                        this.form.short_name = res.short_name;
                        this.form.long = res.long;
                        this.form.lat = res.lat;
                        this.form.people_scale = res.people_scale.toString();
                        this.form.financing_status = res.financing_status.toString();
                        this.form.nature = res.nature.toString();
                        this.form.intro = res.intro;
                        this.form.defaultIndustry = [res.industry_id1, res.industry_id2];
                        this.form.images = res.images_arr;

                        var defaultImages = [];
                        var len = res.show_images_arr.length;
                        for (let i = 0; i < len; i++) {
                            defaultImages.push({
                                uid: -1 * i,
                                name: res.show_images_arr[i].path,
                                status: 'done',
                                response: {status: "1000", data: res.show_images_arr[i]},
                                url: res.show_images_arr[i].url
                            })
                        }
                        this.imgUploadList = defaultImages;
                    })
                    .catch((error) => {
                    })
            },
            // 关闭预览
            handleImgCancel() {
                this.previewVisible = false
            },
            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj)
                }
                this.previewImage = file.url || file.preview
                this.previewVisible = true
            },
            // 处理上传图片
            handleImgChange(info) {
                let fileList = [...info.fileList]
                this.imgUploadList = fileList
                let imageList = []
                this.imgUploadList.map((file) => {
                    if (file.status === 'done' && file.response.status == '1000') {
                        let imgFileListInfo = file.response.data
                        imageList.push(imgFileListInfo.path)
                        this.$set(this.form, 'images', imageList)
                    } else if (info.file.status === 'error') {
                        this.$message.error(`${info.file.name} 上传失败！`)
                    }
                })
                if(fileList.length == 0){
                    this.$set(this.form, 'images', [])
                }
            },
            onSubmit() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        if (this.form.images.length == 0) {
                            this.$message.error('请上传公司照片');
                            return false;
                        }
                        this.request(recruitMerchantApi.saveInfo, this.form)
                            .then((res) => {
                                this.$message.success('保存成功');
                            })
                            .catch((error) => {
                            })
                    } else {
                        return false;
                    }
                });
            },
            updatePosition(location){
                this.form.long = location.lng;
                this.form.lat = location.lat;
                console.log('更新坐标点',location)
            },

        }
    }
</script>

<style scoped>
    .page {
        width: 100%;
        min-height: 100%;
        box-sizing: border-box;
        background: #ffffff;
    }
    .page-header {
        background-color: #eef0f3;
        padding: 14px 16px;
        font-size: 1rem;
    }
    .ant-upload-list-picture-card-container {
        margin: 8px 8px 8px 0;
    }
    
</style>