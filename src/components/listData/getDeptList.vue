<template>
    <div class="selectorCom">
      <el-cascader v-model="selectVal" @change="dataName" :before-filter="dataName" :disabled="isDisabled" :options="options" :type="type" :props="props" :placeholder="placeholder" :change-on-select="true" :show-all-levels="false" clearable filterable></el-cascader>
    </div>
</template>
<script>
  export default{
    data(){
      return {
        selectVal:this.selectValue,
        type:this.selectType,
        options:[],
        placeholder:this.placeValue,
        disabled:this.isDisabled,
        props:{value:'deptId',label:'deptName',children:'sysDeptDataList',},
        thisscene:this.scene,
      }
    },
    props:['selectValue','placeValue','selectType','optionsData','isDisabled','isMultiple','scene', 'Selected'],
    mounted(){
        this.getDepList();

    },
    methods: {
      getDepList:function(){
        this.httpPost('deptManager/selectDeptList',{isUse:'1'}).then(res =>{
          if(res.data.result == true){
            var data = res.data.params.deptList;
            var diGui = function(arr) {
              arr.forEach(function(item,index){
                if(item.sysDeptDataList.length < 1){
                  delete item.sysDeptDataList;
                }else{
                  diGui(item.sysDeptDataList);
                }
              })
            };
            diGui(data);
            this.options = data;
          }
        })
      },
      emptyFns:function () {
        this.selectVal=[];
      },
      SelectedData:function (val) {
        this.selectVal=val
        console.log(this.selectVal)
      }
    },
    watch: {
      'selectVal':{
          handler(val){
              this.$emit('child-change-Val',{
                  value:val[val.length-1],
                  type:this.selectType,
                  sign: 'getDeptList',
                  scene:this.thisscene,
              })
          },
        deep:true,
        immediate: true
      },
      'selectValue':{
          handler(val){
//              console.log(val)
              this.selectVal = val;
          },
        immediate: true
      },
      'isMultiple':{
          handler(val){
              this.multiple = val;
          }
      },
      'optionsData':{
          handler(val){
              this.options = val;
          }
      },
      'aa':{
        handler(val){
          this.disabled = val;
        }
      },
    }
  }
</script>

<style scoped>
.selectorCom .el-select{
  width:100% !important
}
</style>
