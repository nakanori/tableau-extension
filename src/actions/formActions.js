
import { types } from './index'

export const addDataSource = data => {
  return { type: types.ADD_DATA_SOURCE, data }
}

export const updateDataSource = data => {
  return { type: types.UPDATE_DATA_SOURCE, data }
}

export const selectDataSource = id => {
  return { type: types.SELECT_DATA_SOURCE, id }
}

export const selectKeyColumn = columnName => {
  return { type: types.SELECT_KEY_COLUMN, columnName }
}

export const selectTextColumn = columnName => {
  return { type: types.SELECT_TEXT_COLUMN, columnName }
}

export const changeAnalyzeType = type => {
  return { type: types.CHANGE_ANALYZE_TYPE, type }
}

export const changeOutputMode = mode => {
  return { type: types.CHANGE_OUTPUT_MODE, mode }
}

export const changeOutputProjectId = id => {
  return { type: types.CHANGE_OUTPUT_PROJECT_ID, id }
}

export const changeOutputDatasetId = id => {
  return { type: types.CHANGE_OUTPUT_DATASET_ID, id }
}

export const changeOutputTableId = id => {
  return { type: types.CHANGE_OUTPUT_TABLE_ID, id }
}

export const changeOutputDataSource = dataSourceId => (dispatch, getState) => {
  const state = getState()
  const { form } = state
  const dataSource = _.find(form.dataSources, d => d.id === dataSourceId)
  dispatch({
    type: types.CHANGE_OUTPUT_DATA_SOURCE,
    projectId: dataSource.projectId,
    datasetId: dataSource.datasetId,
    tableId: dataSource.datasetId,
  })
}
