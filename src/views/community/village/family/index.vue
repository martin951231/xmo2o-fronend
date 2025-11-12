<template>
    <div class="family_content">
        <div class="top_con">
            <a-button type="danger" :disabled="!hasSelected" :loading="loading" @click="start">删除选中</a-button>
        </div>
        <a-table
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="columns"
            :row-key="record => record.id"
            :data-source="data"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange">
            <template slot="status" slot-scope="status"> <span :class="status ? 'status-color-ok' : 'status-color-fail'"> {{ status ? "开启" : "关闭" }} </span> </template>
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
        let data = ref([{"id":1,"parent_name":"张三","parent_phone":"18322222222","floor_num":11,"status":1,"lower_layer_num":11,"upper_layer_num":12,"measure_area":123,"sort":1,"contract_time_start":1111,"contract_time_end":2222},{"id":2,"parent_name":"张三","parent_phone":"18322222222","floor_num":121,"status":0,"lower_layer_num":111,"upper_layer_num":121,"measure_area":1223,"sort":2,"contract_time_start":1111,"contract_time_end":2222}])
        let hasSelected = ref(true)
        const pagination = ref({})
        const loading = ref(false)
        const columns = ref([{
        title: 'ID',
        dataIndex: 'id',
        sorter: true,
        }, {
            title: '业主姓名',
            dataIndex: 'parent_name',
        }, {
            title: '业主手机号',
            dataIndex: 'parent_phone',
        }, {
            title: '住址',
            dataIndex: 'upper_layer_num',
        }, {
            title: store.getters.config.room_name+'人员',
            dataIndex: 'measure_area',
        }, {
            title: '手机号',
            dataIndex: 'floor_num',
        }, {
            title: '人脸上传',
            dataIndex: 'contract_time_start',
        }, {
            title: '物业服务时间',
            dataIndex: 'contract_time_end',
        }, {
            title: '备注',
            dataIndex: 'remark',
        }, {
            title: '排序',
            dataIndex: 'sort',
            sorter: true,
        }, {
            title: store.getters.config.room_name+'状态',
            dataIndex: 'status',
            scopedSlots : {customRender:'status'}
        }, {
            title: '操作',
            key: 'action',
            scopedSlots: {
                customRender: 'action'
            },
        }])
        const selectedRowKeys = ref([])
        let roomVisible = ref(false)
        let roomDrawerTitle = ref('')
        let start = ref('')
        
        const handleTableChange = (pagination, filters, sorter) => {
            console.log(pagination);
        }
        const fetch = (params = {}) => {
            loading.value = false;
        }
        const onSelectChange = (selectedRowKeys) => {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            selectedRowKeys.value = selectedRowKeys;
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
            getPersonInfo
        }
    }
})
</script>

<style lang="less" scoped>
    .family_content{
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
