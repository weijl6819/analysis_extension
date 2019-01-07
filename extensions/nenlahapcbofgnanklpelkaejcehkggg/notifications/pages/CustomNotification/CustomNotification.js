import {React} from 'utility/css-ns';
import {Component} from 'react';
import uuid from 'node-uuid';
import {Motion, spring} from 'react-motion';
import {branch} from 'higher-order/baobab';
import {engage} from 'actions/customNotificationActions';
import sendMetric from 'utility/sendMetric';
import {dropCookie} from 'actions/couponActions';
import _ from 'lodash';
import ProgressBar from 'components/ProgressBar';
import currentDomain from 'utility/currentDomain';
import hasFeature from 'utility/hasFeature';
import './custom-notification.less';

class CustomNotification extends Component {
  constructor(...args) {
    super(...args);
    let display;
    const displaySequence = _.get(
      _.find(this.props.customNotificationData, 'displaySequence'),
      'displaySequence',
      []
    );
    if (displaySequence.length) {
      display = displaySequence[0];
    } else {
      display = this.props.customNotificationData[0].display;
    }

    this.state = {
      notification: 0,
      hideNotification: true,
      dismiss: false,
      progress: false,
      displaySequence,
      ...display
    };
  }

  componentDidMount() {
    sendMetric('page', 'customNotification', {
      view: 'customNotification',
      type: 'notification',
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname,
      offerSignUp: _.get(this.props.view, 'offerSignUp'),
      qualified: _.get(this.props.view, 'qualified', false),
      balance: _.get(this.props.view, 'balance', 0)
    });
    setTimeout(() => {
      if (document.querySelector('#honeyContainer')) {
        this.setState({compNotifLoaded: true, rightOffset: '300px'});
      }
      if (
        document.querySelector('.ebates-notification') ||
        document.querySelector('.ebates-hover.ebates-hover-top')
      ) {
        this.setState({compNotifLoaded: true, rightOffset: '410px'});
      }
      this.setState({hideNotification: false});
    }, 500);
  }

  render() {
    const {hideNotification} = this.state;
    const showOnTop = true;
    const showOnRight = true;
    const showOnRightOffset = hasFeature('n_or_1') && this.state.compNotifLoaded;
    let content;
    if (this.state.cta) {
      content = (
        <div className="button-wrapper">
          <button className="primary-btn-large" onClick={this.onClick.bind(this)}>
            {this.state.cta}
          </button>
        </div>
      );
    }

    return (
      <div
        className={hideNotification ? 'disabled follow-page' : 'follow-page'}
        style={{
          top: showOnTop ? '0' : 'auto',
          bottom: showOnTop ? 'auto' : '0',
          left: showOnRight ? 'auto' : '0',
          right: showOnRightOffset ? this.state.rightOffset : showOnRight ? '0' : 'auto'
        }}>
        <Motion
          style={{
            opacity: spring(hideNotification ? 0 : 1, {stiffness: 180, damping: 20}),
            y: spring(hideNotification ? (showOnTop ? -100 : 100) : 0, {
              stiffness: 180,
              damping: 20
            })
          }}>
          {({opacity, y}) => (
            <div
              className="custom-notification"
              style={{
                transform: `translate3d(0,${y}%,0)`,
                opacity: `${opacity}`
              }}>
              <header>
                <div className="w-icon-logo" style={{height: '40px', width: '60px'}}>
                  {this.renderWIcon()}
                </div>
                <div className="close icon-x" onClick={this.onClosePopup.bind(this, 'x')} />
              </header>
              <section>
                <h2>{this.state.title}</h2>
                {this.state.progress ? <ProgressBar estimatedDuration={5000} /> : null}
                {this.state.subtitle ? <h4 className="bold">{this.state.subtitle}</h4> : null}
                {content}
              </section>
            </div>
          )}
        </Motion>
      </div>
    );
  }

  onClick() {
    const clickID = uuid.v4().replace(/-/, '');
    if (this.state.dropCookie) {
      dropCookie(clickID);
    }
    if (this.state.sendMetric) {
      sendMetric('track', 'noCouponsNotify', {
        clickID,
        currentLocation: window.location.href,
        domain: currentDomain()
      });
    }
    if (this.state.notification < this.state.displaySequence.length - 1) {
      const iterator = this.state.notification + 1;
      const display = this.state.displaySequence[iterator];
      const setNextDisplay = () => {
        this.setState({
          notification: iterator,
          ...display
        });
        if (this.state.timeout && display.timeout === undefined) {
          this.setState({timeout: undefined});
        }
        if (iterator === this.state.displaySequence.length - 1 && !!display.timeout) {
          setTimeout(() => {
            this.onClosePopup();
          }, this.state.timeout);
        }
      };
      this.setState({progress: !!this.state.timeout});
      setTimeout(() => {
        setNextDisplay();
        this.setState({progress: false});
      }, this.state.timeout * 2 || 0);
    } else if (this.props.customNotificationData.url) {
      engage();
      const clickId = uuid.v4().replace(/-/g, '');
      const url = `https://wikibuy.com/api/v1/redirect?r=true&url=${encodeURIComponent(
        this.props.customNotificationData.url
      )}&clickId=mock_click_id`.replace('mock_click_id', clickId);
      window.open(url, '_blank');
      sendMetric('trackClick', 'customNotificationClick', '', {
        view: 'customNotification',
        domain: location.hostname.replace(/^www\./, ''),
        pagePath: location.pathname,
        pageLocation: 'notification',
        clickId
      });
    } else {
      setTimeout(() => {
        this.onClosePopup();
      }, this.state.timeout || 0);
    }
  }

  onClosePopup(label) {
    engage();
    this.setState({hideNotification: true});
    sendMetric('trackClick', 'dismissCustomNotification', label, {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    });
  }

  renderWIcon() {
    return (
      <svg id="Layer_1" x="0px" y="0px" viewBox="0 0 60 45">
        <g>
          <path
            d="M39.4,35.9h-9L25,19.1h-0.1l-5.2,16.8h-9L1.3,8.8h9.6L15.7,26h0.1l4.9-17.2h8.9l5,17.2h0.1l4.8-17.2h9.3
          L39.4,35.9z M57.7,31.6c0,0.7-0.1,1.4-0.4,2c-0.2,0.6-0.6,1.1-1,1.6c-0.4,0.4-1,0.8-1.7,1s-1.3,0.3-2,0.3c-1.5,0-2.7-0.5-3.7-1.4
          c-1-0.9-1.4-2-1.4-3.5c0-0.7,0.1-1.3,0.4-1.8c0.2-0.7,0.6-1.3,1-1.6c0.8-0.7,1.4-1,1.7-1.1c0.9-0.3,1.6-0.4,2-0.4
          c0.7,0,1.4,0.1,2,0.4c0.7,0.2,1.2,0.6,1.7,1c0.3,0.3,0.7,0.8,1.1,1.6C57.6,30.2,57.7,30.8,57.7,31.6z"
          />
        </g>
      </svg>
    );
  }
}

export default branch(
  {
    view: ['customView'],
    customNotificationData: ['customNotificationData'],
    events: ['events'],
    session: ['session']
  },
  CustomNotification
);
