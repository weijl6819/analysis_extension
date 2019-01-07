import {React} from 'utility/css-ns';
import {Component} from 'react';
import './annotation-tooltip.less';

class AnnotationTooltip extends Component {
  render() {
    return (
      <div
        className={`annotation-tooltip-component ${this.props.classes || ''}`}
        onClick={e => {
          e.stopPropagation();
        }}>
        <div className="annotation-tooltip-container">
          <div className="header">
            <div className="logo" />
            <div className="close icon-x" onClick={this.props.onCloseTooltip.bind(this, 'x')} />
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default AnnotationTooltip;
