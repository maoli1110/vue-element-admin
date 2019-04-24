import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/v2/articles',
    method: 'get',
    params: query
  })
}
