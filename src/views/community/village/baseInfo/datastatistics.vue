<template>
  <div class="bg-box">
    <!-- top -->
    <div class="top-box">
      <img src="../../../../assets/images/logo.png" alt class="logo-img" />
      <div class="title">快鲸智慧社区</div>
    </div>
    <!-- container -->
    <div class="container">
      <div class="flex_1">
        <div class="flex_left_1">
          <div class="left_box_1">
            <img src="../../../../assets/images/left_icon.png" alt="">
            <div class="top_title_box">
              <img src="../../../../assets/images/left_icon.png" alt="">
              <div class="mini_title" v-if="$store.getters.config">{{$store.getters.config.houuse_name}}人口</div>
              <img src="../../../../assets/images/right_icon.png" alt="">
            </div>
            <div class="mini_box_1">
              <div class="mini_box" v-for="(item,index) in 3">
                <div class="text_1">总人口</div>
                <div class="text_1">26,936</div>
              </div>
            </div>
          </div>
          <div class="left_box_1">
            <div class="top_title_box">
              <img src="../../../../assets/images/left_icon.png" alt="">
              <div class="mini_title">今日人流量</div>
              <img src="../../../../assets/images/right_icon.png" alt="">
            </div>
          </div>
          <div class="left_box_2">
            <div class="top_title_box">
              <img src="../../../../assets/images/left_icon.png" alt="">
              <div class="mini_title">今日人流量</div>
              <img src="../../../../assets/images/right_icon.png" alt="">
            </div>
          </div>
          <div class="left_box_2">
            <div class="top_title_box">
              <img src="../../../../assets/images/left_icon.png" alt="">
              <div class="mini_title">今日人流量</div>
              <img src="../../../../assets/images/right_icon.png" alt="">
            </div>
          </div>
        </div>
        <div class="flex_left_2">

        </div>
      </div>
      <div class="flex_2">
        <div class="map">

        </div>
      </div>
      <div class="flex_3"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: '404'
  }
</script>

<style lang="less" scoped>
  .bg-box {
    background-image: url(../../../../assets/images/newbg.png);
    width: 100%;
    height: 100%;
    background-size: cover;
    color: #666;
    font-family: Microsoft YaHei, Arial, Helvetica, sans-serif;
    font-size: 14px;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 20px;
    color: #747b8b;
    font-size: 16px;
    overflow: hidden;
  }

  .top-box {
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .logo-img {
      width: 55px;
      height: 30px;
      display: inline-block;
    }

    .title {
      font-size: 30px;
      font-weight: 700;
      font-stretch: normal;
      line-height: 24px;
      letter-spacing: 0px;
      color: #ffffff;
      margin-left: 8px;
    }
  }

  .container {
    width: 100%;
    height: 100%;
    padding-top: 30px;
    display: flex;
    flex-direction: row;
    justify-content: center;

    .flex_1 {
      flex: 1;
      height: 100%;
      padding-right: 5px;

      .flex_left_1 {
        width: 100%;
        height: 43%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: wrap;
        overflow: hidden;

        .left_box_1 {
          width: 49%;
          height: 40%;

          .top_title_box {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            .mini_title {
              font-size: 12px;
              font-weight: normal;
              font-stretch: normal;
              line-height: 35px;
              letter-spacing: 0px;
              color: #31abe3;
              margin: 0px 5px;
            }
          }

          .mini_box_1 {
            height: 71%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            .mini_box {
              width: 30%;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;

              .text_1 {
                font-size: 13px;
                font-weight: normal;
                font-stretch: normal;
                line-height: 25px;
                letter-spacing: 0px;
                color: #08d1ea;
              }
            }
          }
        }

        .left_box_2 {
          width: 49%;
          background-image: url(../../../../assets/images/info_bg.png);
          height: 57%;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          margin-top: 2%;

          .top_title_box {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            .mini_title {
              font-size: 12px;
              font-weight: normal;
              font-stretch: normal;
              line-height: 40px;
              letter-spacing: 0px;
              color: #31abe3;
              margin: 0px 5px;
            }
          }
        }
      }

      .flex_left_2 {
        width: 100%;
        height: 32%;
        background-image: url(../../../../assets/images/info_bg.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        overflow: hidden;
        margin-top: 2%;
      }
    }

    .flex_2 {
      width: 30%;
      height: 100%;

      .map {
        background-image: url(../../../../assets/images/map_bg.png);
        height: 40%;
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
    }

    .flex_3 {
      flex: 1;
      height: 100%;
    }
  }
</style>
