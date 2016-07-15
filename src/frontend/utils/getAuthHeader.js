export default function () {
  return {
    'Authorization': `Bearer ${localStorage.getItem('id_token')}`
  }
}
