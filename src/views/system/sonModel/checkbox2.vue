<template>
  <div id="">
    <el-col :span="8">功能模块</el-col>
    <el-col :span="8">页面权限</el-col>
    <el-col :span="8">功能权限</el-col>
    <el-row v-for="(item1,index) in groupList" class="Onegroup">
      <!--<el-row v-for="item3 in item2.groupList">-->
      <el-col   >
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" @click.native="ckickFn(item1.list1)">
          <el-checkbox  :label="item1.list1" >{{item1.list1}}</el-checkbox>
        </el-checkbox-group>
      </el-col>
      <el-col class="TwoGroup">
        <el-col :span="8"  v-for="item2 in item1.groupList" class="grounpWidth">
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" @click.native="ckickFn(item2.list1)">
            <el-checkbox   :label="item2.list1">{{item2.list1}}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-col>
      <el-col class="ThreeGroup">
        <el-col  v-for="(item2,index) in item1.groupList" :key="index" >
          <el-col :span="8"   class="grounpWidth2" >
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" v-for="item3 in item2.groupList" @click.native="ckickFn(item3.list1)">
              <!--<span style="width:100px">{{888}}</span>-->
              <el-checkbox   :label="item3.list1">{{item3.list1}}
                <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" v-for="item4 in item3.groupList" @click.native="ckickFn(item4.list1)">
                  <!--   <span style="width:100px">{{888}}</span>-->
                  <el-checkbox   :label="item4.list1">{{item4.list1}}</el-checkbox>
                </el-checkbox-group>
              </el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-col>

      </el-col>
      <!--</el-row>-->
    </el-row>

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
              {
                list1:'选项1-3',
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
              },
              {
                list1:'选项2-3',
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
              },
              {
                list1:'选项2-4',
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
          },
          {
            list1:'选项3',
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
          },
          {
            list1:'选项4',
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
    props:['roleid'],
    watch:{
      'ScreenData':{
        handler(val){

        },
        deep: true,
        immediate: true
      },
    },
    mounted (){
      this.getgroupList();

      this.getTwoGroupHieht();
    },
    methods:{
      getgroupList(){
        this.httpPost('toQueryRole?roleId='+this.qs.stringify(this.roleid)).then(res=>{

        })
      },
      //设置最后一层grounp
      getTwoGroupHieht(){
        var TowGrounp=document.getElementsByClassName('TwoGroup');
        var ThreeGroup=document.getElementsByClassName('ThreeGroup');
        var GroupHeight=[];
        for(var i=0;i<TowGrounp.length;i++){
          GroupHeight.push(TowGrounp[i].offsetHeight);
          console.log('height ', TowGrounp[i].offsetHeight)
        }
        for(var i=0;i<ThreeGroup.length;i++){
          ThreeGroup[i].style.marginTop = -GroupHeight[i]+'px';
        }

        /* TowGrounp.forEach(item=>{
         console.log('height ',item.offsetHeight)
         })*/
        console.log('2222 % 0==',TowGrounp)
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
  .Onegroup>div:nth-child(1){
    width:120px ;
  }
  .el-checkbox-group{
    text-align: left;
    width: 50px;
  }
  .grounpWidth {
    margin-left: 150px;
  // margin-top:-36px;
  }
  .TwoGroup{
    margin-top:-36px;
  }

  .grounpWidth2t:nth-child(1){
    margin-top:-36px;
  }
  .grounpWidth2{
    margin-left: 310px;
  }
</style>
