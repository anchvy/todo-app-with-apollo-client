const typeDefs = `
  type TodoList {
    items: [TodoItem]
  }

  type TodoItem {
    id: String
  }

  type SideBar {
    isOpen: Bool
    selected: String
  }

  type EditorDialog {
    isOpen: Bool
    mode: String
    editingTaskId: String
    editingTask: TodoItem
  }

  type Mutation {
    addTodo(title: String!, dueDate: Date!, priority: String!): TodoList
    setSideBarState(isOpen: Bool!, selected: String): SideBar
    setEditorState(isOpen: Bool!, mode: String!, editingTaskId: String): EditorDialog
  }

  type Query {
    todoItem(id: String!): TodoItem
    todoList(status: String): TodoList
    sideBar: SideBar
    editor: EditorDialog
  }
`

export default typeDefs
