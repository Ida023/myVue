<template>
    <div id="" >
      <div>
        <h1 style="text-align: center">JAVA接口测试</h1>
        <button @click="postFrom()">post请求</button>
        <button @click="getFrom()">get请求</button>
        <button @click="urlFrom()">Url带参数</button>
      </div>
      <div class="nav">
        <h2>post请求</h2>
          <pre>
            <code>
              {{ postFrom }}
            </code>
         </pre>
      </div>
      <div class="nav">
        <h2>get请求</h2>
          <pre>
            <code>
              {{ getFrom }}
            </code>
         </pre>
      </div>
      <div class="nav">
        <h2>Url</h2>
          <pre>
            <code>
              {{ urlFrom }}
            </code>
         </pre>
      </div>


    </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        postFrom:'',
        getFrom:'',
        urlFrom:'',

        PostDate:{
            a:'1',
            b:'2',
        }
      }
    },
    methods:{
      postFrom(){
          alert(1)
        this.httpPost('url',this.PostDate).then(res=>{
          console.log(res)
        })
      },
      getFrom(){
        alert(2)
        this.httpGet('url',this.PostDate).then(res=>{
          console.log(res)
        })
      },
      urlFrom(){//get post 都可以
        alert(3)
          let val = '77777'
        this.httpGet('url?key='+val,this.PostDate).then(res=>{
          console.log(res)
        })
      },

    },
    mounted () {

    },

  }

</script>

<style scoped>
  .nav{
    width: 30%;
    float: left;
    border: 2px red solid;
    margin-left: 10px;
    min-height: 350px;
  }
</style>
