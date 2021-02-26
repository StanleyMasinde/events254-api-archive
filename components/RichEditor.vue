<template>
  <div>
    <h3>Describe your event</h3>
    <div class="editor">
      <editor-menu-bar v-slot="{ commands, isActive }" :editor="editor">
        <div class="menubar">
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.bold() }"
            @click.prevent="commands.bold"
          >
            <v-icon>mdi-format-bold</v-icon>
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.italic() }"
            @click.prevent="commands.italic"
          >
            <v-icon>mdi-format-italic</v-icon>
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.strike() }"
            @click.prevent="commands.strike"
          >
            <v-icon>mdi-format-strikethrough</v-icon>
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.underline() }"
            @click.prevent="commands.underline"
          >
            <v-icon>mdi-format-underline</v-icon>
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.code() }"
            @click.prevent="commands.code"
          >
            <v-icon>mdi-code-tags</v-icon>
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.paragraph() }"
            @click.prevent="commands.paragraph"
          >
            <v-icon>mdi-format-paragraph</v-icon>
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 1 }) }"
            @click.prevent="commands.heading({ level: 1 })"
          >
            <v-icon>mdi-format-header-1</v-icon>
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 2 }) }"
            @click.prevent="commands.heading({ level: 2 })"
          >
            <v-icon>mdi-format-header-2</v-icon>
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 3 }) }"
            @click.prevent="commands.heading({ level: 3 })"
          >
            <v-icon>mdi-format-header-3</v-icon>
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.bullet_list() }"
            @click.prevent="commands.bullet_list"
          >
            <v-icon>mdi-format-list-bulleted</v-icon>
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.ordered_list() }"
            @click.prevent="commands.ordered_list"
          >
            <v-icon>mdi-format-list-numbered</v-icon>
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.blockquote() }"
            @click.prevent="commands.blockquote"
          >
            <v-icon>mdi-format-quote-close-outline</v-icon>
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.code_block() }"
            @click.prevent="commands.code_block"
          >
            <v-icon>mdi-code-braces</v-icon>
          </button>

          <button class="menubar__button" @click.prevent="commands.horizontal_rule">
            Hr
          </button>

          <button class="menubar__button" @click.prevent="commands.undo">
            <v-icon>mdi-undo</v-icon>
          </button>

          <button class="menubar__button" @click.prevent="commands.redo">
            <v-icon>mdi-redo</v-icon>
          </button>
        </div>
      </editor-menu-bar>
      <editor-content auto-focus="true" class="editor__content" :editor="editor" />
      <input v-model="currentInput" type="hidden" name="description">
    </div>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History
} from 'tiptap-extensions'

export default {
  components: {
    EditorContent,
    EditorMenuBar
  },
  props: {
    value: {
      type: String,
      default: 'Hahaha'
    }
  },
  data () {
    return {
      currentInput: null,
      editor: new Editor({
        onUpdate: ({ getHTML }) => {
          // get new content on update
          this.currentInput = getHTML()
          this.$emit('input', getHTML())
        },
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History()
        ],
        content: `<h3>Agenda</h3>
        <ul>
        <li>Check in</li>
        <li>Snacks</li>
        </ul>`
      })
    }
  },
  beforeDestroy () {
    this.editor.destroy()
  }
}
</script>
<style lang="scss" scoped>
div {
    .editor {
        border: 1px solid #919191;
        border-radius: 5px;
        padding: 5px;
    }
    .menubar {
        border-bottom: 1px solid #919191;
    }
}
</style>
