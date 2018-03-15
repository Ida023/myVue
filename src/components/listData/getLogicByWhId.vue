<template>
    <div class="selectorCom">
      <el-select v-model="selectVal" filterable clearable :placeholder="placeholder" :multiple="isMultiple" :disabled="disabled" >
        <el-option v-for="item in modalData" :label="item.cnName" :key="item.methodId" :value="item.methodId"></el-option>
      </el-select>
    </div>
</template>
<script>
  export default{
    data(){
      return {
        selectVal:this.selectValue,
        type:this.selectType,
        modalData:[],
        placeholder:this.placeValue,
        noData:this.noDataText,
        disabled:this.isDisabled,
        multiple:this.isMultiple,
        ssize:this.size,
        id:this.whId,
        number:0,
      }
    },
    props:['whId','selectValue','placeValue','isDisabled','isMultiple','isUse'],
    mounted(){
        this.getData();   // 根据发货仓库获取物流 方式
    },
    methods: {
      getData(){
        this.httpGet('logisticsMethod/selectListByWhId',{whId:this.id},'Sms').then(res =>{
          this.modalData = res.data;
        })
      },
    },
    watch: {
      'selectVal':{
          handler(val){
              this.$emit('getData',{
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
      'isDisabled':{
        handler(val){
          this.disabled = val;
        }
      },
      'isUse':{
        handler(val){
          this.number = 0;
        }
      },
      'whId':{
        handler(val){
          //alert(5254)
          this.number++;
          //alert(this.number);
          this.id = val;
          this.getData();
          if(this.number >1 && this.isUse == true){
            //alert('清空');
            this.selectVal = '';
          }
        },
      },
    }
  }
</script>

<style scoped>
.selectorCom .el-select{
  width:100% !important
}
</style>
