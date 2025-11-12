<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <div class="flex">
            <a-input :placeholder="L('请输入')" v-model="keywords" style="width: 400px"></a-input>
            <a-button type="primary" class="ml-10" @click="getAddressList(true)">{{ L('搜索') }}</a-button>
        </div>
        <div class="flex mt-20" style="margin-bottom: 80px">
            <!-- 机器人列表 -->
            <div class="robot-list-wrap">
                <div class="list flex-1" v-if="robotList.length">
                    <a-menu
                        mode="inline"
                        v-model="activeKey"
                        :openKeys="activeKey"
                        @openChange="onOpenChange"
                        style="width: 100%; min-height: 100%"
                    >
                        <a-sub-menu v-for="item in robotList" :key="item.device_type">
                            <span slot="title"
                                ><span class="text-wrap">{{ item.deviceTypeText }}</span></span
                            >
                            <a-menu-item
                                v-for="sItem in item.list"
                                :key="`${item.device_type}_${sItem.id}`"
                                @click="selectRobot(sItem)"
                                class="no-wrap"
                                :title="sItem.name"
                            >
                                {{ sItem.name || '--' }}
                            </a-menu-item>
                        </a-sub-menu>
                    </a-menu>
                </div>
                <div class="flex justify-between">
                    <a-pagination
                        simple
                        :total="robotTotal"
                        :item-render="itemRender"
                        :hideOnSinglePage="true"
                        v-model="robotPage"
                        @change="robotonPageChange"
                    />
                </div>
            </div>
            <!-- 地址列表 -->
            <div class="flex-1">
                <a-table
                    :dataSource="addressList"
                    rowKey="id"
                    :rowSelection="{ type: 'radio', selectedRowKeys, onChange: onChange }"
                    :columns="addressColumns"
                    :pagination="pagination"
                    :customRow="customRow"
                >
                    <span slot="map_name" slot-scope="text, record">
                        {{ record.map_name + '-' + record.name }}
                    </span>
                    <span slot="floor" slot-scope="text, record" v-if="record.floor">
                        {{ L('楼层') }}：{{ record.floor }}</span
                    >
                </a-table>
            </div>
        </div>

        <div class="text-right confirm-btn">
            <a-button type="primary" @click="confirmClick()">{{ L('确定') }}</a-button>
        </div>
    </div>
</template>

<script>
// ID1015232 定制 店铺绑定机器人
import thirdRobotApi from '@/api/common/platform/thirdRobotApi'
import Vue from 'vue'
export default {
    data() {
        return {
            keywords: '',
            robotPage: 1,
            robotList: [],
            addressList: [],
            addressColumns: [
                {
                    title: this.L('地址'),
                    dataIndex: 'map_name',
                    scopedSlots: { customRender: 'map_name' },
                },
                {
                    title: this.L('楼层'),
                    dataIndex: 'floor',
                    scopedSlots: { customRender: 'floor' },
                },
            ],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            selectedRowKeys: [],
            selectInfo: {},
            robotTotal: 0,
            activeKey: [],
            store_id: '',
            order_id: '',
            mer_id: ''
        }
    },
    mounted() {
        this.store_id = this.$route.query.store_id || ''
        this.order_id = this.$route.query.order_id || ''
        this.mer_id = this.$route.query.mer_id || ''
        this.getRobotList()
    },
    methods: {
        // 机器人列表
        getRobotList() {
            let params = {
                name: '',
                page: this.robotPage,
                page_size: 10,
                store_id: this.store_id,
            }
            this.request(thirdRobotApi.storeStaffStoreRobotList, params).then((res) => {
                this.robotList = res.list || []
                let defaultDeviceType = ''
                let defaultRobotId = ''
                if (res.list && res.list.length) {
                    defaultDeviceType = res.list[0]['device_type']
                    if (res.list[0]['list'] && res.list[0]['list'][0]) {
                        defaultRobotId = res.list[0]['list'][0].id
                    }
                }
                this.activeKey = [defaultDeviceType, `${defaultDeviceType}_${defaultRobotId}`]
                if (
                    !Object.keys(this.selectInfo).length &&
                    res.list[0] &&
                    res.list[0]['list'] &&
                    res.list[0]['list'][0]
                ) {
                    this.selectInfo = {
                        robot_id: res.list[0]['list'][0].id,
                        robot_name: res.list[0]['list'][0].name,
                        robot_code: res.list[0]['list'][0].robot_code,
                    }
                }
                this.robotTotal = res.count || 0
                this.getAddressList()
            })
        },
        robotonPageChange(page, pageSize) {
            this.robotPage = page
            this.getRobotList()
        },
        itemRender(current, type, originalElement) {
            if (type === 'prev') {
                return <a>上一页</a>
            } else if (type === 'next') {
                return <a>下一页</a>
            }
            return originalElement
        },
        // 选择机器人
        selectRobot(item) {
            let robot_id = this.selectInfo.robot_id || ''
            if (robot_id == item.id) return
            this.$set(this.selectInfo, 'robot_id', item.id)
            this.$set(this.selectInfo, 'robot_name', item.name)
            this.$set(this.selectInfo, 'robot_code', item.robot_code)
            this.selectedRowKeys = []
            this.getAddressList()
        },
        // 地址列表
        getAddressList(refresh = false) {
            if (refresh) {
                this.pagination.current = 1
            }
            let params = {
                robot_id: this.selectInfo.robot_id,
                name: this.keywords,
                page: this.pagination.current,
                page_size: this.pagination.pageSize,
                staff_ticket: Vue.ls.get('storestaff_access_token')
            }
            this.request(thirdRobotApi.merRobotBizPointList, params).then((res) => {
                this.addressList = res.list || []
                this.pagination.total = res.count || 0
            })
        },
        onChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getAddressList()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getAddressList()
        },
        // 点击行选中
        customRow(record) {
            return {
                on: {
                    // 鼠标单击行
                    click: (event) => {
                        if (record.id) {
                            let keys = []
                            keys.push(record.id)
                            this.selectedRowKeys = keys
                        }
                    },
                },
            }
        },
        onOpenChange(openKeys) {
            this.activeKey = openKeys
        },
        confirmClick() {
            let end_point_id = this.selectedRowKeys.length ? this.selectedRowKeys[0] : ''
            if (!end_point_id) {
                this.$message.error(this.L('请选择配送地址'))
                return
            }
            let params = {
                robot_code: this.selectInfo.robot_code,
                end_point_id: end_point_id,
                shop_order_id: this.order_id,
            }
            this.request(thirdRobotApi.storeStaffCreateOrder, params).then((res) => {
                this.$message.success(this.L('操作成功'))
                window.top.reload()
            })
        },
    },
}
</script>

<style lang="less" scoped>
.robot-list-wrap {
    width: 240px;
    height: 600px;
    display: flex;
    flex-direction: column;
    .list {
        overflow-y: auto;
    }
}
.confirm-btn {
    padding: 20px 20px;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1;
    background-color: #ffffff;
    box-sizing: border-box;
}
</style>
