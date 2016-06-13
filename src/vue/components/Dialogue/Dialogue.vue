<style lang="less" scoped>
  @import (optional) "./dialogue.less";
</style>

<script>
  import theaterJS from 'theaterjs'

  const theater = theaterJS({
    autoplay: true,
    minSpeed: 80,
    maxSpeed: 450
  })

  function addTypeEvent (onTypeStart, onTypeEnd) {
    theater.on('type:start', onTypeStart)
    theater.on('type:end', onTypeEnd)
  }

  function typing (name, text) {
    theater.addActor(name, 1, '#theater')
    theater.addScene(`${name}:${text}`)
  }

  export default {
    props: {
      name: String,
      text: String,
      options: Array,
      show: Boolean,
      next: Function,
      select: Function,
      start: Function,
      end: Function
    },
    watch: {
      'text' (val, oldVal) {
        if (val === oldVal) return
        if (val === '') return

        typing(this.name, val)
      }
    },
    ready () {
      const { name, text, start, end } = this

      addTypeEvent(start, end)

      typing(name, text)
    }
  }
</script>

<template lang="jade">
  div(v-show='text')
    #dialogue
      #dimmer(@click='next')
      .ui.container
        .ui.inverted.padded.segment(@click='next')
          #theater
        .ui.inverted.segment(v-show='show')
          .ui.vertical.inverted.secondary.large.menu
            a.item(
              v-for='option in options'
              v-text='option.text'
              @click='select(option)')
</template>
