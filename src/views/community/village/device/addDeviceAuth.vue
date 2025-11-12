<template>
    <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form" class="project_info">
                <a-form-item label="选择对应绑定住户" :labelCol="labelCol"  :wrapperCol="wrapperCol">
                    <a-tree checkable class="draggable-tree" :defaultExpandedKeys="[]" :defaultExpandParent="true" :show-line="true"
                        :tree-data="gData" @select="onSelect"
                        v-model="checkedKeys"
                        :selected-keys="selectedKeys"
                        @expand="onExpand" 
                        :auto-expand-parent="autoExpandParent">
                        <img class="icon_size" src="@/views/community/village/charge/images/fangjian.png" slot="room"/>
                        <img class="icon_size" src="@/views/community/village/charge/images/loudong-disable.png" slot="single_empty"/>
                        <img class="icon_size" src="@/views/community/village/charge/images/louceng-disable.png" slot="layer_empty"/>
                        <img class="icon_size" src="@/views/community/village/charge/images/danyuan-disable.png" slot="floor_empty"/>
                    </a-tree>
                </a-form-item>
                <a-form-item label="选择对应绑定员工" :labelCol="labelCol"  :wrapperCol="wrapperCol">
                   
                    <a-select
                        mode="multiple"
                        show-search
                        placeholder="选择对应绑定员工"
                        option-filter-prop="children"
                        :filter-option="filterOption"
                        :value="workIds"
                        style="width: 50%"
                        @change="handleChange"
                    >
                        <a-select-option v-for="(item, index) in work_list" :key="index" :value="item.wid">
                        {{ item.name }}
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
    
    /deep/ .draggable-tree {
        .ant-tree-title {
            display: flex;
            flex-direction: row;
            width: 307px;
            justify-content: space-between;
        }
        .icon_size{
            width: 16px;
        }
    }
</style>
<script>
    import villageApi from '@/api/community/village';
	import store from '@/store';
    export default {
        components: {
        },
        data() {
            return {
                title: '新建',
                labelCol: {
                    span: 4
                },
                wrapperCol: {
                    span: 20
                },
                confirmLoading: false,
                form: this.$form.createForm(this),
                visible: false,
                autoExpandParent: true,
                gData: [],
                selectedKeys: [],
                checkedKeys: [],
                workData: [],
                workSelectedKeys: [],
                workCheckedKeys: [],
                show: false,
                device_id: 0,
                work_list: [],
                workIds: [],
            }
        },
        mounted() {
        },
        methods: {
            handleChange(selectedItems) {
                console.log('selectedItems', selectedItems)
                this.workIds = selectedItems;
            },
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            onSelect(checkedKeys) {
                console.log('1onCheck', checkedKeys);
                this.checkedKeys = checkedKeys;
            },
            onExpand(expandedKeys, expandedObj) {
                console.log('onExpand', expandedKeys)
            },
            onWorkSelect(checkedKeys) {
                console.log('onCheck', checkedKeys);
                this.workCheckedKeys = checkedKeys;
            },
            onWorkExpand(expandedKeys, expandedObj) {
                console.log('onExpand', expandedKeys)
            },
            add(device_id) {
                this.confirmLoading   = true;
                this.device_id        = device_id;
                this.gData            = [];
                this.selectedKeys     = [];
                this.checkedKeys      = [];
                this.workData         = [];
                this.workSelectedKeys = [];
                this.workCheckedKeys  = [];
                this.workIds          = [];
                this.title            = '添加权限';
                this.visible          = true;
                this.getHouseTissueNav();
                this.getTissueNav();
            },
            getHouseTissueNav() {
                this.request(villageApi.getHouseTissueNav, {select: 0,title: store.getters.config.house_name+'全体住户',isAllChoose: 1}).then(res => {
                    this.gData = res;
                    var that = this;
                    setTimeout(function() {
                        that.autoExpandParent = true;
                        that.show = true;
                        that.confirmLoading = false;
                    },300)
                })
            },
            getTissueNav() {
                this.request(villageApi.deviceVillageWorksAuth, {device_id : this.device_id}).then(res => {
                    console.log('deviceVillageWorksAuth+++++++', res)
                     if (res.work_list) {
                        this.work_list = res.work_list
                    }
                })
            },
            handleSubmit() {
                console.log('this.workIds', this.workIds)
                console.log('this.checkedKeys', this.checkedKeys)
                console.log('this.device_id', this.device_id)
                this.confirmLoading = true;
                let url = villageApi.dhAddDeviceAuth;
                let param = {
                    'device_id'   : this.device_id,
                    'workIds'     : this.workIds,
                    'checkedKeys' : this.checkedKeys,
                };
                this.request(url, param)
                    .then((res) => {
                        this.confirmLoading = false
                        this.$message.success('绑定成功')
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