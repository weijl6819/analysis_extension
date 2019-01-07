import {React} from 'utility/css-ns';
import hasFeature from 'utility/hasFeature';
import _ from 'lodash';
import AutosizeInput from 'react-input-autosize';
import Autocomplete from './components/Autocomplete';
import {findDOMNode} from 'react-dom';
import propTypes from 'prop-types';
import './option-select-input.less';

class OptionSelectInput extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      field: null
    };
  }

  render() {
    const autoCompleteData = this.props.autoCompleteData || [];
    const selectItems = this.renderSelectItems();
    const inputEl = this.renderInput();
    const styles = {
      width: this.props.width,
      minHeight: this.props.height
    };

    return (
      <div className="option-select-wrapper">
        <div
          className={this.state.focus ? 'focus option-select-input' : 'option-select-input'}
          onClick={this.focusFieldInput.bind(this)}
          style={styles}>
          <div className="select-control">
            {selectItems}
            {!this.state.editable ? inputEl : null}
          </div>
        </div>
        {autoCompleteData.length && this.state.inputValue ? (
          <Autocomplete
            onAutoCompleteAction={this.onAutoCompleteAction.bind(this)}
            onClickAutoCompleteItem={this.onClickAutoCompleteItem.bind(this)}
            onClearAutoCompleteAction={this.onClearAutoCompleteAction.bind(this)}
            data={this.props.autoCompleteData}
          />
        ) : null}
      </div>
    );
  }

  renderInput(focus) {
    const newInviteFriends =
      hasFeature('referral_get5') ||
      hasFeature('referral_get5_go') ||
      hasFeature('referral_get5_links');
    const hiddenInputStyle = {
      minWidth: 10,
      width: '100%'
    };
    const items = _.get(this.props, 'inputItems.length') ? 'items' : '';
    return (
      <div key={'render-input'} className={`select-input ${!items ? 'placeholder' : ''}`}>
        <AutosizeInput
          placeholder={!items ? this.props.placeholder || 'Enter recipient email addresses' : ''}
          onChange={this.inputUpdate.bind(this)}
          onBlur={this.blurField.bind(this)}
          onFocus={this.focusFieldInput.bind(this)}
          value={this.state.inputValue}
          ref={r => (this.focusField = findDOMNode(r))}
          style={hiddenInputStyle}
        />
      </div>
    );
  }

  renderSelectItems() {
    const editableIndex = _.get(this.state, 'editable.index');
    return _.map(this.props.inputItems, (item, i) => {
      const value = item.value.replace(/ /g, '_');
      const valid = item.valid ? 'valid' : 'invalid';
      return editableIndex === i ? (
        this.renderInput(true)
      ) : (
        <div
          key={`${i}-${value}`}
          className={`select-item ${valid}`}
          onDoubleClick={this.editValue.bind(this, item)}
          onClick={this.stopProp.bind(this)}>
          <div className="flex-wrapper">
            <span className="value">{item.value}</span>
            <span onClick={this.removeValue.bind(this, item)} className="close">
              <span className="icon-x" />
            </span>
          </div>
        </div>
      );
    });
  }

  onAutoCompleteAction() {
    this.setState({autoCompleteAction: true});
  }

  onClearAutoCompleteAction() {
    this.setState({autoCompleteAction: false});
  }

  focusFieldInput() {
    this.setState({focus: true});
    const focusedEl = this.focusField;
    if (focusedEl && focusedEl.childNodes) {
      Array.from(focusedEl.childNodes).forEach(s => {
        if (s.focus) {
          s.focus();
        }
      });
    }
  }

  blurField(e) {
    if (!this.state.autoCompleteAction) {
      this.onKeyDown(e, true);
      this.setState({focus: false});
      const focusedEl = this.focusField;
      if (focusedEl && focusedEl.childNodes) {
        Array.from(focusedEl.childNodes).forEach(s => {
          if (s.blur) {
            s.blur();
          }
        });
      }
    }
  }

  stopProp(e) {
    e.stopPropagation();
  }

  removeValue(value) {
    const items = _.clone(this.props.inputItems);
    const index = _.findIndex(items, {value: value.value});
    items.splice(index, 1);
    this.props.onAddEmail(items);
  }

  editValue(value) {
    const items = _.clone(this.props.inputItems);
    const index = _.findIndex(items, {value: value.value});
    this.setState(
      {
        editable: {
          value: value.value,
          index
        }
      },
      () => {
        this.inputUpdate(null, value.value);
        this.focusFieldInput();
      }
    );
  }

  componentDidMount() {
    this.bindedKeyDown = this.onKeyDown.bind(this);
    this.bindedKeyUp = this.onKeyUp.bind(this);
    document.addEventListener('keydown', this.bindedKeyDown);
    document.addEventListener('keyup', this.bindedKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.bindedKeyDown);
    document.removeEventListener('keyup', this.bindedKeyUp);
  }

  onClickAutoCompleteItem(item, e) {
    this.setState({inputValue: item, autoCompleteAction: false}, () => {
      this.onKeyDown(e, true);
    });
    // trackClick('clickAutoCompleteItem', item, this.props.page);
  }

  inputUpdate(e, valueOverride) {
    const value = e ? this.focusField.querySelector('input').value.replace(',', '') : valueOverride;
    if (this.props.autoCompleteFilter && this.state.inputValue) {
      this.props.autoCompleteFilter(value);
    }
    this.setState({inputValue: value});
  }

  newInputField(value = '') {
    this.setState({inputValue: value, editable: null}, () => {
      this.focusFieldInput();
    });
  }

  onKeyUp() {
    const focusedEl = this.focusField;
    let value = '';
    if (focusedEl && focusedEl.childNodes) {
      Array.from(focusedEl.childNodes).forEach(s => {
        if (s.value && !value) {
          value = s.value;
        }
      });
      value = value.trim();
    }

    if (this.state.focus && value) {
      if (!this.props.validation(value) && this.props.valid) {
        this.props.onValidEdit(false);
      } else if (this.props.validation(value)) {
        this.props.onValidEdit(value);
      }
    }
  }

  onKeyDown(e, blur) {
    if (this.state.autoCompleteAction) {
      return;
    }
    const editable = _.get(this.state, 'editable');
    const focusedEl = this.focusField;
    let value = '';
    if (focusedEl && focusedEl.childNodes) {
      Array.from(focusedEl.childNodes).forEach(s => {
        if (s.value && !value) {
          value = s.value;
        }
      });
      value = value.trim();
    }
    let options = _.clone(this.props.inputItems);
    const actionKey = e.which === 13 || e.which === 188 || e.which === 9 || e.which === 32;

    if (e.which === 13 && !this.state.inputValue) {
      e.preventDefault();
    }

    if (
      this.state.focus &&
      e.which === 8 &&
      (!value || value.length === 1) &&
      options &&
      options.length
    ) {
      if (editable && options.length === 1) {
        // Editing one item left
        e.preventDefault();
        this.removeValue(options[options.length - 1]);
        setTimeout(() => {
          this.newInputField();
        });
      } else if (editable && options.length > 1) {
        // Editing multple items left
        e.preventDefault();
        const next = options[options.length - 2];
        if (next) {
          this.removeValue(options[options.length - 1]);
          setTimeout(() => {
            this.editValue(next);
          });
        }
      } else if (!editable) {
        // Not editing
        e.preventDefault();
        this.editValue(options[options.length - 1]);
      }
      return;
    }

    if (this.state.focus && (actionKey || blur) && value) {
      e.preventDefault();
      const inputObj = _.map(value.split(' '), value => {
        return {
          value,
          valid: this.props.validation(value)
        };
      });

      if (editable) {
        _.forEach(inputObj, (value, i) => {
          options[editable.index + i] = value;
        });
      } else {
        options = options.concat(inputObj);
      }
      this.props.onAddEmail(_.uniq(options));
      this.newInputField();
    }
  }
}

OptionSelectInput.defaultProps = {
  inputItems: [],
  width: '100%',
  height: '70px'
};

OptionSelectInput.propTypes = {
  width: propTypes.string,
  height: propTypes.string,
  inputItems: propTypes.array.isRequired,
  autoCompleteFilter: propTypes.func,
  autoCompleteData: propTypes.array,
  page: propTypes.string
};

module.exports = OptionSelectInput;
