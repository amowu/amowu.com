<style lang="less" scoped>
  @import  (reference) "~semantic-ui-less/themes/default/globals/site.variables";

  .ui.right.floated.image {
    display: none;
  }

  @media only screen and (max-width: @largestMobileScreen) {
    .ui.card {
      & > .image {
        display: none;
      }
      & > .content:nth-of-type(2) {
        border-top: 0;
      }
    }
    .ui.right.floated.image {
      display: inline-block;
    }
  }
</style>

<script>
  export default {
    props: [
      'name',
      'label',
      'picture',
      'email',
      'phone',
      'website',
      'blog',
      'brief',
      'location',
      'profiles',
      'languages'
    ],
    computed: {
      composedLanguages () {
        return this.languages.map(language => language.name).join(', ')
      }
    }
  }
</script>

<template lang="jade">
  .ui.card
    .image(v-if='picture')
      img(:src="picture + '?s=350'")
    .content
      img.circular.right.floated.mini.ui.image(:src="picture + '?s=350'")
      .header(v-text='name')
      .meta(v-if='label', v-text='label')
      .description(v-if='brief', v-text='brief')
      .ui.list
        .item(v-if='phone')
          i.phone.icon
          .content(v-text='phone')
        .item(v-if='email')
          i.mail.icon
          .content
            a(:href="'mailto:' + email", v-text='email')
        //- TODO: 定義 IM 的 schema
        //- .item
        //-  i.comment.icon
        //-  .content
        .item(v-if='website')
          i.linkify.icon
          .content
            a(:href='website', v-text='website', target='_blank')
        .item(v-if='blog')
          i.rss.icon
          .content
            a(:href='blog', v-text='blog', target='_blank')
        //- TODO: 如果 location 的 city AND countryCode 都無值的話，不顯示。
        .item
          i.marker.icon
          //- TODO: 如果 city OR countryCode 其中一個無值的話，必須從陣列中移除。
          .content(v-text="[location.city, location.countryCode].join(', ')")
        .item(v-if='languages.length')
          i.world.icon
          .content(v-text='composedLanguages')
    .content(v-if='profiles.length')
      a.ui.circular.basic.icon.button(
        v-for='profile in profiles',
        :title='profile.network',
        :href='profile.url',
        target='_blank')
        i.icon(:class='profile.network | lowercase')
</template>
