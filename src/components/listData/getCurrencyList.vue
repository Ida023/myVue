<template>
    <div class="selectorCom">
      <el-select v-model="selectVal" filterable  :placeholder="placeholder" :multiple="isMultiple" :disabled="disabled" :no-data-text="noData" :type="type">
        <el-option v-for="item in options" :label="item.currencyName" :key="item.currencyId" :value="item.currencyId"></el-option>
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
      }
    },
    props:['selectValue','placeValue','noDataText','selectType','optionsData','isDisabled','isMultiple'],
    mounted(){
        this.getCurrencyList();
    },
    methods: {
      getCurrencyList(){
        this.httpGet('/samplesProcurement/selectCurrencyList').then(res => {
          this.options = res.data.params.dictCurrencyInfo;
        })
      },
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
