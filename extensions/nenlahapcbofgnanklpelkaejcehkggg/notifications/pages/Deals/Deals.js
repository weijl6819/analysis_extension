import {React} from 'utility/css-ns';
import {Component} from 'react';
import {Motion, spring} from 'react-motion';
import {WIKIBUY_URL} from 'constants';
import {branch} from 'higher-order/baobab';
import sendMetric from 'utility/sendMetric';
import _ from 'lodash';
import currency from 'utility/currency';
import {v4} from 'node-uuid';
import visitDeal from 'messenger/outbound/visitDeal';
import throttleGrouponNotification from 'messenger/outbound/throttleGrouponNotification';
import './deals.less';

class Deals extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      hideNotification: true
    };
  }

  componentDidMount() {
    sendMetric('page', 'dealsNotification', {
      view: 'dealsNotification',
      type: 'notification',
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname,
      offerSignUp: _.get(this.props.view, 'offerSignUp'),
      qualified: _.get(this.props.view, 'qualified', false),
      balance: _.get(this.props.view, 'balance', 0),
      dealType: _.get(this.props, 'view.deal.dealType', 'groupon')
    });
    setTimeout(() => {
      this.setState({hideNotification: false});
    }, 1000);
  }

  render() {
    const {hideNotification} = this.state;
    const {title, discount, dealType, name, price, promotion, offers} = _.get(
      this.props,
      'view.deal',
      {}
    );
    const showOnTop = true;
    const showOnRight = true;
    return (
      <div
        className={hideNotification ? 'disabled deals-page' : 'deals-page'}
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
              className="deals-notification"
              style={{
                transform: `translate3d(0,${y}%,0)`,
                opacity: `${opacity}`
              }}>
              <header>
                <div className="w-icon-logo" style={{height: '40px', width: '60px'}}>
                  {this.renderWIcon()}
                </div>
              </header>
              {dealType === 'storageUnit' ? (
                <section>
                  <h2>{name}</h2>
                  {promotion ? (
                    <h4 className="green">{promotion}</h4>
                  ) : (
                    <h4 className="green">{currency(price, true)}/month</h4>
                  )}
                  <div className="button-wrapper">
                    <button
                      className="primary-btn-large"
                      onClick={this.onClickSparefootDeal.bind(this)}>
                      View offer
                    </button>
                  </div>
                  <h4
                    className="bold maybe-later tertiary-link"
                    onClick={this.onClosePopup.bind(this, 'no thanks')}>
                    no thanks
                  </h4>
                </section>
              ) : dealType === 'cloBiz' ? (
                <section>
                  <h2>
                    Get <span className="green">{_.get(offers, '[0].rewardValue')}% back</span>{' '}
                    <br /> at {name}
                  </h2>
                  <h4>when you link your card.</h4>
                  <div className="button-wrapper">
                    <button
                      className="primary-btn-large"
                      onClick={this.onClickLinkedCardDeal.bind(this)}>
                      Activate offer
                    </button>
                  </div>
                  <h4
                    className="bold maybe-later tertiary-link"
                    onClick={this.onClosePopup.bind(this, 'no thanks')}>
                    no thanks
                  </h4>
                </section>
              ) : (
                <section>
                  <h2>{title}</h2>
                  <h4>
                    save {currency(discount, true)} at {_.get(this.props, 'view.queryData.title')}
                  </h4>
                  <div className="button-wrapper">
                    <button className="primary-btn-large" onClick={this.onClickDeal.bind(this)}>
                      View on Groupon
                    </button>
                  </div>
                  <h4
                    className="bold maybe-later tertiary-link"
                    onClick={this.onClosePopup.bind(this, 'no thanks')}>
                    no thanks
                  </h4>
                </section>
              )}
            </div>
          )}
        </Motion>
      </div>
    );
  }

  async onClickDeal() {
    const clickId = v4();
    sendMetric('trackClick', 'viewGrouponDeal', 'view deal', {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname,
      clickId
    });
    const redirect = `${_.get(this.props, 'view.deal.url')}&wid=${encodeURIComponent(
      location.hostname
    )}&sid=${clickId}`;
    visitDeal({redirect});
    this.setState({hideNotification: true});
    throttleGrouponNotification();
  }

  async onClickSparefootDeal() {
    const clickId = v4();
    sendMetric('trackClick', 'viewSparefootDeal', 'view deal', {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname,
      clickId
    });
    visitDeal({
      redirect: `https://sparefoot.pxf.io/c/101044/483123/8436?subId1=${clickId}&u=${_.get(
        this.props,
        'view.deal.link'
      )}`
    });
    this.setState({hideNotification: true});
    throttleGrouponNotification();
  }

  async onClickLinkedCardDeal() {
    const clickId = v4();
    sendMetric('trackClick', 'viewLinkedCardPage', 'view deal', {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname,
      clickId
    });
    window.open(`${WIKIBUY_URL}/linked-cards`);
    this.setState({hideNotification: true});
    throttleGrouponNotification();
  }

  onClosePopup(label) {
    this.setState({hideNotification: true});
    sendMetric('trackClick', 'dismissDealsNotification', label, {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    });
    throttleGrouponNotification();
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
    view: ['dealsView'],
    events: ['events'],
    session: ['session']
  },
  Deals
);
