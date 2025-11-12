<template>
    <a-modal
        :title="L('机器人送货店铺坐标')"
        v-model="visible"
        destroyOnClose
        width="70%"
        :centered="true"
        @cancel="handleCancel"
    >
        <template slot="footer">
            <a-button key="back" @click="handleCancel" type="primary">
                {{ L('确定') }}
            </a-button>
        </template>
        <a-button type="primary" @click="addRobot">{{ L('添加') }}</a-button>
        <a-table :columns="columns" rowKey="id" :data-source="list" class="mt-20" :pagination="paginationList">
            <span slot="address" slot-scope="text, record" class="text-wrap">
                {{
                    record.map_point
                        ? record.map_point.map_name + '-' + record.map_point.name
                        : '--'
                }}
                {{ record.map_point && record.map_point.floor ? ' ' + L('楼层：X1', { X1: record.map_point.floor }) : '' }}
            </span>
            <span slot="action" slot-scope="text, record">
                <a-button type="link" @click="del(record)">{{ L('删除') }}</a-button>
            </span>
        </a-table>

        <a-modal
            :title="L('添加机器人坐标')"
            v-model="robotModal"
            @ok="handleOkRobot"
            destroyOnClose
            width="70%"
            :centered="true"
            @cancel="handleCancelRobot"
        >
            <div class="flex">
                <a-input :placeholder="L('请输入')" v-model="keywords" style="width: 400px"></a-input>
                <a-button type="primary" class="ml-10" @click="getAddressList(true)">{{ L('搜索') }}</a-button>
            </div>
            <div class="flex mt-20">
                <!-- 机器人列表 -->
                <div class="robot-list-wrap" v-if="robotList.length">
                    <div class="list flex-1">
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
                        :rowSelection="{ type: 'radio', selectedRowKeys, onChange: onChange, getCheckboxProps }"
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
        </a-modal>
    </a-modal>
</template>

<script>
// ID1015232 定制 店铺绑定机器人
import thirdRobotApi from '@/api/common/platform/thirdRobotApi'
export default {
    name: 'StoreBindingThirdRobot',
    data() {
        return {
            visible: false,
            store_id: '',
            list: [],
            paginationList: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.onPageChangeList,
                onShowSizeChange: this.onPageSizeChangeList,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            columns: [
                {
                    title: this.L('机器人名称'),
                    dataIndex: 'robot_name',
                },
                {
                    title: this.L('坐标点'),
                    key: 'address',
                    scopedSlots: { customRender: 'address' },
                },
                {
                    title: this.L('操作'),
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            robotModal: false,
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
        }
    },
    methods: {
        showModal({ store_id = '' }) {
            this.visible = true
            this.store_id = store_id
            this.getList()
        },
        // 绑定的机器人
        getList() {
            let params = {
                store_id: this.store_id,
                page: this.paginationList.current,
                page_size: this.paginationList.pageSize,
            }
            this.request(thirdRobotApi.merchantStoreRobotList, params).then((res) => {
                this.list = res.data || []
                this.paginationList.total = res.total || 0
            })
        },
        // 页码变化
        onPageChangeList(page, pageSize) {
            this.$set(this.paginationList, 'current', page)
            this.getList()
        },
        onPageSizeChangeList(page, pageSize) {
            this.$set(this.paginationList, 'pageSize', pageSize)
            this.getList()
        },
        // 删除
        del(record) {
            this.$confirm({
                title: this.L('是否确认删除'),
                okText: this.L('确认'),
                cancelText: this.L('取消'),
                onOk: () => {
                    let params = {
                        store_id: this.store_id,
                        robot_code: record.robot_code,
                        store_robot_id: record.id,
                    }
                    this.request(thirdRobotApi.delMerchantStoreRobot, params).then((res) => {
                        this.$message.success(this.L('操作成功'))
                        if (this.list.length == 1 && this.paginationList.current > 1) {
                            this.paginationList.current = this.paginationList.current - 1
                        }
                        this.getList()
                    })
                },
            })
        },
        handleCancel() {
            this.visible = false
        },
        // 添加
        addRobot() {
            this.robotModal = true
            this.getRobotList()
        },
        handleOkRobot() {
            // 店铺绑定机器人
            let params = {
                store_id: this.store_id,
                robot_code: this.selectInfo.robot_code,
                map_point_id: this.selectedRowKeys.length ? this.selectedRowKeys[0] : '',
            }
            this.request(thirdRobotApi.saveStoreRobot, params).then((res) => {
                this.$message.success(this.L('操作成功'))
                this.handleCancelRobot()
                this.getList()
            })
        },
        handleCancelRobot() {
            this.robotModal = false
            this.selectInfo = {}
            this.selectedRowKeys = []
            this.keywords = ''
            this.robotPage = 1
            this.activeKey = []
        },
        // 机器人列表
        getRobotList() {
            let params = {
                name: '',
                page: this.robotPage,
                page_size: 10,
            }
            this.request(thirdRobotApi.merRobotList, params).then((res) => {
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
                this.selectInfo.robot_id && this.getAddressList()
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
            if(!this.selectInfo.robot_id) return
            if (refresh && this.pagination.current != 1) {
                this.pagination.current = 1
            }
            let params = {
                robot_id: this.selectInfo.robot_id,
                name: this.keywords,
                page: this.pagination.current,
                page_size: this.pagination.pageSize,
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
        getCheckboxProps(record) {
            return {
                props: {
                    disabled:
                        this.list.length &&
                        this.list.findIndex(
                            (item) =>
                                item.map_point && item.map_point.point_id && item.map_point.point_id == record.point_id
                        ) != -1
                            ? true
                            : false,
                },
            }
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
        }
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
</style>
