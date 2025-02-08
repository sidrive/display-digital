import request from '@/utils/request'

export function listShalat(param) {
  console.log('error', param)
  // 1501 city id Bantul
  return request({
    url: '/sholat/jadwal/1501/' + param,
    method: 'get',
    param,
  })
}

export function searchCity(param) {
  console.log('error', param)
  return request({
    url: '/sholat/kota/cari/bantul',
    method: 'get',
    param,
  })
}
