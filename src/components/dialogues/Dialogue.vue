<style lang="stylus" scoped>
  #d-c-1
    display flex
    justift-content center
    // pointer-events none
  #d-c-2
    display flex
    flex-direction column-reverse
    align-items flex-end
  #d-c-2 > *
    // pointer-events auto
  #d-c-2 > .ui.segment
    width 100%
  #d-c-2 > .ui.vertical.menu
    margin-bottom 1em
  #dialogue-box
    cursor pointer
  .fullscreen
    position fixed
    top 0
    left 0
    bottom 0
    right 0
</style>

<script>
  import Typed from './Typed'

  function callback (func, ...args) {
    if (typeof func === 'function') {
      func(...args)
    }
  }

  export default {
    props: [
      'text',
      'options',
      'change',
      'close',
      'start',
      'done'
    ],
    components: {
      Typed
    },
    methods: {
      onOptionClick (dialogueId) {
        callback(this.change, dialogueId)
      },
      onDimmerClick () {
        callback(this.close)
      },
      onDialogueBoxClick () {

      }
    }
  }
</script>

<template lang="jade">
  #d-c-1.fullscreen
    #dimmer.fullscreen(@click='onDimmerClick')
    #d-c-2.ui.container
      #dialogue-box.ui.segment(v-show='text', @click='onDialogueBoxClick')
        typed(
          :string='text')
      .ui.vertical.menu(v-show='options && options.length')
        a.item(
          v-for='option in options'
          v-text='option.text'
          @click='onOptionClick(option.dialogue)')
</template>
