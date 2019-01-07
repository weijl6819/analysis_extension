import {React} from 'utility/css-ns';
import {Component} from 'react';
import {Motion, spring} from 'react-motion';
import {branch} from 'higher-order/baobab';
import sendMetric from 'utility/sendMetric';
import {WIKIBUY_API} from 'constants';
import _ from 'lodash';
import {v4} from 'node-uuid';
import './mirage-notification.less';

class MirageNotification extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      hideNotification: true
    };
  }

  componentDidMount() {
    sendMetric('page', 'mirageNotification', {
      view: 'mirageNotification',
      type: 'notification',
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    });
    setTimeout(() => {
      this.setState({hideNotification: false});
    }, 1000);
  }

  render() {
    const {hideNotification} = this.state;
    const {image, heading, subheading, cta} = this.props.view;
    const showOnTop = true;
    const showOnRight = true;
    return (
      <div
        className={hideNotification ? 'disabled mirage-notification' : 'mirage-notification'}
        style={{
          top: showOnTop ? '0' : 'auto',
          bottom: showOnTop ? 'auto' : '0',
          left: showOnRight ? 'auto' : '0',
          right: showOnRight ? '0' : 'auto'
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
              className="mirage-notification-content"
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
                {_.get(image, 'src') ? (
                  <div className="notification-image-wrapper" style={_.get(image, 'wrapperStyle')}>
                    <div
                      className="notification-image"
                      style={{
                        backgroundImage: `url("${_.get(image, 'src')}")`,
                        ..._.get(image, 'style', {})
                      }}
                    />
                  </div>
                ) : null}
                <h2 style={_.get(heading, 'style')}>{_.get(heading, 'value')}</h2>
                <h4 style={_.get(subheading, 'style')}>{_.get(subheading, 'value', '')}</h4>
                <div className="button-wrapper">
                  <button
                    className="primary-btn-large"
                    style={_.get(cta, 'style')}
                    onClick={this.onClickCTA.bind(this)}>
                    {_.get(cta, 'value')}
                  </button>
                </div>
              </section>
            </div>
          )}
        </Motion>
      </div>
    );
  }

  async onClickCTA() {
    const clickId = v4();
    _.map(_.get(this.props.view, 'actions'), action => {
      if (action.type === 'openUrl' && _.get(action, 'props.href')) {
        window.open(
          `${WIKIBUY_API}/redirect?r=1&url=${encodeURIComponent(
            _.get(action, 'props.href')
          )}&channel=${_.get(action, 'props.channel', 'cashback')}&clickId=${clickId}`
        );
      } else if (action.type === 'track') {
        sendMetric(
          'trackClick',
          action.event || 'activateMirageNotification',
          '',
          _.assign(
            {
              domain: location.hostname.replace(/^www\./, ''),
              pagePath: location.pathname,
              clickId
            },
            action.props
          )
        );
      }
    });
    this.setState({hideNotification: true});
    this.throttleNotif();
  }

  onClosePopup(label) {
    this.setState({hideNotification: true});
    sendMetric('trackClick', 'dismissMirageNotification', label, {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    });
    this.throttleNotif();
  }

  throttleNotif() {}

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
    view: ['mirageNotification'],
    events: ['events'],
    session: ['session']
  },
  MirageNotification
);
