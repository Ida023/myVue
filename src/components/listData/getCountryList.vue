<template>
    <div class="selectorCom">
      <el-select v-model="selectVal" filterable clearable :placeholder="placeholder" :multiple="isMultiple" :disabled="disabled" :no-data-text="noData" :type="type" :size="ssize">
        <el-option v-for="item in options" :label="item.cnName" :key="item.countryNo" :value="item.countryNo"></el-option>
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
        valName:'',
      }
    },
    props:['selectValue','placeValue','noDataText','selectType','optionsData','isDisabled','isMultiple','size'],
    mounted(){
        this.getCountryList();
    },
    methods: {
      getCountryList(){
        this.httpPost('addresser/selectCountry').then(res =>{
          if(res.data.result == true){
              this.options = res.data.params.list;
          }
        })
      },
    },
    watch: {
      'selectVal':{
          handler(val){
          	  var aa=this.options.map(item=>item.countryNo);
              for(var i=0;i<this.options.length;i++){
                 if(val.indexOf(aa[i]) > -1){
                    this.valName=this.options[i].cnName;
                 }
              }
              this.$emit('child-change-val',{
                  value:val,
                  cnname:this.valName,
                  type:this.selectType
              })
          },
        deep: true,
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
