<template>
  <div >
    <el-select v-model="selectVal" filterable clearable :placeholder="placeholder" :multiple="isMultiple" :disabled="disabled" :no-data-text="noData" :type="type" :size="ssize">
      <el-option v-for="item in options" :label="item.label" :key="item.value" :value="item.value"></el-option>
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
        noData:this.noDataText,
        disabled:this.isDisabled,
        multiple:this.isMultiple,
        ssize:this.size,
      }
    },
    props:['selectValue','placeValue','noDataText','selectType','optionsData','isDisabled','isMultiple','size'],
    mounted(){
      this.getWarehouseList();
    },
    methods: {
      getWarehouseList(){
        this.httpGet('partsApply/queryApplyUser').then(res => {
          console.log(res.data)
          this.options = this.tool.replaceObjKey(res.data,'userId','userName');
        })
      },
    },
    watch: {
      'placeValue':{
        handler(val){
          this.placeholder = val;
        }
      },
      'selectVal':{
        handler(val){
          this.$emit('child-change-val',{
            value:val,
            type:this.selectType
          })
        },
        deep: true

      },
      'selectValue':{
        handler(val){
          this.selectVal = val;
        },
        deep: true

      },
      'isMultiple':{
        handler(val){
          this.multiple = val;
        },
        deep: true

      },
      'size':{
        handler(val){
          this.ssize = val;
        },
        deep: true

      },
      'optionsData':{
        handler(val){
          this.options = val;
        },
        deep: true

      },
      'isDisabled':{
        handler(val){
          this.disabled = val;
        },
        deep: true

      },
    }
  }
</script>

<style scoped>
  .selectorCom .el-select{
    width:100% !important
  }
</style>
