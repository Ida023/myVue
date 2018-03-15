<template>
    <div class="selectorCom">
      <el-select v-model="selectVal" filterable clearable :placeholder="placeholder" :multiple="isMultiple" :disabled="disabled" :no-data-text="noData" :type="type" :size="ssize">
        <el-option v-for="item in options" :label="item.spuNo+'-'+item.spuName" :key="item.spuId" :value="item.spuId"></el-option>
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
        data:{
          spuId:'',
          spuNo:'',
          spuName:'',
          spuDesc:'',
          specificationId:'',
          categoryId:'',
          categoryId:[],
          addUser:'',   //
          addTime:'',
          compId:'',
          sequenceNo:'',
          updTime:'',
          updUser:'',
        },
        dataList:{}
      }
    },
    props:['selectValue','placeValue','noDataText','selectType','isDisabled','isMultiple','size','houseValue'],
    mounted(){
        this.getSpuList();
    },
    methods: {
      getSpuList(){
        this.httpGet('productSpu/selectList').then(res =>{
                this.options = res.data;
        })
      },
    },
    watch: {
      'selectVal':{
          handler(val){
            this.getSpuList();
            if(val != ''){
              this.httpGet('productSpu/select?spuId='+val).then(res =>{
                this.dataList = res.data;
                this.$emit('getSpu',{
                  value:val,
                  type:this.selectType,
                  data:this.dataList
                })
              })
            }else{
              this.$emit('getSpu',{
                value:val,
                type:this.selectType,
                data:this.data
              })
            }

          },
        deep:true
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
