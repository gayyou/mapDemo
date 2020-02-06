import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/**
 * @rule 使用的时候，要用一个属性分开，比如我这个store是login的account，那么路径是login.account
 */
export default new Vuex.Store({
  state: {
    mailBox: 'zhangrunpeng1998@gmail.com',
    showMessage: false,
    message: '',
    confirmMes: '',
    rightTipMes: '',
    showRightTip: false,
    showConfirm: false,
    showCharts: false,
    showVideo: false,
    showReadme: false,
    noCloseRight: false,
    // 下面是左边侧栏的显示与否控制
    panel: {
      leftFirActive: false,
      leftSecActive: false,
      secPanMode: 0   // 0是区域热度模式，1是出租车流动模式，2是查看区别模式
    },
    isContract: false,
    // 下面是排行榜的单位控制
    rankSample: {
      map1: {
        rankUnit: 0,
        flyRankUnit: 0
      },
      map2: {
        rankUnit: 0
      },
    },
    echarts: {
      map1: {
        mycharts: null,
        layer: null
      },
      map2: {
        mycharts: null,
        layer: null
      }
    },
    // 以下是地图存储
    mapList: [
      {
        id: 'map1'
      }
    ],
    maps: {
      map1: null,
      map2: null
    },
    flightPath: {
      map1: null,
      map2: null
    },
    tips: [],
    mouse: {
      x: 0,
      y: 0
    }
  },
  mutations: {

  },
  actions: {

  }
})
