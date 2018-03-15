<template>
  <div>
    <el-select  placeholder="请选择" v-model="options" clearable filterable :disabled="dis">
      <el-option
        v-for="item in msg"
        :key="item.userId"
        :label="item.userName"
        :value="item.userId"
        :disabled="dis"
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
    props:['disState','Selected'],
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
        msg:[],
        options:'',
        dis:false,
      };
    },
    mounted () {
      this.getClassifyList();
    },
    methods: {
      getClassifyList(){
        this.httpPost('productUserGroup/getList?groupName='+'美工人员').then(res => {
          console.log(res)
          this.msg=res.data;
          this.options=this.Selected;
          this.dis = this.disState;
        })
      },
    },
    watch: {
      'options':{
        handler(val){
          this.$emit('assignment',{
            value:val
          })
        }
      },
      'Selected':{
        handler(val){
          this.submit.options = val;
        }
      },
      'disState':{
        handler(val){
          this.dis = val;
        }
      },
    }
  };

</script>

<style scoped>

</style>
