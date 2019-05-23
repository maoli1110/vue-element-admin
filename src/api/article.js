import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/v2/stuffs',
    method: 'get',
    params: query
  })
}

export function patchStuff(id,data) {
  return request({
    url: '/v2/stuffs/'+id,
    method: 'patch',
    data
  })
}

export function fetchDetailList(id) {
  return request({
    url: '/v2/articles/search?id='+id,
    method: 'get'
  })
}


export function stuffBorrowSum(id) {
  return request({
    url: '/v2/articles/sum?id='+id,
    method: 'get'
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
    url: '/v2/articles',
    method: 'post',
    data
  })
}

export function deleteArticle(id) {
  return request({
    url: '/v2/articles/'+id,
    method: 'delete'
  })
}

export function updateArticle(data) {
  return request({
    url: '/v2/article/update',
    method: 'post',
    data
  })
}

export function createStuff(data) {
  return request({
    url: '/v2/stuffs',
    method: 'post',
    data
  })
}

export function srearchStuffByname(id) {
  return request({
    url: '/v2/stuffs/search?id='+id,
    method: 'get'
  })
}


export function InsertArticleBatchSql(data) {
  return request({
    url: '/v2/articles/batch',
    method: 'post',
    data
  })
}

export function InsertStuffBatchSql(data) {
  return request({
    url: '/v2/stuffs/batch',
    method: 'post',
    data
  })
}