export default function (type) {
  return ({ dispatch }, ...args) => dispatch(type, ...args)
}
