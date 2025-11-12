<template>
    <a-modal v-model="visible" :title="isView?L('查看可见区域'):modelTitle" centered @ok="handleOk" :bodyStyle="{maxHeight:'60vh',overflowY:'auto'}">
        <template>
            <a-row style="margin-bottom: 10px" v-if="!isView">
                <a-button type="primary" @click="actionClick('all')">{{L('全选')}}</a-button>
                <a-button type="danger" style="margin: 0 10px" @click="actionClick('resetting')">{{L('重置')}}</a-button>
                <a-upload
                    action="/v20/public/index.php/common/common.UploadFile/uploadFile"
                    :show-upload-list="false"
                    :fileList="fileList"
                    @change="handleUploadChange"
                    :data="{upload_dir:'/mall/goods/images_3'}"
                    name="file"
                    >
                    <a-button style="margin-left:10px" type="primary" :loading="loading">{{L('导入')}}</a-button>
                    <a style="margin-left:10px" @click.stop="downloadTemplate">点击下载模板</a>
                </a-upload>
                <div class="file-list" v-if="fileList.length>0">
                    <span>1、{{fileList[0].name}}</span>
                    <a-icon @click="fileList=[];loading=false" type="delete" />
                </div>
            </a-row>
            <a-tree
                    v-model="checkedKeys"
                    checkable
                    :expanded-keys="expandedKeys"
                    :auto-expand-parent="autoExpandParent"
                    :selected-keys="selectedKeys"
                    :tree-data="treeData"
                    :disabled="isView"
                    @expand="onExpand"
                    @select="onSelect"
            />
        </template>
    </a-modal>
</template>

<script>
    import mallMerchantApi from '@/api/mall/merchant'

    const treeData = [];

    export default {
        name: "GoodsAreaSet",
        props: {
            isView: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                source: '',
                goods_ids: [],
                set_type: 0,
                store_id: 0,
                visible: false,
                modelTitle: "修改展示区域",
                expandedKeys: [],
                autoExpandParent: true,
                checkedKeys: [],
                selectedKeys: [],
                treeData,
                param: {
                    goods_ids: [],
                    set_type: 0,
                    store_id: 0,
                    area_id: [],
                },
                staffTicket: undefined,
                loading: false,
                fileList: []
            }
        },
        watch: {
            checkedKeys(val) {
                this.param.area_id = val
                console.log('onCheck', val);
            },
        },
        methods: {
            show(arr, store_id, set_type,staffTicket = '') {
                this.source = 'add'
                this.param.set_type = set_type
                this.param.goods_ids = arr
                this.param.store_id = store_id
                this.staffTicket = staffTicket
                this.visible = true
                this.treeData = []
                this.checkedKeys = []
                this.selectedKeys = []
                this.request(mallMerchantApi.getAreaList, {staff_ticket:this.staffTicket}).then((data) => {
                    if (data) {
                        this.treeData = data
                    }
                })
            },
            edit(goods_id, store_id,staffTicket) {
                this.staffTicket = staffTicket
                this.request(mallMerchantApi.findAreaList, {goods_id: goods_id, store_id: store_id,staff_ticket:this.staffTicket}).then((data) => {
                    if (data) {
                        this.param.goods_ids = [goods_id]
                        this.param.store_id = store_id
                        this.source = 'edit'
                        this.visible = true
                        this.treeData = data.list
                        this.checkedKeys = this.checkedKeys.concat(data.check_list)
                    }
                })
            },
            onExpand(expandedKeys) {
                // if not set autoExpandParent to false, if children expanded, parent can not collapse.
                // or, you can remove all expanded children keys.
                this.expandedKeys = expandedKeys;
                this.autoExpandParent = false;
            },
            onCheck(checkedKeys) {
                this.checkedKeys = checkedKeys;
            },
            onSelect(selectedKeys, info) {
                this.selectedKeys = selectedKeys;
            },
            handleOk() {
                if(this.isView) {
                    this.visible = false
                    return
                }
                if (this.source == 'add') {
                    this.request(mallMerchantApi.addMallGoodsArea, {...this.param,staff_ticket: this.staffTicket}).then((data) => {
                        if (data) {
                            this.$message.success('修改展示区域成功!')
                            this.visible = false
                        }
                    })
                } else {
                    if (this.checkedKeys.length > 0) {
                        this.$emit('handleAddArea', this.param)
                    } else {
                        this.$emit('handleAddArea', [])
                    }
                    this.visible = false
                    /*this.request(mallMerchantApi.addOneMallGoodsArea, this.param).then((data) => {
                        if (data) {
                            this.visible = false
                        }
                    })*/
                }
            },
            actionClick(type){
                //全选
                if(type == 'all'){
                        let inList = [];
                        function getList(res) {
                            for (let item of res) {
                                inList.push(item.key);
                                if (item.children != null && item.children.length) {
                                    getList(item.children);
                                }
                            }
                        }
                        getList(this.treeData);
                        this.checkedKeys = inList;
                }else if(type == 'resetting'){
                    //取消全选
                    this.checkedKeys = [];
                }else if(type == 'import'){
                    //导入
                    let params = {
                        ...this.param,
                        file_url: this.fileList[0].response.data,
                    }
                    this.loading = true;
                    this.request(mallMerchantApi.importGoodsArea,params).then((data) => {
                        this.loading = false;
                        this.fileList = [];
                        this.$message.success('导入成功！');
                        this.checkedKeys = [];

                        setTimeout(()=>{
                            this.treeData = data;
                            this.actionClick('all')
                        },300)
                    }).catch(err=>{
                        if(err.status == 1003){
                            this.fileList = [];
                            this.loading = false;
                        }
                    })
                }
            },
            //下载模板
            downloadTemplate(){
                window.open('/static/file/add_mall_goods_area_temp.xlsx')
            },
            handleUploadChange(info){
                this.fileList = info.fileList;
                if (info.file.status === 'uploading') {
                    this.loading = true;
                    return;
                }
                if (info.file.status === 'done') {
                    let file = info.file.response?info.file.response:null
                    if(file && file.status == 1003){
                        this.$message.error(info.file.response.msg);
                        this.fileList = [];
                        this.loading = false;
                    }
                    if(file && file.status == 1000){
                        this.actionClick('import');
                    }
                }
            },
        },
    }
</script>

<style scoped>
.file-list{
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}
.file-list:hover{
    background: #e6f7ff;
}
</style>