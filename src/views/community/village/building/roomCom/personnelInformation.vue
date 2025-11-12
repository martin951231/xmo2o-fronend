<template>
    <div class="personnel_information">
        <a-tooltip>
            <a-button type="primary" @click="addInfo">
                添加人员
            </a-button>
            <a-divider type="vertical" />
            类型颜色：
            <a-badge style="margin-left: 7px;" v-for="(item, index) in roomParams.person_type_list" :color="item.color" :text="item.value" />
        </a-tooltip>
        <a-table :pagination="pageInfo" :columns="peopleColumns" :loading="tableLoading" :data-source="tableList" @change="tableChange">
            <a slot="name" slot-scope="text">{{ text }}</a>
            <span slot="customTitle">
                <a-icon type="user" /> 姓名
            </span>
            <span slot="user_status" slot-scope="record">
                <a-tag :color="record.color"> {{record.value}} </a-tag>
            </span>
            <span slot="user_type" slot-scope="record">
                <a-tag :color="record.color"> {{record.value}} </a-tag>
            </span>
            <span slot="action" slot-scope="text, record">
                <a>编辑</a>
                <a-divider type="vertical" />
                <a>删除</a>
            </span>
        </a-table>
        <personModal :visible="personVisible" :roomId="roomId" :personId="personId" @close="closePerson" />
    </div>
</template>
<script>
    import Vue from 'vue';
    import personModal from "../components/personModal.vue";
    import {
        ref,
        watch,
        reactive,
        onMounted,
        onUpdated,
        defineComponent
    } from '@vue/composition-api';
    export default defineComponent({
        props: {
            roomParams: {
                type: Object,
                default: ()=>{return {}}
            },
            roomId: {
                type: [String, Number],
                defalut: ''
            }
        },
        components: {
            personModal
        },
        setup(props, context) {
            //人员信息
            const personVisible = ref(false)
            const personId = ref('')
            let peopleColumns = ref([])
            let pageInfo = ref({
                pageSize: 10,
                current: 1,
                total: 0,
				pageSizeOptions: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
				showSizeChanger: true
            })
            let tableList = ref([])
            let tableLoading = ref(false)
            onMounted(()=>{
                getRoomList()
            })
            
            const addInfo = () => {
                personVisible.value = true
            }
            
            const closePerson = ()=>{
                personId.value = ''
                personVisible.value = false
            }
            
            const tableChange = ({pageSize, current})=>{
                pageInfo.value.current = current
                pageInfo.value.pageSize = pageSize
                getRoomList()
            }
            const getRoomList = ()=>{
                tableLoading.value = true
                Vue.prototype.request('/community/village_api.Building/getRoomBindUserList', {
                    vacancy_id: props.roomId,
                    page: pageInfo.value.current,
                    limit: pageInfo.value.pageSize
                }).then((res) => {
                    tableList.value = res.list
                    pageInfo.value.total = res.count
                    tableLoading.value = false
                }).catch(res=>{
                    tableLoading.value = false
                })
            }
            peopleColumns.value = [{
                dataIndex: 'name',
                key: 'name',
                slots: {
                    title: 'customTitle'
                },
                scopedSlots: {
                    customRender: 'name'
                },
            }, {
                title: '手机号',
                dataIndex: 'phone',
                key: 'phone',
            }, {
                title: '添加时间',
                dataIndex: 'add_time',
                key: 'add_time',
            }, {
                title: '类型',
                key: 'user_status',
                dataIndex: 'user_status',
                scopedSlots: {
                    customRender: 'user_status'
                },
            }, {
                title: '与业主关系',
                key: 'user_type',
                dataIndex: 'user_type',
                scopedSlots: {
                    customRender: 'user_type'
                },
            }, {
                title: '身份证卡号',
                key: 'id_card',
                dataIndex: 'id_card'
            }, {
                title: '操作',
                key: 'action',
                scopedSlots: {
                    customRender: 'action'
                },
            }]
           
            return{
                peopleColumns,
                pageInfo,
                tableChange,
                tableList,
                tableLoading,
                personVisible,
                personId,
                addInfo,
                closePerson
            }
        }
    })
</script>
<style lang="less" scoped>
</style>