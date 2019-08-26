import $ from 'jquery'
import _ from 'lodash'
import Logger from 'js-logger'
import { bindActionCreators } from 'redux'

import { t } from './i18n'
import store from './store'
import { types } from './actions'
import * as appActions from './actions/appActions'
import * as formActions from './actions/formActions'
import { ANALYZE_TYPES, OUTPUT_MODES } from './reducers/formReducers'

const actions = bindActionCreators(Object.assign({}, appActions, formActions), store.dispatch)

const columnInfoCompiled = _.template('<tr><td><%- name %></td><td><%- type %></td></tr>');

/**
 * 画面の初期処理
 * @param {object} state State
 */
export const initView = state => {
  const defaultSettings = state.form

  // 分析内容選択
  $('#analyzeType > select > option').remove()
  _.each(ANALYZE_TYPES, (v, k) => {
    $('#analyzeType > select').append($('<option/>', {
      value: v,
      text : t(`form.${v}`)
    }))
  })
  $("#analyzeType > select").val(defaultSettings.analyzeType)
  $("#analyzeType > select").change(() => {
    const value = $('#analyzeType > select > option:selected').val();
    actions.changeAnalyzeType(value)
  })

  // 入力元設定：データソース選択
  $('#inputTable > select > option').remove()
  $("#inputTable > select").change(() => {
    const value = $('#inputTable > select > option:selected').val();
    actions.selectDataSource(value)
  })

  // 入力設定：カラム選択
  $('#inputKeyColumn > select > option').remove()
  $("#inputKeyColumn > select").change(() => {
    const value = $('#inputKeyColumn > select > option:selected').val();
    actions.selectKeyColumn(value)
  })

  $('#inputTextColumn > select > option').remove()
  $("#inputTextColumn > select").change(() => {
    const value = $('#inputTextColumn > select > option:selected').val();
    actions.selectTextColumn(value)
  })

  // 出力先設定：モード選択（新規、上書き）
  $("#outputMode > .btn-group > button").remove()
  _.each(OUTPUT_MODES, (v, k) => {
    $('#outputMode > .btn-group').append(
      $('<button type="button"/>')
        .val(v)
        .addClass("btn " + (defaultSettings.outputMode === v ? "btn-secondary" : "btn-outline-secondary"))
        .html(t(`form.outputMode.${v}`)
      ).on('click', () => actions.changeOutputMode(v))
    )
  })

  // 出力先設定：新規設定フィールドと上書き設定フィールド
  $('#outputOverride > select > option').remove()
  if (defaultSettings.outputMode === OUTPUT_MODES.CREATE) {
    $('#outputCreate').show()
    $('#outputOverride').hide()
  } else {
    $('#outputCreate').hide()
    $('#outputOverride').show()
  }

  // 出力先設定：プロジェクトID
  $('#outputProjectId > select > option').remove()
  _.each(defaultSettings.projectIds, id => {
    $('#outputProjectId > select').append($('<option/>', {
      value: id,
      text : id
    }))
  })
  $('#outputProjectId > select').prepend($('<option/>', {
    text : t(`invalid.pleaseSelect`)
  }))
  $("#outputProjectId > select").change(() => {
    const value = $('#outputProjectId > select > option:selected').val();
    actions.changeOutputProjectId(value)
  })

  $("#outputOverride > select").change(() => {
    const dataSourceId = $('#outputOverride > select > option:selected').val();
    actions.changeOutputDataSource(dataSourceId)
  })

  // 出力先設定：データセットID
  $("#outputDatasetId > input").val(defaultSettings.outputDatasetId)
  $("#outputDatasetId").on("input", () => {
    const value = $("#outputDatasetId > input").val()
    actions.changeOutputDatasetId(value)
  })

  // 出力先設定：テーブルID
  $("#outputTableId > input").val(defaultSettings.outputTableId)
  $("#outputTableId").on("input", () => {
    const value = $("#outputTableId > input").val()
    actions.changeOutputTableId(value)
  })

  // 出力先設定：テーブル情報
  _.each(defaultSettings.outputColumns, column => {
    $("#outputColumns > tbody").append(columnInfoCompiled({name: column.name, type: column.type}))
  })

  $("#close-alert").on('click', () => actions.closeAlert())

  $("#submit").on('click', () => {
    const form = $("form")[0]
    if (form.checkValidity()) {
      actions.execute()
    }
    $("form").addClass('was-validated')
  })

  // bootstrap のバリデーションエラーメッセージの i18n
  $("#analyzeType > .invalid-feedback").html(t("invalid.pleaseSelect"))
  $("#inputTable > .invalid-feedback ").html(t("invalid.pleaseSelect"))
  $("#inputTextColumn > .invalid-feedback").html(t("invalid.pleaseSelect"))
  $("#inputKeyColumn > .invalid-feedback").html(t("invalid.pleaseSelect"))
  $("#outputProjectId > .invalid-feedback").html(t("invalid.pleaseSelect"))
  $("#outputDatasetId > .invalid-feedback").html(t("invalid.pleaseEnter"))
  $("#outputTableId > .invalid-feedback").html(t("invalid.pleaseEnter"))
  $("#outputOverride > .invalid-feedback ").html(t("invalid.pleaseSelect"))
}

/**
 * 画面の更新処理
 * @param {object} nextState reducer により更新されたState
 */
export const updateView = nextState => {
  const dataSources = _.reject(nextState.form.dataSources, dataSource => !/bigquery/i.test(dataSource.sourceType))

  switch(nextState.lastAction.type) {
  case types.INIT:
    $("#loading").hide()
    if ($('.container-fluid').css('display') === 'none') {
      $(".container-fluid").show()
    }
    break;
  case types.SET_LANGUAGE:
    // TODO:
    break;
  case types.EXECUTE:
    $("#loading").show()
    break;
  case types.COMPLETED:
    $("#loading").hide()
    break;
  case types.ADD_DATA_SOURCE:
  case types.UPDATE_DATA_SOURCE:
    $('#inputTable > select > option').remove()
    $('#outputOverride > select > option').remove()
    _.each(dataSources, dataSource => {
      $('#inputTable > select').append($('<option/>', {
        value: dataSource.id,
        text : `${dataSource.dataSourceName} (${dataSource.datasetId}.${dataSource.tableId})`,
      }))
      $('#outputOverride > select').append($('<option/>', {
        value: dataSource.id,
        text : `${dataSource.dataSourceName} (${dataSource.datasetId}.${dataSource.tableId})`,
      }))
    })
    $('#inputTable > select').prepend($('<option/>', {
      text : t(`invalid.pleaseSelect`)
    }))
    break;
  case types.SELECT_DATA_SOURCE:
    $("#inputTable > select").val(nextState.form.inputDataSourceId)
    const targetDataSource = _.find(dataSources, data => data.id === nextState.form.inputDataSourceId)
    if (targetDataSource && targetDataSource.columns) {

      $('#inputKeyColumn > select > option').remove()
      $('#inputKeyColumn > select').append($('<option/>', {text : t(`invalid.pleaseSelect`)}))
      _.each(targetDataSource.columns, (column, i) => {
        $('#inputKeyColumn > select').append($('<option/>', {
          value: column.name,
          text : `${column.name} (${column.type})`
        }))
      })

      const stringColumns = _.reject(targetDataSource.columns, column => !/string/i.test(column.type))
      $('#inputTextColumn > select > option').remove()
      $('#inputTextColumn > select').append($('<option/>', {text : t(`invalid.pleaseSelect`)}))
      _.each(stringColumns, column => {
        $('#inputTextColumn > select').append($('<option/>', {
          value: column.name,
          text : `${column.name} (${column.type})`
        }))
      })

      $("#outputColumns > tbody > tr").remove()
      _.each(targetDataSource.columns, column => {
        $("#outputColumns > tbody").append(columnInfoCompiled({name: column.name, type: column.type}))
      })
      _.each(nextState.form.outputColumns, column => {
        $("#outputColumns > tbody").append(columnInfoCompiled({name: column.name, type: column.type}))
      })
    }
    break;
  case types.SELECT_KEY_COLUMN:
    $("#inputKeyColumn > select").val(nextState.form.keyColumnName)
    break;
  case types.SELECT_TEXT_COLUMN:
    $("#inputTextColumn > select").val(nextState.form.textColumnName)
    break;
  case types.CHANGE_OUTPUT_MODE:
    $("#outputMode > .btn-group > button").each(function() {
      if ($(this).val() === nextState.form.outputMode) {
        $(this).addClass("btn-secondary").removeClass("btn-outline-secondary")
      } else {
        $(this).addClass("btn-outline-secondary").removeClass("btn-secondary")
      }
    })
    if (nextState.form.outputMode === OUTPUT_MODES.CREATE) {
      $('#outputCreate').show()
      $('#outputOverride').hide()
    } else {
      $('#outputCreate').hide()
      $('#outputOverride').show()
    }
    break;
  case types.CHANGE_OUTPUT_PROJECT_ID:
    $("#outputProjectId > select").val(nextState.form.outputProjectId)
    break;
  case types.CHANGE_OUTPUT_DATASET_ID:
    $("#outputDatasetId > input").val(nextState.form.outputDatasetId)
    break;
  case types.CHANGE_OUTPUT_TABLE_ID:
    $("#outputTableId > input").val(nextState.form.outputTableId)
    break;

  default:
    break;
  }

  if (nextState.app.showAlert) {
    if ($('.alert').css('display') === 'none') {
      $(".alert > span").html(nextState.app.alertMessage)
      $(".alert").show()
    }
  } else {
    if ($('.alert').css('display') !== 'none') {
      $(".alert").hide()
    }
  }
}
