

export function buildContext(dataset){
return {
  datasetName : dataset.originalName ,
 rows : dataset.rowCount,
  columns : dataset.columnCount,
 schema : dataset.columns,
  candidates :dataset.candidates,
  dashboard : dataset.dashboard??null
}
}