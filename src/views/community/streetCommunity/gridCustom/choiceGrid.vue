<template>
    <a-modal :title="title" :width="600" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"
             @ok="handleSubmit" @cancel="handleCancel">
        <a-tree
                v-if="visible"
                :default-expand-all="show"
                :tree-data="treeData"
                :default-selected-keys="[]"
                :default-checked-keys="checkedKeysArr"
                :auto-expand-parent="show"
                :default-expand-parent="show"
                @select="onSelect"
                @check="onCheck"
        >
        </a-tree>
    </a-modal>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    export default {
        data() {
            return {
                show:true,
                is_show: false,
                title: '添加',
                treeData: [],
                visible: false,
                confirmLoading: false,
                id: 0,
                type: 0,
                selectedKey: [],
                checkedKey:[],
                checkedKeysArr:[],
                checkedKeysArrTemp:[],
                keyInfo:[],
                index: 0,
                data:[]
            }
        },
        methods: {
            getList(data) {
                this.title = '选择社区';
                this.selectedKey = []
                this.checkedKey= [];
                this.keyInfo=[];
                this.checkedKeysArrTemp=[];
                this.checkedKey=this.checkedKeysArrTemp;
                this.is_show = true
                this.data=data;
                this.request(streetCommunityApi.getStreetCommunityTissueNav).then((res) => {
                    this.treeData = res.data;
                    this.keyInfo=res.key;
                    console.log('resTree', res)
                    this.checkedKeysArr= this.checkedKeysArrTemp;
                    this.visible = true
                    this.show=true
                })
            },
            onSelect(selectedKeys, info) {
                this.selectedKey = selectedKeys;
            },
            onCheck(checkedKeys, info) {
                this.checkedKey = checkedKeys;
            },
            handleSubmit() {
                let that = this;
                let str=that.keyInfo[that.selectedKey[0]];
                if(that.selectedKey.length <= 0){
                    that.$message.error('请选择一个部门/社区');
                    return false;
                }
                that.$confirm({
                    title: '操作提示',
                    cancelText:'取消',
                    okText:"确定",
                    content: '确定绑定【'+str+'】？',
                    onOk() {
                        that.$emit('change', that.data,that,that.selectedKey);
                    },
                    onCancel() {},
                });
            },
            handleCancel() {
                this.selectedKey = [];
                this.checkedKey= [];
                this.visible = false
                this.is_show = false
                this.checkedKeysArr=[];
                this.checkedKeysArrTemp=[];
            },
        },
    }
</script>
<style scoped>
    .ant-form-item label {
        width: 50px;
    }

    .tip-txt {
        margin-left: 4px;
        font-size: 12px;
    }

    .add-box-tip {
        text-align: -webkit-center;
        padding: 0 6px;
        margin-left: 8px;
        border-radius: 15px;
        border: none;
    }
</style>