import {React} from 'utility/css-ns';
import {Component} from 'react';
import CouponList from '../RenderResult/components/CouponList';
import uuid from 'node-uuid';
import {dropCookie} from 'actions/couponActions';
import {activateThroughPinnedTab} from 'actions/cashbackActions';
import hasFeature from 'utility/hasFeature';
import sendMetric from 'utility/sendMetric';
import currentDomain from 'utility/currentDomain';

class NoScript extends Component {
  state = {
    showCodes: false
  };

  render() {
    const {coupons, result, couponCount} = this.props.view;
    const {reward, postCoupons} = this.props;
    const showReward =
      reward &&
      reward.amount &&
      (!postCoupons ||
        hasFeature('cp_credits_with_coupon_saver') ||
        hasFeature('cp_credits_with_coupon_no_saver'));
    return (
      <div className={`${hasFeature('coupon_lg_cta') ? 'large-notif' : ''}`}>
        <div className="found-codes">
          {hasFeature('coupon_lg_cta') && !this.state.showCodes ? (
            <div className="icon-credit" />
          ) : null}
          {this.props.reward && this.state.showCodes ? (
            <h2>
              Activated{' '}
              <span className="palmetto">
                {reward.type === 'percentage'
                  ? `${reward.amount / 100}% back`
                  : `$${reward.amount / 100} in credit`}
              </span>
            </h2>
          ) : (
            <h2>
              <span>
                Found {couponCount} {couponCount === 1 ? 'code' : 'codes'}
              </span>
              {showReward ? (
                <span>
                  {' '}
                  and <br />get{' '}
                  <span className="palmetto">
                    {reward.type === 'percentage'
                      ? `${reward.amount / 100}% back`
                      : `$${reward.amount / 100} in credit`}
                  </span>
                </span>
              ) : null}
            </h2>
          )}
          {this.state.showCodes ? (
            <h4 className="bold">click code to copy to clipboard.</h4>
          ) : (
            <h4 className="bold">click show {couponCount === 1 ? 'code' : 'codes'} to save.</h4>
          )}
        </div>
        {this.state.showCodes ? (
          <div className="run-codes">
            <CouponList
              show={true}
              result={result}
              running={false}
              coupons={coupons}
              stagger={0}
              collapsable={true}
            />
          </div>
        ) : (
          <button
            className="primary-btn-large"
            style={{width: '100%', fontWeight: 'bold', marginTop: '20px'}}
            onClick={this.onShowCodes.bind(this)}>
            Show {couponCount === 1 ? 'code' : 'codes'}
          </button>
        )}
      </div>
    );
  }

  onShowCodes() {
    const reward = this.props.reward;
    const domain = currentDomain();
    sendMetric('trackClick', 'showCodesButton', 'show codes', {
      domain,
      pagePath: location.pathname
    });
    if (this.props.reward) {
      activateThroughPinnedTab();
      sendMetric('track', 'activateCashbackRedirect', {
        domain,
        pagePath: location.pathname,
        rewardAmount: reward.amount,
        rewardDisplay: reward.type
      });
    } else {
      const clickId = uuid.v4().replace(/-/, '');
      dropCookie(clickId);
      sendMetric('track', 'showCodes', {
        domain,
        clickId
      });
    }
    this.setState({showCodes: true});
  }
}

export default NoScript;
