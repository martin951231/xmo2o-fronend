<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-button type="primary" @click="add">{{ L('添加WiFi配置') }}</a-button>
        <a-table style="background: #ffffff;margin-top: 20px" :columns="columns" rowKey="id" :data-source="dataList"
            @change="changePage" :pagination="pagination">
            <span slot="status" slot-scope="text, item">
                <a-switch v-model="item.status" @change="changeStatus(item.id)" checked-children="开启"
                    un-checked-children="关闭" />
            </span>

            <!-- 操作栏 -->
            <span slot="operate" slot-scope="text,item">
                <a @click="edit(item)">{{ L('编辑') }}</a>
                <a-divider type="vertical" />
                <a-popconfirm title="删除后无法恢复，是否确定?" ok-text="确定" cancel-text="取消" @confirm="del(item.id)">
                    <a style="color: red;">{{ L('删除') }}</a>
                </a-popconfirm>
            </span>

            <span slot="qrcode" slot-scope="text,item">
                <a-icon type="qrcode" style="font-size: 1rem;"/>
            </span>
        </a-table>


        <!-- 新增和编辑WiFi配置 -->
        <a-modal :title="modalTitle" width="30%" :visible="modalVisible" @cancel="cancalModal" @ok="submitModal">
            <a-form-model :model="modalForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }">

                <a-form-model-item label="WiFi名称" required>
                    <a-input v-model="modalForm.ssid" />
                </a-form-model-item>

                <a-form-model-item label="WiFi密码" required>
                    <a-input v-model="modalForm.password"/>
                </a-form-model-item>

                <a-form-model-item label="状态">
                    <a-switch checked-children="开启" un-checked-children="关闭" v-model="modalForm.status" />
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import buildingPlatformApi from '@/api/building/index'
export default {
    components: {},
    data() {
        return {
            modalTitle: '',
            modalVisible: false,
            modalForm: {
                id: 0,
                ssid: '',
                password: '',
                status: true
            },

            mall_id: 0,
            dataList: [], // 列表
            pagination: {
                pageSize: 10,
                total: 0,
                current: 1,
                page: 1,
            },
            columns: [
                {
                    title: this.L('WiFi名称'),
                    dataIndex: 'ssid',
                },
                {
                    title: this.L('WiFi密码'),
                    dataIndex: 'password',
                    scopedSlots: {
                        customRender: 'password',
                    },
                },
                {
                    title: this.L('状态'),
                    dataIndex: 'status',
                    scopedSlots: {
                        customRender: 'status',
                    },
                },
                {
                    title: this.L('二维码'),
                    dataIndex: 'qrcode',
                    scopedSlots: {
                        customRender: 'qrcode',
                    },
                },
                {
                    title: this.L('更新时间'),
                    dataIndex: 'update_time',
                },
                {
                    title: this.L('操作'),
                    dataIndex: 'operate',
                    scopedSlots: {
                        customRender: 'operate',
                    },
                },
            ],
        }
    },
    mounted() {
        let loginMallId = sessionStorage.getItem("login_mall_id");
        if (typeof loginMallId != 'undefined' && loginMallId > 0) {
            this.mall_id = loginMallId;
            this.getLists();
        } else {
            this.$message.error(this.L('商场获取失败'));
            return;
        }

    },
    methods: {
        //状态切换
        onChangeStatus(channel_id) {
            this.request(channelCodeApi.platformChangeStatus, { chanel_id: channel_id }).then((res) => {

            })
        },
        // 数据列表
        getLists() {
            let queryParams = {
                page_size: this.pagination.pageSize,
                page: this.pagination.current,
                mall_id: this.mall_id
            }
            this.request(buildingPlatformApi.getWifiLists, queryParams).then((res) => {
                this.dataList = res.data
                this.pagination.total = res.total
            })
        },

        // 切换表格分页
        changePage(page, pageSize) {
            this.pagination.current = page.current
            this.getLists()
        },
        // 新建列表
        add() {
            this.modalTitle = '添加WiFi配置';
            this.modalVisible = true;
            this.modalForm = {
                id: 0,
                ssid: '',
                password: '',
                status: true
            };
        },
        edit(item) {
            this.modalTitle = '编辑WiFi配置';
            this.modalVisible = true;
            this.modalForm = {
                id: item.id,
                ssid: item.ssid,
                password: item.password,
                status: Boolean(item.status)
            }
        },
        del(id) {
            let _this = this;
            _this.request(buildingPlatformApi.deleteWifi, { id: id }).then((res) => {
                _this.$message.success('删除成功！')
                _this.getLists()
            })
        },
        changeStatus(id) {
            let _this = this;
            _this.request(buildingPlatformApi.changeWifiStatus, { id: id }).then((res) => {
                _this.$message.success('修改成功！')
                _this.getLists()
            })
        },
        cancalModal() {
            this.modalVisible = false;
        },
        submitModal() {
            let _this = this
            this.modalForm.mall_id = _this.mall_id
            _this.request(buildingPlatformApi.saveWifi, this.modalForm).then((res) => {
                _this.$message.success('保存成功！')
                _this.getLists()
                _this.cancalModal();
            })
        },
    },
}
</script>