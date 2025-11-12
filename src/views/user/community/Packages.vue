<template>

  <div class="box">
    <div class="header">
      <div class="head">套餐选择</div>
    </div>
    <div class="parent">
    <div class="divs" id="pics">
      <div class="package" v-for="(item,index) in packageData" :key="index" @mousedown="handlemouse"
           @mouseleve="leave"
           @click="clickDoSome(index)"
      >
        <div class="package-top">
          <div class="title"><h1>{{item.package_title}}</h1></div>
          <div class="explain"><h4>{{item.txt_des}}</h4></div>
        </div>
        <div class="package-centre" v-if="item.content">
          <div v-if="item.content && item.content.property">
            <div ><h3>物业管理后台</h3></div>
            <div class="fa-book" v-for="(property,indexp) in item.content.property" :key="indexp">
              <div class="content">{{property.name}}</div>
              <div class="content-right">√</div>
            </div>
          </div>
          <br/>
          <div v-if="item.content && item.content.community">
            <div><h3>{{$store.getters.config.house_name}}管理后台</h3></div>
            <div class="fa-book" v-for="(community,indexs) in item.content.community" :key="indexs">
              <div class="content">{{community.name}}</div>
              <div class="content-right">√</div>
            </div>
          </div>
        </div>
        <div class="package-centre prompt" v-if="!item.content">该套餐仅包括物业基本管理功能</div>
        <div class="package-bottom">
          <div class="fot-money">￥{{item.package_price}}/年</div>
          <div class="footer">包含{{$store.getters.config.room_name}}数：{{item.room_num}}间</div>
          <div class="footer">试用时间：{{item.package_try_days}}天</div>
          <div class="table-operator">
            <router-link class="b-btn ant-btn ant-btn-primary b-btn" type="primary" :to="{ name: 'communityAppointIndex' ,query:queryParam,params:{id:item.package_id,title:item.package_title,price:item.package_price,randomNumber:randomNumber}}">立即试用</router-link>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
    import userApi from '@/api/user/community/index.js';
    export default {
        data () {
            return {
              randomNumber:'',
                packageData:[],
                package_id: '',
                package_title: "",
                package_try_days: 0,
                package_price: "",
                room_num: '',
                status: '',
                sort: '',
                details: "",
                content: {
                    property: [],
                    community: []
                },
                property:[],
                community:[],
                isDrag:false,//是否在拖拽
                isClick:false,//是否是单击
                queryParam: {},
            }
        },
        activated() {
            this.packageList();
            this.queryParam = this.$route.query;
        },
        mounted(){
            this.randomNumber=this.$route.query.randomNumber;
            this.queryParam = this.$route.query;
            let scroll_content = document.getElementsByClassName('scroll_content')[0];
            scroll_content.style.backgroundColor = 'rgba(0,0,0,0.3)'//设置parent的位置
            scroll_content.style.overflow = 'hidden'//设置parent的位置
            this.packageList();
        },
        destroyed() {
          let scroll_content = document.getElementsByClassName('scroll_content')[0];
          scroll_content.style.backgroundColor = 'rgba(255,255,255,1)'//设置parent的位置
          scroll_content.style.overflow = 'hidden'//设置parent的位置
        },
        methods: {
            packageList() {
                this.request(userApi.getPackageList)
                    .then((res) => {
                        console.log('res', res)
                        this.packageData = res
                        // console.log(packageData);
                    })
            },
            handlemouse(e) {
                let startTime, endTime;

                let child = document.getElementsByClassName('parent')[0];
                let parent = document.getElementsByClassName('divs')[0];
                let box = document.getElementsByClassName('box')[0];
                // 使用this.$refs.name获取dom元素,可能会获取到vue组件,他不支持获取元素的宽高以及监听鼠标事件
                let widthDiffer = parent.offsetWidth - child.offsetWidth;
                if (widthDiffer > 0) {
                    //如果grand真实宽度比parent宽度长,那么就不用滑动了,直接返回
                    this.isClick = true;
                    return
                }
                console.log(parent);
                console.log('child',child.offsetWidth);
                console.log('parent',parent.offsetWidth);
                console.log('box',box.offsetWidth);
                if(box.offsetWidth > child.offsetWidth){
                    return
                }
                startTime = new Date().getTime();//获取事件开始时间
                let disx = e.clientX - child.offsetLeft;
                this.isDrag = true;//设置开始拖拽
                parent.onmousemove = (e) => {
                    if (this.isDrag) {//拖拽中
                        let mouseX = e.clientX; // 鼠标点击的位置
                        let x = mouseX - disx;
                        child.style.left = x + 'px'//设置parent的位置
                    }
                }
                parent.onmouseup = (e) => {
                    endTime = new Date().getTime();
                    let timeDiffer = endTime - startTime;//获取抬起时间
                    this.isDrag = false;
                    if (timeDiffer < 150) {
                        //时间间隔小于150,那么就判断为单击事件,这里时间间隔可自由设置
                        this.isClick = true;
                    } else {
                        this.isClick = false;
                    }
                }

            },
            /**
             * @breif 监听鼠标移出横向菜单栏
             * ***/
            leave() {
                this.isDrag = false;
            },
            clickDoSome(index) {
                if (this.isClick) {
                    //dosome
                }

            },
        }

    }

</script>

<style lang="less" scoped>
  .parent {
    position: absolute;
    white-space: nowrap;
  }
  .box {
    text-align: center;
    margin: 33px 36px;
    /*border: 1px solid #eee;*/
    height: 93.4%;
    width: 96%;
    font-weight: bold;
    /*box-shadow: 0 0 3px 1px #eee;*/
    white-space: nowrap;
    position:relative;
    overflow: scroll;
    background-color: #FFFFFF;
    border-radius: 10px;
  }

  .divs{
    display: flex;
    height: 900px;
    white-space: nowrap;/*文本不会换行，文本会在在同一行上继续*/
    flex-wrap: nowrap;
    position:relative;
    overflow: hidden;
  }
  .box::-webkit-scrollbar{
    display: none;
  }
  h3{
    font-weight:bold;
  }
  .header{
    border: 1px solid #eee;
    width: 100%;
    height: 50px;
  }
  .head{
    width: 100%;
    height: 50px;
    padding: 10px;
    font-size: 18px;
    text-align: center;
  }
  .package{
    border: 1px solid #eee;
    height: 88%;
    width: 350px;
    margin: 15px;
    display: inline-block;/*行内块元素*/
  }
  .package-top{
    border: 1px solid white;
    width: 100%;
    height: 20%;
    /*background: #6eccdf;*/
    /* background-image: linear-gradient(#4e57cd, #7a90f2); */
    background-image: url(../../../assets/images/package_title.png);
    background-size: cover;
  }
  .package-top h1,h2,h4{
    color: white;
  }
  .package-centre{
    border-bottom: 1px solid #eee;
    width: 100%;
    height: 60%;
    overflow-x:auto;
    padding: 10px 0;
  }
  .package-centre::-webkit-scrollbar{
      width: 8px;
      height: 16px;
      background-color: #F5F5F5;
  }
  /*定义滚动条轨道 内阴影+圆角*/
  .package-centre::-webkit-scrollbar-track{
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
      border-radius: 10px;
      background-color: #F5F5F5;
  }

  /*定义滑块 内阴影+圆角*/
  .package-centre::-webkit-scrollbar-thumb{
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
      background-color: #555;
  }

  .package-bottom{
    width: 100%;
    height: 20%;
  }
  .prompt{
    padding-top: 50px;
  }
  .title{
    text-align:center;
    margin-top: 50px;
  }
  .explain{
    margin-top: 10px;
  }
  .content{
    width: 40%;
    float: left;
    text-align:left;
    margin-left:20% ;
  }
  .content-right{
    text-align:center;
    width: 40%;
    float: left;
  }
  .fa-book{
    width: 100%;
    height: 20px;
    font-size: 15px;
    margin-top: 5px;
    text-align:center;
  }
  .table-operator {
    margin-bottom: 24px;
    margin-top: 10px;
  }
  .b-btn{
    width: 120px;
    border-radius:6px;
  }
  .fot-money{
    font-size: 20px;margin-top: 10px;
  }
  .footer{
    margin-top: 5px;
  }
</style>