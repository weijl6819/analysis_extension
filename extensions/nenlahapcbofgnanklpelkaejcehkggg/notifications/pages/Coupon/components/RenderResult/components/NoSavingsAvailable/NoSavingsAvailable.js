import {React} from 'utility/css-ns';
import {WIKIBUY_URL} from 'constants';
import {Component} from 'react';
import copyToClip from 'utility/copyToClip';
import sendMetric from 'utility/sendMetric';
import hasFeature from 'utility/hasFeature';
import {activateThroughPinnedTab} from 'actions/cashbackActions';
import _ from 'lodash';
import './no-savings-available.less';

class NoSavingsAvailable extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      viewCodes: false
    };
  }

  componentDidMount() {
    const {reward, postCoupons} = this.props;
    if (reward && reward.amount && (!postCoupons || !hasFeature('sup_post_cp'))) {
      activateThroughPinnedTab();
    }
  }

  render() {
    const {runTimeSeconds, couponCount, reward, codes, postCoupons, requiresInput} = this.props;
    const rewardFound = reward && reward.amount && (!postCoupons || !hasFeature('sup_post_cp'));
    return (
      <div className="no-savings-wrapper">
        <div className="no-savings-header">
          {requiresInput ? (
            <h2>Code Entered</h2>
          ) : rewardFound ? (
            <h2>Credit Activated</h2>
          ) : (
            <h2>No Savings Available.</h2>
          )}
          {codes && codes.length ? (
            <div className="view-codes-link-wrapper">
              <h6
                onClick={
                  rewardFound ? () => this.setState({viewCodes: !this.state.viewCodes}) : null
                }
                className={`${rewardFound ? 'clickable' : ''} bold"`}>
                {this.state.viewCodes ? (
                  <span>hide codes</span>
                ) : (
                  <span>
                    {couponCount} {couponCount === 1 ? ' code ' : ' best codes '} tested in{' '}
                    {runTimeSeconds} sec.
                  </span>
                )}
              </h6>
            </div>
          ) : null}
        </div>

        {this.state.viewCodes || !rewardFound ? (
          <div className="view-codes">
            {_.map(codes, (wc, i) => {
              const copied = this.state.copied === wc.code;
              return (
                <div
                  onClick={this.onClickCopy.bind(this, wc.code)}
                  key={i}
                  style={{animationDelay: `${(i + 1) * 50}ms`}}
                  className={`coupon-list-item-container gray ${copied ? 'copied' : ''}`}>
                  <h4 className="code midnight bold">
                    {copied ? <span className="copied-text">COPIED</span> : wc.code}
                    <span className="hidden">{wc.code}</span>
                  </h4>
                </div>
              );
            })}
          </div>
        ) : null}

        {rewardFound ? (
          <div className="center-content">
            <div className="activation-amount">
              <h3 className="silver">
                <span className="palmetto bold">
                  {reward.type === 'percentage'
                    ? `+${reward.amount / 100}%`
                    : `$${reward.amount / 100}`}
                </span>{' '}
                <span className="antialiased">Wikibuy Credit</span>
              </h3>
              {_.get(this.props, 'exclusions') ? (
                <h6
                  style={{
                    height: '19px',
                    marginTop: '1px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                  *Exclusions apply,<span
                    style={{paddingLeft: '3px'}}
                    className="tertiary-link-lighter"
                    onClick={this.onShowExclusion.bind(this)}>
                    {' '}
                    view details.
                  </span>
                </h6>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="center-content">
            <h6 className="bold">
              {couponCount} {couponCount === 1 ? ' code ' : ' best codes '} tested in{' '}
              {runTimeSeconds} sec.
            </h6>
          </div>
        )}
        <div className="dismiss-notif">
          <h4 className="primary-link bold" onClick={this.props.onClosePopup.bind(this)}>
            Continue to Checkout
          </h4>
        </div>
      </div>
    );
  }

  onShowExclusion() {
    sendMetric('trackClick', 'viewExclusionDetails', 'view details', {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    });
    window.open(`${WIKIBUY_URL}/s/${this.props.tld}/coupon`, '_blank');
  }

  onClickCopy(coupon) {
    copyToClip(coupon);
    this.setState({copied: coupon}, () => {
      this.timeoutId = setTimeout(() => {
        this.setState({copied: false});
      }, 1000);
    });
    sendMetric('trackClick', 'copyCouponCode', 'code', {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    });
  }
}

export default NoSavingsAvailable;
