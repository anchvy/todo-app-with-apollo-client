const typeDefs = `
  type TodoList {
    items: [TodoItem]
  }

  type TodoItem {
    id: String
  }

  type SideBar {
    isOpen: Bool
  }

  type EditorDialog {
    isOpen: Bool
    mode: String
    editingTaskId: String
    editingTask: TodoItem
  }

  type Mutation {
    addTodo(title: String!, dueDate: Date!, priority: String!): TodoList
    setSideBarState(isOpen: Bool!): SideBar
    setEditorState(isOpen: Bool!, mode: String!, editingTaskId: String): EditorDialog
  }

  type Query {
    todoItem(id: String!): TodoItem
    todoList: TodoList
    sideBar: SideBar
    editor: EditorDialog
  }
`

export default typeDefs
