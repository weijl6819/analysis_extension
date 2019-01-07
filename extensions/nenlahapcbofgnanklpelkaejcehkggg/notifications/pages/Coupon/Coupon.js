import {React} from 'utility/css-ns';
import moment from 'moment';
import {Component} from 'react';
import {Motion, spring} from 'react-motion';
import {branch} from 'higher-order/baobab';
import _ from 'lodash';
import Bluebird from 'bluebird';

// Actions
import {
  tryCodes as tryTigger,
  throttleNotification,
  updateEmailSubscriptions,
  activateInCurrentTab
} from 'actions/couponActions';
import {tryCodes as tryRoo, cancelRoo} from 'actions/rooActions';
import {
  setSeenNotificationTooltip,
  activateThroughPinnedTab,
  backgroundTreeSetAction
} from 'actions/cashbackActions';
import {getContentApiStores} from 'actions/contentApiActions';

// Local Components
import CouponHeader from './components/CouponHeader';
import RenderResult from './components/RenderResult';
import NoScript from './components/NoScript';

// Components
import Tooltip from 'components/Tooltip';

// Utilities
import hasFeature from 'utility/hasFeature';
import sendMetric from 'utility/sendMetric';
import currentDomain from 'utility/currentDomain';

// LESS
import './coupon.less';
import './invite-friends.less';
import './review-wikibuy.less';

class Coupon extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      hideNotification: true,
      viewCodes: false,
      running: this.props.view.rooRunning,
      rooRunning: this.props.view.rooRunning,
      didTryCodes: this.props.view.rooRunning || this.props.view.pageWasReloaded || false,
      result: this.props.view.result,
      roo: this.props.view.roo,
      showThrottleToolTip: this.props.view.showThrottleToolTip,
      settings: this.props.settings,
      ctaLoading: false
    };
  }

  async getContentAPiData() {
    if (hasFeature('content_data')) {
      const data = await getContentApiStores();
      this.setState({storeContentApiData: data});
    }
  }

  componentWillMount() {
    // Check to see if we started with a affiliate redirect page refresh
    if (localStorage.getItem('__wb_redirecting')) {
      localStorage.removeItem('__wb_redirecting');
      this.setState({redirectInCurrentTab: false}, () => {
        this.onTryCodes();
      });
    } else if (_.get(this.props, 'view.affiliateLinkCurrentTab')) {
      this.setState({redirectInCurrentTab: true});
    }
  }

  componentDidMount() {
    this.getContentAPiData();

    setTimeout(() => {
      if (document.querySelector('#honeyContainer')) {
        this.setState({compNotifLoaded: true, rightOffset: '310px'});
      }
      if (
        document.querySelector('.ebates-notification') ||
        document.querySelector('.ebates-hover.ebates-hover-top')
      ) {
        this.setState({compNotifLoaded: true, rightOffset: '420px'});
      }
      this.setState({hideNotification: false});
    }, 200);

    this.boundCloseModal = this.closeModalOnClickOutside.bind(this);
    window.addEventListener('click', this.boundCloseModal);

    if (
      this.props.view.shouldTryCoupons &&
      !this.state.didTryCodes &&
      !this.state.running &&
      !this.preparingToRun
    ) {
      this.preparingToRun = true;
      this.setState(
        {
          hideNotification: false,
          didTryCodes: false,
          result: null,
          running: true,
          barComplete: false
        },
        () => {
          this.onTryCodes(null, null, true);
          this.preparingToRun = false;
        }
      );
    }

    const {bacgroundOpacityValue, backgroundOpacityClass} = this.determineBackgroundOpacity(false);
    const opacityNotification = bacgroundOpacityValue && backgroundOpacityClass;
    if (opacityNotification) {
      backgroundTreeSetAction({
        path: ['notificationBackgroundOpacity'],
        value: moment().format(),
        persistKey: 'notificationBackgroundOpacity'
      });
    }

    sendMetric('page', 'couponNotification', {
      view: 'couponNotification',
      type: 'notification',
      domain: currentDomain(),
      pagePath: location.pathname,
      cashback: !!_.get(this.props, 'cashbackView.reward.amount'),
      cashbackAmount: _.get(this.props, 'cashbackView.reward.amount'),
      cashbackType: _.get(this.props, 'cashbackView.reward.type'),
      opacityNotification: !!opacityNotification
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      (!this.preparingToRun &&
        !this.state.running &&
        (!this.state.didTryCodes &&
          nextProps.view.shouldTryCoupons &&
          !this.props.view.shouldTryCoupons)) ||
      (this.state.didTryCodes && nextProps.view.forceTryCoupons && !this.props.view.forceTryCoupons)
    ) {
      this.preparingToRun = true;
      this.setState(
        {
          hideNotification: false,
          didTryCodes: false,
          result: null,
          running: true,
          barComplete: false,
          roo: nextProps.view.roo
        },
        () => {
          this.onTryCodes(null, null, true);
          this.preparingToRun = false;
        }
      );

      if (nextProps.view.forceTryCoupons) {
        return;
      }
    }

    const stateUpdate = {};

    if (this.state.rooRunning && this.props.view.rooRunning && !nextProps.view.rooRunning) {
      stateUpdate.running = false;
      stateUpdate.rooRunning = false;
    }

    if (
      !this.props.view.shouldDismissTooltip &&
      nextProps.view.shouldDismissTooltip &&
      !this.state.running &&
      !this.state.result
    ) {
      this.onDismissTooltip();
    }

    if (nextProps.view.result) {
      stateUpdate.result = nextProps.view.result;
    }

    if (nextProps.view.roo) {
      stateUpdate.roo = nextProps.view.roo;
    }

    if (_.has(nextProps, 'view.showThrottleToolTip')) {
      stateUpdate.showThrottleToolTip = nextProps.view.showThrottleToolTip;
    }

    if (_.has(nextProps, 'view.hideThrottleToolTip')) {
      stateUpdate.hideThrottleToolTip = nextProps.view.hideThrottleToolTip;
    }
    this.setState(stateUpdate);
  }

  determineBackgroundOpacity(hideNotificationOverride) {
    // hideNotificationOverride - due to setState being async and not wanting to call this function inside setState callback
    let {hideNotification} = this.state;
    hideNotification = _.isBoolean(hideNotificationOverride)
      ? hideNotificationOverride
      : hideNotification;
    const showOnTop = !hasFeature('ext_sh_on_b');
    const showOnRight = true;
    const shouldShowCenterMiddle = this.shouldShowCenterMiddle();
    const fullPageModal = this.shouldShowFullPage()
      ? `full-page ${!hasFeature('coupon_invite_friends') ? 'invite-friends-full' : ''}`
      : shouldShowCenterMiddle
        ? 'center-middle'
        : '';
    const bacgroundOpacityValue =
      currentDomain() === 'amazon.com' ||
      hideNotification ||
      fullPageModal ||
      this.state.hideOpacityBackground
        ? ''
        : hasFeature('notif_background_opacity_25')
          ? 'background-opacity-25'
          : hasFeature('notif_background_opacity_40')
            ? 'background-opacity-40'
            : '';
    const backgroundOpacityClass =
      bacgroundOpacityValue &&
      !hideNotification &&
      !fullPageModal &&
      !this.state.hideOpacityBackground
        ? `background-opacity-1${!showOnTop ? '-bottom' : ''}${showOnRight ? '-right' : ''}`
        : (bacgroundOpacityValue &&
            !hideNotification &&
            !fullPageModal &&
            this.state.hideOpacityBackground) ||
          this.state.hideOpacityBackground
          ? 'background-opacity-out'
          : '';

    if (
      this.props.notificationBackgroundOpacity &&
      moment().isBefore(moment(this.props.notificationBackgroundOpacity).add(1, 'week'))
    ) {
      return {};
    }
    return {
      bacgroundOpacityValue,
      backgroundOpacityClass
    };
  }

  render() {
    const {hideNotification, roo, reportAProblem} = this.state;
    const beforeRun = !this.state.running && !this.props.view.result;
    const showOnTop = !hasFeature('ext_sh_on_b');
    const showOnRight = true;
    const showOnRightOffset = hasFeature('n_or_1') && this.state.compNotifLoaded;
    const noScript = this.props.view.noScript;

    const shouldShowCenterMiddle = this.shouldShowCenterMiddle();
    const fullPageModal = this.shouldShowFullPage()
      ? `full-page ${!hasFeature('coupon_invite_friends') ? 'invite-friends-full' : ''}`
      : shouldShowCenterMiddle
        ? 'center-middle'
        : '';
    const hideRight =
      currentDomain() === 'amazon.com' &&
      (this.state.running || _.get(this.state.result, 'pageReload') || this.state.barComplete);
    const hideRightClass = beforeRun || hideRight ? 'hide-right' : '';
    const hasLinkedCard = _.get(this.props.events, 'hasLinkedCard');
    const reward =
      _.get(this.props, 'cashbackView.reward') && !_.get(this.props, 'view.disableCreditsOverride')
        ? _.get(this.props, 'cashbackView.reward')
        : false;
    const {bacgroundOpacityValue, backgroundOpacityClass} = this.determineBackgroundOpacity();

    return this.state.showThrottleToolTip ? (
      <div>
        <Motion
          style={{
            opacity: spring(this.state.hideThrottleToolTip ? 0 : 1, {stiffness: 180, damping: 20})
          }}>
          {({opacity}) => (
            <Tooltip
              tip={true}
              tipLabel={'wikibuy tip:'}
              message={<span>click the green "w." above if you want to try codes again.</span>}
              style={{
                top: showOnTop ? '15px' : 'auto',
                bottom: showOnTop ? 'auto' : '15px',
                width: '461px',
                left: showOnRight ? 'auto' : '15px',
                right: showOnRightOffset ? this.state.rightOffset : showOnRight ? '15px' : 'auto'
              }}
              innerStyle={{opacity: `${opacity}`}}
              onDismissTooltip={this.onDismissTooltip.bind(this)}
            />
          )}
        </Motion>
      </div>
    ) : (
      <div
        onClick={
          !hideNotification
            ? () => {
                this.setState({hideOpacityBackground: true});
              }
            : null
        }
        className={
          hideNotification
            ? `disabled coupon-page ${hideRightClass} ${
                this.state.resetNotification ? fullPageModal : ''
              }`
            : `coupon-page ${hideRightClass} ${fullPageModal} ${backgroundOpacityClass} ${bacgroundOpacityValue}`
        }
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
              className="coupon-notification"
              style={{
                transform: `translate3d(0,${y}%,0)`,
                opacity: `${opacity}`,
                width: `${hasFeature('coupon_lg_cta') ? '300px' : '284px'}`,
                minHeight: `${hasFeature('coupon_lg_cta') ? '496px' : 'none'}`,
                marginRight: `${hasFeature('coupon_lg_cta') ? '12px' : '20px'}`
              }}>
              <CouponHeader
                reportAProblem={() => this.setState({reportAProblem: !this.state.reportAProblem})}
                reportAProblemOpen={this.state.reportAProblem}
                view={this.props.view}
                running={this.state.running}
                roo={roo}
                fullPageModal={fullPageModal}
                onClosePopup={this.onClosePopup.bind(this)}
              />

              <section>
                {noScript ? (
                  <NoScript
                    view={this.props.view}
                    reward={reward}
                    postCoupons={_.get(this.props, 'cashbackView.postCoupons')}
                  />
                ) : (
                  <RenderResult
                    deweyResult={this.props.deweyResult}
                    hasLinkedCard={hasLinkedCard}
                    exclusions={this.props.exclusions}
                    tld={this.props.tld}
                    storeContentApiData={this.state.storeContentApiData}
                    reportAProblem={reportAProblem}
                    hideRight={hideRight}
                    googleData={this.props.googleData}
                    domain={currentDomain()}
                    reward={reward}
                    postCoupons={_.get(this.props, 'cashbackView.postCoupons')}
                    fullPageModal={fullPageModal}
                    settings={this.state.settings}
                    shortCode={_.get(this.props, 'session.short_code')}
                    email={_.get(this.props, 'session.email')}
                    onTryCodes={this.onTryCodes.bind(this)}
                    onClosePopup={this.onClosePopup.bind(this)}
                    onToggleSubscribe={this.onToggleSubscribe.bind(this)}
                    getRunAnimation={this.getRunAnimation.bind(this)}
                    view={this.props.view}
                    running={this.state.running}
                    barComplete={this.state.barComplete}
                    ctaLoading={this.state.ctaLoading}
                  />
                )}
              </section>
            </div>
          )}
        </Motion>
      </div>
    );
  }

  shouldShowCenterMiddle() {
    return false; // NEVER CENTER ON COUPON
    // const orderTotal = _.get(this.props, 'deweyResult.pageData.order.total');
    // if (hasFeature('ext_cp_full_screen') && orderTotal > 7500) {
    if (hasFeature('ext_cp_full_screen')) {
      return true;
    }
  }

  shouldShowFullPage() {
    return (
      (!this.state.barComplete &&
        !this.state.running &&
        _.get(this.state.result, 'savings', 0) > 0 &&
        (!this.state.qualified || (this.state.qualified && this.state.activated))) ||
      // this.state.roo && WE MAY ALWAYS WANT TO SHOW FULL
      (this.state.running || this.state.result || _.get(this.props.view, 'forceTryCoupons'))
    );
  }

  onDismissTooltip() {
    if (!this.state.tooltipDismissed) {
      // hideThrottleToolTip runs the fade animation
      this.setState({hideThrottleToolTip: true});
      this.setState({hideNotification: true});
      this.setState({tooltipDismissed: true});

      setSeenNotificationTooltip('hasSeenCouponsThrottleToolTip');

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
    if (this.state.rooRunning) {
      cancelRoo();
    }
    throttleNotification(this.state.didTryCodes);
    if (!this.state.didTryCodes) {
      sendMetric('trackClick', 'dismissCouponNotification', label, {
        domain: currentDomain(),
        pagePath: location.pathname
      });
    }
  }

  async onToggleSubscribe() {
    const currentD = currentDomain();
    const subscriptions = this.state.settings.emailPreferences.coupons.domainSubscriptions;
    const subscribed = _.includes(subscriptions, currentD);
    let newSubscriptions;
    if (subscribed) {
      sendMetric('track', 'couponSubscribe', {
        domain: currentDomain(),
        pagePath: location.pathname,
        action: 'unsubscribed'
      });
      newSubscriptions = _.reject(subscriptions, d => d === currentD);
    } else {
      sendMetric('track', 'couponSubscribe', {
        domain: currentDomain(),
        pagePath: location.pathname,
        action: 'subscribed'
      });
      newSubscriptions = [...subscriptions, currentD];
    }
    this.setState({ctaLoading: true});
    const success = await updateEmailSubscriptions(newSubscriptions);
    this.setState({ctaLoading: false});
    if (success) {
      const newSettings = _.clone(this.state.settings);
      newSettings.emailPreferences.coupons.domainSubscriptions = newSubscriptions;
      this.setState({settings: newSettings});
    }
  }

  async onTryCodes(willEstimateRunTime, estimatedDuration, ignoreCancelled) {
    const reward =
      _.get(this.props, 'cashbackView.reward') && !_.get(this.props, 'view.disableCreditsOverride')
        ? _.get(this.props, 'cashbackView.reward')
        : false;
    const postCoupons = _.get(this.props.cashbackView, 'postCoupons');
    let activateCredits = false;
    if (reward && reward.amount && !postCoupons) {
      activateCredits = true;
    }
    if (this.state.redirectInCurrentTab && (activateCredits || !this.props.view.disableAffiliate)) {
      activateInCurrentTab(activateCredits);
      return;
    }

    this.setState({didTryCodes: true, running: true, rooRunning: !!this.props.view.roo});
    let tryCodes;
    const isRoo = Boolean(this.props.view.roo);
    if (isRoo) {
      tryCodes = tryRoo;
    } else {
      tryCodes = tryTigger;
    }
    const runAnimation = this.getRunAnimation(willEstimateRunTime, estimatedDuration);
    sendMetric('trackClick', 'tryCodesButton', 'try codes', {
      domain: currentDomain(),
      pagePath: location.pathname
    });

    Bluebird.all([
      tryCodes({
        ignoreCancelled,
        disableAffiliate: activateCredits || this.props.view.disableAffiliate
      }),
      activateCredits ? activateThroughPinnedTab() : Bluebird.resolve(),
      isRoo ? Bluebird.resolve().delay(runAnimation.duration) : Bluebird.resolve()
    ]).then(([codesResp, cashbackResp, animationResp]) => {
      if (cashbackResp) {
        sendMetric('track', 'activateCashbackRedirect', {
          domain: currentDomain(),
          pagePath: location.pathname,
          rewardAmount: reward.amount,
          rewardDisplay: reward.type
        });
      }

      const extendTimeout =
        _.get(codesResp, 'finishWithoutResult') ||
        _.get(codesResp, 'pageReload') ||
        _.get(codesResp, 'changePageLocation'); // HACK FOR WHEN RESULT HASNT COME THROUGH YET BUT STILL WAITING. STOP NOTIFICAtiON FROM SHOWING ORIGINAL STATE.
      setTimeout(() => {
        // Allow props for the result to come down.
        this.setState({running: false, barComplete: true, rooRunning: false}, () => {
          setTimeout(() => this.setState({barComplete: false}), 300);
        });
      }, extendTimeout ? 2400 : 200);
    });
  }

  getRunAnimation(willEstimateRunTime) {
    const {roo, estimatedRunTime} = this.props.view;
    // Allow for run time to be calculated by the DOM events the tigger script is emmiting,
    // or from the props

    let runAnimation;

    if (roo) {
      runAnimation = {duration: 0, stagger: 0};
    } else if (willEstimateRunTime) {
      runAnimation = {class: 'extra-extra-slow', stagger: 2000, duration: 80000};
    } else {
      if (estimatedRunTime <= 5000) {
        runAnimation = {class: 'fast', stagger: 500, duration: 5500};
      } else if (estimatedRunTime <= 10000) {
        runAnimation = {class: 'medium', stagger: 1000, duration: 10500};
      } else if (estimatedRunTime <= 15000) {
        runAnimation = {class: 'slow', stagger: 1500, duration: 15500};
      } else if (estimatedRunTime <= 20000) {
        runAnimation = {class: 'extra-slow', stagger: 2000, duration: 20500};
      } else {
        runAnimation = {class: 'extra-extra-slow', stagger: 2500, duration: 25500};
      }
    }
    return runAnimation;
  }

  closeModalOnClickOutside(e) {
    if (e.isTrusted && !!this.state.result && this.shouldShowFullPage()) {
      const path = e.path || (e.nativeEvent.composedPath && e.nativeEvent.composedPath());
      if (!_.find(path, el => el.className === 'wbext-coupon-notification')) {
        this.onClosePopup();
      }
    }
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
    deweyResult: ['deweyResult'],
    cashbackView: ['cashbackView'],
    exclusions: ['siteAPIData', 'siteData', 'merchantPage', 'exclusions'],
    tld: ['siteAPIData', 'meta', 'domain'],
    giftCardView: ['giftCardView'],
    session: ['session'],
    settings: ['settings'],
    googleData: ['googleData'],
    events: ['events'],
    notificationBackgroundOpacity: ['notificationBackgroundOpacity']
  },
  Coupon
);
