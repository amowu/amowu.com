const getAuthHeader = function () {
  return {
    'Authorization': `Bearer ${localStorage.getItem('id_token')}`
  }
}

export { getAuthHeader }
