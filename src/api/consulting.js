import request from '@/utils/request'

//form
export function getFormList(query) {
  return request({
    url: '/form/lists',
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





//category

export function getCatList(query) {
  return request({
    url: '/form/cat/lists',
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
    url: '/form/mail/lists',
    method: 'get',
    params: query
  })
}

export function updMail(data) {
  return request({
    url: '/form/mail/upd',
    method: 'post',
    data
  })
}

export function delMail(data) {
  return request({
    url: '/form/mail/del',
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
