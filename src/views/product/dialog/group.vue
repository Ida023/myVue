<template>
  <div id="">
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
      <el-checkbox v-for="city in cities" :label="city.userId" :key="city.userId">{{city.userName}}</el-checkbox>
      <!--<el-checkbox v-for="city in cities" :label="city" :key="city"></el-checkbox>-->
    </el-checkbox-group>
  </div>
</template>

<script>
  export default {
    props:['cityOptions','Selected','index'],
    data() {
      return {
//        checkAll: [true,true,true],
        checkAll: true,
        checkedCities:[],
        cities: [],
        isIndeterminate: true,
        fatherData:[],
        cityOptions:''
      };
    },
    methods: {
      handleCheckAllChange(event) {
          let _this=this;
        console.log(7778)
        let val=this.cities;
        let cities=[];
        for (let i=0; i<val.length; i++){
          let value=val[i].userId;
          cities.push(value)
        }
//        alert(cities)
//        for(let i=0; i<this.checkedCities.length; i++){
////          this.checkedCities[i]=cities;
//          _this.checkedCities[i] = event.target.checked ? cities : [];
//        }

        console.log(799998)
        this.checkedCities = event.target.checked ? cities : [];
        this.isIndeterminate = false;
        console.log(this.checkedCities)
//        this.$emit('che',{index:this.index,value:this.checkedCities})
      },

      handleCheckedCitiesChange(value) {
        this.$emit('che',{index:this.index,value:this.checkedCities})
//        alert(this.checkedCities)
      },
      clData(){
        let val=this.cityOptions.salesUserList;
        for(let i=0; i<val.length; i++){
          console.log(val[i].userName)
          let values= val[i];
          this.cities.push(values);
          console.log(this.cities)
          console.log('数据处理')
        }
      }
    },
    mounted(){
//      this.getList()
      console.log(this.cityOptions)
      console.log('进入页面值')
//      console.log(this.cities)
      this.clData()
      this.checkedCities=this.Selected;
    },
    watch: {
//      'fatherData':{
//        handler(val){
//          this.$emit('che',{
//            value:val
//          })
//        }
//      },
      'cityOptions':{
        handler(val){
          console.log(val)
          console.log('全选子组件')
        },
        deep: true
      },
    }
  }

</script>

<style scoped>

</style>
