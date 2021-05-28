<template>
  <div>
    <v-toolbar
      v-if="editor"
      outlined
      rounded="15"
      dense
      elevation="0"
    >
      <v-toolbar-items>
        <v-btn small icon :color="editor.isActive('bold')? 'primary' : ''" @click.prevent="editor.chain().focus().toggleBold().run()">
          <v-icon>mdi-format-bold</v-icon>
        </v-btn>
        <v-btn small icon :color="editor.isActive('italic')? 'primary' : '' " @click.prevent="editor.chain().focus().toggleItalic().run()">
          <v-icon>mdi-format-italic</v-icon>
        </v-btn>
        <v-btn small icon :color="editor.isActive('heading', { level: 2 }) ? 'primary' : ''" @click.prevent="editor.chain().focus().toggleHeading({ level: 2 }).run()">
          <v-icon>mdi-format-header-2</v-icon>
        </v-btn>
        <v-btn small icon :color="editor.isActive('heading', { level: 3 }) ? 'primary' : ''" @click.prevent="editor.chain().focus().toggleHeading({ level: 3 }).run()">
          <v-icon>mdi-format-header-3</v-icon>
        </v-btn>
        <v-btn icon small :color="editor.isActive('paragraph') ? 'primary' : ''" @click.prevent="editor.chain().focus().setParagraph().run()">
          <v-icon>mdi-format-paragraph</v-icon>
        </v-btn>
        <v-btn icon small :color="editor.isActive('bulletList') ? 'primary' : ''" @click.prevent="editor.chain().focus().toggleBulletList().run()">
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-btn>
        <v-btn icon small :color="editor.isActive('orderedList') ? 'primary' : ''" @click.prevent="editor.chain().focus().toggleOrderedList().run()">
          <v-icon>mdi-format-list-numbered</v-icon>
        </v-btn>
        <v-btn icon small :color="editor.isActive('blockquote') ? 'primary' : ''" @click.prevent="editor.chain().focus().toggleBlockquote().run()">
          <v-icon>mdi-format-quote-close</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <editor-content :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'

export default {
  components: {
    EditorContent
  },

  data () {
    return {
      editor: null
    }
  },

  mounted () {
    this.editor = new Editor({
      content: '<p>I’m running tiptap with Vue.js. 🎉</p>',
      extensions: [
        StarterKit
      ]
    })
  },

  beforeDestroy () {
    this.editor.destroy()
  }
}
</script>
