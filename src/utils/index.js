import _ from 'lodash'

export const toBigQueryDataType = dataType => {
  const TYPE_MAP = {
    int: "INTEGER",
  }
  return _.get(TYPE_MAP, dataType, _.toUpper(dataType))
}
