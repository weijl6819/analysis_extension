import {React} from 'utility/css-ns';
import _ from 'lodash';
import './tooltip.less';

class Tooltip extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  componentWillMount() {}

  render() {
    let style = this.props.style || {};
    if (this.props.delay) {
      const delay = {
        animationDelay: this.props.delay
      };
      style = _.merge(delay, style);
    }
    return (
      <div style={style} className={`new-tooltip ${this.props.position || ''}`}>
        <div
          style={this.props.innerStyle || {}}
          onClick={this.props.onDismissTooltip.bind(this)}
          className="new-tooltip-wrapper">
          <div className="close icon-x" />
          <h2>
            {this.props.tip ? (
              <span className="bold">{this.props.tipLabel ? this.props.tipLabel : 'tip:'}</span>
            ) : null}
            {this.props.message}
          </h2>
        </div>
      </div>
    );
  }
}

export default Tooltip;
