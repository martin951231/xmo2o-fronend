<template>
    <div class="social-activity-list">
        <!-- 搜索筛选区域 -->
        <div class="search-container main-box-content-mini">
            <a-row :gutter="[10, 10]">
                <a-col :span="6">
                    <div class="search-item">
                        <label>活动分类：</label>
                        <a-select style="width: 100%" placeholder="请选择活动分类" v-model="searchParams.cat_id">
                            <a-select-option :value="0">请选择活动分类</a-select-option>
                            <a-select-option v-for="item in categoryList" :key="item.id" :value="item.id">{{ item.name
                                }}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :span="6">
                    <div class="search-item">
                        <label>活动名称：</label>
                        <a-input style="width: 100%" placeholder="请输入活动名称" v-model="searchParams.name" />
                    </div>
                </a-col>
                <a-col :span="6">
                    <div class="search-item">
                        <label>活动时间：</label>
                        <a-range-picker style="width: 100%" v-model="activityTime" format="YYYY-MM-DD"
                            @change="handleActivityTimeChange" />
                    </div>
                </a-col>
                <a-col :span="6">
                    <div class="search-item">
                        <label>创建时间：</label>
                        <a-range-picker style="width: 100%" v-model="createTime" format="YYYY-MM-DD"
                            @change="handleCreateTimeChange" />
                    </div>
                </a-col>
            </a-row>
            <a-row :gutter="[10, 10]">
                <a-col :span="6">
                    <div class="search-item">
                        <label>审核状态：</label>
                        <a-select style="width: 100%" placeholder="请选择审核状态" v-model="searchParams.status">
                            <a-select-option :value="-1">请选择审核状态</a-select-option>
                            <a-select-option v-for="item in statusList" :key="item.id" :value="item.id">{{ item.name
                                }}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :span="6">
                    <div class="search-item">
                        <label>活动状态：</label>
                        <a-select style="width: 100%" placeholder="请选择活动状态" v-model="searchParams.activity_status">
                            <a-select-option :value="0">请选择活动状态</a-select-option>
                            <a-select-option v-for="item in activityStatusList" :key="item.id" :value="item.id">{{
                                item.name }}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :span="6">
                    <div class="search-item">
                        <label>创建人：</label>
                        <a-select style="width: 100%" placeholder="请选择创建人" v-model="searchParams.creator_id">
                            <a-select-option :value="0">请选择创建人</a-select-option>
                            <a-select-option v-for="item in creatorList" :key="item.id" :value="item.id">{{ item.name
                                }}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :span="6">
                    <div class="search-buttons" style="display: flex; gap: 8px;">
                        <a-button type="primary" @click="search">查询</a-button>
                        <a-button @click="resetSearch">重置</a-button>
                    </div>
                </a-col>
            </a-row>
        </div>

        <div class="main-box-content-mini">
            <!-- 操作按钮 -->
            <div class="action-container">
                <a-button type="primary" v-saction:save @click="showCreateModal">创建活动</a-button>
            </div>

            <!-- 表格 -->
            <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" row-key="id"
                style="margin-top: 16px">
                <template slot="activityPoster" slot-scope="text">
                    <img v-if="text" :src="text" alt="活动海报" class="activity-poster" />
                </template>
                <template slot="activityTime" slot-scope="text, record">
                    {{ record.start_time }} - {{ record.end_time }}
                </template>
                <template slot="share" slot-scope="text, record">
                    <a href="#" class="share-link" @click.prevent="showShareModal(record)">分享</a>
                </template>
                <template slot="action" slot-scope="record">
                    <div class="action-buttons">
                        <div v-saction:edit v-if="record.id && record.status != 30" class="action-btn">
                        <a v-if="record.is_view == 0" @click="showCreateModal(record.id)" class="action-btn">编辑</a>
                        <a v-if="record.is_view == 1" @click="showCreateModal(record.id, true)" class="action-btn">查看</a>
                        </div>
                        <div v-saction:recommend v-if="record.recommend == 1 && record.status != 30" class="action-btn">
                        <a-popconfirm placement="top" ok-text="是" cancel-text="否" @confirm="handleRecommend(record, 0)">
                            <template slot="title">
                                <p>确定要撤回吗？</p>
                            </template>
                            <a>撤回</a>
                        </a-popconfirm>
                        </div>
                        <div v-saction:audit v-if="record.status == 0" class="action-btn">
                        <a @click="showAuditModal(record)">审核</a>
                        </div>
                        <div v-saction:recommend v-if="record.recommend == 0 && record.status != 30" class="action-btn">
                        <a-popconfirm placement="top" ok-text="是" cancel-text="否" @confirm="handleRecommend(record, 1)">
                            <template slot="title">
                                <p>确定要推荐吗？</p>
                            </template>
                            <a>推荐</a>
                        </a-popconfirm>
                        </div>
                        <div v-saction:cancel v-if="record.status != 30 && record.activity_status_text == '待开始'" class="action-btn">
                        <a-popconfirm placement="top" ok-text="是" cancel-text="否" @confirm="handleCancelActivity(record)">
                            <template slot="title">
                                <p>确定要取消吗？</p>
                            </template>
                            <a class="action-btn">取消</a>
                        </a-popconfirm>
                        </div>
                        <a v-saction:preview @click="showPreviewModal(record)" class="action-btn">预览</a>
                        <a v-saction:session @click="goToSessionList(record)" class="action-btn">场次</a>
                    </div>
                </template>
            </a-table>
        </div>

        <!-- 创建活动弹窗 -->
        <a-modal v-model="createModalVisible" title="创建社群活动" width="900px" @ok="handleCreate" @cancel="handleCancel">
            <div class="create-modal-content">
                <a-form-model ref="activityFormRef" :model="activityForm" :label-col="labelCol"
                    :wrapper-col="wrapperCol" :rules="rules">
                    <!-- 基本信息 -->
                    <div class="form-section">
                        <h3 class="section-title">基本信息</h3>
                        <a-row :gutter="16">
                            <a-col :span="24">
                                <a-form-model-item label="活动分类" required prop="category_id">
                                    <a-select v-model="activityForm.category_id" placeholder="选择活动分类" :disabled="isView">
                                        <a-select-option v-for="item in categoryList" :key="item.id" :value="item.id">{{
                                            item.name }}</a-select-option>
                                    </a-select>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="24">
                                <a-form-model-item label="活动名称" required prop="name">
                                    <a-input v-model="activityForm.name" placeholder="输入活动名称" :disabled="isView" />
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="24">
                                <a-form-model-item label="活动海报" required prop="poster"
                                    :extra="'建议尺寸1:1，支持 jpg, png, jpeg, gif 等格式'">
                                    <a-upload name="reply_pic" list-type="picture-card" :show-upload-list="true"
                                        :data="{ upload_dir: 'activity/SocialActivity' }" :before-upload="beforeUpload"
                                        :file-list="activityForm.poster" @preview="handlePreview"
                                        action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                                        @change="(info) => handleUploadImg(info, 'activityForm', 'poster', true)" :disabled="isView">
                                        <div v-if="!activityForm.poster || activityForm.poster.length === 0">
                                            <a-icon type="plus" />
                                            <div class="ant-upload-text">上传</div>
                                        </div>
                                    </a-upload>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="24">
                                <a-form-model-item label="视频" prop="video" :style="isView?'pointer-events: none;':''">
                                    <template v-if="activityForm.video.length">
                                        <div
                                            class="goods-img"
                                            v-for="(video, index) of activityForm.video"
                                            :key="'video_' + index"
                                        >
                                            <video :src="video" :poster="videoImage" c></video>
                                            <a-icon
                                                class="delete pointer"
                                                style="font-size: 16px; color: red"
                                                type="close-circle"
                                                theme="filled"
                                                @click="removeImage('video', index)"
                                            />
                                        </div>
                                    </template>
                                    <div
                                        v-if="activityForm.video.length < 1"
                                        @click="chooseImage('video')"
                                        class="b-f1 w-80 h-80 cr-99 flex ml-10 align-center justify-around pointer br-5"
                                    >
                                        <a-icon style="font-size: 32px" type="plus" />
                                    </div>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="24">
                                <a-form-model-item label="社群活动位海报" prop="position_poster"
                                    :extra="'建议尺寸750px * 400px，支持 jpg, png, jpeg, gif 等格式'">
                                    <a-upload name="reply_pic" list-type="picture-card" :show-upload-list="true"
                                        :data="{ upload_dir: 'activity/SocialActivity' }" :before-upload="beforeUpload"
                                        :file-list="activityForm.position_poster" @preview="handlePreview"
                                        action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                                        @change="(info) => handleUploadImg(info, 'activityForm', 'position_poster', true)" :disabled="isView">
                                        <div
                                            v-if="!activityForm.position_poster || activityForm.position_poster.length === 0">
                                            <a-icon type="plus" />
                                            <div class="ant-upload-text">上传</div>
                                        </div>
                                    </a-upload>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="24">
                                <a-form-model-item label="开始时间" required prop="start_time">
                                    <a-date-picker v-model="activityForm.start_time" style="width: 100%"
                                        placeholder="选择开始时间" :disabled="isView" />
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="24">
                                <a-form-model-item label="结束时间" required prop="end_time">
                                    <a-date-picker v-model="activityForm.end_time" style="width: 100%"
                                        placeholder="选择结束时间" :disabled="isView" />
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="24">
                                <a-form-model-item label="活动详情" required prop="content">
                                    <RichText :info.sync="activityForm.content" :height="300" />
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="24">
                                <a-form-model-item label="报名须知" required prop="notice">
                                    <a-textarea v-model="activityForm.notice" :rows="3" placeholder="输入报名须知" :disabled="isView" />
                                </a-form-model-item>
                            </a-col>
                        </a-row>
                    </div>

                    <!-- 活动场次 -->
                    <div class="form-section">
                        <div class="session-header">
                            <h3 class="section-title">活动场次</h3>
                            <a-button type="primary" @click="addSession" :disabled="isView">添加场次</a-button>
                        </div>

                        <div v-for="(session, index) in activityForm.sessions" :key="index" class="session-item">
                            <div class="session-title">
                                <span>场次 {{ index + 1 }}</span>
                                <a-button v-if="activityForm.sessions.length > 1" danger size="small"
                                    @click="removeSession(index)" :disabled="isView">删除场次</a-button>
                            </div>

                            <div class="session-form">
                                <a-form-model-item label="场次名称" required :prop="'sessions.' + index + '.name'">
                                    <a-input v-model="session.name" placeholder="输入场次名称" :disabled="isView" />
                                </a-form-model-item>

                                <a-form-model-item label="参与身份" required :prop="'sessions.' + index + '.identity'">
                                    <a-radio-group v-model="session.identity" :disabled="isView">
                                        <a-radio :value="1">不限</a-radio>
                                        <a-radio :value="2">仅业主</a-radio>
                                        <a-radio :value="3">非业主</a-radio>
                                    </a-radio-group>
                                </a-form-model-item>

                                <a-form-model-item label="参与性别" required :prop="'sessions.' + index + '.gender'">
                                    <a-radio-group v-model="session.gender" :disabled="isView">
                                        <a-radio :value="1">不限</a-radio>
                                        <a-radio :value="2">男</a-radio>
                                        <a-radio :value="3">女</a-radio>
                                    </a-radio-group>
                                </a-form-model-item>

                                <a-form-model-item label="年龄限制" required :prop="'sessions.' + index + '.age_range'">
                                    <a-radio-group v-model="session.age_range" :disabled="isView">
                                        <a-radio :value="0">不限</a-radio>
                                        <a-radio :value="1">年龄区间</a-radio>
                                    </a-radio-group>
                                    <div v-if="session.age_range === 1" required class="age-inputs">
                                        <a-input-number v-model="session.age_min" :min="0" placeholder="最小年龄"
                                            style="width: 100px; margin-left: 8px;" :disabled="isView" />
                                        <span style="margin: 0 8px;">至</span>
                                        <a-input-number v-model="session.age_max" :min="0" placeholder="最大年龄"
                                            style="width: 100px;" :disabled="isView" />
                                    </div>
                                </a-form-model-item>

                                <a-form-model-item label="场次时间" required :prop="'sessions.' + index + '.time_range'">
                                    <a-range-picker v-model="session.time_range" style="width: 100%" show-time :disabled="isView" :show-time="{ format: 'HH:mm' }" format="YYYY-MM-DD HH:mm"/>
                                </a-form-model-item>

                                <a-form-model-item label="活动地点" required :prop="'sessions.' + index + '.location_type'">
                                    <a-radio-group v-model="session.location_type" :disabled="isView">
                                        <a-radio :value="1">场馆预约</a-radio>
                                        <a-radio :value="2">自定义</a-radio>
                                    </a-radio-group>
                                </a-form-model-item>

                                <a-form-model-item v-if="session.location_type === 1" label="选择场馆"
                                    :prop="'sessions.' + index + '.location_id'">
                                    <a-select v-model="session.location_id" placeholder="选择场馆" :disabled="isView">
                                        <a-select-option v-for="item in venueList" :key="item.id"
                                            :value="item.id">{{ item.name }}</a-select-option>
                                    </a-select>
                                </a-form-model-item>

                                <a-form-model-item v-if="session.location_type === 2" label="自定义地点"
                                    :prop="'sessions.' + index + '.location'">
                                    <a-input v-model="session.location" placeholder="输入活动地点" :disabled="isView" />
                                </a-form-model-item>

                                <a-form-model-item label="活动范围" required :prop="'sessions.' + index + '.village_id'">
                                    <a-select v-if="isView == 0" mode="multiple" v-model="session.village_id" placeholder="活动范围" :disabled="isView">
                                        <a-select-option v-for="item in communityList" :key="item.id"
                                            :value="item.id">{{ item.name }}</a-select-option>
                                    </a-select>
                                    <a-tag
                                        v-else
                                        v-for="tag in session.village_name"
                                        :key="tag"
                                        :color="'geekblue'"
                                    >
                                        {{ tag.toUpperCase() }}
                                    </a-tag>
                                </a-form-model-item>

                                <a-form-model-item label="票种" required :extra="'开启后，用户购票会获得积分；关闭后，购票不获得积分'">
                                    <div v-for="(ticket, ticketIndex) in session.tickets" :key="ticketIndex"
                                        class="ticket-item">
                                        <a-input v-model="ticket.name" style="width: 120px; margin-right: 8px;"
                                            placeholder="票种名称" :disabled="isView" />
                                        <a-input-number v-model="ticket.price" :min="0"
                                            style="width: 100px; margin-right: 8px;" placeholder="价格" :disabled="isView" />
                                        <a-input-number v-model="ticket.num" :min="0"
                                            style="width: 100px; margin-right: 8px;" placeholder="数量" :disabled="isView" />
                                        <span style="margin-right: 8px;">积分</span>
                                        <a-switch v-model="ticket.point" :disabled="isView" />
                                        <a-button type="primary" size="small" style="margin-left: 8px;"
                                            @click="addTicket(session)" :disabled="isView">+</a-button>
                                        <a-button v-if="session.tickets.length > 1" danger size="small"
                                            style="margin-left: 8px;"
                                            @click="removeTicket(session, ticketIndex)" :disabled="isView">-</a-button>
                                    </div>
                                </a-form-model-item>

                                <a-form-model-item label="购票时间" required
                                    :prop="'sessions.' + index + '.ticket_time_range'">
                                    <a-range-picker v-model="session.ticket_time_range" style="width: 100%" show-time :disabled="isView" :show-time="{ format: 'HH:mm' }" format="YYYY-MM-DD HH:mm"/>
                                </a-form-model-item>
                            </div>
                        </div>
                    </div>

                    <!-- 报名表单和积分规则 -->
                    <div class="form-section">
                        <h3 class="section-title">报名设置</h3>
                        <a-row :gutter="16">
                            <a-col :span="12">
                                <a-form-model-item label="报名表单" required prop="form_id" :colon="true">
                                    <a-select v-model="activityForm.form_id" placeholder="选择报名表单" :disabled="isView">
                                        <a-select-option v-for="item in formList" :key="item.id" :value="item.id">{{
                                            item.name
                                            }}</a-select-option>
                                    </a-select>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-model-item label="积分规则" required prop="rule_id" :colon="true">
                                    <a-select v-model="activityForm.rule_id" placeholder="选择积分规则" :disabled="isView">
                                        <a-select-option v-for="item in pointList" :key="item.id" :value="item.id">{{
                                            item.name
                                            }}</a-select-option>
                                    </a-select>
                                </a-form-model-item>
                            </a-col>
                        </a-row>
                    </div>

                    <!-- 审核记录 -->
                    <div v-if="auditRecords.length > 0" class="form-section">
                        <h3 class="section-title">审核记录</h3>
                        <a-table
                            :columns="auditColumns"
                            :data-source="auditRecords"
                            :pagination="false"
                            row-key="id"
                        >
                        </a-table>
                    </div>

                </a-form-model>
            </div>

            <template slot="footer">
                <a-button @click="handleCancel">{{ isView ? '关闭' : '取消' }}</a-button>
                <a-button v-if="isView == 0" type="primary" @click="handleCreate">确定</a-button>
            </template>
        </a-modal>

        <!-- 图片预览弹窗 -->
        <a-modal v-model="previewVisible" :footer="null">
            <img alt="预览" style="width: 100%" :src="previewImage" />
        </a-modal>

        <!-- 分享弹窗 -->
        <a-modal v-model="shareModalVisible" title="活动分享" width="450px" :footer="null">
            <div style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
                <!-- 二维码图片 -->
                <div class="qr-code-container">
                    <img :src="h5Qrcode" alt="活动二维码" class="qr-code" style="width: 200px; height: 200px; border: 1px solid #eee; border-radius: 8px;" />
                </div>
                
                <!-- 分享链接 -->
                <div class="share-links" style="margin-top: 20px; width: 100%;">
                    <a-button type="primary" icon="copy" @click="copyShareUrl" style="margin-bottom: 12px; width: 100%;">活动链接复制</a-button>
                    <a-button icon="download" @click="downloadQrCode" style="width: 100%;">下载活动二维码</a-button>
                </div>
            </div>
            
            <template slot="footer">
                <a-button @click="shareModalVisible = false">取消</a-button>
                <a-button type="primary" @click="shareModalVisible = false">确定</a-button>
            </template>
        </a-modal>

        <!-- 预览弹窗 -->
        <a-modal v-model="previewModalVisible" title="活动预览" width="421px" :footer="null">
            <div style="width: 375px;">
                <iframe :src="previewUrl" style="width: 100%; height: 700px; border: none;" />
            </div>
        </a-modal>

        <!-- 审核弹窗 -->
        <a-modal v-model="auditModalVisible" title="审核社群活动" width="500px" @ok="handleAudit" @cancel="auditModalVisible = false">
            <a-form-model :model="auditForm" layout="vertical" style="padding: 10px 40px;">
                <a-form-model-item label="审核：">
                    <a-radio-group v-model="auditForm.status">
                        <a-radio :value="10">通过</a-radio>
                        <a-radio :value="20">拒绝</a-radio>
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item label="备注：">
                    <a-textarea v-model="auditForm.remark" placeholder="请输入备注" :rows="4" style="width: 100%;" />
                </a-form-model-item>
            </a-form-model>
        </a-modal>

        <!-- 场次列表弹窗 -->
        <SessionListDrawer
            :visible="sessionDrawerVisible"
            :activityId="currentActivityId"
            :activityName="currentActivityName"
            @close="sessionDrawerVisible = false"
        />
        <choose-image
        :style="isView?'pointer-events: none;':''"
            ref="chooseImage"
            name="video"
            :store_id="0"
            :max="1"
            upload_dir="/social/activity/video"
            type="video"
            @callback="uploadCallback"
        />
    </div>
</template>

<script>
import { imgUploadHandle, imgUploadFileListHandle, getBase64 } from '@/utils/util.js'
import RichText from '@/components/RichText/RichText2'
import SessionListDrawer from './SessionListDrawer'
import moment from 'moment'
import socialActivityApi from '@/api/social_activity/index'
import ChooseImage from '@/components/ChooseImage/ChooseImage'



export default {
    name: 'SocialActivityList',
    components: {
        RichText,
        SessionListDrawer,
        ChooseImage
    },
    data() {
        return {
            // 弹窗相关
            createModalVisible: false,
            previewVisible: false,
            shareModalVisible: false, // 分享弹窗可见性
            shareQrCode: '', // 分享二维码
            shareUrl: '', // 分享链接
            previewModalVisible: false, // 预览弹窗可见性
            previewUrl: '', // 预览链接
            h5Qrcode: '', // 分享二维码
            auditModalVisible: false, // 审核弹窗可见性
            auditForm: { // 审核表单
                activityId: '',
                status: '', // 10=通过, 20=拒绝
                remark: ''
            },
            sessionDrawerVisible: false, // 场次列表弹窗可见性
            currentActivityId: 0, // 当前选中的活动ID
            currentActivityName: '', // 当前选中的活动名称
            previewImage: '',
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
            // 活动表单数据
            activityForm: {
                category_id: null,
                name: '',
                poster: [],
                position_poster: [],
                start_time: null,
                end_time: null,
                content: '',
                notice: '',
                form_id: null,
                rule_id: null,
                sessions: [
                    {
                        name: '',
                        identity: 1,
                        gender: 1,
                        age_range: null,
                        age_min: null,
                        age_max: null,
                        start_time: null,
                        end_time: null,
                        location_type: 1,
                        location_id: '',
                        location: '',
                        village_id: [],
                        tickets: [
                            {
                                name: '',
                                price: '',
                                num: '',
                                point: true
                            }
                        ],
                        ticket_time_range: null
                    }
                ],
                video: [],
            },
            columns: [
                {
                    title: '活动分类',
                    dataIndex: 'category_name',
                    key: 'category_name'
                },
                {
                    title: '活动名称',
                    dataIndex: 'name',
                    key: 'name'
                },
                {
                    title: '活动海报',
                    dataIndex: 'poster',
                    key: 'poster',
                    scopedSlots: { customRender: 'activityPoster' }
                },
                {
                    title: '活动时间',
                    dataIndex: 'start_time',
                    key: 'start_time',
                    scopedSlots: { customRender: 'activityTime' }
                },
                {
                    title: '活动分享',
                    dataIndex: 'share_url',
                    key: 'share_url',
                    scopedSlots: { customRender: 'share' }
                },
                {
                    title: '审核状态',
                    dataIndex: 'status_text',
                    key: 'status_text',
                },
                {
                    title: '活动状态',
                    dataIndex: 'activity_status_text',
                    key: 'activity_status_text',
                },
                {
                    title: '创建人',
                    dataIndex: 'creator',
                    key: 'creator'
                },
                {
                    title: '创建时间',
                    dataIndex: 'create_time',
                    key: 'create_time'
                },
                {
                    title: '操作',
                    key: 'action',
                    scopedSlots: { customRender: 'action' }
                }
            ],
            auditColumns: [
                {
                    title: '创建人',
                    dataIndex: 'activity_creator',
                    key: 'activity_creator'
                },
                {
                    title: '创建时间',
                    dataIndex: 'activity_create_time',
                    key: 'activity_create_time'
                },
                {
                    title: '审核状态',
                    dataIndex: 'status_text',
                    key: 'status_text',
                    scopedSlots: { customRender: 'status_text' }
                },
                {
                    title: '审核人',
                    dataIndex: 'creator',
                    key: 'creator'
                },
                {
                    title: '审核时间',
                    dataIndex: 'create_time',
                    key: 'create_time'
                },
                {
                    title: '备注',
                    dataIndex: 'note',
                    key: 'note'
                }
            ],
            dataSource: [],
            pagination: {
                current: 1,
                pageSize: 10,
                total: 100,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
            },
            categoryList: [], // 活动分类列表
            statusList: [], // 审核状态列表
            activityStatusList: [], // 活动状态列表
            creatorList: [], // 创建人列表
            searchParams: {
                cat_id: 0,
                name: '',
                creator_id: 0,
                status: -1,
                activity_status: 0,
                start_time: '',
                end_time: '',
                activity_start_time: '',
                activity_end_time: ''
            },
            activityTime: [],
            createTime: [],
            venueList: [], // 场地列表
            formList: [], // 表单列表
            pointList: [], // 积分规则列表
            communityList: [], // 小区列表
            perVenueList: [], // 每个小区对应的场地列表
            rules: {
                name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
                poster: [{ required: true, message: '请上传活动海报', trigger: 'blur' }],
                category_id: [{ required: true, message: '请选择活动分类', trigger: 'change' }],
                start_time: [{ required: true, message: '请选择活动开始时间', trigger: 'blur' }],
                end_time: [{ required: true, message: '请选择活动结束时间', trigger: 'blur' }],
                content: [{ required: true, message: '请输入活动详情', trigger: 'blur' }],
                notice: [{ required: true, message: '请输入报名通知', trigger: 'blur' }],
                sessions: [{ required: true, message: '请添加场次', trigger: 'change' }],
                form_id: [{ required: true, message: '请选择报名表单', trigger: 'change' }],
                rule_id: [{ required: true, message: '请选择报名规则', trigger: 'change' }],
            },
            auditRecords: [], // 审核记录列表
            isView: false, // 是否查看模式
            videoImage: '',
        }
    },
    created() {
        this.getList()
    },
    methods: {
        // 查询
        search() {
            this.pagination.current = 1
            this.getList()
        },
        // 重置查询
        resetSearch() {
            this.pagination.current = 1
            this.searchParams = {
                cate_id: 0,
                name: '',
                creator_id: 0,
                status: -1,
                activity_status: 0,
                start_time: '',
                end_time: '',
                activity_start_time: '',
                activity_end_time: ''
            }
            this.activityTime = []
            this.createTime = []
            this.getList()
        },
        // 活动时间选择器改变时触发
        handleActivityTimeChange(val, dateString) {
            this.$set(this, 'activityTime', [val[0], val[1]])
            this.searchParams.activity_start_time = dateString[0]
            this.searchParams.activity_end_time = dateString[1]
        },
        // 创建时间选择器改变时触发
        handleCreateTimeChange(val, dateString) {
            this.$set(this, 'createTime', [val[0], val[1]])
            this.searchParams.start_time = dateString[0]
            this.searchParams.end_time = dateString[1]
        },
        // 显示创建活动弹窗
        showCreateModal(id = 0, isView = false) {
            this.isView = isView
            this.createModalVisible = true
            this.activityForm = {
                category_id: null,
                name: '',
                poster: [],
                position_poster: [],
                start_time: null,
                end_time: null,
                content: '',
                notice: '',
                form_id: null,
                rule_id: null,
                sessions: [
                    {
                        name: '',
                        identity: 1,
                        gender: 1,
                        age_range: 0,
                        age_min: null,
                        age_max: null,
                        start_time: null,
                        end_time: null,
                        location_type: 1,
                        location_id: '',
                        location: '',
                        village_id: [],
                        tickets: [
                            {
                                name: '',
                                price: '',
                                num: '',
                                point: true
                            }
                        ],
                        ticket_time_range: null
                    }
                ],
                video: [],
            },
            this.venueList = [] // 场地列表
            this.formList = [] // 表单列表
            this.pointList = [] // 积分规则列表
            this.communityList = [] // 小区列表
            this.auditRecords = [] // 审核记录列表
            this.getEditInfo()
            if (id > 0) {
                this.detailActivity(id, isView)
            }
        },
        // 获取活动详情
        detailActivity(id, isView = 0) {
            this.request(socialActivityApi.getActivityDetail, { id: id, is_view: isView }).then((res) => {
                this.activityForm = res || {}
                this.activityForm.position_poster = res.position_poster ? imgUploadFileListHandle([res.position_poster], 'position_poster') : []
                this.activityForm.poster = res.poster ? imgUploadFileListHandle([res.poster], 'poster') : []
                this.activityForm.sessions.forEach(item => {
                    if(item.tickets && item.tickets.length <= 0){
                        item.tickets = [
                            {
                                name: '',
                                price: '',
                                num: '',
                                point: true
                            }
                        ]
                    }
                })
                this.auditRecords = res.auditRecords || []
            })
        },
        // 获取相关信息
        getEditInfo() {
            this.request(socialActivityApi.getEditInfo, {}).then((res) => {
                console.log(res, 1111111111)
                this.venueList = res.venueList || []
                this.formList = res.formList || []
                this.pointList = res.pointList || []
                this.communityList = res.communityList || []
            })
        },

        getList() {
            let params = {
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
            }

            let postParams = { ...params, ...this.searchParams }
            this.request(socialActivityApi.getActivityList, postParams).then((res) => {
                this.dataSource = res.data || []
                if (!this.dataSource.length && this.pagination.current > 1) {
                    this.pagination.current = this.pagination.current - 1
                    this.getList()
                }
                // 分类列表
                this.categoryList = res.cat_list || []
                // 审核状态列表
                this.statusList = res.status || []
                // 活动状态列表
                this.activityStatusList = res.activity_status || []
                // 创建人列表
                this.creatorList = res.creator_list || []
                this.pagination.total = res.total || 0
            })
        },

        // 处理取消
        handleCancel() {
            this.createModalVisible = false
        },

        // 添加场次
        addSession() {
            let params = {
                name: '',
                identity: 1,
                gender: 1,
                age_range: 0,
                age_min: null,
                age_max: null,
                start_time: null,
                end_time: null,
                location_type: 1,
                location_id: '',
                location: '',
                village_id: [],
                tickets: [
                    {
                        name: '',
                        price: '',
                        num: '',
                        point: true
                    }
                ],
                ticket_time_range: null
            }
            this.activityForm.sessions.push(params)
            // 确保响应式更新
            this.$forceUpdate()
        },

        // 删除场次
        removeSession(index) {
            if (this.activityForm.sessions.length > 1) {
                this.activityForm.sessions.splice(index, 1)
                // 确保响应式更新
                this.$forceUpdate()
            }
        },

        // 添加票种
        addTicket(session) {
            const newTicket = {
                name: '',
                price: '',
                num: '',
                point: true
            }
            session.tickets.push(newTicket)
            // 确保响应式更新
            this.$forceUpdate()
        },

        // 删除票种
        removeTicket(session, ticketIndex) {
            if (session.tickets.length > 1) {
                session.tickets.splice(ticketIndex, 1)
                // 确保响应式更新
                this.$forceUpdate()
            }
        },

        // 图片上传前处理
        beforeUpload(file) {
            const isImage = file.type.startsWith('image/')
            const isVideo = file.type.startsWith('video/')
            if (!isImage && !isVideo) {
                this.$message.error('只能上传图片或视频文件!')
                return false
            }
            const isLt1M = file.size / 1024 / 1024 < 1
            if (!isLt1M) {
                this.$message.error('文件大小不能超过 1MB!')
                return false
            }
            return true
        },

        // 处理图片上传
        handleUploadImg(info, formField, field, multiple = false) {
            const { fileList = [], resultData = {} } = imgUploadHandle(info, multiple)
            this[formField][field] = fileList
        },

        // 预览图片
        handlePreview(file) {
            this.previewImage = file.url || file.thumbUrl
            this.previewVisible = true
        },
        // 显示分享弹窗
        showShareModal(record) {
            this.shareModalVisible = true
            // 假设后端返回的分享二维码链接
            this.shareUrl = record.share_url || ''
            if(this.shareUrl){
                var url = encodeURIComponent(this.shareUrl)
                this.h5Qrcode = location.origin + '/index.php?g=Index&c=Recognition&a=get_own_qrcode&qrCon=' + url
            }
        },
        // 复制分享链接
        copyShareUrl() {
            const input = document.createElement('input')
            input.value = this.shareUrl
            document.body.appendChild(input)
            input.select()
            document.execCommand('copy')
            document.body.removeChild(input)
            this.$message.success('链接复制成功')
        },
        // 下载二维码
        downloadQrCode() {
            if (!this.h5Qrcode) {
                this.$message.warning('暂无二维码')
                return
            }
            window.open(this.h5Qrcode)
        },
        // 显示预览弹窗
        showPreviewModal(record) {
            this.previewUrl = record.share_url || ''
            this.previewModalVisible = true
        },
        // 显示审核弹窗
        showAuditModal(record) {
            this.auditForm = {
                activityId: record.id,
                status: '',
                remark: ''
            }
            this.auditModalVisible = true
        },
        // 处理审核
        handleAudit() {
            if (!this.auditForm.status) {
                this.$message.warning('请选择审核结果')
                return
            }
            
            this.request(socialActivityApi.auditActivity, {
                id: this.auditForm.activityId,
                status: this.auditForm.status,
                remark: this.auditForm.remark
            }).then(res => {
                this.$message.success('审核成功')
                this.auditModalVisible = false
                this.getList()
            })
        },
        // 处理推荐/撤回
        handleRecommend(record, recommend) {
            const actionText = recommend === 1 ? '推荐' : '撤回'
            this.request(socialActivityApi.recommendActivity, {
                id: record.id,
                recommend: recommend
            }).then(res => {
                this.$message.success(`${actionText}成功`)
                this.getList()
            })
        },
        // 处理取消活动
        handleCancelActivity(record) {
            this.request(socialActivityApi.cancelActivity, {
                id: record.id
            }).then(res => {
                this.$message.success('取消成功')
                this.getList()
            })
        },
        // 显示场次列表弹窗
        goToSessionList(record) {
            this.currentActivityId = record.id
            this.currentActivityName = record.name
            this.sessionDrawerVisible = true
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getList()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getList()
        },

        // 处理创建活动
        handleCreate() {
            this.$refs.activityFormRef.validate((valid) => {
                if (valid) {
                    const getImages = (fileList) => {
                        return fileList.map(v => v.response.data.fileUrl || v.response.data)
                    }
                    // 准备提交数据
                    const submitData = {
                        ...this.activityForm,
                        // 格式化时间为 YYYY-MM-DD 格式
                        start_time: this.activityForm.start_time ? moment(this.activityForm.start_time).format('YYYY-MM-DD') : '',
                        end_time: this.activityForm.end_time ? moment(this.activityForm.end_time).format('YYYY-MM-DD') : '',
                        // 处理海报和社群活动位海报
                        poster: getImages(this.activityForm.poster)[0],
                        position_poster: getImages(this.activityForm.position_poster)[0]
                    }

                    // 处理场次数据
                    submitData.sessions = this.activityForm.sessions.map(session => {
                        return {
                            ...session,
                            // 处理场次时间（时间选择器返回的是HH:mm:ss格式）
                            start_time: session.start_time ? (typeof session.start_time === 'string' ? session.start_time : moment(session.start_time).format('HH:mm')) : '',
                            end_time: session.end_time ? (typeof session.end_time === 'string' ? session.end_time : moment(session.end_time).format('HH:mm')) : '',
                            // 处理购票时间
                            ticket_start_time: session.ticket_time_range && session.ticket_time_range[0] ? moment(session.ticket_time_range[0]).format('YYYY-MM-DD HH:mm') : '',
                            ticket_end_time: session.ticket_time_range && session.ticket_time_range[1] ? moment(session.ticket_time_range[1]).format('YYYY-MM-DD HH:mm') : '',
                            // 处理票种
                            ticket_rule: JSON.stringify(session.tickets),
                            //处理场次时间
                            start_time: session.time_range && session.time_range[0] ? moment(session.time_range[0]).format('YYYY-MM-DD HH:mm') : '',
                            end_time: session.time_range  && session.time_range[1] ? moment(session.time_range[1]).format('YYYY-MM-DD HH:mm') : ''
                        }
                    })

                    console.log('提交数据:', submitData)
                    // 这里可以添加 API 调用逻辑
                    this.request(socialActivityApi.saveActivity, submitData).then(res => {
                        this.$message.success('活动创建成功')
                        this.createModalVisible = false
                        this.getList()
                    })
                }
            })
        },
        // 上传成功后的回调
        uploadCallback(e) {
            const { max } = this
            const { name } = e

            if (name == 'video') {
                this.videoImage = e.list[1]
                this.$set(this.activityForm, name, e.list[0].split())
                console.log(this.activityForm);
            }
            console.log(this.activityForm)
        },
        removeImage(type, index) {
            this.activityForm[type].splice(index, 1)
            this.$set(this.activityForm, type, this.activityForm[type])
        },
        // 选择图片
        chooseImage(type) {
            let url = '/social/activity/images_'
            if (type == 'video') {
                url = '/social/activity/video'
            }
            this.$refs.chooseImage.openDialog()
        },
    }
}
</script>

<style lang="less" scoped>
.social-activity-list {
    min-height: calc(100vh);
    margin: 10px 0;

    .search-container {

        .search-item {
            display: flex;
            align-items: center;

            label {
                min-width: 80px;
                max-width: 80px;
                text-align: right;
                margin-right: 8px;
                color: #666;
                white-space: nowrap;
            }
        }
    }

    .action-container {
        margin-bottom: 16px;
    }

    .activity-poster {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 4px;
    }

    .share-link {
        color: #1890FF;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }

    .action-buttons {
        display: flex;
        gap: 8px;

        .action-btn {
            color: #1890FF;
            cursor: pointer;

            &:hover {
                text-decoration: underline;
            }

            &:not(:last-child)::after {
                content: '|';
                margin-left: 8px;
                color: #999;
            }
        }
    }

    // 分享弹窗样式
    .qr-code-container {
        text-align: center;
        margin-bottom: 20px;

        .qr-code {
            width: 200px;
            height: 200px;
            border: 1px solid #eee;
            border-radius: 8px;
        }

        .qr-code-label {
            display: block;
            margin-top: 8px;
            font-size: 14px;
            color: #666;
        }
    }

    .share-links {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .share-link-btn {
            color: #1890FF;
            cursor: pointer;
            font-size: 14px;

            &:hover {
                text-decoration: underline;
            }
        }
    }

}

// 创建活动弹窗样式
.create-modal-content {
    max-height: 60vh;
    overflow-y: auto;
    padding-right: 8px;

    .form-section {
        margin-bottom: 24px;

        &:last-child {
            margin-bottom: 0;
        }

        .section-title {
            font-size: 16px;
            font-weight: 500;
            color: #333;
            margin: 0 0 16px 0;
            padding-bottom: 8px;
            border-bottom: 1px solid #eee;
        }

        .session-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;

            h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 500;
            }
        }

        .session-item {
            background: #f9f9f9;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 16px;

            .session-title {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;

                span {
                    font-weight: 500;
                }
            }

            .age-inputs {
                display: flex;
                align-items: center;
                margin-top: 8px;
            }

            .session-form {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
        }

        .ticket-item {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
        }

        .audit-status {
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
        }

        .audit-status-0 {
            color: #faad14;
            background: #fff7e6;
        }

        .audit-status-1 {
            color: #52c41a;
            background: #f6ffed;
        }

        .audit-status-2 {
            color: #ff4d4f;
            background: #fff2f0;
        }
    }
}
.goods-img {
    width: 80px;
    height: 80px;
    margin: 10px 10px 10px 0;
    border-radius: 5px;
    position: relative;
    display: inline-block;
    border: 1px solid #d9d9d9;
    img,
    video {
        width: 100%;
        height: 100%;
        border-radius: 5px;
    }
    .delete {
        position: absolute;
        right: 0px;
        top: 0px;
    }
}
</style>