<template>
  <div>
    <el-select  placeholder="请选择" v-model="options" clearable filterable :disabled="dis" >
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
    props:['Selected'],
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
      };
    },
    mounted () {
      this.getData();
    },
    methods: {
      getData(){
//        this.httpGet('stockProductPlan/getStockType','','Scm').then(res => {
        this.$http.get('static/select.json').then(res => {
//          console.log(res)
          let GetDataList = res.data.select;
          this.GetDataList=this.tool.replaceObjKey(GetDataList,'shabiId','shabiName')
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
            sign: 'department'
          })
        }
      },
    }
  };

</script>

<style scoped>

</style>
