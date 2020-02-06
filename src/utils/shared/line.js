/**
 * @description 属性向model.ts里面寻找
 * @param {class option} FlyLineOption 
 */
export function getFlyLine(FlyLineOption) {
  return [
    {
      name: FlyLineOption.name,
      coordinateSystem: "amap",
      type: "lines",
      zlevel: 1,
      effect: {
        show: true,
        period: 6,
        trailLength: 0.7,
        color: "#fff",
        symbolSize: 3
      },
      lineStyle: {
        normal: {
          color: FlyLineOption.lineColor,
          width: 0,
          curveness: 0.2
        }
      },
      data: [
        {
          fromName: FlyLineOption.fromName,
          toName: FlyLineOption.toName,
          coords: [FlyLineOption.fromLngLat, FlyLineOption.toLngLat],
          value: FlyLineOption.value
        }
      ]
    },
    {
      name: FlyLineOption.name,
      coordinateSystem: "amap",
      type: "lines",
      zlevel: 2,
      symbol: ["none", "arrow"],
      symbolSize: 10,
      lineStyle: {
        normal: {
          color: FlyLineOption.lineColor,
          width: 1,
          opacity: 0.6,
          curveness: 0.2
        }
      },
      data: [
        {
          fromName: FlyLineOption.fromName,
          toName: FlyLineOption.toName,
          coords: [FlyLineOption.fromLngLat, FlyLineOption.toLngLat],
          value: FlyLineOption.value
        }
      ]
    },
    {
      name: FlyLineOption.name,
      type: "effectScatter",
      coordinateSystem: "amap",
      zlevel: 2,
      rippleEffect: {
        brushType: "stroke"
      },
      label: {
        normal: {
          show: true,
          position: "bottom",
          formatter: "{b}"
        }
      },
      itemStyle: {
        normal: {
          color: FlyLineOption.symbolColor
        }
      },
      data: [
        {
          name: FlyLineOption.toName,
          value: [...FlyLineOption.toLngLat, FlyLineOption.value]
        }
      ]
    }
  ]
}