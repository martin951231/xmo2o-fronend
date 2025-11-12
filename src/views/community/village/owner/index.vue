<template>
    <div class="owner_content">
        <div class="top_con">
            <a-button type="danger" :disabled="!hasSelected" :loading="loading" @click="start">删除选中</a-button>
        </div>
        <a-tooltip>
            <template slot="title">
               徽标说明
            </template>
            <a-badge status="warning" text="尚未绑定微信" /><a-divider type="vertical" />
            <a-badge status="error" :text="'尚不是平台用户（注：将无法使用'+$store.getters.config.house_name+'服务）'" /><a-divider type="vertical" />
            <a-badge status="processing" text="既不是平台用户也未绑定微信" />
        </a-tooltip>
        <a-table
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="columns"
            :row-key="record => record.id"
            :data-source="data"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange">
            <template slot="status" slot-scope="status"> <span :class="status ? 'status-color-ok' : 'status-color-fail'"> {{ status ? "开启" : "关闭" }} </span> </template>
            <template slot="bind_number" slot-scope="text, record">   {{ record.bind_number ? record.bind_number : record.usernum }}   </template>
            <template slot="username" slot-scope="text, record">
               <span v-if="record.name">
                     <a-badge v-if="!record.uid && !record.openid" status="processing" :text="record.name" />
                     <a-badge v-else-if="!record.uid" status="error" :text="record.name" />
                     <a-badge v-else-if="!record.openid" status="warning" :text="record.name" />
                    <span v-else >{{record.name}}</span>
               </span>
            </template>
            <template slot="propertyStartEndTime" slot-scope="text,record">
                {{record.property_starttime}}~{{record.property_endtime}}
            </template>
            <span slot="action" slot-scope="text, record">
                <a @click="getPersonInfo(record)">查看/编辑</a>
                <a-divider type="vertical"/>
                <a-popconfirm >
                    <a style="color: red;">删除</a>
                </a-popconfirm>
            </span>
        </a-table>
        <roomInfo :visible="roomVisible" :title="roomDrawerTitle" @closeRoom="onRoomClose" />
    </div>
</template>

<script>
import Vue from 'vue';
import {
    ref,
    watch,
    computed,
    reactive,
    onMounted,
    onUpdated,
    getCurrentInstance,
    defineComponent
} from '@vue/composition-api';
import roomInfo from "../building/components/roomInfo.vue";
import villageNew from "@/api/community/village/villageNewApi";
import store from '@/store';
export default defineComponent({
    components: {
       roomInfo
    },
    setup(props, context) {
        let data = ref([])
        let hasSelected = ref(true)
        const pagination = ref({})
        const loading = ref(false)
        const columns = ref([{
            title: 'ID',
            dataIndex: 'pigcms_id',
            sorter: true,
            // scopedSlots: { customRender: 'name' },
        },{
            title: '物业编号',
            dataIndex: 'bind_number',
            scopedSlots : {customRender:'bind_number'}
        },{
            title: '姓名',
            dataIndex: 'name',
            scopedSlots : {customRender:'username'}
        },{
            title: store.getters.config.room_name+'人员',
            dataIndex: 'measure_area',
        },{
            title: '手机号',
            dataIndex: 'phone',
        },{
            title: '人脸上传',
            dataIndex: 'contract_time_start',
        },{
            title: '物业服务时间',
            dataIndex: 'propertyStartEndTime',
            scopedSlots : {customRender:'propertyStartEndTime'}
        },{
            title: '备注',
            dataIndex: 'remark',
        },{
            title: '排序',
            dataIndex: 'sort',
            sorter: true,
        },{
            title: store.getters.config.room_name+'状态',
            dataIndex: 'status',
            scopedSlots : {customRender:'status'}
        }, {
            title: '操作',
            key: 'action',
            scopedSlots: {
                customRender: 'action'
            }
        }])
        const selectedRowKeys   = ref([])
        let roomVisible         = ref(false)
        let roomDrawerTitle     = ref('')
        let start               = ref('')
        let page                = ref(1)
        let count               = ref(0)

        const getUserList = () => {
            Vue.prototype.request(villageNew.ownerList, {page:page.value}).then((res) => {
               console.log('--->res---->',res)
                data.value  = res.userList
                count.value = res.count
                
                
                loading.value = false;
            }).catch(e => {
                loading.value = false;
            })
        }
        
        const handleTableChange = (pagination, filters, sorter) => {
            console.log(pagination);
        }
        const fetch = (params = {}) => {
            loading.value = false;
        }
        const onSelectChange = (selectedRowKeys) => {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            selectedRowKeys.value = selectedRowKeys;
            getCurrentInstance()
        }
        const getPersonInfo = (item) => {
            console.log('item',item)
            roomVisible.value = true
            roomDrawerTitle.value = '1 号'+store.getters.config.room_name+'信息'
        }
        const onRoomClose = () => {
            roomVisible.value = false
        }
        
        hasSelected.value = computed(()=>{
            return selectedRowKeys.value.length > 0;
        })

        onMounted(()=>{
            loading.value = true;
            getUserList();
            
        })
        
        return {
            data,
            pagination,
            loading,
            columns,
            selectedRowKeys,
            roomVisible,
            roomDrawerTitle,
            start,
            handleTableChange,
            fetch,
            onSelectChange,
            onRoomClose,
            hasSelected,
            getPersonInfo,
            getUserList
        }
    }
})
</script>

<style lang="less" scoped>
    .owner_content{
        background-color: #ffffff;
        .top_con{
            margin: 10px 0;
            padding: 20px 10px;
        }
        .status-color-ok {
            color: green;
            font-weight: bold;
        }
        .status-color-fail {
            color: red;
            font-weight: bold;
        }
    }
</style>
