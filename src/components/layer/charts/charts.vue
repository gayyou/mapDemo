<template>
  <div class="charts-container" @click="closeTip">
    <!-- <div class="info-container">
      <span class="title">Title</span>
    </div>    -->
    <span class="left-side-text">AttractRank value</span>
    <span class="bottom-text">Hour</span>
    <img class="close-chart" src="../../../assets/icons/close.png" alt=""
      @click="closeChart"
    >
    <div class="data-show" id="chart"></div>
    <div class="tip" :style="'left: ' + x + 'px;top: ' + y + 'px;'"
      v-if="isShow"
    >
      {{ name }}
    </div>
  </div>
</template>

<script>
import PubSub from 'pubsub-js'
import { colors } from '../../../utils/colors.js'
export default {
  data() {
    return {
      name: '',
      x: 0,
      y: 0,
      isShow: false
    }
  },
  mounted() {
    this.mychart = this.$echarts.init($('#chart')[0]);
    this.option = {
      title: {
        text: 'Title',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          // console.log(params)
        },
        axisPointer: {
          type: 'cross',
          // animation: false,
          // label: {
          //   backgroundColor: '#505765'
          // }
        }
      },
      xAxis: {
          type: 'category',
          axisTick: {
              alignWithLabel: true
          },
          data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
      },
      yAxis: {
        type: 'value',
      },
      dataZoom: [{
        type: 'slider'
      }],
      series: []
    };
    this.mychart.setOption(this.option);
    this.mychart.on('click', (params) => {
      console.log(params);
      this.$nextTick(() => {
        setTimeout(() => {
          let name = params.seriesName;
          this.$data.name = name;
          this.$data.isShow = true;
          this.$data.x = params.event.offsetX;
          this.$data.y = params.event.offsetY;
        }, 10);
      })
    });


    PubSub.subscribe('getDataCharts', (event, data) => {
      if (data.status == 200) {
        // this.$store.state.showCharts = true;
        let series = this.getAllData(data.flowLines, data.name);
        this.mychart.setOption({
          series,
          title: {
            text: 'The AttractRank value of Guangzhou ' + data.name + ' in 24 hours for two month',
            left: 'center'
          },
        })
      } else {
        this.store.state.showMessage = true;
        this.store.state.message = data.meg;
      }
    })
  },
  methods: {
    closeTip() {
      this.$data.isShow = false;
    },
    closeChart() {
      this.$store.state.showCharts = false;
    },
    getItemData(item) {
      let arr = [];
      let keys = Object.keys(item);
      for (let i = 0; i < keys.length; i++) {
        arr.push(item[keys[i]]);
      }

      return arr;
    },
    getMax(list) {

    },
    getAllData(list, name) {
      let seriesArr = [];
      for (let i = 0; i < list.length; i++) {
        seriesArr.push({
          name: list[i].day <= 28 ? '02-' + (list[i].day < 10 ? '0' + list[i].day : list[i].day) :('03-' + ((list[i].day - 28) < 10 ? '0' + (list[i].day - 28) : (list[i].day - 28))),
          type: 'line',
          showSymbol: false,
          symbolSize: 9,
          hoverAnimation: false,
          color: colors[i],
          data: this.getItemData(list[i].timeMap)
        })
        // console.log(list[i].timeMap);
      }
      return seriesArr;
    }
  }
}
</script>

<style lang="scss" scoped>
%clearBoth::after {
  content: "";
  display: block;
  clear: both;
}
.charts-container {
  width: 10rem;
  height: 6.1rem;
  background-color: #fff;
  border-radius: 12px;

  .close-chart {
    position: absolute;
    display: block;
    right: 10px;
    top: 5px;
    width: 50px;
    height: 50px;
    cursor: pointer;
    z-index: 111;
  }

  .info-container {
    @extend %clearBoth;
    width: 100%;

    >span {
      font-size: 18px;
      display: block;
    }

    .title {
      text-align: center;
    }
  }
  
  .data-show {
    width: 100%;
    height: 5.5rem;
    margin: .25rem auto;
  }
}
.tip {
  position: absolute;
  padding: 5px 10px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 2px 2px rgba($color: #000000, $alpha: 0.3);
}
.left-side-text {
  position: absolute;
  font-size: 18px;
  left: -0.5rem;
  top: 2.8rem;
  transform:rotate(-90deg);
}
.bottom-text {
  position: absolute;
  bottom: 0.2rem;
  width: 100%;
  height: 0.2rem;
  text-align: center;
  left: 0;
  font-size: 16px;
}
span {
  font-weight: 800;
}
</style>