<template>
    <!-- bg-f4 -->
    <div class="pt-20 pb-20 pages">
        <!-- header -->
        <div class="header-wrap">
            <div class="cr-white header-title">{{ L('排号') }}</div>
            <div class="header-btn-wrap flex align-center">
                <div class="cr-white header-btn reset-queue pointer" @click="resetQueue()">
                    {{ L('重置排号') }}
                </div>
                <div class="cr-white header-btn status-queue pointer" @click="queueStatusOpt()">
                    {{ queueStatus == 1 ? L('关闭在线排号') : L('开启在线排号') }}
                </div>
            </div>
        </div>
        <a-spin :spinning="loadingdata" :indicator="indicator" size="large" class="changecolor" />
        <div class="mt-20 pl-20 pr-20 cr-white" v-if="!loadingdata && table_type_list.length">
            <a-row type="flex" justify="space-between">
                <a-col :span="17">
                    <a-row>
                        <a-col>
                            <a-row>
                                <a-col>
                                    <!-- 桌台类型 -->
                                    <div class="flex align-center tablesize_container_wrap justify-between">
                                        <a-tabs :default-active-key="cur_table_type" @change="tabChange">
                                            <a-tab-pane v-for="item in table_type_list" :key="item.id">
                                                <span slot="tab">
                                                    <a-badge :count="item.count">
                                                        <div
                                                            class="table_name"
                                                            :class="
                                                                item.id == cur_table_type ? 'table_name_active' : ''
                                                            "
                                                        >
                                                            <span>{{ item.name }}</span>
                                                            <span v-if="item.people_num">
                                                                {{ item.people_num }}
                                                            </span>
                                                        </div>
                                                    </a-badge>
                                                </span>
                                            </a-tab-pane>
                                        </a-tabs>
                                        <div class="refresh flex align-center">
                                            <div class="flex align-center refresh-countdown">
                                                <a-statistic-countdown
                                                    title=""
                                                    :value="countdown"
                                                    @finish="onFinish"
                                                    :suffix="'s'"
                                                    format="s"
                                                />
                                                <span>{{ L('后自动刷新排号信息') }}</span>
                                            </div>
                                            <div class="refresh-btn pointer" @click=";(spin = true), getList()">
                                                <a-icon type="sync" :spin="spin" />
                                            </div>
                                        </div>
                                    </div>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                </a-col>
                <a-col :span="7">
                    <a-row class="pl-20">
                        <a-col>
                            <div class="bg-white add-queue-title cr-black flex justify-center align-center">
                                <span>{{ L('取号') }}</span>
                            </div>
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>

            <a-row class="queue-wrap">
                <a-col :span="17">
                    <!-- 排号列表 -->
                    <div v-if="queue_list.length" class="queue-list">
                        <div
                            class="flex align-center bg-white queue-item justify-between"
                            v-for="(queueItem, queueItemIndex) in queue_list"
                            :key="queueItemIndex"
                        >
                            <div class="queue-number cr-white flex align-center justify-center">
                                <span>{{ queueItem.number }}</span>
                            </div>
                            <div class="queue-btn flex align-center">
                                <div
                                    class="queue-btn-item flex align-center flex-direction justify-around pointer"
                                    v-for="btnItem in btnOptions"
                                    :key="btnItem.type"
                                    @click="queueBtnOpt(queueItem, btnItem.type)"
                                >
                                    <div class="queue-btn-bg">
                                        <img :src="btnItem.imgUrl" alt="" />
                                    </div>
                                    <div class="cr-black">
                                        <span>{{ btnItem.text }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="queue-list flex justify-center align-center">
                        <span class="empty"> {{ L('暂无排号') }} </span>
                    </div>
                </a-col>
                <a-col :span="7" class="pl-20">
                    <a-row class="pl-20">
                        <a-col>
                            <div
                                class="add-queue-wrap bg-white cr-black flex justify-center align-center flex-direction"
                                v-if="is_queue == 0"
                            >
                                <img src="@/assets/storestaff/tips.png" alt="" />
                                <span class="mt-20 fw-bold tips">
                                    {{ L('请配置打印机即可取号') }}
                                </span>
                            </div>
                            <div class="add-queue-wrap bg-white cr-black flex align-center flex-direction" v-else>
                                <div class="width-fill">
                                    <div class="flex align-center add-queue-input width-fill">
                                        <a-icon type="team" />
                                        <div @click="input_type = 'num'" class="input-box flex-1 flex align-center">
                                            <span v-if="num">{{ num }}</span>
                                            <span v-if="input_type == 'num'" class="cursor_box_show"></span>
                                            <span class="input-placeholder" v-if="!num">{{ L('请输入就餐人数') }}</span>
                                        </div>
                                    </div>
                                    <div class="flex align-center add-queue-input mt-20">
                                        <a-icon type="phone" class="phone" />
                                        <div @click="input_type = 'phone'" class="input-box flex-1 flex align-center">
                                            <span v-if="phone">{{ phone }}</span>
                                            <span v-if="input_type == 'phone'" class="cursor_box_show"></span>
                                            <span class="input-placeholder" v-if="!phone">{{ L('请输入电话') }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="kewboard-wrap flex-1 cr-black width-fill mt-20 flex flex-wrap">
                                    <div v-for="item in keyboard_arr" :key="item.value" class="keyboard-item">
                                        <span
                                            class="pointer num-item"
                                            v-if="item.type == 'num'"
                                            @click="keyboardOpt(item)"
                                            >{{ item.label }}</span
                                        >
                                        <span
                                            v-if="item.type == 'btn'"
                                            class="cr-red pointer"
                                            @click="keyboardOpt(item)"
                                            >{{ item.label }}</span
                                        >
                                        <span
                                            v-if="item.type == 'btn_icon'"
                                            class="cr-black pointer"
                                            @click="keyboardOpt(item)"
                                        >
                                            <a-icon :type="item.label" />
                                        </span>
                                    </div>
                                </div>
                                <div
                                    class="ml-20 mr-20 add-queue-btn cr-white mt-20 fw-bold width-fill pointer"
                                    @click="addQueueOpt()"
                                >
                                    {{ L('取号') }}
                                </div>
                            </div>
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { statistic } from 'ant-design-vue'
Vue.use(statistic)
export default {
    data() {
        return {
            spin: false,
            loadingdata: true,
            indicator: <a-icon type="loading-3-quarters" font-size="30px" spin />,
            queueStatus: 1, // 在线排号开启关闭
            countdown: Date.now() + 21 * 1000,
            table_type_list: [],
            cur_table_type: '',
            btnOptions: [
                {
                    text: this.L('叫号'),
                    type: 'use_queue',
                    imgUrl: require('@/assets/storestaff/queueUse.png'),
                },
                {
                    text: this.L('就餐'),
                    type: 'take_queue',
                    imgUrl: require('@/assets/storestaff/queueTake.png'),
                },
                {
                    text: this.L('过号'),
                    type: 'over_queue',
                    imgUrl: require('@/assets/storestaff/queueOver.png'),
                },
            ],
            queueAudioUrl: '',
            audio: '',
            audioPlayCount: 0,
            is_queue: 0,
            num: '',
            phone: '',
            input_type: '',
            keyboard_arr: [
                {
                    value: '1',
                    label: '1',
                    type: 'num',
                },
                {
                    value: '2',
                    label: '2',
                    type: 'num',
                },
                {
                    value: '3',
                    label: '3',
                    type: 'num',
                },
                {
                    value: '4',
                    label: '4',
                    type: 'num',
                },
                {
                    value: '5',
                    label: '5',
                    type: 'num',
                },
                {
                    value: '6',
                    label: '6',
                    type: 'num',
                },
                {
                    value: '7',
                    label: '7',
                    type: 'num',
                },
                {
                    value: '8',
                    label: '8',
                    type: 'num',
                },
                {
                    value: '9',
                    label: '9',
                    type: 'num',
                },
                {
                    value: 'empty',
                    label: this.L('清空'),
                    type: 'btn',
                },
                {
                    value: '0',
                    label: '0',
                    type: 'num',
                },
                {
                    value: 'del',
                    label: 'arrow-left',
                    type: 'btn_icon',
                },
            ],
        }
    },
    computed: {
        queue_list() {
            let list = []
            if (this.table_type_list && this.table_type_list.length) {
                this.table_type_list.forEach((item) => {
                    if (item.id == this.cur_table_type && item.queue_list) {
                        list = list.concat(item.queue_list)
                    }
                })
            }
            return list
        },
    },
    mounted() {
        this.getQueueStatus()
        this.getList(true)
    },
    methods: {
        // 获取在线取号状态
        getQueueStatus(messageTips = false) {
            let success = (res) => {
                this.queueStatus = res.status || 0
                if (messageTips) {
                    if (this.queueStatus == 1) {
                        this.$message.success(this.L('已开启在线排号'))
                    } else {
                        this.$message.success(this.L('已关闭在线排号'))
                    }
                }
            }

            this.request('/foodshop/storestaff.foodshopStore/status').then(success)
        },
        // 在线取号开启关闭
        queueStatusOpt() {
            let params = {
                queue_is_open: this.queueStatus == 1 ? 0 : 1,
            }

            let success = (res) => {
                this.getQueueStatus(true)
            }

            this.request('/foodshop/storestaff.foodshopStore/change_queue', params).then(success)
        },
        // 重置排号
        resetQueue() {
            this.closeAudioOpt()

            let success = (res) => {
                this.getList()
                this.$message.success(this.L('已重置排号'))
            }

            this.request('/foodshop/storestaff.foodshopStore/reset_queue', null).then(success)
        },
        // 排号列表
        getList(loadingdata = false) {
            this.loadingdata = loadingdata
            let success = (res) => {
                this.table_type_list = res.table_type_list || []
                this.is_queue = res.is_queue || 0
                if (this.table_type_list && this.table_type_list.length && this.cur_table_type == '') {
                    this.cur_table_type = this.table_type_list[0].id
                }
                this.loadingdata = false
                setTimeout(() => {
                    this.spin = false
                }, 500)
            }
            this.request('/foodshop/storestaff.foodshopStore/queue_list', null)
                .then(success)
                .catch((err) => {
                    this.loadingdata = false
                    setTimeout(() => {
                        this.spin = false
                    }, 500)
                })
        },
        tabChange(activeKey) {
            this.cur_table_type = activeKey
        },
        // 倒计时结束
        onFinish() {
            this.countdown = Date.now() + 21 * 1000
            this.getList()
        },
        // btnType 叫号 use_queue 就餐 take_queue 过号 over_queue
        queueBtnOpt(current, btnType) {
            // 是否依次叫号
            let curIndex = ''
            this.table_type_list.forEach((item, index) => {
                if (item.id == this.cur_table_type && item.queue_list && item.queue_list.length) {
                    item.queue_list.forEach((queueItem, queueIndex) => {
                        if (queueItem.id == current.id) {
                            curIndex = queueIndex
                        }
                    })
                }
            })

            let queue_text = this.L('叫号')
            if (btnType == 'take_queue') {
                queue_text = this.L('就餐')
            } else if (btnType == 'over_queue') {
                queue_text = this.L('过号')
            }

            if (curIndex !== 0) {
                this.$confirm({
                    title: this.L('提示'),
                    content: this.L(`此号码不是当前最近排号码，是否确认X1？`, { X1: queue_text }),
                    onOk: () => {
                        if (btnType == 'use_queue') {
                            this.useQueueOpt(current)
                        } else if (btnType == 'take_queue') {
                            this.updateQueueOpt(current, '1')
                        } else if (btnType == 'over_queue') {
                            this.updateQueueOpt(current, '3')
                        }
                    },
                    onCancel() {},
                })
            } else {
                if (btnType == 'use_queue') {
                    this.useQueueOpt(current)
                } else if (btnType == 'take_queue') {
                    this.updateQueueOpt(current, '1')
                } else if (btnType == 'over_queue') {
                    this.updateQueueOpt(current, '3')
                }
            }
        },
        // 叫号
        useQueueOpt(current) {
            this.closeAudioOpt()
            let params = {
                id: current.id,
            }

            let success = (res) => {
                this.queueAudioUrl = res.url
                this.audioPlayOpt()
            }

            this.request('/foodshop/storestaff.foodshopStore/use_queue', params).then(success)
        },
        audioPlayOpt() {
            this.audio = new Audio()
            this.audio.src = this.queueAudioUrl
            let playPromise = this.audio.play()
            if (playPromise) {
                playPromise
                    .then(() => {
                        // 音频加载成功
                        console.log('音频播放成功')
                        this.audio.play()
                    })
                    .catch((e) => {
                        // 音频加载失败 重新加载
                        console.error(e)
                        this.$message.error(this.L('叫号失败，请重试'))
                        this.audioPlayCount = 0
                    })
            }

            this.audio.addEventListener('ended', (e) => {
                console.log(this.audioPlayCount, 'this.audioPlayCount')
                this.audioPlayCount++
                if (this.audioPlayCount > 3 || this.audioPlayCount == 3) {
                    this.audio.pause()
                    this.audioPlayCount = 0
                    this.audioPlayCount
                } else {
                    this.audio.play()
                }
            })
        },
        closeAudioOpt() {
            if (this.audio) {
                this.audio.pause()
                this.$nextTick(() => {
                    this.audio = ''
                    this.audioPlayCount = 0
                })
            }
        },
        // 就餐 1 过号 3
        updateQueueOpt(current, status) {
            this.closeAudioOpt()

            let params = {
                id: current.id,
                status: status,
            }

            let success = (res) => {
                this.getList()
            }

            this.request('/foodshop/storestaff.foodshopStore/update_queue', params).then(success)
        },
        // 键盘
        keyboardOpt(current) {
            if (!this.input_type) {
                this.input_type = 'num'
            }
            let val = '',
                id = ''
            if (current.value == 'empty') {
                val = ''
                if (this.input_type == 'num') {
                    this.num = val
                }
                if (this.input_type == 'phone') {
                    this.phone = val
                }
                return
            }

            if (this.input_type == 'num') {
                val = this.num
                id = 'numInput'
            }
            if (this.input_type == 'phone') {
                val = this.phone
                id = 'phoneInput'
            }

            if (val == '' && current.value == '0' && this.input_type == 'num') return

            if (current.value != 'del') {
                if (val == '' && current.value == '0') {
                    val = ''
                } else {
                    if (current.value) {
                        val += current.value
                    }
                }
            } else {
                if (val.length && current.value == 'del') {
                    val = val.substring(0, val.length - 1)
                }
            }

            console.log('val', val)

            if (this.input_type == 'num') {
                this.num = val
            }
            if (this.input_type == 'phone') {
                this.phone = val
            }
        },
        // 取号
        addQueueOpt() {
            // 校验
            let emptyArr = ['', null, undefined, 'null', 'undefined', 0, '0']

            if (emptyArr.indexOf(this.num.trim()) != -1) {
                this.$message.error(this.L('请输入就餐人数！'))
                return
            }

            if (Number(this.num) > 255) {
                this.$message.error(this.L('就餐人数最多255位！'))
                return
            }

            let reg = /^[1-9]\d*$/

            if (!reg.test(this.num)) {
                this.$message.error(this.L('请输入正确的就餐人数！'))
                return
            }

            if (emptyArr.indexOf(this.phone.trim()) != -1) {
                this.$message.error(this.L('请输入电话！'))
                return
            }

            if (!reg.test(this.phone)) {
                this.$message.error(this.L('请输入正确的电话！'))
                return
            }

            let params = {
                table_type: this.cur_table_type,
                num: this.num,
                phone: this.phone,
            }

            let success = (res) => {
                this.getList(true)
                this.$message.success(this.L('取号成功'))
                this.input_type = ''
                this.num = ''
                this.phone = ''
            }

            this.request('/foodshop/storestaff.foodshopStore/add_queue', params).then(success)
        },
    },
}
</script>

<style lang="less" scoped>
@rem: 192; //定义页面尺寸
@bg-ffa40d: #ffa40d;
@bg-25b7aa: #25b7aa;
@bg-ffffff: #ffffff;
@queue-item-height: 110;
@queue-height: calc((5 * @queue-item-height) / @rem * 1rem + 80px);
@table-type-height: 70 / @rem * 1rem;
@btn-height: 60 / @rem * 1rem;
@bg-gray: rgba(65, 65, 65, 0.8);
@bg-b9b9b9: #b9b9b9;
.flex-direction {
    flex-direction: column;
}
.bg-white {
    background: @bg-ffffff;
}
.width-fill {
    width: 100%;
}
.pages {
    min-height: 100%;
    box-sizing: border-box;
}
.header-wrap {
    position: relative;
    margin: 10 / @rem * 1rem auto 20 / @rem * 1rem;
    width: 100%;
    height: 80 / @rem * 1rem;
    line-height: 80 / @rem * 1rem;
}
.header-title {
    height: 100%;
    font-size: 30 / @rem * 1rem;
    font-weight: bold;
    text-align: center;
}
.header-btn-wrap {
    position: absolute;
    right: 0;
    top: 0;
    padding: 10 / @rem * 1rem 40 / @rem * 1rem;
}
.header-btn {
    margin-left: 40 / @rem * 1rem;
    padding: 0 20 / @rem * 1rem;
    height: @btn-height;
    line-height: @btn-height;
    font-size: 20 / @rem * 1rem;
    font-weight: 500;
    white-space: nowrap;
    text-align: center;
    border-radius: 10 / @rem * 1rem;
}
.reset-queue {
    background: @bg-ffa40d;
}
.status-queue {
    background: @bg-25b7aa;
}

.tablesize_container_wrap,
.add-queue-title {
    width: 100%;
    height: @table-type-height;
    background-color: @bg-ffffff;
    border-radius: 4px;
}
.tablesize_container_wrap {
    padding: 0 20px;
    background-color: @bg-gray;
}

.tablesize_container_wrap /deep/ .ant-tabs-bar {
    margin: 0;
    border-bottom: none;
}
.tablesize_container_wrap /deep/ .ant-tabs-tab-prev-icon-target,
.tablesize_container_wrap /deep/ .ant-tabs-tab-next-icon-target {
    font-size: 24 / @rem * 1rem;
    color: @bg-b9b9b9;
}
.tablesize_container_wrap /deep/ .ant-tabs-ink-bar {
    height: 5 / @rem * 1rem;
    background: @bg-25b7aa;
    border-radius: 3 / @rem * 1rem;
    bottom: 0;
}
.tablesize_container_wrap /deep/ .ant-tabs-nav .ant-tabs-tab {
    padding: 0 16px;
    height: @table-type-height;
    line-height: @table-type-height;
}
.tablesize_container_wrap /deep/ .ant-tabs,
.tablesize_container_wrap /deep/ .ant-tabs-nav-container {
    height: @table-type-height;
}
.tablesize_container_wrap /deep/ .ant-badge-count {
    box-shadow: none;
}
.table_name {
    width: 100%;
    font-size: 22 / @rem * 1rem;
    color: @bg-b9b9b9;
    display: flex;
    align-items: center;
}
.table_name_active {
    color: @bg-ffffff;
}
.refresh {
    padding: 0 20 / @rem * 1rem;
    font-size: 18 / @rem * 1rem;
    color: #b9b9b9;
    box-sizing: border-box;
    white-space: nowrap;
}
.refresh-countdown {
    min-width: 160 / @rem * 1rem;
}
.refresh-countdown /deep/ .ant-statistic-content {
    font-size: 20 / @rem * 1rem;
    color: #b9b9b9;
}
.refresh-countdown /deep/ .ant-statistic {
    padding: 0 4px;
}
.refresh-countdown /deep/ .ant-statistic-content-suffix {
    margin-left: 0;
}
.refresh-btn {
    margin-left: 10 / @rem * 1rem;
    font-size: 32 / @rem * 1rem;
}

.queue-wrap {
    min-height: @queue-height;
    box-sizing: border-box;
}
.queue-list {
    margin-top: 20px;
    height: inherit;
    min-height: @queue-height;
}
.add-queue-title {
    font-size: 28 / @rem * 1rem;
    font-weight: bold;
}

.queue-item {
    margin-bottom: 20px;
    width: 100%;
    height: calc(@queue-item-height / @rem * 1rem);
}
.queue-number {
    padding: 0 40 / @rem * 1rem;
    min-width: 160 / @rem * 1rem;
    height: 100%;
    background: @bg-25b7aa;
    font-size: 36 / @rem * 1rem;
    font-weight: bold;
    box-sizing: border-box;
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
}
.queue-btn,
.queue-btn-item {
    height: 100%;
}
.queue-btn-item {
    margin-right: 40 / @rem * 1rem;
    padding: 6px 0;
    box-sizing: border-box;
    font-size: 20 / @rem * 1rem;
}

.queue-btn-bg img {
    width: 68 / @rem * 1rem;
    height: 68 / @rem * 1rem;
}
.add-queue-wrap {
    margin-top: 20px;
    padding: 20px;
    min-height: @queue-height;
    box-sizing: border-box;
}
.tips {
    font-size: 28 / @rem * 1rem;
}
.add-queue-input {
    font-size: 24 / @rem * 1rem;
    color: #848484;
}
.add-queue-input /deep/ input {
    margin: 0 4px;
    border: none !important;
    // border-bottom: 1px solid #f0f0f0 !important;
    outline: none !important;
}
.add-queue-input /deep/ .ant-input {
    height: 40 / @rem * 1rem;
    font-size: 20 / @rem * 1rem;
    color: #333333;
    font-weight: 500;
}
.add-queue-input /deep/ .ant-input:focus {
    box-shadow: none;
}
.phone {
    transform: rotate(100deg);
}
.add-queue-btn {
    padding: 0 20 / @rem * 1rem;
    height: @btn-height;
    line-height: @btn-height;
    font-size: 20 / @rem * 1rem;
    font-weight: 500;
    white-space: nowrap;
    text-align: center;
    border-radius: 10 / @rem * 1rem;
    background: @bg-25b7aa;
}
.keyboard-item {
    width: 33.3333%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24 / @rem * 1rem;
    color: #848484;
    font-weight: bold;
}
.num-item {
    display: inline-block;
    width: @btn-height;
    height: @btn-height;
    line-height: @btn-height;
    text-align: center;
    vertical-align: middle;
    border-radius: 50%;
    border: 1px solid #ffffff;
    box-sizing: border-box;
}
.num-item:hover {
    color: @bg-25b7aa;
    border-color: @bg-25b7aa;
}
.empty {
    padding-bottom: 60 / @rem * 1rem;
    font-size: 30 / @rem * 1rem;
    font-weight: 500;
    color: #ffffff;
}
.changecolor {
    min-height: @queue-height;
    display: flex;
    align-items: center;
    justify-content: center;
    /deep/svg {
        color: #9f9f9f;
    }
    /deep/.ant-spin-container {
        height: 100%;
    }
}

.input-box {
    position: relative;
    padding: 4px 11px;
    height: 40 / @rem * 1rem;
    line-height: 1.5;
    box-sizing: border-box;
    font-size: 20 / @rem * 1rem;
    color: #333333;
    font-weight: 500;
    .input-placeholder {
        position: absolute;
        left: 16px;
        top: 6px;
        right: 0;
        color: #bfbfbf;
    }
    .cursor_box_show {
        display: inline-block;
        animation: twinkling 1s infinite ease-in-out;
        width: 2px;
        background: #333333;
        height: 75%;
    }
}

@-webkit-keyframes twinkling {
    0% {
        opacity: 0;
    }
    50% {
        opacity: 0.5;
    }
    100% {
        opacity: 1;
    }
}
</style>
