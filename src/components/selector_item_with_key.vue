<template>
    <div class="selectorCom">
      <el-select v-model="selectVal" filterable clearable :placeholder="placeholder" :multiple="isMultiple" :disabled="disabled" :no-data-text="noData" :type="type" :size="ssize">
        <el-option v-for="item in options" :label="item.label" :key="item.value" :value="item.value"></el-option>
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
        type:this.selectType,
        options: this.optionsData,
        placeholder:this.placeValue,
        noData:this.noDataText,
        disabled:this.isDisabled,
        multiple:this.isMultiple,
        ssize:this.size
      }
    },
    props:['selectValue','placeValue','noDataText','selectType','optionsData','isDisabled','isMultiple','size','isInfo'],
    methods: {

    },
    watch: {
      'selectVal':{
          handler(val){
              this.$emit('child-change-Val',{
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
      'optionsData':{
          handler(val){
              this.options = val;
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
