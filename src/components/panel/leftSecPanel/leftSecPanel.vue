<template>
  <div class="left-second-panel" :class="$store.state.panel.leftSecActive ? 'left-second-active' : ''">
    <div class="arrow-container"
      @click="switchPanel"
    >
      <img :src="$store.state.panel.leftSecActive ?
      require('../../../assets/icons/arrow_left_large.png') : require('../../../assets/icons/arrow_right_large.png')" alt="">
    </div>
    <div class="attraction-container"
      v-if="$store.state.panel.secPanMode == 1 && !$store.state.isContract"
    >
      <span class="attract-title">District's AttractRank value</span>
      <div class="choice-mode-container">
        <span>Mode</span>
        <el-select v-model="mode" placeholder="Choice time mode">
          <el-option
            class="select-mode"
            v-for="item in timeMode"
            :key="item.label"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="choice-time-container" v-if="mode != 'all'">
        <span>Time</span>
        <el-cascader
          :options="dateChoice"
          v-model="date"
        >
        </el-cascader>
        <!-- <el-date-picker
          class="select-time"
          v-model="date"
          :type="'month'"
          placeholder="Choice date">
        </el-date-picker> -->
      </div>
      <div class="button-container">
        <el-button class="comfirm-search" type="primary"
          @click="getData"
          :loading="isLoading"
        >Confirm</el-button>
      </div>
    </div>

    <!-- 下面是比较时候的选择 -->
    <div class="attraction-container"
      v-if="$store.state.panel.secPanMode == 1 && $store.state.isContract"
    >
      <span class="attract-title">District's AttractRank value</span>
      <div class="choice-mode-container">
        <span>Mode</span>
        <el-select v-model="mode" placeholder="Choice time mode">
          <el-option
            class="select-mode"
            v-for="item in timeMode"
            :key="item.label"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <span class="time-to-map"  v-if="mode != 'all'">Left Map:</span>
      <div class="choice-time-container"  v-if="mode != 'all'">
        <span>Time</span>
        <el-cascader
          :options="dateChoice"
          v-model="firstDate"
        >
        </el-cascader>
      </div>
      <span class="time-to-map"  v-if="mode != 'all'">Right Map:</span>
      <div class="choice-time-container"  v-if="mode != 'all'">
        <span>Time</span>
        <el-cascader
          :options="dateChoice"
          v-model="secondDate"
        >
        </el-cascader>
      </div>
      <div class="button-container">
        <el-button class="comfirm-search" type="primary"
          @click="getDoubleData"
          :loading="isLoading"
        >Confirm</el-button>
      </div>
    </div>

    <!-- 以下是飞线请求数据 -->
    <div class="attraction-container"
      v-if="$store.state.panel.secPanMode == 2"
    >
      <span class="attract-title">Add flying route layer</span>
      <div class="choice-mode-container">
        <span>Mode</span>
        <el-select v-model="mode" placeholder="Choice time mode">
          <el-option
            class="select-mode"
            v-for="item in flyTimeMode"
            :key="item.label"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="choice-time-container"
        v-if="isShowFlyTimeChoice"
      >
        <span>Time</span>
        <el-cascader
          :options="dateChoice"
          v-model="date"
        >
        </el-cascader>
      </div>
      <div class="button-container">
        <el-button class="comfirm-search" type="primary"
          @click="getFlyData"
          :loading="isLoading"
        >Confirm</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import PubSub from 'pubsub-js'
import { data } from '../../../assets/data4.js'
export default {
  props: ['heatData'],
  data() {
    return {
      isLoading: false,
      date: null,
      mode: '',
      firstDate: null,
      secondDate: null,
      flyDate: null,
      flyFirstDate: null,
      flySecondDate: null,
      timeMode: [
        {
          label: 'By hour',
          value: 'hour',
        },
        {
          label: 'By day',
          value: 'day',
        },
        {
          label: 'By month',
          value: 'month',
        },
        {
          label: 'All',
          value: 'all',
        },
        // {
        //   label: 'By date',
        //   value: 'date'
        // },
        // {
        //   label: 'By six hours',
        //   value: 'six'
        // }
      ],
      dateChoice: [
        {
          value: '2',
          label: 'February',
          children: null,
        },
        {
          value: '3',
          label: 'March',
          children: null,
        }
      ],
      // 下面是选择飞线的日期，有三个，按小时、按天、按月
      // 分别是 hour date all
      flylineMode: '',
      flyTimeMode: [
        {
          label: 'By hour',
          value: 'hour'
        },
        {
          label: 'By day',
          value: 'date'
        },
        {
          label: 'All',
          value: 'all'
        }
      ],
      flyChoice: [
        {
          value: '2',
          label: 'February',
          children: null,
        },
        {
          value: '3',
          label: 'March',
          children: null,
        }
      ],
      isShowFlyTimeChoice: true, // 是否显示飞线时间选择
    }
  },
  mounted() {
    this.$data.mode = 'hour';
    this.$data.flylineMode = 'hour'

  },
  methods: {
    getFlyData() {
      let mode = this.$data.mode,
          isAll = false,
          requestObj = null,
          percent;

      switch(mode) {
        case 'hour': {
          requestObj = {
            month: this.$data.date[0].toString(),
            day: this.$data.date[1].toString(),
            hour: this.$data.date[2].toString()
          }
          percent = 0.3
          break;
        }

        case 'date': {
          requestObj = {
            month: this.$data.date[0].toString(),
            day: this.$data.date[1].toString(),
            hour: '25'
          }
          percent = 0.45
          break;
        }

        case 'all': {
          isAll = true;
          percent = 0.65
          break;
        }

        default: return;
      }

      if (document.getElementsByClassName('fly-layer').length != 0) {
        d3.selectAll('.fly-layer').remove()
      }

      this.$data.isLoading = false;

      // this.$http
      //   .get('/flyIntoSky/update?auth=linxu')
      //   .then(res => {
      if (isAll) {
        let flyRes = {
          id: 'map1',
          data: this.fromateFlyData(data),
          percent
        }
        PubSub.publish('renewFlyline', flyRes);
      } else {
        let flyRes = {
          id: 'map1',
          data: this.fromateFlyData(data),
          percent
        }
        PubSub.publish('renewFlyline', flyRes);
      }
        // })
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
    // renewFlyChoice() {
    //   this.$data.flyChoice[0].children = [];
    //   this.$data.flyChoice[1].children = [];
    //   let children1 = [], children2 = [];
    //   let timeArr = []
    //   for (let i = 0; i < 24; i++) {
    //     timeArr.push({
    //       value: i,
    //       label: i
    //     })
    //   }
    //   for (let i = 1; i <= 28; i++) {
    //     children1.push({
    //       label: i,
    //       value: i,
    //       children: timeArr
    //     });
    //     children2.push({
    //       label: i,
    //       value: i,
    //       children: timeArr
    //     });
    //   }
    //   for (let j = 29; j <= 31; j++) {
    //     children2.push({
    //       label: j,
    //       value: j,
    //       children: timeArr
    //     });
    //   }

    //   this.$data.flyChoice[0].children = children1;
    //   this.$data.flyChoice[1].children = children2;
    // },
    switchPanel() {
      this.$store.state.panel.leftSecActive = false;
    },
    getData() {
      let mode = this.$data.mode,
          time = this.$data.date,
          requestObj = null;

      if (mode == 'all') {

        if (this.$store.state.flightPath.map1) {
          if (this.$store.state.flightPath.map1.length) {
            for (let i = 0; i < this.$store.state.flightPath.map1.length; i++) {
              // this.$store.state.maps.map1.remove(this.$store.state.flightPath.map1[i]);
              this.$store.state.flightPath.map1[i].setMap(null);
            }
          }
        }

        if (this.$store.state.flightPath.map2) {
          if (this.$store.state.flightPath.map2.length) {
            for (let i = 0; i < this.$store.state.flightPath.map2.length; i++) {
              // this.$store.state.maps.map2.remove(this.$store.state.flightPath.map1[i]);
              this.$store.state.flightPath.map2[i].setMap(null)
            }
          }
        }




        return ;
      }

      if (!time) {
        return ;
      }

      switch(mode) {
        case 'hour': {
          requestObj = {
            month: this.$data.date[0].toString(),
            day: this.$data.date[1].toString(),
            hour: this.$data.date[2].toString()
          }

          break;
        }

        case 'day': {
          requestObj = {
            month: this.$data.date[0].toString(),
            day: this.$data.date[1].toString(),
          }
          break;
        }

        case 'month': {
          requestObj = {
            month: this.$data.date[0].toString()
          }
          break;
        }

        case 'six': {
          requestObj = {
            month: this.$data.date[0].toString(),
            day: this.$data.date[1].toString(),
            hour: (this.$data.date[2] + 26).toString()
          }
          break;
        }

        default: return;
      }

      if (this.$store.state.flightPath.map1) {
        if (this.$store.state.flightPath.map1.length) {
          for (let i = 0; i < this.$store.state.flightPath.map1.length; i++) {
            // this.$store.state.maps.map1.remove(this.$store.state.flightPath.map1[i]);
            this.$store.state.flightPath.map1[i].setMap(null);
          }
        }
      }

      if (this.$store.state.flightPath.map2) {
        if (this.$store.state.flightPath.map2.length) {
          for (let i = 0; i < this.$store.state.flightPath.map2.length; i++) {
            // this.$store.state.maps.map2.remove(this.$store.state.flightPath.map1[i]);
            this.$store.state.flightPath.map2[i].setMap(null)
          }
        }
      }

    },
    getCircleLatLng(pointList) {
      let returnArr = [];
      for (let i = 0; i < pointList.length; i++) {
        returnArr.push([pointList[i].longitude, pointList[i].latitude]);
      }
      return returnArr;
    },
    getAllCircle(circles) {
      let returnArr = [];
      for (let i = 0; i < circles.length; i++) {
        returnArr.push({
          id: circles[i].id,
          value: circles[i].weight,
          msg: circles[i].msg,
          lnglat: this.getCircleLatLng(circles[i].pointList)
        });
      }
      // console.log(returnArr)
      return returnArr;
    },
    getDoubleData() {
      let mode = this.$data.mode,
          time1 = this.$data.firstDate,
          time2 = this.$data.secondDate,
          requestObjMap1 = null,
          requestObjMap2 = null;

      if (mode == 'all') {
        if (this.$store.state.flightPath.map1) {
          if (this.$store.state.flightPath.map1.length) {
            for (let i = 0; i < this.$store.state.flightPath.map1.length; i++) {
              // this.$store.state.maps.map1.remove(this.$store.state.flightPath.map1[i]);
              this.$store.state.flightPath.map1[i].setMap(null);
            }
          }
        }

        if (this.$store.state.flightPath.map2) {
          if (this.$store.state.flightPath.map2.length) {
            for (let i = 0; i < this.$store.state.flightPath.map2.length; i++) {
              // this.$store.state.maps.map2.remove(this.$store.state.flightPath.map1[i]);
              this.$store.state.flightPath.map2[i].setMap(null)
            }
          }
        }



        this.$data.isLoading = true;

        this.$nextTick(() => {
            this.$http
              .post('/flyIntoSky/queryall')
              .then((res) => {
                let data = res.data;
                let formateData = this.getAllCircle(data.circles);

                let resData = {
                  id: 'map1',
                  data: formateData
                }

                // this.$emit('updateHeatData', formateData);
                PubSub.publish('renewPoly', resData);

                this.$data.isLoading = false;
              })
              .catch((err) => {
                this.$store.state.showRightTip = true;
                this.$store.state.noCloseRight = true;
                this.$store.state.rightTipMes = 'There were some unexpected errors on the page, please send an email to the administrator to maintain the page. mailbox: ' + this.$store.state.mailBox;
              })
            this.$http
              .post('/flyIntoSky/queryall')
              .then((res) => {
                let data = res.data;
                let formateData = this.getAllCircle(data.circles);

                let resData = {
                  id: 'map2',
                  data: formateData
                }

                // this.$emit('updateHeatData', formateData);
                PubSub.publish('renewPoly', resData);

                this.$data.isLoading = false;
              })
              .catch((err) => {
                this.$store.state.showRightTip = true;
                this.$store.state.noCloseRight = true;
                this.$store.state.rightTipMes = 'There were some unexpected errors on the page, please send an email to the administrator to maintain the page. mailbox: ' + this.$store.state.mailBox;
              })
        });
        return ;
      }

      if (!time1 || !time2) {
        return ;
      }

      switch(mode) {
        case 'hour': {
          requestObjMap1 = {
            month: this.$data.firstDate[0].toString(),
            day: this.$data.firstDate[1].toString(),
            hour: this.$data.firstDate[2].toString()
          }
          requestObjMap2 = {
            month: this.$data.secondDate[0].toString(),
            day: this.$data.secondDate[1].toString(),
            hour: this.$data.secondDate[2].toString()
          }
          break;
        }

        case 'date': {
          requestObjMap1 = {
            month: this.$data.firstDate[0].toString(),
            day: this.$data.firstDate[1].toString(),
            hour: '25'
          }
          requestObjMap2 = {
            month: this.$data.secondDate[0].toString(),
            day: this.$data.secondDate[1].toString(),
            hour: '25'
          }
          break;
        }

        case 'day': {
          requestObjMap1 = {
            month: this.$data.firstDate[0].toString(),
            day: this.$data.firstDate[1].toString(),
          }
          requestObjMap2 = {
            month: this.$data.secondDate[0].toString(),
            day: this.$data.secondDate[1].toString(),
          }
          break;
        }

        case 'month': {
          requestObjMap1 = {
            month: this.$data.firstDate[0].toString(),
          }
          requestObjMap2 = {
            month: this.$data.secondDate[0].toString(),
          }
          break;
        }

        case 'six': {
          requestObjMap1 = {
            month: this.$data.firstDate[0].toString(),
            day: this.$data.firstDate[1].toString(),
            hour: (this.$data.firstDate[2] + 26).toString()
          }
          requestObjMap2 = {
            month: this.$data.secondDate[0].toString(),
            day: this.$data.secondDate[1].toString(),
            hour: (this.$data.secondDate[2] + 26).toString()
          }
          break;
        }

        default: return;
      }

      if (this.$store.state.flightPath.map1) {
        if (this.$store.state.flightPath.map1.length) {
          for (let i = 0; i < this.$store.state.flightPath.map1.length; i++) {
            // this.$store.state.maps.map1.remove(this.$store.state.flightPath.map1[i]);
            this.$store.state.flightPath.map1[i].setMap(null);
          }
        }
      }

      if (this.$store.state.flightPath.map2) {
        if (this.$store.state.flightPath.map2.length) {
          for (let i = 0; i < this.$store.state.flightPath.map2.length; i++) {
            // this.$store.state.maps.map2.remove(this.$store.state.flightPath.map1[i]);
            this.$store.state.flightPath.map2[i].setMap(null)
          }
        }
      }

      this.$data.isLoading = true;
      let methods = '';
      if (mode == 'day') {
        methods = 'queryday'
      } else if (mode == 'month') {
        methods = 'querymonth'
      } else if (mode == 'hour') {
        methods = 'circle'
      }

      this.$nextTick(() => {
          this.$http
            .post('/flyIntoSky/' + methods, requestObjMap1)
            .then((res) => {
              let data = res.data;
              let formateData = this.getAllCircle(data.circles);

              let resData = {
                id: 'map1',
                data: formateData
              }

              // this.$emit('updateHeatData', formateData);
              PubSub.publish('renewPoly', resData);

              this.$data.isLoading = false;
            })
            .catch((err) => {
              this.$store.state.showRightTip = true;
              this.$store.state.noCloseRight = true;
              this.$store.state.rightTipMes = 'There were some unexpected errors on the page, please send an email to the administrator to maintain the page. mailbox: ' + this.$store.state.mailBox;
            })
          this.$http
            .post('/flyIntoSky/' + methods, requestObjMap2)
            .then((res) => {
              let data = res.data;
              let formateData = this.getAllCircle(data.circles);

              let resData = {
                id: 'map2',
                data: formateData
              }

              // this.$emit('updateHeatData', formateData);
              PubSub.publish('renewPoly', resData);

              this.$data.isLoading = false;
            })
            .catch((err) => {
              this.$store.state.showRightTip = true;
              this.$store.state.noCloseRight = true;
              this.$store.state.rightTipMes = 'There were some unexpected errors on the page, please send an email to the administrator to maintain the page. mailbox: ' + this.$store.state.mailBox;
            })
      });
    }
  },
  watch: {
    mode(mode) {
      // this.$data.date = null;
      // this.$data.firstDate = null;
      // this.$data.secondDate = null;
      switch(mode) {
        case 'all': {
          this.$data.isShowFlyTimeChoice = false
          break;
        }

        case 'six': {
          this.$data.dateChoice[0].children = [];
          this.$data.dateChoice[1].children = [];
          let children1 = [], children2 = [];
          let timeArr = []
          for (let i = 0; i < 24; i += 4) {
            timeArr.push({
              value: i,
              label: i + '-' + (i + 3)
            })
          }
          for (let i = 1; i <= 28; i++) {
            children1.push({
              label: i,
              value: i,
              children: timeArr
            });
            children2.push({
              label: i,
              value: i,
              children: timeArr
            });
          }
          for (let j = 29; j <= 31; j++) {
            children2.push({
              label: j,
              value: j,
              children: timeArr
            });
          }
          this.$data.isShowFlyTimeChoice = true
          this.$data.dateChoice[0].children = children1;
          this.$data.dateChoice[1].children = children2;
          break;
        }

        case 'day': {
          this.$data.dateChoice[0].children = [];
          this.$data.dateChoice[1].children = [];
          let children1 = [], children2 = [];
          for (let i = 1; i <= 28; i++) {
            children1.push({
              label: i,
              value: i
            });
            children2.push({
              label: i,
              value: i
            });
          }
          for (let j = 29; j <= 31; j++) {
            children2.push({
              label: j,
              value: j
            });
          }
          this.$data.isShowFlyTimeChoice = true
          this.$data.dateChoice[0].children = children1;
          this.$data.dateChoice[1].children = children2;
          break;
        }

        case 'month': {
          this.$data.isShowFlyTimeChoice = true
          this.$data.dateChoice[0].children = null;
          this.$data.dateChoice[1].children = null;
          break;
        }

        case 'hour': {
          this.$data.dateChoice[0].children = [];
          this.$data.dateChoice[1].children = [];
          let children1 = [], children2 = [];
          let timeArr = []
          for (let i = 0; i < 24; i++) {
            timeArr.push({
              value: i,
              label: i
            })
          }
          for (let i = 1; i <= 28; i++) {
            children1.push({
              label: i,
              value: i,
              children: timeArr
            });
            children2.push({
              label: i,
              value: i,
              children: timeArr
            });
          }
          for (let j = 29; j <= 31; j++) {
            children2.push({
              label: j,
              value: j,
              children: timeArr
            });
          }

          this.$data.isShowFlyTimeChoice = true
          this.$data.dateChoice[0].children = children1;
          this.$data.dateChoice[1].children = children2;
          break;
        }
      }
    },
    '$store.state.panel.secPanMode'(newVal) {
      if (newVal == 1) {
        this.$data.mode = 'hour';
      }
    },
    flylineMode(mode) {

      switch(mode) {
        case 'all': {
          this.$data.isShowFlyTimeChoice = false
          break;
        }

        case 'date': {
          this.$data.flyChoice[0].children = [];
          this.$data.flyChoice[1].children = [];
          let children1 = [], children2 = [];
          for (let i = 1; i <= 28; i++) {
            children1.push({
              label: i,
              value: i
            });
            children2.push({
              label: i,
              value: i
            });
          }
          for (let j = 29; j <= 31; j++) {
            children2.push({
              label: j,
              value: j
            });
          }
          this.$data.flyChoice[0].children = children1;
          this.$data.flyChoice[1].children = children2;
          this.$data.isShowFlyTimeChoice = true
          break;
        }

        case 'hour': {
          this.$data.flyChoice[0].children = [];
          this.$data.flyChoice[1].children = [];
          let children1 = [], children2 = [];
          let timeArr = []
          for (let i = 0; i < 24; i++) {
            timeArr.push({
              value: i,
              label: i
            })
          }
          for (let i = 1; i <= 28; i++) {
            children1.push({
              label: i,
              value: i,
              children: timeArr
            });
            children2.push({
              label: i,
              value: i,
              children: timeArr
            });
          }
          for (let j = 29; j <= 31; j++) {
            children2.push({
              label: j,
              value: j,
              children: timeArr
            });
          }

          this.$data.flyChoice[0].children = children1;
          this.$data.flyChoice[1].children = children2;
          this.$data.isShowFlyTimeChoice = true
          break;
        }
      }
    }
  }
}
</script>

<style lang="scss">
%clearFloat::after {
  content: "";
  display: block;
  clear: both;
  visibility: hidden;
}
%center {
  display: flex;
  justify-content: center;
}

.left-second-panel {
  width: 5rem;
  height: 100vh;
  background-color: rgba($color: #373f53, $alpha: .9);
  transition: transform .5s ease;
  transform: translateX(-5.6rem);
  // box-shadow: 0 0 1px 2px #373f53;

  .arrow-container {
    cursor: pointer;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    right: -0.6rem;
    top: 50%;
    transform: translateY(-50%);
    width: 0.6rem;
    height: 1.2rem;
    background-color: rgba($color: #373f53, $alpha: .9);
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;

    img {
      width: 0.24rem;
      height: 0.45rem;
    }
  }

  .attraction-container {
    @extend %clearFloat;

    width: 100%;
    margin-top: 1rem;

    .attract-title {
      margin-bottom: 0.2rem;
      display: block;
      color: #fff;
      font-size: 0.3rem;
    }

    .time-to-map {
      float: left;
      display: block;
      color: #fff;
      margin-top: 0.25rem;
      margin-bottom: 0.25rem;
      font-size: 0.24rem;
      line-height: 0.48rem;
      margin-left: 0.56rem;
    }

    .choice-mode-container {
      @extend %clearFloat;
      @extend %center;

      width: 100%;
      margin-top: 0.4rem;

      >span {
        float: left;
        display: block;
        color: #fff;
        font-size: 0.24rem;
        line-height: 0.48rem;
      }

      .select-mode {
        display: block;
        float: left;
      }

      .el-select {
        width: 2rem;
        margin-left: 0.45rem;
        margin-right: 0.8rem;
        overflow: hidden;
      }
    }

    .choice-time-container {
      @extend %clearFloat;
      @extend %center;

      width: 100%;
      margin-top: 0.4rem;

      >span {
        float: left;
        display: block;
        color: #fff;
        font-size: 0.24rem;
        line-height: 0.48rem;
      }

      .el-cascader {
        margin-left: 0.5rem;
      }
    }

    .button-container {
      @extend %clearFloat;
      @extend %center;

      width: 100%;
      margin-top: 0.4rem;
    }

    .comfirm-search {
      width: 2rem;
      font-size: 0.24rem;
    }
  }
}

.left-second-active {
  transform: translateX(0);
}

// .popper__arrow::after {
//   left: 70px!important;
// }
.popper__arrow {
  left: 70px!important;
}
// .el-cascader {
//   left: 75px!important;
//   width: 2.5rem;
// }
</style>
