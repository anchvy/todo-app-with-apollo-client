import _ from 'lodash'
import { defaults as sideBarDefaults, resolvers as sideBarResolvers } from './sideBar'
import { defaults as editorDefaults, resolvers as editorResolvers } from './editor'
import { defaults as todoDefaults, resolvers as todoResolvers } from './todo'

export const defaults = _.merge({}, sideBarDefaults, todoDefaults, editorDefaults)
export const resolvers = _.merge({}, sideBarResolvers, todoResolvers, editorResolvers)
