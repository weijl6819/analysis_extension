import {React} from 'utility/css-ns';
import {Component} from 'react';
import {WIKIBUY_URL} from 'constants';
import RewardsActivation from './components/RewardsActivation';
import AreYouSure from './components/AreYouSure';
import Gear from 'components/Gear';
import PartnerLogo from 'components/PartnerLogo';
import PageProduceImage from 'components/PageProduceImage';
import currentDomain from 'utility/currentDomain';
import sendMetric from 'utility/sendMetric';
import hasFeature from 'utility/hasFeature';
import _ from 'lodash';
import './cash-back-resolve.less';

class CashBackResolve extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onShowSettings(e) {
    e.stopPropagation();
    const url = `${WIKIBUY_URL}/account-settings/notifications?section=cashback`;
    sendMetric('trackClick', 'showSettingSiteHub', 'x', {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    });
    window.open(url, '_blank');
  }

  onShowExclusion() {
    sendMetric('trackClick', 'viewExclusionDetails', 'view details', {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    });
    window.open(
      `${WIKIBUY_URL}/s/${_.get(this.props.view, 'deweyResult.domain')}/coupon`,
      '_blank'
    );
  }

  onActivateLater(e) {
    e.stopPropagation();
    if (hasFeature('cb_ays') && !(this.props.activated || this.props.activating)) {
      this.setState({showConfirmation: true});
    } else {
      this.props.onUserClosePopup('activate later');
    }
  }

  onConfirmDismiss() {
    sendMetric('trackClick', 'cashbackConfirmDismiss', '', {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    });
    this.props.onUserClosePopup('activate later');
  }

  render() {
    return (
      <div className="cash-back-resolve">
        {hasFeature('cb_cta_ui_control') ? (
          <Gear onClick={this.onShowSettings.bind(this)} style={{position: 'fixed'}} />
        ) : (
          <div
            className="close icon-x"
            onClick={
              this.state.showConfirmation
                ? this.onConfirmDismiss.bind(this)
                : this.onActivateLater.bind(this)
            }
          />
        )}
        {this.state.showConfirmation ? (
          <AreYouSure {...this.props} onConfirmDismiss={this.onConfirmDismiss.bind(this)} />
        ) : (
          <div className="credit-prompt">
            {this.props.largeCashbackNotification &&
            !(
              hasFeature('credits_redemption_prompt') &&
              _.get(this.props, 'userCreditAmount.amount') >= 0
            ) ? (
              <div className="icon-credit" />
            ) : hasFeature('ext_coupon_product_img') ? (
              <PageProduceImage
                notificationType="cashback"
                deweyResult={this.props.deweyResult}
                domain={currentDomain()}
                cursor={'auto'}
              />
            ) : hasFeature('ext_cnc_img_logo') ? (
              <PartnerLogo
                domain={currentDomain()}
                cursor={hasFeature('ext_cnc_point_show') ? 'pointer' : 'auto'}
              />
            ) : null}
            <RewardsActivation {...this.props} />
            {hasFeature('cb_cta_ui_control') && !this.props.activating && !this.props.activated ? (
              <h4
                className="bold activate-later tertiary-link"
                onClick={this.onActivateLater.bind(this)}>
                Activate later
              </h4>
            ) : (this.props.activated || this.props.activating) &&
            _.get(this.props, 'view.exclusions') ? (
              <h6 style={{height: '29px', marginTop: '4px', display: 'flex', alignItems: 'center'}}>
                *Exclusions apply,<span
                  style={{paddingLeft: '3px'}}
                  className="tertiary-link-lighter"
                  onClick={this.onShowExclusion.bind(this)}>
                  {' '}
                  view details.
                </span>
              </h6>
            ) : (
              <div style={{height: '14px'}} />
            )}
          </div>
        )}
      </div>
    );
  }
}

export default CashBackResolve;
