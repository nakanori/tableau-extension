import { types } from '../actions/index'
import { createReducer } from './appReducers';

export const ANALYZE_TYPES = {
  TEXT: 'annotateText',
  ENTITIES: 'analyzeEntities',
  SENTIMENT: 'analyzeSentiment',
  ENTITITY_SENTIMENT: 'analyzeEntitySentiment',
}

export const OUTPUT_MODES = {
  CREATE: "create",
  OVERRIDE: "override",
}

export const DEFAULT_OUTPUT_COLUMNS = {
  [ANALYZE_TYPES.ENTITIES]: [{
    name: "word",
    type: "STRING",
  }, {
    name: "salience",
    type: "FLOAT",
  }, {
    name: "type",
    type: "FLOAT",
  }],
  [ANALYZE_TYPES.SENTIMENT]: [{
    name: "score",
    type: "FLOAT",
  }, {
    name: "magnitude",
    type: "FLOAT",
  }],
  [ANALYZE_TYPES.ENTITITY_SENTIMENT]: [{
    name: "score",
    type: "FLOAT",
  }, {
    name: "magnitude",
    type: "FLOAT",
  }],
  [ANALYZE_TYPES.TEXT]: [{
    name: "score",
    type: "FLOAT",
  }, {
    name: "magnitude",
    type: "FLOAT",
  }],
}

const initialState = {
  projectIds: ["gn-blocks-proto"], // TODO: デモ用
  dataSources: [],
  outputColumns: DEFAULT_OUTPUT_COLUMNS[ANALYZE_TYPES.TEXT],
  // For form
  analyzeType: ANALYZE_TYPES.ENTITIES,
  inputDataSourceId: null,
  keyColumnName: null,
  textColumnName: null,
  outputMode: OUTPUT_MODES.CREATE,
  outputProjectId: null,
  outputDatasetId: null,
  outputTableId: null,
  outputTable: null,
}


const updateAnalyzeType = (state, action) => {
  return {
    ...state,
    analyzeType: action.type,
    outputColumns: DEFAULT_OUTPUT_COLUMNS[action.type],
  }
}

const addDataSource = (state, action) => {
  const data = action.data
  return {
    ...state,
    dataSources: _.chain(state.dataSources)
                  .reject(o => o.id === data.id)
                  .concat([data])
                  .value(),
  }
}

const updateDataSource = (state, action) => {
  const data = action.data

  let exist = false;
  let nextDataSources = _.map(state.dataSources, o => {
    if (o.id === data.id) {
      exist = true
      return {
        ...o,
        ...data,
      }
    }
    return o
  })
  if (!exist) {
    nextDataSources.push(data)
  }
  return {
    ...state,
    dataSources: nextDataSources,
  }
}

const selectDataSource = (state, action) => {
  return {
    ...state,
    inputDataSourceId: action.id
  }
}

const selectKeyColumn = (state, action) => {
  return {
    ...state,
    keyColumnName: action.columnName
  }
}

const selectTextColumn = (state, action) => {
  return {
    ...state,
    textColumnName: action.columnName
  }
}

const updateOutputMode = (state, action) => {
  return {
    ...state,
    outputMode: action.mode,
    outputProjectId: null,
    outputDatasetId: null,
    outputTableId: null,
  }
}

const updateOutputProjectId = (state, action) => {
  return {
    ...state,
    outputProjectId: action.id
  }
}

const updateOutputDatasetId = (state, action) => {
  return {
    ...state,
    outputDatasetId: action.id
  }
}

const updateOutputTableId = (state, action) => {
  return {
    ...state,
    outputTableId: action.id
  }
}

const updateOutputDataSource = (state, action) => {
  return {
    ...state,
    outputProjectId: action.projectId,
    outputDatasetId: action.datasetId,
    outputTableId: action.tableId,
  }
}

const form = createReducer(initialState, {
  [types.CHANGE_ANALYZE_TYPE]: updateAnalyzeType,
  [types.ADD_DATA_SOURCE]: addDataSource,
  [types.UPDATE_DATA_SOURCE]: updateDataSource,
  [types.SELECT_DATA_SOURCE]: selectDataSource,
  [types.SELECT_KEY_COLUMN]: selectKeyColumn,
  [types.SELECT_TEXT_COLUMN]: selectTextColumn,
  [types.CHANGE_OUTPUT_MODE]: updateOutputMode,
  [types.CHANGE_OUTPUT_PROJECT_ID]: updateOutputProjectId,
  [types.CHANGE_OUTPUT_DATASET_ID]: updateOutputDatasetId,
  [types.CHANGE_OUTPUT_TABLE_ID]: updateOutputTableId,
  [types.CHANGE_OUTPUT_DATA_SOURCE]: updateOutputDataSource,
})

export default form
