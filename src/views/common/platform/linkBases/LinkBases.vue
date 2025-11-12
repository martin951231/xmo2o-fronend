<template>
    <!--  功能库链接 -->
    <a-config-provider :locale="zh_CN">
        <a-modal
            :title="title"
            :visible="visible"
            :width="'45%'"
            :destroyOnClose="true"
            :getContainer="modalGetContainer"
            @ok="handleOk"
            @cancel="handleCancel"
            class="modal-wrap"
        >
            <template slot="footer">
                <a-row class="text-center">
                    <a-button key="back" @click="handleCancel" class="mr-10"> 取消 </a-button>
                    <a-button key="submit" type="primary" @click="handleOk"> 确定 </a-button>
                </a-row>
            </template>
            <!-- 链接类型 -->
            <a-row class="mb-24">
                <span>链接类型：</span>
                <a-select v-model="link_type" placeholder="请选择" style="width: 200px" @change="linkCategoryChange">
                    <a-select-option v-for="item in linkCategoryOptions" :key="item.label" :value="item.label">
                        {{ item.txt }}
                    </a-select-option>
                </a-select>
            </a-row>
            <!-- 分割线 -->
            <a-divider class="divider" />
            <!-- 内容 -->
            <div class="content">
                <!-- 按钮式 -->
                <template v-if="style_type == 'btn'">
                    <div class="btn-wrap flex justify-between mt-24" v-if="btn_list.length">
                        <div class="btn-list-wrap flex-1">
                            <button
                                v-for="(item, index) in btn_list"
                                :key="index"
                                class="btn-list-item ant-btn"
                                :class="index == current_index ? 'active' : ''"
                                @click="btnOpt(item, index)"
                            >
                                <IconFont :type="item.icon" />
                                <span>{{ item.txt }}</span>
                            </button>
                        </div>
                        <div class="btn-image" v-if="btn_list[current_index] && btn_list[current_index].image">
                            <img :src="btn_list[current_index].image" alt="图片" />
                        </div>
                    </div>
                    <a-empty :image="simpleImage" v-if="empty" class="empty">
                        <span slot="description">暂无数据</span>
                    </a-empty>
                </template>

                <!-- 列表式 -->
                <template v-else>
                    <div class="table-wrap flex">
                        <!-- 分类菜单 -->
                        <div class="table-left-wrap mr-10" v-if="menu && menu.length > 1">
                            <a-menu mode="inline" v-model="menuSelectedKeys" @select="menuSelect">
                                <a-menu-item v-for="item in menu" :key="item.label">
                                    <span class="text-wrap">{{ item.txt }}</span>
                                </a-menu-item>
                            </a-menu>
                        </div>
                        <!-- 表格 -->
                        <div class="table-right-wrap flex-1 flex flex-column">
                            <!-- 添加 搜索按钮 -->
                            <a-row type="flex" justify="space-between" class="mt-10" v-if="add_link || show_search">
                                <a-col :span="12" class="text-left" v-show="add_link">
                                    <a-button type="primary" @click="linkOpt(add_link)">添加</a-button>
                                </a-col>
                                <a-col :span="12" class="text-right" v-show="show_search">
                                    <div class="flex align-center">
                                        <a-input
                                            class="flex-1"
                                            placeholder="请输入内容"
                                            v-model="keyword"
                                            allowClear
                                            @keyup.enter.native="getLinkData"
                                        >
                                            <a-icon slot="prefix" type="search" />
                                        </a-input>
                                        <a-button type="primary" class="ml-10" @click="getLinkData">搜索</a-button>
                                    </div>
                                </a-col>
                            </a-row>
                            <!-- 表格 -->
                            <div class="mt-10 flex-1 table-list" v-if="columns && columns.length">
                                <a-table
                                    :data-source="data"
                                    rowKey="cat_id"
                                    :rowSelection="rowSelection"
                                    :scroll="scroll"
                                    :pagination="false"
                                    :customRow="customRow"
                                    :loading="loading"
                                    class="aTable"
                                >
                                    <!-- 表格表头内容 -->
                                    <template v-for="item in columns">
                                        <a-table-column
                                            :title="item.txt"
                                            :key="item.label"
                                            :width="item.width"
                                            :fixed="item.fixed"
                                        >
                                            <template slot-scope="text, record" v-if="record && record[item.label]">
                                                <span
                                                    v-if="record[item.label]"
                                                    @click.stop="linkOpt(record[item.label].url)"
                                                    :class="record[item.label]['url'] ? 'pointer activeTable' : ''"
                                                >
                                                    <img
                                                        v-if="record[item.label]['image']"
                                                        :src="record[item.label]['image']"
                                                        class="table-img"
                                                    />
                                                    <span>{{ record[item.label]['txt'] }}</span>
                                                </span>
                                                <span v-else>---</span>
                                            </template>
                                        </a-table-column>
                                    </template>
                                </a-table>

                                <!-- 分页 -->
                                <a-row class="mt-10 text-right" v-if="page_bar && total">
                                    <a-pagination
                                        show-quick-jumper
                                        show-size-changer
                                        v-model="page"
                                        :page-size.sync="pageSize"
                                        :total="total"
                                        :show-total="(total) => `共 ${total} 条`"
                                        @change="onPageChange"
                                        @showSizeChange="onPageSizeChange"
                                    />
                                </a-row>
                            </div>
                            <a-empty :image="simpleImage" v-if="empty" class="empty">
                                <span slot="description">暂无数据</span>
                            </a-empty>
                        </div>
                    </div>
                </template>
            </div>
        </a-modal>
    </a-config-provider>
</template>

<script>
import Vue from 'vue'
import IconFont from '@/utils/icon'
import linkBasesPlatformApi from '@/api/common/platform/linkBases.js'
import { Empty } from 'ant-design-vue'
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import {getSystemName} from '@/utils/util'
Vue.use(Empty)
export default {
    components: {
        IconFont,
    },
    data() {
        return {
            zh_CN,
            title: '设置链接地址',
            source: 'platform',
            source_id: '',
            type: 'h5',
            visible: false,
            handleOkBtn: '',
            handleCancelBtn: '',
            loading: false,
            simpleImage: '',
            selectedRows: [],
            // 链接类型
            link_type: '',
            linkCategoryOptions: [],
            //按钮列表
            btn_list: [],
            // 当前选择的
            current_index: 0,
            current_item: '',
            current_url: '',
            // 链接内容
            style_type: 'list', // btn=按键页面 cat=多级分类 list=一级列表
            add_link: '', //添加按钮链接 为空时不显示
            show_search: false, //搜索按钮 为空时不显示
            page_bar: false, // 是否有分页
            menuSelectedKeys: [],
            menu: [],
            // 表头
            columns: [],
            data: [],
            page: 1,
            pageSize: 10,
            total: null,
            keyword: '', // 搜索
            empty: false,
            modalGetContainer: () => {return document.body},
            store_id: '',
            tokenName: '',
        }
    },
    computed: {
        // 选中的行
        rowSelection() {
            return {
                type: 'radio',
                fixed: this.columns.length > 6 ? true : false,
                selectedRowKeys: this.selectedRows,
                onChange: (selectedRowKeys, selectedRows) => {
                    this.selectedRows = selectedRowKeys
                    if (selectedRows && selectedRows.length) {
                        this.current_item = selectedRows[0]
                    }
                },
                getCheckboxProps: (record) => ({
                    props: {
                        disabled: record.url == '' || !record.url,
                        url: record.url,
                    },
                }),
            }
        },
        // 链接分类
        link_classify() {
            return this.menuSelectedKeys && this.menuSelectedKeys.length ? this.menuSelectedKeys[0] : ''
        },
        //
        scroll() {
            if (this.data && this.data.length) {
                let y = ''
                // 有按钮没分页
                if (!this.page_bar && (this.add_link || this.show_search)) {
                    y = 392
                }

                // 有按钮有分页
                if (this.page_bar && (this.add_link || this.show_search)) {
                    y = 350
                }

                // 没按钮没分页
                if (!this.page_bar && !this.add_link && !this.show_search) {
                    y = 436
                }

                if (this.columns && this.columns.length < 6) {
                    return {
                        y: y,
                    }
                } else {
                    return {
                        x: this.columns.length * 300,
                        y: y,
                    }
                }
            } else {
                return {}
            }
        },
    },
    beforeCreate() {
        this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
    },
    mounted() {
        // this.getLinkCategory()
        let sysName = getSystemName(location.hash);
        if (sysName) {
            this.tokenName = sysName + '_access_token';
        }
    },
    methods: {
        // 点击行选中
        customRow(record) {
            return {
                on: {
                    // 鼠标单击行
                    click: (event) => {
                        if (record.url) {
                            let keys = []
                            keys.push(record.cat_id)
                            this.selectedRows = keys
                            this.current_item = record
                        }
                    },
                },
            }
        },
        // 获取链接类型
        getLinkCategory() {
            let params = {
                source: this.source,
                source_id: this.source_id,
                type: this.type,
            }
            this.request(linkBasesPlatformApi.getLinkCategory, params).then((res) => {
                this.linkCategoryOptions = res || []
                if (this.linkCategoryOptions && this.linkCategoryOptions.length) {
                    this.link_type = this.linkCategoryOptions[this.current_index].label || ''
                    this.getLinkContent()
                }
            })
        },
        // 获取分类菜单 左侧菜单
        getLinkContent() {
            let params = {
                label: this.link_type,
            }
            this.request(linkBasesPlatformApi.getLinkContent, params).then((res) => {
                let { style = '', btn_list = [], list = '' } = res
                this.style_type = style
                if (this.style_type != 'btn' && list) {
                    // 分类
                    this.menu = list.left || []
                    if (this.menu.length) {
                        this.menuSelectedKeys = [this.menu[0].label] || ''
                    }
                    this.getLinkData()
                } else {
                    // 按钮
                    this.btn_list = btn_list
                    this.current_item = this.btn_list[this.current_index]
                    this.empty = this.btn_list.length ? false : true
                }
            })
        },
        // 获取表格数据 右侧内容 按钮 搜索 表格 分页
        getLinkData() {
            this.loading = true
            let params = {
                label: this.link_classify,
                keyword: this.keyword.trim(),
                page: this.page,
                pageSize: this.pageSize,
                source: this.source,
                source_id: this.source_id,
                store_id: this.store_id,
                tokenName: this.tokenName,
            }
            if(this.tokenName){
                params.tokenName = this.tokenName
            }
            this.request(linkBasesPlatformApi.getLinkData, params)
                .then((res) => {
                    // console.log(res,'res----getLinkData')
                    let { add_link = '', show_search = false, type = '', page_bar = false, list = '' } = res
                    this.add_link = add_link
                    this.show_search = Boolean(show_search)
                    this.style_type = type
                    this.page_bar = page_bar
                    if (list) {
                        this.columns = list.head || []

                        if (this.page_bar) {
                            this.data = list.body.list || []
                            this.total = list.body.count || null
                        } else {
                            this.data = list.body || []
                        }
                        if (this.data.length) {
                            this.data = this.data.map((item, index) => {
                                this.$set(item, 'index', index)
                                return item
                            })
                        }
                        this.initColumns()
                        this.initData()
                        // console.log(this.data,'this.data')
                        this.empty = this.columns.length ? false : true
                    }
                    this.loading = false
                })
                .catch((err) => {
                    this.loading = false
                    this.empty = this.columns.length ? false : true
                })
        },
        initData() {
            if (this.data && this.data.length) {
                this.data = this.data.map((item) => {
                    if (item.children && item.children.length) {
                        item.children = this.setCatId(item.cat_id, item.children)
                    }
                    return item
                })
            }
        },
        // 设置cat_id
        setCatId(cat_id, children) {
            if (children && children.length) {
                children = children.map((item) => {
                    item.cat_id = cat_id + '_' + item.cat_id
                    return item
                })
            }
            return children
        },
        // 初始化表头
        initColumns() {
            if (this.columns && this.columns.length) {
                this.columns = this.columns.map((item, index) => {
                    if (index == 0 && this.data && this.data.length && this.columns.length > 6) {
                        item.fixed = true
                        // item.width = 300
                    } else {
                        item.fixed = false
                    }
                    return item
                })
            }
        },
        // 链接类型change
        linkCategoryChange(val) {
            this.link_type = val
            this.current_index = 0
            this.page = 1
            this.pageSize = 10
            this.keyword = ''
            this.selectedRows = []
            this.empty = false
            this.getLinkContent()
        },
        // 分类菜单选择
        menuSelect({ item, key, selectedKeys }) {
            this.menuSelectedKeys = selectedKeys
            this.page = 1
            this.pageSize = 10
            this.keyword = ''
            this.selectedRows = []
            this.empty = false
            this.data = []
            this.total = null
            this.getLinkData()
        },
        // 按钮点击
        btnOpt(item, index) {
            this.current_index = index
            this.current_item = item
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.page = page
            this.getLinkData()
        },
        onPageSizeChange(page, pageSize) {
            this.page = 1
            this.pageSize = pageSize
            this.getLinkData()
        },
        // table 单元格点击 url存在直接跳转
        linkOpt(url = '') {
            if (url) {
                // window.location.href = url
                window.open(url)
            }
        },
        // modal 确认
        handleOk() {
            console.log(this.current_item, 'current_item')
            let url = this.current_item && this.current_item.url ? this.current_item.url : ''
            if (this.handleOkBtn) {
                this.handleOkBtn({ url })
            }
            this.resetOpt()
        },
        // modal关闭
        handleCancel() {
            this.resetOpt()
            if (this.handleCancelBtn) {
                this.handleCancelBtn()
            }
        },
        // 重置
        resetOpt() {
            this.visible = false
            Object.assign(this.$data, this.$options.data())
        },
    },
}
</script>

<style scoped>
.mb-24 {
    margin-bottom: 24px;
}
.mt-24 {
    margin-top: 24px;
}
.modal-wrap >>> .ant-modal-content .ant-modal-footer {
    text-align: center;
}
.content {
    width: 100%;
    height: 500px;
}
.empty >>> .ant-empty {
    transform: translate(0, 100%);
}
.btn-image {
    margin-left: 24px;
}
.btn-list-wrap {
    overflow-y: auto;
}
.btn-list-wrap,
.table-wrap {
    height: 500px;
}
.btn-list-item {
    margin: 0 12px 12px 0;
    justify-content: flex-start;
}
.btn-list-item.active {
    color: #ffffff;
    background: #1890ff;
    border-color: #1890ff;
}
.btn-image img {
    max-height: 500px;
    height: auto;
    width: 240px;
}
.divider.ant-divider-horizontal {
    margin-bottom: 0;
}
.table-left-wrap {
    height: auto;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
}
.table-left-wrap >>> .ant-menu-inline,
.table-left-wrap >>> .ant-menu {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
}
.table-left-wrap >>> .ant-menu-inline > .ant-menu-item::after {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: unset;
    border-right: 3px solid #1890ff;
    content: '';
}
.table-left-wrap >>> .ant-menu-item:first-child {
    margin-top: 0;
}
.table-left-wrap >>> .ant-menu-inline > .ant-menu-item {
    max-width: 140px;
    text-overflow: unset;
    line-height: 18px;
    min-height: 40px;
    height: auto;
    display: flex;
    align-items: center;
    box-sizing: border-box;
}
.text-wrap {
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
    text-overflow: unset;
    overflow-x: hidden;
    overflow-y: auto;
}
.table-right-wrap,
.table-list {
    width: auto;
    overflow: auto;
}
.table-img {
    margin-right: 10px;
    width: 54px;
    height: 54px;
    border-radius: 4px;
}
.activeTable:hover {
    color: #1890ff;
}
.aTable >>> .ant-table-body::-webkit-scrollbar {
    /*webkit内核*/
    display: block;
    width: 14px;
    height: 14px;
    background: #c1c1c1;
}
.aTable >>> table .ant-table-body {
    /* Firefox */
    scrollbar-width: 14px !important;
    display: block;
    width: 14px;
    height: 14px;
    background: #f1f1f1;
    /* IE 10+ */
    -ms-overflow-style: block !important;
}
/* 滚动槽 */
.aTable >>> .ant-table-body::-webkit-scrollbar-track {
    background: #f1f1f1;
}
/* 滚动条滑块 */
.aTable >>> .ant-table-body::-webkit-scrollbar-thumb {
    background: #c1c1c1;
}
</style>
