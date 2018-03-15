<template>
    <div class="selectorCom">
      <el-select v-model="selectVal" filterable clearable :placeholder="placeholder" :multiple="isMultiple" :disabled="disabled" :no-data-text="noData" :type="type" :size="ssize">
        <el-option v-for="item in options" :label="item.specificationName" :key="item.specificationId" :value="item.specificationId"></el-option>
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
    props:['selectValue','placeValue','noDataText','selectType','isDisabled','isMultiple','size','houseValue'],
    mounted(){
        this.getSpecificationList();
    },
    methods: {
      getSpecificationList(){
        this.httpGet('productSpecification/selectList').then(res =>{
                this.options = res.data;
        })
      },
    },
    watch: {

      'selectVal':{
        handler(val){
              this.$emit('getSpe',{
                  value:val,
                  type:this.selectType,
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
