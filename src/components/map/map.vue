<template>
  <div class='map-container'>
    <div :id='id' class='google-map'></div>
    <rank class='rank'
      :ranks="this.$data.rank"
    ></rank>
    <valueSample class='rank-sample'
      :rankUnit='$data.rankUnit'
      :rankTitle='"AttractRank"'
      v-if='$store.state.rankSample[this.id].rankUnit != 0'
    ></valueSample>
    <valueSample class='rank-sample'
      :rankUnit='$data.flylineRankUnit'
      :rankTitle='"Number of records"'
      style="bottom: 0rem;"
      v-if="$store.state.rankSample['map1'].flyRankUnit != 0 && this.id == 'map1'"
    ></valueSample>
  </div>
</template>

<script>
import rank from '../panel/rank/rank.vue';
import { colorModel } from '../../utils/shared/model.js';
import { getFlyLine } from '../../utils/shared/line.js';
import { getGCJ } from '../../utils/shared/gcj.js';
import valueSample from '../panel/valueSample/valueSample.vue';
import PubSub from 'pubsub-js'

export default {
  components: {
    rank,
    valueSample
  },
  data() {
    return {
      isZooming: false,
      timeoutID: null,
      rank: [],
      flylineRankUnit: 0,
      example: {
        type: 'LineString',
        cor: [[91.1865, 30.1465], [116.4551, 40.2539]]
      },
      map: null,
      rankUnit: 0,
      mousedown: false
    };
  },
  props: ['id', 'heatData', 'isOpenHeat'],
  mounted() {

    // this.$store.state.showCharts = true;
              // this.$store.state.message = '请求超时，请检查您的网络是否正常'

    // this.mychart = this.$echarts.init($('#' + this.id)[0]);
    // this.mychart.setOption({
    //   amap: {
    //     //  maxPitch: 60,
    //     //  pitch: 10, //45 俯仰角
    //     //  viewMode: '3D',
    //     zoom: 10,
    //     //  expandZoomRange: true,
    //     zooms: [3, 20],
    //     mapStyle: 'amap://styles/darkblue', //地图主题
    //     center: [113.25, 23.1], //中心点
    //     lang: 'en',
    //     //  rotation: 0,  //顺时针旋转角度
    //     resizeEnable: true
    //   },
    //   // dataRange: {
    //   //   zIndex: 999,
    //   //   min: 0,
    //   //   max: 100,
    //   //   calculable: true,
    //   //   color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua'],
    //   //   textStyle: {
    //   //     color: '#fff'
    //   //   }
    //   // },
    //   animation: false,
    //   series: []
    // });
    // let google = window.google;
    let time = 0;
    if (!window.google) {
      this.$store.state.showConfirm = true;
      PubSub.subscribe('confirmChart', (event, data) => {

      })
    } else {
      this.initPage()
    }
  },
  methods: {
    initPage() {
      this.map = new google.maps.Map(document.getElementById(this.id), {
        zoom: 11,
        center: {
          lat: 23.12,
          lng: 113.28
        },
        disableDefaultUI: true,               //取消默认的试图
        navigationControl: false,              //true表示显示控件
        mapTypeControl: false,                //false表示不显示控件
        scaleControl: false
      });
      this.$data.map = this.map;
      this.map.addListener("dragstart", () => {
        this.$data.mousedown = true
      });
      this.map.addListener("dragend", () => {
        this.$data.mousedown = false
      });
      this.map.addListener('zoom_changed', () => {
        if (this.$data.timeoutID) {
          clearTimeout(this.$data.timeoutID);
        }
        this.$data.isZooming = true;
        this.$data.timeoutID = setTimeout(() => {
          this.$data.isZooming = false;
        }, 100);
      })

      PubSub.subscribe('renewPoly' , (event, data) => {
        if (data.id != this.id && data.id) {
          return ;
        }
        this.$store.state.showRightTip = true;
        this.$store.state.rightTipMes = 'You can click on the colored area to see the AttractRank value.'
        let arr = data.data;

        let rankUnit = this.dealRankDis(arr);

        arr = getGCJ(arr);


        // this.insertSort(data);
        // console.log(data)

        this.$data.rank = [];
        let length = arr.length

        this.$data.rank.push(arr[length - 1].msg)
        this.$data.rank.push(arr[length - 2].msg)
        this.$data.rank.push(arr[length - 3].msg)


        let flightPathArr = []
        for (let i = 0; i < arr.length; i++) {
          let temp = this.getPolygon(arr[i], rankUnit)
          temp.setMap(this.$data.map)
          flightPathArr.push(temp);
        }
        this.$store.state.flightPath[this.id] = flightPathArr;
        this.$store.state.maps[this.id] = this.$data.map;
        this.$store.state.panel.leftSecActive = false;
        this.$store.state.rankSample[this.id].rankUnit = rankUnit;
        this.$nextTick(() => {
          this.$data.rankUnit = rankUnit;
        })
      });

      PubSub.subscribe('renewFlyline' , (event, data) => {
        if (data.id != this.id && data.id) {
          return ;
        }

        let flylineSeries = [],
            lineData = data.data,
            percent = data.percent,
            rankUnit = this.dealRankDis(lineData),
            isContract = false;

        this.$store.state.rankSample['map1'].flyRankUnit = rankUnit;
        this.$nextTick(() => {
          this.$data.flylineRankUnit = rankUnit;
        })

        let max = this.getMaxValue(lineData);
        let overlay = new google.maps.OverlayView();
        // insertSort(lineData)
        data = lineData;
        let lens = Math.floor(data.length * percent);
        data = data.slice(lens)

      const that = this;
      overlay.onAdd = function() {
        // console.log(this.getPanes().overlayLayer)
          var layer = d3.select(this.getPanes().overlayLayer).append('svg')
              .attr('class', 'fly-layer');

          let defs = layer.append('defs');
          defs.append('marker')
            .attr('id', 'markerArrow')
            .attr('markerWidth', '13')
            .attr('markerHeight', '13')
            .attr('refX', '2')
            .attr('refY', '6')
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M2,2 L2,11 L10,6 L2,2')
            .attr('fill', '#FF0000');

          // console.log('data', data)

          layer.selectAll('.flyLine').data(data, (d) => d.id).enter().append('path').attr('class', 'flyLines')
          var projection = this.getProjection();
          overlay.draw = function() {
            if (that.$data.mousedown) {
              return ;
            }
            // if (that.$data.is)
            let isContract = false;
            let randomBash = 0;
            let bounds = this.map.getBounds();
            let nw = bounds.getNorthEast(),
                sw = bounds.getSouthWest(),
                center = bounds.getCenter();

            layer.selectAll('.flyLines')
              .data(data)
              .each(transform)

            function getCosFromTan(d1, d2, isContract) {
              let value, rad;
              if (d2.x == d1.x) {
                value = 0;
                rad = Math.PI / 2;
              } else {
                value = (d2.y - d1.y) / (d2.x - d1.x),
                rad = Math.atan(Math.abs(value));
              }

              let length = Math.pow(Math.pow(d2.y - d1.y, 2) + Math.pow(d2.x - d1.x, 2), 1 / 2),
                  paramX, paramY;

              if (value < 0) {
                paramX = 1;
                paramY = 1;
              } else {
                paramX = 1;
                paramY = -1;
              }

              return isContract ? {
                x: paramX * length * Math.sin(rad),
                y: paramY * length * Math.cos(rad)
              } : {
                x: -(paramX * length * Math.sin(rad)),
                y: -(paramY * length * Math.cos(rad))
              }
            }

            function transform(flyObj) {
              let d = new google.maps.LatLng(flyObj.fromLnglat[1], flyObj.fromLnglat[0]);
              let d2 = new google.maps.LatLng(flyObj.toLnglat[1], flyObj.toLnglat[0]);
              let bash = new google.maps.LatLng(nw.lat(), nw.lng())
              let bash2 = new google.maps.LatLng(sw.lat(), sw.lng())
              d = projection.fromLatLngToDivPixel(d);
              d2 = projection.fromLatLngToDivPixel(d2);
              let bashX = projection.fromLatLngToDivPixel(bash).x;
              let bashY = projection.fromLatLngToDivPixel(bash2).y
              let res = getCosFromTan(d, d2, isContract);

              if (isContract == true) {
                isContract = false;
              } else {
                isContract = true;
              }
              randomBash =  (randomBash + 1) % 10;
              res.x = bashX + res.x * (randomBash / 10) + (d2.x + d.x) / 2;
              res.y = bashY + res.y * (randomBash / 10) + (d2.y + d.y) / 2;
              let color = that.getValeColor(flyObj.value, rankUnit)

              return d3.select(this)
                      .attr('d', 'M ' + (bashX + d.x) + ',' + (bashY + d.y) + ' Q ' + res.x + ',' + res.y + ' ' + (bashX + d2.x) + ',' + (bashY + d2.y))
                      .attr('stroke', color)
                      .attr('stroke-width', '1')
                      .attr('fill', 'none')
                      .attr('marker-end', 'url(#markerArrow)');
            }
          };
      };
      overlay.setMap(this.map);

      });
    },
    insertSort(list) {
      let i, j, k;
        for (i = 1; i < list.length; i++) {
            //为a[i]在前面的a[0...i-1]有序区间中找一个合适的位置
            for (j = i - 1; j >= 0; j--) {
              if (list[j].value < list[i].value) {
                break;
              }
            }

            //如找到了一个合适的位置
            if (j != i - 1) {
              //将比a[i]大的数据向后移
              let temp = list[i];
              for (k = i - 1; k > j; k--) {
                list[k + 1] = list[k];
              }

              //将a[i]放到正确位置上
              list[k + 1] = temp;
            }
        }
      return list;
    },
    getLine(item, rankUnit) {
      let color = this.getValeColor(item.value, rankUnit);

      return getFlyLine({
        name: '测试',
        value: 96,
        lineColor: color,
        symbolColor: color,
        fromName: color,
        toName: color,
        fromLngLat: item.fromLnglat,
        toLngLat: item.toLnglat
      })
    },
    getPolygon(item, rankUnit) {
      let arr = [];
      for (let i = 0; i < item.lnglat.length; i++) {
        let temp = new google.maps.LatLng(
          parseFloat(item.lnglat[i][1]),
          parseFloat(item.lnglat[i][0]),
        );
        arr.push(temp);
      };

      let color = this.getValeColor(item.value, rankUnit);

      let flightPath = new google.maps.Polygon({
        paths: arr,
        strokeColor: '#000',
        strokeOpacity: 0.5,
        strokeWeight: 1,
        fillColor: color,
        fillOpacity: 0.8
      });


      flightPath.msg = item.msg;
      flightPath.id = item.id;

      window.google.maps.event.addDomListener(flightPath, 'click', (event) => {
        if (this.coordInfoWindow) {
          this.coordInfoWindow.close()
        }
        this.$store.state.showConfirm = true;
        let token = PubSub.subscribe('confirmChart', (event, data) => {
          PubSub.unsubscribe(token);
          if (data.confirm) {
            let id = flightPath.id;
            // 请求数据
          }
        })

      })
      // flightPath.on('click', (event) => {
      //   console.log(event)
      // })

      // flightPath.on('click', (event) => {
      //   let infoWindow = new AMap.InfoWindow({
      //     anchor: 'top-center',
      //     content: 'id: ' + event.target.id + 'value: ' + event.target.value,
      //   });
      //
      //   infoWindow.open(this.$data.map, [event.lnglat.lng ,event.lnglat.lat]);
      //   PubSub.publish('getFlowData', {
      //     id: this.id
      //   });
      // });

      return flightPath;
    },
    getValeColor(value, rankUnit) {
      value = parseFloat(value);
      let level = Math.floor(value / rankUnit);

      return level < (colorModel.length - 1) ? colorModel[level] : colorModel[colorModel.length - 1];
    },
    getLevel(max) {
      let digit = 0;
      max = parseInt(max);
      while (max != 0) {
        digit++;
        max = max / 10;
        max = parseInt(max);
      }

      return digit;
    },
    getMaxValue(list) {
      let max = 0;

      for (let i = 0; i < list.length; i++) {
        if (max < parseFloat(list[i].value)) {
          max = parseFloat(list[i].value);
        }
      }

      return max;
    },
    dealRankDis(list) {
      let max = this.getMaxValue(list);

      let rankUnit = max / colorModel.length;
      // let max = this.getMaxValue(list),
      //   level = this.getLevel(max),
      //   num = 1;

      // for (let i = 1; i < level; i++) {
      //   num *= 10;
      // }

      // let times = Math.floor(max / num / 1.4);

      // let rankUnit = (1.4 * num * times) / 7;
      return rankUnit.toFixed(1);
    }
  },
  watch: {
    isOpenHeat(newVal) {
      if (newVal == false) {
        return;
      }
    }
  }
};
</script>

<style lang='scss'>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .google-map {
    width: 100%;
    height: 100%;
  }

  .rank {
    position: absolute;
    top: 0.6rem;
    right: 0;
    z-index: 11;
  }

  .rank-sample {
    position: absolute;
    right: 0;
    bottom: 3.3rem;
  }
}
.fly-layer {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: -50vh;
  left: -50%;
}
</style>
