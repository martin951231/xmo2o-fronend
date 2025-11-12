<template>
    <div class="site_information">
        <a-tabs default-active-key="1" @change="tabChange" style="padding: 20px;">
            <a-tab-pane key="1" tab="站点信息">
                <a-form-model ref="ruleForm" :model="siteForm" :rules="rules" :label-col="labelCol"
                    :wrapper-col="wrapperCol">
                    <div class="form_container">
                        <a-form-model-item label="站点名称" prop="pile_name" class="form_item">
                            <a-input placeholder="请输入" v-model="siteForm.pile_name" />
                        </a-form-model-item>
                        <a-form-model-item label="站点位置" prop="long_lat" class="form_item" style="display: flex;">
                            <div class="site_local" style="display: flex;">
                                <a-input placeholder="请选择位置" :disabled="true" v-model="siteForm.long_lat" />
                                <a-button @click="openMap" style="margin-left: 10px;">定位数据</a-button>
                            </div>
                        </a-form-model-item>
                        <a-form-model-item label="可用电容" prop="capacitance" class="form_item">
                            <a-input placeholder="请输入" v-model="siteForm.capacitance" addon-after="KW·A" />
                        </a-form-model-item>
                        <a-form-model-item label="客服电话" prop="pile_phone" class="form_item">
                            <a-input placeholder="请输入" v-model="siteForm.pile_phone" />
                        </a-form-model-item>
                        <a-form-model-item label="停车收费类型" prop="park_type" class="form_item">
                            <a-select placeholder="请选择" style="width: 100%" :filter-option="filterOption"
                                :value="siteForm.park_type" @change="(value)=>handleSelectChange(value, 'park_type')">
                                <a-select-option v-for="(item,index) in feetypeList" :value="item.id">
                                    {{item.name}}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item label="停车说明" prop="park_desc" class="form_item">
                            <a-input placeholder="请输入" v-model="siteForm.park_desc" />
                        </a-form-model-item>
                        <a-form-model-item label="开放时间说明" prop="open_time_desc" class="form_item">
                            <a-input placeholder="请输入" v-model="siteForm.open_time_desc" />
                        </a-form-model-item>
                        <a-form-model-item label="最小使用余额" prop="min_money" class="form_item" extra="当用户余额小于该值时，无法充电">
                            <a-input placeholder="请输入" v-model="siteForm.min_money" />
                        </a-form-model-item>    
                        <a-form-model-item label="营业时间" prop="work_time" class="form_item">
                            <div style="display: flex;align-items: center;">
                                <a-time-picker v-if="siteForm.work_time_start" @change="(value, str) => timeChange(value, str, 'work_time_start')" :value="moment(siteForm.work_time_start, 'HH:mm')" format="HH:mm" />
                                <a-time-picker v-else @change="(value, str) => timeChange(value, str, 'work_time_start')" format="HH:mm" />
                                <span style="margin: 0 10px;">至</span>
                                <a-time-picker v-if="siteForm.work_time_end" @change="(value, str) => timeChange(value, str, 'work_time_end')" :value="moment(siteForm.work_time_end, 'HH:mm')" format="HH:mm" />
                                <a-time-picker v-else @change="(value, str) => timeChange(value, str, 'work_time_end')" format="HH:mm" />
                            </div>
                        </a-form-model-item>
                        <a-form-model-item label="备注信息" prop="remark" class="form_item">
                            <a-input placeholder="请输入" v-model="siteForm.remark" />
                        </a-form-model-item>
                        <!-- <a-form-model-item label="富文本" prop="remark" class="form_item">
                            <a-button @click="editText">编辑富文本</a-button>
                        </a-form-model-item> -->
                        <a-form-model-item label="电站图片" prop="img" class="form_item">
                            <a-upload
                                list-type="picture-card"
                                class="avatar-uploader"
                                :show-upload-list="false"
                                action="/v20/public/index.php/community/village_api.ContentEngine/uploadFile"
                                :before-upload="beforeUpload"
                                @change="handleUploadChange">
                                <img v-if="siteForm.img" style="width: 100px;height: 100px;" :src="siteForm.img" alt="avatar" />
                                <div v-else>
                                    <a-icon :type="imageLoading ? 'loading' : 'plus'" />
                                    <div class="ant-upload-text">Upload</div>
                                </div>
                            </a-upload>
                        </a-form-model-item>
                    </div>
                    <a-button style="margin-left: 42%;" type="primary" @click="saveForm()">保存</a-button>
                </a-form-model>
                
                <a-modal v-if="mapVisible" title="百度地图拾取经纬度" :visible="mapVisible" :width="800" @ok="handleMapOk"
                    @cancel="handleMapCancel">
                    <a-input style="width: 200px;" type="text" id="suggestId" name="address_detail" placeholder="请输入城市名/地区名"
                        v-model="address_detail" class="input_style" />
                    <a-button style="margin-left:10px;" type="primary" @click="searchMap">搜索</a-button>
                    <div id="allmap" style="width:100%; height: 500px; margin-top: 10px;"></div>
                </a-modal>
            </a-tab-pane>
            <a-tab-pane key="2" tab="收费标准绑定">
                <a-table @change="tableChange" :columns="columns" :data-source="tableList" :loading="tableLoading" :pagination="pageInfo">
                    <span slot="action" slot-scope="text, record">
                        <a @click="lookDetail(record)">查看</a>
                        <a-divider type="vertical" />
                        <a @click="bindDevice(record)">绑定设备</a>
                    </span>
                </a-table>
                <equipmentBind :visible="showEquipment" @close="closeEquipModal" :ruleId="rule_id" />
                <!-- <equipmentInfo :visible="showRuleDetail" @close="closeEquipModal" :ruleId="rule_id" /> -->
                <ruleInfo ref="PopupEditModel" @ok="editRule"/>
            </a-tab-pane>
        </a-tabs>
        <richEdit :visible="showRichtext" @close="closeRichtext" />
    </div>
</template>

<script>
    import moment from 'moment';

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    
    const columns = [{
            title: '收费标准名称',
            key: 'charge_name',
            dataIndex: 'charge_name',
        },
        {
            title: '所属收费项目',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '收费标准生效时间',
            dataIndex: 'charge_valid_time_txt',
            key: 'charge_valid_time_txt',
        },
        {
            title: '操作',
            key: 'action',
            scopedSlots: { customRender: 'action' },
        },
    ];
    
    import equipmentBind from "./components/equipmentBind.vue";
    // import equipmentInfo from "./components/equipmentInfo.vue";
    import ruleInfo from "../charge/standard/ruleInfo.vue";
    import richEdit from "./components/richEdit.vue";
    export default {
        components: {
            equipmentBind,
            // equipmentInfo,
            ruleInfo,
            richEdit
        },
        data() {
            return {
                pageInfo: {
                    page: 1,
                    limit: 10,
                    current: 1,
                    pageSize: 10,
                    total: 0
                },
                rule_id: 0,
                showEquipment: false,
                showRuleDetail: false,
                tableLoading: false,
                columns,
                tableList: [],
                siteForm: {
                    pile_name: '',
                    lat: '',
                    lng: '',
                    park_type: '',
                    pile_phone: '',
                    capacitance: '',
                    open_time_desc: '',
                    work_time_start: '',
                    work_time_end: '',
                    img: '',
                    min_money: '',
                    remark: '',
                    park_desc: '',
                    long_lat: ''
                },
                rules: {
                    pile_name: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }],
                    long_lat: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }],
                    capacitance: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }],
                    pile_phone: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }],
                    park_type: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }],
                    park_desc: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }],
                    open_time_desc: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }],
                    work_time: [{
                        required: false,
                        message: '请输入',
                        trigger: 'blur'
                    }],
                    remark: [{
                        required: false,
                        message: '请输入',
                        trigger: 'blur'
                    }],
                    img: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }],
                    name: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }],
                    min_money: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }]
                },
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 14
                },
                mapVisible: false,
                address_detail: '北京',
                userlocation: {
                    lng: "",
                    lat: ""
                },
                userLng: "",
                userLat: "",
                feetypeList: [{
                    id: 1,
                    name: '停车收费'
                }, {
                    id: 2,
                    name: '停车免费'
                }, {
                    id: 3,
                    name: '限时免费'
                }, {
                    id: 4,
                    name: '充电限免'
                }, ],
                fileList: [],
                previewVisible: false,
                previewImage: '',
                priceType: [{
                        id: 1,
                        list: [{
                            label: '类别名称',
                            value: '央'
                        }, {
                            label: '电费',
                            value: '',
                            unit: '元/度'
                        }, {
                            label: '服务费',
                            value: '',
                            unit: '元/度'
                        }],
                    },
                    {
                        id: 2,
                        list: [{
                            label: '类别名称',
                            value: '峰'
                        }, {
                            label: '电费',
                            value: '',
                            unit: '元/度'
                        }, {
                            label: '服务费',
                            value: '',
                            unit: '元/度'
                        }],
                    },
                    {
                        id: 3,
                        list: [{
                            label: '类别名称',
                            value: '平'
                        }, {
                            label: '电费',
                            value: '',
                            unit: '元/度'
                        }, {
                            label: '服务费',
                            value: '',
                            unit: '元/度'
                        }],
                    },
                    {
                        id: 4,
                        list: [{
                            label: '类别名称',
                            value: '谷'
                        }, {
                            label: '电费',
                            value: '',
                            unit: '元/度'
                        }, {
                            label: '服务费',
                            value: '',
                            unit: '元/度'
                        }],
                    },
                ],
                priceSet: [{
                    index: 0
                }],
                isSearch: false,
                imageLoading: false,
                imageUrl: '',
                showRichtext: false
            }
        },

        mounted() {
            this.getSiteInformation()
        },

        methods: {
            moment,
            getSiteInformation() {
                let that = this
                that.request('/community/village_api.Pile/getPileConfig').then((res) => {
                    that.siteForm = res
                    that.siteForm.long_lat = res.long + '，' + res.lat
                })
            },

            saveForm() {
                let that = this
                that.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        that.request('/community/village_api.Pile/editPileConfig', that.siteForm).then((
                        res) => {
                            that.getSiteInformation()
                            that.$message.success("编辑成功！")
                        })
                    }
                });

            }, 
            handleMapOk() {
                this.siteForm.long_lat = this.siteForm.long + ',' + this.siteForm.lat
                this.mapVisible = false
                this.isSearch = false
            },

            handleMapCancel() {
                this.mapVisible = false
                this.isSearch = false
            },

            openMap() {
                this.mapVisible = true
                this.initMap()
            },
            searchMap() {
                if (this.address_detail) {
                    this.isSearch = true
                    this.initMap()
                }
            },
            initMap() {
                this.$nextTick(function() {
                    let th = this;
                    let map = new BMap.Map("allmap");
                    if (th.siteForm.lat && th.siteForm.long && !th.isSearch) {
                        map.clearOverlays(); //清除地图上所有覆盖物
                        let marker = new BMap.Marker(new BMap.Point(th.siteForm.long, th.siteForm.lat))
                        map.addOverlay(marker);
                        map.centerAndZoom(new BMap.Point(th.siteForm.long, th.siteForm.lat), 15);
                    } else {
                        map.centerAndZoom(th.address_detail, 15);
                    }
                    map.enableScrollWheelZoom();
                    var ac = new BMap.Autocomplete({
                        "input": "suggestId",
                        "location": map
                    });

                    map.addEventListener("click", function(e) {
                        map.clearOverlays(); //清除地图上所有覆盖物
                        map.addOverlay(new BMap.Marker(e.point)); //添加标注
                        th.siteForm.long = e.point.lng;
                        th.siteForm.lat = e.point.lat; // 打开信息窗口
                        th.isSearch = false
                    });
                });
            },

            handleSelectChange(value, type) {
                if (type === 'park_type') {
                    this.siteForm.park_type = value
                }
                this.$forceUpdate()
            },

            onDateChange(date, dateString) {
                this.siteForm.business_hours = dateString
            },

            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },

            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImage = file.url || file.preview;
                this.previewVisible = true;
            },

            beforeUpload(file) {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    this.$message.error('You can only upload JPG file!');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('Image must smaller than 2MB!');
                }
                return isJpgOrPng && isLt2M;
            },

            handleUploadChange(info) {
                let that = this
                if (info.file.status === 'uploading') {
                    that.siteForm.img = ''
                    that.imageLoading = true;
                    return;
                }
                if (info.file.status === 'done') {
                    that.imageLoading = false;
                    that.siteForm.img = info.file.response.data.path
                }
            },

            handleCancel() {
                this.previewVisible = false;
            },

            timeChange(value, str, type) {
                console.log(value, str, type)
                this.siteForm[type] = str
            },

            addPriceSet() {
                this.priceSet.push({
                    index: this.priceSet.length
                })
            },

            deletePriceSet(index) {
                this.priceSet.splice(index, 1)
            },
            
            previewThis(){
                this.previewVisible = true
            },
            
            tabChange(key){
                this.currentIndex = key
                if(key == 1){
                    this.getSiteInformation()
                } else {
                    this.getRuleChargeList()
                }
            },
            
            getRuleChargeList(){
                let that = this
                that.tableLoading = true
                that.request('/community/village_api.Pile/getRuleChargeList', that.pageInfo).then(res => {
                    that.pageInfo.total = res.count
                    that.tableList = res.list
                    that.tableLoading = false
                })
            },
            
            bindDevice(record){
                this.rule_id = record.id * 1
                this.showEquipment = true
            },
            
            tableChange({current}){
                this.pageInfo.page = current
                this.pageInfo.current = current
                this.getRuleChargeList()
            },
            
            closeEquipModal(){
                this.showEquipment = false
                this.showRuleDetail = false
            },
            
            lookDetail(record){
                this.rule_id = record.id * 1
                this.showRuleDetail = true
                this.$refs.PopupEditModel.edit(record.id, 'pile')
            },
            editRule(){
                
            },
            editText(){
                this.showRichtext = true
            },
            closeRichtext(){
                this.showRichtext = false
            }
        }
    }
</script>

<style lang="less" scoped>
    .site_information {
        width: 100%;
        background-color: #ffffff;

        .form_container {
            display: flex;
            align-items: flex-start;
            justify-content: flex-start;
            flex-wrap: wrap;

            .form_item {
                width: 46%;
            }
        }

    }
</style>
