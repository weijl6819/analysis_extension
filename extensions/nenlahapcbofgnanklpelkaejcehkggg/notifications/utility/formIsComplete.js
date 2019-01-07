import _ from 'lodash';

export default function formIsComplete(form) {
  let value = true;
  _(form.fields).forEach(function(input, key) {
    const noValueButIsrequired = !form.data[key] && input.required;
    const formErrors = form._errors && _.keys(form._errors.errors).length;
    const valueButEmpty =
      form.data[key] &&
      typeof form.data[key] === 'string' &&
      !form.data[key].trim() &&
      input.required;

    if (noValueButIsrequired || formErrors || valueButEmpty) {
      value = false;
    }
  });
  return value;
}

export function hasSelectedInput(form) {
  let value = false;
  _(form.fields)
    .forEach(function(input, key) {
      if (form.data[key] === 'on') {
        value = true;
      }
    })
    .value();
  return value;
}

export function rawFormHasValues(form) {
  let value = true;
  const inputs = _.filter(form, input => {
    return input.type !== 'submit';
  });

  _(inputs)
    .forEach(function(input) {
      if (!input.value) {
        value = false;
      }
    })
    .value();

  return value;
}
