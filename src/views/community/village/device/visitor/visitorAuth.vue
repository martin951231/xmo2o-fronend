<template>
    <div class="visitor_auth_box">
        <div>
            <a-alert message="" type="info" style="margin:10px 5px 0 5px;" >
                <div slot="description">
                    <div>目前仅支持【设备品牌：海康；设备协议：云牟外部独立协议/Hik Device Gateway 海康网关(平台)/Hik Device Gateway 海康网关(小区)】</div>
                </div>
            </a-alert>
        </div>
        <a-table
            :columns="columns"
            :data-source="dataList"
            class="components-table-demo-nested"
            :pagination="pagination"
            @change='table_change'
            :loading="loading"  >
            <span slot="action" slot-scope="text, record">
                <a-switch :checked="record.has_open_auth == 1" checked-children="开" un-checked-children="关" @change="switchChange(record)"/>
            </span>

        </a-table>
    </div>
</template>
<script>
    import villageApi from '@/api/community/village';
    import { getSystemName } from '@/utils/util';

    const columns = [
        { title: '设备ID', dataIndex: 'device_id', key: 'device_id'},
        { title: '设备名称', dataIndex: 'device_name', key: 'device_name'},
        { title: '设备序号', dataIndex: 'device_sn', key: 'device_sn'},
        { title: '对应位置', dataIndex: 'address_text', key: 'address_text'},
        { title: '标识', dataIndex: 'device_direction_text', key: 'device_direction_text'},
        { title: '设备类型', dataIndex: 'device_type_txt', key: 'device_type_txt'},
        { title: '操作', key: 'action', width: '300px',dataIndex: '', scopedSlots: {customRender: 'action'}},
    ];
    const dataList = [];
    
    export default {
        name: '',
        components: {
        },
        data() {
            return {
                pagination: { pageSize: 20, total:10 ,current:1},
                search: {page: 1},
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                dataList,
                columns,
                page: 1,
                tokenName: '',
                sysName: ''
            };
        },
        created() {},
        mounted () {
            let sysName = getSystemName(location.hash);
            if (sysName) {
                this.tokenName = sysName + '_access_token';
                this.sysName = sysName;
            } else {
                this.sysName = 'village';
                this.tokenName = 'village_access_token';
            }
            this.getVisitorAuthList();
        },
        methods: {
            switchChange(record) {
                console.log('switchChange-record', record);
                let params = {}
                params['device_id'] = record.device_id;
                params['tokenName'] = this.tokenName;
                let that = this;
                this.request(villageApi.switchChangeOpenAuth, params)
                    .then((res) => {
                        that.getVisitorAuthList();
                    })

            },
            // 获取列表信息
            getVisitorAuthList() {
                this.loading = true;
                this.search['page'] = this.page;
                this.search['tokenName'] = this.tokenName;
                console.log('this.search', this.search)
                this.request(villageApi.getVisitorAuthList, this.search)
                    .then((res) => {
                        this.pagination.total    = res.totalRows ? res.totalRows : 0
                        this.pagination.pageSize = res.pageSize  ? res.pageSize : 20
                        this.dataList = res.list
                        this.loading = false
                    })
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                if (e.current && e.current>0) {
                    this.pagination.current = e.current;
                    this.page = e.current;
                    this.getVisitorAuthList();
                }
            },
        },
    };
</script>