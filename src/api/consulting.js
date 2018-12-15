import request from '@/utils/request'

//form
export function getFormList(query) {
  return request({
    url: '/form/list',
    method: 'get',
    params: query
  })
}

export function getForm(id) {
  return request({
    url: '/form/detail',
    method: 'get',
    params: { id }
  })
}

export function addForm(data) {
  return request({
    url: '/form/add',
    method: 'post',
    data
  })
}

export function batForm(data) {
  return request({
    url: '/form/bat',
    method: 'post',
    data
  })
}

export function updForm(data) {
  return request({
    url: '/form/upd',
    method: 'post',
    data
  })
}

//filter
export function getFilter(query) {
  return request({
    url: '/form/filter',
    method: 'get',
    params: query
  })
}


//recycle
export function getRecycleList(query) {
  return request({
    url: '/form/recycle/list',
    method: 'get',
    params: query
  })
}

export function getRecycleForm(id) {
  return request({
    url: '/form/recycle/',
    method: 'get',
    params: { id }
  })
}

export function delRecycle(data) {
  return request({
    url: '/form/recycle/del',
    method: 'post',
    data
  })
}

export function reForm(data) {
  return request({
    url: '/form/recycle/re',
    method: 'post',
    data
  })
}

//category

export function getCatList(query) {
  return request({
    url: '/form/cat/list',
    method: 'get',
    params: query
  })
}

export function updCat(data) {
  return request({
    url: '/form/cat/upd',
    method: 'post',
    data
  })
}

export function delCat(data) {
  return request({
    url: '/form/cat/del',
    method: 'post',
    data
  })
}

export function addCat(data) {
  return request({
    url: '/form/cat/add',
    method: 'post',
    data
  })
}



//mail
export function getMailList(query) {
  return request({
    url: '/form/mail/list',
    method: 'get',
    params: query
  })
}

export function updMail(data) {
  return request({
    url: '/form/mail/list',
    method: 'post',
    data
  })
}

export function delMail(data) {
  return request({
    url: '/form/mail/list',
    method: 'post',
    data
  })
}

export function addMail(data) {
  return request({
    url: '/form/mail/add',
    method: 'post',
    data
  })
}
