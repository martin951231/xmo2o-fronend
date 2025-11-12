<template>
    <div id="components-layout-demo-basic">
        <a-spin :spinning="spinning" size="large">
            <a-layout>
                <a-layout-content
                        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '100px' }">
                    <a-form
                            id="components-form-demo-validate-other"
                            :model="formData"
                            v-bind="{
        labelCol: { span: 3 },
        wrapperCol: { span: 21 },
      }"
                    >
                        <a-form-item
                                label="模板名称:"
                        >
                            <a-input v-decorator="[
                           'username',
          { rules: [{ required: true, message: '请输入模板名称' }] },
        ]"
                                     style="width: 200px;"
                                     placeholder="输入模板名称"
                                     v-model="formData.name1"
                            />
                        </a-form-item>

                        <a-form-item label="计费方式:">
                            <a-radio-group v-model="formData.freight_type" @change="changeRadio()"
                                           v-bind:disabled="is_disabled">
                                <a-radio :value="1"> 按件数</a-radio>
                                <a-radio :value="2"> 按重量</a-radio>
                            </a-radio-group>
                        </a-form-item>
                        <a-form-item label="配送区域:">
                            <a-table :columns="columns" :data-source="formData.data" :pagination="false">
                                <a slot="name" slot-scope="text">{{text}}</a>
                                <a slot="action" slot-scope="text,record">
                                    <a @click="updateTem(record.id)">修改</a>
                                    <a class="ml-10" @click="delTem(record.id)">删除</a>
                                </a>
                                <a slot="first_weight" slot-scope="text,record">
                                    <a-input-number
                                            style="margin: -5px 0"
                                            :min="0"
                                            :step="1"
                                            v-model="record.first_weight"
                                    />
                                </a>
                                <a slot="first_freight" slot-scope="text,record">
                                    <a-input-number
                                            style="margin: -5px 0"
                                            :min="0"
                                            :step="0.01"
                                            v-model="record.first_freight"
                                    />
                                </a>
                                <a slot="add_weight" slot-scope="text,record">
                                    <a-input-number
                                            style="margin: -5px 0"
                                            :min="0"
                                            :step="1"
                                            v-model="record.add_weight"
                                    />
                                </a>
                                <a slot="add_freight" slot-scope="text,record">
                                    <a-input-number
                                            style="margin: -5px 0"
                                            :min="0"
                                            :step="0.01"
                                            v-model="record.add_freight"
                                    />
                                </a>
                                <template slot="footer">
                                    <a @click="showModal(1)">指定可配送区域</a>
                                    <a-modal
                                            v-model="visible"
                                            title="选择可配送区域"
                                            @ok="handleOk"
                                            @cancel="handleCancel"

                                    >
                                        <div style="overflow-y:scroll; height: 600px">
                                            <a-transfer
                                                    :rowKey="record => record.key"
                                                    class="tree-transfer"
                                                    :data-source="dataSource"
                                                    :target-keys="targetKeys"
                                                    :render="item => item.title"
                                                    :show-select-all="true"
                                                    @change="onChange"
                                                    @scroll="handleScroll"
                                            >
                                                <template
                                                        slot="children"
                                                        slot-scope="{ props: { direction, selectedKeys }, on: { itemSelect,itemSelectAll } }"
                                                >
                                                    <a-tree
                                                            :defaultExpandAll="false"
                                                            v-if="direction === 'left'"
                                                            blockNode
                                                            checkable
                                                            checkStrictly
                                                            :checkedKeys="[...selectedKeys, ...targetKeys]"
                                                            :treeData="treeData"
                                                            @check="
                                            (_, props) => {
                                              onChecked(_, props, [...selectedKeys, ...targetKeys], itemSelect,itemSelectAll);
                                            }
                                          "
                                                            @select="
                                            (_, props) => {
                                              onChecked(_, props, [...selectedKeys, ...targetKeys], itemSelect,itemSelectAll);
                                            }
                                          "
                                                    />
                                                </template>
                                            </a-transfer>
                                        </div>
                                    </a-modal>
                                </template>
                            </a-table>
                        </a-form-item>

                        <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
                            <a-button type="primary" @click="saveData()">
                                保存
                            </a-button>
                            <!--<a-button type="primary" :style="{ marginLeft: '8px' }">
                                返回
                            </a-button>-->
                        </a-form-item>
                    </a-form>
                </a-layout-content>
            </a-layout>
        </a-spin>
    </div>
</template>

<script>
    import moment from 'moment'
    import mallMerchantApi from '@/api/mall/merchant/index'
    import Vue from 'vue'
    import {transfer} from 'ant-design-vue'

    Vue.use(transfer)
    const formTailLayout = {
        labelCol: {span: 4},
        wrapperCol: {span: 8, offset: 4},
    };
    let treeData = [];
    let my_targetKeys = [];
    const transferDataSource = [];

    function flatten(list = []) {
        list.forEach(item => {
            transferDataSource.push(item);
            flatten(item.children);
        });
    }

    function isChecked(selectedKeys, eventKey) {
        return selectedKeys.indexOf(eventKey) !== -1;
    }

    function handleTreeData(data, targetKeys = []) {
        data.forEach(item => {
            if (item.children) {
                handleTreeData(item.children, targetKeys);
            }
        });
        return data;
    }

    const columns1 = [
        {
            title: '可配送区域',
            dataIndex: 'name',
            key: 'name',
            slots: {title: 'customTitle'},
            scopedSlots: {customRender: 'name'},
        },
        {
            title: '操作',
            dataIndex: 'action',
            width: '20%',
            key: 'action',
            scopedSlots: {customRender: 'action'},
        },
        {
            title: '首件(件)',
            init: 1,
            step: 1,
            dataIndex: 'first_weight',
            width: '15%',
            key: 'first_weight',
            scopedSlots: {customRender: 'first_weight'},
        },
        {
            title: '运费(元)',
            init: 0,
            step: 0.01,
            dataIndex: 'first_freight',
            width: '15%',
            key: 'first_freight',
            scopedSlots: {customRender: 'first_freight'},
        },
        {
            title: '续件(件)',
            key: 'add_weight',
            init: 0,
            step: 1,
            dataIndex: 'add_weight',
            width: '15%',
            scopedSlots: {customRender: 'add_weight'},
        },
        {
            title: '运费(元)',
            init: 0,
            step: 0.01,
            key: 'add_freight',
            dataIndex: 'add_freight',
            width: '15%',
            scopedSlots: {customRender: 'add_freight'},
        },
    ];

    const columns2 = [
        {
            title: '可配送区域',
            dataIndex: 'name',
            key: 'name',
            slots: {title: 'customTitle'},
            scopedSlots: {customRender: 'name'},
        },
        {
            title: '操作',
            dataIndex: 'action',
            width: '20%',
            key: 'action',
            scopedSlots: {customRender: 'action'},
        },
        {
            title: '首重(KG)',
            init: 0,
            step: 0.1,
            dataIndex: 'first_weight',
            width: '15%',
            key: 'first_weight',
            scopedSlots: {customRender: 'first_weight'},
        },
        {
            title: '运费(元)',
            init: 0,
            step: 0.01,
            dataIndex: 'first_freight',
            width: '15%',
            key: 'first_freight',
            scopedSlots: {customRender: 'first_freight'},
        },
        {
            title: '续重(KG)',
            key: 'add_weight',
            init: 0,
            step: 1,
            dataIndex: 'add_weight',
            width: '15%',
            scopedSlots: {customRender: 'add_weight'},
        },
        {
            title: '续费(元)',
            init: 0,
            step: 0.01,
            key: 'add_freight',
            dataIndex: 'add_freight',
            width: '15%',
            scopedSlots: {customRender: 'add_freight'},
        },
    ];

    export default {
        name: "TemplateEdit",
        data() {
            return {
                is_disabled: false,
                disabled: false,
                columns: columns1,
                formTailLayout,
                loading: false,
                visible: false,
                is_put: true,
                spinning: false,
                first_weight: "",
                first_freight: "",
                add_weight: "",
                add_freight: "",
                freight_type: 1,
                freight: 0,
                tem_id: 0,
                mer_id: 0,
                areas: [],
                areas_name: [],
                get_area_id: [],
                vid: 0,
                up_id: 0,
                check_id: 0,
                event_code: '',
                formData: {
                    name1: '', // 模板名称
                    freight_type: 1, // 计费方式
                    data: []
                },
                targetKeys: [],
                dataSource: transferDataSource,
                son_list: [],
                check_prov: [],
                show_status: 0,
                sel_pro: [],//选择的省份
            };
        },
        computed: {
            treeData() {
                return handleTreeData(treeData, this.targetKeys);
            },
        },
        watch: {
            '$route.query.tid': {
                deep: true,
                handler(val) {
                    if (!val || val * 1 == 0) {
                        this.formData = {
                            name1: '', // 模板名称
                            freight_type: 1, // 计费方式
                            data: [],
                        }
                        this.is_disabled = false
                        this.get_area_id = []
                        this.tem_id = 0
                    } else {
                        this.is_disabled = true
                        this.tem_id = this.$route.query.tid
                        this.request(mallMerchantApi.editTemplate, {tid: this.tem_id}).then((res) => {
                            this.formData.name1 = res.name
                            this.formData.freight_type = res.freight_type
                            this.formData.data = res.value_list
                            this.get_area_id = res.already_check
                            this.mer_id = res.mer_id;
                            this.columns = res.freight_type == 1 ? columns1 : columns2;
                        })
                    }
                }
            }
        },
        created() {
            this.tem_id = this.$route.query.tid || 0
            let tid = localStorage.getItem('tid')
            if (tid * 1 == 0) {
                this.tem_id = 0
            }
            if (this.tem_id) {
                this.request(mallMerchantApi.editTemplate, {tid: this.tem_id}).then((res) => {
                    this.formData.name1 = res.name
                    this.formData.freight_type = res.freight_type
                    this.formData.data = res.value_list
                    this.get_area_id = res.already_check
                    this.mer_id = res.mer_id
                    this.columns = res.freight_type == 1 ? columns1 : columns2;
                })
            }

        },
        methods: {
            moment,
            showModal(status) {
                this.show_status = status
                treeData = []
                my_targetKeys = []
                this.targetKeys = []
                let pareas = {vid: this.up_id}
                this.request(mallMerchantApi.getTemplateAreaList, pareas).then((res) => {
                    for (let j = 0; j < res.province_list.length; ++j) {
                        let obj = {}
                        if (this.get_area_id.length > 0 && status == 1) {//判断上一次确定有没有选择的区域
                            let getKey = this.get_area_id.indexOf(res.province_list[j].area_id.toString())
                            if (getKey * 1 == -1) {
                                obj = {
                                    key: res.province_list[j].area_id.toString(),
                                    title: res.province_list[j].area_name,
                                    level: res.province_list[j].area_type,
                                }
                            } else {
                                obj = {
                                    key: res.province_list[j].area_id.toString(),
                                    title: res.province_list[j].area_name,
                                    level: res.province_list[j].area_type,
                                    disabled: true
                                }
                            }
                        } else {
                            obj = {
                                key: res.province_list[j].area_id.toString(),
                                title: res.province_list[j].area_name,
                                level: res.province_list[j].area_type,
                            }
                        }
                        if (res.province_list[j].son_list && res.province_list[j].son_list.length > 0) {
                            obj.children = this.getSonList(res.province_list[j].son_list, status)
                        }
                        treeData.push(obj)
                    }
                    if (res.area_list.length > 0) {
                        for (let p = 0; p < res.area_list.length; ++p) {
                            my_targetKeys[p] = res.area_list[p].area_id + "";
                        }
                        this.targetKeys = my_targetKeys
                    } else {
                        if (this.check_id > 0 && status == 0) {
                            this.targetKeys = this.areas_name[this.check_id]
                        } else if (this.check_id > 0 && status == 1) {//不是点击修改，直接点击指定可配送区域
                            this.targetKeys = []
                        }
                    }
                    console.log(this.sel_pro,"this.sel_pro===this.sel_pro==this.sel_pro")
                    if (this.sel_pro.length > 0 && status == 0) {//加入省,给省也打钩，右边会多一个省名，但是不会保存省id到表
                        for (let j = 0; j < this.formData.data.length; j++) {//当选择修改的时候，避免不是当前项的省出现在右边栏中
                            if (this.formData.data[j]['id'] == this.up_id) {
                                this.targetKeys.forEach(item => {
                                    var index1 = this.formData.data[j]['areas'].indexOf(item.toString())//去掉省份的id
                                    if (index1 == -1) {
                                        let va = this.targetKeys.indexOf(item.toString())
                                        this.targetKeys.splice(va, 1)
                                    }
                                });
                            }
                        }

                        /*this.sel_pro.forEach(item => {
                            let getKey1 = this.targetKeys.indexOf(item)
                            if (getKey1 * 1 == -1) {
                                this.targetKeys.push(item)
                            }
                        });*/
                    }
                    flatten(JSON.parse(JSON.stringify(treeData)));
                    this.visible = true;
                })
            },
            handleOk(e) {
                let data = this.formData.data || []
                this.request(mallMerchantApi.getTemplateAreaNameList, {arrs: this.targetKeys}).then((res) => {
                    if (res == "") {
                        this.$message.error('请选择城市到右边展示区内！')
                    } else {
                        let obj1 = {
                            vid: 0,
                            id: res.id,
                            name: res.area_name,
                            first_weight: 0,
                            freight: 0,
                            first_freight: 0,
                            add_weight: 0,
                            add_freight: 0,
                            areas: this.unique(this.targetKeys),
                        }
                        if (this.up_id > 0) {
                            for (let j = 0; j < this.formData.data.length; j++) {
                                if (this.formData.data[j]['id'] == this.up_id) {
                                    if (this.show_status == 0) {
                                        obj1.first_weight = this.formData.data[j]['first_weight']
                                        obj1.freight = this.formData.data[j]['freight']
                                        obj1.first_freight = this.formData.data[j]['first_freight']
                                        obj1.add_weight = this.formData.data[j]['add_weight']
                                        obj1.add_freight = this.formData.data[j]['add_freight']
                                    }
                                    this.formData.data.splice(j, 1, obj1)
                                }
                            }
                        } else {
                            data.push(obj1)
                            this.$set(this.formData, 'data', data)
                        }
                        //给选中的get_area_id赋值，防止重选
                        this.visible = false
                        this.areas_name[res.id] = this.targetKeys
                        if (this.targetKeys.length > 0) {
                            for (let i = 0; i < this.targetKeys.length; i++) {//给确定选择地方赋值给一个数组，作用是选择过得不得再选
                                this.get_area_id.push(this.targetKeys[i])
                            }
                        }

                        if (res.area_pid.length > 0) {
                            for (let k = 0; k < res.area_pid.length; k++) {
                                this.get_area_id.push(res.area_pid[k])
                                let getKey = this.get_area_id.indexOf(res.area_pid[k].toString())
                                this.sel_pro[getKey] = res.area_pid[k]
                            }
                        }

                        this.targetKeys = []
                        this.up_id = 0
                    }
                })
            },
            handleCancel(e) {
                this.visible = false;
                treeData = []
            },
            updateTem(id) {
                this.up_id = id
                this.check_id = id
                this.showModal(0)
            },
            delTem(id) {
                for (let j = 0; j < this.formData.data.length; j++) {
                    if (this.formData.data[j]['id'] == id) {
                        if (this.formData.data[j]['areas'].length > 0) {//去掉禁用的项，让他们可以选择
                            this.formData.data[j]['areas'].forEach(item => {
                                var index1 = this.get_area_id.indexOf(item + "")//去掉省份的id
                                if (index1 > -1) {
                                    this.get_area_id.splice(index1, 1)
                                }
                            });
                            if (this.sel_pro.length > 0) {
                                this.sel_pro.forEach(item1 => {
                                    var index2 = this.get_area_id.indexOf(item1 + "")//去掉省份的id
                                    if (index2 > -1) {
                                        this.get_area_id.splice(index2, 1)
                                    }
                                });
                            }
                        }
                        this.formData.data.splice(j, 1);
                    }
                }
            },
            unique(arr) {
                if (!Array.isArray(arr)) {
                    return []
                }
                var array = []
                for (var i = 0; i < arr.length; i++) {
                    if (array.indexOf(arr[i]) === -1) {
                        array.push(arr[i])
                    }
                }
                return array
            },
            changeRadio() {
                if (this.formData.freight_type == 1) {
                    this.columns = columns1;
                } else {
                    this.columns = columns2;
                }
            },
            onChange(targetKeys, direction, moveKeys) {
                if (direction == 'right') {
                    console.log(this.event_code,"this.event_code==this.event_code")
                    /*var index = targetKeys.indexOf(this.event_code)//去掉省份的id
                    if (index > -1) {
                        targetKeys.splice(index, 1)
                    }*/
                    this.targetKeys = targetKeys
                    //如果你还要有其他需求，在里面可以再判断
                }
                // 但是，想要穿梭到左边来，得这样写
                if (direction == 'left') {
                    if (moveKeys.length == 0) {
                        window.location.reload()
                    }
                    moveKeys.forEach(item => {
                        var index = targetKeys.indexOf(item + "")//去掉省份的id
                        if (index > -1) {
                            targetKeys.splice(index, 1)
                        }
                        this.targetKeys = targetKeys
                        var index1 = this.get_area_id.indexOf(item + "")//去掉省份的id
                        if (index1 > -1) {
                            this.get_area_id.splice(index1, 1)
                        }
                        var index2 = this.sel_pro.indexOf(item + "")//去掉省份的id
                        if (index2 > -1) {
                            this.sel_pro.splice(index2, 1)
                        }
                    });

                    if (this.sel_pro.length > 0) {
                        this.sel_pro.forEach(item1 => {
                            var index2 = this.get_area_id.indexOf(item1 + "")//去掉省份的id
                            if (index2 > -1) {
                                this.get_area_id.splice(index2, 1)
                            }
                        });
                    }
                }
            },
            onChecked(_, e, checkedKeys, itemSelect, itemSelectAll) {
                const {eventKey} = e.node;
                let level = e.node.dataRef.level || ''
                let children = e.node.dataRef.children || []
                let checked = e.checked || false
                if (level == 1 && children.length) {
                    if (checked) {
                        this.event_code = eventKey
                        checkedKeys.push(eventKey)
                        children.forEach(item => {
                            checkedKeys.push(item.key)
                        })
                    } else {
                        let childrenKey = children.map(item => item.key)
                        childrenKey.push(eventKey)
                        checkedKeys = checkedKeys.filter(item => {
                            if (childrenKey.indexOf(item) != -1) {
                                return item
                            }
                        })
                    }
                    itemSelectAll(checkedKeys, checked);
                } else {
                    itemSelect(eventKey, !isChecked(checkedKeys, eventKey));
                }
            },
            getSonList(arr, status) {
                this.son_list = [];
                if (arr.length > 0) {
                    for (let j = 0; j < arr.length; ++j) {
                        if (this.get_area_id.length > 0 && status == 1) {//判断上一次确定有没有选择的区域
                            let getKey = this.get_area_id.indexOf(arr[j].area_id.toString())
                            if (getKey * 1 == -1) {
                                this.son_list.push({
                                    key: arr[j].area_id.toString(),
                                    title: arr[j].area_name,
                                    disabled: false,
                                });
                            } else {
                                this.son_list.push({
                                    key: arr[j].area_id.toString(),
                                    title: arr[j].area_name,
                                    disabled: true,
                                });
                            }
                        } else {
                            this.son_list.push({
                                key: arr[j].area_id.toString(),
                                title: arr[j].area_name,
                                disabled: false,
                            });
                        }

                    }
                }
                return this.son_list;
            },
            handleScroll(direction, e) {
                console.log('direction:', direction);
                console.log('target:', e.target);
            },
            saveData() {
                let param = {};
                if (this.tem_id) {
                    param = {
                        tpl_id: this.tem_id,
                        name: this.formData.name1,
                        datas: this.formData.data,
                        freight_type: this.formData.freight_type
                    }
                } else {
                    param = {
                        tpl_id: 0,
                        name: this.formData.name1,
                        datas: this.formData.data,
                        freight_type: this.formData.freight_type
                    }
                }
                if (this.formData.data.length == 0) {
                    this.$message.error('请选择可配送区域再提交！')
                } else {
                    this.request(mallMerchantApi.addTemplate, param).then((res) => {
                        if (res.status == 1) {
                            this.$message.success('提交成功！')
                            this.sel_pro = []
                            this.get_area_id = []
                            this.$set(this.formData, 'data', [])
                            this.$router.push({
                                path: '/merchant/merchant.mall/templateList'
                            })
                        } else {
                            this.$message.error(res.msg)
                        }
                    })
                }
            },
            getAreaidExit(area_id) {
                /*if (this.areas_name.length > 0) {
                    this.areas_name.forEach((item) => {
                        console.log(item, "item======item");
                    })
                }*/
            }
        }
    }
</script>

<style scoped>
    .tree-transfer .ant-transfer-list:first-child {
        width: 50%;
        flex: none;
    }
</style>