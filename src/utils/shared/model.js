// 该文件存放所有的model对象
export const colorModel = [
  // '#025FE2',
  '#3794C4',
  '#65ABBC',
  '#A1CDB2',
  '#DDE9A4',
  '#EFBC7A',
  '#F05435',
  '#EE2123'
]

/**
 * @description 得到GeoJSON数据格式的对象
 */
export function getGeoJSON(item) {
  let geoJSON = {
    type: item.type,
    coordinates: null
  }

  geoJSON.coordinates = item.cor;

  return geoJSON;
}

