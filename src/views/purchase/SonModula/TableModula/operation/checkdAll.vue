<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div v-for="(city,index) in cityOptions" :key="index" style="margin-top:40px;" :class="'class-'+index">
      <el-checkbox v-model="checkAll[index]" :id="index" @change="handleCheckAllChange($event,index)">{{city.name}}</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange(index)" :id="index">
        <el-checkbox v-for="(item,iIndex) in city.cityList" :label="item.id" :key="item.id" :value="item.id">{{item.city}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        checkAll: [],
        checkedCities: [11,22,33],
        cityOptions:[{
          name:"城市1",
          cityList:[{
            city:"上海1",
            id:11
          },{
            city:"北京1",
            id:22
          }]
        },{
          name:"城市2",
          cityList:[{
            city:"上海2",
            id:33
          },{
            city:"北京2",
            id:44
          }]
        }
        ],
      }
    },
    computed:{
    },
    mounted () {
      var arrItem = [],a='',vm=this;
      for(var i=0;i<this.cityOptions.length;i++){
        this.checkAll.push(false);
        arrItem = this.cityOptions[i].cityList.map(item =>item.id);
        vm.isChecked(arrItem,i);
      }
    },
    methods: {
      isChecked:function(arr,i){
        var vm = this,a='';
        a = arr.every(function(item){
          return vm.checkedCities.indexOf(item) != -1;
        });
        this.checkAll.splice(i,1,a);
      } ,
      handleCheckAllChange(event,index) {
        var checkedItem = this.cityOptions[index].cityList.map(item =>item.id),vm=this;
        for(var i=0,len=checkedItem.length;i<len;i++){
          if(event.target.checked == false){
            for(var j=0;j<this.checkedCities.length;j++){
              if(this.checkedCities[j] == (checkedItem[i]))
                this.checkedCities.splice(j,1);
            }
          }else{
            if(this.checkedCities.indexOf(checkedItem[i]) == -1)
              this.checkedCities.push(checkedItem[i]);
          }
        }
      },
      handleCheckedCitiesChange(index) {
        var indexArr = this.cityOptions[index].cityList.map(item =>item.id) ;
        this.isChecked(indexArr,index);
      },
    }
  }
</script>
