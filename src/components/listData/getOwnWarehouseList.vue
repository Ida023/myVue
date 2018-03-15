<template>
    <div >
      <el-select v-model="selectVal" filterable  :placeholder="placeholder" :multiple="isMultiple" :disabled="disabled" :no-data-text="noData" :type="type" :size="ssize">
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
        defaultValue:'',
      }
    },
    props:['selectValue','placeValue','noDataText','selectType','optionsData','isDisabled','isMultiple','size','default'],
    mounted(){
        this.getWarehouseList();
    },
    methods: {
      getWarehouseList(){
        this.httpGet('productPurchase/getSelfOperatedWarehouse').then(res => {
          this.options = this.tool.replaceObjKey(res.data,'whId','whName');
          this.$emit('child-change',this.options);
          console.log('this.options % 0===',this.options)
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
          }
      },
      'default':{
        handler(val){
          this.defaultValue = val;
        }
      },
      'selectValue':{
          handler(val){
          	//alert(777)
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
