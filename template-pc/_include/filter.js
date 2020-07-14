etpl.addFilter('dateFormat', function (value, format) {
    return value ? new Date(Number(value)).pattern(format) : '';
});
//数据为空时用 --代替
etpl.addFilter('default', function (value) {
    return value || '--';
});
etpl.addFilter('options', function (value) {
    return encodeURIComponent(value).replace(/;/g, '%3B').replace(/"/g, '%22').replace(/&/g, '%26');
});
