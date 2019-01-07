import {React} from 'utility/css-ns';
import {Component} from 'react';
import {Motion, spring} from 'react-motion';
import {branch} from 'higher-order/baobab';
import sendMetric from 'utility/sendMetric';
import _ from 'lodash';
import currency from 'utility/currency';
import {v4} from 'node-uuid';
import visitHotel from 'messenger/outbound/visitHotel';
import {WIKIBUY_API} from 'constants';
import './hotel.less';

class Hotel extends Component {
  state = {};

  constructor(...args) {
    super(...args);
    this.state = {
      hideNotification: true
    };
    if (this.props.registerOfferChangeCallback) {
      this.props.registerOfferChangeCallback(hotel => {
        if (hotel && hotel.loading) {
          this.setState({hideNotification: true});
        } else {
          this.setState({hotel, hideNotification: false});
        }
      });
    }
  }

  componentDidMount() {
    sendMetric('page', 'hotelNotification', {
      view: 'hotelNotification',
      type: 'notification',
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname,
      credits: !!_.get(this.props.view, 'hotel.cashback.reward.amount'),
      creditsAmount: _.get(this.props.view, 'hotel.cashback.reward.amount'),
      creditsType: _.get(this.props.view, 'hotel.cashback.reward.type'),
      offerSignUp: _.get(this.props.view, 'offerSignUp'),
      qualified: _.get(this.props.view, 'qualified', false),
      balance: _.get(this.props.view, 'balance', 0)
    });
    setTimeout(() => {
      this.setState({hideNotification: false});
    }, 1000);
  }

  render() {
    const {hideNotification, hotel} = this.state;
    const {title, discount, url, inputPrice, finalPrice, cashback, source} = hotel
      ? hotel
      : _.get(this.props, 'view.hotel', {});
    const hotels = _.get(this.props, 'view.hotels', []);
    const reward = _.get(cashback, 'reward');
    const rewardText =
      _.get(cashback, 'reward.type') === 'percentage'
        ? `${_.get(cashback, 'reward.amount') / 100}% back`
        : `${currency(_.get(cashback, 'reward.amount'), true)} back`;
    const showOnTop = true;
    const showOnRight = true;
    return (
      <div
        className={hideNotification ? 'disabled hotel-page' : 'hotel-page'}
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
              className="hotel-notification"
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
              {hotels && hotels.length ? (
                <section>
                  <h2>Same hotels and rooms, just more savings.</h2>
                  {_.map(hotels, ({title, discount, url, totalDiscount}, i) => {
                    return (
                      <div
                        key={i}
                        className="hotel-list-item"
                        onClick={() => this.onClickDeal(url, true)}>
                        <div>
                          <h3>{title}</h3>
                          <h4>save {currency(discount, true)}/night</h4>
                        </div>
                        <div className="primary-btn-small">
                          save {currency(totalDiscount, true)}
                        </div>
                      </div>
                    );
                  })}
                </section>
              ) : source === 'marriott' && reward ? (
                <section>
                  <h2>
                    Get{' '}
                    <span className="green">{_.get(cashback, 'reward.amount') / 100}% back</span>{' '}
                    booking direct with Marriott
                  </h2>
                  <h4>{title}</h4>
                  <div className="button-wrapper">
                    <button
                      className="primary-btn-large"
                      onClick={() => this.onClickMarriottDeal(url)}>
                      View Hotel
                    </button>
                  </div>
                </section>
              ) : this.props.showNightlyRate && !reward ? (
                <section>
                  <h2>
                    {currency(finalPrice, true)}/night at {title}
                  </h2>
                  {!reward && !discount ? <h4>{title}</h4> : null}
                  <div className="button-wrapper">
                    <button className="primary-btn-large" onClick={() => this.onClickDeal(url)}>
                      View Hotel
                    </button>
                  </div>
                </section>
              ) : (
                <section>
                  {reward && discount ? (
                    <div>
                      <h2>Save {currency(discount, true)}/night on the exact same room.</h2>
                      <h4>
                        Plus get <span className="palmetto">{rewardText}</span> on your stay at{' '}
                        {title}.
                      </h4>
                    </div>
                  ) : reward ? (
                    <div>
                      <h2>
                        Save{' '}
                        <span className="palmetto">
                          {currency(_.get(cashback, 'reward.amount'), true)}
                        </span>{' '}
                        on the exact same room.
                      </h2>
                      <h4>
                        {currency(finalPrice, true)}/night plus get {rewardText} in Wikibuy Credit.
                      </h4>
                    </div>
                  ) : !inputPrice ? (
                    <h2>Best offer {currency(finalPrice, true)}/night.</h2>
                  ) : (
                    <h2>Save {currency(discount, true)}/night on the exact same room.</h2>
                  )}
                  {!reward && !discount ? <h4>{title}</h4> : null}
                  <div className="button-wrapper">
                    <button className="primary-btn-large" onClick={() => this.onClickDeal(url)}>
                      View Hotel
                    </button>
                  </div>
                </section>
              )}
            </div>
          )}
        </Motion>
      </div>
    );
  }

  async onClickMarriottDeal(url, preventHide) {
    const clickId = v4().replace(/-/g, '');
    const source = _.get(this.props, 'view.hotel.source');
    sendMetric('trackClick', 'viewHotelDeal', 'view hotel', {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname,
      source,
      clickId,
      credits: !!_.get(this.props.view, 'hotel.cashback.reward.amount'),
      creditsAmount: _.get(this.props.view, 'hotel.cashback.reward.amount'),
      creditsType: _.get(this.props.view, 'hotel.cashback.reward.type')
    });
    let redirect = url;
    if (_.get(this.props, 'view.hotel.cashback.reward.amount')) {
      redirect = `${WIKIBUY_API}/redirect?r=1&url=${encodeURIComponent(
        redirect
      )}&channel=cashback-ims&vendorMetaId=${_.get(
        this.props,
        'view.hotel.cashback.id'
      )}&clickId=${clickId}`;
    }
    visitHotel({redirect});
    if (!preventHide) {
      this.setState({hideNotification: true});
    }
  }

  async onClickDeal(url, preventHide) {
    const clickId = v4().replace(/-/g, '');
    const source = _.get(this.props, 'view.hotel.source');
    sendMetric('trackClick', 'viewHotelDeal', 'view hotel', {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname,
      source,
      clickId,
      credits: !!_.get(this.props.view, 'hotel.cashback.reward.amount'),
      creditsAmount: _.get(this.props.view, 'hotel.cashback.reward.amount'),
      creditsType: _.get(this.props.view, 'hotel.cashback.reward.type')
    });
    let redirect = `${url}&wsid=${clickId}`;
    if (_.get(this.props, 'view.hotel.cashback.reward.amount')) {
      redirect = `${WIKIBUY_API}/redirect?r=1&url=${encodeURIComponent(
        redirect
      )}&channel=cashback&clickId=${clickId}`;
    }
    visitHotel({redirect});
    if (!preventHide) {
      this.setState({hideNotification: true});
    }
  }

  onClosePopup(label) {
    this.setState({hideNotification: true});
    sendMetric('trackClick', 'dismissHotelNotification', label, {
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
    view: ['hotelView'],
    events: ['events'],
    session: ['session']
  },
  Hotel
);
