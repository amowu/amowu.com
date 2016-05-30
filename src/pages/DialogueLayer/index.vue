<style lang="stylus" scoped>
  #d-c-1
    display flex
    justift-content center
  #d-c-2
    display flex
    flex-direction column-reverse
    align-items flex-end
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
  import { setActivedDialogue } from '../../actions/dialogues'
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
    data () {
      return { isTyping: false }
    },
    computed: {
      /** @return {string|null} Current actived dialogue ID */
      id () {
        const { actived: dialogueId } = this.dialogues
        return dialogueId !== '' ? dialogueId : null
      },
      /** @return {string} Current actived dialogue text */
      text () {
        const { id } = this
        const { entities } = this.dialogues
        return id ? entities[id].text : ''
      },
      /** @return {Array<Object>} Current actived dialogue options */
      options () {
        const { id } = this
        const { entities } = this.dialogues
        return id ? entities[id].next.items || [] : []
      },
      /** @return {boolean} Whether to display the options menu */
      showOptions () {
        return (!this.isTyping && this.options.length)
      }
    },
    methods: {
      next () {
        const { id } = this
        const { entities } = this.dialogues
        if (entities[id].next.hasOwnProperty('route')) {
          this.$router.go({ path: entities[id].next.route })
          return this.close()
        }
        if (entities[id].next.hasOwnProperty('dialogue')) return this.setActivedDialogue(entities[id].next.dialogue)
        if (entities[id].next.hasOwnProperty('items')) return

        this.close()
      },
      close () {
        this.setActivedDialogue('')
      },
      doOption (option) {
        if (option.hasOwnProperty('dialogue')) return this.setActivedDialogue(option.dialogue)
        if (option.hasOwnProperty('route')) {
          this.$router.go({ path: option.route })
          this.close()
          return
        }

        this.close()
      }
    },
    watch: {
      'text' (val, oldVal) {
        if (val === oldVal) return
        if (val === '') return

        typing(this.id, val)
      }
    },
    vuex: {
      getters: {
        dialogues: state => state.dialogues
      },
      actions: {
        setActivedDialogue
      }
    },
    ready () {
      const { id, text } = this
      addTypeEvent(
        () => { this.isTyping = true },
        () => { this.isTyping = false })
      typing(id, text)
    }
  }
</script>

<template lang="jade">
  div(v-show='text')
    //- TODO: Dialogue.vue
    #d-c-1.fullscreen
      #dimmer.fullscreen(@click='close')
      #d-c-2.ui.container
        #dialogue-box.ui.segment(@click='next')
          //- TODO: Typed.vue
          #theater
        .ui.vertical.menu(v-show='showOptions')
          a.item(
            v-for='option in options'
            v-text='option.text'
            @click='doOption(option)')
</template>
