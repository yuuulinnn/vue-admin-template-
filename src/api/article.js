import request from '@/utils/request'

//form
export function getArticleList(query) {
  return request({
    url: '/article/lists',
    method: 'get',
    params: query
  })
}

export function getArticleDetail(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}



export function batchArticle(data) {
  return request({
    url: '/article/bat',
    method: 'post',
    data
  })
}

export function updArticle(data) {
  return request({
    url: '/article/upd',
    method: 'post',
    data
  })
}





//category

export function getCategoryList(query) {
  return request({
    url: '/article/cat_lists',
    method: 'get',
    params: query
  })
}

export function updataCategory(data) {
  return request({
    url: '/article/cat_upd',
    method: 'post',
    data
  })
}

export function deleteCategory(data) {
  return request({
    url: '/article/cat_del',
    method: 'post',
    data
  })
}


