//test
export const jia2 = ({commit},n) => {
  console.log(n)
    commit('jia',n)
}
export const jian2 = ({commit,state},n) => {
  console.log(state)
    commit('jian')
}

export const getsub = ({commit,state},n) => {
  console.log(state)
  user={
      userId:this.sessuserid,
      menuId:'02'
  }
  $http.post(this.RmsUrl+'/login/getSubMenus', this.qs.stringify(this.user)).then(res => {
    this.msg = res.data;
    console.log('4444',this.msg)
  })
}


//选中arr调用事件
export const getselectedArr = ({commit,state},n) => {
  commit('select',n)
}





