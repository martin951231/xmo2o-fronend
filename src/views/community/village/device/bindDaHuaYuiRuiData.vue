<template>
    <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form" class="project_info_1">
                <a-form-item :label="record.orgTypeTxt + '名称'" :labelCol="labelCol"  :wrapperCol="wrapperCol">
                   {{record.orgName}}
                </a-form-item>
                <a-form-item v-if="record.buildingNumber" :label="record.orgTypeTxt + '编号'" :labelCol="labelCol"  :wrapperCol="wrapperCol">
                   {{record.buildingNumber}}
                </a-form-item>
                <a-form-item v-if="record.id" :label="record.orgTypeTxt + 'ID'" :labelCol="labelCol"  :wrapperCol="wrapperCol">
                   {{record.id}}
                </a-form-item>
                <a-form-item v-if="record.orgCode" :label="record.orgTypeTxt + '组织编码'" :labelCol="labelCol"  :wrapperCol="wrapperCol">
                   {{record.orgCode}}
                </a-form-item>
                <a-form-item v-if="record.unitNum" :label="$store.getters.config.floor_name+'数量'" :labelCol="labelCol"  :wrapperCol="wrapperCol">
                   {{record.unitNum}}
                </a-form-item>
                <a-form-item v-if="record.floorNum" :label="$store.getters.config.floor_name+'楼层数'" :labelCol="labelCol"  :wrapperCol="wrapperCol">
                   {{record.floorNum}}
                </a-form-item>
                <a-form-item v-if="record.houseNum" label="楼层房屋数" :labelCol="labelCol"  :wrapperCol="wrapperCol">
                   {{record.houseNum}}
                </a-form-item>
                <a-form-item v-if="record.totalHouseNum" label="房屋总数" :labelCol="labelCol"  :wrapperCol="wrapperCol">
                   {{record.totalHouseNum}}
                </a-form-item>
                <a-form-item v-if="record.sysModel" label="同步匹配" :labelCol="labelCol"  :wrapperCol="wrapperCol">
                   {{record.sysModel}}
                </a-form-item>
                <a-form-item v-if="record.sysModelName" label="匹配对象" :labelCol="labelCol"  :wrapperCol="wrapperCol">
                   {{record.sysModelName}}
                </a-form-item>
                <a-form-item v-if="record.orgType!=12" label="同步机制" :required="true" :labelCol="labelCol" :wrapperCol="wrapperCol">
                     <a-radio-group v-model="record.auto_syn" button-style="solid" @change="onChange">
                        <a-radio-button value="0">
                        手动匹配同步
                        </a-radio-button>
                        <a-radio-button value="1">
                        自动匹配同步
                        </a-radio-button>
                    </a-radio-group>
                    <div>&nbsp;默认是手动匹配同步，选择了自动匹配同步 会以序号对应数据进行关联，关联不上的需要额外进行手动匹配。</div>
                </a-form-item>
                <a-form-item v-if="record.isSyn!=1" :label="'选择同步'+record.orgTypeTxt" :required="true" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-select
                        show-search
                        :placeholder="'选择同步'+record.orgTypeTxt"
                        option-filter-prop="children"
                        :filter-option="filterOption"
                        :value="bindId"
                        style="width: 50%"
                        @change="handleChange"
                    >
                        <a-select-option v-for="(item, index) in singleList" :key="index" :value="item.id">
                        {{ item.name }}{{item.sysTxt}}
                        </a-select-option>
                    </a-select>
                  
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>
<style lang="less" scoped>
    .imgname{
        width: 100px;
    }

    /deep/ .project_info_1 .ant-form-item{
        margin-left: 30px !important;
        margin-bottom: 15px !important;
    }
    /deep/ .project_info_1 .label_col{
        margin-right: 30px !important;
        font-weight: bold !important;
    }
    /deep/ .project_info_1 .ant-form-item .ant-col-sm-13{
        width: 100% !important;
    }
    /deep/ .ant-form-item .label{
        width: 116px !important;
    }
    /deep/ .project_info_1 .ant-upload-picture-card-wrapper{
        width: 15% !important;
    }
</style>
<script>
    import villageApi from '@/api/community/village';

    export default {
        components: {
        },
        data() {
            return {
                title: '绑定',
                labelCol: {
                    span: 4
                },
                wrapperCol: {
                    span: 20
                },
                confirmLoading: false,
                form: this.$form.createForm(this),
                visible: false,
                record:{},
                bindId: '',
                relatedType: 'build',
                singleList: [],
                
            }
        },
        mounted () {
        },
        methods: {
            handleChange(selectedItems) {
                console.log('selectedItems', selectedItems)
                this.bindId = selectedItems;
            },
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            bindDHBuildUnitRoomsList(param) {
                this.request(villageApi.bindDHBuildUnitRoomsList, param).then((res) => {
                    this.singleList = res.list;
                    console.log('this.singleList', this.singleList)
                    var that = this;
                })
            },
            bind(record, parent_bind_id=0, type = 'edit') {
                let param = {
                    'orgType' : record.orgType,
                    'parent_bind_id' : parent_bind_id
                };
                this.singleList = [];
                this.bindId = '';
                this.bindDHBuildUnitRoomsList(param);
                this.record  = record;
                this.title   = '绑定' + record.orgTypeTxt;
                this.visible = true;
                if (record.orgType == 10) {
                    this.relatedType = 'build';
                } else if (record.orgType == 11) {
                    this.relatedType = 'unit';
                } else if (record.orgType == 12) {
                    this.relatedType = 'room';
                }
                this.type = type;
            },
            onChange(e) {
                console.log(`checked = ${e.target.value}`);
                this.record.auto_syn = e.target.value;
            },
            handleSubmit() {
                if (this.type == 'look') {
                    this.handleCancel();
                } else {
                    console.log(`record`, this.record);
                    console.log(`relatedType = ${this.relatedType}`);
                    console.log(`bindId = ${this.bindId}`);
                    this.confirmLoading = true;
                    let url = villageApi.bindDHBuildUnitRoom;
                    if (this.record.bind_id && !this.bindId) {
                        this.bindId = this.record.bind_id;
                    }
                    let param = {
                        'orgParam': this.record,
                        'bindId': this.bindId,
                        'relatedType': this.relatedType,
                    };
                    console.log('相关数据param', param)
                    this.request(url, param)
                        .then((res) => {
                            this.confirmLoading = false
                            if (this.record.bind_id && this.record.auto_syn == '1') {
                                this.$message.success('自动下发指令执行中')
                            } else if (this.record.bind_id) {

                            } else {
                                this.$message.success('绑定成功')
                            }
                            setTimeout(() => {
                                this.form = this.$form.createForm(this)
                                this.visible = false
                                this.confirmLoading = false
                                this.$emit('ok');
                            }, 1500)
                            console.log('相关数据res', res)
                        })
                        .catch((error)=>{
                            this.confirmLoading = false
                        })
                }
            },
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.form = this.$form.createForm(this)
                }, 500)
            },
        },
    }
</script>