import {React} from 'utility/css-ns';
import {Component} from 'react';
import _ from 'lodash';
import checkCouponWork from 'messenger/outbound/checkCouponWork';
import sendMetric from 'utility/sendMetric';
import './check-coupon-work.less';

class CheckCouponWork extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      step: 'links'
    };
  }

  check(data) {
    sendMetric('trackClick', 'visitCouponSite', {});
    checkCouponWork(data);
    this.timeout = setTimeout(() => {
      this.setState({step: 'share'});
    }, 1000);
  }

  submitCode(e) {
    e.preventDefault();
    e.stopPropagation();
    sendMetric('trackClick', 'shareCouponCode', {code: this.r.value});
    this.setState({step: 'thanks'});
  }

  render() {
    return (
      <div className="check-coupon-work">
        {this.state.step === 'links' ? (
          <div className="coupon-check-wrapper">
            <h3 className="bold">Wanna double check our work?</h3>
            <h6 className="light">Here's a couple links to popular coupon sites.</h6>
            <h4
              className="primary-link"
              onClick={this.check.bind(this, {type: 'rmn', tld: this.props.domain})}>
              RetailMeNot
            </h4>
            <h4
              className="primary-link"
              onClick={this.check.bind(this, {type: 'coupon', tld: this.props.domain})}>
              Coupons.com
            </h4>
          </div>
        ) : this.state.step === 'share' ? (
          <div className="coupon-check-wrapper">
            <h3 className="bold">Find a better code?</h3>
            <h6 className="light">Pay it forward and share with the community.</h6>
            <form onSubmit={this.submitCode.bind(this)}>
              <input ref={r => (this.r = r)} />
              <button className="primary-btn-large">Share</button>
            </form>
          </div>
        ) : (
          <div className="coupon-check-wrapper">
            <h3 style={{padding: '0 40px', marginBottom: 10}} className="bold">
              Thanks for the help.
            </h3>
            <h6 style={{padding: '0 40px', marginBottom: 10}} className="light">
              Our goal is to make it so when one person finds a great deal, it helps everyone else
              save money.
            </h6>
            <h6 style={{padding: '0 40px', marginBottom: 10}} className="light">
              Every time you share, Wikibuy gets smarter.
            </h6>
          </div>
        )}
      </div>
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
}

export default CheckCouponWork;
