export default function (resource, startType, successType, errorType) {
  return ({ dispatch }, ...args) => {
    dispatch(startType)
    return resource(...args)
      .then(response => dispatch(successType, response, ...args))
      .catch(response => {
        dispatch(errorType, response, ...args)
        return Promise.reject()
      })
  }
}
