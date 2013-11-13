exports.objectContainsFields = function (object, fields) {
    var contains = true;
    
    fields.every(function (field) {
        // if object has no property with field name, stop loop
        return contains = contains && object.hasOwnProperty(field);
    });

    return contains;
};