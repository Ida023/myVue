<template>
  <div class="selectorCom">
    <el-select v-model="selectVal" filterable clearable :placeholder="placeholder" :multiple="isMultiple" :disabled="disabled" :no-data-text="noData" :type="type" :size="ssize">
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
        noData:this.noDataText,
        disabled:this.isDisabled,
        multiple:this.isMultiple,
        ssize:this.size
      }
    },
    props:['selectValue','placeValue','noDataText','selectType','optionsData','isDisabled','isMultiple','size','houseValue'],
    mounted(){
      this.getData();// 获取所有的物流类型
    },
    methods: {
      getData(){
        this.httpGet('refLogisticsType/selectList').then(res =>{
            this.options = res.data;
        })
      },
    },
    watch: {
      'selectVal':{
        handler(val){
            let hasAPI = '';
          this.options.forEach(function(item){
              if(val == item.refId){
                hasAPI = item.hasAPI;
              }
          })
          this.$emit('getLogis',{
            value:val,
            type:this.selectType,
            hasAPI:hasAPI,
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
