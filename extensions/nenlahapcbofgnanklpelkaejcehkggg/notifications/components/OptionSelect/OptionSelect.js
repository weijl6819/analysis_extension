import {React} from 'utility/css-ns';
import Select from 'react-select';
import _ from 'lodash';
import './option-select.less';

class OptionSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let options = _.get(this.props, 'options') || [];
    options = _.map(options, (select, i) => {
      return {value: select.value, label: select.label};
    });
    return (
      <div
        className={`${this.props.loading ? 'loading' : ''} ${this.props.className ||
          ''} option-select-component`}>
        {_.get(options, 'length') && !this.props.native ? (
          <Select
            {...this.props}
            style={this.props.style || {}}
            name={this.props.name || 'opton_select'}
            placeholder={this.props.placeholder || 'options'}
            value={this.state.value && this.props.loading ? this.state.value : this.props.value}
            options={options}
            onChange={this.onSelectOption.bind(this, false)}
          />
        ) : _.get(options, 'length') && this.props.native ? (
          <div className="native-select-wrapper">
            <select
              style={this.props.style || {}}
              id={`${this.props.id}-select-options`}
              onChange={this.onSelectOption.bind(this, true, null)}
              value={
                this.state.value && this.props.loading
                  ? this.state.value
                  : this.props.value || 'default'
              }>
              {!this.state.value && !this.props.value ? (
                <option key={'disabled-option'} disabled value="default">
                  {this.props.default || 'change option'}
                </option>
              ) : null}
              {_.map(options, (select, i) => {
                return (
                  <option key={i} value={select.value}>
                    {select.label}
                  </option>
                );
              })}
            </select>
          </div>
        ) : null}
        {this.props.loading ? (
          <div className="loading-wrapper">
            <div className="spinner-option" />
          </div>
        ) : null}
      </div>
    );
  }

  onSelectOption(native, value, e) {
    if (native === true && e) {
      const target =
        e.path && e.path.length && e.path[0] !== e.currentTarget ? e.path[0] : e.currentTarget;
      value = target.value;
    } else {
      value = value.value;
    }
    const option = _.find(_.get(this.props, 'options'), {value: value});
    if (this.props.onSelectOption) {
      this.setState({value: value});
      this.props.onSelectOption(option);
    }
  }
}

export default OptionSelect;
