import {React} from 'utility/css-ns';
import {Component} from 'react';
import _ from 'lodash';
import {WIKIBUY_URL} from 'constants';
import hasFeature from 'utility/hasFeature';
import isFullAccount from 'utility/isFullAccount';

class AreYouSure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: isFullAccount()
    };
  }

  render() {
    const reward = _.get(this.props.view, 'reward');

    let cbDollarAmt;
    if (reward && reward.type !== 'percentage') {
      if (reward.amount) {
        cbDollarAmt = reward.amount / 100;
      }
    }
    const rewardText = cbDollarAmt ? (
      <span>
        <span>${cbDollarAmt}</span> back
      </span>
    ) : (
      <span>
        <span>{reward.amount / 100}%</span> back
      </span>
    );

    return (
      <div className="simple-section">
        <h2>Are you sure?</h2>
        <h4>This offer is activated with just one-click here.</h4>
        {this.state.isLoggedIn ? (
          <div className="button-wrapper">
            {this.props.activated ? (
              <button className="primary-btn-large" disabled={true}>
                Activated
              </button>
            ) : this.props.activating ? (
              <button className="primary-btn-large" disabled={true}>
                Activating
              </button>
            ) : (
              <button className="primary-btn-large" onClick={this.props.onActivate}>
                Ok, activate {rewardText}
              </button>
            )}
            <div className="button-wrapper">
              <button className="secondary-btn-large" onClick={this.props.onConfirmDismiss}>
                I'm sure
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="button-wrapper">
              <button className="primary-btn-large" onClick={this.onClickSignIn.bind(this)}>
                Ok, activate {rewardText}
              </button>
            </div>
            <div className="button-wrapper">
              <button className="secondary-btn-large" onClick={this.props.onConfirmDismiss}>
                I'm sure
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  onClickSignIn() {
    const storeName = _.get(this.props.view, 'vendor');
    if (storeName !== 'eBay') {
      this.props.onActivate({preventHide: !this.state.hasClickedToLogin});
    }
    window.open(`${WIKIBUY_URL}/sign-in`);
    this.setState({hasClickedToLogin: true});
  }
}

export default AreYouSure;
