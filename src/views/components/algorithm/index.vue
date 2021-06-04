<template>
  <div class="algorithm-container">
    插槽demo

    <slot-test :columns="columns">


      <template v-slot:slot1="record">
        <a-button type="primary" @click="handleBtn1(record, 'name', $event)">testSlot1</a-button>
      </template>

      <template v-slot:slot2="record">
        <a-button type="primary" @click="handleBtn2(record, 'name', $event)">testSlot2</a-button>
      </template>


    </slot-test>
  </div>
</template>
<script>

import SlotTest from './slotTest.vue';

export default {
  data() {
    return {
        test1: 'abcabcbb', 
        result1: '',
        text: ``,
        activeKey: ['1'],
        columns: [
          {
            id: 1,
            name: 'test1',
            slotNm: 'slot1'
          },
          {
            id: 2,
            name: 'test2',
            slotNm: 'slot2'
          },
          {
            id: 3,
            name: 'test3',
            slotNm: 'slot1'
          }
        ]
    };
  },
  components: { SlotTest },
  methods: 
    {
      handleBtn1(id, str, e) {
        console.log("slot1------", id, str, e);
      },

      handleBtn2(id, str, e) {
        console.log("slot2------", id, str, e);
      }
  }
};
</script>

<style lang="scss">

    .algorithm-container{

        input{
            width: 200px;
        }
    }

</style>