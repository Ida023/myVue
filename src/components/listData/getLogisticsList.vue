<template>
    <div class="selectorCom">
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
        ssize:this.size
      }
    },
    props:['selectValue','placeValue','noDataText','selectType','optionsData','isDisabled','isMultiple','size','houseValue'],
    mounted(){
        this.getCountryList();
    },
    methods: {
      getCountryList(){
        this.httpPost('partsApply/loadLogistics?whId='+this.houseValue,).then(res =>{
              this.options = this.tool.replaceObjKey(res.data,'methodId','whLogisticsCnName');
             console.log('this.options % 0==',this.options)
        })
      },
    },
    watch: {

      'selectVal':{
          handler(val){
              this.$emit('child-change-val',{
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
