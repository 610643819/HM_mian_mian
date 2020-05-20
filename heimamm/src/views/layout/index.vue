<template>
  <div>
      layout
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  created() {
    this.$axios({
      method:'get',
      url:'/info',
      params:{
        token:localStorage.getItem('token')
      }
    }).then((res)=>{
      console.log(res)
    })
  },
}
</script>

<style>

</style>