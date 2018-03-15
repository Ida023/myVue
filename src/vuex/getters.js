//test
export const getCount = state => {
    return state.count +=100
}
export const menus = state => {
  return state.count +12
}
export const menu = state => {
  return state.menu
}
export const collapsed = state => {
  return state.collapsed
}
const getters = {
  menuss: state => state.menu,
  collapsed: state => state.collapsed,
  menu: state => state.menu,
  subNav: subNav => subNav.subNav,

};
export default getters
