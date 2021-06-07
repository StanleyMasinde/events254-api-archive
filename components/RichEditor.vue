<template>
  <div class="editordiv">
    <bubble-menu v-if="editor" :editor="editor">
      <v-toolbar outlined rounded="15" dense elevation="0">
        <v-toolbar-items>
          <v-btn
            small
            icon
            :color="editor.isActive('bold') ? 'primary' : ''"
            @click.prevent="editor.chain().focus().toggleBold().run()"
          >
            <v-icon>mdi-format-bold</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            :color="editor.isActive('italic') ? 'primary' : ''"
            @click.prevent="editor.chain().focus().toggleItalic().run()"
          >
            <v-icon>mdi-format-italic</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            :color="editor.isActive('heading', { level: 2 }) ? 'primary' : ''"
            @click.prevent="
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            "
          >
            <v-icon>mdi-format-header-2</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            :color="editor.isActive('heading', { level: 3 }) ? 'primary' : ''"
            @click.prevent="
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            "
          >
            <v-icon>mdi-format-header-3</v-icon>
          </v-btn>
          <v-btn
            icon
            small
            :color="editor.isActive('paragraph') ? 'primary' : ''"
            @click.prevent="editor.chain().focus().setParagraph().run()"
          >
            <v-icon>mdi-format-paragraph</v-icon>
          </v-btn>
          <v-btn
            icon
            small
            :color="editor.isActive('bulletList') ? 'primary' : ''"
            @click.prevent="editor.chain().focus().toggleBulletList().run()"
          >
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            depressed
            :color="editor.isActive('strike') ? 'primary' : ''"
            @click="editor.chain().focus().toggleStrike().run()"
          >
            <v-icon>mdi-format-strikethrough</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </bubble-menu>
    <v-toolbar v-if="editor" outlined rounded="15" dense elevation="0">
      <v-toolbar-items>
        <v-btn
          small
          icon
          :color="editor.isActive('bold') ? 'primary' : ''"
          @click.prevent="editor.chain().focus().toggleBold().run()"
        >
          <v-icon>mdi-format-bold</v-icon>
        </v-btn>
        <v-btn
          small
          icon
          :color="editor.isActive('italic') ? 'primary' : ''"
          @click.prevent="editor.chain().focus().toggleItalic().run()"
        >
          <v-icon>mdi-format-italic</v-icon>
        </v-btn>
        <v-btn
          small
          icon
          :color="editor.isActive('heading', { level: 2 }) ? 'primary' : ''"
          @click.prevent="
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          "
        >
          <v-icon>mdi-format-header-2</v-icon>
        </v-btn>
        <v-btn
          small
          icon
          :color="editor.isActive('heading', { level: 3 }) ? 'primary' : ''"
          @click.prevent="
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          "
        >
          <v-icon>mdi-format-header-3</v-icon>
        </v-btn>
        <v-btn
          icon
          small
          :color="editor.isActive('paragraph') ? 'primary' : ''"
          @click.prevent="editor.chain().focus().setParagraph().run()"
        >
          <v-icon>mdi-format-paragraph</v-icon>
        </v-btn>
        <v-btn
          icon
          small
          :color="editor.isActive('bulletList') ? 'primary' : ''"
          @click.prevent="editor.chain().focus().toggleBulletList().run()"
        >
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-btn>
        <v-btn
          icon
          small
          :color="editor.isActive('orderedList') ? 'primary' : ''"
          @click.prevent="editor.chain().focus().toggleOrderedList().run()"
        >
          <v-icon>mdi-format-list-numbered</v-icon>
        </v-btn>
        <v-btn
          icon
          small
          :color="editor.isActive('blockquote') ? 'primary' : ''"
          @click.prevent="editor.chain().focus().toggleBlockquote().run()"
        >
          <v-icon>mdi-format-quote-close</v-icon>
        </v-btn>
        <v-btn icon :color="editor.isActive('link') ? 'primary' : ''" @click="setLink">
          <v-icon>mdi-link</v-icon>
        </v-btn>
        <v-btn v-if="editor.isActive('link')" icon @click="editor.chain().focus().unsetLink().run()">
          <v-icon>mdi-link-off</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <editor-content class="editor" :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, BubbleMenu } from '@tiptap/vue-2'
import Bold from '@tiptap/extension-bold'
import Italics from '@tiptap/extension-italic'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import OrderedList from '@tiptap/extension-ordered-list'
import UnorderedList from '@tiptap/extension-bullet-list'
import Quote from '@tiptap/extension-blockquote'
import Strikethrough from '@tiptap/extension-strike'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import ListItem from '@tiptap/extension-list-item'
import Link from '@tiptap/extension-link'
export default {
  components: {
    EditorContent,
    BubbleMenu
  },

  data () {
    return {
      editor: null
    }
  },
  mounted () {
    this.editor = new Editor({
      onUpdate: (d) => {
        this.$emit('input', d.editor.getHTML())
      },
      autofocus: true,
      content: '',
      extensions: [
        Bold,
        Italics,
        Heading.configure({
          levels: [2, 3]
        }),
        Paragraph,
        OrderedList,
        UnorderedList,
        Quote,
        Strikethrough,
        Document,
        Text,
        ListItem,
        Link
      ],
      injectCSS: true,
      parseOptions: {
        preserveWhitespace: 'full'
      }
    })
  },

  beforeDestroy () {
    this.editor.destroy()
  },
  methods: {
    setLink () {
      const url = window.prompt('URL')
      this.editor.chain().focus().setLink({ href: url }).run()
    }
  }
}
</script>
<style>
p {
  margin: 1em 0;
}
.editor {
  margin-bottom: 13px;
  padding-left: 13px;
  padding-right: 13px;
  caret-color: #49c5b6;
}
.editor::before {
  content: "Description";
  font-weight: 800;
}
.editor::placeholder {
  content: "What is your event about?";
}
.editordiv {
  background-color: rgba(0, 0, 0, 0.06);
  background-position-x: 0%;
  background-position-y: 0%;
  background-repeat: repeat;
  background-attachment: scroll;
  background-image: none;
  background-size: auto;
  background-origin: padding-box;
  background-clip: border-box;
  border-radius: 15px;
  padding-bottom: 2px;
  margin-bottom: 5px;
}
</style>
