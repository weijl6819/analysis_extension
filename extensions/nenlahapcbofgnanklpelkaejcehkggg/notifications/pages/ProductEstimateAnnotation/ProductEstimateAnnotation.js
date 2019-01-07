import {React} from 'utility/css-ns';
import {Component} from 'react';
import _ from 'lodash';
import {branch} from 'higher-order/baobab';
import sendMetric from 'utility/sendMetric';
import formatCurrency from 'utility/formatCurrency';
import getEstimate from 'messenger/outbound/getEstimate';
import getCart from 'messenger/outbound/getCart';
import Promise from 'bluebird';
import OffersListAnnotationTooltip from 'components/OffersListAnnotationTooltip';
import openWithoutReferrer from 'utility/openWithoutReferrer';
import {WIKIBUY_URL, WIKIBUY_API} from 'constants';
import uuid from 'node-uuid';
import './product-estimate-annotation.less';

const WikibuyIcon = () => (
  <svg className="wikibuy-icon-svg" x="0px" y="0px" viewBox="0 0 60 45" style={{maxWidth: '28px'}}>
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

const Searching = () => (
  <div className="searching-component">
    <h4>Searching</h4>
    <div className="wave">
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
    </div>
  </div>
);

const ResultCount = ({count}) => (
  <div className="wikibuy-savings-component">
    <h4>
      {count} offer{count === 1 ? '' : 's'}
    </h4>
  </div>
);

const OffersFrom = ({count, total, noIncudeTaxShipping}) => (
  <div className="wikibuy-savings-component">
    <h4>
      from {formatCurrency(total)}{' '}
      <span style={{fontSize: '10px'}}>{noIncudeTaxShipping ? '' : 'inc. tax + shipping'}</span>
    </h4>
  </div>
);

const WikibuySavings = ({savings, reward}) => (
  <div className="wikibuy-savings-component">
    {savings ? (
      <h4>
        Save <span className="dollar-sign">$</span>
        {formatCurrency(savings, {removeCents: savings >= 100, noDollarSign: true})}
      </h4>
    ) : reward ? (
      <h4>Get {reward / 100}% back</h4>
    ) : null}
  </div>
);

const BestPrice = ({productNotFound}) => (
  <div className="best-price-component">
    {!productNotFound ? <h4>Best price</h4> : <h4>No offers</h4>}
  </div>
);

class ProductEstimateAnnotation extends Component {
  state = {};

  componentWillMount() {
    if (this.props.asin) {
      getEstimate({asin: this.props.asin}).then(data => {
        const runId = _.get(data, 'pricing.updatedPricingRunId');
        let fullRunComplete;
        if (runId !== _.get(data.cart, 'items[0].id')) {
          this.pollForComplete(runId);
        } else {
          fullRunComplete = true;
        }
        this.setState({
          error: data.error,
          cart: data.cart,
          pricing: data.pricing,
          product: data.product,
          fullRunComplete
        });
      });
    } else if (this.props.input) {
      getEstimate({
        product: _.get(this.props.input, 'product'),
        gtin: _.get(this.props.input, 'product.gtin'),
        unpricedResults: _.get(this.props.input, 'unpricedResults')
      }).then(data => {
        const runId = _.get(data, 'pricing.updatedPricingRunId');
        let fullRunComplete;
        if (runId !== _.get(data.cart, 'items[0].id')) {
          this.pollForComplete(runId);
        } else {
          fullRunComplete = true;
        }
        this.setState({
          error: data.error,
          cart: data.cart,
          pricing: data.pricing,
          product: data.product,
          fullRunComplete
        });
      });
    }
  }

  componentDidMount() {
    sendMetric('page', 'productEstimateAnnotation', {
      view: 'productEstimateNotificaton',
      type: 'annotation',
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname,
      searchIndex: this.props.searchIndex
    });
    this.saveButton.addEventListener('mouseenter', this.onEnterSavingsButton.bind(this));
    this.saveButton.addEventListener('mouseleave', this.onLeaveSavingsButton.bind(this));
    try {
      const overflowContainer = document.querySelector('#web .reg');
      overflowContainer.style.setProperty('overflow', 'visible', 'important');
    } catch (e) {}
    // Trigger resize fixes layout issues on google shopping grid view
    if (this.props.simulateResize) {
      window.dispatchEvent(new Event('resize'));
    }
  }

  render() {
    const complete =
      (this.props.waitForFullRun ? this.state.fullRunComplete : this.state.cart) ||
      !!this.state.error;
    const results = _.get(this.state, 'cart.items[0].results');
    const alternateOriginVendor = _.get(this.props.input, 'unpricedResults[0].vendor');
    let ebayCount = 0;
    const vendorNames = [];
    const filteredResults = _.filter(results, result => {
      const vendorName = _.get(result, 'product.vendorName');
      if (vendorName === 'eBay' && !_.get(result, 'meta.paymentsSupport')) {
        if (ebayCount < 3) {
          ebayCount++;
          vendorNames.push(vendorName);
          return true;
        }
      } else if (
        _.get(result, 'pricing.total') &&
        vendorNames.indexOf(vendorName) === -1 &&
        (vendorNames.length < 12 || _.get(result, 'product.vendor') === alternateOriginVendor)
      ) {
        if (!_.get(result, 'meta.paymentsSupport')) {
          vendorNames.push(vendorName);
        }
        return true;
      }
    });
    const originResult = _.get(this.state, 'cart.items[0].originResult');
    if (originResult) {
      _.set(originResult, 'meta.verificationClassifierOutput.verified', true);
      _.set(originResult, 'origin', true);
      const index = _.findIndex(filteredResults, r => r.id === originResult.id);
      if (index) {
        filteredResults[index] = originResult;
      }
    }
    const bestResultTotal =
      _.get(filteredResults, '[0].pricing.total') || _.get(filteredResults, '[1].pricing.total'); // accounts for cases when amazon pricing fails
    const alternateOrigin = _.find(
      filteredResults,
      r => r && r.vendor === _.get(this.props.input, 'unpricedResults[0].vendor')
    );
    const result = _.get(this.state, 'cart.items[0].result');
    let savings;
    if (alternateOrigin) {
      savings = _.get(alternateOrigin, 'pricing.total') - bestResultTotal;
      savings = bestResultTotal && savings > 0 ? savings : 0;
    } else {
      savings = _.get(result, 'savings') > 0 ? _.get(result, 'savings') : 0;
    }
    const reward =
      _.get(result, 'pricing.afterRewardTotal') <
      _.get(this.props, 'notification.run.originResult.pricing.total')
        ? _.get(result, 'pricing.reward.amount')
        : null;
    const savingsButtonClassName = `${
      complete
        ? `${
            (this.props.offersFrom || savings || reward) &&
            (filteredResults.length > 1 ||
              (filteredResults.length &&
                _.get(filteredResults, '[0].product.vendor') !== alternateOriginVendor))
              ? 'savings'
              : 'no-savings'
          }`
        : 'searching'
    }`;
    const hasTooltipOpen = this.state.showSavingsDetails;
    return (
      <div className={`product-estimate-annotation ${hasTooltipOpen ? 'tooltip-open' : ''}`}>
        <div
          className={`savings-button ${savingsButtonClassName}`}
          onClick={this.viewProductPage.bind(this, 'savingsButton')}
          ref={c => (this.saveButton = c)}>
          <WikibuyIcon />
          {!complete ? (
            <Searching />
          ) : this.props.offersFrom &&
          (filteredResults.length > 1 ||
            (filteredResults.length &&
              _.get(filteredResults, '[0].product.vendor') !== alternateOriginVendor)) ? (
            <OffersFrom
              total={bestResultTotal}
              count={filteredResults.length}
              noIncudeTaxShipping={this.props.noIncudeTaxShipping}
            />
          ) : savings && bestResultTotal ? (
            <WikibuySavings savings={savings} reward={reward} />
          ) : (
            <BestPrice productNotFound={!originResult} />
          )}
          {filteredResults.length && this.state.showSavingsDetails ? (
            <OffersListAnnotationTooltip
              view={'productEstimateAnnotation'}
              hideSavingsDetails={this.hideSavingsDetails.bind(this)}
              viewProductPage={this.viewProductPage.bind(this)}
              visitMerchant={this.visitMerchant.bind(this)}
              filteredResults={filteredResults}
              searchIndex={this.props.searchIndex}
              fullRunComplete={this.state.fullRunComplete}
              run={_.get(this.state, 'cart.items[0]')}
            />
          ) : null}
        </div>
      </div>
    );
  }

  onEnterSavingsButton() {
    if (this.savingsDetailsLeaveTimeout) {
      clearTimeout(this.savingsDetailsLeaveTimeout);
    }
    this.showSavingsDetails();
  }

  onLeaveSavingsButton() {
    this.savingsDetailsLeaveTimeout = setTimeout(() => {
      this.hideSavingsDetails();
    }, 500);
  }

  hideSavingsDetails() {
    this.setState({showSavingsDetails: false});
  }

  showSavingsDetails() {
    this.setState({
      showSavingsDetails: true,
      showWatchlistDetails: false
    });
  }

  viewProductPage(label) {
    const wbid = _.get(this.state, 'product.wbid');
    const productPath = _.get(this.state, 'product.url');
    const runId = this.state.useEstimateRun
      ? _.get(this.state, 'pricing.estimateRunId')
      : _.get(this.state, 'pricing.updatedPricingRunId');
    sendMetric('trackClick', 'viewProductPage', '', {
      view: this.props.view,
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname,
      pageLocation: 'annotation',
      productId: wbid,
      productUrl: productPath,
      label: String(label),
      searchIndex: this.props.searchIndex
    });
    if (productPath && runId) {
      if (!wbid) {
        return;
      } else {
        openWithoutReferrer(
          `${WIKIBUY_URL}${productPath}${runId ? `?run=${runId}` : ''}${
            this.props.originVendor ? `&originVendor=${this.props.originVendor}` : ''
          }`
        );
      }
    }
  }

  visitMerchant(result) {
    const runId = this.state.useEstimateRun
      ? _.get(this.state, 'pricing.estimateRunId')
      : _.get(this.state, 'pricing.updatedPricingRunId');
    const matchId = _.get(result, 'id');
    const resultId = _.get(result, 'resultId');
    const paymentsSupport = _.get(result, 'meta.paymentsSupport');
    const url = _.get(result, 'product.url');
    if (paymentsSupport) {
      window.open(`${WIKIBUY_URL}/run/${runId}/place-order/${matchId}`);
      sendMetric('trackClick', 'checkout', '', {
        view: 'resultListTooltip',
        domain: location.hostname.replace(/^www\./, ''),
        pagePath: location.pathname,
        pageLocation: 'annotation',
        matchDomain: _.get(result, 'product.vendor'),
        matchUrl: url,
        matchId,
        resultId,
        quoteId: runId,
        searchIndex: this.props.searchIndex
      });
    } else {
      const channel = _.get(result, 'pricing.reward.amount') ? 'cashback-ims' : 'cart';
      const clickId = uuid.v4().replace(/-/g, '');
      window.open(
        `${WIKIBUY_API}/redirect?r=true&url=${encodeURIComponent(
          url
        )}&clickId=${clickId}&channel=${channel}`
      );
      sendMetric('track', 'visitMerchant', {
        view: 'resultListTooltip',
        domain: location.hostname.replace(/^www\./, ''),
        pagePath: location.pathname,
        pageLocation: 'annotation',
        matchDomain: _.get(result, 'product.vendor'),
        matchUrl: url,
        matchId,
        resultId,
        quoteId: runId,
        clickId,
        searchIndex: this.props.searchIndex
      });
    }
  }

  async pollForComplete(runId) {
    if (!_.get(this.state.cart)) {
      const cart = await getCart({runId});
      if (cart) {
        if (
          !_.get(cart, 'items[0].originResult.pricing.total') &&
          _.get(cart, 'items[0].results.length') === 1
        ) {
          this.setState({fullRunComplete: true, useEstimateRun: true});
        } else {
          this.setState({cart, fullRunComplete: true});
        }
      } else {
        await Promise.resolve().delay(2000);
        this.pollForComplete(runId);
      }
    }
  }
}

export default branch(
  {
    notification: ['estimateNotifcation']
  },
  ProductEstimateAnnotation
);
