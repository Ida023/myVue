<template>
  <div>
    <el-select  placeholder="请选择" v-model="options" clearable filterable :disabled="dis" >
      <el-option
        v-for="item in transport"
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
    props:['Selected'],
    components: {
      ElCol,
      ElRow},
    data() {
      return {
        transport:[
        ],
        dataModel: [],
        GetDataList:[],
        options:this.Selected.Selected,
        submit: {
          options: []
        },
        dis:this.Selected.dis,
      };
    },
    mounted () {
      this.getList()
    },
    methods: {
        getList:function () {
          this.httpGet('stockProductPlan/getRefTraType').then(res => {
            let GetDataList = res.data;
            setTimeout(()=>{
              this.transport=this.tool.replaceObjKey(GetDataList,'refId','refValue')
            },20)
          });
        },
    },
    watch: {
      'Selected':{
        handler(val){
          this.options=val.Selected;
          this.dis=val.dis;

        },
        deep: true
      },
      'options':{
        handler(val){
          this.$emit('assignment',{
            value: val,
            sign: 'transportType'
          })
        }
      },
    }
  };

</script>

<style scoped>

</style>
