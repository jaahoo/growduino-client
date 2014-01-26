(function() {

var utils = window.utils = {};

utils.fixNull = function(values) {
    return values.map(function(val) {
        return val == -999 ? null : val;
    });
};

utils.mapDecimalValues = function(values) {
    return values.map(function(val) {
        if (val === null) return null;
        return val / 10.0;
    });
};

utils.mapPercentValues = function(values) {
    return values.map(function(val) {
        if (val === null) return null;
        return Math.round(val / 1.024) / 10.0;
    });
};

utils.formatDate = function(date, fmt) {
    //using parser in Bootstrap Datetime Picker
    var g = $.fn.datetimepicker.DPGlobal;

    var utcDate = new Date();
    var time = date.getTime() - date.getTimezoneOffset() * 60 * 1000;
    utcDate.setTime(time);
    return g.formatDate(utcDate, g.parseFormat(fmt, 'standard'), 'cs', 'standard');
};

})();