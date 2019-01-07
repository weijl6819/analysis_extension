import {React} from 'utility/css-ns';
import {Component} from 'react';
import {Motion, spring} from 'react-motion';
import {branch} from 'higher-order/baobab';
import sendMetric from 'utility/sendMetric';
import _ from 'lodash';
import currency from 'utility/currency';
import {v4} from 'node-uuid';
import {WIKIBUY_API} from 'constants';
import './homeaway-notification.less';

class HomeawayNotification extends Component {
  state = {};

  constructor(...args) {
    super(...args);
    this.state = {
      hideNotification: true
    };
    if (this.props.registerOfferChangeCallback) {
      this.props.registerOfferChangeCallback((listing, sourceListing) => {
        if (listing && listing.loading) {
          this.setState({hideNotification: true});
        } else {
          this.setState({listing, hideNotification: false, sourceListing});
        }
      });
    }
  }

  componentDidMount() {
    sendMetric('page', 'HomeawayNotification', {
      view: 'HomeawayNotification',
      type: 'notification',
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    });
    setTimeout(() => {
      this.setState({hideNotification: false});
    }, 1000);
  }

  render() {
    const {hideNotification, listing, sourceListing: source} = this.state;
    const {results, cashback} = listing || _.get(this.props, 'view.listing', {});
    const sourceListing = source || _.get(this.props, 'view.sourceListing');
    const result = _.get(results, '[0]');
    const savings = Math.floor(_.get(result, 'total') - sourceListing.price);
    const amountBack = Math.floor(
      (_.get(result, 'total') * _.get(cashback, 'reward.amount')) / 10000
    );
    const otherResults = _.filter(results, r => !r.exactMatch);
    const showOnTop = true;
    const showOnRight = true;
    return (
      <div
        className={
          hideNotification ? 'disabled homeaway-notification-page' : 'homeaway-notification-page'
        }
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
              className="homeaway-notification-notification"
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
              {result.exactMatch ? (
                <section>
                  <h2>
                    Save <span className="green">{currency(savings)}</span> on the exact same
                    property.
                  </h2>
                  {amountBack ? <h4>Plus get {currency(amountBack)} back in credit.</h4> : null}
                  <div className="button-wrapper">
                    <button
                      className="primary-btn-large"
                      onClick={() => this.onClickListing(result.url)}>
                      View on {sourceListing.domain === 'HomeAway' ? 'HomeAway' : 'VRBO'}
                    </button>
                  </div>
                </section>
              ) : otherResults && otherResults.length ? (
                <section>
                  <h2 style={{marginBottom: '10px'}}>Savings found nearby.</h2>
                  {_.map(_.filter(results, r => !r.exactMatch), (result, i) => {
                    const title = _.get(result, 'unitDetails.propertyName');
                    const savings = currency(
                      Math.floor(_.get(result, 'total') - sourceListing.price)
                    );
                    return (
                      <div
                        key={i}
                        className="homeaway-list-item"
                        onClick={() => this.onClickListing(result.url, true)}>
                        <div
                          className="image-conainer"
                          style={{
                            backgroundImage: `url("${_.get(result, 'unitDetails.thumbnails[0]')}")`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            width: '100%',
                            height: '140px'
                          }}
                        />
                        <div className="flex-between">
                          <div>
                            <h3>{title}</h3>
                            <h4>
                              {_.get(result, 'unitDetails.maxSleep')} guests,{' '}
                              {_.get(result, 'unitDetails.numberOfBedrooms')} bedrooms,{' '}
                              {_.get(result, 'unitDetails.numberOfBathrooms')} baths
                            </h4>
                          </div>
                        </div>
                        <div className="primary-btn-small">Save {savings}</div>
                      </div>
                    );
                  })}
                </section>
              ) : null}
            </div>
          )}
        </Motion>
      </div>
    );
  }

  async onClickListing(url) {
    const clickId = v4();
    sendMetric('trackClick', 'viewHomeawayListing', 'view listing', {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname,
      clickId
    });
    window.open(
      `${WIKIBUY_API}/redirect?r=1&url=${encodeURIComponent(
        url
      )}&channel=cashback&clickId=${clickId}`
    );
  }

  onClosePopup(label) {
    this.setState({hideNotification: true});
    sendMetric('trackClick', 'dismissHomeawayNotification', label, {
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
    view: ['homeawayView'],
    events: ['events'],
    session: ['session']
  },
  HomeawayNotification
);
