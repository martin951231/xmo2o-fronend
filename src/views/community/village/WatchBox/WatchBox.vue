<template>
    <div class="box">
        <!-- 监控信息区域 -->
        <div class="info_box">
            <div class="info_top">
                <div class="info_T_left">管理员: {{ Left_info.login_name }}</div>
                <div class="info_T_right">
                    <a-button v-if="is_public_v" type="primary" @click="changeIntranet" class="">切换到内网</a-button>
                    <a-button v-if="!is_public_v" type="primary" @click="changeIntranet" class="">切换到外网</a-button>

                    <a-button v-if="is_opt_sentry == 1" type="primary" danger class="info_T_btn_red"
                        @click="change_work">交换班</a-button>

                    <a-dropdown placement="bottomLeft">
                        <a-button type="primary" class="info_T_btn">设置</a-button>
                        <a-menu slot="overlay">
                            <a-menu-item @click="sitFn">车库管理</a-menu-item>
                            <a-sub-menu key="test" title="屏幕显示" @click="change_sit">
                                <a-menu-item key="1">1*1</a-menu-item>
                                <a-menu-item key="2">2*2</a-menu-item>
                                <a-menu-item key="3">3*3</a-menu-item>
                                <a-menu-item key="4">4*4</a-menu-item>
                            </a-sub-menu>
                        </a-menu>
                    </a-dropdown>
                </div>
            </div>

            <div class="info_content">
                <!-- 小区列表 -->
                <div class="info_Cell" v-if="isProperty">
                    <div class="Cell_Top">
                        <div class="Cell_Top_left">
                            <div class="blue_icon"></div>
                            <div class="title">小区列表</div>
                        </div>
                        <div class="Cell_Top_right">
                            <a-icon v-show="is_show" type="up" @click="change_state" />
                            <a-icon v-show="!is_show" type="down" @click="change_state" />
                        </div>
                    </div>

                    <div class="Cell_content_scroll" v-show="is_show">
                        <div class="Cell_Content" v-for="(item, index) in cell_List" :key="index">
                            <div class="Cell_Content_item" :class="{ 'is-selected': isSelected(item) }"
                                @click="changeCell(item)">
                                {{ item.village_name }}
                            </div>
                        </div>
                    </div>

                    <div class="Cell_bottom">
                        <div class="Cell_bottom_left">
                            <div class="blue_icon"></div>
                            <div class="title">当前小区: {{ Left_info.current_village_name }}</div>
                        </div>
                    </div>
                </div>

                <!-- 当班收入 -->
                <div class="info_AllPay">
                    <div class="AllPay_Top">
                        <div class="AllPay_Top_left">
                            <div class="blue_icon"></div>
                            <div class="title">当班收入</div>
                            <div class="tiltle_yuan">( 元 )</div>
                        </div>
                        <div class="AllPay_right">¥ {{ Left_info.total_money }}</div>
                    </div>

                    <div class="AllPay_Content">
                        <div class="AllPay_Content_item">
                            <div class="AllPay_Content_Green">{{ Left_info.cash_money }}</div>
                            <div class="P_one_bottom">现金收入</div>
                        </div>
                        <div class="AllPay_Content_item">
                            <div class="AllPay_Content_Green">{{ Left_info.online_money }}</div>
                            <div class="P_two_bottom">临时车收入</div>
                        </div>
                        <div class="AllPay_Content_item">
                            <div class="AllPay_Content_Green">{{ Left_info.stored_money }}</div>
                            <div class="P_three_bottom">储值余额扣款</div>
                        </div>
                    </div>
                </div>

                <!-- 当前车辆 -->
                <div class="info_AllCar">
                    <div class="AllCar_Top">
                        <div class="AllCar_Top_left">
                            <div class="blue_icon"></div>
                            <div class="title">当前在场车辆</div>
                            <div class="tiltle_yuan">( 辆 )</div>
                        </div>
                        <div class="AllCar_right">{{ Left_info.in_park_car }}</div>
                    </div>

                    <div class="AllCar_Content">
                        <div class="AllCar_Content_item">
                            <div class="AllCar_Content_Green">{{ Left_info.position_count }}</div>
                            <div class="P_one_bottom">总车位数</div>
                        </div>
                        <div class="AllCar_Content_item">
                            <div class="AllCar_Content_Green">{{ Left_info.tmp_car }}</div>
                            <div class="P_two_bottom">临时车辆</div>
                        </div>
                        <div class="AllCar_Content_item">
                            <div class="AllCar_Content_Green">{{ Left_info.month_car }}</div>
                            <div class="P_three_bottom">月租车辆</div>
                        </div>
                    </div>
                </div>

                <!-- 表格展示 -->
                <div class="info_Table">
                    <div class="scrollable-table" :style="{ height: isProperty ? '240px' : '540px' }">
                        <a-table :columns="info_columns" :rowKey="(record) => record.record_id" :pagination="pagination"
                            :data-source="Table_List">
                        </a-table>
                    </div>
                </div>
            </div>
        </div>

        <!-- 监控视频区域 -->
        <div class="video_box">
            <div class="empty_box" v-if="video_List.length == 0">
                <a-empty />
            </div>
            <div class="video_box_item" v-for="(item, index) in video_List" :key="index"
                @mouseenter="handleMouseEnter(item, index)" :style="cellSize">
                <div v-if="item.passage_direction * 1 == 1 && item.in_park" class="in_carP" :style="cellFont">
                    <div class="out_content">
                        <div class="out_content_left">
                            <div class="out_left_item">
                                <div class="one">入场时间</div>
                                <div class="two">{{ item.in_park.in_time ? item.in_park.in_time : '--' }}</div>
                            </div>

                            <div class="out_left_item">
                                <div class="one">车辆类型</div>
                                <div class="two">{{ item.in_park.car_type ? item.in_park.car_type : '--' }}</div>
                            </div>
                        </div>
                        <div class="out_content_right">
                            <div class="out_right_item">
                                <div class="one">车牌号</div>
                                <div class="two">{{ item.in_park.car_number ? item.in_park.car_number : '--' }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="out_btn" >
                        <div class="out_btn_left">
                            <a-button type="primary" class="in_btn_red" @click="handle_open(item,1)">手动抬杆</a-button>
                        </div>
                        <div class="out_btn_middle" v-if="item.is_close_passage_btn * 1 == 1">
                            <a-popconfirm placement="top" ok-text="确认关闸" cancel-text="取消操作" @confirm="closeParkPassage(item)" class="custom_popconfirm">
                                <template slot="title">
                                    <p>您确认要关闭【{{ item.passage_name }}】车闸？</p>
                                    <p>点击确认后将下发关闸指令到设备，执行关闸操作</p>
                                </template>
                                <a-button>手动关闸</a-button>
                            </a-popconfirm>
                        </div>
                        <div class="out_btn_right">
                            <a-button type="primary" class="in_btn_add"
                                @click="addRecord_open(item,1)">添加入场记录</a-button>
                        </div>
                    </div>
                </div>

                <div v-if="item.passage_direction * 1 < 1 && item.out_park" class="out_carP" :style="cellFont_out">
                    <div class="out_content">
                        <div class="out_content_left">
                            <div class="out_left_item">
                                <div class="one">出场时间</div>
                                <div class="two">{{ item.out_park.out_time ? item.out_park.out_time : '--' }}</div>
                            </div>
                            <!--
                            <div class="out_left_item">
                                <div class="one">入场通道</div>
                                <div class="two">
                                    {{ item.in_park.passage_name ? item.in_park.passage_name : '--' }}
                                </div>
                            </div>
                            -->

                            <div class="out_left_item">
                                <div class="one">停车时间</div>
                                <div class="two">
                                    {{ item.out_park.park_time ? item.out_park.park_time : '--' }}小时
                                </div>
                            </div>

                            <div class="out_left_item">
                                <div class="one">车辆类型</div>
                                <div class="two">{{ item.out_park.car_type ? item.out_park.car_type : '--' }}</div>
                            </div>

                            <div class="out_left_itempay">
                                <div class="one">待缴金额:</div>
                                <div class="two">
                                    ¥ {{ item.out_park.pay_money ? item.out_park.pay_money : '--' }}
                                </div>
                            </div>
                        </div>
                        <div class="out_content_right">
                            <div class="out_right_item">
                                <div class="one">入场时间</div>
                                <div class="two">{{ item.in_park.in_time ? item.in_park.in_time : '--' }}</div>
                            </div>
                            <div class="out_content_right">
                                <div class="out_right_item">
                                    <div class="one">车牌号</div>
                                    <div class="two">{{ item.out_park.car_number ? item.out_park.car_number : '--' }}
                                    </div>
                                </div>
                            </div>
                            <div class="out_right_item">
                                <div class="one">优惠卷</div>
                                <div class="two">
                                    ¥ {{ item.out_park.coupon_money ? item.out_park.coupon_money : '--' }}
                                </div>
                            </div>
                            <!--
                            <div class="out_right_item">
                                <div class="one">应付/实付</div>
                                <div class="two">¥ {{ item.out_park.pay_money ? item.out_park.pay_money : '--' }}</div>
                            </div>
                            -->
                        </div>
                    </div>

                    <div class="out_btn" >
                        <div class="out_btn_left">
                            <a-button type="primary" class="in_btn_green" @click="handle_open(item,2)">免费放行</a-button>
                        </div>
                        <div class="out_btn_middle" v-if="item.is_close_passage_btn * 1 == 1">
                           <a-popconfirm placement="top" ok-text="确认关闸" cancel-text="取消操作" @confirm="closeParkPassage(item)" class="custom_popconfirm">
                               <template slot="title">
                                   <p>您确认要关闭【{{ item.passage_name }}】车闸？</p>
                                   <p>点击确认后将下发关闸指令到设备，执行关闸操作</p>
                               </template>
                               <a-button>手动关闸</a-button>
                           </a-popconfirm>
                        </div>
                        <div class="out_btn_right">
                            <a-button type="primary" class="in_btn_add" @click="pay_modal_open(item,2)">收取费用</a-button>
                        </div>
                    </div>
                </div>
                <div class="v_left_tips" :style="cellFont_name" v-if="item.device_protocol_net">
                    {{ item.device_protocol_net }}
                </div>

                <div class="video_name" :style="cellFont_name" v-if="item.passage_name">
                    {{ item.passage_name }}
                </div>

                <div v-if="isComponentVisible" style="width: 100%; height: 100%">
                    <div style="width: 100%; height: 100%"
                        v-if="item.public_v_type && item.public_v_url && is_public_v">
                        <video v-if="item.public_v_type == 'flv' || item.public_v_type == 'rtsp'"
                            :id="'myVideo' + index" :src="item.public_v_url" style="width: 100%; height: 100%"
                            class="videoPlayer" controls :muted="false" :autoplay="true"></video>
                        <hlsVideo v-else-if="item.public_v_type == 'hls'" style="width: 100%; height: 100%"
                            :videoType="item.public_v_type" :videoUrl="item.public_v_url" :videoIndex="index" />
                        <!--
                        <div
                            v-else-if="item.public_v_type == 'rtsp'"
                            :id="'rtspPlayer' + index"
                            style="width: 100%; height: 100%; z-index: 10"
                        >
                            <iframe
                                v-if="item.public_v_show_frame"
                                style="z-index: 10"
                                :src="
                                    baseUrl +
                                    JSON.stringify({
                                        id: 'divPlugin' + index,
                                        play_url: item.public_v_url,
                                        ...item.gatewayinfo,
                                        top: item.top,
                                        left: item.left,
                                        gatewayPluginDownload: item.gatewayPluginDownload,
                                    })
                                "
                                width="100%"
                                height="100%"
                                frameborder="0"
                            >
                            </iframe>
                        </div>
                        -->
                    </div>

                    <div style="width: 100%; height: 100%; z-index: 10" v-else>
                        <iframe v-if="item.intranet_v_url && !is_public_v" :src="item.intranet_v_url" width="100%"
                            height="100%" frameborder="0" style="z-index: 10"></iframe>
                        <iframe v-if="item.public_v_url && is_public_v && item.is_iframe_v>0" :src="item.public_v_url"
                            width="100%" height="100%" frameborder="0" style="z-index: 10"></iframe>
                        <video v-if="item.public_v_url && !item.errorState && is_public_v && item.is_iframe_v<1"
                            :src="item.public_v_url" class="video_item" @error="video_error($event, index)"></video>

                        <div class="no_shuju" v-if="!item.public_v_url">暂无视频流</div>
                        <div class="no_shuju" v-if="item.errorState">视频播放失败</div>
                    </div>
                </div>

                <!-- 改版1.0 -->
                <!-- <div class="video_item_info">
                    <div class="out_content" v-if="item.passage_direction * 1 == 1">
                        <div class="out_left_item" v-for="(v1, v1_index) in item.in_info" :key="v1_index">
                            <div class="one">{{ v1.label }}</div>
                            <div class="two">{{ v1.value }}</div>
                        </div>
                    </div>

                    <div class="out_btn" v-if="item.passage_direction * 1 == 1">
                        <div class="out_btn_left">
                            <a-button type="primary" size="small" class="in_btn_red" @click="handle_open(item)"
                                >手动抬杆</a-button
                            >
                        </div>
                        <div class="out_btn_right">
                            <a-button
                                type="primary"
                                size="small"
                                class="in_btn_add"
                                @click="addRecord_open(item.in_park)"
                                >添加入场记录</a-button
                            >
                        </div>
                    </div>

                    <div class="out_content" v-if="item.passage_direction * 1 < 1">
                        <div class="out_left_item" v-for="(v1, v1_index) in item.out_info" :key="v1_index">
                            <div class="one" >
                                {{ v1.label }}
                            </div>
                            <div class="two" :style="{ color: v1.label === '待缴金额: ' ? 'red' : '' }">
                                {{ v1.value }}
                            </div>
                        </div>
                    </div>

                    <div class="out_btn" v-if="item.passage_direction * 1 < 1">
                        <div class="out_btn_left">
                            <a-button
                                type="primary"
                                size="small"
                                class="in_btn_green"
                                @click="handle_open(item)"
                                >免费放行</a-button
                            >
                        </div>
                        <div class="out_btn_right">
                            <a-button
                                type="primary"
                                size="small"
                                class="in_btn_add"
                                @click="pay_modal_open(item)"
                                >收取费用</a-button
                            >
                        </div>
                    </div>
                </div> -->
            </div>
        </div>

        <!-- 交接班弹窗 -->
        <a-modal v-model="changevisible" title="交接班">
            <div style="padding: 24px">
                <div style="display: flex; justify-content: space-between">
                    <div style="font-weight: 700">{{ change_work_list.user_name }}</div>

                    <div style="display: flex">
                        <div>{{ change_work_list.start_time_str }}</div>
                        <div>~</div>
                        <div>{{ change_work_list.end_time_str }}</div>
                    </div>
                </div>

                <div style="margin-top: 10px">
                    <span>上班时间: </span>
                    <span>{{ change_work_list.start_time_str }}</span>
                </div>
                <div style="margin-top: 10px">
                    <span>当前时长: </span>
                    <span>{{ change_work_list.login_time_str }}</span>
                </div>
                <div style="margin-top: 10px">
                    <span>当班收入:</span>
                    <span> ¥{{ change_work_list.total_money }}</span>
                </div>

                <div style="
                        background-color: #f0f0f0;
                        padding: 10px 20px;
                        display: flex;
                        justify-content: space-around;
                        margin: 20px 0 50px 0;
                    ">
                    <div>
                        <div>现金收入</div>
                        <div style="font-weight: 700">¥ {{ change_work_list.cash_money }}</div>
                    </div>

                    <div>
                        <div>网络收入</div>
                        <div style="font-weight: 700">¥ {{ change_work_list.online_money }}</div>
                    </div>

                    <div>
                        <div>余额扣款</div>
                        <div style="font-weight: 700">¥ {{ change_work_list.stored_money }}</div>
                    </div>
                </div>
            </div>

            <template slot="footer">
                <div style="width: 100%; display: flex; justify-content: center; margin-bottom: 20px">
                    <a-button style="border-radius: 3px" type="primary" :loading="loading" @click="save_work">
                        交班退出
                    </a-button>
                </div>
            </template>
        </a-modal>

        <!-- 管理的车道 -->
        <a-modal v-model="selectcar" title="请选择要管理的车道" @ok="savesit">
            <div style="padding: 0 10px">
                <a-table rowKey="id" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                    :columns="columns" :data-source="video_Detail">
                    <!-- 定义状态列的插槽 -->
                    <template slot="state_str" slot-scope="text, record">
                        <span :style="{ color: text === '离线' ? 'red' : '' }">{{ text }}</span>
                    </template>
                </a-table>
            </div>

            <template slot="footer">
                <div style="width: 100%; display: flex; justify-content: right; margin-bottom: 20px">
                    <a-button type="primary" style="background-color: #fc4048; border: none; border-radius: 3px"
                        @click="closeFn">
                        取消
                    </a-button>
                    <a-button style="border-radius: 3px" type="primary" :loading="loading" @click="savesit">
                        确定
                    </a-button>
                </div>
            </template>
        </a-modal>

        <!-- 抬杆弹窗 -->
        <a-modal v-model="handle_visible" title="手动抬杆">
            <div style="padding: 24px">
                <template>
                    <a-form :form="handle_form" ayout="vertical">
                        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
                            label="开闸车牌号">
                            <a-input v-decorator="['car_number', { rules: [{ required: true, message: '请输入车牌号' }] }]"
                                placeholder="请输入车牌号" />
                        </a-form-item>
                    </a-form>
                </template>
            </div>

            <template slot="footer">
                <div style="width: 100%; display: flex; justify-content: right; margin-bottom: 20px">
                    <a-button type="primary" style="background-color: #fc4048; border: none; border-radius: 3px"
                        @click="closehandle">
                        取消
                    </a-button>
                    <a-button style="border-radius: 3px" type="primary" :loading="loading" @click="handleSubmit">
                        确定
                    </a-button>
                </div>
            </template>
        </a-modal>

        <!-- 入场记录弹窗 -->
        <a-modal v-model="addRecord_visible" title="添加入场记录">
            <div style="padding: 24px 30px">
                <template>
                    <a-form :form="Record_form" ayout="vertical">
                        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
                            label="车牌号">
                            <a-input v-decorator="['car_number', { rules: [{ required: true, message: '请输入车牌号' }] }]"
                                placeholder="请输入车牌号" />
                        </a-form-item>
                        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
                            label="通行时间">
                            <a-time-picker style="width: 100%" show-time format="YYYY-MM-DD HH:mm:ss"
                                v-decorator="['accessTime']" :default-open-value="moment('00:00:00')"
                                @change="onTimeChange($event, 'start_time')" />
                        </a-form-item>
                        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
                            label="用户姓名">
                            <a-input v-decorator="['username']" placeholder="请输入用户姓名" />
                        </a-form-item>
                        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
                            label="用户手机号">
                            <a-input v-decorator="['phone']" placeholder="请输入手机号" />
                        </a-form-item>
                        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
                            label="图片">
                            <a-upload v-if="!addRecord.img" name="reply_pic" list-type="picture" accept="image/*"
                                :show-upload-list="false" :data="{ upload_dir: '' }"
                                action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                                @change="handleUploadChange">
                                <div class="up_box">
                                    <a-icon type="plus" />
                                    <div class="ant-upload-text">上传</div>
                                </div>
                            </a-upload>

                            <img v-if="addRecord.img" class="prew_img" :src="addRecord.img" alt="" />
                        </a-form-item>
                    </a-form>
                </template>
            </div>

            <template slot="footer">
                <div style="width: 100%; display: flex; justify-content: right; margin-bottom: 20px">
                    <a-button type="primary" style="background-color: #fc4048; border: none; border-radius: 3px"
                        @click="closeRecord">
                        取消
                    </a-button>
                    <a-button style="border-radius: 3px" type="primary" :loading="loading" @click="handleINRecord">
                        确定
                    </a-button>
                </div>
            </template>
        </a-modal>

        <!-- 费用弹窗 -->
        <a-modal v-model="pay_visible" title="收取费用">
            <div style="padding: 24px 30px">
                <template>
                    <a-form :form="Pay_form" ayout="vertical">
                        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
                            label="车牌号">
                            <a-input v-decorator="['car_number', { rules: [{ required: true, message: '请输入车牌号' }] }]"
                                placeholder="请输入车牌号" />
                        </a-form-item>

                        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
                            label="停车时长 (分钟)">
                            <a-input v-decorator="['park_time']" placeholder="请输入停车时长" />
                        </a-form-item>
                        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
                            label="停车费用 (元)">
                            <a-input v-decorator="['price']" placeholder="请输入停车费用" />
                        </a-form-item>
                        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
                            label="线下支付方式">
                            <a-select v-decorator="['pay_type']" placeholder="请选择支付方式">
                                <a-select-option v-for="item in selectArray" :key="item.id" :value="item.id">{{
                                    item.name
                                }}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-form>
                </template>
            </div>

            <template slot="footer">
                <div style="width: 100%; display: flex; justify-content: right; margin-bottom: 20px">
                    <a-button type="primary" style="background-color: #fc4048; border: none; border-radius: 3px"
                        @click="closePay">
                        取消
                    </a-button>
                    <a-button style="border-radius: 3px" type="primary" :loading="loading" @click="handleRecord">
                        确定
                    </a-button>
                </div>
            </template>
        </a-modal>
    </div>
</template>

<script>
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = (error) => reject(error)
        })
    }
    import moment from 'moment'
    import {
        mapActions
    } from 'vuex'
    import flvjs from 'flv.js'
    import hlsVideo from '@/views/user/community/hlsVideo.vue'
    import rtspPlayer from '@/views/user/community/rtspPlayer.vue'
    const formItemLayout = {
        labelCol: {
            span: 24
        },
        wrapperCol: {
            span: 14
        },
    }

    export default {
        components: {
            hlsVideo,
            rtspPlayer,
        },
        data() {
            return {
                isComponentVisible: true,
                isProperty: false,
                current: 1,
                pageSize: 10,
                total: 0,
                videoSize: '2',
                changevisible: false,
                loading: false,
                selectcar: false,
                handle_visible: false,
                addRecord_visible: false,
                pay_visible: false,
                selectedRowKeys: [],
                changetime: '',
                is_show: true,
                in_info: [{
                        label: '入场时间',
                        value: '',
                        if: '1',
                    },
                    {
                        label: '车辆类型',
                        if: '2',
                    },
                    {
                        label: '车牌号',
                        if: '3',
                    },
                ],
                Left_info: {
                    current_village_name: '',
                    current_village_id: '',
                    login_name: '',
                    cash_money: '', // 现金收入
                    online_money: '',
                    stored_money: '', // 储值余额扣款
                    total_money: '',

                    in_park_car: '0',
                    month_car: '0',
                    tmp_car: '0',
                    position_count: '0',
                },
                video_Detail: [],
                Table_List: [],
                cell_List: [],
                video_List: [],
                info_columns: [{
                        title: '车牌号',
                        dataIndex: 'car_number',
                        key: 'car_number',
                        align: 'center',
                    },
                    {
                        title: '进出时间',
                        dataIndex: 'accessTimeStr',
                        key: 'accessTimeStr',
                        align: 'center',
                    },
                    {
                        title: '进出通道',
                        dataIndex: 'channel_name',
                        key: 'channel_name',
                        align: 'center',
                    },
                ],
                columns: [{
                        title: '车场名称',
                        dataIndex: 'garage_name',
                        key: 'garage_name',
                    },
                    {
                        title: '车道名称',
                        dataIndex: 'passage_name',
                        key: 'passage_name',
                    },
                    {
                        title: '状态',
                        key: 'state_str',
                        dataIndex: 'state_str',
                        scopedSlots: {
                            customRender: 'state_str'
                        },
                    },
                ],
                selectArray: [],
                checkNick: false,
                formItemLayout,
                handle_form: this.$form.createForm(this, {
                    name: 'dynamic_rule'
                }),
                Record_form: this.$form.createForm(this, {
                    name: 'dynamic_rule'
                }),
                Pay_form: this.$form.createForm(this, {
                    name: 'dynamic_rule'
                }),
                timer: null, // 用于存储定时器的引用
                fileList: [],
                is_disabled: false,
                pagination: {
                    current: 1,
                    total: 0,
                    pageSize: 10,
                    size: 'small',
                    showSizeChanger: true,
                    showQuickJumper: false,
                    onChange: this.onPageChange,
                    onShowSizeChange: this.onPageSizeChange,
                    // showTotal: (total) => this.L(`共 X1 条记录`, { X1: total }),
                },
                previewImage: '',
                addRecord: {
                    car_number: '', // 车牌号
                    passage_id: '', // 车道
                    img: '', // 图片
                    passage_direction: '', // 车道进出方向
                    phone: '', // 手机号
                    username: '', // 用户名
                    id: '',
                },

                handle_open_list: {
                    id: '',
                    passage_direction: '', // 车道进出方向
                },
                Pay_form_list: {
                    id: '',
                    passage_direction: '', // 车道进出方向
                },
                change_work_list: {
                    user_name: '',
                    start_time_str: '',
                    end_time_str: '',
                    login_time_str: '',
                    total_money: '',
                    cash_money: '',
                    online_money: '',
                    stored_money: '',
                },

                is_opt_sentry: '',
                is_public_v: false,
                showFrame: true,
                baseUrl: '/v20/public/platform/#/community/village/device/rtspPlayer?rtspParams=',
                // flv格式
                videoSrc: '',
                flvPlayer: null,
                tableTimer: null,
            }
        },
        computed: {
            isSelected() {
                return function(item) {
                    return item.village_id === this.Left_info.current_village_id
                }
            },
            cellSize() {
                if (this.videoSize == '1') {
                    return {
                        width: `calc(100% - 10px)`,
                        height: `calc(100% - 10px)`,
                    }
                }
                if (this.videoSize == '2') {
                    return {
                        width: `calc(50% - 10px)`,
                        height: `calc(50% - 10px)`,
                    }
                }
                if (this.videoSize == '3') {
                    return {
                        width: `calc(33.33% - 10px)`,
                        height: `calc(33.33% - 10px)`,
                    }
                }
                if (this.videoSize == '4') {
                    return {
                        width: `calc(25% - 10px)`,
                        height: `calc(25% - 10px)`,
                    }
                }
            },
            cellFont() {
                if (this.videoSize == '1') {
                    return {
                        'font-size': '26px',
                    }
                }
                if (this.videoSize == '3') {
                    return {
                        'font-size': '14px',
                    }
                }
                if (this.videoSize == '2') {
                    return {
                        'font-size': '14px',
                    }
                }
            },
            cellFont_out() {
                if (this.videoSize == '1') {
                    return {
                        'font-size': '26px',
                    }
                }
                if (this.videoSize == '3') {
                    return {
                        'font-size': '14px',
                    }
                }
                if (this.videoSize == '2') {
                    return {
                        'font-size': '14px',
                    }
                }
            },
            cellFont_name() {
                if (this.videoSize == '1') {
                    return {
                        'font-size': '20px',
                    }
                }
                if (this.videoSize == '3') {
                    return {
                        'font-size': '14px',
                    }
                }
                if (this.videoSize == '2') {
                    return {
                        'font-size': '14px',
                    }
                }
            },
        },

        mounted() {
            this.initwatchBox()
        },
        beforeDestroy() {
            this.isComponentVisible = false
            // 在组件销毁前清除定时器
            this.clearTimer()
            if (this.tableTimer) {
                clearTimeout(this.tableTimer)
            }
        },
        methods: {
            moment,
            ...mapActions(['Logout', 'SetLang']),
            initwatchBox() {
                const watch_login_role = localStorage.getItem('watch_login_role')
                const watch_current_village_id = localStorage.getItem('watch_current_village_id')
                let param = {
                    current_village_id: watch_current_village_id,
                }
                if (watch_login_role == '202' || watch_login_role == '201') {
                    this.isProperty = true
                    let sysName = 'property'
                    param.tokenName = sysName + '_access_token'
                }

                this.request('/community/village_api.HouseSentryWatch/getSentryInfo', param).then((res) => {
                    this.Left_info.current_village_name = res.current_village_name
                    this.Left_info.current_village_id = res.current_village_id
                    localStorage.setItem('watch_current_village_id', res.current_village_id)
                    this.Left_info.login_name = res.login_name
                    this.cell_List = res.village_list
                    this.is_opt_sentry = res.is_opt_sentry
                    if (res.is_public_v && res.is_public_v > 0) {
                        this.is_public_v = res.is_public_v == 1 ? true : false;
                    }
                    this.getVideoList()
                    this.getTableData()
                    this.getNow_video()
                    this.startPolling()

                    // 使用 setTimeout 实现轮询
                    const poll = () => {
                        if (this.pagination.current == 1) {
                            this.pagination.current = 1;
                            this.getTableData();
                        }
                        
                        // 递归调用，模拟轮询
                        this.tableTimer = setTimeout(poll, 6000 * 10);
                    };

                    // 启动轮询
                    this.tableTimer = setTimeout(poll, 2000 * 10);
                })
            },

            changeIntranet() {
                this.is_public_v = !this.is_public_v
                this.handleCreatePublicVideo()
            },
            
            closeParkPassage(parkPassage) {
              const watch_login_role = localStorage.getItem('watch_login_role')
                let param={passage_id:parkPassage.id,garage_id:parkPassage.garage_id,current_village_id:parkPassage.village_id};
                if (watch_login_role == '202' || watch_login_role == '201') {
                    let sysName = 'property'
                    param.tokenName = sysName + '_access_token'
                }
                this.request('/community/village_api.HouseSentryWatch/closeParkPassageCmd', param).then((res) => {        
                    this.$message.success(res.tips_msg)
                }).catch((error) => {
                    
                })
            },
            
            startPolling() {
                this.clearTimer()
                const pollStatistic = () => {
                    const watch_login_role = localStorage.getItem('watch_login_role')
                    let param = {
                        current_village_id: this.Left_info.current_village_id,
                    }
                    if (watch_login_role == '202' || watch_login_role == '201') {
                        let sysName = 'property'
                        param.tokenName = sysName + '_access_token'
                    }
                    this.request('/community/village_api.HouseSentryWatch/getCurrentSentryStatistics', param)
                        .then(
                            (res) => {
                                if (res.err_code == '2') {
                                    return
                                }
                                this.Left_info.cash_money = res.cash_money
                                this.Left_info.online_money = res.online_money
                                this.Left_info.stored_money = res.stored_money
                                this.Left_info.total_money = res.total_money
                                if (res.car_park_info && res.car_park_info.in_park_car) {
                                    this.Left_info.in_park_car = res.car_park_info.in_park_car
                                }
                                if (res.car_park_info && res.car_park_info.month_car) {
                                    this.Left_info.month_car = res.car_park_info.month_car
                                }
                                if (res.car_park_info && res.car_park_info.tmp_car) {
                                    this.Left_info.tmp_car = res.car_park_info.tmp_car
                                }
                                if (res.car_park_info && res.car_park_info.position_count) {
                                    this.Left_info.position_count = res.car_park_info.position_count
                                }

                                this.timer = setTimeout(pollStatistic, 120000);
                            })
                }
                   this.timer = setTimeout(pollStatistic, 10000);
            },

            getVideoList() {
                const watch_login_role = localStorage.getItem('watch_login_role')
                let param = {
                    current_village_id: this.Left_info.current_village_id,
                }
                if (watch_login_role == '202' || watch_login_role == '201') {
                    let sysName = 'property'
                    param.tokenName = sysName + '_access_token'
                }
                this.request('/community/village_api.HouseSentryWatch/getCurrentSentryStatistics', param).then((
                    res) => {
                    if (res.err_code == '2') {
                        this.clearTimer()
                    }
                    this.Left_info.cash_money = res.cash_money
                    this.Left_info.online_money = res.online_money
                    this.Left_info.stored_money = res.stored_money
                    this.Left_info.total_money = res.total_money
                    if (res.car_park_info && res.car_park_info.in_park_car) {
                        this.Left_info.in_park_car = res.car_park_info.in_park_car
                    }
                    if (res.car_park_info && res.car_park_info.month_car) {
                        this.Left_info.month_car = res.car_park_info.month_car
                    }
                    if (res.car_park_info && res.car_park_info.tmp_car) {
                        this.Left_info.tmp_car = res.car_park_info.tmp_car
                    }
                    if (res.car_park_info && res.car_park_info.position_count) {
                        this.Left_info.position_count = res.car_park_info.position_count
                    }
                })
            },

            getTableData() {
                const watch_login_role = localStorage.getItem('watch_login_role')
                let param = {
                    current_village_id: this.Left_info.current_village_id,
                    page: this.pagination.current,
                    pageSize: this.pagination.pageSize,
                }
                if (watch_login_role == '202' || watch_login_role == '201') {
                    let sysName = 'property'
                    param.tokenName = sysName + '_access_token'
                }
                this.request('/community/village_api.HouseSentryWatch/getCarAccessRecordList', param).then((res) => {
                    this.pagination.total = res.count || 0
                    this.Table_List = res.list

                    console.log(this.Table_List, '表格数据66666666666')
                })
            },

            getNow_video() {
                const watch_login_role = localStorage.getItem('watch_login_role')
                let param = {
                    current_village_id: this.Left_info.current_village_id,
                }
                if (watch_login_role == '202' || watch_login_role == '201') {
                    let sysName = 'property'
                    param.tokenName = sysName + '_access_token'
                }
                this.video_List = [];
                this.video_Detail = [];
                this.isComponentVisible = false;
                this.request('/community/village_api.HouseSentryWatch/getCarParkPassages', param).then((res) => {
                    if (res.err_code == '2') {
                        this.clearTimer()
                    }
                    this.isComponentVisible = true;
                    if (res.list && res.list.length > 0) {
                        this.video_List = res.list.map((item) => ({
                            ...item,
                            errorState: false,
                            in_info: [{
                                    label: '入场时间: ',
                                    // value: '',
                                    value: '',
                                    id: '1',
                                },
                                {
                                    label: '车辆类型: ',
                                    value: '',
                                    id: '2',
                                },
                                {
                                    label: '车牌号: ',
                                    value: '',
                                    id: '3',
                                },
                            ],
                            out_info: [{
                                    label: '出场时间: ',
                                    value: '',
                                    id: '1',
                                },
                                {
                                    label: '入场时间: ',
                                    value: '',
                                    id: '2',
                                },
                                {
                                    label: '入场通道: ',
                                    value: '',
                                    id: '3',
                                },
                                {
                                    label: '车辆类型: ',
                                    value: '',
                                    id: '1',
                                },
                                {
                                    label: '待缴金额: ',
                                    value: '',
                                    id: '2',
                                },
                                {
                                    label: '优惠卷: ',
                                    value: '',
                                    id: '3',
                                },
                                {
                                    label: '应付/实付: ',
                                    value: '',
                                    id: '3',
                                },
                            ],
                        }))
                        this.video_Detail = res.list.map((item) => ({
                            ...item,
                            errorState: false,
                        }))
                        this.handleCreatePublicVideo()
                    } else {
                        this.video_List = [];
                    }
                }).catch((error) => {
                    this.isComponentVisible = true;
                })
            },

            handleCreatePublicVideo() {
                if (this.is_public_v && this.video_List.length > 0) {
                    this.destoryVideo()
                    this.$nextTick(() => {
                        let mc = 1
                        this.video_List.map((v, i) => {
                            if (v.public_v_type && v.public_v_url) {
                                setTimeout(() => {
                                    this.createVideo(v, i, v.public_v_type)
                                }, mc * 1000)
                                mc++
                            }
                        })
                    })
                }
            },

            createVideo(item, index, lookUrlType = 'flv') {
                this.createVideoElement(item, index, lookUrlType)
                /*
            let param = {}
            param['current_village_id'] = this.Left_info.current_village_id
            param['camera_id'] = item.public_v_camera_id
            param['channelId'] = item.public_v_channelId
            param['channel_id'] = item.camera_channel_id ? item.camera_channel_id : 0
            let that = this
            this.request('/community/village_api.CameraDevice/getLiveAddress', param)
                .then((res) => {
                    if (res && res.look_url) {
                        item.gatewayinfo = res.gatewayinfo
                        item.public_v_url = res.look_url
                        item.gatewayPluginDownload = res.gatewayPluginDownload
                        this.createVideoElement(item, index, lookUrlType)
                    } else {
                        this.createVideoElement(item, index, lookUrlType)
                    }
                })
                .catch((error) => {
                    this.createVideoElement(item, index, lookUrlType)
                })
                
                */
            },

            createVideoElement(item, index, lookUrlType = 'flv') {
                if (lookUrlType == 'flv') {
                    if (flvjs.isSupported()) {
                        var videoElement = document.getElementById('myVideo' + index)
                        this.flvPlayer = flvjs.createPlayer({
                            type: 'flv',
                            isLive: true,
                            hasAudio: false,
                            url: item.public_v_url,
                        })
                        if (!this.flvPlayer) return
                        this.flvPlayer.attachMediaElement(videoElement)
                        this.flvPlayer.load()
                        this.flvPlayer.play()
                        // 报错重连
                        this.flvPlayer.on(flvjs.Events.ERROR, (errType, errDetail) => {
                            if (this.flvPlayer) {
                                this.destoryVideo()
                            }
                        })
                    }
                } else if (lookUrlType == 'rtsp') {
                    /*
                    this.$nextTick(() => {
                        this.video_List[index]['gatewayinfo'] = item.gatewayinfo
                        this.video_List[index]['left'] = document
                            .getElementById('rtspPlayer' + index)
                            .getBoundingClientRect().left
                        this.video_List[index]['top'] = document
                            .getElementById('rtspPlayer' + index)
                            .getBoundingClientRect().top
                        this.video_List[index]['public_v_show_frame'] = true
                    })
                    */
                }
            },

            destoryVideo() {
                if (this.flvPlayer) {
                    this.flvPlayer.pause()
                    this.flvPlayer.unload()
                    this.flvPlayer.detachMediaElement()
                    this.flvPlayer.destroy()
                    this.flvPlayer = null
                }
            },

            changeCell(item) {
                this.Left_info.current_village_name = item.village_name
                this.Left_info.current_village_id = item.village_id
                this.getVideoList()
                this.getTableData()
                this.getNow_video()
            },
            change_work() {
                const watch_login_role = localStorage.getItem('watch_login_role')
                let param = {
                    current_village_id: this.Left_info.current_village_id,
                }
                if (watch_login_role == '202' || watch_login_role == '201') {
                    let sysName = 'property'
                    param.tokenName = sysName + '_access_token'
                }
                this.request('/community/village_api.HouseSentryWatch/handOverToNext', param).then((res) => {
                    if (res.err_code == '2') {
                        this.clearTimer()
                    }
                    this.change_work_list.user_name = res.user_name
                    this.change_work_list.start_time_str = res.start_time_str
                    this.change_work_list.end_time_str = res.end_time_str
                    this.change_work_list.login_time_str = res.login_time_str
                    this.change_work_list.total_money = res.total_money
                    this.change_work_list.cash_money = res.cash_money
                    this.change_work_list.online_money = res.online_money
                    this.change_work_list.stored_money = res.stored_money
                })
                this.changevisible = true
            },
            save_work(e) {
                const watch_login_role = localStorage.getItem('watch_login_role')
                let param = {
                    current_village_id: this.Left_info.current_village_id,
                }
                if (watch_login_role == '202' || watch_login_role == '201') {
                    let sysName = 'property'
                    param.tokenName = sysName + '_access_token'
                }

                this.request('/community/village_api.HouseSentryWatch/handOverToNextOut ', param).then((res) => {
                    if (res.err_code == '2') {
                        this.clearTimer()
                    }
                    this.$message.success(res.msg)
                    localStorage.removeItem('watch_login_role')
                    localStorage.removeItem('watch_current_village_id')

                    this.changevisible = false
                    this.$router.push({
                        name: 'communityWatchLogin'
                    })
                    // return this.Logout(param.tokenName).then(() => {})
                })
            },

            // 管理的车道
            sitFn() {
                this.selectcar = true
            },

            // 选中的车道
            onSelectChange(selectedRowKeys) {
                this.selectedRowKeys = selectedRowKeys
            },

            // 保存车道管理
            savesit() {
                let filteredList = this.video_List.filter((item) => this.selectedRowKeys.includes(item.id))

                const missingIds = this.selectedRowKeys.filter((id) => !this.video_List.some((item) => item.id === id))

                missingIds.forEach((id) => {
                    const detailItem = this.video_Detail.find((detail) => detail.id === parseInt(id))
                    if (detailItem) {
                        filteredList.push(detailItem)
                    }
                })

                // 更新 this.video_List
                this.video_List = filteredList
                this.selectcar = false
            },

            // 关闭车道弹窗
            closeFn() {
                this.selectcar = false
            },

            //打开抬杆弹窗
            handle_open(item, xtype) {
                this.handle_visible = true
                let car_number_tmp = '';
                if (item.in_park && item.in_park.car_number) {
                    car_number_tmp = item.in_park.car_number;
                }
                if (!car_number_tmp && item.out_park && item.out_park.car_number) {
                    car_number_tmp = item.out_park.car_number;
                }
                this.handle_form.getFieldDecorator('car_number', {
                    initialValue: car_number_tmp || ''
                })
                this.handle_open_list.id = item.id
                this.handle_open_list.passage_direction = item.passage_direction
            },
            //关闭抬杆弹窗
            closehandle() {
                this.handle_visible = false
            },
            // 提交抬杆弹窗
            handleSubmit() {
                this.handle_form.validateFields((err, values) => {
                    if (!err) {
                        const watch_login_role = localStorage.getItem('watch_login_role')
                        let param = {
                            current_village_id: this.Left_info.current_village_id,
                            passage_id: this.handle_open_list.id,
                            passage_direction: this.handle_open_list.passage_direction,
                            car_number: values.car_number,
                        }
                        if (watch_login_role == '202' || watch_login_role == '201') {
                            let sysName = 'property'
                            param.tokenName = sysName + '_access_token'
                        }
                        this.request('/community/village_api.HouseSentryWatch/open_gate', param).then((res) => {
                            if (res.err_code == '2') {
                                this.clearTimer()
                            }
                            this.closehandle()
                            this.$message.success('抬杠成功!')
                        })
                    }
                })
            },

            // 打开添加入场记录弹窗
            addRecord_open(item, xtype) {
                let car_number_tmp = '';
                if (xtype == 1 && item.in_park && item.in_park.car_number) {
                    car_number_tmp = item.in_park.car_number;
                }
                if (xtype == 2 && item.out_park && item.out_park.car_number) {
                    car_number_tmp = item.out_park.car_number;
                }
                this.Record_form.getFieldDecorator('car_number', {
                    initialValue: car_number_tmp || ''
                })

                this.addRecord_visible = true
                this.addRecord.id = item.id
                this.addRecord.passage_direction = item.passage_direction
            },

            // 关闭添加入场记录弹窗
            closeRecord() {
                this.addRecord_visible = false
            },

            // 提交入场记录弹窗
            handleRecord() {
                this.Pay_form.validateFields((err, values) => {
                    if (!err) {
                        const watch_login_role = localStorage.getItem('watch_login_role')
                        let param = {
                            current_village_id: this.Left_info.current_village_id,
                            passage_id: this.Pay_form_list.id,
                            passage_direction: this.Pay_form_list.passage_direction,
                            car_number: values.car_number,
                            park_time: values.park_time,
                            price: values.price,
                            pay_type: values.pay_type,
                        }
                        if (watch_login_role == '202' || watch_login_role == '201') {
                            let sysName = 'property'
                            param.tokenName = sysName + '_access_token'
                        }
                        this.request('/community/village_api.HouseSentryWatch/open_gate', param).then((res) => {
                            if (res.err_code == '2') {
                                this.clearTimer()
                            }
                            this.closePay()
                            this.$message.success('费用收取成功!')
                        })
                    }
                })
            },

            handleINRecord() {
                this.Record_form.validateFields((err, values) => {
                    if (!err) {
                        const watch_login_role = localStorage.getItem('watch_login_role')
                        let param = {
                            current_village_id: this.Left_info.current_village_id,
                            passage_id: this.addRecord.id,
                            passage_direction: this.addRecord.passage_direction,
                            car_number: values.car_number,
                            img: this.addRecord.img,
                            phone: values.phone,
                            username: values.username,
                            accessTime: moment(values.accessTime).format('YYYY-MM-DD HH:mm:ss'),
                        }
                        if (watch_login_role == '202' || watch_login_role == '201') {
                            let sysName = 'property'
                            param.tokenName = sysName + '_access_token'
                        }
                        this.request('/community/village_api.HouseSentryWatch/addParkInfo', param).then((
                            res) => {
                            if (res.err_code == '2') {
                                this.clearTimer()
                            }
                            this.closeRecord()
                            this.$message.success('入场记录添加成功!')
                        })
                    }
                })
            },

            onTimeChange(e) {},

            // 打开支付弹窗
            pay_modal_open(item, xtype) {
                let car_number_tmp = '';
                if (item.out_park && item.out_park.car_number) {
                    car_number_tmp = item.out_park.car_number;
                }
                if (!car_number_tmp && item.in_park && item.in_park.car_number) {
                    car_number_tmp = item.in_park.car_number;
                }
                this.Pay_form.getFieldDecorator('car_number', {
                    initialValue: car_number_tmp || ''
                })
                this.Pay_form.getFieldDecorator('park_time', {
                    initialValue: item.out_park.park_time_m || ''
                })
                this.Pay_form.getFieldDecorator('price', {
                    initialValue: item.out_park.pay_money || ''
                })
                let param = {
                    current_village_id: this.Left_info.current_village_id,
                }
                const watch_login_role = localStorage.getItem('watch_login_role')
                if (watch_login_role == '202' || watch_login_role == '201') {
                    let sysName = 'property'
                    param.tokenName = sysName + '_access_token'
                }
                this.request('/community/village_api.HouseSentryWatch/getOfflineList', param).then((res) => {
                    if (res.err_code == '2') {
                        this.clearTimer()
                    }
                    this.selectArray = res
                    if (res && res.length > 0) {
                        this.Pay_form.getFieldDecorator('pay_type', {
                            initialValue: res[0].id
                        })
                    }

                })
                this.Pay_form_list.id = item.id
                this.Pay_form_list.passage_direction = item.passage_direction
                this.pay_visible = true
            },

            // 关闭支付弹窗
            closePay() {
                this.pay_visible = false
            },

            // 屏幕显示
            change_sit(e) {
                this.videoSize = e.key
            },

            change_state() {
                this.is_show = !this.is_show
            },
            onPageChange(page, pageSize) {
                this.$set(this.pagination, 'current', page)
                this.getTableData()
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
                this.getTableData()
            },

            // 预览图片
            async handlePreviewImg(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj)
                }
                this.previewImage = file.url || file.preview
                this.previewVisible = true
            },

            // 上传图片
            handleUploadChange(info) {
                if (info.file.status === 'uploading') {
                    this.loading = true
                    return
                }
                if (info.file.status === 'done') {
                    if (info.file.response.status === 1000) {
                        let imageUrl = info.file.response.data

                        this.$set(this.addRecord, 'img', imageUrl)
                        this.loading = false
                        getBase64(info.file.originFileObj, (imageUrl) => {
                            this.bank_download_qrcode = imageUrl
                            this.loading = false
                        })
                    }
                }
            },
            beforeUpload(file) {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
                if (!isJpgOrPng) {
                    this.$message.error('You can only upload JPG file!')
                }
                const isLt2M = file.size / 1024 / 1024 < 2
                if (!isLt2M) {
                    this.$message.error('Image must smaller than 2MB!')
                }
                return isJpgOrPng && isLt2M
            },

            //鼠标移入每一张卡片
            handleMouseEnter(item, index) {
                const watch_login_role = localStorage.getItem('watch_login_role')
                let param = {
                    current_village_id: this.Left_info.current_village_id,
                    passage_id: item.id,
                    passage_direction: item.passage_direction,
                }
                if (watch_login_role == '202' || watch_login_role == '201') {
                    let sysName = 'property'
                    param.tokenName = sysName + '_access_token'
                }
                this.request('/community/village_api.HouseSentryWatch/getCurrentPassagePlateresult', param).then((
                    res) => {
                    this.$set(this.video_List[index], 'in_park', res.in_park)
                    this.$set(this.video_List[index], 'out_park', res.out_park)

                    console.log(this.video_List, '11111111111')
                })
            },

            video_error(error, index) {
                console.log('error', error);
                if (error.type == 'error') {
                    this.video_List[index].errorState = true
                }
            },
            clearTimer(){
                if (this.timer) {
                    clearTimeout(this.timer)
                    this.timer = null
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    /deep/ .ant-popover-content .ant-popover-inner-content .ant-popover-buttons{
            text-align: center;
        .ant-btn-primary{
            margin-left: 30px;
        }
    }

    .box {
        width: 100%;
        height: 100%;
        background-color: #101623;
        display: flex;

        .info_box {
            background-color: #1e2839;
            width: 25%;
            height: 100%;

            .info_top {
                height: 70px;
                width: 100%;
                background-color: #1f385c;
                display: flex;
                justify-content: space-between;
                padding: 20px;
                color: #fff;

                .info_T_left {
                    width: 25%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .info_T_right {
                    .info_T_btn_one {
                        // margin: 20px;
                        border-radius: 3px;
                    }

                    .info_T_btn_red {
                        background-color: #fc4047;
                        margin-left: 20px;
                        border: none;
                        border-radius: 3px;
                    }

                    .info_T_btn {
                        margin-left: 20px;
                        border-radius: 3px;
                    }
                }
            }

            .info_content {
                margin-top: 10px;
                background-color: #141e3a;
                width: 100%;
                height: calc(100% - 80px);
                color: #fff;

                .info_Cell {
                    padding-top: 20px;

                    // height: 300px; //暂定
                    .Cell_Top {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0 20px;
                        margin-bottom: 10px;

                        .Cell_Top_left {
                            display: flex;
                        }
                    }

                    .Cell_content_scroll {
                        height: 190px;
                        overflow-y: scroll;

                        &::-webkit-scrollbar {
                            width: 8px;
                            /* 滚动条宽度 */
                        }

                        &::-webkit-scrollbar-track {
                            background-color: #182146;
                            /* 滚动条轨道颜色 */
                        }

                        &::-webkit-scrollbar-thumb {
                            background-color: #999;
                            /* 滚动条滑块颜色 */
                            border-radius: 4px;
                            /* 滑块圆角 */
                        }

                        &::-webkit-scrollbar-thumb:hover {
                            background-color: #666;
                            /* 鼠标悬停时滑块颜色 */
                        }
                    }

                    .Cell_Content {
                        // height: 100px; /* 固定高度 */
                        overflow-y: auto;

                        .Cell_Content_item {
                            display: flex;
                            justify-content: left;
                            align-items: center;
                            padding: 10px 0 15px 40px;
                        }

                        .Cell_Content_item:hover {
                            background-color: #172851;
                            color: #3469eb;
                        }
                    }

                    .Cell_bottom {
                        margin-top: 10px;
                        padding: 0 20px;

                        .Cell_bottom_left {
                            display: flex;
                        }
                    }
                }

                .info_AllPay {
                    padding-top: 20px;
                    margin-top: 10px;

                    .AllPay_Top {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0 20px;
                        margin-bottom: 10px;

                        .AllPay_Top_left {
                            display: flex;

                            .tiltle_yuan {
                                margin-left: 5px;
                            }
                        }

                        .AllPay_right {
                            color: red;
                            font-weight: 600;
                        }
                    }

                    .AllPay_Content {
                        display: flex;
                        justify-content: space-around;
                        padding: 10px 0;

                        .AllPay_Content_Green {
                            padding: 10px 0;
                            font-weight: 600;
                            color: #2ca937;
                        }

                        .AllPay_Content_item {
                            text-align: center;
                        }
                    }
                }

                .info_AllCar {
                    margin-top: 20px;

                    .AllCar_Top {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0 20px;
                        margin-bottom: 10px;

                        .AllCar_Top_left {
                            display: flex;

                            .tiltle_yuan {
                                margin-left: 5px;
                            }
                        }

                        .AllCar_right {
                            color: red;
                            font-weight: 600;
                        }
                    }

                    .AllCar_Content {
                        display: flex;
                        justify-content: space-around;
                        padding: 10px 0;

                        .AllCar_Content_Green {
                            padding: 10px 0;
                            font-weight: 600;
                            color: #2ca937;
                        }

                        .AllCar_Content_item {
                            text-align: center;
                        }
                    }
                }

                .info_Table {
                    margin-top: 20px;

                    .scrollable-table {
                        position: relative;
                        // height: 260px;
                        overflow-y: scroll;
                        width: 100%;
                        display: block;

                        &::-webkit-scrollbar {
                            width: 8px;
                        }

                        &::-webkit-scrollbar-track {
                            background-color: #151a32;
                        }

                        &::-webkit-scrollbar-thumb {
                            background-color: #999;
                            border-radius: 4px;
                        }

                        &::-webkit-scrollbar-thumb:hover {
                            background-color: #666;
                        }
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    .sticky-header {
                        position: sticky;
                        top: 0;
                        z-index: 1;
                        background-color: white;
                    }

                    th,
                    td {
                        padding: 8px;
                        text-align: center;
                    }

                    thead th {
                        background-color: #f2f2f2;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    th,
                    td {
                        padding: 10px;
                        text-align: center;
                    }

                    thead th {
                        background-color: #172851;
                    }

                    .pagination {
                        margin-top: 20px;
                        padding-right: 10px;
                        display: flex;
                        justify-content: end;
                    }
                }
            }

            .blue_icon {
                width: 7px;
                height: 23px;
                background-color: #306dee;
                margin-right: 12px;
            }
        }

        .video_box {
            background-color: #141e3a;
            height: 100%;
            overflow-y: scroll;

            &::-webkit-scrollbar {
                width: 8px;
            }

            &::-webkit-scrollbar-track {
                background-color: #182146;
            }

            &::-webkit-scrollbar-thumb {
                background-color: #999;
                border-radius: 4px;
            }

            &::-webkit-scrollbar-thumb:hover {
                background-color: #666;
            }

            width: 80%;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;

            .video_box_item {
                margin: 0 10px 10px 0;
                position: relative;
                background-color: rgba(0, 0, 0, 0.5);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                border-radius: 4px;
                overflow: hidden;
                transition: all 0.3s ease;

                &:hover {
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
                }

                .no_shuju {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #fff;
                    background-color: rgba(0, 0, 0, 0.5);
                }

                .in_carP {
                    position: absolute;
                    bottom: 0px;
                    width: 100%;
                    color: #fff;
                    padding: 15px 40px 15px 40px;
                    font-size: 10px;
                    background-color: rgba(21, 26, 50, 0.5);
                    z-index: 999 !important;
                    transition: opacity 0.3s ease;
                    opacity: 0;

                    .out_content {
                        width: 100%;
                        display: flex;
                        justify-content: space-around;
                        margin-bottom: 10px;

                        .out_left_item {
                            .one {
                                margin-bottom: 5px;
                            }

                            margin-bottom: 10px;
                        }

                        .out_left_itempay {
                            display: flex;

                            .two {
                                margin-left: 3px;
                                color: #f93440;
                            }
                        }

                        .out_right_item {
                            .one {
                                margin-bottom: 5px;
                            }

                            margin-bottom: 10px;
                        }
                    }

                    .out_btn {
                        width: 100%;
                        display: flex;
                        justify-content: space-around;

                        .out_btn_left {
                            .in_btn_red {
                                border-radius: 5px;
                                font-size: 12px;
                                background-color: #fa4148;
                                border: none;
                            }
                        }

                        .out_btn_right {
                            .in_btn_add {
                                border-radius: 5px;
                                font-size: 12px;
                            }
                        }
                    }

                    .in_Bottom {
                        display: flex;
                        margin-top: 10px;

                        .in_B_L {
                            margin-right: 160px;
                        }
                    }

                    .in_btn {
                        margin-top: 10px;
                        display: flex;

                        .in_btn_red {
                            background-color: #fc4047;
                            border: none;
                            border-radius: 5px;
                            font-size: 12px;
                        }

                        .in_btn_add {
                            margin-left: 120px;
                            border-radius: 5px;
                            font-size: 12px;
                        }
                    }
                }

                .out_carP {
                    max-height: 100%;
                    overflow: auto;
                    position: absolute;
                    bottom: 0px;
                    width: 100%;
                    color: #fff;
                    padding: 20px 40px 10px 40px;
                    font-size: 10px;
                    background-color: rgba(21, 26, 50, 0.5);
                    z-index: 999 !important;
                    transition: opacity 0.3s ease;
                    opacity: 0;

                    .out_content {
                        width: 100%;
                        display: flex;
                        justify-content: space-around;
                        margin-bottom: 10px;

                        .out_left_item {
                            .one {
                                margin-bottom: 5px;
                            }

                            margin-bottom: 10px;
                        }

                        .out_left_itempay {
                            display: flex;

                            .two {
                                margin-left: 3px;
                                color: #f93440;
                            }
                        }

                        .out_right_item {
                            .one {
                                margin-bottom: 5px;
                            }

                            margin-bottom: 10px;
                        }
                    }

                    .out_btn {
                        width: 100%;
                        display: flex;
                        justify-content: space-around;

                        .out_btn_left {
                            .in_btn_green {
                                background-color: #40a42b;
                                border: none;
                                border-radius: 5px;
                                font-size: 12px;
                            }
                        }

                        .out_btn_right {
                            .in_btn_add {
                                // margin-left: 20px;
                                border-radius: 5px;
                                font-size: 12px;
                            }
                        }
                    }

                    .out_Top {
                        display: flex;

                        .out_Top_l {
                            margin-right: 50px;
                        }
                    }

                    .out_Bottom {
                        display: flex;
                        margin-top: 10px;

                        .in_B_L {
                            margin-right: 50px;
                        }

                        .price_red {
                            color: red;
                            font-weight: bold;
                            margin-left: 5px;
                        }
                    }

                    .in_btn {
                        margin-top: 10px;

                        .in_btn_red {
                            background-color: #fc4047;
                            border: none;
                            border-radius: 5px;
                            font-size: 12px;
                        }

                        .in_btn_green {
                            background-color: #40a42b;
                            border: none;
                            border-radius: 5px;
                            font-size: 12px;
                        }

                        .in_btn_add {
                            margin-left: 20px;
                            border-radius: 5px;
                            font-size: 12px;
                        }
                    }

                    &::-webkit-scrollbar {
                        width: 8px;
                    }

                    &::-webkit-scrollbar-thumb {
                        background-color: #999;
                        border-radius: 4px;
                    }

                    &::-webkit-scrollbar-thumb:hover {
                        background-color: #666;
                    }
                }

                &:hover {

                    .in_carP,
                    .out_carP {
                        opacity: 1;
                        /* 变为完全不透明 */
                    }
                }

                .video_name {
                    top: 3px;
                    right: 0px;
                    color: #fff;
                    font-size: 10px;
                    padding: 5px 8px;
                    position: absolute;
                    border-top-left-radius: 10px;
                    border-bottom-left-radius: 10px;
                    background-color: rgba(142, 142, 142, 0.8);
                    z-index: 90;
                }

                .v_left_tips {
                    top: 3px;
                    left: 0px;
                    color: #fff;
                    font-size: 10px;
                    padding: 5px 8px;
                    position: absolute;
                    border-top-right-radius: 10px;
                    border-bottom-right-radius: 10px;
                    background-color: rgba(142, 142, 142, 0.8);
                    z-index: 90;
                }

                .video_item {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .video_item_info {
                    width: 100%;
                    height: 20%;
                    padding: 10px;
                    color: #fff;
                    background-color: #151a32;

                    .out_content {
                        width: 100%;
                        display: flex;
                        // justify-content: space-around;
                        justify-content: center;
                        flex-wrap: wrap;
                        margin-bottom: 10px;

                        .out_left_item {
                            // max-width: 33%;
                            margin-right: 30px;
                            display: flex;
                        }
                    }

                    .out_btn {
                        display: flex;
                        justify-content: space-around;

                        .in_btn_red {
                            border-radius: 5px;
                            background-color: #f73541;
                            border: none;
                        }

                        .in_btn_add {
                            border-radius: 5px;
                        }

                        .in_btn_green {
                            background-color: #389e2e;
                            border: none;
                            border-radius: 5px;
                        }
                    }
                }
            }
        }
    }

    .out_carP::-webkit-scrollbar-track {
        background: transparent;
        /* 轨道背景颜色 */
    }

    .out_carP::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        /* 滚动条拇指部分的颜色，这里设置为半透明黑色 */
        border-radius: 5px;
        /* 滚动条拇指圆角 */
    }

    /deep/ .ant-modal-body {
        padding: 0px !important;
        background-color: #fff;
    }

    /deep/ .ant-modal-footer {
        background-color: #fff;
        border: none !important;
    }

    /deep/ .ant-modal-header {
        color: #fff;
        background: #306def;
        border-bottom: none;
        border-radius: 10px 10px 0 0;

        .anticon {
            color: #fff !important;
        }
    }

    /deep/ .ant-modal-content {
        background-color: transparent;
    }

    /deep/ .ant-modal-title {
        color: #fff;
    }

    /deep/ .ant-table-thead>tr>th {
        background-color: white !important;
    }

    .prize-img-upload {
        /deep/ .ant-upload-list-item-name {
            max-width: 400px;
        }
    }

    /deep/ .scrollable-table .ant-pagination-prev .ant-pagination-item-link,
    .ant-pagination-next .ant-pagination-item-link {
        background-color: #182146 !important;

        .anticon {
            color: #fff;
        }
    }

    /deep/ .scrollable-table .ant-pagination-item-link {
        background-color: #182146 !important;

        .anticon {
            color: #fff;
        }
    }

    /deep/ .scrollable-table .ant-pagination-item {
        background-color: #182146 !important;

        a {
            color: #fff;

            &:hover {
                color: #306def !important;
            }
        }
    }

    /deep/ .ant-pagination-item-active {
        a {
            color: #306def !important;
        }
    }

    .is-selected {
        background-color: #172851;
        color: #3469eb;
    }

    /deep/ .scrollable-table {
        .ant-table-tbody tr:nth-child(2n + 1) {
            background-color: #151a32 !important;
            color: #fff !important;
            border: none !important;
        }
    }

    /* 去除表格行的边框 */
    /deep/ .scrollable-table .ant-table-tbody>tr>td {
        border-bottom: none !important;
    }

    /* 去除表头的边框 */
    /deep/ .scrollable-table .ant-table-thead>tr>th {
        border-bottom: none !important;
    }

    /* 去除表格的外边框 */
    /deep/ .scrollable-table .ant-table {
        border: none !important;
    }

    /deep/ .scrollable-table {
        .ant-table-tbody tr:nth-child(2n) {
            background-color: #172851 !important;
            color: #fff !important;
            border: none !important;
        }
    }

    /deep/ .scrollable-table .ant-table-placeholder {
        background-color: #151a32 !important;
        border-top: none !important;
        border-bottom: none !important;
    }

    /deep/ .scrollable-table .ant-empty-description {
        color: #fff !important;
    }

    /deep/ .scrollable-table .ant-table-thead>tr>th {
        background-color: #172851 !important;
        color: #fff !important;
    }

    /deep/ .scrollable-table .ant-table-tbody>tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)>td {
        background-color: #182146 !important;
    }

    /deep/ .scrollable-table .ant-select-selection {
        background-color: #151a32 !important;
        color: #fff !important;
    }

    /deep/ .scrollable-table .ant-pagination-total-text {
        color: #fff !important;
    }

    // .ant-table-tbody tr:nth-child(2n)
    // /deep/ .ant-table-row tr:nth-child(2n) {
    //     background-color: #fff !important;
    // }

    .up_box {
        border: 1px dashed #999;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 120px;
        height: 120px;
    }

    .prew_img {
        width: 120px;
        height: 120px;
    }

    /deep/ .ant-empty-description {
        color: #fff !important;
    }

    .empty_box {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

</style>