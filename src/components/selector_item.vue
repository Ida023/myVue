<template>
    <div class="selectorCom">
      <el-select v-model="selectVal" filterable clearable :placeholder="placeholder" :disabled="disabled" :no-data-text="noData" :size="ssize">
        <el-option v-for="item in options" :label="item" :key="item" :value="item"></el-option>
      </el-select>
    </div>
</template>
<script>
  import ElButton from "../../node_modules/element-ui/packages/button/src/button";
  export default{
    components: {ElButton},
    data(){
      return {
        selectVal:this.selectValue,
        options:this.optionData,
        placeholder:this.placeValue,
        noData:this.noDataText,
        disabled:this.isDisabled,
        ssize:this.size
      }
    },
    props:['selectValue','optionData','placeValue','isDisabled','noDataText','size'],
    methods: {

    },
    watch: {
      'selectVal':{
          handler(val){
              this.$emit('on-child-change-Val',{
                  value:val
              })
          }
      },
      'optionData':{
          handler(val){
              this.options = val;
          }
      },
      'selectValue':{
          handler(val){
              this.selectVal = val;
          }
      },
      'isDisabled':{
          handler(val){
              this.disabled = val;
          }
      },
      'size':{
        handler(val){
          this.ssize = val;
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
