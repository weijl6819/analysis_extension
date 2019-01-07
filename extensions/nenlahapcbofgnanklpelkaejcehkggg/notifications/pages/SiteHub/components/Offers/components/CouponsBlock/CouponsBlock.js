import {React} from 'utility/css-ns';
import {Component} from 'react';
import _ from 'lodash';
import Collapse from 'react-collapse';
import CouponListItem from '../CouponListItem';

class CouponsBlock extends Component {
  state = {
    showCoupons: false
  };

  componentWillMount() {
    if (
      (this.props.couponsThrottled || this.props.couponsType === 'eeyore') &&
      this.props.hideInitialCoupons === false
    ) {
      this.setState({showCoupons: true});
    }
  }

  componentWillReceiveProps(nextProps) {
    const showCoupons =
      nextProps.hideInitialCoupons === false &&
      (_.get(nextProps, 'couponsThrottled') || nextProps.couponsType === 'eeyore');
    if (this.state.showCoupons !== showCoupons) {
      this.setState({
        showCoupons:
          nextProps.hideInitialCoupons === false &&
          (_.get(nextProps, 'couponsThrottled') || nextProps.couponsType === 'eeyore')
      });
    }
  }

  render() {
    const {coupons, couponsThrottled, storeName, onTryCodes, reward} = this.props;
    if (!coupons || !coupons.length || window.location.hostname === 'www.amazon.com') {
      return null;
    }
    return (
      <div className="section">
        <h2>
          Found {coupons.length}{' '}
          {`${coupons.length === 1 ? 'code' : 'codes'} ${storeName ? `for ${storeName}.` : ''}`}
          {reward && couponsThrottled && this.props.couponsType !== 'eeyore' ? (
            <span>
              {' '}
              <br /> Plus get{' '}
              <span className="palmetto">
                {reward.type === 'percentage'
                  ? `${reward.amount / 100}% back`
                  : `$${reward.amount / 100} in credit`}
              </span>.
            </span>
          ) : null}
        </h2>
        {couponsThrottled && this.props.couponsType !== 'eeyore' ? (
          <div className="button-wrapper">
            <button
              className="primary-btn-large full-button-coupons"
              onClick={onTryCodes.bind(this)}>
              Try Codes
            </button>
          </div>
        ) : null}
        <Collapse isOpened={this.state.showCoupons} className="collapse">
          <h4 className="bold">click a coupon code to copy.</h4>
          <div className="codes">
            {_.map(coupons, (coupon, i) => {
              if (coupon.restrictions) {
                try {
                  coupon.restrictions = JSON.parse(coupon.restrictions).str;
                } catch (e) {}
              }

              return <CouponListItem key={i} coupon={coupon} />;
            })}
          </div>
        </Collapse>
        <h4
          className="wb-show-hide-btn"
          onClick={() => this.setState({showCoupons: !this.state.showCoupons})}>{`${
          !this.state.showCoupons ? 'Show available codes' : 'Hide codes'
        }`}</h4>
      </div>
    );
  }
}

export default CouponsBlock;
