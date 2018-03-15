<template>
  <div id="">
    <el-row v-for="(item,index) in skuAssigned.listMap">
      <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checkAll" @change="handleCheckAllChange(item)" :disabled="skuAssigned.inputDisabled" >
        {{item.deptName}}
      </el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group   style="margin-left: 20px;" v-model="item.checkedUsers" @change="handlecheckedperNameChange(item)">
        <el-checkbox v-for="list in item.salesUserList" :label="list.userId" :disabled="skuAssigned.inputDisabled">
          {{list.userName}}
        </el-checkbox>
      </el-checkbox-group>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        skuAssigned:{
          listMap:[],
          inputDisabled:false,
          checkAll: [] ,//全选部门人员
          isIndeterminate:[true,true],
          userGroupList:[['20170728143906766481'],['20170728143906766481','32']], //部门用户组列表(二维数组ID)
          checkedUserGroupList:[], //被选中的部门用户列表(二维数组ID)
          checkedUserList:[],   //最终得到的被选中的用户列表(一维数组ID)
        },
      };
    },
    mounted(){
      this.getchek();
    },
    methods: {
      getchek(){
          let _this=this;
        this.httpPost('product/queryDeptAndUser').then(res=>{
          _this.skuAssigned.listMap = res.data;
          let salesInfo=['23']
          for(let i=0;i<_this.skuAssigned.listMap.length;i++){
            let item=_this.skuAssigned.listMap[i];
            _this.$set(item,"checkedUsers",_this.getCurCheckedUsers(salesInfo,item));
            console.log('_this.skuAssigned.listMap  % 0',_this.skuAssigned.listMap[i] )
            console.log('ght % 0',_this.skuAssigned.listMap[i].checkedUsers);
            _this.$set(item,"checkAll",(_this.skuAssigned.listMap[i].checkedUsers.length>=_this.skuAssigned.listMap[i].salesUserList.length?true:false));
            _this.$set(item,"isIndeterminate",(_this.skuAssigned.listMap[i].checkedUsers.length>0&&_this.skuAssigned.listMap[i].checkedUsers.length<_this.skuAssigned.listMap[i].salesUserList.length?true:false));
            console.log(item.checkedUsers);

          }
        })
      },
      handleCheckAllChange(item) {
        let _this=this;
        let users=[];
        for(let i=0;i<item.salesUserList.length;i++){
          users[i]=item.salesUserList[i].userId;
        }
        item.checkedUsers=[];
        if(item.checkAll){
          item.checkedUsers=users;
        }
        console.log(users);
        console.log(item);

        let checkedUserList=[];
        for(let i=0;i<_this.skuAssigned.listMap.length;i++){
          if(_this.skuAssigned.listMap[i].checkedUsers!==""){
            checkedUserList.push(_this.skuAssigned.listMap[i].checkedUsers);
          }
        }
        console.log("allChecked2:",checkedUserList.join(',').split(','));
      },
      /**
       * 将选中的用户列表进行部门分组
       * @param allCheckedUsers 选中的所有用户列表
       * @param item            当前部门用户信息
       * @returns {Array}       返回当前用户选中的人员ID
       */
      getCurCheckedUsers(allCheckedUsers,item){
        let checkedUsers=[];
        for(let i=0;i<allCheckedUsers.length;i++){
          for(let j=0;j<item.salesUserList.length;j++){
            if(allCheckedUsers[i]===item.salesUserList[j].userId){
              checkedUsers.push(allCheckedUsers[i]);
              break;
            }
          }
        }
        console.log('checkedUsers % 0====',checkedUsers);
        return checkedUsers;
      },
      handlecheckedperNameChange(item) {
        let _this=this;
        let listMapObj=_this.skuAssigned.listMap;
        console.log(listMapObj)
          for(let j=0;j<listMapObj.length;j++){
              let checkedUsersLen=listMapObj[j].checkedUsers.length;//选中长度
              let salesUserListLen=listMapObj[j].salesUserList.length;//原长度
//            alert('选中长度'+checkedUsersLen)
//            alert('原长度'+salesUserListLen)
              _this.$set(listMapObj[j],"checkAll",(checkedUsersLen>=salesUserListLen?true:false));
              _this.$set(listMapObj[j],"isIndeterminate",(checkedUsersLen>0&&checkedUsersLen<salesUserListLen?true:false));
          }
        console.log('listMapObj % 0=====',listMapObj)

      },
    }
  };

</script>

<style scoped>

</style>
