<template>

  <colgroup>
    <col v-for="(item, i) in columns" :key="i" :width="item.width">
  </colgroup>
    
</template>

<script>


export default {

  name: 'ColGroup',
  
  props: {

    columns: {

      type: Array,
      default: () => {
        return []
      }
    }
  },

  data() {
    return {};
  },


  created() {
  },

  methods: {

  }
};
</script>
<style lang="scss" scoped>
</style>
