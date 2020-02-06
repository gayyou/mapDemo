<template>
  <div class="left-first-panel"
    :class="$store.state.panel.leftFirActive ? 'left-fitst-active' : ''"
    @mousemove="openPanel"
  >
    <span @click="openSecPanel" data-mode="1">View AttractRank values</span>
    <span @click="openSecPanel" data-mode="2">View taxi flow</span>
    <span @click="openSecPanel" data-mode="3">{{ $store.state.isContract ? 'Close' : 'Open' }} contrast view</span>
    <span @click="clearLayer">Clean layers</span>
    <span @click="seeVideo">Demo video</span>
    <span @click="seeReadme">Readme</span>
    <!-- <span @click="upLoadFile">文件<input style="display: inline" id="upLoadFile" type="file" /></span> -->
    <!-- <span @click="upLoadFile2">飞线</span>
    <input style="display: inline" id="upLoadFile2" type="file" /> -->
  </div>
</template>

<script>
import PubSub from 'pubsub-js'
export default {
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {
    seeVideo() {
      this.$store.state.showVideo = true
    },
    seeReadme() {
      this.$store.state.showReadme =true;
    },
    upLoadFile() {
      let objFile = $('#upLoadFile')[0].files[0];
      let files = $('#upLoadFile').prop('files');
      var reader = new FileReader();//新建一个FileReader
      reader.readAsText(files[0], "UTF-8");//读取文件 
      const that = this;
      reader.onload = function(evt){ //读取完文件之后会回来这里
          var fileString = evt.target.result; // 读取文件内容
          console.log(JSON.parse(fileString));
                  let formateData = that.getAllCircle1(JSON.parse(fileString).circles);
              
              let obj = {
                id: 'map1',
                data: formateData
              }
              // this.$emit('updateHeatData', formateData);
              PubSub.publish('renewPoly', obj);
      }
    },
    upLoadFile2() {
      let objFile = $('#upLoadFile2')[0].files[0];
      let files = $('#upLoadFile2').prop('files');
      var reader = new FileReader();//新建一个FileReader
      reader.readAsText(files[0], "UTF-8");//读取文件 
      const that = this;
      reader.onload = function(evt){ //读取完文件之后会回来这里
          var fileString = evt.target.result; // 读取文件内容
              // let formateData = that.getAllCircle1();
              console.log(JSON.parse(fileString))
              let flyRes = {
                id: 'map1',
                data: that.fromateFlyData(JSON.parse(fileString)),
                percent: 0
              }
          
          PubSub.publish('renewFlyline', flyRes);
      }
    },
    fromateFlyData(data) {
      let resultArr = [];

      for (let i = 0; i < data.routeList.length; i++) {
        resultArr.push({
          id: data.routeList[i].id,
          value: data.routeList[i].weight,
          fromLnglat: [data.routeList[i].fromCentreLon, data.routeList[i].fromCentreLat],
          toLnglat: [data.routeList[i].toCentreLon, data.routeList[i].toCentreLat],
        });
      }

      return resultArr;
    },
    getCircleLatLng1(pointList) {
      let returnArr = [];
      for (let i = 0; i < pointList.length; i++) {
        returnArr.push([pointList[i].longitude, pointList[i].latitude]);
      }
      return returnArr;
    },
    getAllCircle1(circles) {
      let returnArr = [];
      for (let i = 0; i < circles.length; i++) {
        returnArr.push({
          id: circles[i].id,
          value: circles[i].weight,
          lnglat: this.getCircleLatLng1(circles[i].pointList)
        });
      }
      console.log(returnArr)
      return returnArr;
    },
    clearLayer() {
      if (this.$store.state.flightPath.map1) {
        if (this.$store.state.flightPath.map1.length) {
          for (let i = 0; i < this.$store.state.flightPath.map1.length; i++) {
            // this.$store.state.maps.map1.remove(this.$store.state.flightPath.map1[i]);
            this.$store.state.flightPath.map1[i].setMap(null);
          }
        }
      }

      if (this.$store.state.flightPath.map2) {
        if (this.$store.state.flightPath.map1.length) {
          for (let i = 0; i < this.$store.state.flightPath.map1.length; i++) {
            // this.$store.state.maps.map2.remove(this.$store.state.flightPath.map1[i]);
            this.$store.state.flightPath.map2[i].setMap(null)
          }
        }
      }

      if (this.$store.state.echarts.map1.mychart) {
        this.$store.state.echarts.map1.mychart.setOption({
          series: [],
          dataRange: null
        });
        this.$store.state.echarts.map1.layer.render = () => {
          this.$store.state.echarts.map1.mychart.setOption({
            series: [],
            dataRange: null
          });
        };
      }
      if (document.getElementsByClassName('fly-layer').length != 0) {
        d3.selectAll('.fly-layer').remove()
      }

      this.$store.state.rankSample['map1'].flyRankUnit = 0
      this.$store.state.rankSample['map1'].rankUnit = 0
      this.$store.state.rankSample['map2'].rankUnit = 0
    },
    openPanel(event) {
      event.stopPropagation();
      this.$store.state.panel.leftFirActive = true;
    },
    openSecPanel(event) {
      let mode = parseInt(event.target.getAttribute('data-mode'));
      this.$store.state.panel.secPanMode = mode;
      if (mode == 3) {
        this.$store.state.isContract = !this.$store.state.isContract;
        if (this.$store.state.mapList.length == 2) {
          this.$store.state.mapList.pop();
        } else {
          this.$store.state.mapList.push({
            id: 'map2'
          });
          this
        }
        
      } else {
        this.$store.state.panel.leftSecActive = true;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.left-first-panel {
  width: 3.7rem;
  height: 100vh;
  background-color: rgba($color: #373f53, $alpha: .9);
  transition: transform .75s ease;
  display: flex;
  transform: translateX(-3.7rem);
  flex-direction: column;
  justify-content: center;

  span {
    cursor: pointer;
    display: block;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    height: 50px;
    line-height: 50px;
    margin-top: 10px;
    margin-bottom: 10px;
    color: #fff;
    font-size: 0.3rem;
  }

  span:hover {
    background-color: rgba($color: #ffffff, $alpha: 0.3);
  }
}

.left-fitst-active {
  transform: translateX(0);
}
</style>
