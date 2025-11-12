<template>
  <div>
    <a-modal
      title="网格"
      :width="940"
      v-if="visible"
      :visible="visible"
      :confirmLoading="confirmLoading"
      :footer="null"
      :centered = "true"
      :destroyOnClose="true"
      @cancel="handleCancel"
    >
      <baidu-map class="map"
                 :zoom="zoom"
                 :center="polygon"
                 @ready="handler">
      </baidu-map>
    </a-modal>
  </div>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    export default {
        name: "GridRange",
        data(){
            return {
                zoom:15,
                data:'',
                visible:false,
                polygon:{   //中心点坐标
                    lng:117.283042,
                    lat:31.86119
                },
                confirmLoading:false,
                map:'',
                BMap:'',
            }
        },
        mounted() {
            console.log("刷新后")
            window.addEventListener('mousewheel',this.handleScroll);
        },
        methods:{
            add(data){
                this.visible = true;
                this.data = data;
                this.getCenterPolygon();
            },
            handler({BMap,map}){
                this.map = map;
                this.BMap = BMap;
                var manage_range_polygon = new Array();
                this.data.map((item,i)=>{
                    manage_range_polygon = new Array();
                    item.manage_range_polygon.map((item1,i1)=>{
                        var a = new Array();
                        a = item1.split(',');
                        manage_range_polygon[i1] = new this.BMap.Point(a[0],a[1]);
                    });
                    this.$forceUpdate()
                    var polygon = new this.BMap.Polygon(manage_range_polygon, {strokeColor:"#2681f3", strokeWeight:2, strokeOpacity:0.8,fillColor:"#2681f3",strokeStyle:"dashed"});
                    this.map.addOverlay(polygon);//添加多边形图层
                    //polygon.enableEditing();
                });
            },
            handleCancel(){
                this.zoom=15;
                this.visible = false;
                this.polygon={   //中心点坐标
                    lng:117.283042,
                    lat:31.86119
                };
                this.map='';
                this.BMap='';
            },
            handleScroll(e){
                var e = e || window.event;
                if(e.wheelDelta > 0) {
                    this.zoom = this.zoom + 1;
                    if(this.zoom > 19){
                        this.zoom = 19;
                    }
                }else{
                    this.zoom = this.zoom - 1;
                    if(this.zoom < 4){
                        this.zoom = 4;
                    }
                }
            },
            //获取街道中心点和街道信息
            getCenterPolygon(){
                this.request(streetCommunityApi.getStreetAreaInfo, {

                }).then((res) => {
                    this.polygon.lng = res.long;
                    this.polygon.lat = res.lat;
                    console.log(this.polygon);
                })
            },
        }
    }
</script>

<style scoped>
  .map{
    width: 900px;
    height: 800px;
  }
</style>