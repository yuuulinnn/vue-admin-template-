import request from '@/utils/request'

//form
export function getFileList(query) {
  return request({
    url: '/files/lists',
    method: 'get',
    params: query
  })
}

export function updFile(data) {
  return request({
    url: '/files/upd',
    method: 'post',
    data
  })
}

export function delFile(data) {
  return request({
    url: '/files/del',
    method: 'post',
    data
  })
}




