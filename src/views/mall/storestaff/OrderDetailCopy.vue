<template>
    <div>
        <template>
            <div class="pt-20 pl-20 pr-20 pb-20 bg-ff wrap" v-if="orderInfo">
                <!-- 订单基本信息 -->
                <a-descriptions title="" :column="4">
                    <a-descriptions-item
                        v-if="orderInfo.order_status == 60 || orderInfo.order_status == 70"
                        label="订单编号"
                    >
                        {{ orderInfo.real_order_no }}
                    </a-descriptions-item>
                    <a-descriptions-item
                        v-if="orderInfo.order_no"
                        :label="orderInfo.order_status == 60 || orderInfo.order_status == 70 ? '退款编号' : '订单编号'"
                    >
                        {{ orderInfo.order_no }}
                    </a-descriptions-item>
                    <a-descriptions-item
                        label="第三方支付号"
                        v-if="orderInfo.order_status != 60 && orderInfo.order_status != 70 && orderInfo.paid_extra"
                    >
                        {{ orderInfo.paid_extra }}
                    </a-descriptions-item>
                    <a-descriptions-item
                        :label="orderInfo.order_status == 60 || orderInfo.order_status == 70 ? '申请时间' : '下单时间'"
                    >
                        {{
                            orderInfo.order_status == 60 || orderInfo.order_status == 70
                                ? orderInfo.refund_time
                                : orderInfo.create_time
                        }}
                    </a-descriptions-item>
                    <a-descriptions-item label="订单类型" v-if="orderInfo.order_type_txt">
                        {{ orderInfo.order_type_txt }}
                    </a-descriptions-item>

                    <a-descriptions-item label="店铺名称" v-if="orderInfo.store_name">
                        {{ orderInfo.store_name }}
                    </a-descriptions-item>
                </a-descriptions>
                <!-- 订单状态 -->
                <a-row class="mt-30">
                    <a-card class="a-card">
                        <a-row type="flex">
                            <a-col :span="8" class="border-right card-item">
                                <!-- 订单状态 -->
                                <div class="order-status cr-black text-center">
                                    <span>{{ orderInfo.order_status_txt }}</span>
                                </div>
                                <!-- 描述||申请退款倒计时 -->
                                <div class="text-center">
                                    <span
                                        class="flex align-center countdown mt-10 justify-center"
                                        v-if="orderInfo.order_status == 60 && orderInfo.rest_time"
                                    >
                                        <span>请在</span>
                                        <span class="cr-red">
                                            <a-statistic-countdown
                                                title=""
                                                :value="orderInfo.rest_time"
                                                format="D天H时m分s秒"
                                                :valueStyle="valueStyle"
                                                @finish="finish"
                                            />
                                        </span>
                                        <span>内处理完成，超时将自动同意</span>
                                    </span>

                                    <!-- 待发货发货时间 -->
                                    <span
                                        v-if="
                                            orderInfo.express_style == 2 && orderInfo.goods_activity_type == 'prepare'
                                        "
                                        class="cr-red fs-16 mt-10"
                                    >
                                        发货时间：{{ moment(orderInfo.send_time).format('YYYY-MM-DD HH:mm') || '---' }}
                                    </span>
                                    <span
                                        v-if="
                                            orderInfo.express_style == 1 && orderInfo.goods_activity_type != 'periodic'
                                        "
                                    >
                                        期望送达时间：{{ orderInfo.express_send_time || '---' }}
                                    </span>
                                    <span v-if="desc" class="fs-16 mt-10">
                                        {{ desc }}
                                    </span>
                                </div>

                                <!-- 按钮 -->
                                <a-row type="flex" justify="center" align="middle" class="mt-20">
                                    <span
                                        v-if="!(orderInfo.goods_activity_type == 'periodic' && orderInfo.status < 60)"
                                    >
                                        <span v-for="item in btnList" :key="item.props">
                                            <a-button
                                                class="ml-10 mr-10"
                                                :type="item.type"
                                                v-if="item.show == 1"
                                                :disabled="btnDisabled && currentBtn.props == item.props"
                                                @click="btnOpt(item)"
                                            >
                                                {{ item.label }}
                                            </a-button>
                                        </span>
                                    </span>
                                    <a-button class="ml-10 mr-10" type="primary" @click="orderPrintTicket()" :disabled="btnDisabled && currentBtn.props == 'order_print_ticket'">
                                        打印小票
                                    </a-button>
                                </a-row>

                                <a-row type="flex" justify="center" align="middle" class="mt-20">
                                    <a-button
                                        type="link"
                                        v-if="
                                            orderInfo.order_status == 20 &&
                                            orderInfo.express_style == 2 &&
                                            orderInfo.order_type != 'periodic'
                                        "
                                        @click="editDeliverGoodsByExpress()"
                                    >
                                        修改物流单号
                                    </a-button>
                                </a-row>
                            </a-col>
                            <a-col :span="16" class="card-item">
                                <div class="flex align-center justify-center" style="height: 100%">
                                    <a-steps
                                        :progress-dot="
                                            orderInfo.order_status != 60 && orderInfo.order_status != 70 ? true : false
                                        "
                                        :current="current"
                                    >
                                        <a-step
                                            v-for="item in step"
                                            :key="item.props"
                                            :title="item.title"
                                            :description="orderInfo[item.props]"
                                        />
                                    </a-steps>
                                </div>
                            </a-col>
                        </a-row>
                    </a-card>
                </a-row>

                <!-- 备注 售后和已退款不显示-->
                <a-row class="mt-20" v-if="orderInfo.order_status != 60 && orderInfo.order_status != 70">
                    <a-card>
                        <a-row>
                            <!-- 买家备注 -->
                            <a-col :span="8" class="fs-18">
                                <span class="cr-black">买家备注：</span>
                                <span>
                                    {{ orderInfo.remark || '无' }}
                                </span>
                            </a-col>
                            <a-col :span="4"></a-col>
                            <a-col :span="12" class="flex align-center">
                                <a-row type="flex" align="middle" style="width: 100%">
                                    <a-col :span="24">
                                        <div class="flex align-center flex-nowrap">
                                            <span class="cr-black fs-18">店员备注：</span>
                                            <a-input
                                                class="flex-1"
                                                placeholder="请输入备注内容"
                                                v-model="orderInfo.clerk_remark"
                                                :maxLength="50"
                                                auto-size
                                            >
                                                <span slot="suffix" class="bg-ff">
                                                    {{ orderInfo.clerk_remark.length }}/50
                                                </span>
                                            </a-input>
                                            <!-- 已取消订单不能添加备注 -->
                                            <a-button
                                                v-if="orderInfo.order_status != 50 && orderInfo.order_status != 51"
                                                type="primary"
                                                @click="clerkNotes"
                                                class="ml-10"
                                                >提交
                                            </a-button>
                                        </div>
                                    </a-col>
                                </a-row>
                            </a-col>
                        </a-row>
                    </a-card>
                </a-row>

                <!-- 收货信息 付款信息 更多信息 退款信息 -->
                <a-row class="mt-20 a-card">
                    <a-card>
                        <a-row type="flex">
                            <a-col :span="8">
                                <a-row class="card-item">
                                    <a-col class="mb-10">
                                        <h2 class="fs-18">
                                            {{
                                                orderInfo.order_status == 60 || orderInfo.order_status == 70
                                                    ? '退款原因'
                                                    : '收货信息'
                                            }}
                                        </h2>
                                    </a-col>
                                    <a-col class="pr-10">
                                        <div v-if="orderInfo.order_status == 60 || orderInfo.order_status == 70">
                                            <span
                                                class="descriptions-item descriptions-item-content"
                                                v-if="orderInfo.refund_reason"
                                            >
                                                {{ orderInfo.refund_reason }}
                                            </span>
                                            <span v-if="orderInfo.refund_images && orderInfo.refund_images.length">
                                                <a-card
                                                    style="width: 240px"
                                                    v-for="(item, index) in orderInfo.refund_images"
                                                    :key="index"
                                                >
                                                    <viewer :images="item">
                                                        <img
                                                            style="width: 240px; border: 1px solid #ddd"
                                                            v-if="item"
                                                            :src="item"
                                                            title="点击放大查看"
                                                        />
                                                    </viewer>
                                                </a-card>
                                            </span>
                                        </div>
                                        <a-descriptions title="" :column="1" v-else>
                                            <a-descriptions-item label="收货人">
                                                {{ orderInfo.username || '---' }}
                                            </a-descriptions-item>
                                            <a-descriptions-item label="注册电话">
                                                {{ orderInfo.zc_phone || '---' }}
                                            </a-descriptions-item>
                                            <a-descriptions-item label="收货电话">
                                                {{ orderInfo.sh_phone || '---' }}
                                            </a-descriptions-item>
                                            <a-descriptions-item label="收货地址" v-if="orderInfo.express_style != 3">
                                                {{ orderInfo.address || '---' }}
                                            </a-descriptions-item>
                                            <a-descriptions-item label="自提地址" v-if="orderInfo.express_style == 3">
                                                {{ orderInfo.take_address || '---' }}
                                            </a-descriptions-item>
                                        </a-descriptions>
                                    </a-col>
                                </a-row>
                            </a-col>
                            <a-col :span="8" class="border-dash">
                                <a-row class="card-item">
                                    <a-col class="mb-10">
                                        <h2 class="fs-18">
                                            {{
                                                orderInfo.order_status == 60 || orderInfo.order_status == 70
                                                    ? '退款信息'
                                                    : '付款信息'
                                            }}
                                        </h2>
                                    </a-col>
                                    <a-col class="pr-10">
                                        <a-descriptions title="">
                                            <a-descriptions-item
                                                label="周期购期数"
                                                v-if="
                                                    orderInfo.periodic_count &&
                                                    orderInfo.order_type &&
                                                    orderInfo.order_type == 'periodic'
                                                "
                                            >
                                                <span class="flex align-center">
                                                    <span>共计</span>
                                                    <span class="cr-black fw-bold">
                                                        {{ orderInfo.periodic_count }}
                                                    </span>
                                                    <span>期</span>
                                                </span>
                                            </a-descriptions-item>
                                            <a-descriptions-item label="商品总金额">
                                                {{ currency }}{{ orderInfo.money_total }}
                                            </a-descriptions-item>
                                            <!-- 定金抵扣 -->
                                            <a-descriptions-item
                                                v-if="
                                                    orderInfo.order_type == 'prepare' &&
                                                    orderInfo.bargain_price &&
                                                    orderInfo.bargain_price != 0
                                                "
                                            >
                                                定金{{ currency }}{{ orderInfo.bargain_price }}
                                                <span v-if="orderInfo.deduct_price && orderInfo.deduct_price != 0">
                                                    抵{{ currency }}{{ orderInfo.deduct_price }}
                                                </span>
                                            </a-descriptions-item>
                                            <a-descriptions-item
                                                v-if="orderInfo.discount_total && orderInfo.discount_total != 0"
                                                @click="discountTotalVisible = !discountTotalVisible"
                                            >
                                                <span slot="label" class="pointer popover">
                                                    <a-popover
                                                        v-model="discountTotalVisible"
                                                        title=""
                                                        trigger="click"
                                                        :getPopupContainer="
                                                            (triggerNode) => {
                                                                return triggerNode.parentNode
                                                            }
                                                        "
                                                    >
                                                        <span slot="content">
                                                            <a-list
                                                                item-layout="horizontal"
                                                                :data-source="discountList"
                                                            >
                                                                <a-list-item
                                                                    slot="renderItem"
                                                                    slot-scope="item"
                                                                    v-if="item.value && item.value != 0"
                                                                    class="flex"
                                                                >
                                                                    <a-badge
                                                                        :color="'red'"
                                                                        :text="`${item.label}：${currency}${item.value}`"
                                                                    >
                                                                    </a-badge>
                                                                </a-list-item>
                                                            </a-list>
                                                        </span>
                                                        <span>
                                                            总优惠金额
                                                            <a-icon type="exclamation-circle" />
                                                        </span>
                                                    </a-popover>
                                                </span>
                                                -{{ currency }}{{ orderInfo.discount_total }}
                                            </a-descriptions-item>
                                            <a-descriptions-item
                                                label="运费"
                                                v-if="orderInfo.money_freight && orderInfo.money_freight != 0"
                                            >
                                                +{{ currency }}{{ orderInfo.money_freight }}
                                            </a-descriptions-item>
                                        </a-descriptions>
                                        <!-- 定金 -->
                                        <a-descriptions
                                            title=""
                                            :column="1"
                                            v-if="
                                                orderInfo.order_type == 'prepare' &&
                                                orderInfo.bargain_price &&
                                                orderInfo.bargain_price != 0 &&
                                                orderInfo.order_status >= 0 &&
                                                orderInfo.order_status < 10
                                            "
                                        >
                                            <a-descriptions-item class="fw-bold">
                                                <span slot="label" class="fw-bold fs-18">已支付定金</span>
                                                <span class="cr-red fw-bold fs-18"
                                                    >{{ currency }}{{ orderInfo.bargain_price }}</span
                                                >
                                            </a-descriptions-item>
                                        </a-descriptions>
                                        <!-- 实付款 部分退款 退款金额 -->
                                        <a-descriptions title="" :column="2">
                                            <a-descriptions-item>
                                                <span slot="label" class="fw-bold fs-18">
                                                    <span v-if="orderInfo.order_status == 0">待付款</span>
                                                    <span v-if="orderInfo.order_status == 1">尾款待付款</span>
                                                    <span v-if="orderInfo.order_status >= 10">实付款</span>
                                                </span>
                                                <span class="cr-red fw-bold fs-18">
                                                    {{ currency }}{{ orderInfo.money_real }}
                                                </span>
                                                <span
                                                    class="popconfirm"
                                                    v-if="orderInfo.order_status >= 0 && orderInfo.order_status < 10"
                                                >
                                                    <a-popconfirm
                                                        ok-text="确认"
                                                        cancel-text="取消"
                                                        :visible="moneyRealVisible"
                                                        @confirm="moneyRealEdit"
                                                        @cancel=";(after_money = ''), (moneyRealVisible = false)"
                                                        :getPopupContainer="
                                                            (triggerNode) => {
                                                                return triggerNode.parentNode
                                                            }
                                                        "
                                                    >
                                                        <template slot="title">
                                                            <p>确认修改待付款金额？</p>
                                                            <p>
                                                                <a-input-number
                                                                    v-model="after_money"
                                                                    placeholder="请输入"
                                                                    :min="0"
                                                                    style="width: 100%"
                                                                ></a-input-number>
                                                            </p>
                                                        </template>
                                                        <a-button
                                                            v-if="orderInfo.clerk_modify == 1"
                                                            type="link"
                                                            @click="moneyRealVisible = !moneyRealVisible"
                                                            >修改
                                                        </a-button>
                                                        <a-button type="link" v-else>
                                                            当前订单已参与活动，不可修改实付款金额
                                                        </a-button>
                                                    </a-popconfirm>
                                                </span>
                                            </a-descriptions-item>
                                            <!-- 部分退款 -->
                                            <a-descriptions-item v-if="orderInfo.is_refund" class="fw-bold">
                                                <span
                                                    v-if="orderInfo.all_refund == 1"
                                                    slot="label"
                                                    class="fw-bold fs-18"
                                                    >全部退款金额</span
                                                >
                                                <span
                                                    v-if="orderInfo.all_refund == 0"
                                                    slot="label"
                                                    class="fw-bold fs-18"
                                                    >部分退款金额</span
                                                >
                                                <span v-if="orderInfo.all_refund == 1" class="cr-red fw-bold fs-18"
                                                    >{{ currency }}{{ orderInfo.refund_money }}</span
                                                >
                                                <span v-if="orderInfo.all_refund == 0" class="cr-red fw-bold fs-18"
                                                    >{{ currency }}{{ orderInfo.part_refund_money }}</span
                                                >
                                            </a-descriptions-item>
                                            <!-- 退款金额 -->
                                            <a-descriptions-item
                                                v-if="
                                                    orderInfo.is_refund &&
                                                    orderInfo.refund_money != 0 &&
                                                    orderInfo.refund_money_periodic != 0
                                                "
                                                class="fw-bold"
                                            >
                                                <span slot="label" class="fw-bold fs-18">退款金额</span>
                                                <span class="cr-red fw-bold fs-18">
                                                    {{ currency
                                                    }}{{
                                                        orderInfo.order_type == 'periodic'
                                                            ? orderInfo.refund_money_periodic
                                                            : orderInfo.refund_money
                                                    }}
                                                </span>
                                            </a-descriptions-item>
                                        </a-descriptions>
                                        <!-- 各种支付方式支付的金额 -->
                                        <a-row
                                            type="flex"
                                            align="middle"
                                            v-if="orderInfo.order_status > 9 && payMethods.length"
                                        >
                                            <span
                                                v-for="(item,index) in payMethods"
                                                :key="index"
                                                class="flex justify-between descriptions-item"
                                            >
                                                <span class="mr-20">
                                                    {{ item.label }}：<span class="descriptions-item-content"
                                                        >{{ currency }}{{ item.value || '---' }}</span
                                                    >
                                                </span>
                                            </span>
                                        </a-row>
                                        <!-- 付款时间 -->
                                        <a-descriptions
                                            title=""
                                            :column="1"
                                            v-if="
                                                (orderInfo.paid_time && orderInfo.order_status >= 10) ||
                                                (orderInfo.paid_time && orderInfo.goods_activity_type == 'prepare')
                                            "
                                        >
                                            <a-descriptions-item label="付款时间">
                                                {{ moment(orderInfo.paid_time).format('YYYY-MM-DD HH:mm') || '---' }}
                                            </a-descriptions-item>
                                        </a-descriptions>
                                        <!-- 申请退款时间 -->
                                        <a-descriptions
                                            title=""
                                            :column="1"
                                            v-if="
                                                orderInfo.refund_time &&
                                                (orderInfo.order_status == 60 || orderInfo.order_status == 70)
                                            "
                                        >
                                            <a-descriptions-item label="申请时间">
                                                {{ moment(orderInfo.refund_time).format('YYYY-MM-DD HH:mm') || '---' }}
                                            </a-descriptions-item>
                                        </a-descriptions>
                                        <!-- 付款方式 -->
                                        <a-descriptions title="" :column="1" v-if="orderInfo.order_status >= 10">
                                            <a-descriptions-item label="付款方式">
                                                {{ orderInfo.pay_type_txt }}
                                            </a-descriptions-item>
                                        </a-descriptions>
                                        <!-- 店员修改金额纪录 -->
                                        <a-row
                                            type="flex"
                                            align="middle"
                                            v-if="
                                                orderInfo.clert_discount_process &&
                                                orderInfo.clert_discount_process.length
                                            "
                                        >
                                            <a-col
                                                v-for="(item, index) in orderInfo.clert_discount_process"
                                                :key="index"
                                                class="flex justify-between descriptions-item mr-10"
                                            >
                                                <span class="mr-10"
                                                    >修改前：<span class="descriptions-item-content"
                                                        >{{ currency }}{{ item.money_before || '---' }}</span
                                                    ></span
                                                >
                                                <span
                                                    >修改后：<span class="descriptions-item-content"
                                                        >{{ currency }}{{ item.money_after || '---' }}</span
                                                    ></span
                                                >
                                            </a-col>
                                        </a-row>
                                    </a-col>
                                </a-row>
                            </a-col>
                            <a-col :span="8">
                                <a-row class="card-item">
                                    <a-col class="flex align-center mb-10">
                                        <h2 class="fs-18">更多信息</h2>
                                        <a-button
                                            class="ml-20"
                                            type="primary"
                                            v-if="orderInfo.order_type == 'periodic'"
                                            @click="periodicListVisible = true"
                                        >
                                            查看配送周期
                                        </a-button>
                                    </a-col>
                                    <a-col class="pr-10">
                                        <div>
                                            <div>
                                                <span>配送方式：{{ orderInfo.express_style_txt }}</span>
                                                <a-button
                                                    type="link"
                                                    @click="viewLogistics"
                                                    v-if="
                                                        orderInfo.express_style == 2 &&
                                                        orderInfo.delivery &&
                                                        orderInfo.delivery.length
                                                    "
                                                >
                                                    查看物流
                                                </a-button>
                                                <a-button
                                                    type="link"
                                                    @click="viewLogistics"
                                                    v-else-if="
                                                        orderInfo.order_status >= 60 &&
                                                        orderInfo.order_status < 70 &&
                                                        orderInfo.express_style == 1 &&
                                                        orderInfo.button.trajectory_btn == 1
                                                    "
                                                >
                                                    骑手轨迹
                                                </a-button>
                                            </div>
                                            <div v-if="orderInfo.express_style == 2">
                                                <p v-for="(item, index) in orderInfo.delivery" :key="index">
                                                    快递名称：{{ item.express_name }}<br />
                                                    快递单号：{{ item.express_num }}
                                                </p>
                                            </div>
                                        </div>

                                        <p
                                            v-if="
                                                orderInfo.express_style == 2 &&
                                                orderInfo.goods_activity_type == 'prepare'
                                            "
                                        >
                                            发货时间：{{
                                                moment(orderInfo.send_time).format('YYYY-MM-DD HH:mm') || '---'
                                            }}
                                        </p>
                                        <p
                                            v-if="
                                                orderInfo.express_style == 1 &&
                                                orderInfo.goods_activity_type != 'periodic'
                                            "
                                        >
                                            期望送达时间：{{ orderInfo.express_send_time || '---' }}
                                        </p>

                                        <p v-if="orderInfo.order_status >= 30 && orderInfo.order_status <= 40 && orderInfo.staff_name">
                                            核销人姓名：{{ orderInfo.staff_name}}
                                        </p>
                                    </a-col>
                                    <!-- 更多信息 -->
                                    <a-col>
                                        <goodsForms :orderInfo="orderInfo"></goodsForms>
                                    </a-col>
                                </a-row>
                            </a-col>
                        </a-row>
                    </a-card>
                </a-row>

                <!-- 商品 -->
                <a-table
                    :columns="goodsColumn"
                    :data-source="goodsDataSource"
                    :scroll="{ y: 280 }"
                    :pagination="false"
                    rowKey="index"
                    class="mt-20 a-table"
                >
                    <span
                        slot="goodsName"
                        slot-scope="text, record"
                        class="flex align-center"
                        v-if="orderInfo.goods_activity_type == 'periodic' && orderInfo.order_status < 60"
                    >
                        <a-avatar shape="square" :size="64" :src="record.image" />
                        <span class="flex ml-10">
                            <span>{{ record.goods_name }}</span>
                            <span v-if="record.sku_info.length"><a-divider type="vertical"></a-divider></span>
                            <span>{{ record.sku_info }}</span>
                        </span>
                        <span class="flex ml-10" v-if="orderInfo.periodic_info && orderInfo.periodic_info.length">
                            <a-tag color="#f50">第{{ record.current_periodic }}期</a-tag>
                        </span>
                    </span>
                    <span slot="goodsName" slot-scope="text, record" class="flex align-center" v-else>
                        <a-avatar shape="square" :size="64" :src="record.image" />
                        <span class="flex ml-10">
                            <span>{{ record.goods_name }}</span>
                            <span v-if="record.sku_info.length"><a-divider type="vertical"></a-divider></span>
                            <span>{{ record.sku_info }}</span>
                        </span>
                        <span v-if="record.is_gift == 1">
                            <a-divider type="vertical"></a-divider>
                            <a-tag color="#108ee9">赠品</a-tag>
                        </span>
                        <span v-if="record.refund_desc.length">
                            <a-divider type="vertical"></a-divider>
                            <a-tag v-for="(refund_desc, descIndex) in record.refund_desc" :key="descIndex" color="red">
                                {{ refund_desc }}
                            </a-tag>
                        </span>
                    </span>
                    <span slot="price" slot-scope="text"> {{ currency }}{{ text }} </span>
                    <span slot="goods_status_txt" slot-scope="text, record">
                        <span v-if="orderInfo.goods_activity_type == 'periodic' && orderInfo.order_status < 60">
                            暂未到下期发货时间
                        </span>
                        <span v-else>
                            {{ text }}
                        </span>
                    </span>
                    <span
                        slot="is_complete_txt"
                        slot-scope="text, record"
                        v-if="orderInfo.goods_activity_type == 'periodic' && orderInfo.order_status < 60"
                    >
                        <span>
                            {{ text }}
                        </span>
                        <a-divider type="vertical"></a-divider>
                        <span> 期望送达时间：{{ record.periodic_date }} </span>
                    </span>
                    <span slot="operation" slot-scope="text, record">
                        <span v-for="(item, index) in periodicBtnListArr[record.index]" :key="index">
                            <a-button
                                type="link"
                                v-if="item.show == 1"
                                @click="btnOpt(item, record)"
                                :style="{ color: item.color }"
                                :disabled="btnDisabled && currentBtn.props == item.props"
                            >
                                {{ item.label }}
                            </a-button>
                        </span>
                        <a-button
                            type="link"
                            v-if="
                                record.is_complete == 20 && orderInfo.order_type == 'periodic'
                            "
                            @click="editDeliverGoodsByExpress(record)"
                        >
                            修改快递
                        </a-button>
                    </span>
                </a-table>

                <!-- 弹框 查看物流 快递发货 拒绝退款原因-->
                <!-- 快递发货 -->
                <deliverGoods
                    v-if="currentBtn.props == 'express_btn'"
                    :visible="deliverGoodsVisible"
                    :title="currentBtn.title"
                    @handleCancel=";(deliverGoodsVisible = false), (currentBtn = '')"
                    :order="orderInfo"
                    :nowPeriodicItem="nowPeriodicItem"
                    :fh_type="fh_type"
                    @updateList="getOrderDetails"
                    pageType="storestaff"
                ></deliverGoods>
                <!-- 查看物流 -->
                <logistics
                    v-if="currentBtn.props == 'trajectory_btn' || currentBtn.props == 'logistics_btn'"
                    :visible="logisticsVisible"
                    :title="currentBtn.title"
                    @handleCancel=";(logisticsVisible = false), (currentBtn = '')"
                    :order="orderInfo"
                    :nowPeriodicItem="nowPeriodicItem"
                    pageType="storestaff"
                ></logistics>
                <!-- 拒绝退款原因 -->
                <refuseRefundCopy
                    v-if="currentBtn.props == 'refuse_refund_btn'"
                    :visible="refuseRefundVisible"
                    :title="currentBtn.title"
                    @handleCancel=";(refuseRefundVisible = false), (currentBtn = '')"
                    :order="orderInfo"
                    :nowPeriodicItem="nowPeriodicItem"
                    @updateList="getOrderDetails"
                ></refuseRefundCopy>
                <!-- 查看配送周期 -->
                <periodicListCopy
                    v-if="orderInfo.order_type == 'periodic'"
                    :visible="periodicListVisible"
                    @handleCancel=";(periodicListVisible = false), (currentBtn = '')"
                    :order="orderInfo"
                    :nowPeriodicItem="nowPeriodicItem"
                >
                </periodicListCopy>
            </div>
        </template>
    </div>
</template>

<script>
import Vue from 'vue'
import { statistic } from 'ant-design-vue'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
Vue.use(Viewer)
Vue.use(statistic)
import mallStorestaffApi from '@/api/mall/storestaff/index'
import deliverGoods from '@/views/mall/modules/deliverGoods'
import logistics from '@/views/mall/modules/logistics'
import refuseRefundCopy from '@/views/mall/storestaff/components/refuseRefundCopy'
import periodicListCopy from '@/views/mall/storestaff/components/periodicListCopy'
import moment from 'moment'
// '0' => '待支付',
// '10' => '待发货',
// '11' => '备货中',
// '20' => '已发货',
// '30' => '已收货',//用户端的已发货对应的平台 商家  店铺的已完成
// '40' => '已完成',
// '50' => '已取消',
// '51' => '超时取消',
// '60' => '申请售后',
// '70' => '已退款',
//  商品留言显示
import goodsForms from '../modules/goodsForms.vue'
export default {
    components: {
        deliverGoods,
        logistics,
        refuseRefundCopy,
        periodicListCopy,
        goodsForms
    },
    data() {
        return {
            currency: '￥',
            order_id: this.$route.query.order_id || '',
            periodic_order_id: this.$route.query.periodic_order_id || '',
            refund_id: this.$route.query.refund_id || '',
            is_all: this.$route.query.is_all || '',
            tabStatus: this.$route.query.tabStatus || 1,
            orderInfo: '',
            valueStyle: 'color: #f50f50;font-size: 18px;',
            discountTotalVisible: false,
            after_money: '',
            moneyRealVisible: false,
            refund_images: [],
            desc: '',
            fh_type: '1', // 发货=1 修改快递=2
            discountList: [
                {
                    label: '平台优惠券优惠金额',
                    value: '',
                    props: 'discount_system_coupon',
                },
                {
                    label: '商家优惠券优惠金额',
                    value: '',
                    props: 'discount_merchant_coupon',
                },
                {
                    label: '商家会员卡优惠金额',
                    value: '',
                    props: 'discount_merchant_card',
                },
                {
                    label: '平台会员等级优惠金额',
                    value: '',
                    props: 'discount_system_level',
                },
                {
                    label: '店员优惠金额',
                    value: '',
                    props: 'discount_clerk_money',
                },
                {
                    label: '参加活动优惠金额',
                    value: '',
                    props: 'discount_act_money',
                },
            ],
            step: [
                {
                    title: '买家下单',
                    props: 'step_create_time',
                    current: 0,
                    show: true,
                    is_refund_order: false,
                },
                {
                    title: '买家付款',
                    props: 'step_paid_time',
                    current: 1,
                    show: true,
                    is_refund_order: false,
                },
                {
                    title: '卖家发货',
                    props: 'step_send_time',
                    current: 2,
                    show: true,
                    is_refund_order: false,
                },
                {
                    title: '订单完成',
                    props: 'step_complete_time',
                    current: 3,
                    show: true,
                    is_refund_order: false,
                },
                {
                    title: '买家申请退款',
                    props: 'refund_time',
                    current: 1,
                    show: false,
                    is_refund_order: true,
                },
                {
                    title: '商户审核',
                    props: '',
                    current: 1,
                    show: false,
                    is_refund_order: true,
                },
                {
                    title: '退款完成',
                    props: '',
                    current: 2,
                    show: false,
                    is_refund_order: true,
                },
            ],
            // 操作按钮
            btnList: [
                {
                    label: '接单',
                    props: 'take_btn',
                    show: '0',
                    action: '',
                    tips: '是否确定接单？',
                    success: '接单成功',
                    api: 'orderTaking',
                    type: 'primary',
                },
                {
                    label: '骑手配送',
                    props: 'hoseman_btn',
                    show: '0',
                    action: '',
                    tips: '是否确定骑手配送？',
                    success: '订单已转至平台配送！',
                    api: 'deliverGoodsByHouseman',
                    type: 'primary',
                },
                {
                    label: '店员核销',
                    props: 'clerk_btn',
                    show: '0',
                    action: 'confirm',
                    tips: '是否确定核销？',
                    success: '该订单已核销',
                    api: 'staffVerify',
                    type: 'primary',
                },
                {
                    label: '快递发货',
                    props: 'express_btn',
                    show: '0',
                    action: 'modal',
                    title: '发货',
                    type: 'primary',
                },
                {
                    label: '查看物流',
                    props: 'logistics_btn',
                    show: '0',
                    action: 'modal',
                    title: '查看物流',
                    type: 'primary',
                },
                {
                    label: '顺延配送',
                    props: 'postpone_btn',
                    show: '0',
                    action: 'confirm',
                    tips: '是否确定顺延配送？',
                    success: '该订单已顺延配送',
                    api: 'postponeDelivery',
                    type: 'primary',
                },
                {
                    label: '骑手轨迹',
                    props: 'trajectory_btn',
                    show: '0',
                    action: 'modal',
                    title: '骑手轨迹',
                    type: 'primary',
                },
                {
                    label: '同意退款',
                    props: 'agree_refund_btn',
                    show: '0',
                    action: 'confirm',
                    tips: '是否确定同意退款？',
                    success: '同意退款成功',
                    api: 'agreeRefund',
                    type: 'primary',
                },
                {
                    label: '拒绝退款',
                    props: 'refuse_refund_btn',
                    show: '0',
                    action: 'modal',
                    title: '拒绝退款',
                    type: 'danger',
                },
            ],
            columns: [
                {
                    title: '商品',
                    dataIndex: 'goods_name',
                    key: 'goods_name',
                    scopedSlots: { customRender: 'goodsName' },
                    align: 'left',
                },
                {
                    title: '单价',
                    dataIndex: 'price',
                    key: 'price',
                    scopedSlots: { customRender: 'price' },
                    align: 'center',
                },
                {
                    title: '数量',
                    dataIndex: 'num',
                    key: 'num',
                    align: 'center',
                },
                {
                    title: '商品状态',
                    dataIndex: 'goods_status_txt',
                    key: 'goods_status_txt',
                    scopedSlots: { customRender: 'goods_status_txt' },
                    align: 'center',
                },
            ],
            columnsPeriodic: [
                {
                    title: '商品',
                    dataIndex: 'goods_name',
                    key: 'goods_name',
                    scopedSlots: { customRender: 'goodsName' },
                    align: 'left',
                },
                {
                    title: '单价',
                    dataIndex: 'price',
                    key: 'price',
                    scopedSlots: { customRender: 'price' },
                    align: 'center',
                },
                {
                    title: '数量',
                    dataIndex: 'num',
                    key: 'num',
                    align: 'center',
                },
                {
                    title: '商品状态',
                    dataIndex: 'is_complete_txt',
                    key: 'is_complete_txt',
                    scopedSlots: { customRender: 'is_complete_txt' },
                    align: 'center',
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    key: 'operation',
                    scopedSlots: { customRender: 'operation' },
                    align: 'center',
                },
            ],
            periodicBtnListArr: [],
            goodsColumn: [],
            goodsDataSource: [],
            currentBtn: '',
            deliverGoodsVisible: false, // 快递发货
            logisticsVisible: false, // 查看物流
            refuseRefundVisible: false, // 拒绝退款
            periodicListVisible: false, // 配送周期
            payMethods: [
                {
                    label: '在线支付',
                    labelProps: 'pay_type_txt',
                    props: 'money_online_pay',
                },
                {
                    label: '积分抵扣',
                    props: 'money_score',
                },
                {
                    label: '平台余额支付',
                    props: 'money_system_balance',
                },
                {
                    label: '商家会员卡余额支付',
                    props: 'money_merchant_balance',
                },
                {
                    label: '商家会员卡赠送余额支付',
                    props: 'money_merchant_give_balance',
                },
                {
                    label: '企业预存款余额支付',
                    props: 'money_qiye_balance',
                },
                {
                    label: '员工卡积分支付',
                    props: 'employee_score_pay',
                },
                {
                    label: '员工卡余额支付',
                    props: 'employee_balance_pay',
                },
            ],
            emptyCheckArr: ['', null, undefined, 'null', 'undefined'],
            nowPeriodicItem: {},
            btnDisabled: false
        }
    },
    mounted() {
        this.getOrderDetails()
    },
    beforeRouteLeave(to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        to.meta.keepAlive = true
        next()
    },
    methods: {
        moment,
        // 订单详情
        getOrderDetails() {
            this.request(mallStorestaffApi.getOrderDetailsCopy, {
                order_id: this.order_id,
                periodic_order_id: this.periodic_order_id,
                refund_id: this.refund_id,
                now_status: this.tabStatus,
            }).then((data) => {
                // 商品
                if (data && data.children && data.children.length) {
                    data.children.forEach((item, index) => {
                        item['index'] = index
                    })
                }
                if (data && data.periodic_info && data.periodic_info.length) {
                    data.periodic_info.forEach((item, index) => {
                        item['index'] = index
                    })
                }
                // 退款时间
                if (data.order_status == 60 && data.rest_time) {
                    data.rest_time = Date.now() + Number(data.rest_time) * 1000
                }
                if (data) {
                    data.status = data.order_status
                }
                this.orderInfo = data || ''
                if (
                    data.periodic_info &&
                    data.periodic_info.length &&
                    data.order_status < 60 &&
                    data.order_type == 'periodic'
                ) {
                    this.goodsDataSource = data.periodic_info
                    this.goodsColumn = this.columnsPeriodic
                } else {
                    this.goodsDataSource = data.children
                    this.goodsColumn = this.columns
                }
                this.initBtnList()
                this.initPeriodicBtnList()
                this.initStep()
                this.initDiscountList()
                this.initPayMethods()
            })
        },
        // 按钮
        initBtnList() {
            const { button, order_status, express_style } = this.orderInfo
            this.btnList = this.btnList.map((item) => {
                item.show = button[item.props]
                // 售后 || 退款 查看物流按钮在更多信息
                if (
                    (order_status == 60 || order_status == 70) &&
                    (item.props == 'logistics_btn' || item.props == 'trajectory_btn')
                ) {
                    item.show = 0
                }

                // 备货中 配送方式为平台配送
                if (order_status == 11 && express_style == '1' && item.props == 'hoseman_btn') {
                    this.desc = '订单转至骑手配送'
                }
                return item
            })
        },
        initPeriodicBtnList() {
            //周期购订单的按钮
            if (this.orderInfo.periodic_info) {
                for (let i = 0; i < this.orderInfo.periodic_info.length; i++) {
                    let periodicBtnList = [
                        {
                            label: '接单',
                            props: 'take_btn',
                            show: '0',
                            action: '',
                            tips: '是否确定接单？',
                            success: '接单成功',
                            api: 'orderTaking',
                            color: '#1890ff',
                        },
                        {
                            label: '骑手配送',
                            props: 'hoseman_btn',
                            show: '0',
                            action: '',
                            tips: '是否确定骑手配送？',
                            success: '订单已转至骑手配送！',
                            api: 'deliverGoodsByHouseman',
                            color: '#1890ff',
                        },
                        {
                            label: '店员核销',
                            props: 'clerk_btn',
                            show: '0',
                            action: 'confirm',
                            tips: '是否确定核销？',
                            success: '该订单已核销',
                            api: 'staffVerify',
                            color: '#1890ff',
                        },
                        {
                            label: '快递发货',
                            props: 'express_btn',
                            show: '0',
                            action: 'modal',
                            title: '发货',
                            color: '#1890ff',
                        },
                        {
                            label: '查看物流',
                            props: 'logistics_btn',
                            show: '0',
                            action: 'modal',
                            title: '查看物流',
                            color: '#1890ff',
                        },
                        {
                            label: '顺延配送',
                            props: 'postpone_btn',
                            show: '0',
                            action: 'confirm',
                            tips: '是否确定顺延配送？',
                            success: '该订单已顺延配送',
                            api: 'postponeDelivery',
                            color: 'rgb(250, 173, 20)',
                        },
                        {
                            label: '骑手轨迹',
                            props: 'trajectory_btn',
                            show: '0',
                            action: 'modal',
                            title: '骑手轨迹',
                            color: '#1890ff',
                        },
                        {
                            label: '同意退款',
                            props: 'agree_refund_btn',
                            show: '0',
                            action: 'confirm',
                            tips: '是否确定同意退款？',
                            success: '同意退款成功',
                            api: 'agreeRefund',
                            color: '#1890ff',
                        },
                        {
                            label: '拒绝退款',
                            props: 'refuse_refund_btn',
                            show: '0',
                            action: 'modal',
                            title: '拒绝退款',
                            color: 'rgb(250, 173, 20)',
                        },
                    ]
                    this.periodicBtnListArr[i] = periodicBtnList.map((item) => {
                        item.show = this.orderInfo.periodic_info[i].button[item.props]
                        return item
                    })
                }
            }
        },
        // 订单流程
        initStep() {
            let order_status = this.orderInfo.order_status
            this.step = this.step.filter((item) => {
                if (this.orderInfo[item.props]) {
                    this.current = item.current
                }
                if (order_status == 60 || order_status == 70) {
                    // 退款订单
                    if (item.is_refund_order) {
                        item.show = true
                    } else {
                        item.show = false
                    }

                    if (order_status == 70) {
                        this.current = item.current
                    } else {
                        if (item.props && this.orderInfo[item.props]) {
                            this.current = item.current
                        }
                    }
                } else {
                    if (item.is_refund_order) {
                        item.show = false
                    } else {
                        item.show = true
                    }
                }
                if (item.show) return item
            })
        },
        // 倒计时结束
        finish() {
            this.getOrderDetails()
        },
        // 各种操作
        btnOpt(item, periodicItem = {}) {
            this.currentBtn = item
            console.log(this.currentBtn, 'this.currentBtn')
            let { api = '', success = '', tips = '', action = '', props = '' } = this.currentBtn
            if (!action) {
                this.btnRequest(this.currentBtn, periodicItem)
            }
            if (action == 'confirm') {
                this.$confirm({
                    title: tips ? tips : '提醒',
                    content: '',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        this.btnRequest(this.currentBtn, periodicItem)
                    },
                    onCancel: () => {
                        console.log('Cancel')
                        this.currentBtn = ''
                    },
                    class: 'test',
                })
            }

            if (action == 'modal') {
                if (props == 'express_btn') {
                    this.deliverGoodsVisible = true
                } else if (props == 'trajectory_btn' || props == 'logistics_btn') {
                    this.logisticsVisible = true
                } else if (props == 'refuse_refund_btn') {
                    this.refuseRefundVisible = true
                }
                this.nowPeriodicItem = periodicItem
            }
        },
        btnRequest(currentBtn, periodicItem = []) {
            this.btnDisabled = true
            let { api = '', success = '', tips = '', action = '', props = '' } = this.currentBtn
            if (api) {
                let params = {
                    order_id: this.order_id,
                }
                // 顺延配送 || 手动接单 || 同意退款
                let periodicIdArr = ['postpone_btn', 'take_btn', 'agree_refund_btn', 'hoseman_btn']
                if (this.orderInfo.order_type == 'periodic' && periodicIdArr.indexOf(props) != -1) {
                    params.periodic_order_id = periodicItem.purchase_order_id
                    params.current_periodic = periodicItem.current_periodic
                    params.periodic_count = periodicItem.periodic_count
                }
                if (
                    this.orderInfo.order_status >= 60 &&
                    this.orderInfo.order_status < 70 &&
                    periodicIdArr.indexOf(props) != -1
                ) {
                    params.refund_id = this.refund_id
                    params.is_all = this.is_all
                }
                this.request(mallStorestaffApi[api], params).then((data) => {
                    this.$message.success(success)
                    // 更新订单详情
                    this.getOrderDetails()
                    this.btnDisabled = false
                }).catch(err => {
                    this.btnDisabled = false
                })
            }
        },
        // 店员备注
        clerkNotes() {
            this.orderInfo.clerk_remark = this.orderInfo.clerk_remark.trim()
            if (this.emptyCheckArr.indexOf(this.orderInfo.clerk_remark) != -1) {
                this.$message.error('请输入备注内容')
                return
            }
            this.request(mallStorestaffApi.clerkNotes, {
                order_id: this.order_id,
                notes: this.orderInfo.clerk_remark,
                status: this.orderInfo.order_status,
            }).then((data) => {
                // 商品
                this.$message.success('提交成功')
            })
        },
        // 优惠
        initDiscountList() {
            this.discountList = this.discountList.map((item) => {
                if (this.orderInfo) {
                    item.value = this.orderInfo[item.props]
                }
                return item
            })
        },
        // 实付款修改
        moneyRealEdit() {
            if (this.emptyCheckArr.indexOf(this.after_money) != -1) {
                this.$message.error('请输入修改后的金额')
                return
            }
            let params = {
                order_id: this.order_id,
                before_money: this.orderInfo.money_real,
                after_money: this.after_money,
            }
            this.request(mallStorestaffApi.clerkDiscount, params).then((data) => {
                this.$message.success('修改成功')
                this.after_money = ''
                this.moneyRealVisible = false
                // 更新订单详情
                this.getOrderDetails()
            })
        },
        // 各种支付方式支付的金额
        initPayMethods() {
            this.payMethods = this.payMethods.filter((item) => {
                if (this.orderInfo && item.labelProps) {
                    item.label = this.orderInfo[item.labelProps]
                }
                item.value =
                    item.props && this.orderInfo[item.props] && this.orderInfo[item.props] != 0
                        ? this.orderInfo[item.props]
                        : 0
                if (item.value) {
                    return item
                }
            })
        },
        // 查看物流
        viewLogistics() {
            let item = {
                label: '查看物流',
                props: 'logistics_btn',
                show: '0',
                action: 'modal',
                title: '查看物流',
                type: 'primary',
            }
            this.btnOpt(item)
        },
        // 更改快递
        editDeliverGoodsByExpress(record = '') {
            let item = {
                label: '快递发货',
                props: 'express_btn',
                show: '0',
                action: 'modal',
                title: '更改快递',
                type: 'primary',
            }
            this.fh_type = '2'

            // 周期购修改快递
            if(this.orderInfo.order_type == 'periodic' && record) {
                this.btnOpt(item,record)
            } else {
                this.btnOpt(item)
            }
            
        },
        //   打印小票
        orderPrintTicket() {
            if(!this.currentBtn) {
                this.currentBtn = {}
            }
            this.$set(this.currentBtn,'props',"order_print_ticket")
            let params = {
                order_id: this.order_id
            }
            this.btnDisabled = true
            this.request(mallStorestaffApi.orderPrintTicket, params).then(data => {
                this.$message.success('打印成功')
                this.btnDisabled = false
            }).catch(err => {
                this.btnDisabled = false
            })
        },
    },
}
</script>

<style scoped>
.order-status {
    font-size: 30px;
}

.countdown {
    font-size: 18px;
}

.border-right {
    border-right: 1px solid #e8e8e8;
}

.a-card >>> .ant-card-body {
    padding: 0;
}

.card-item {
    padding: 24px;
    box-sizing: border-box;
}

.border-dash {
    border-left: 1px dashed #e8e8e8;
    border-right: 1px dashed #e8e8e8;
}

.mb-10 {
    margin-bottom: 10px;
}

.mt-30 {
    margin-top: 30px;
}

.a-table >>> table {
    border-top: 1px solid #e8e8e8;
    /*border-right: 1px solid #e8e8e8;*/
    border-left: 1px solid #e8e8e8;
}

.wrap >>> .ant-descriptions-item {
    padding-bottom: 4px;
}

.descriptions-item {
    padding-bottom: 4px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: normal;
    font-size: 14px;
    line-height: 1.5;
    white-space: nowrap;
}

.descriptions-item-content {
    color: rgba(0, 0, 0, 0.65);
}

.descriptions-item span {
    display: inline-block;
}

h2 {
    margin: 0;
    color: #000000;
    font-weight: normal;
}

.flex-nowrap {
    flex-wrap: nowrap;
}

.forms >>> .ant-descriptions-item {
    display: flex;
    align-items: flex-start;
}

.popconfirm >>> .ant-popover-inner-content {
    min-width: 200px;
    box-sizing: border-box;
}

.popover >>> .ant-popover-content {
    min-width: 240px;
    box-sizing: border-box;
}

.page-back >>> .ant-page-header-heading-title {
    font-size: 16px !important;
    color: #2981d2;
}

.page-back >>> .ant-page-header-back-button {
    color: #2981d2;
}
</style>
