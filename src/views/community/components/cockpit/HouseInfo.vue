<template>
  <div class="current_4">
    <div class="head">
      <div class="square_box"></div>
      <p class="title">楼宇房屋总览</p>
    </div>
    <div class="content">
      <div class="left_box">
        <div class="flex_box_1">
          <p class="text_1" v-if="$store.getters.config">{{$store.getters.config.house_name}}名称：{{houseData.village_name}}</p>
          <p class="text_2">{{$store.getters.config.single_name}}编号：{{houseData.single_name}}</p>
        </div>
        <div class="flex_title_1">
          <div class="square_box"></div>
          <p class="title">{{$store.getters.config.room_name}}号: <span v-if="showTag && room != ''" class="square_box_result">查询到{{room_num}}间{{$store.getters.config.room_name}}</span></p>
        </div>
        <div class="flex_box_2">
          <img class="img_1" src="../../../../assets/communityimg/cockpit_icon_1.png" alt="">
          <input @focus="hideThis" class="input_box" v-model="room" />
        </div>
        <div class="flex_box_3">
          <div class="flex_1">
            <img class="img_2" src="../../../../assets/communityimg/cockpit_search_icon.png" alt="">
            <p class="text_3" @click="queryData()">查询</p>
          </div>
          <div class="flex_1" @click="goBackIndex">
            <img class="img_2" src="../../../../assets/communityimg/cockpit_back_icon.png" alt="">
            <p class="text_3">返回驾驶舱</p>
          </div>
        </div>
        <div class="flex_title_1 mar_top_30">
          <div class="square_box"></div>
          <p class="title">房屋类型</p>
        </div>
        <div class="flex_box_4 mar_top_20">
          <div class="item_box" @click="selectCate(item, index)" v-for="(item,index) in houseData.house_type"
            :class="item.checked==1?'active':''">
            <div class="square_block" :style="{backgroundColor: item.color}"></div>
            <p class="text_4">{{item.value}}</p>
          </div>
        </div>
        <div class="flex_box_5 mar_top_20">
          <div class="select_all_btn" @click="chooseAll">全选</div>
          <div class="cancel_btn" @click="cancelAll">取消</div>
        </div>
        <div class="flex_box_6">
          <div class="top_box">
            <p class="text_5">{{houseData.single_name}}</p>
          </div>
          <img class="img_3" :src="houseData.single_img" alt="">
        </div>
      </div>
      <div class="right_list">
        <!--                                                      桌台规格                                                    -->
        <div class="tablesize_container">
          <div class="leftslidericon" v-if="houseData.floor_list.length>7">
            <div class="iconfont circlebox" @click="slidetoright()">
              <img src="../../../../assets/communityimg/cockpit_lefts.png" alt="" />
            </div>
          </div>
          <div class="center_slider_container" id="slidercontent" ref="slidercontent">
            <!-- <div class="sliderList_content" ref="sliderbox" :style="'transform:translateX(' + leftscroll + ' / @rem * 1rem)'" @mousewheel="changeslidernum"> -->
            <div class="sliderList_content" ref="sliderbox" @mousewheel="changeslidernum">
              <div class="table_items" v-for="(items, index) in houseData.floor_list" :key="index"
                :class="tableCurrent == index ? 'table_items_active' : ''"
                @click="screenTablesize(items.floor_id, index)">
                <div class="items_content">
                  <div class="table_name" style="position: relative">
                    <span>{{ items.floor_name }}</span>
                    <!-- <span class="pos_el" :class="'pos_el_' + index">{{
                      items.people_num ? '(' + items.people_num + ')' : items.people_num
                    }}</span> -->
                    <!-- <span class="table_count" style="position: absolute;" v-if="items.table_count > 0">{{ items.table_count }}</span> -->
                  </div>
                  <!-- <div class="bottomborder"></div> -->
                </div>
              </div>
            </div>
          </div>
          <div class="rightslidericon" v-if="houseData.floor_list.length>7">
            <div class="iconfont circlebox" @click="slidetoleft()">
              <img src="../../../../assets/communityimg/cockpit_rights.png" alt="" />
            </div>
          </div>
        </div>
        <!--                                                      桌台列表                                                    -->
        <div class="house_list">
          <div class="hous_list_box_big">
            <div class="house_list_box">
              <div class="item_box_active" v-for="(item,index) in houseList">
                <div class="item_box">
                  <div class="title_head_box">
                    <p class="title_text">{{item.room}}</p>
                    <div class="line"></div>
                  </div>
                  <img class="img_4" src="../../../../assets/communityimg/cockpit_menu_box_2.png" alt="">
                  <div class="type_box1" v-if="item.house_type == 1">
                    {{item.house_title}}
                  </div>
                  <div class="type_box2" v-if="item.house_type == 2">
                    {{item.house_title}}
                  </div>
                  <div class="type_box3" v-if="item.house_type == 3">
                    {{item.house_title}}
                  </div>
                  <div class="content_text_box">
                    <div class="text_6" v-for="(item1, index1) in item.list" v-if="item1.value">
                      {{item1.key}}：{{item1.value}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TWEEN from '@tweenjs/tween.js'
  import Rem from '../../../../utils/rem.js';
  import configVillageApi from '@/api/community/village/index.js';
  import Vue from 'vue';
  Rem.getrem();
  export default {
    name: 'BlockBox',
    props: {
      single_id: {
        type: Number,
        default: 0
      },
    },
    data() {
      return {
        room_num: 0,
        showTag: false,
        single_img: '',
        houseTypeActive: [],
        floor_id: '',
        room: '', //房间id
        house_type: '', //房屋类型
        houseData: {
          floor_list: []
        },
        houseList: [],
        screenCurrent: 0, //桌台状态索引
        tableCurrent: 0, //桌台类型索引
        num: 0,
        slideshake: true, //滚动栏防抖
        numTween: 0,
        leftscroll: 0,
        list: [{
            name: '自住'
          },
          {
            name: '租赁（合租）'
          },
          {
            name: '自住'
          },
          {
            name: '租赁（成套）'
          }
        ],
        table_type_list: [{
            name: '自住',
            id: 0
          },
          {
            name: '租赁（合租）',
            id: 1
          },
          {
            name: '自住',
            id: 2
          },
          {
            name: '租赁（成套）',
            id: 3
          },
          {
            name: '自住好的',
            id: 4
          },
          {
            name: '租赁（合租）',
            id: 5
          },
          {
            name: '自住',
            id: 6
          },
          {
            name: '租赁（成套）',
            id: 7
          },
          {
            name: '自住',
            id: 8
          },
          {
            name: '租赁（成套）',
            id: 9
          }
        ]
      }
    },
    created() {
      this.getBuildingData()
    },
    mounted() {

    },
    watch: {
      // '$store.state.storestaff.nowTableId'(nval, oval) {
      //   // 有新的订单进来了
      //   console.log(nval, '新的桌台id进来了')
      //   this.selectedTableborderCurrent = nval
      // },
      // 自然滚动动优化方法
      numTween(nval, oval) {
        new TWEEN.Tween({
            number: oval,
          })
          .to({
              number: nval,
            },
            100
          )
          .onUpdate((tween) => {
            this.leftscroll = tween.number.toFixed(0)
            document.getElementById('slidercontent').scrollLeft = this.leftscroll
            if (this.leftscroll - document.getElementById('slidercontent').scrollLeft > 150) {
              this.numTween = document.getElementById('slidercontent').scrollLeft
            }
          })
          .start()

        function animate() {
          if (TWEEN.update()) {
            requestAnimationFrame(animate)
          }
        }
        animate()
      },
    },
    methods: {
      goBackIndex() {
        this.$emit('goBackIndex')
      },
      getBuildingData() {
        this.request(configVillageApi.getBuildingData, {
          single_id: this.single_id
        }, 'post').then((res) => {
          this.houseData = res
          this.houseData.house_type.map(v=>{
            v.checked = 1
            this.house_type += v.key +','
            this.houseTypeActive.push(v)
          })
          this.house_type = this.house_type.substring(0, this.house_type.length -1)
          if(this.houseData.floor_list.length>0){
            this.floor_id = this.houseData.floor_list[0].floor_id
          }
          this.getVacancyData()
          console.log("getBuildingData================>", res)
        })
      },

      getVacancyData() {
        let params = {
          single_id: this.single_id,
          floor_id: this.floor_id,
          // vacancy_id: this.vacancy_id, //房间id
          room: this.room, //房间名称
          house_type: this.house_type, //房屋类型
        }
        console.log(params,"========================>")
        this.request(configVillageApi.getVacancyData, params, 'post').then((res) => {
          this.houseList = res
          this.room_num =  res.length
          console.log("getVacancyData================>", res)
        })
      },
      selectCate(item, index) {
        this.num = index
        let flag = false
        this.houseData.house_type.map(item1=>{
          item1.checked = 0
        })
        if (this.houseTypeActive.length == 0) {
          this.houseTypeActive.push(item)
          this.houseData.house_type.map(item1=>{
            if (item1.value == item.value) {
              item1.checked = 1
            }
          })
        } else{
          this.houseTypeActive.map((v, i)=>{
            if (item.value == v.value) {
              this.houseTypeActive.splice(i, 1)
              flag = true
            }
          })
          if (!flag) {
            this.houseTypeActive.push(item)
          }

          this.houseData.house_type.map(item1=>{
            this.houseTypeActive.map(item2=>{
              if (item1.value == item2.value && item1.checked == 0) {
                item1.checked=1
              }
            })
          })
        }
        this.houseData.house_type = JSON.parse(JSON.stringify(this.houseData.house_type))
        this.house_type = ''
        this.houseData.house_type.map(v=>{
          if(v.checked == 1){
            this.house_type += v.key +','
          }
        })
        this.house_type = this.house_type.substring(0, this.house_type.length -1)
        console.log(this.house_type)
        console.log(JSON.stringify(this.houseData.house_type));
        this.getVacancyData()
      },
      
      chooseAll(){
        this.houseTypeActive = this.houseData.house_type
        this.houseData.house_type.map(item1=>{
          if(item1 != 1){
            item1.checked = 1
          }
        })
        this.house_type = ''
        this.houseData.house_type.map(v=>{
          if(v.checked == 1){
            this.house_type += v.key +','
          }
        })
        this.house_type = this.house_type.substring(0, this.house_type.length -1)
        console.log(this.house_type)
        this.houseData.house_type = JSON.parse(JSON.stringify(this.houseData.house_type))
        this.getVacancyData()
      },
      cancelAll(){
        this.houseTypeActive = []
        this.houseData.house_type.map(item1=>{
          if(item1 != 0){
            item1.checked = 0
          }
        })
        this.house_type = ''
        this.houseData.house_type.map(v=>{
          if(v.checked == 1){
            this.house_type += v.key +','
          }
        })
        this.house_type = this.house_type.substring(0, this.house_type.length -1)
        console.log(this.house_type)
        this.houseData.house_type = JSON.parse(JSON.stringify(this.houseData.house_type))
        this.getVacancyData()
      },
      
      hideThis(){
        this.room = ''
        this.showTag = false
        console.log("change==============>", this.room)
      },
      
      queryData(){
        if(this.room != ''){
          this.showTag = true
        } else{
          this.showTag = false
        }
        this.getVacancyData()
        // this.room = ''
      },
   
      screenTablesize(floor_id, index) {
        if (this.floor_id != floor_id) {
          this.tableCurrent = index
          this.floor_id = floor_id
          this.getVacancyData()
        }
      },
      changeslidernum(e) {
        console.log(e)
        if (this.slideshake) {
          this.slideshake = false
          if (this.numTween > -1) {
            if (e.deltaY > 0) {
              this.numTween += 150
            } else {
              this.numTween -= 150
            }
          } else {
            this.numTween = 0
          }
          this.slideshake = true
        }
      },
      slidetoleft() {
        console.log("this.numTween", this.numTween)
        if (this.numTween > -1) {
          this.numTween += 150
        } else {
          this.numTween = 0
        }
      },
      slidetoright() {
        if (this.numTween > -1) {
          this.numTween -= 150
        } else {
          this.numTween = 0
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  @rem: 192; //定义页面尺寸

  .current_4 {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 90%;
    padding: 0 20/@rem * 1rem;
    padding-top: 0%;
    position: relative;

    .head {
      width: 100%;
      height: 60/@rem * 1rem;
      border-bottom: 1/@rem * 1rem solid #4E608E;
      display: flex;
      flex-direction: row;
      align-items: center;

      .title {
        font-size: 18/@rem * 1rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #FFFFFF;
        margin-left: 18/@rem * 1rem;
      }
    }

    .content {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;

      .left_box {
        width: 470/@rem * 1rem;
        display: flex;
        flex-direction: column;
        padding-left: 27/@rem * 1rem;

        .flex_box_1 {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 100%;

          .text_1 {
            font-size: 18/@rem * 1rem;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 70/@rem * 1rem;
          }

          .text_2 {
            font-size: 18/@rem * 1rem;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 70/@rem * 1rem;
            padding-left: 30/@rem * 1rem;
          }
        }

        .flex_title_1 {
          display: flex;
          flex-direction: row;
          align-items: center;

          .title {
            font-size: 18/@rem * 1rem;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #FFFFFF;
            margin-left: 18/@rem * 1rem;
            .square_box_result{
              font-size: 14/@rem * 1rem;
              color: #999;
            }
          }
        }

        .flex_box_2 {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 220/@rem * 1rem;
          height: 33/@rem * 1rem;
          border: 1/@rem * 1rem solid #52719D;
          border-radius: 7/@rem * 1rem;
          margin-left: 5/@rem * 1rem;
          margin-top: 10/@rem * 1rem;
          .img_1 {}

          .input_box {
            background: none;
            outline: none;
            border: none;
            padding: 10/@rem * 1rem;
          }
        }

        .flex_box_3 {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-top: 15/@rem * 1rem;
          margin-left: 5/@rem * 1rem;

          .flex_1 {
            height: 30/@rem * 1rem;
            background: #0086D3;
            border-radius: 4/@rem * 1rem;
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0 3/@rem * 1rem;

            .img_2 {}

            .text_3 {
              font-size: 15/@rem * 1rem;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #FFFFFF;
              margin-left: 5/@rem * 1rem;
              cursor: pointer;
            }
          }

          .flex_1:last-of-type {
            margin-left: 3/@rem * 1rem;
          }
        }

        .flex_box_4 {
          display: flex;
          flex-direction: row;
          align-items: center;
          flex-wrap: wrap;
          width: 264/@rem * 1rem;

          .item_box {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 5/@rem * 1rem 10/@rem * 1rem;
            height: 39/@rem * 1rem;
            border-radius: 4/@rem * 1rem;
            border: 2/@rem * 1rem solid rgba(0, 0, 0, 0);
            cursor: pointer;

            .square_block {
              width: 12/@rem * 1rem;
              height: 12/@rem * 1rem;
              background: #32A505;
            }

            .text_4 {
              font-size: 14/@rem * 1rem;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #FFFFFF;
              margin-left: 8 / @rem * 1rem;
            }
          }

          .item_box:nth-of-type(even) {
            margin-left: 20/@rem * 1rem;
          }

          .item_box:nth-of-type(n+3) {
            margin-top: 10/@rem * 1rem;
          }

          .active {
            border: 2/@rem * 1rem solid #1C98E0;
          }
        }

        .flex_box_5 {
          display: flex;
          flex-direction: row;
          align-items: center;

          .select_all_btn {
            width: 90/@rem * 1rem;
            height: 32/@rem * 1rem;
            background: #0086D3;
            border-radius: 4/@rem * 1rem;
            font-size: 15/@rem * 1rem;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 32/@rem * 1rem;
            text-align: center;
            cursor: pointer;
          }

          .cancel_btn {
            width: 90/@rem * 1rem;
            height: 32/@rem * 1rem;
            background: #D37C00;
            border-radius: 4/@rem * 1rem;
            font-size: 15/@rem * 1rem;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 32/@rem * 1rem;
            margin-left: 24/@rem * 1rem;
            text-align: center;
            cursor: pointer;
          }
        }

        .flex_box_6 {
          width: 291/@rem * 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 30/@rem * 1rem;

          .top_box {
            width: 98/@rem * 1rem;
            height: 87/@rem * 1rem;
            background-image: url(../../../../assets/communityimg/cockpit_icon_2.png);
            background-repeat: no-repeat;
            background-size: 100% 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;

            .text_5 {
              font-size: 17/@rem * 1rem;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #FFFFFF;
              position: absolute;
              top: 15/@rem * 1rem;
            }
          }

          .img_3 {
            max-width: 291/@rem * 1rem;
          }
        }
      }

      .right_list {
        display: flex;
        flex-direction: column;
        width: 1450/@rem * 1rem;

        .tablesize_container {
          width: 100%;
          height: 70 / @rem * 1rem;
          background-color: rgba(65, 65, 65, 0);
          border-radius: 6 / @rem * 1rem;
          display: flex;
          padding: 0 20 / @rem * 1rem;
          box-sizing: border-box;

          .leftslidericon {
            width: 75 / @rem * 1rem;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            .circlebox {
              width: 40 / @rem * 1rem;
              height: 40 / @rem * 1rem;
              box-sizing: border-box;
              background-color: rgba(256, 256, 256, 0.2);
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;

              img {
                width: 100%;
                height: 100%;
              }
            }
          }

          .rightslidericon {
            width: 75 / @rem * 1rem;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            .circlebox {
              width: 40 / @rem * 1rem;
              height: 40 / @rem * 1rem;
              box-sizing: border-box;
              background-color: rgba(256, 256, 256, 0.2);
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;

              img {
                width: 100%;
                height: 100%;
              }
            }
          }

          .center_slider_container {
            position: relative;
            height: 100%;
            width: 100%;
            overflow-x: scroll;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;

            .sliderList_content {
              height: 68 / @rem * 1rem;
              top: 0;
              left: 0;
              z-index: 10;
              user-select: none;
              position: absolute;
              transition: all 0.5s linear;
              display: flex;
              white-space: nowrap;
              align-items: center;

              .table_items {
                width: 116 / @rem * 1rem;
                height: 48 / @rem * 1rem;
                background-image: url(../../../../assets/communityimg/cockpit_menu_box.png);
                background-repeat: no-repeat;
                background-size: 100% 100%;
                display: inline-block;
                margin: 0 30 / @rem * 1rem;

                .items_content {
                  display: flex;
                  height: 100%;
                  flex-direction: column;
                  align-items: center;
                  justify-content: flex-start;
                  cursor: pointer;

                  .table_name {
                    font-size: 17 / @rem * 1rem;
                    color: #b9b9b9;
                    display: flex;
                    align-items: center;
                    font-weight: bold;
                    color: #2783AF;
                    line-height: 48 / @rem * 1rem;
                    background: linear-gradient(0deg, #30D6FF 0%, #FFFFFF 0%, #2783AF 0%, #F5FFC6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;

                    .pos_el {
                      display: block;
                    }

                    .table_count {
                      width: 60 / @rem * 1rem;
                      height: 40 / @rem * 1rem;
                      background-color: #ff3333;
                      border-radius: 10 / @rem * 1rem 10 / @rem * 1rem 10 / @rem * 1rem 2 / @rem * 1rem;
                      right: -45 / @rem * 1rem;
                      top: -15 / @rem * 1rem;
                      font-size: 17 / @rem * 1rem;
                      color: #ffffff;
                      text-align: center;
                      line-height: 48 / @rem * 1rem;
                      transform: scale(0.5);
                    }
                  }

                  .bottomborder {
                    width: 56 / @rem * 1rem;
                    height: 5 / @rem * 1rem;
                    background-color: transparent;
                    border-radius: 3 / @rem * 1rem;
                    margin-top: 15 / @rem * 1rem;
                  }
                }
              }

              .table_items_active {
                width: 116 / @rem * 1rem;
                height: 68 / @rem * 1rem;
                background-image: url(../../../../assets/communityimg/cockpit_menu_box_1.png);
                background-repeat: no-repeat;
                background-size: 100% 100%;
                display: inline-block;
                margin: 0 30 / @rem * 1rem;
                margin-top: 20 / @rem * 1rem;

                .items_content {
                  .table_name {
                    color: #ffffff;
                  }

                  .bottomborder {
                    background-color: #ffffff;
                  }
                }
              }
            }
          }
        }

        .center_slider_container::-webkit-scrollbar {
          height: 0 / @rem * 1rem;
        }

        .house_list {
          width: 100%;
          height: 88%;
          background-image: url(../../../../assets/communityimg/cockpit_houseList_bg.png);
          background-repeat: no-repeat;
          background-size: 100% 100%;
          .hous_list_box_big {
            height: 93%;
            margin: 30 / @rem * 1rem;
            overflow-x: hidden;
            overflow-y: scroll;
            .house_list_box {
              display: flex;
              flex-direction: row;
              // justify-content: space-between;
              flex-wrap: wrap;
              .item_box_active {
                width: 239 / @rem * 1rem;
                // height: 200 / @rem * 1rem;
                margin-top: 15 / @rem * 1rem;
                margin-left: 20 / @rem * 1rem;
                padding: 10 / @rem * 1rem;
                box-shadow: 0 / @rem * 1rem 0 / @rem * 1rem 10 / @rem * 1rem #00f6ff inset;
                border-radius: 10 / @rem * 1rem;
            
                .item_box {
                  height: 100%;
                  position: relative;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  // background-image: url(../../../../assets/communityimg/cockpit_houseList_bg_1.png);
                  // background-repeat: no-repeat;
                  // background-size: 100% 100%;
                  background: linear-gradient(0deg, rgba(90, 218, 255, 0.4), rgba(11, 115, 149, 0.4), rgba(25, 137, 202, 0.4));
                  box-shadow: 0 / @rem * 1rem 0 / @rem * 1rem 0 / @rem * 1rem 0 / @rem * 1rem rgba(7, 32, 67, 0.88) inset, 1 / @rem * 1rem -3 / @rem * 1rem 10 / @rem * 1rem 0 / @rem * 1rem rgba(92, 215, 229, 0.83) inset, 0 / @rem * 1rem 4 / @rem * 1rem 4 / @rem * 1rem 1 / @rem * 1rem rgba(128, 233, 255, 0.85) inset;
                  border-radius: 8 / @rem * 1rem;
            
                  .title_head_box {
                    width: 100%;
                    text-align: center;
            
                    .title_text {
                      line-height: 32 / @rem * 1rem;
                      font-size: 18 / @rem * 1rem;
                      font-family: Adobe Heiti Std;
                      font-weight: normal;
                      color: #ECFFF7;
                      text-shadow: 0 / @rem * 1rem 0 / @rem * 1rem 1 / @rem * 1rem rgba(48, 214, 255, 0.88);
                      -webkit-text-stroke: 1 / @rem * 1rem #2783AF;
                      text-stroke: 1 / @rem * 1rem #2783AF;
                      background: linear-gradient(0deg, #F5FFC6 0%, #5CD093 0%, #FFFFFF 0%, #30D6FF 100%);
                      -webkit-background-clip: text;
                      -webkit-text-fill-color: transparent;
                    }
            
                    .line {}
                  }
            
                  .img_4 {
                    position: absolute;
                    top: 0;
                    left: 0;
                  }
            
                  .type_box1 {
                    width: 89 / @rem * 1rem;
                    height: 25 / @rem * 1rem;
                    background-image: url(../../../../assets/communityimg/cockpit_type_1.png);
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    position: absolute;
                    top: -2 / @rem * 1rem;
                    right: 0;
                    text-align: center;
                    line-height: 25 / @rem * 1rem;
                    font-size: 14 / @rem * 1rem;
                    font-family: Adobe Heiti Std;
                    font-weight: bold;
                    color: #FFFFFF;
                  }
                  
                  .type_box2{
                    width: 89 / @rem * 1rem;
                    height: 25 / @rem * 1rem;
                    background-image: url(../../../../assets/communityimg/cockpit_type_2.png);
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    position: absolute;
                    top: -2 / @rem * 1rem;
                    right: 0;
                    text-align: center;
                    line-height: 25 / @rem * 1rem;
                    font-size: 14 / @rem * 1rem;
                    font-family: Adobe Heiti Std;
                    font-weight: bold;
                    color: #FFFFFF;
                  }
                  .type_box3 {
                    width: 89 / @rem * 1rem;
                    height: 25 / @rem * 1rem;
                    background-image: url(../../../../assets/communityimg/cockpit_type_4.png);
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    position: absolute;
                    top: -2 / @rem * 1rem;
                    right: 0;
                    text-align: center;
                    line-height: 25 / @rem * 1rem;
                    font-size: 14 / @rem * 1rem;
                    font-family: Adobe Heiti Std;
                    font-weight: bold;
                    color: #FFFFFF;
                  }
            
                  .content_text_box {
                    width: 80%;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
            
                    .text_6 {
                      font-size: 13 / @rem * 1rem;
                      font-family: Microsoft YaHei;
                      font-weight: 400;
                      color: #FFFFFF;
                      margin: 8 / @rem * 1rem 0;
                      // width: 50%;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    }
                  }
                }
            
                .item_box:nth-of-type(n+6) {
                  // margin-top: 3 / @rem * 1rem;
                  margin-left: 3 / @rem * 1rem;
                }
              }
            }
          }
        }
      }
    }
  }

  .square_box {
    width: 7/@rem * 1rem;
    height: 20/@rem * 1rem;
    background: #1C98E0;
  }

  .mar_top_30 {
    margin-top: 30/@rem * 1rem;
  }

  .mar_top_20 {
    margin-top: 20/@rem * 1rem;
  }

  p {
    margin-bottom: 0;
  }
</style>
