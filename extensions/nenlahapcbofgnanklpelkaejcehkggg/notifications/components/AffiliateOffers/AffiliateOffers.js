import {React} from 'utility/css-ns';
import _ from 'lodash';
import AffiliateItem from './components/AffiliateItem';
import hasFeature from 'utility/hasFeature';
import Collapse from 'react-collapse';
import sendMetric from 'utility/sendMetric';
import './affiliate-offers.less';

const NUMBER_TO_SHOW = 3;

class AffiliateOffers extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      showMoreEbay: false,
      showAll: false
    };
  }

  render() {
    let offers = _.cloneDeep(this.props.offers) || [];
    const otherEbayOffers = [];
    if (
      !this.props.totalsLayout ||
      (this.props.cartPricing && this.props.cartPricing.paymentsSupport)
    ) {
      offers.shift();
    }
    if (!this.props.totalsLayout) {
      offers.unshift(this.props.originResult);
    }

    if (this.props.bestAmazonResult) {
      offers.unshift(this.props.bestAmazonResult);
    }
    if (this.props.totalsLayout) {
      offers = _.sortBy(offers, 'pricing.total');
    }
    if (this.props.collapseEbay) {
      let hasEbay;
      offers = _.filter(offers, offer => {
        if (_.get(offer, 'product.vendor') === 'ebay.com') {
          if (!hasEbay) {
            hasEbay = true;
            return true;
          }
          otherEbayOffers.push(offer);
          return false;
        }
        return true;
      });
    }
    return (
      <div
        className={`affiliate-offers ${this.props.totalsLayout ? 'totals-layout' : ''}`}
        onClick={e => e.stopPropagation()}>
        {_.map(
          !this.props.limitResults
            ? offers
            : this.state.showAll
              ? offers
              : _.take(offers, NUMBER_TO_SHOW),
          (offer, i) => {
            const productFeedback = _.find(_.get(this.props.feedbackData, 'products'), {
              id: `product.${_.get(offer, 'product.wbpid')}`
            });
            return (
              <div key={i} className="slide">
                <div className="slide-wrapper">
                  <AffiliateItem
                    sidebarLayout={this.props.sidebarLayout}
                    totalsLayout={this.props.totalsLayout}
                    index={i}
                    runId={this.props.runId}
                    originResult={this.props.originResult}
                    offer={offer}
                    inputData={this.props.inputData}
                    onPay={this.props.onPay}
                    productFeedback={productFeedback}
                    showVoting={this.props.showVoting}
                  />
                  {_.get(offer, 'product.vendor') === 'ebay.com' && otherEbayOffers.length ? (
                    <div>
                      <h5 className="bold" onClick={this.onClickShowMoreEbay.bind(this)}>
                        {this.state.showMoreEbay ? (
                          <span className="show-more">
                            <span>fewer eBay offers</span> <span className="disclosure less" />
                          </span>
                        ) : (
                          <span className="show-more">
                            <span>more eBay offers</span> <span className="disclosure more" />
                          </span>
                        )}
                      </h5>
                      <Collapse isOpened={this.state.showMoreEbay} className="collapse">
                        {_.map(otherEbayOffers, (offer, i) => {
                          const productFeedback = _.find(
                            _.get(this.props.feedbackData, 'products'),
                            {id: `product.${_.get(offer, 'product.wbpid')}`}
                          );
                          return (
                            <AffiliateItem
                              key={offer.id}
                              sidebarLayout={this.props.sidebarLayout}
                              totalsLayout={this.props.totalsLayout}
                              index={i}
                              runId={this.props.runId}
                              originResult={this.props.originResult}
                              offer={offer}
                              inputData={this.props.inputData}
                              onPay={this.props.onPay}
                              productFeedback={productFeedback}
                              showVoting={this.props.showVoting}
                            />
                          );
                        })}
                      </Collapse>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          }
        )}
        {offers.length > NUMBER_TO_SHOW && this.props.limitResults ? (
          <h5 className="midnight-link bold show-more" onClick={this.onClickShowMore.bind(this)}>
            {!this.state.showAll ? 'more offers' : 'fewer offers'}
          </h5>
        ) : null}
      </div>
    );
  }

  onClickShowMoreEbay() {
    sendMetric(
      'trackClick',
      'showMoreEbayOffers',
      this.state.showMoreEbay ? 'less eBay offers' : 'more eBay offers'
    );
    this.setState({showMoreEbay: !this.state.showMoreEbay});
  }

  onClickShowMore() {
    sendMetric('trackClick', 'showMoreOffers', this.state.showAll ? 'less offers' : 'more offers');
    this.setState({showAll: !this.state.showAll});
  }
}

export default AffiliateOffers;
