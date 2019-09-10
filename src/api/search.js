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

export const searchResult = ({ q, page, perPage }) => {
  return request.get('/app/v1_0/search', {
    params: {
      page,
      per_page: perPage,
      q
    }
  })
}
