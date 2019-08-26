import $ from 'jquery'
import _ from 'lodash'
import Logger from 'js-logger'
import { bindActionCreators } from 'redux'

import store from './store'
import { initView, updateView } from './view'
import { toBigQueryDataType } from './utils'
import * as appActions from './actions/appActions'
import * as formActions from './actions/formActions'

const actions = bindActionCreators(Object.assign({}, appActions, formActions), store.dispatch)

import './styles/index.scss'
import '../lib/tableau-extensions-1.latest.js';

store.subscribe(() => updateView(store.getState()))

$(window).on("load", () => {
  actions.init(process.env.NODE_ENV);
  initView(store.getState())

  /**
   * Tableau Extension
   */
  try {
    tableau.extensions.initializeAsync().then(function () {
      actions.setLanguage(tableau.extensions.environment.language);
  
      const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets
      const dataSourceFetchPromises = _.map(worksheets, worksheet => worksheet.getDataSourcesAsync())
      let dataSourceIds = [];
  
      Promise.all(dataSourceFetchPromises).then(function (fetchResults) {
        fetchResults.forEach(function (dataSourcesForWorksheet) {
          dataSourcesForWorksheet.forEach(function (dataSource) {
            if (!_.includes(dataSourceIds, dataSource.id)) {
              dataSourceIds.push(dataSource.id)
              actions.addDataSource({
                id: dataSource.id,
                dataSourceName: dataSource.name,
              })
              Logger.info("dataSource=", dataSource)

              const ignoreColumnNames = _.reduce(dataSource.fields, (acc, field) => {
                if (field.isCalculatedField ||
                    field.isCombinedField ||
                    field.isGenerated ||
                    field.isHidden) {
                  acc.push(field.name)
                }
                return acc
              }, [])

              dataSource.getActiveTablesAsync().then(function (activeTables) {
                activeTables.forEach(function (table) {
                  Logger.info(dataSource.name, "table=", table)
                  let data = {
                    id: dataSource.id,
                    sourceType: table._tableInfo.connectionClassName,
                  }
                  if (table._tableInfo.connectionClassName === 'bigquery') {
                    const [projectId, datasetId, tableId] = table.id.replace(/[\[|\]]/g, '').split('.')
                    data = {
                      ...data,
                      projectId: projectId,
                      datasetId: datasetId,
                      tableId: tableId,
                    }
                  }
                  actions.updateDataSource(data)
                })
              })
  
              dataSource.getUnderlyingDataAsync().then(function (dataTable) {
                Logger.info(dataSource.name, "[dataTable]", dataTable)
                const rejectedColumns = _.reject(dataTable.columns, column => _.includes(ignoreColumnNames, column.fieldName))
                actions.updateDataSource({
                  id: dataSource.id,
                  columns: _.map(rejectedColumns, column => {
                    return {
                      name: column.fieldName,
                      type: toBigQueryDataType(column.dataType),
                      index: column.index,
                    }
                  }),
                  rows: dataTable.totalRowCount,
                })
              })
            }
          });
        });
      });
    }, function (e) {
      Logger.error('An error while tableau extension initializing: ' + e.toString())
    })
  } catch (e) {
    Logger.error('An error occurred in tableau extension: ' + e.toString())
  }
});
