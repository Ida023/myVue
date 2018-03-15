<template>
    <div class="selectorCom">
        <el-select v-model="selectVal"
                   filterable
                   clearable
                   :placeholder="placeholder"
                   :multiple="isMultiple"
                   :disabled="disabled"
                   :no-data-text="noData"
                   :type="type"
                   :size="ssize"
                   @change="changeValue($event)">
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
        productId:'',
      }
    },
    props:['selectValue','placeValue','noDataText','selectType','optionsData','isDisabled','isMultiple','size'],
    mounted(){
        this.getCountryList();
    },
    methods: {
      changeValue(val){
      	var vm=this;
      	var a='';
         vm.options.forEach(function(item,index,data){
           if(val === item.value){
           	//alert('1111='+data[index].label)
             a = data[index].label;
             vm.$emit('child-list',a);
           }
         });
      },
      getCountryList(){
      	var  orderId='123';
        this.httpPost('partsApply/loadSku?orderId='+orderId).then(res =>{
              this.options =  this.tool.replaceObjKey(res.data,'productId','skuNo');
        })
      },
    },
    watch: {
      'selectVal':{
          handler(val){
              this.$emit('child-change-val',{
                  value:val,
                  type:this.selectType,
                  id:this.productId
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
