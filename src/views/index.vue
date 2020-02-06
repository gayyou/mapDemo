<template>
  <div class="main" @mousemove="closePanel" @click="renewMousePosi">
    <div class="maps-bottom">
      <AMap
      v-for="item in $store.state.mapList"
      :id="item.id"
      :key="item.id"
      :heatData="heatData"
      :isOpenHeat="isOpenHeat"
      ></AMap>
    </div>
    <leftFirstPanel class="first-panel"></leftFirstPanel>
    <leftSecPanel class="second-panel"
      :heatData="heatData"
      @updateHeatData="updateHeatData"
      @isOpenHeat="updateOpenHeat"
    ></leftSecPanel>
    <div class="mouse-hover-area"

    >
      <div class="left-menu-control"
        @mousemove="openFirstPanel"
      >
        <img src="../assets/icons/arrow_left_large.png" alt="">
      </div>
    </div>
    <layer></layer>
    <rightTip v-if="$store.state.showRightTip"></rightTip>
<!--    <span class="contract-me">Administrator contact email zhangrunpeng1998@gmail.com</span>-->
  </div>
</template>

<script>
import layer from '../components/layer/layer.vue'
import AMap from '../components/map/map.vue'
import leftFirstPanel from '../components/panel/leftFirPanel/leftFirPanel.vue';
import leftSecPanel from '../components/panel/leftSecPanel/leftSecPanel.vue';
import rightTip from '../components/layer/rightTips/rightTips.vue'
// import mapTip from '../components/layer/mapTip/mapTip.vue';

export default {
  components: {
    layer,
    // mapTip,
    AMap,
    leftFirstPanel,
    leftSecPanel,
    rightTip,
  },
  data() {
    return {
      heatData: null,
      isOpenHeat: false,
    }
  },
  mounted() {

  },
  methods: {
    updateHeatData(data) {
      this.$data.heatData = data;
      console.log(data)
    },
    updateOpenHeat(data) {
      this.$data.isOpenHeat = data;
    },
    openFirstPanel(event) {
      event.stopPropagation();
      this.$store.state.panel.leftFirActive = true;
    },
    closePanel(event) {
      this.$store.state.panel.leftFirActive = false;
      // $("#google-map .gm-style-cc").hide();
      // $("#google-map [title='Open this area in Google Maps (opens a new window)']").hide();
    },
    renewMousePosi(event) {
      this.$store.state.mouse.x = event.clientX;
      this.$store.state.mouse.y = event.clientY;
    }
  },
  watch: {
    isOpenHeat(newVal) {
      console.log(newVal)
    }
  }
}
</script>

<style lang="scss">
.contract-me {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 111;
  width: 3rem;
  height: 0.5rem;
  background-color: #fff;
}
.main {
  position: relative;
  overflow: hidden;
}
.maps-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}
.first-panel {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
}
.second-panel {
  position: absolute;
  z-index: 11;
  left: 0;
  top: 0;
}
.mouse-hover-area {
  position: absolute;
  z-index: 9;
  width: 0.5rem;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .left-menu-control {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 0.5rem;
    height: 2rem;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    background-color: rgba(55, 63, 83, 0.9);

    img {
      width: 30px;
      height: 49px;
      margin-right: 10px;
    }
  }
}
</style>
