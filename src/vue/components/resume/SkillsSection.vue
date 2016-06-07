<script>
  export default {
    props: [
      'skills'
    ]
  }
</script>

<template lang="jade">
  div
    .ui.massive.orange.ribbon.label
      i.keyboard.icon
      | 技能
    h3.ui.header
      .content 技能清單
    .ui.stackable.two.column.grid
      .column(v-for='skill in skills')
        .ui.very.relaxed.list
          .item
            i.folder.icon
            .content
              .header(v-text='skill.name')
              .list(v-if='skill.keywords.length')
                .item(v-for='keyword in skill.keywords')
                  i.file.icon
                  .content
                    .header(v-text='keyword.name')
                    .list(v-if='keyword.highlights.length')
                      .item(v-for='highlight in keyword.highlights')
                        .content
                          .description(v-text='highlight')
</template>
