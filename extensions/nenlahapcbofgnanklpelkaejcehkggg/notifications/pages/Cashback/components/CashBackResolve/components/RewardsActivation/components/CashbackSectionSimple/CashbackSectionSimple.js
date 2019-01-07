import {React} from 'utility/css-ns';
import {Component} from 'react';
import tldjs from 'tldjs';
import sendMetric from 'utility/sendMetric';
import _ from 'lodash';
import hasFeature from 'utility/hasFeature';
import isFullAccount from 'utility/isFullAccount';
import {WIKIBUY_URL} from 'constants';
import CreditsRedemptionPrompt from './CreditsRedemptionPrompt';
import './cashback-section-simple.less';

class CashbackSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: isFullAccount()
    };
    this.ebatesComparisonSiteList = [
      'macys.com',
      'oakley.com',
      'puritanspride.com',
      'ebay.com',
      'walmart.com',
      'marriott.com',
      'sephora.com',
      'zulily.com',
      'tirerack.com',
      'ancestry.com',
      'samsclub.com',
      'samsung.com',
      'nordvpn.com',
      'priceline.com',
      'qvc.com',
      'microsoftstore.com',
      'starwoodhotels.com',
      'discounttire.com',
      'officedepot.com',
      'lifelock.com',
      'omahasteaks.com',
      'woot.com',
      'coursera.org',
      'sixt.com',
      'wsj.com',
      'gilt.com'
    ];
  }
  render() {
    const activating = this.props.activating && !this.state.hasClickedToLogin;
    const activated = this.props.activated && !this.state.hasClickedToLogin;

    const reward = _.get(this.props.view, 'reward');
    const storeName = _.get(this.props.view, 'vendor');
    const deweyResult = _.get(this.props.view, 'deweyResult');
    const showRewardInNotification = _.get(this.props.view, 'showRewardInNotification');

    const domain = tldjs.getDomain(location.href);
    const showEbatesComparison = this.ebatesComparisonSiteList.indexOf(domain) > -1;

    const cartTotal =
      hasFeature('cb_notification_dollar_amt') && _.get(deweyResult, 'pageData.order.total');
    let cbDollarAmt;
    if (cartTotal && reward.type === 'percentage') {
      if (reward.amount) {
        cbDollarAmt = _.round((cartTotal / 100) * (reward.amount / 100), 2);
      }
    } else if (reward.type !== 'percentage') {
      if (reward.amount) {
        cbDollarAmt = reward.amount / 100;
      }
    }

    const ebatesReward = _.get(this.props, 'view.ebatesReward', {});
    let ebatesDollarAmt;
    if (ebatesReward.display !== 'Percentage' && ebatesReward.amount) {
      ebatesDollarAmt = reward.amount / 100;
    }

    const showOffer = activating || activated;
    const cta = hasFeature('credits_redemption_prompt') ? (
      cbDollarAmt ? (
        <span>
          Activate <span>${cbDollarAmt}</span> in credit
        </span>
      ) : (
        <span>
          Activate <span>{reward.amount / 100}%</span> back
        </span>
      )
    ) : (
      'Ok'
    );
    return hasFeature('cb_cta_with_ebates_bold') && showEbatesComparison && ebatesReward.amount ? (
      <div className="simple-section">
        <h2>Found 1 offer</h2>
        <div className="comparison-wrapper">
          <div className="competitor">
            <h4 className="title bold">ebates</h4>
            <h2 className="amount">
              {ebatesDollarAmt ? `$${ebatesDollarAmt}` : `${parseFloat(ebatesReward.amount)}%`}
            </h2>
            <div className="footer">
              <h6 className="light">get paid in</h6>
              <h6 className="bold">3 months</h6>
            </div>
          </div>

          <div className="wb">
            <h4 className="title bold palmetto">Wikibuy</h4>
            <h2 className="amount">
              {cbDollarAmt ? `$${cbDollarAmt}` : `${reward.amount / 100}%`}
            </h2>
            <div className="footer">
              <h6 className="light">get paid in</h6>
              <h6 className="bold">2 days</h6>
            </div>
          </div>
        </div>

        {isFullAccount() ? (
          <div className="button-wrapper">{this.renderControl()}</div>
        ) : (
          <div className="button-wrapper">
            <button className="primary-btn-large" onClick={this.onClickSignIn.bind(this)}>
              Ok
            </button>
          </div>
        )}
      </div>
    ) : hasFeature('cb_cta_with_ebates_text') && showEbatesComparison && ebatesReward.amount ? (
      <div className="simple-section">
        <h2>Found 1 offer</h2>
        <h4 style={{marginBottom: '2px'}} className="bold">
          {ebatesDollarAmt ? `$${ebatesDollarAmt}` : `${parseFloat(ebatesReward.amount)}%`} back on
          Ebates
        </h4>
        <h4 style={{marginBottom: '15px'}} className="bold">
          {cbDollarAmt ? `$${cbDollarAmt}` : `${reward.amount / 100}%`} back on Wikibuy
        </h4>
        {isFullAccount() ? (
          <div className="button-wrapper">{this.renderControl()}</div>
        ) : (
          <div className="button-wrapper">
            <button className="primary-btn-large" onClick={this.onClickSignIn.bind(this)}>
              Ok
            </button>
          </div>
        )}
      </div>
    ) : (
      <div className="simple-section">
        {!showOffer ? (
          <h2>Found 1 offer</h2>
        ) : cbDollarAmt ? (
          <h2>
            Activating <span className="green">${cbDollarAmt}</span> in credit
          </h2>
        ) : (
          <h2>
            Activating <span className="green">{reward.amount / 100}%</span> back
          </h2>
        )}
        {!showOffer && showRewardInNotification ? (
          cbDollarAmt ? (
            <h4>
              <span>${cbDollarAmt}</span> in credit.
            </h4>
          ) : (
            <h4>
              <span>{reward.amount / 100}%</span> back.
            </h4>
          )
        ) : (
          <h4 className="bold">on {storeName}.</h4>
        )}

        {hasFeature('credits_redemption_prompt') &&
        _.get(this.props, 'userCreditAmount.amount') >= 0 ? (
          <CreditsRedemptionPrompt
            rewardAmount={cbDollarAmt || reward.amount}
            userCreditAmount={this.props.userCreditAmount}
          />
        ) : null}

        {isFullAccount() ? (
          <div className="button-wrapper">{this.renderControl(cta)}</div>
        ) : (
          <div className="button-wrapper">
            <button className="primary-btn-large" onClick={this.onClickSignIn.bind(this)}>
              {cta}
            </button>
          </div>
        )}
      </div>
    );
  }

  renderControl(cta) {
    const activating = this.props.activating && !this.state.hasClickedToLogin;
    const activated = this.props.activated && !this.state.hasClickedToLogin;
    const buttonPulse = hasFeature('ext_cnc_btn_pulse');
    return activated ? (
      <button className="primary-btn-large" disabled={true}>
        Activated
      </button>
    ) : activating ? (
      <button className="primary-btn-large" disabled={true}>
        Activating
      </button>
    ) : (
      <button
        className={`primary-btn-large ${buttonPulse ? 'button-pulse' : ''}`}
        onClick={e => {
          e.stopPropagation();
          this.props.onActivate();
        }}>
        {cta || 'Ok'}
      </button>
    );
  }

  onClickSignIn(e) {
    e.stopPropagation();
    const storeName = _.get(this.props.view, 'vendor');
    if (storeName !== 'eBay') {
      this.props.onActivate({preventHide: !this.state.hasClickedToLogin});
    }
    sendMetric('track', 'signinRequired', {
      vendor: storeName
    });
    window.open(`${WIKIBUY_URL}/sign-in`);
    this.setState({hasClickedToLogin: true});
  }

  onChangeValue(percent) {
    if (!isFullAccount() && !this.state.hasClickedToLogin) {
      this.onClickSignIn();
    } else {
      this.props.onActivate();
      this.setState({percent});
      this.setState({hasClickedToLogin: false});
    }
  }
}

export default CashbackSection;
