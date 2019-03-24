import React from 'react'
import IconDateRange from '@material-ui/icons/DateRange'
import IconSubject from '@material-ui/icons/Subject'
import IconDone from '@material-ui/icons/Done'
import IconNewReleases from '@material-ui/icons/NewReleases'

export const LOCALSTORAGE_KEY = '____datawow-todo'

export const STATUS_CONFIGS = {
  ALL: {
    label: 'All Tasks',
    query: 'all',
    icon: <IconSubject />,
    color: null,
  },
  NEW: {
    label: 'New',
    query: 'new',
    icon: <IconNewReleases />,
    color: '#90caf9',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    query: 'in-progress',
    icon: <IconDateRange />,
    color: null,
  },
  DONE: {
    label: 'Done',
    query: 'done',
    icon: <IconDone />,
    color: '#b2dfdb',
  },
}

export const PRIORITY_CONFIGS = {
  high: {
    value: 'high',
    color: '#ef9a9a',
    label: 'High',
  },
  medium: {
    value: 'medium',
    color: '#90caf9',
    label: 'Medium',
  },
  low: {
    value: 'low',
    color: '#e0e0e0',
    label: 'Low',
  },
}
