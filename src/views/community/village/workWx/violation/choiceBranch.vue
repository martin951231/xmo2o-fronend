<template>
    <a-modal
            title="选择企业成员"
            :width="850"
            :height="588"
            :visible="visible"
            :confirmLoading="confirmLoading"
            @ok="handleSubmit"
            @cancel="handleCancel"
    >
        <div class="container">
            <div class="box_left">
                <a-input-search v-if="isSearch" style="margin-bottom: 8px" placeholder="搜索成员" @search="onSearch"/>
                <a-tree :blockNode=blockNode multiple :tree-data="treeData" show-icon default-expand-all @select="onSelect" :selectedKeys="enterprise_staff_arr">
                    <a-icon slot="switcherIcon" type="down" />
                    <a-icon slot="cluster" type="cluster" />
                    <a-icon slot="user" type="user" />
                </a-tree>
            </div>
            <div class="box_right">
                <span>已选择的成员</span>
                <a-empty v-if="enterprise_staff_arr == ''" :image="simpleImage" class="a-empty" />
                <a-list v-else item-layout="horizontal" :data-source="enterprise_staff_arr" >
                    <a-list-item slot="renderItem" slot-scope="item, index">
                        <div class="list_box" style="width: 7%"><img src="../../../../../assets/image/department_user.png"></div>
                        <div class="list_box" style="width: 83%">{{ item.split('-')[1] }}</div>
                        <div class="list_box" style="width: 10%" @click="delStaff(index)"><img src="../../../../../assets/image/del.png" style="margin-right: 5px"></div>
                    </a-list-item>
                </a-list>
            </div>
        </div>
    </a-modal>
</template>
<script>
    import configVillageApi from '@/api/community/village'
    import { Empty } from 'ant-design-vue';
    import { getSystemName } from '@/utils/util'
    const treeData = [
        {

        },
    ];
    export default {
        data () {
            return {
                visible:false,
                confirmLoading:false,
                enterprise_staff_arr:[],
                simpleImage : Empty.PRESENTED_IMAGE_SIMPLE,
                blockNode:true,
                treeData,
                tokenName: '',
                sysName: '',
                isSearch:false,
                isSearchStaff:0,
            }
        },
        methods: {
            onSearch(value) {
                console.log(value);
                let param = {};
                if (this.tokenName) {
                    param['tokenName'] = this.tokenName;
                }
                param['name'] = value;
                this.request(configVillageApi.getWorker,param).then((res)=>{
                    if(res != ''){
                        var index = this.enterprise_staff_arr.indexOf(res);
                        if(index < 0){
                            this.enterprise_staff_arr.push(res);
                        }
                        console.log('0416',this.enterprise_staff_arr);
                    }
                })
            },
            //无搜索框
            choose(type=0){
                this.isSearch=false;
                let sysName = getSystemName(location.hash);
                if (sysName) {
                    this.tokenName = sysName + '_access_token';
                    this.sysName = sysName;
                } else {
                    this.sysName = 'village';
                }
                this.isSearchStaff=type;
                this.visible = true;
                this.getTissueNav();
                this.enterprise_staff_arr = [];
            },
            //有搜索框
            chooseSearch(){
                this.isSearch=true;
                this.isSearchStaff=0;
                let sysName = getSystemName(location.hash);
                if (sysName) {
                    this.tokenName = sysName + '_access_token';
                    this.sysName = sysName;
                } else {
                    this.sysName = 'village';
                }
                this.visible = true;
                this.getTissueNav();
                this.enterprise_staff_arr = [];
            },
            getTissueNav(){
                let param = {};
                if (this.tokenName) {
                    param['tokenName'] = this.tokenName;
                }
                //todo 加类型以区分
                param['type_']=1;
                this.request(configVillageApi.getTissueNav,param).then((res)=>{
                    this.treeData = res;
                })
            },
            onSelect(selectedKeys, info) {
                console.log(selectedKeys);

                if(this.isSearchStaff == 1){
                   if(selectedKeys.length > 1){
                       this.$message.warning('仅可选择一位成员');
                       return false;
                   }
                }
                this.enterprise_staff_arr = selectedKeys;
            },
            delStaff(i){
                let that = this;
                console.log('enterprise_staff_arr',this.enterprise_staff_arr);
                that.enterprise_staff_arr = that.removeByIndex(that.enterprise_staff_arr,i);
            },
            removeByIndex(array, index) {
                return array.filter(function (el, i) {
                    return index !== i;
                });
            },
            handleSubmit () {
                let that = this;
                that.visible = false;
                // let external_userid_arr = [];
                // this.enterprise_staff_arr.filter((item,i)=>{
                //     external_userid_arr[i] = item.split('-')[0];
                // });
                that.$emit('change',this.enterprise_staff_arr);
            },
            handleCancel () {
                this.visible = false;
            },
        }
    }
</script>

<style lang="less" scoped>
    .container{
        width: 800px;
        height: 480px;
    }
    .box_left{
        float: left;
        height: 480px;
        width: 40%;
        overflow: auto;
    }
    .box_right{
        float: right;
        height: 480px;
        width: 49%;
        overflow: auto;
    }
    .box_right span{
        font-size: 14px;
    }
    .box_right .a-empty{
        margin-top: 50px;
    }
    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: rgba(240, 240, 240, 1);
    }

    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 0px rgba(240, 240, 240, .5);
        border-radius: 10px;
        background-color: rgba(240, 240, 240, .5);
    }

    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 0px rgba(240, 240, 240, .5);
        background-color: rgba(240, 240, 240, .5);
    }
    .list_box{
        float: left;
    }
</style>
