<script>
  import { setActivedDialogue } from '../../vuex/actions/dialogues'
  import Dialogue from '../components/Dialogue'

  export default {
    data () {
      return {
        isTyping: false
      }
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
        return !!(!this.isTyping && this.options.length)
      }
    },
    methods: {
      next () {
        const { id } = this
        const { entities } = this.dialogues
        if (entities[id].next.hasOwnProperty('url')) {
          window.open(entities[id].next.url, '_black')
          return this.close()
        }
        if (entities[id].next.hasOwnProperty('route')) {
          this.$router.go({ path: entities[id].next.route })
          return this.close()
        }
        if (entities[id].next.hasOwnProperty('dialogue')) {
          return this.setActivedDialogue(entities[id].next.dialogue)
        }
        if (entities[id].next.hasOwnProperty('items')) {
          return
        }
        this.close()
      },
      close () {
        this.setActivedDialogue('')
      },
      doOption (option) {
        if (option.hasOwnProperty('dialogue')) {
          return this.setActivedDialogue(option.dialogue)
        }
        if (option.hasOwnProperty('route')) {
          this.$router.go({ path: option.route })
          this.close()
          return
        }
        if (option.hasOwnProperty('url')) {
          window.open(option.url, '_blank')
        }
        this.close()
      },
      onTypeStart () {
        this.isTyping = true
      },
      onTypeEnd () {
        this.isTyping = false
      }
    },
    components: {
      Dialogue
    },
    vuex: {
      getters: {
        dialogues: state => state.dialogues
      },
      actions: {
        setActivedDialogue
      }
    }
  }
</script>

<template lang="jade">
  dialogue(
    :name='id',
    :text='text',
    :options='options',
    :show='showOptions',
    :next='next',
    :select='doOption',
    :start='onTypeStart',
    :end='onTypeEnd')
</template>
