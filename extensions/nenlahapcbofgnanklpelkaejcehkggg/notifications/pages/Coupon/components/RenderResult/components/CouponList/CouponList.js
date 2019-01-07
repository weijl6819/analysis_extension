import {React} from 'utility/css-ns';
import {Component} from 'react';
import _ from 'lodash';
import Collapse from 'react-collapse';
import copyToClip from 'utility/copyToClip';
import sendMetric from 'utility/sendMetric';

class CouponListItem extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      copied: false
    };
  }

  render() {
    const coupon = this.props.coupon;
    const stagger = this.props.result && !this.props.running;
    return (
      <div className={this.state.copied ? 'copied' : ''}>
        <div className="coupon-list-item-container" onClick={this.onClickCopy.bind(this)}>
          <div className="details">
            <h4 className="code midnight bold">{coupon.code}</h4>
          </div>
          <div className="savings">
            {this.state.copied ? <span className="copied-text">Copied</span> : null}
            {coupon.success && !this.props.disableChecks ? (
              <svg viewBox="0 0 150 150">
                <path
                  d="M10,30 l30,50 l95,-70"
                  fill="none"
                  strokeWidth="15"
                  style={{
                    stroke: '#01c049',
                    strokeDasharray: '180px, 180px',
                    strokeDashoffset: '0px',
                    animationDelay: stagger ? '0ms' : `${this.props.stagger * this.props.index}ms`
                  }}
                />
              </svg>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
  onClickCopy() {
    this.setState({copied: copyToClip(this.props.coupon.code)}, () => {
      this.timeoutId = setTimeout(() => {
        this.setState({copied: false});
      }, 1000);
    });
    sendMetric('trackClick', 'copyCouponCode', 'code', {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }
}

CouponListItem.defaultProps = {
  stagger: 400
};

export default function CouponList(props) {
  if (!props.collapsable) {
    return (
      <div className={`code-list ${props.className || ''}`}>
        {_.map(props.coupons, (coupon, i) => {
          return (
            <CouponListItem
              running={props.running}
              result={props.result}
              key={i}
              index={i}
              coupon={coupon}
              stagger={props.stagger}
              disableChecks={props.disableChecks}
            />
          );
        })}
      </div>
    );
  }
  return (
    <Collapse isOpened={!!props.show} className="collapse">
      <div className={`code-list ${props.className || ''}`}>
        {_.map(props.coupons, (coupon, i) => {
          return (
            <CouponListItem
              running={props.running}
              result={props.result}
              key={i}
              index={i}
              coupon={coupon}
              stagger={props.stagger}
              disableChecks={props.disableChecks}
            />
          );
        })}
      </div>
    </Collapse>
  );
}
