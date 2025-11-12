<template>
    <div class="owner_family">
        <a-table :pagination="pageInfo" :columns="paymentTitle" :loading="tableLoading" :data-source="ownerList" @change="tableChange">
            <span slot="user_type" slot-scope="text, record">
                <a-tag :color="record.user_type.color">{{record.user_type.value}}</a-tag>
            </span>
            <span slot="user_status" slot-scope="text, record">
                <a-tag :color="record.user_status.color">{{record.user_status.value}}</a-tag>
            </span>
            <!-- <span slot="action" slot-scope="text, record">
                <a style="color: red;" @click="deleteBill(record)">删除</a>
            </span> -->
        </a-table>
    </div>
</template>
<script>
    import Vue from 'vue';
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
                default: () => {
                    return {}
                }
            },
            roomId: {
                type: [String, Number],
                defalut: ''
            },
            pigcms_id: {
                type: [String, Number],
                defalut: ''
            }
        },
        setup(props, context) {
            //车辆管理
            let paymentTitle = ref([])
            let ownerList = ref([])
            let tableLoading = ref(false)
            paymentTitle.value = [{ title: '用户姓名', dataIndex: 'name', key: 'name' },
            { title: '手机号', dataIndex: 'phone', key: 'phone' },
            { title: '添加时间', dataIndex: 'add_time', key: 'add_time' },
            { title: '审核通过时间', dataIndex: 'adopt_time', key: 'adopt_time' },
            { title: '身份证卡号', dataIndex: 'id_card', key: 'id_card' },
            { title: '性别', dataIndex: 'sex', key: 'sex' },
            { title: '生日', dataIndex: 'birthday', key: 'birthday' },
            { title: '与业主关系', dataIndex: 'user_relatives', key: 'user_relatives' },
            { title: '用户类型', scopedSlots: { customRender: 'user_type' } },
            { title: '用户状态', scopedSlots: { customRender: 'user_status' } },
            // { title: '操作', dataIndex: 'operation', key: 'operation', scopedSlots: { customRender: 'action' } },
            ]
            let pageInfo = ref({
                pageSize: 10,
                current: 1,
                total: 0,
				pageSizeOptions: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
				showSizeChanger: true
            })
            onMounted(()=>{
                getOwnerList()
            })
            const tableChange = ({pageSize, current})=>{
                pageInfo.value.current = current
                pageInfo.value.pageSize = pageSize
                getOwnerList()
            }
            const deleteBill = (record) => {
                Vue.prototype.$confirm({
                    title: '提示',
                    content: '确定要删除此项吗？',
                    onOk() {
                        Vue.prototype.request('/community/village_api.cashier/delChargeStandardBind', {
                            charge_standard_bind_id: record.bind_id,
                        }).then((res) => {
                            Vue.prototype.$message.success('删除成功！')
                            pageInfo.value.current = 1
                            pageInfo.value.pageSize = 10
                            getOwnerList()
                        })
                    },
                    onCancel() {},
                });
            }
            const getOwnerList = ()=>{
                tableLoading.value = true
                Vue.prototype.request('/community/village_api.Building/getRoomBindUserList', {
                    vacancy_id: props.roomId,
                    page: pageInfo.value.current,
                    limit: pageInfo.value.pageSize
                }).then((res) => {
                    ownerList.value = res.list
                    pageInfo.value.total = res.count
                    tableLoading.value = false
                }).catch(res=>{
                    tableLoading.value = false
                })
            }
            
            return {
                paymentTitle,
                ownerList,
                getOwnerList,
                deleteBill,
                tableLoading,
                tableChange,
                pageInfo
            }
        }
    })
</script>

<style lang="less" scoped>
</style>
