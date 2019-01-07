import {React} from 'utility/css-ns';
import sendMetric from 'utility/sendMetric';
import moment from 'moment';
import _ from 'lodash';
import {Component} from 'react';
import './cash-back-mini.less';

class CashbackMini extends Component {
  constructor(props) {
    super(props);
    let closed = false;
    const vendorInState = _.get(this.props.miniCashbackTabState, this.props.vendor);
    if (vendorInState) {
      closed = moment().diff(vendorInState, 'minutes') < 30;
    }

    this.state = {
      closed
    };
  }

  componentDidMount() {
    this.miniCashbackNotifTimeout = setTimeout(() => {
      this.setState({closed: true});
      this.props.setMiniCashbackTabStateAction({vendor: this.props.vendor});
      sendMetric('track', 'miniCashbackNoticationHide', {
        domain: location.hostname.replace(/^www\./, ''),
        pagePath: location.pathname
      });
    }, 5000);

    sendMetric('track', 'miniCashbackNoticationVisible', {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname,
      state: this.state.closed ? 'closed' : 'open'
    });
  }

  render() {
    const closed = this.state.closed;
    const reward = _.get(this.props, 'reward');
    let cbDollarAmt;
    if (reward.type !== 'percentage') {
      if (reward.amount) {
        cbDollarAmt = reward.amount / 100;
      }
    }
    return (
      <div
        ref={r => (this.r = r)}
        style={this.props.style}
        className={`cash-back-mini ${closed ? 'closed' : ''}`}
        onMouseOver={this.onEnterMiniCashbackNotif.bind(this)}
        onMouseOut={this.onLeaveMiniCashbackNotif.bind(this)}>
        <div className="cash-back-mini-wrapper">
          <div
            onClick={e => {
              e.stopPropagation();
              this.clearTimeout();
              if (this.state.closed) {
                this.setState({closed: false, override: true});
              } else {
                this.activate();
              }
            }}
            className="logo-wrapper">
            {this.renderW()}
          </div>

          {this.props.activated ? (
            <div onClick={this.props.onActivate.bind(this)} className="content">
              <h2>Activated!</h2>
              <h5>
                You earned {cbDollarAmt ? `$${cbDollarAmt}` : `${reward.amount / 100}%`} back.
              </h5>
            </div>
          ) : this.props.activating ? (
            <div onClick={this.props.onActivate.bind(this)} className="content">
              <h2>Activating...</h2>
              <h5>Please wait</h5>
            </div>
          ) : (
            <div
              onClick={e => {
                e.stopPropagation();
                this.activate();
                this.clearTimeout();
              }}
              className="content">
              <h2>Get {cbDollarAmt ? `$${cbDollarAmt}` : `${reward.amount / 100}%`} back.</h2>
              <h5>Click to activate</h5>
            </div>
          )}
        </div>
        <div
          className="icon-x"
          onClick={() => {
            this.props.onUserClosePopup();
            this.clearTimeout();
            sendMetric('trackClick', 'miniCashbackNoticationClosed', 'x', {
              domain: location.hostname.replace(/^www\./, ''),
              pagePath: location.pathname
            });
          }}
        />
      </div>
    );
  }

  activate() {
    this.clearTimeout();
    this.props.onActivate();
    sendMetric('trackClick', 'miniCashbackNoticationActivation', 'activate', {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    });
  }

  onEnterMiniCashbackNotif(e) {
    if (this.over) {
      return;
    }
    this.over = true;
    this.onEnter();
  }

  onLeaveMiniCashbackNotif(e) {
    const {left, right, top, bottom} = this.r.getBoundingClientRect();
    if (e.x > right || e.x < left || e.y > bottom || e.y < top) {
      if (this.over) {
        this.onLeave();
      }
      this.over = false;
    }
  }

  onEnter() {
    if (this.miniCashbackNotifTimeout) {
      this.clearTimeout();
    }
  }

  onLeave(e) {
    if (this.state.override) {
      return;
    }
    this.miniCashbackNotifTimeout = setTimeout(() => {
      this.setState({closed: true});
    }, 5000);
  }

  componentWillUnmount() {
    this.clearTimeout();
  }

  clearTimeout() {
    clearTimeout(this.miniCashbackNotifTimeout);
  }

  renderW() {
    return (
      <svg x="0px" y="0px" viewBox="0 0 80 44.8">
        <path
          style={{fill: '#00A224'}}
          d="M55.7,41.7H43.2l-7.4-23.4h-0.2l-7.2,23.4H16L3,4.1h13.4l6.5,23.8h0.2l6.7-23.8h12.5l6.9,23.8h0.1l6.6-23.8
          h12.8L55.7,41.7z"
        />
        <path
          style={{fill: '#00A224'}}
          d="M76.9,34.9c0,1-0.2,1.8-0.6,2.7c-0.4,0.8-0.9,1.5-1.5,2.2c-0.6,0.6-1.4,1.1-2.3,1.4c-0.9,0.4-1.8,0.5-2.8,0.5
          c-2,0-3.7-0.7-5.1-2c-1.4-1.3-2-2.9-2-4.8c0-0.9,0.2-1.8,0.5-2.6c0.4-0.8,0.9-1.5,1.5-2.2c0.7-0.6,1.4-1.1,2.3-1.5
          c0.9-0.4,1.8-0.6,2.8-0.6c1,0,1.9,0.2,2.8,0.5c0.9,0.4,1.6,0.8,2.3,1.4c0.6,0.6,1.1,1.3,1.5,2.2C76.7,33,76.9,33.9,76.9,34.9z"
        />
      </svg>
    );
  }
}

export default CashbackMini;
