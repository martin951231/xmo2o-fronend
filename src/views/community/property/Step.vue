<template>
  <div class="container">
    <div class="center_box">
      <div class="title">{{info.title}}</div>
      <div class="text_1">{{info.des}}</div>
      <div class="flex_box_1">
        <div class="item_box" v-for="(item,index) in listdata">
          <img class="img_1" :src="item.img" alt="">
          <div class="flex_1">
            <div class="text_2">{{item.title}}</div>
            <div class="text_3" v-if="index == 0 || index == 1">{{item.des}}</div>
            <div class="flex_text_box" v-if="index==2" v-for="(i,d) in item.children">
              <div class="dot"></div>
              <div class="text_4" @click="gourl_a(i.url)">{{i.title}}</div>
            </div>
            <div v-if="index == 0 || index == 1" @click="gourl(item.url)" class="btn_a">{{item.btn}}</div>
          </div>
          <img :src="item.num_img" alt="">
        </div>
      </div>
      <div class="flex_box_2">
        <div class="text_4">{{info.tip}}</div>
        <div class="btn_b" @click="gourl_b">完成配置</div>
      </div>
    </div>
    <img class="logo" :src="info.system_admin_logo" alt="">
    <div class="tip">{{tip}}</div>
  </div>
</template>

<script>
  import common from '@/api/community/common'
  import path from '@/router/router-path.js'
  let _this = null;
  export default {
    data() {
      return {
        info: {},
        listdata: [],
        tip: '',
      }
    },
    created() {
      _this = this;
      _this.getConfig()
      _this.getinitinfo()
    },
    mounted() {

    },
    methods: {
      getConfig() {
        const config = this.$store.getters.config
        if (Object.keys(config).length) {
          _this.tip = config.copyright_txt
          console.log("this.config", config)
        } else {
          setTimeout(() => {
            _this.getConfig()
          }, 300)
        }
      },
      getinitinfo() {
        this.request(common.propertyGuide).then(res => {
          console.log('+++++++', res)
          _this.info = res
          _this.listdata = res.block
        });
      },
      gourl(url) {
        window.open(url);
      },
      gourl_a(url) {
        window.open(url);
      },
      gourl_b() {
        this.request(common.completePropertyGuide).then(res => {
          console.log('+++++++', res)
          this.$router.push({
            path: path.propertyIndex
          })
        });

      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    min-height: 750px;

    .center_box {
      width: 1400px;
      margin-top: 26px;

      .title {
        font-size: 36px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #000000;
        line-height: 60px;
      }

      .text_1 {
        font-size: 13px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #333333;
        line-height: 40px;
      }

      .flex_box_1 {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-top: 152px;

        .item_box {
          width: 440px;
          height: 204px;
          border: 1px solid #EEEEEE;
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          padding-top: 57px;

          .img_1 {
            margin-left: 34px;
          }

          .flex_1 {
            width: 180px;
            height: 100%;
            display: flex;
            flex-direction: column;
            margin-left: 23px;
            position: relative;
            margin-right: 40px;

            .flex_text_box {
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-top: 5px;

              .dot {
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background-color: #2681f3;
              }

              .text_4 {
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #2681f3;
                line-height: 20px;
                text-align: justify;
                margin-left: 10px;
                cursor: pointer;
              }
            }

            .text_2 {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: #000000;
            }

            .text_3 {
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #7F7F7F;
              line-height: 18px;
              text-align: justify;
              margin-top: 5px;
            }

            .btn_a {
              width: 100px;
              height: 36px;
              border: 2px solid #1890FF;
              border-radius: 4px;
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #1890FF;
              line-height: 32px;
              text-align: center;
              position: absolute;
              bottom: 26px;
              cursor: pointer;
            }
          }
        }
      }

      .flex_box_2 {
        width: 100%;
        height: 80px;
        background: #FAFBFE;
        padding-left: 19px;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 126px;

        .text_4 {
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #000000;
          line-height: 80px;
        }

        .btn_b {
          width: 115px;
          height: 40px;
          background: #1890FF;
          border-radius: 4px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 40px;
          text-align: center;
          margin-left: 26px;
          cursor: pointer;
        }
      }
    }

    .logo {
      position: absolute;
      left: 44px;
      top: 36px;
      width: 190px;
    }

    .tip {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #7A8BAA;
      position: absolute;
      bottom: 37px;
      left: 50%;
      transform: translateX(-50%);
      /*移动自身的一半*/
    }
  }
</style>
