export default {
  form: {
    analyzeType: "分析内容",
    annotateText: "構文解析",
    analyzeEntities: "エンティティ分析",
    analyzeSentiment: "感情分析",
    analyzeEntitySentiment: "エンティティ感情分析",
    outputMode: {
      label: "結果を",
      create: "新規テーブルに出力する",
      override: "既存のデータソースに上書きする",
    }
  },
  completion: {
    create: _.template("<strong><%- projectId %></strong> プロジェクトの <strong><%- datasetId %>.<%- tableId %></strong> のテーブルに結果を格納しました。データソースとして取り込んで分析しましょう。"),
    override: _.template("<strong><%- projectId %></strong> プロジェクトの <strong><%- datasetId %>.<%- tableId %></strong> のテーブルに結果を上書きしました。"),
  },
  invalid: {
    pleaseSelect: "選択してください",
    pleaseEnter: "入力してください",
  },
}
