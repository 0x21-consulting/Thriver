Template["afObjectField_series"].getOptions = function (itemFieldName, fieldName) {
  if (fieldName === 'reference') {
    var type = AutoForm.getFieldValue(formId, itemFieldName + '.type');
    return References.find({type: type}).map(function(doc){
      return {label: doc.name, value: doc.id};
    });
  }
};