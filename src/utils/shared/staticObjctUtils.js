// 莫尔卡投影（世界地图的投影),并调用路径生成器，加入投影函数，生成路径工具，这个工具负责产生path的D属性。
const d3 = window.d3;

export function pathUtil() {
  let width = window.innerWidth;
  let height = window.innerHeight;
  return window.d3.geoPath().projection(d3.geoMercator().center([113.5, 23.33]).scale(850) //放大尺寸
    .translate([width / 2, height / 2]));
}