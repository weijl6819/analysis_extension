import {React} from 'utility/css-ns';
import {Component} from 'react';
import _ from 'lodash';
import './auto-complete.less';

class Autocomplete extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      active: -1
    };
  }

  componentDidMount() {
    this.bindedKeyDown = this.onKeyDown.bind(this);
    document.addEventListener('keydown', this.bindedKeyDown);
  }

  componentWillUnmount() {
    this.props.onClearAutoCompleteAction();
    document.removeEventListener('keydown', this.bindedKeyDown);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({active: -1});
      this.props.onClearAutoCompleteAction();
    }
  }

  onKeyDown(e) {
    if (e.which === 38 && this.state.active > 0) {
      // up arrow
      e.preventDefault();
      this.props.onAutoCompleteAction();
      this.setState({active: this.state.active - 1});
      this.scrollToActive(-1);
    } else if (e.which === 40 && this.state.active < this.props.data.length - 1) {
      // down arrow
      e.preventDefault();
      this.props.onAutoCompleteAction();
      this.setState({active: this.state.active + 1});
      this.scrollToActive(1);
    } else if (e.which === 13 && this.state.active > -1) {
      e.stopPropagation();
      e.preventDefault();
      const data = this.props.data[this.state.active];
      this.props.onClickAutoCompleteItem(data.email, e);
    } else if (e.which === 38 || e.which === 40) {
      e.preventDefault();
    }
  }

  scrollToActive(direction) {
    const pos = this.activeItem.offsetTop;
    this.scrollList.scrollTop = pos;
  }

  render() {
    return (
      <div ref={r => (this.scrollList = r)} className="auto-complete-wrapper">
        <ul className="auto-complete">
          {_.map(this.props.data, (data, i) => {
            const active = this.state.active === i;
            return (
              <li
                ref={r => (active ? (this.activeItem = r) : null)}
                className={active ? 'active' : ''}
                onMouseDown={this.props.onAutoCompleteAction.bind(this)}
                onMouseOver={this.setActive.bind(this, i)}
                onClick={this.props.onClickAutoCompleteItem.bind(this, data.email)}
                key={`auto-complete-item-${i}`}>
                <h3 className="bold">{data.name}</h3>
                <h3>{data.email}</h3>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  setActive(index) {
    this.setState({active: index});
  }
}

export default Autocomplete;
