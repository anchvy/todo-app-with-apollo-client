import _ from 'lodash'
import { defaults as sideBarDefaults, resolvers as sideBarResolvers } from './sideBar'
import { defaults as editorDefaults, resolvers as editorResolvers } from './editor'
import { resolvers as todoResolvers } from './todo'

export const defaults = _.merge({}, sideBarDefaults, editorDefaults)
export const resolvers = _.merge({}, sideBarResolvers, todoResolvers, editorResolvers)
