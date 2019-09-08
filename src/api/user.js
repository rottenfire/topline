import request from '@/utils/request'

export const blackLists = id => {
  return request.post('/app/v1_0/user/blacklists', {
    target: id
  })
}
