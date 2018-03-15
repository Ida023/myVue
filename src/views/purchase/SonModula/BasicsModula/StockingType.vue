<template>
  <div>
    <el-select  placeholder="备货类型" v-model="options" clearable filterable :disabled="dis" >
      <el-option
        v-for="item in GetDataList"
        :key="item.value"
        :label="item.label"
        :value="item.value"

      >
      </el-option>
    </el-select>
  </div>

</template>

<script>
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  export default {
    name:'SpecialAttributes',
    props:['Selected','scene'],
    components: {
      ElCol,
      ElRow},
    data() {
      return {
        props:{
          value:'userId',
          label:'userName',
        },
        dataModel: [],
        GetDataList:[],
        options:'',
        dis:this.Selected.dis,
        FatherScene:this.scene,
        labelData:''
      };
    },
    mounted () {
      this.getData();
    },
    methods: {
      getData(){
        this.httpGet('stockProductPlan/getStockInfoType','','Scm').then(res => {
          let GetDataList = res.data;
          this.GetDataList=this.tool.replaceObjKey(GetDataList,'refId','refValue')
        })
      },
      deleteData:function () {
        this.options=''
      }

    },
    watch: {
      'Selected':{
        handler(val){
//            alert(11)
          this.options=val.Selected;
          this.dis=val.dis;
//          this.FatherScene=this.Selected.scene;
        },
        deep: true
      },
      'options':{
        handler(val){
            let label;
            for(let i=0; i<this.GetDataList.length; i++){
                if(this.GetDataList[i].value===val){
                  label=this.GetDataList[i].label
                }
            }
          this.$emit('assignment',{
            value: val,
            scene:this.FatherScene,
            sign: 'StockingType',
            label:label
          })
        }
      },
    }
  };

</script>

<style scoped>

</style>
