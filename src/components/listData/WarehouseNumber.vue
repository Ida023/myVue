<template>
  <div>
    <el-select  placeholder="库位号" v-model="options" clearable filterable :disabled="dis" >
      <el-option
        v-for="item in GetDataList"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>
<script>
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  export default {
    name:'WarehouseNumber',
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
        options:this.Selected.Selected,
        submit: {
          options: []
        },
        dis:this.Selected.dis,
        deptId:this.Selected.deptId,
      };
    },
    mounted () {
    },
    methods: {
      getData(val){
        this.httpGet('stockProductPlan/selectAccountNo?deptId='+val,'','Scm').then(res => {
          let GetDataList = res.data;
          this.GetDataList=this.tool.replaceObjKey(GetDataList,'accId','accNo')
        })
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
            scene:this.Selected.scene,
            sign: 'accounts'
          })
        }
      },
    }
  };

</script>

<style scoped>

</style>
