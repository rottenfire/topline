import request from '@/utils/request'

export const suggestionSearch = q => {
  return request.get('/app/v1_0/suggestion', {
    params: {
      q
    }
  })
}

export const getHistory = () => {
  return request.get('/app/v1_0/search/histories')
}
