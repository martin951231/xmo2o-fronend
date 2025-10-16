<template>
    <a-card :bordered="false" >
        <div class="search-box">
            <a-row :gutter="48">
                <a-col :md="7" :sm="16" :style="`padding-left: 5px; padding-right: 5px;width: 320px`">
                    <div class="flex">
                        <p style="margin-top: 5px;width: 100px;">楼栋：</p>
                        <a-select
                            :style="{width: 'calc(100% - 100px)'}"
                            v-model="searchForm.single_id"
                            allowClear
                            @focus="getSingleListByVillage()"
                            @change="getFloorList(searchForm.single_id)"
                            placeholder="请选择楼栋">
                            <a-select-option v-for="item in single_list" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :md="8" :sm="16" :style="`padding-left: 5px; padding-right: 5px;width: 320px`">
                    <div class="flex">
                        <p style="margin-top: 5px;width: 100px;">单元：</p>
                        <a-select
                            allowClear
                            :style="{width: 'calc(100% - 100px)'}"
                            v-model="searchForm.floor_id"
                            @change="getLayerList(searchForm.floor_id)"
                            placeholder="请选择单元">
                            <a-select-option v-for="item in floor_list" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :md="8" :sm="16" :style="`padding-left: 5px; padding-right: 5px;width: 320px`">
                    <div class="flex">
                        <p style="margin-top: 5px;width: 100px;">楼层：</p>
                        <a-select
                            allowClear
                            :style="{width: 'calc(100% - 100px)'}"
                            v-model="searchForm.layer_id"
                            @change="getVacancyList(searchForm.layer_id)"
                            placeholder="请选择楼层">
                            <a-select-option v-for="item in layer_list" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :md="8" :sm="16" :style="`padding-left: 5px; padding-right: 5px;width: 320px`">
                    <div class="flex">
                        <p style="margin-top: 5px;width: 100px;">房间：</p>
                        <a-select
                            allowClear
                            :style="{width: 'calc(100% - 100px)'}"
                            v-model="searchForm.room_id"
                            placeholder="请选择房间">
                            <a-select-option v-for="item in room_list" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </a-col>
            </a-row>
            <a-row class="mt-20" :gutter="48">
                <a-col :md="7" :sm="16" style="padding-left: 5px; padding-right: 5px;width: 320px;">
                        <div class="flex">
                            <p class="" style="margin-top: 5px; width: 100px;">收件人：</p>
                            <a-input
                                allowClear
                                @keydown.enter.native="getList()"
                                :style="{width: 'calc(100% - 100px)'}"
                                v-model="searchForm.recipient_name"
                                placeholder="请输入收件人"
                                style="width: 200px;"
                            />
                        </div>
                </a-col>
                <a-col :md="7" :sm="16" style="padding-left: 5px; padding-right: 5px;width: 320px;">
                    <div class="flex">
                        <p class="" style="margin-top: 5px; width: 100px;">收件电话：</p>
                        <a-input
                            allowClear
                            @keydown.enter.native="getList()"
                            :style="{width: 'calc(100% - 100px)'}"
                            v-model="searchForm.recipient_phone"
                            placeholder="请输入收件电话"
                            style="width: 200px;"
                        />
                    </div>
                </a-col>
                <a-col :md="7" :sm="16" style="padding-left: 5px; padding-right: 5px;width: 320px;">
                    <div class="flex">
                        <p class="" style="margin-top: 5px; width: 100px;">快递代取点：</p>
                        <a-select
                            allowClear
                            :style="{width: 'calc(100% - 100px)'}"
                            v-model="searchForm.location_id"
                            placeholder="请选择取件地址">
                            <a-select-option v-for="item in locationList" :key="item.id" :value="item.id">
                                {{ item.location }}
                            </a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :md="7" :sm="16" style="padding-left: 5px; padding-right: 5px;width: 320px;">
                    <div class="flex">
                        <a-button class="" type="primary" icon="search" @click="getList()">
                            查询
                        </a-button>
                        <a-button class="ml-10" icon="redo" @click="resetList()">
                            重置
                        </a-button>
                    </div>
                </a-col>
            </a-row>

        </div>
        <div class="add-box">
            <a-row :gutter="48">
                <a-col :md="48" :sm="16">
                    <a-button class="ml-10" type="primary" icon="plus" @click="addActive()">
                        添加
                    </a-button>
                </a-col>
            </a-row>
        </div>

        <a-table :columns="columns" :data-source="list"
                 :pagination="pagination"
                 @change="tableChange"
                 :loading="viewLoading"
                 :row-key="record=>record.id"
        >
            <span slot="action" slot-scope="text, record">
                <a @click="editActive(record)">编辑</a>
                <a-divider type="vertical" />
                <a @click="viewDetail(record)">详情</a>
                <a-divider type="vertical" />
                <a class="error-color" @click="deleteActive(record)">删除</a>
              </span>
        </a-table>
        <!-- 添加/编辑弹窗 -->
        <a-modal
            :visible="pickUpPersonModelShow"
            title="添加常用取件人"
            :width="`60vw`"
            :maskClosable="false"
            :footer="null"
            :confirmLoading="confirmLoading"
            @cancel="handleCancel"
        >
            <a-spin :spinning="confirmLoading">
                <a-form :form="form" ref="formRef" >
                    <a-form-item label="选择" :labelCol="labelCol" :wrapperCol="wrapperCol" required >
                        <a-cascader
                            v-model="selectedOptionsList"
                            class="cascader_style margin_left_8 margin_top_10"
                            :options="options"
                            :load-data="loadDataFunc"
                            :placeholder="'请选择'+$store.getters.config.room_name"
                            change-on-select
                            @change="setVisionsFunc" />
                    </a-form-item>
                    <a-form-item
                        name="recipient_name"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="收件人"
                        required
                    >
                        <a-input
                            v-model="form.recipient_name"
                            placeholder="请输入收件人"
                        />
                    </a-form-item>
                    <a-form-item
                        name="recipient_phone"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="收件电话"
                        required
                    >
                        <a-input v-model="form.recipient_phone" placeholder="请输入收件电话" />
                    </a-form-item>
                    <a-form-item
                        name="location_id"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="取件地址"
                        required
                    >
                        <a-select
                            v-model="form.location_id"
                            placeholder="请选择取件地址">
                            <a-select-option v-for="item in locationList" :key="item.id" :value="item.id">
                                {{ item.location }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item
                        name="remark"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="备注"

                    >
                        <a-input v-model="form.remark" placeholder="请输入备注" />
                    </a-form-item>
                    <a-form-item
                        name="is_default"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="是否设为默认"
                    >
                        <a-radio-group v-model="form.is_default">
                            <a-radio :value="1">是</a-radio>
                            <a-radio :value="0">否</a-radio>
                        </a-radio-group>
                    </a-form-item>
                </a-form>
                <div style="text-align: right;">
                    <a-button @click="handleCancel" style="margin-right: 10px;">取消</a-button>
                    <a-button type="primary" :loading="confirmLoading" @click="handleSubmit">
                        保存
                    </a-button>
                </div>
            </a-spin>
        </a-modal>
        <!-- 详情 -->
        <a-modal
            :visible="pickUpPersonModelDetailShow"
            title="查看常用取件人"
            :width="`60vw`"
            :maskClosable="false"
            :footer="null"
            :confirmLoading="confirmLoading"
        >
            <a-spin :spinning="confirmLoading">
                <a-form :form="form" ref="formRef" >
                    <a-form-item label="选择" :labelCol="labelCol" :wrapperCol="wrapperCol" required >
                        <a-cascader
                            v-model="selectedOptionsList"
                            class="cascader_style margin_left_8 margin_top_10"
                            :options="options"
                            :load-data="loadDataFunc"
                            :placeholder="'请选择'+$store.getters.config.room_name"
                            change-on-select
                            disabled
                            @change="setVisionsFunc" />
                    </a-form-item>
                    <a-form-item
                        name="recipient_name"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="收件人"
                        required
                    >
                        <a-input
                            disabled
                            v-model="form.recipient_name"
                            placeholder="请输入收件人"
                        />
                    </a-form-item>
                    <a-form-item
                        name="recipient_phone"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="收件电话"
                        required
                    >
                        <a-input disabled v-model="form.recipient_phone" placeholder="请输入收件电话" />
                    </a-form-item>
                    <a-form-item
                        name="location_id"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="取件地址"
                        required
                    >
                        <a-select
                            disabled
                            v-model="form.location_id"
                            placeholder="请选择取件地址">
                            <a-select-option v-for="item in locationList" :key="item.id" :value="item.id">
                                {{ item.location }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item
                        name="remark"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="备注"

                    >
                        <a-input disabled v-model="form.remark" placeholder="请输入备注" />
                    </a-form-item>
                    <a-form-item
                        name="is_default"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="是否设为默认"
                    >
                        <a-radio-group disabled v-model="form.is_default">
                            <a-radio :value="1">是</a-radio>
                            <a-radio :value="0">否</a-radio>
                        </a-radio-group>
                    </a-form-item>
                </a-form>
                <div style="text-align: right;">
                    <a-button @click="handleCancel" style="margin-right: 10px;">关闭</a-button>
                </div>
            </a-spin>
        </a-modal>
    </a-card>
</template>

<script>
import villageApi from '@/api/community/village'
import streetCommunityApi from '@/api/community/streetCommunity';
import { Modal } from 'ant-design-vue';

export default {
    data() {
        return {
            list: [],
            pagination: {
                pageSize: 10,
                current: 1,
                total:0,
            },
            searchForm: {
                location_id: undefined,
            },
            locationList: [],
            project_id: '',
            form: {
                is_default: 1,
                recipient_name: '',
                recipient_phone: '',
                location_id: undefined,
                remark: '',
            },
            confirmLoading: false,
            labelCol: {
                xs: { span: 38 },
                sm: { span: 7 },
            },
            wrapperCol: {
                xs: { span: 38 },
                sm: { span: 13 },
            },
            villageProject:[],
            columns: [
                {
                    title: '房间号',
                    dataIndex: 'room_name',
                    key: 'room_name',
                    ellipsis: true,
                },
                {
                    title: '收件人',
                    dataIndex: 'recipient_name',
                    key: 'recipient_name',
                    ellipsis: true,
                },
                {
                    title: '收件电话',
                    dataIndex: 'recipient_phone',
                    key: 'recipient_phone',
                    ellipsis: true,
                },
                {
                    title: '快递代取地点',
                    dataIndex: 'location',
                    key: 'location',
                    ellipsis: true,
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    ellipsis: true,
                },
                {
                    title: '是否为默认',
                    dataIndex: 'is_default',
                    key: 'is_default',
                    ellipsis: true,
                    customRender: (text, record) => {
                        return record.is_default === 1 ? '是' : '否';
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    ellipsis: true,
                    scopedSlots: {
                        customRender: 'action'
                    }
                },
            ],
            is_show: false,
            pickUpPersonModelShow: false,
            pickUpPersonModelDetailShow: false,
            room_name: '',
            room_id: null,
            room_list: [],
            floor_id: null,
            floor_list: [],
            layer_id: null,
            layer_list: [],
            single_id: null,
            single_list: [],
            options: [],
            selectedOptionsList: [],
            currentAction: '',
            viewLoading: false,
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init(){
            this.getLocationList();
            this.getList();
        },
        tableChange(pagination) {
            this.pagination = pagination;
            this.getList();
        },
        async getLocationList() {
            this.request(villageApi.getExpressPickupLocationList, {}).then((res) => {
                this.locationList = res.list;
            })
        },
        async getList() {
            const { current, pageSize } = this.pagination;
            this.searchForm = {
                ...this.searchForm,
                // single_id: this.single_id,
                // floor_id: this.floor_id,
                // layer_id: this.layer_id,
                // room_id: this.room_id,
            }
            this.viewLoading = true
            this.request(villageApi.getExpressPickupPersonList, {
                page: current,
                limit: pageSize,
                ...this.searchForm,
            }).then(res => {
                this.list = res.list
                this.pagination.total = res.count;
                this.viewLoading = false
            })
        },
        resetList() {
            this.searchForm = {
            };
            this.single_id = null;
            this.single_list = [];
            this.floor_id = null;
            this.floor_list = [];
            this.layer_id = null;
            this.layer_list = [];
            this.room_id = null;
            this.room_list = [];
            this.pagination = {
                pageSize: 10,
                current: 1,
            };
            // this.getList();
        },
        //添加
        addActive() {
            this.pickUpPersonModelShow = true
            this.currentAction = 'add'
            this.resetInfo()
            this.getSingleListByVillage();
        },
        //编辑
        editActive(record) {
            this.form = record
            this.form.location_id = parseInt(record.location_id)
            console.log( record )
            // this.form = this.$form.createForm(this)
            this.pickUpPersonModelShow = true
            this.getSingleListByVillage();
            this.single_id = record.single_id
            this.getFloorList(record.single_id);
            this.floor_id = record.floor_id
            this.getLayerList(record.floor_id);
            this.layer_id = record.layer_id
            this.getVacancyList(record.layer_id);
            this.room_id = record.room_id
            this.selectedOptionsList = [parseInt(record.single_id),parseInt(record.floor_id),parseInt(record.layer_id),parseInt(record.room_id)]
            this.setVisionsFunc(this.selectedOptionsList)
            this.room_name = record.room_name
            this.currentAction = 'edit'
        },
        // 查看详情
        viewDetail(record) {
            this.form = record
            this.form.location_id = parseInt(record.location_id)
            this.pickUpPersonModelDetailShow = true
        },
        // 删除
        deleteActive(record) {
            Modal.confirm({
                title: '提示',
                content: '确认删除?',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    this.request(villageApi.delCommonPickupPerson, { id: record.id } )
                        .then(() => {
                            this.$message.success('删除成功')
                            this.getList()
                        })
                        .catch(() => {})
                        .finally(() => {
                        })
                }
            })
        },
        // 取消
        handleCancel() {
            this.pickUpPersonModelShow = false
            this.pickUpPersonModelDetailShow = false
            this.resetInfo()
        },
        //清空房间号
        resetInfo() {
            this.form = {}
            this.post = {}
            this.currentAction = ''
            this.form2 = {}
        },
        async loadDataFunc(selectedOptions) {
            const targetOption = selectedOptions[selectedOptions.length - 1];
            targetOption.loading = true;
            setTimeout(function() {
                targetOption.loading = false;
            }, 100)
        },
        // 保存
        handleSubmit() {
            if( this.selectedOptionsList.length < 4 ){
                this.$message.error('请选择房间')
                return
            }
            if( !this.form.recipient_name ){
                this.$message.error('请输入收件人')
                return
            }
            if( !this.form.recipient_phone ){
                this.$message.error('请输入收件电话')
                return
            }
            if( !this.form.location_id ){
                this.$message.error('请选择取件地址')
                return
            }
            this.confirmLoading = true;
            let room_info = {
                room_name: this.room_name,
                room_id: this.room_id,
                floor_id: this.floor_id,
                layer_id: this.layer_id,
                single_id: this.single_id,
            }
            this.form.current_action = this.currentAction
            let postObj = {...this.form,...room_info };

            this.request(villageApi.saveCommonPickupPerson, postObj)
                .then(() => {
                    this.$message.success('保存成功')
                    this.pickUpPersonModelShow = false
                    this.form = {  }
                    this.getList()
                })
                .catch(() => {
                    this.confirmLoading = false
                })
                .finally(() => {
                    this.confirmLoading = false
                })
        },
        // 楼栋号
        getSingleListByVillage() {
            var param = {
                tokenName: this.tokenName
            };
            if (this.charge_type) {
                param['charge_type'] = this.charge_type;
            }
            if (this.rule_id) {
                param['rule_id'] = this.rule_id;
            }
            if (this.project_id) {
                param['project_id'] = this.project_id;
            }
            this.request(villageApi.getSingleListByVillage, param).then(res => {
                console.log('+++++++Single', res)
                if (res) {
                    this.single_list = res;
                    let array = []
                    res.map(pro => {
                        array.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: false
                        });
                    });
                    this.options = array

                }
            });
        },
        // 单元楼
        getFloorList(id) {
            var param = {
                pid: id,
                tokenName: this.tokenName
            };
            if (this.charge_type) {
                param['charge_type'] = this.charge_type;
            }
            if (this.rule_id) {
                param['rule_id'] = this.rule_id;
            }
            if (this.project_id) {
                param['project_id'] = this.project_id;
            }
            return new Promise(resolve => {
                this.request(villageApi.getFloorList, param).then(res => {
                    console.log('+++++++Single', res)
                    console.log("resolve", resolve)
                    resolve(res);
                    this.floor_list = res;
                });
            });
        },
        // 楼层
        getLayerList(id) {
            var param = {
                pid: id,
                tokenName: this.tokenName
            };
            if (this.charge_type) {
                param['charge_type'] = this.charge_type;
            }
            if (this.rule_id) {
                param['rule_id'] = this.rule_id;
            }
            if (this.project_id) {
                param['project_id'] = this.project_id;
            }
            return new Promise(resolve => {
                this.request(villageApi.getLayerList, param).then(res => {
                    console.log('+++++++Single', res)
                    if (res) {
                        resolve(res);
                        this.layer_list = res;
                    }
                });
            })
        },
        // 房间
        getVacancyList(id) {
            var param = {
                pid: id,
                tokenName: this.tokenName
            };
            if (this.charge_type) {
                param['charge_type'] = this.charge_type;
            }
            if (this.rule_id) {
                param['rule_id'] = this.rule_id;
            }
            if (this.project_id) {
                param['project_id'] = this.project_id;
            }
            return new Promise(resolve => {
                this.request(villageApi.getVacancyList, param).then(res => {
                    console.log('+++++++Single', res)
                    if (res) {
                        resolve(res);
                        this.room_list = res;
                    }
                });
            })
        },
        // 处理加载漏洞单元（选择、编辑时可用）
        async setVisionsFunc(selectedOptions,selectedValue) {
            this.single_id = 0;
            this.room_id = 0;
            this.floor_id = 0;
            this.layer_id = 0;
            this.room_name = '';
            this.selectedOptionsList = [];
            if (selectedOptions.length === 1) {
                this.single_id = selectedOptions[0];
                const options_temp = [...this.options];
                const res = await this.getFloorList(selectedOptions[0]);
                console.log("res", res)
                const children = [];
                res.map(pro => {
                    children.push({
                        label: pro.name,
                        value: pro.id,
                        isLeaf: false
                    });
                    options_temp['children'] = children
                    return true;
                });
                options_temp.find(_ => _.value === selectedOptions[0])['children'] = children;
                this.options = options_temp
            } else if (selectedOptions.length === 2) {
                this.floor_id = selectedOptions[1];
                const apps = await this.getLayerList(selectedOptions[1]);
                const options_temp = [...this.options];
                // const apps = await getDirectoryApp(selectedOptions[1]);
                const children = [];
                apps.map(pro => {
                    children.push({
                        label: pro.name,
                        value: pro.id,
                        isLeaf: false
                    });
                    return true;
                });
                const product = options_temp.find(_ => _.value === selectedOptions[0]);
                product.children.find(_ => _.value === selectedOptions[1])['children'] = children;
                this.options = options_temp
            } else if (selectedOptions.length === 3) {
                this.layer_id = selectedOptions[2];
                const apps = await this.getVacancyList(selectedOptions[2]);
                const options_temp = [...this.options];
                // const apps = await getDirectoryApp(selectedOptions[1]);
                const children = [];
                apps.map(pro => {
                    children.push({
                        label: pro.name,
                        value: pro.id,
                        isLeaf: true
                    });
                    return true;
                });
                const product = options_temp.find(_ => _.value === selectedOptions[0]);
                const product_1 = product.children.find(_ => _.value === selectedOptions[1])
                product_1.children.find(_ => _.value === selectedOptions[2])['children'] = children;
                this.options = options_temp
                console.log("_this.options", this.options)
            } else if (selectedOptions.length === 4) {
                // this.room_name = selectedValue.map(item => item.label).join('/');
                this.selectedOptionsList = selectedOptions;
                this.single_id = selectedOptions[0];
                this.floor_id = selectedOptions[1];
                this.layer_id = selectedOptions[2];
                this.room_id = selectedOptions[3];
            }
        },
    },
};
</script>

<style scoped lang="less">
.search-box {
    padding-left: 20px;
}
.add-box {
    padding-bottom: 20px;
}
</style>