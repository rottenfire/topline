import request from '@/utils/request'

export const suggestionSearch = q => {
  return request.get('/app/v1_0/suggestion', {
    params: {
      q
    }
  })
}
