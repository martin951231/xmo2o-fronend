<template>
    <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form" class="project_info">

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <span class="label_col ant-form-item-required">设备品牌</span>
                    <a-select
                        style="width: 300px !important;"
                        @change="handleChange"
                        placeholder="请选择设备品牌"
                        v-decorator="['post.brand_type',{initialValue: post.brand_type,rules: [{ required: true, message: L('请选择设备品牌！') }] }]"
                    >
                        <a-select-option :value="item.id"  v-for="(item,index) in brand_list" :key="index" >
                            {{item.name}}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <span class="label_col ant-form-item-required">设备类型</span>
                    <a-select
                        style="width: 300px !important;"
                        @change="handleChangeBrandSeries"
                        placeholder="请选择设备类型"
                        v-decorator="['post.brand_series',{initialValue: post.brand_series,rules: [{ required: true, message: L('请选择设备类型！') }] }]"
                    >
                        <a-select-option :value="item1.id"  v-for="(item1,index1) in brand_series_list" :key="index1" >
                            {{item1.title}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                
                
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <span class="label_col ant-form-item-required">设备协议</span>
                    <a-select
                        style="width: 300px !important;"
                        placeholder="请选择设备协议"
                        v-decorator="['post.third_protocol',{initialValue: post.third_protocol,rules: [{ required: true, message: L('请选择设备协议') }] }]"
                    >
                        <a-select-option :value="items.thirdProtocol"  v-for="(items,indexs) in thirdProtocolArr" :key="indexs" >
                            {{items.thirdTitle}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                
                


                <a-form-item label="" :required="true" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="label_col ant-form-item-required">设备名称</span>
                        <a-input
                            :maxLength="30"
                            style="width: 300px"
                            placeholder="请输入名称"
                            v-decorator="['post.device_name',{ initialValue: post.device_name, rules: [{ required: true, message: L('请输入名称！') }] }]"
                        />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <a-form-item label="" :required="true" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="label_col ant-form-item-required">设备编号</span>
                        <a-input
                            :maxLength="30"
                            style="width: 300px"
                            placeholder="请输入设备编号"
                            v-decorator="['post.device_sn',{ initialValue: post.device_sn, rules: [{ required: true, message: L('请输入设备编号！') }] }]"
                        />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-col :span="30">
                        <span class="label_col ant-form-item-required">设备用户名</span>
                        <a-input
                            :maxLength="30"
                            style="width: 300px"
                            placeholder="请输入设备用户名"
                            v-decorator="['post.device_admin',{ initialValue: post.device_admin, rules: [{required: true, message: L('请输入请输入设备用户名！') }] }]"
                        />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-col :span="30">
                        <span class="label_col ant-form-item-required">设备密码</span>
                        <a-input
                            :maxLength="30"
                            style="width: 300px"
                            placeholder="请输入设备密码"
                            v-decorator="['post.device_password',{ initialValue: post.device_password, rules: [{required: true, message: L('请输入设备密码！') }] }]"
                        />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-col :span="30">
                        <span class="label_col ant-form-item-required">归属{{$store.getters.config.room_name}}</span>
                         <a-cascader
                            style="width: 300px"
                            class="cascader_style margin_left_10"
                            :options="options"
                            :load-data="loadDataFunc"
                            :placeholder="'请选择'+$store.getters.config.room_name"
                            change-on-select
                            @change="setVisionsFunc"
                            v-model="post.vacancy" />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>


                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="label_col">备注</span>
                        <a-input
                            :maxLength="30"
                            style="width: 300px"
                            placeholder="请输入名称"
                            v-decorator="['post.remark',{ initialValue: post.remark, rules: [{  message: L('请输入备注！') }] }]"
                        />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>
<style lang="less" scoped>
    .imgname{
        width: 100px;
    }

    /deep/ .project_info .ant-form-item{
        margin-left: 30px !important;
        margin-bottom: 15px !important;
    }
    /deep/ .project_info .label_col{
        margin-right: 30px !important;
        font-weight: bold !important;
    }
    /deep/ .project_info .ant-form-item .ant-col-sm-13{
        width: 100% !important;
    }
    /deep/ .project_info .ant-upload-picture-card-wrapper{
        width: 15% !important;
    }
</style>
<script>
    import villageApi from '@/api/community/village';
    import villageDeviceApi from '@/api/community/village/device'
	import store from '@/store';
    export default {
        data() {
            return {
                title   : '新建',
                labelCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 7
                    }
                },
                wrapperCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 13
                    }
                },
                confirmLoading : false,
                form           : this.$form.createForm(this),
                visible        : false,
                post:{
                    device_id        : 0,
                    camera_name      : '',
                    brand_type       : '',
                    brand_key        : '',
                    brand_series     : 0,
                    brand_series_key : '',
                    device_name      : '',
                    device_sn        : '',
                    remark           : '',
                    third_protocol   : 0,
                    device_admin     : '',
                    device_password  : '',
                    vacancy          : [],
                },
                brand_list        : [],  //设备品牌
                thirdProtocolArr  : [],
                brand_series_list : [],
                options           : [],
                loadChoose        : false,
                vacancy1          : [],
                vacancy2          : [],
                vacancy3          : [],
            }
        },
        mounted() {
        },
        methods: {
            getThirdProtocol(value, thirdProtocol) {
                this.post.brand_id = '' + value;
                this.thirdProtocolArr = [];
                this.request(villageApi.getThirdProtocol, {brand_id : value}).then((res) => {
                    if (res.thirdProtocol) {
                        this.thirdProtocolArr = res.thirdProtocol;
                        this.post.thirdProtocol = thirdProtocol;
                        this.$forceUpdate();
                    }
                    console.log('选择品牌', this.thirdProtocolArr)
                })
            },
            handleChange(value, thirdProtocol) {
                this.post.brand_type = '' + value;
                console.log('this.post.brand_id', this.post.brand_id)
                this.getFingerprintBrandSeriesList(value)
                this.getThirdProtocol(value, thirdProtocol)
            },
            handleChangeBrandSeries(value) {
                this.post.brand_series = '' + value;
                console.log('this.post.brand_series', this.post.brand_series)
            },
            add() {
                this.confirmLoading  = true
                this.post = {
                    device_id        : 0,
                    device_name      : '',
                    device_sn        : '',
                    brand_type       : undefined,
                    brand_key        : '',
                    brand_series     : undefined,
                    brand_series_key : '',
                    remark           : '',
                    single_id        : '',
                    floor_id         : '',
                    layer_id         : '',
                    room_id          : '',
                    third_protocol   : undefined,
                    device_admin     : '',
                    device_password  : '',
                    vacancy          : [],
                };
                this.vacancy1   = [];
                this.vacancy2   = [];
                this.vacancy3   = [];
                this.loadChoose = false;
                this.title      = '添加指纹锁';
                this.visible    = true;
                this.get_brand_list();
                this.getSingleListByVillage(1)
            },
            edit(id) {
                this.confirmLoading  = true
                this.title           = '编辑指纹锁';
                this.visible         = true;
                this.post.device_id  = id;
                this.vacancy1        = [];
                this.vacancy2        = [];
                this.vacancy3        = [];
                this.loadChoose      = false;
                this.get_brand_list();
                this.getSingleListByVillage()
                let that = this;
                setTimeout(function() {
                    that.getFingerprintDeviceDetail(id);
                }, 800)
            },
            get_brand_list(){
                this.request(villageDeviceApi.getFingerprintBrandList).then((res) => {
                    this.brand_list = res.brand_list;
                    console.log('this.brand_list', this.brand_list)
                })
            },
            getFingerprintBrandSeriesList(brand_id){
                let param = {}
                param['brand_id'] = brand_id
                this.request(villageDeviceApi.getFingerprintBrandSeriesList, param).then((res) => {
                    this.brand_series_list = res.brand_series_list;
                    console.log('this.brand_series_list', this.brand_series_list)
                    this.$forceUpdate();
                })
            },
            // 楼栋号
            getSingleListByVillage (load) {
                this.request(villageApi.getSingleListByVillage).then(res => {
                    console.log('+++++++Single', res)
                    if (res) {
                        const array = []
                        res.map(pro => {
                        array.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: false
                        })
                        })
                        this.options = array
                    }
                    if (1 == load) {
                        this.confirmLoading  = false
                    }
                })
            },
            // 单元楼
            getFloorList (id) {
                return new Promise(resolve => {
                this.request(villageApi.getFloorList, {
                    pid: id
                }).then(res => {
                    console.log('+++++++Single', res)
                    console.log('resolve', resolve)
                    resolve(res)
                })
                })
            },
            // 楼层
            getLayerList (id) {
                return new Promise(resolve => {
                this.request(villageApi.getLayerList, {
                    pid: id
                }).then(res => {
                    console.log('+++++++Single', res)
                    if (res) {
                    resolve(res)
                    }
                })
                })
            },
            // 房间
            getVacancyList (id) {
                return new Promise(resolve => {
                this.request(villageApi.getVacancyList, {
                    pid: id
                }).then(res => {
                    console.log('+++++++Single', res)
                    if (res) {
                    resolve(res)
                    }
                })
                })
            },
            async loadDataFunc (selectedOptions) {
                const targetOption = selectedOptions[selectedOptions.length - 1]
                targetOption.loading = true
                setTimeout(function () {
                targetOption.loading = false
                }, 100)
            },
            // 处理加载漏洞单元（选择、编辑时可用）
            async setVisionsFunc (selectedOptions) {
                console.log('selectedOptions---',selectedOptions)
                if (selectedOptions.length === 1) {
                    const options_temp = [...this.options]
                    const res = await this.getFloorList(selectedOptions[0])
                    console.log('res', res)
                    const children = []
                    res.map(pro => {
                        children.push({
                        label: pro.name,
                        value: pro.id,
                        isLeaf: false
                        })
                        options_temp['children'] = children
                        return true
                    })
                    options_temp.find(_ => _.value === selectedOptions[0])['children'] = children
                    this.options = options_temp
                    if (this.loadChoose && this.vacancy2) {
                        this.setVisionsFunc(this.vacancy2)
                        this.vacancy2 = [];
                    } else {
                        this.loadChoose      = false;
                        this.confirmLoading  = false
                    }
                } else if (selectedOptions.length === 2) {
                    const apps = await this.getLayerList(selectedOptions[1])
                    const options_temp = [...this.options]
                    // const apps = await getDirectoryApp(selectedOptions[1]);
                    const children = []
                    apps.map(pro => {
                        children.push({
                        label: pro.name,
                        value: pro.id,
                        isLeaf: false
                        })
                        return true
                    })
                    const product = options_temp.find(_ => _.value === selectedOptions[0])
                    product.children.find(_ => _.value === selectedOptions[1])['children'] = children
                    this.options = options_temp
                    if (this.loadChoose && this.vacancy3) {
                        this.setVisionsFunc(this.vacancy3)
                        this.vacancy3 = [];
                    }
                    this.loadChoose      = false;
                    this.confirmLoading  = false
                } else if (selectedOptions.length === 3) {
                    const apps = await this.getVacancyList(selectedOptions[2])
                    const options_temp = [...this.options]
                    // const apps = await getDirectoryApp(selectedOptions[1]);
                    const children = []
                    apps.map(pro => {
                        children.push({
                        label: pro.name,
                        value: pro.id,
                        isLeaf: true
                        })
                        return true
                    })
                    const product = options_temp.find(_ => _.value === selectedOptions[0])
                    const product_1 = product.children.find(_ => _.value === selectedOptions[1])
                    product_1.children.find(_ => _.value === selectedOptions[2])['children'] = children
                    this.options = options_temp
                    console.log('_this.options', this.options)
                }
            },

            /**
             * 詳細信息
             */
            getFingerprintDeviceDetail(id){
                let that = this;
                this.request(villageDeviceApi.getFingerprintDeviceDetail,{
                    device_id:id
                }).then((res) => {
                    this.post.device_id          = res.device_id;
                    this.post.device_name        = res.device_name;
                    this.post.device_sn          = res.device_sn;
                    this.handleChange(res.brand_type, res.third_protocol);
                    this.post.remark             = res.remark;
                    this.post.single_id          = res.single_id;
                    this.post.floor_id           = res.floor_id;
                    this.post.layer_id           = res.layer_id;
                    this.post.room_id            = res.room_id;
                    this.post.device_admin       = res.device_admin;
                    this.post.device_password    = res.device_password;
                    this.post.brand_key          = res.brand_key;
                    this.post.brand_series       = res.brand_series;
                    this.post.third_protocol     = res.third_protocol;
                    let vacancy = [res.single_id, res.floor_id, res.layer_id, res.room_id];
                    that.post.vacancy = vacancy;
                    if (res.single_id) {
                        that.vacancy1   = [res.single_id];
                        that.vacancy2   = [res.single_id, res.floor_id];
                        that.vacancy3   = [res.single_id, res.floor_id, res.layer_id];
                        that.loadChoose = true;
                        that.setVisionsFunc(that.vacancy1);
                        that.vacancy1   = []
                    } else {
                        this.confirmLoading  = false
                    }
                })
            },

            handleSubmit() {
                const {
                    form: {
                        validateFields
                    }
                } = this
                this.confirmLoading = true;

                validateFields((errors, values) => {

                    if (!errors) {
                        let url = villageDeviceApi.addFingerprintDevice;
                        values.post.device_id = this.post.device_id;
                        values.post.vacancy   = this.post.vacancy;
                        if (!this.post.vacancy || !this.post.vacancy[3]) {
                            this.$message.warning('需要选择到具体'+store.getters.config.room_name)
                            this.confirmLoading = false
                            return false;
                        }
                        values.post.room_id   = this.post.vacancy[3];
                        console.log('values.post', values.post)
                        this.request(url, values.post)
                            .then((res) => {
                                if (this.post.camera_id>0) {
                                    this.$message.success('编辑成功')
                                } else {
                                    this.$message.success('添加成功')
                                }
                                setTimeout(() => {
                                    this.form = this.$form.createForm(this)
                                    this.visible = false
                                    this.confirmLoading = false
                                    this.$emit('ok');
                                }, 1500)
                            })
                            .catch((error)=>{
                                this.confirmLoading = false
                            })

                    } else {
                        this.confirmLoading = false
                    }
                })
            },
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.post.id = 0;
                    this.form = this.$form.createForm(this)
                }, 500)
            },
        },
    }
</script>