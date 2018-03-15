<template>
    <div class="selectorCom">
      <el-select v-model="selectVal" filterable clearable :placeholder="placeholder" :multiple="isMultiple" :disabled="disabled" :type="type" :size="ssize">
        <el-option v-for="item in options" :label="item.refValue" :key="item.refId" :value="item.refId"></el-option>
      </el-select>
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
        multiple:this.isMultiple,
        ssize:this.size
      }
    },
    props:['selectValue','placeValue','selectType','isDisabled','isMultiple','size'],
    mounted(){
        this.getTransList();
    },
    methods: {
      getTransList(){
        this.httpPost('reftransporttype/allList').then(res =>{
          if(res.data.result == true){
              this.options = res.data.params.list;
          }
        })
      },
    },
    watch: {
      'selectVal':{
          handler(val){
              this.$emit('getTrans',{
                  value:val,
                  type:this.selectType
              })
          }
      },
      'selectValue':{
          handler(val){
              this.selectVal = val;
          }
      },
      'isMultiple':{
          handler(val){
              this.multiple = val;
          }
      },
      'size':{
          handler(val){
              this.ssize = val;
          }
      },
      'isDisabled':{
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
