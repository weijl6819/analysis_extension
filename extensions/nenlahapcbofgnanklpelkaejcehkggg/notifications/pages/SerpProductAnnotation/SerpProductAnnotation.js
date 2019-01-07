import {React} from 'utility/css-ns';
import {Component} from 'react';
import _ from 'lodash';
import {branch} from 'higher-order/baobab';
import sendMetric from 'utility/sendMetric';
import formatCurrency from 'utility/formatCurrency';
import getEstimate from 'messenger/outbound/getEstimate';
import getCart from 'messenger/outbound/getCart';
import OffersListAnnotationTooltip from 'components/OffersListAnnotationTooltip';
import {WIKIBUY_URL, WIKIBUY_API} from 'constants';
import openWithoutReferrer from 'utility/openWithoutReferrer';
import uuid from 'node-uuid';
import Promise from 'bluebird';
import './serp-product-annotation.less';

const WikibuyIcon = () => (
  <svg className="wikibuy-icon-svg" x="0px" y="0px" viewBox="0 0 60 45" style={{maxWidth: '22px'}}>
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

class SerpAnnotation extends Component {
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
    }
  }

  componentDidMount() {
    sendMetric('page', 'serpProductAnnotation', {
      view: 'serpProductAnnotation',
      type: 'notification',
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname,
      searchIndex: this.props.searchIndex
    });
    this.saveLink.addEventListener('mouseenter', this.onEnterSavingsLink.bind(this));
    this.saveLink.addEventListener('mouseleave', this.onLeaveSavingsLink.bind(this));
    try {
      const yahooContainer = document.querySelector('#web .reg');
      const overflowContainers = yahooContainer
        ? [yahooContainer]
        : document.querySelectorAll('.PartialSearchResults-item');
      _.forEach(overflowContainers, c => {
        c.style.setProperty('overflow', 'visible', 'important');
      });
    } catch (e) {}
  }

  render() {
    const hasTooltipOpen = this.state.showSavingsDetails;
    const complete = this.state.cart;
    const results = _.get(this.state, 'cart.items[0].results');
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
        (vendorNames.length < 12 || vendorName === alternateOriginVendor)
      ) {
        vendorNames.push(vendorName);
        return true;
      }
    });
    const bestResultTotal =
      _.get(filteredResults, '[0].pricing.total') || _.get(filteredResults, '[1].pricing.total'); // accounts for cases when amazon pricing fails
    if (this.state.error || (complete && !bestResultTotal)) {
      return null;
    }
    return (
      <div className={`serp-product-annotation ${hasTooltipOpen ? 'tooltip-open' : ''}`}>
        <div ref={c => (this.saveLink = c)}>
          <h5
            className={`savings-link activate-link primary-link bold`}
            onClick={this.viewProductPage.bind(this)}>
            <WikibuyIcon />
            {!complete ? (
              <span>
                Searching{' '}
                <div className="wave">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </span>
            ) : filteredResults.length ? (
              <span>
                {filteredResults.length} offer{filteredResults.length === 1 ? '' : 's'} from{' '}
                {formatCurrency(_.get(filteredResults, '[0]pricing.total'))}
              </span>
            ) : (
              <span>Best price</span>
            )}
          </h5>
          {filteredResults.length && this.state.showSavingsDetails ? (
            <OffersListAnnotationTooltip
              hideSavingsDetails={this.hideSavingsDetails.bind(this)}
              viewProductPage={this.viewProductPage.bind(this)}
              visitMerchant={this.visitMerchant.bind(this)}
              filteredResults={filteredResults}
              searchIndex={this.props.searchIndex}
              fullRunComplete={this.state.fullRunComplete}
            />
          ) : null}
        </div>
      </div>
    );
  }

  onEnterSavingsLink() {
    if (this.savingsDetailsLeaveTimeout) {
      clearTimeout(this.savingsDetailsLeaveTimeout);
    }
    this.showSavingsDetails();
  }

  onLeaveSavingsLink() {
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
    const runId = _.get(this.state, 'pricing.updatedPricingRunId');
    sendMetric('trackClick', 'viewProductPage', '', {
      view: 'serpProductAnnotation',
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname,
      pageLocation: 'annotation',
      productId: wbid,
      productUrl: productPath,
      label: String(label),
      searchIndex: this.props.searchIndex
    });
    if (productPath && runId) {
      openWithoutReferrer(`${WIKIBUY_URL}${productPath}${runId ? `?run=${runId}` : ''}`);
    }
  }

  visitMerchant(result) {
    const runId = _.get(this.state, 'pricing.updatedPricingRunId');
    const matchId = _.get(result, 'id');
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
        this.setState({cart, fullRunComplete: true});
      } else {
        await Promise.resolve().delay(2000);
        this.pollForComplete(runId);
      }
    }
  }
}

export default branch({}, SerpAnnotation);
