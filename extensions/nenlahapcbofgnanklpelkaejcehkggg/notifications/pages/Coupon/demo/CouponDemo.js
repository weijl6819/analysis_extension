import {React} from 'utility/css-ns';
import {Component} from 'react';
import {Motion, spring} from 'react-motion';
import {branch} from 'higher-order/baobab';
import _ from 'lodash';
import Bluebird from 'bluebird';
import $ from 'jquery';
import continueCouponOnboarding from 'messenger/outbound/continueCouponOnboarding';

// Local Components
import CouponHeader from '../components/CouponHeader';
import RenderResult from '../components/RenderResult';

// Components
import Tooltip from 'components/Tooltip';

// Utilities
import hasFeature from 'utility/hasFeature';
import sendMetric from 'utility/sendMetric';
import currentDomain from 'utility/currentDomain';

// LESS
import '../coupon.less';
import '../invite-friends.less';
import '../review-wikibuy.less';

import htmlMarkup from './htmlMarkup.js';
import OnboardingTooltip from 'components/OnboardingTooltip';

class Coupon extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      hideNotification: true,
      viewCodes: false,
      didTryCodes: false,
      result: null,
      settings: {},
      ctaLoading: false,
      demoState: 'findCodes'
    };
  }

  componentDidMount() {
    document.querySelector('article#checkout #subContainer').remove();
    $('article#checkout').append(htmlMarkup());

    sendMetric('page', 'couponNotificationDemo', {
      view: 'couponDemoNotification',
      type: 'notification',
      domain: currentDomain(),
      pagePath: location.pathname
    });
    setTimeout(() => {
      this.setState({hideNotification: false});
    }, 200);

    this.boundCloseModal = this.closeModalOnClickOutside.bind(this);
    window.addEventListener('click', this.boundCloseModal);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.didTryCodes && nextProps.view.shouldTryCoupons) {
      this.setState({hideNotification: false});
      this.onTryCodes();
    }
  }

  render() {
    const {hideNotification, reportAProblem} = this.state;
    const fullPageModal = this.shouldShowFullPage()
      ? `full-page ${!hasFeature('coupon_invite_friends') ? 'invite-friends-full' : ''}`
      : '';
    const hideRight =
      currentDomain() === 'amazon.com' &&
      (this.state.running || _.get(this.state.result, 'pageReload') || this.state.barComplete);
    const hideRightClass = hideRight ? 'hide-right' : '';
    const pause = this.state.demoState === 'couponRunning';
    return (
      <div
        className={
          hideNotification
            ? `disabled coupon-page ${hideRightClass} ${
                this.state.resetNotification ? fullPageModal : ''
              }`
            : `coupon-page ${hideRightClass} ${fullPageModal}`
        }
        style={{
          top: '0',
          bottom: 'auto',
          left: 'auto',
          right: '0'
        }}>
        <Motion
          style={{
            opacity: spring(hideNotification ? 0 : 1, {stiffness: 180, damping: 20}),
            y: spring(hideNotification ? -100 : 0, {stiffness: 180, damping: 20})
          }}>
          {({opacity, y}) => (
            <div
              className="coupon-notification"
              style={{
                transform: `translate3d(0,${y}%,0)`,
                opacity: `${opacity}`,
                width: `${hasFeature('coupon_lg_cta') ? '300px' : '284px'}`,
                minHeight: `${hasFeature('coupon_lg_cta') ? '496px' : 'none'}`,
                marginRight: `${hasFeature('coupon_lg_cta') ? '12px' : '20px'}`
              }}>
              <CouponHeader
                reportAProblem={() => {}}
                reportAProblemOpen={this.state.reportAProblem && !pause}
                view={this.props.view}
                running={this.state.running}
                fullPageModal={fullPageModal}
                onClosePopup={() => {}}
              />

              <section>
                <RenderResult
                  demo={true}
                  pause={pause}
                  reportAProblem={reportAProblem}
                  hideRight={hideRight}
                  googleData={this.props.googleData}
                  domain={currentDomain()}
                  reward={null}
                  fullPageModal={fullPageModal}
                  settings={this.state.settings}
                  shortCode={_.get(this.props, 'session.short_code')}
                  email={_.get(this.props, 'session.email')}
                  onTryCodes={this.onTryCodes.bind(this)}
                  onClosePopup={this.onClosePopup.bind(this)}
                  onToggleSubscribe={this.onToggleSubscribe.bind(this)}
                  getRunAnimation={this.getRunAnimation.bind(this)}
                  view={{
                    coupons: [
                      {code: 'FLASH20'},
                      {code: 'CELEBRATE18'},
                      {code: 'OFFERS18'},
                      {code: 'THANKS2018'}
                    ],
                    result: this.state.result,
                    couponCount: 3,
                    estimatedRunTime: 5000,
                    runTimePerCoupon: 1500
                  }}
                  running={this.state.running}
                  barComplete={this.state.barComplete}
                  ctaLoading={this.state.ctaLoading}
                />
                <OnboardingTooltip
                  continueDemo={this.continueDemo.bind(this)}
                  demoState={this.state.demoState}
                />
              </section>
            </div>
          )}
        </Motion>
      </div>
    );
  }

  continueDemo() {
    if (this.state.demoState === 'result') {
      sendMetric('trackClick', 'demoContinue', 'slide 3', {});
      continueCouponOnboarding();
    } else {
      sendMetric('trackClick', 'demoContinue', 'slide 2', {});
      this.setState({demoState: null});
      setTimeout(() => {
        this.setState(
          {
            showResult: true,
            result: this.generateResult(),
            running: false,
            barComplete: true,
            rooRunning: false
          },
          () => {
            setTimeout(() => this.setState({barComplete: false, demoState: 'result'}), 300);
          }
        );
      }, 1000);
    }
  }

  shouldShowFullPage() {
    return (
      (!this.state.barComplete &&
        !this.state.running &&
        _.get(this.state.result, 'savings', 0) > 0 &&
        (!this.state.qualified || (this.state.qualified && this.state.activated))) ||
      // this.state.roo && WE MAY ALWAYS WANT TO SHOW FULL
      (this.state.running || this.state.result)
    );
  }

  onDismissTooltip() {
    if (!this.state.tooltipDismissed) {
      // hideThrottleToolTip runs the fade animation
      this.setState({hideThrottleToolTip: true});
      this.setState({hideNotification: true});
      this.setState({tooltipDismissed: true});

      setTimeout(() => {
        // wait a second for the fade animation, then remove the component altogether
        this.setState({showThrottleToolTip: false});
      }, 1000);
    }
  }

  onClosePopup(label) {
    this.setState({hideNotification: true, resetNotification: true}, () => {
      this.timeout = setTimeout(() => {
        this.setState({resetNotification: false});
      }, 1000);
    });
    if (!this.state.didTryCodes) {
      sendMetric('trackClick', 'dismissCouponNotificationDemo', label, {
        domain: currentDomain(),
        pagePath: location.pathname
      });
    }
  }

  async onToggleSubscribe() {}

  async onTryCodes() {
    this.setState({didTryCodes: true, demoState: 'couponRunning'});
    let tryCodes;
    const runAnimation = {class: 'fast', stagger: 500, duration: 5500};
    sendMetric('trackClick', 'demoContinue', 'slide 1', {});
    this.setState({running: true});
    Bluebird.all([Bluebird.resolve().delay(runAnimation.duration)]).then(
      ([codesResp, cashbackResp, animationResp]) => {
        this.setState({done: true});
      }
    );
  }

  closeModalOnClickOutside(e) {
    if (e.isTrusted && !!this.state.result && this.shouldShowFullPage()) {
      var path = e.path || (e.composedPath && e.composedPath());
      if (!_.find(path, el => el.className === 'wbext-coupon-notification')) {
        this.onClosePopup();
      }
    }
  }

  getRunAnimation() {
    return {class: 'fast', stagger: 500, duration: 5500};
  }

  generateResult() {
    return {
      savings: 3200,
      bestCoupon: {
        domain: 'kohls.com',
        code: 'FLASH20',
        avg_savings: 1126,
        created_at: '2018-01-08T05:25:07.459Z',
        description: null
      },
      coupons: [
        {
          code: 'FLASH20',
          description: null,
          savings: 3200,
          success: true
        },
        {
          code: 'CELEBRATE18',
          description: null,
          savings: 0,
          success: true
        },
        {
          code: 'OFFERS18',
          description: null,
          savings: 0,
          success: true
        },
        {
          code: 'THANKS2018',
          description: null,
          savings: 0,
          success: true
        }
      ],
      runTime: 4642,
      affiliateRedirect: false,
      duration: 4645
    };
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    window.removeEventListener('click', this.boundCloseModal);
  }
}

export default branch(
  {
    view: ['couponView'],
    cashbackView: ['cashbackView'],
    giftCardView: ['giftCardView'],
    session: ['session'],
    settings: ['settings'],
    googleData: ['googleData']
  },
  Coupon
);
