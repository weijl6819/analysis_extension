import {React} from 'utility/css-ns';
import {Component} from 'react';
import _ from 'lodash';
import sendMetric from 'utility/sendMetric';
import {saveNotificationSettings} from 'actions/offersActions';
import RewardsText from './components/RewardsText';
import ActivateButton from './components/ActivateButton';
import isFullAccount from 'utility/isFullAccount';
import {WIKIBUY_URL} from 'constants';
import './cash-back-block.less';

class CashBackBlock extends Component {
  constructor(props) {
    super(props);
    this.toggleSettingsVisible = this.toggleSettingsVisible.bind(this);
    this.handleSaveNotificationSettings = this.handleSaveNotificationSettings.bind(this);
    this.state = {
      settingsVisible: false,
      notificationSetting: _.get(props.cashback, 'user.notifications.notificationSetting'),
      isFullAccount: isFullAccount()
    };
  }
  toggleSettingsVisible() {
    const settingsVisible = this.state.settingsVisible;
    if (!settingsVisible) {
      sendMetric('trackClick', 'viewCashBackNotificationSettings');
    }
    this.setState({settingsVisible: !settingsVisible});
  }
  async handleSaveNotificationSettings(notificationSetting) {
    this.setState({notificationSetting});
    await saveNotificationSettings({notificationSetting});
    this.toggleSettingsVisible();
    sendMetric('track', 'saveCashBackNotificationSettings', {
      setting: notificationSetting
    });
  }
  render() {
    const {storeName, reward} = this.props;
    return (
      <div className="wb-cash-back-block-section">
        <RewardsText storeName={storeName} reward={reward} />
        <ActivateButton
          {...this.props}
          isFullAccount={this.state.isFullAccount}
          onSignIn={this.onSignIn.bind(this)}
        />
        {(this.props.activated || this.props.activating) && _.get(this.props, 'exclusions') ? (
          <h6 style={{height: '29px', marginTop: '4px', display: 'flex', alignItems: 'center'}}>
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
    );
  }

  onShowExclusion() {
    sendMetric('trackClick', 'viewExclusionDetails', 'view details', {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    });
    window.open(`${WIKIBUY_URL}/s/${this.props.tld}/coupon`, '_blank');
  }

  onSignIn() {
    const storeName = _.get(this.props, 'storeName');
    if (storeName !== 'eBay') {
      this.props.onActivate();
    }
    window.open(`${WIKIBUY_URL}/sign-in`);
    this.setState({isFullAccount: true});
  }
}

export default CashBackBlock;
