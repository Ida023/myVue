<template>
  <div id="" class="grounpTree">
    <span  style="display:inline-block;text-align: left;width:145px;padding-left: 10px;">功能模块</span>
    <span  style="display:inline-block;text-align: left;width:145px">页面权限</span>
    <span style="display:inline-block;text-align: left;width:145px">功能权限</span>
    <el-col :span="24">
      <el-tree style="border: 0;"
               :data="data2"
               :default-expanded-keys="[2, 3]"
               :default-checked-keys="[5]"
               show-checkbox
               default-expand-all="false"
               node-key="id"
               ref="tree"
               highlight-current
               :props="defaultProps">
      </el-tree>
    </el-col>
    <!-- <el-col :span="8">功能模块</el-col>
     <el-col :span="8">页面权限</el-col>
     <el-col :span="8">功能权限</el-col>
     <el-row v-for="(item1,index) in groupList" class="Onegroup" >
         <el-row v-for="item2 in item1.groupList">
           &lt;!&ndash;<el-row v-for="item3 in item2.groupList">&ndash;&gt;
           <el-col :span="24"   >
             <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" @click.native="ckickFn(item1.list1)">
               <el-checkbox  :label="item1.list1" >{{item1.list1}}</el-checkbox>
             </el-checkbox-group>
           </el-col>
           <el-col :span="8"  v-for="item2 in item1.groupList" class="grounpWidth">
             <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" @click.native="ckickFn(item2.list1)">
               <el-checkbox   :label="item2.list1">{{item2.list1}}</el-checkbox>
             </el-checkbox-group>
           </el-col>
           <el-col :span="8"   class="grounpWidth2">
             <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" v-for="item3 in item2.groupList" @click.native="ckickFn(item3.list1)">
               <el-checkbox   :label="item3.list1">{{item3.list1}}
                 <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" v-for="item4 in item3.groupList" @click.native="ckickFn(item4.list1)">
                   <el-checkbox   :label="item4.list1">{{item4.list1}}</el-checkbox>
                 </el-checkbox-group>
               </el-checkbox>
             </el-checkbox-group>
           </el-col>
           &lt;!&ndash;</el-row>&ndash;&gt;
         </el-row>
       </el-row>-->
  </div>
</template>

<script>
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  export default{
    components: {
      ElCol,
      ElRow},
    data(){
      return {
        data2: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        AddRemarksDal:{//备注
          Dal:false,
          Dis:false,
          modal:true,
          AddRemarksDate:{
            data1:'',
            data2:'',
            data3:'',
          },
          activeName: 'second'
        },
        checkedCities:[],
        groupData:'',
        groupList:[
          {
            list1:'选项1',
            state:false,
            groupList:[
              {
                list1:'选项1-1',
                state:false,
                groupList:[
                  {
                    list1:'选项1-1-1',
                    state:false,
                    groupList:[

                    ]
                  },

                ]
              },
              {
                list1:'选项1-2',
                state:false,
                groupList:[
                  {
                    list1:'选项1-2-1',
                    state:false,
                    groupList:[

                    ]
                  },

                ]
              },
            ]
          },
          {
            list1:'选项2',
            state:false,
            groupList:[
              {
                list1:'选项2-2',
                state:false,
                groupList:[
                  {
                    list1:'选项2-2-2',
                    state:false,
                  },
                  {
                    list1:'选项2-2-333',
                    state:false,
                    groupList:[
                      {
                        list1:'选项2-2-444',
                        state:false,
                        groupList:[

                        ]
                      },
                    ]
                  },
                ]
              }
            ]
          }
        ],
        /*groupList:[
         {
         list1:'选项1',
         state:false,
         groupList:[
         {
         list1:'选项1-1',
         state:false,
         groupList:[
         {
         list1:'选项1-1-1',
         state:false,
         groupList:[

         ]
         },

         ]
         },
         {
         list1:'选项1-2',
         state:false,
         groupList:[
         {
         list1:'选项1-2-1',
         state:false,
         groupList:[

         ]
         },

         ]
         }
         ]
         },

         ],*/
        arr:[],
      }
    },
    watch:{
      'ScreenData':{
        handler(val){

        },
        deep: true,
        immediate: true
      },
    },
    mounted (){

    },
    methods:{
      getCheckedNodes() {
        console.log(this.$refs.tree.getCheckedNodes());
      },
      getCheckedKeys() {
        console.log(this.$refs.tree.getCheckedKeys());
      },
      setCheckedNodes() {
        this.$refs.tree.setCheckedNodes([{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 9,
          label: '三级 1-1-1'
        }]);
      },
      setCheckedKeys() {
        this.$refs.tree.setCheckedKeys([3]);
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
      },
      Initialization:function (val) {
        this.AddRemarksDal.Dal=val.Dal;
        this.AddRemarksDal.modal=val.modal;
      },
      closeData:function () {
        this.checkedCities=[];
      },
      ckickFn:function (val) {
        this.groupData=val;
      },
      handleCheckedCitiesChange:function (value) {
        this.setGroupFn(this.groupList,this.groupData)
      },
      setGroupFn:function (List,thisGroup) {
        let arr = [];
        for (let i in List) {
          if (List[i].list1 === thisGroup) {
            this.arr=[];//清空当前集合临时选中值
            if(List[i].state===true){
              List[i].state=false;
            }else {
              List[i].state=true;
            }
//            this.setGroupFn2(List[i], List[i].state)
//            alert(List[i].state)
            this.setGroupFn3(List[i], List[i].state)
            break;
          } else {
            this.setGroupFn(List[i].groupList, thisGroup);
          }
        }
        return arr;
      },
      setGroupFn3:function (List,state) {
        console.log(List)
        if(List.groupList){
          for(let i in List.groupList){
            this.arr.push(List.groupList[i].list1);//临时 存放 子树，的list1
            if(state===true){
              console.log('true-arr',this.arr)
              List.groupList[i].state=true;//
              this.checkedCities.push(List.groupList[i].list1);
              this.checkedCities=this.repeat(this.checkedCities)
              if(List.groupList[i].groupList){
                this.setGroupFn3(List.groupList[i],state);
              }
            }else {
              console.log('arr',this.arr)
              console.log('this',this.checkedCities)
              List.groupList[i].state=false;
              for (let v of this.arr) {
                if(this.checkedCities.indexOf(v)!== -1){
                  this.checkedCities.splice(this.checkedCities.indexOf(v), 1)
                }
              }
              console.log('end',this.checkedCities)
              this.setGroupFn3(List.groupList[i],state);
            }
          }
        }
        console.log('最后的',this.checkedCities)
        console.log('最后的1',List)
      },
      repeat:function (list) {
        list.sort(); //先排序
        let res = [list[0]];
        for(let i = 1; i < list.length; i++){
          if(list[i] !== res[res.length - 1]){
            res.push(list[i]);
          }
        }
        return res;
      },

    }
  }

</script>

<style scoped>
  .el-tree-node__content{
    width: 20%!important;
    float: left!important;
  }
  .el-tree-node__children{
    width: 80%!important;
    float: left!important;
  }
  .el-checkbox-group{
    text-align: left;
    width: 50px;
  }
  .grounpWidth {
    margin-left: 150px;
  // margin-top:-36px;
  }
  .grounpWidtht:nth-child(1){
    margin-top:-36px;
  }

  .grounpWidth2t:nth-child(1){
    margin-top:-36px;
  }
  .grounpWidth2{
    margin-left: 310px;
  }
</style>
