<template>
    <div>
        <a-card class="page-container" :bordered="false">
            <!-- 筛选区域 -->
            <div class="filter-area bg-ff">
                <a-form-model layout="inline" :model="searchForm" @submit="handleSearch" @submit.native.prevent>
                    <a-form-model-item label="预约日期" prop="appoint_date">
                        <a-date-picker v-model="searchForm.appoint_date" @change="changeDate" format="YYYY-MM-DD"
                            style="width: 180px" />
                    </a-form-model-item>

                    <a-form-model-item label="预约人员" prop="appoint_user_name">
                        <a-input v-model="searchForm.appoint_user_name" placeholder="请输入姓名或电话" style="width: 180px" />
                    </a-form-model-item>

                    <a-form-model-item label="服务人员" prop="worker_name">
                        <a-input v-model="searchForm.worker_name" placeholder="请输入服务人员" style="width: 180px" />
                    </a-form-model-item>

                    <a-form-model-item label="预约类别" prop="appoint_type">
                        <a-select v-model="searchForm.appoint_type" placeholder="请选择服务方式" style="width: 160px">
                            <a-select-option v-for="(item, index) in appointTypeList" :value="item.value" :key="index">
                                {{ item.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>

                    <a-form-model-item>
                        <a-button type="primary" :loading="loading" html-type="submit">查询</a-button>
                        <a-button @click="resetForm" style="margin-left: 10px">重置</a-button>
                    </a-form-model-item>
                </a-form-model>
            </div>
            <div class="main-content" v-if="workerList">
                <!-- 左侧员工列表 -->
                <div class="staff-list">
                    <a-list item-layout="horizontal" :data-source="workerList">
                        <a-list-item slot="renderItem" slot-scope="item, index">
                            <div class="staff-item" @click="selectStaff(item)"
                                :class="{ 'active': selectedStaff.merchant_worker_id === item.merchant_worker_id }">
                                <a-badge :count="item.appoint_order_count" title="预约订单数">
                                    <span class="staff-name"> {{ item.name }}</span>
                                </a-badge>
                            </div>
                        </a-list-item>
                    </a-list>
                </div>

                <!-- 右侧日程表 -->
                <div class="schedule-board" v-if="selectedStaff">
                    <!-- 日程内容区 -->
                    <div class="schedule-content">
                        <div class="schedule-row" :class="time_length > 0 ? 'grid' : ''">
                            <div class="time-cell hvr-grow" v-for="(time, index) in bookings" :key="index">
                                <div class="border-cell">
                                    {{ time.time }}
                                </div>
                                <div v-for="(order, index) in time.order" :key="index">
                                    <div class="booking-card" :style="getBookingStyle(order)"
                                        @click="handleBookingClick(order)">
                                        <div class="booking-header">
                                            <div class="flex">
                                                <a-tag color="orange">
                                                    {{ order.appoint_type_text }}
                                                </a-tag>
                                                <a-tag color="green">
                                                    {{ order.service_status_text }}
                                                </a-tag>
                                                <a-tag color="red" v-if="order.appoint_type == 1">
                                                    {{ order.push_position_text }}
                                                </a-tag>
                                            </div>
                                            <div class="booking-phone">{{ order.nickname }} {{ order.phone }}</div>
                                            <div>{{ order.order_name }}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="empty-tips" v-if="!time.order.length">
                                    <a-empty description="暂无预约信息" />
                                </div>
                            </div>
                            <div class="empty-tips" v-if="!time_length">
                                <a-empty description="服务人员暂未设置工作时段" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="empty-tips" v-else>
                    <a-empty description="请从左侧选择员工查看日程" />
                </div>
            </div>
            <div class="empty-tips" v-else>
                <a-empty description="请先添加服务人员" />
            </div>
        </a-card>
        <a-drawer
            title="详情"
            placement="right"
            :closable="false"
            :visible="visible"
            @close="onClose"
            width="45vw"
            >
            <a-tabs v-model="activeKey">
                <a-tab-pane key="1" tab="预约信息">
                    <iframe v-if="visible" :src="detailUrl" frameborder="0" style="width: 100%; height: calc(100vh - 110px);"></iframe>
                </a-tab-pane>
                <a-tab-pane key="2" tab="服务轨迹" force-render>
                    <iframe v-if="visible" :src="traceUrl" frameborder="0" style="width: 100%; height: calc(100vh - 110px);"></iframe>
                </a-tab-pane>
            </a-tabs>
        </a-drawer>

        <div class="float-div">
            <button class="float_btn" style="background-color: #ff8d30;"></button>未服务
            <button class="float_btn" style="background-color: #23c471;"></button>已服务
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import appointMerchantApi from '@/api/appoint/merchant/index';

export default {
    data() {
        return {
            searchForm: {
                worker_name: '',
                appoint_user_name: '',
                appoint_type: -1,
                appoint_date: moment().format('YYYY-MM-DD'),
            },
            appointTypeList: [
                { label: '全部', value: -1 },
                { label: '到店', value: 0 },
                { label: '上门', value: 1 },
            ],
            workerList: [],
            selectedStaff: null,
            bookings: [],
            time_length: 0,
            loading: false,
            visible: false,
            detailUrl: '',
            traceUrl: '',
            activeKey: '1',
        };
    },
    mounted() {
        this.getOrderWorkerList();
    },
    methods: {
        changeDate(date, dateString) {
            this.searchForm.appoint_date = dateString;
            this.handleSearch();
        },
        // 获取员工列表
        getOrderWorkerList() {
            this.request(appointMerchantApi.getOrderWorkerList, this.searchForm)
                .then(data => {
                    this.workerList = data;
                    // 默认选择第一个员工
                    if (data.length > 0) {
                        this.selectStaff(data[0]);
                    }
                    this.loading = false;
                });
        },
        // 选择员工
        selectStaff(staff) {
            this.selectedStaff = staff;
            this.fetchStaffBookings(staff.merchant_worker_id);
        },

        // 获取员工预约数据
        fetchStaffBookings(staffId) {
            this.request(appointMerchantApi.getWorkerOrderList, {
                merchant_worker_id: staffId,
                appoint_type: this.searchForm.appoint_type,
                appoint_date: this.searchForm.appoint_date,
                appoint_user_name: this.searchForm.appoint_user_name
            })
                .then(data => {
                    this.bookings = data.work_time;
                    this.time_length = Object.keys(this.bookings).length
                    console.log('选择员工', this.bookings);
                });
        },
        getBookingStyle(booking) {
            let bgColor = booking.service_status == 0 ? '#ff8d30' : '#23c471';
            // 获取预约块样式
            return {
                color: '#fff',
                margin: '20px 10px 10px 10px',
                backgroundColor: bgColor,
                zIndex: 2
            };
        },
        // 搜索处理
        handleSearch() {
            this.loading = true;
            this.getOrderWorkerList();
        },

        // 重置表单
        resetForm() {
            this.searchForm = {
                worker_name: '',
                appoint_user_name: '',
                appoint_type: -1,
                appoint_date: moment().format('YYYY-MM-DD'),
            };
            this.getOrderWorkerList();
        },

        // 预约点击事件
        handleBookingClick(booking) {
            this.visible = true;
            this.detailUrl = '/merchant.php?g=Merchant&c=Appoint&a=order_detail&order_id=' + booking.order_id+'&tm='+new Date().getTime();
            this.traceUrl = '/merchant.php?g=Merchant&c=Appoint&a=order_trace&order_id=' + booking.order_id+'&tm='+new Date().getTime();
        },
        onClose() {
            this.visible = false;
            this.activeKey = '1';
            this.selectStaff(this.selectedStaff);
        }
    }
};
</script>

<style scoped>
.border-cell {
    color: #2c2828;
    background-color: #bee4f5;
    padding: 10px;
}

.page-container {
    margin: 10px;
    min-height: calc(100vh - 40px);
}

.filter-area {
    margin-bottom: 10px;
    padding: 16px;
    background: #fff;
    border-radius: 8px;
}

.main-content {
    display: flex;
    background: #fff;
    border-radius: 4px;
    height: calc(100vh - 180px);
}

.staff-list {
    width: 140px;
    flex-shrink: 0;
    overflow-y: auto;
    border-right: 1px solid #e8e8e8;
    border-radius: 4px;
    /* Firefox */
    scrollbar-width: none;
    /* IE 和 Edge 旧版 */
    -ms-overflow-style: none;
}

.staff-list::-webkit-scrollbar {
    display: none
}

.staff-item {
    width: 100%;
    padding: 15px 10px;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
}

.staff-item:hover {
    background: #f5f5f5;
}

.ant-list-item {
    padding: 0px;
}

.staff-item.active {
    background: #e6f7ff;
    border-right: 3px solid #1890ff;
    font-weight: 500;
}

.staff-name {
    margin-right: 8px;
}

.schedule-board {
    flex: 1;
    display: flex;
    flex-direction: column;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    overflow: hidden;
}

.time-axis {
    display: flex;
    background: #fafafa;
    border-bottom: 1px solid #e8e8e8;
    min-height: 40px;
}

.time-cell {
    flex: 1;
    min-width: 250px;
    text-align: center;
    border: 0.5px solid #e8e8e8;
}

/* Grow */
.hvr-grow {
    display: inline-block;
    vertical-align: middle;
    transform: perspective(1px) translateZ(0);
    box-shadow: 0 0 1px rgba(0, 0, 0, 0);
    transition-duration: 0.3s;
    transition-property: transform;
}
.hvr-grow:hover, .hvr-grow:focus, .hvr-grow:active {
    transform: scale(1.1);
    background-color: #fff;
    z-index: 100;
}

.schedule-content {
    flex: 1;
    overflow-y: auto;
    position: relative;
}

.schedule-content::-webkit-scrollbar {
    display: none
}

.schedule-row {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    height: 100%;
}

.grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr); 
}

.booking-card {
    top: 4px;
    bottom: 4px;
    padding: 15px 4px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s;
}

.booking-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.booking-header {
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    margin-bottom: 4px;
    font-size: 12px;
    justify-content: left;
    align-items: self-start;
    margin-left: 15px;
}

.booking-customer {
    font-weight: 500;
}

.booking-status {
    font-size: 11px;
    padding: 1px 4px;
    border-radius: 2px;
}

.status-pending {
    background: #FFBED8;
    color: #D4380D;
}

.status-in-progress {
    background: #D6FFDA;
    color: #00875A;
}

.status-completed {
    background: #E0E0E0;
    color: #595959;
}

.booking-body {
    font-size: 11px;
    color: #595959;
}

.booking-service {
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.empty-tips {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    border-radius: 4px;
}

.ant-list-split .ant-list-item {
    border-bottom: none;
}

.booking-appoint {
    border: 1px solid #e8e8e8;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 11px;
}
.booking-phone {
    padding: 6px 0 3px 0;
}
.float-div {
    position: fixed;
    bottom: 40px;
    right: 60px;
    background-color: #fff;
    padding: 10px 35px;
    border-radius: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    font-size: 15px;
 }

.float-div>.float_btn {
    width: 16px;
    height: 16px;
    display: inline-block;
    margin: 0 5px 0 10px;
    border: none;
    border-radius: 3px;
}
</style>