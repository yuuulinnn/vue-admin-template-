import request from '@/utils/request'


export function fetchCategory(query) {
  return request({
    url: '/consulting/category',
    method: 'get',
    params: query
  })
}

export function fetchList(query) {
  return request({
    url: '/consulting/list',
    method: 'get',
    params: query
  })
}




export function fetchArticle(id) {
  return request({
    url: '/consulting/edit',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateConsulting(data) {
  return request({
    url: '/consulting/update',
    method: 'post',
    data
  })
}

export function forwardingList(query) {
  return request({
    url: '/consulting/forwading/list',
    method: 'get',
    params: query
  })
}

export function forwardingUpdate(data) {
  return request({
    url: '/consulting/forwading/update',
    method: 'post',
    data
  })
}

export function forwardingDelete(data) {
  return request({
    url: '/consulting/forwading/delete',
    method: 'post',
    data
  })
}

export function forwardingAdd(data) {
  return request({
    url: '/consulting/forwading/add',
    method: 'post',
    data
  })
}
