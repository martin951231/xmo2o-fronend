<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10 h-800">
       <a-row type="flex" style="margin-top:1rem;margin-bottom: 1rem;">
        <a-col>
          <span>筛选：</span>
          <a-input style="width: 260px"  v-model="queryParams.keyword" placeholder="请输入直播间名称、主播名称" />
        </a-col>
        <a-col :span="8">
          <a-button type="primary" icon="search" style="margin-left: 1rem;" @click="getRoomList(true)">搜索</a-button>
        </a-col>
      </a-row>

    <a-table
          style="background: #ffffff"
          :columns="roomColumns"
          :data-source="roomDataList"
          :pagination="roomPagination"
        >
        <span slot="start_date" slot-scope="text, record">
          <a-timeline>
            <a-timeline-item>开始：{{ record.start_date }}</a-timeline-item>
            <a-timeline-item color="red">结束：{{record.end_date}}</a-timeline-item>
          </a-timeline>
        </span>

        <span slot="room_detail" slot-scope="text, record">
          <div style="display:flex;width:500px;padding:0.5rem 0.5rem 0.5rem 0">
            <img style="width: 150px;height:120px" :src="record.share_img"/>
            <div style="padding-left: 1rem;">
              <p style="font-weight:bold;font-size:1.2rem">{{record.name}}</p>
              <p>房间号：{{record.roomid}}</p>
              <p>主播：{{record.anchor_name}}</p>
            </div>
          </div>
        </span>

        <span slot="room_operate" slot-scope="text, record">
          <a @click="$refs.liveRoomShareModal.addRoomShare(record.roomid,'platform')">分享</a>
          <a-popconfirm placement="rightBottom" title="直播间删除后不可恢复，是否确认？" ok-text="确定" cancel-text="取消" @confirm="delRoom(record.roomid)">
            <a style="margin-left:1rem;color:red">删除</a>
          </a-popconfirm>
        </span>
    </a-table>
    <live-room-share ref="liveRoomShareModal"/>
    </div>
</template>

<script>
import LiveBroadcastPlatformApi from '@/api/liveBroadcast/platform'
import LiveRoomShare from '../modules/LiveRoomShare.vue'
export default {
  components: {
    LiveRoomShare
  },
  data() {
    return {
        roomColumns:[
        {
          title: this.L('最近开播'),
          dataIndex: 'start_date',
          width:'30%',
          scopedSlots: { customRender: 'start_date' },
        },
        {
          title: this.L('直播间信息'),
          dataIndex: 'name',
          width:'40%',
          scopedSlots: { customRender: 'room_detail' },
        },
        {
          title: this.L('直播状态'),
          dataIndex: 'live_status',
          width:'15%',
        },
        {
          title: this.L('操作'),
          dataIndex: 'roomid',
          width:'15%',
          scopedSlots: { customRender: 'room_operate' },
        }
      ],
      queryParams: {
        keyword: ''
      },
      roomDataList:[],
      roomPagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        onChange: this.onRoomPageChange,
      },
      
    }
  },
  created() {
    this.getRoomList()
  },
  methods: {
    resetPage(){
        this.roomPagination.current = 1;
        this.total = 0;
        this.roomPagination.pageSize = 10;
    },
    //获取直播间列表
    onRoomPageChange(page, pageSize) {
        this.page = page;
        this.$set(this.roomPagination, 'current', page)
        this.getRoomList()
    },
    getRoomList(isSearch = false) {
      if(isSearch){
        this.resetPage();
        this.roomPagination.keyword = this.queryParams.keyword;
      }
      this.roomPagination.page = this.roomPagination.current
      this.request(LiveBroadcastPlatformApi.getRooms, this.roomPagination).then((res) => {
        this.roomDataList = res.data
        this.roomPagination.total = res.total
      })
    },
    delRoom(roomid) {
      this.request(LiveBroadcastPlatformApi.delRoom, { roomid: roomid }).then((res) => {
        this.getRoomList()
      })
    }
  },
}
</script>