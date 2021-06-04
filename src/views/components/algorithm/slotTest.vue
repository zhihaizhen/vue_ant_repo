<template>
  <div class="slot-test-container">
    
    <div v-for="(item, i) in columns" :key="i">
      <slot :name="item.slotNm" v-bind:record="item"></slot>
    </div>
  </div>
</template>
<script>
export default {

  props: {

    columns: {

      type: Array,
      default: () =>{
        return [];
      }
    }
  },
  data() {
    return {

    };
  },
  methods: {
  }
};
</script>

<style lang="scss">

</style>