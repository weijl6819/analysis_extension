import {React} from 'utility/css-ns';
import {Component} from 'react';
import _ from 'lodash';
import sendMetric from 'utility/sendMetric';
import formatCurrency from 'utility/formatCurrency';
import showFollow from 'messenger/outbound/showFollow';
import AnnotationTooltip from '../../pages/ProductPageAnnotation/components/AnnotationTooltip';
import './offers-list-annotation-tooltip.less';

const originVendorNameMap = {
  'amazon.com': 'Amazon',
  'homedepot.com': 'Home Depot',
  'bestbuy.com': 'Best Buy',
  'target.com': 'Target'
};

export default class OffersListAnnotationTooltip extends Component {
  componentDidMount() {
    sendMetric('page', 'offersListAnnotationTooltip', {
      view: this.props.view || 'serpProductAnnotation',
      type: 'notificationHover',
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname,
      searchIndex: this.props.searchIndex
    });
  }
  render() {
    const hasSpecialOffer = !!_.find(this.props.filteredResults, result => {
      return (
        (_.get(result, 'pricing.coupons.length') && !_.get(result, 'meta.paymentsSupport')) ||
        _.get(result, 'pricing.reward')
      );
    });
    return (
      <AnnotationTooltip
        classes="result-table-tooltip"
        onCloseTooltip={() => this.props.hideSavingsDetails()}>
        <div className={`${hasSpecialOffer ? 'special-offers' : ''} result-list`}>
          <div className="list-header">
            <h3 className="seller">Seller</h3>
            <h3 className="delivery">Delivery</h3>
            <h3 className="offer">Special Offer</h3>
            <h3 className="total">Est. Total</h3>
          </div>
          {_.map(this.props.filteredResults, result => {
            const vendor = _.get(result, 'product.vendor');
            let vendorName =
              _.get(result, 'product.vendorName') || originVendorNameMap[vendor] || vendor;
            if (_.get(result, 'meta.paymentsSupport')) {
              vendorName = 'Wikibuy';
            }
            let reward = _.get(result, 'pricing.reward');
            if (reward) {
              reward =
                reward.type === 'percentage' ? (
                  <span className="palmetto">
                    {`+${reward.amount / 100}% `} <span className="reward-break">back</span>
                  </span>
                ) : (
                  <span>
                    {`+${formatCurrency(reward.amount / 100)}`}{' '}
                    <span className="reward-break">in credit</span>
                  </span>
                );
            }
            const coupon = _.get(result, 'pricing.coupons.length') ? ' use code' : '';
            const verified = _.get(result, 'meta.verificationClassifierOutput.verified');
            const minDays = _.get(result, 'details.estimatedDeliveryMinDays');
            const maxDays = _.get(result, 'details.estimatedDeliveryMaxDays');
            const delivery =
              minDays === maxDays
                ? maxDays
                  ? `${maxDays} days`
                  : ''
                : `${minDays} - ${maxDays} days`;
            return (
              <div
                key={result.id}
                className="result-list-item"
                onClick={() => this.visitMerchant(result)}>
                <h3 className={`seller ${verified ? 'verified' : ''}`}>
                  {vendorName === 'Amazon' && !result.origin ? 'Amz. Marketplace' : vendorName}
                </h3>
                <h3 className="delivery">
                  <span>{delivery}</span>
                </h3>
                <h3 className="offer">
                  <span>
                    {coupon && !_.get(result, 'meta.paymentsSupport') ? (
                      <span className="icon-coupon coupon">{coupon}</span>
                    ) : reward ? (
                      <span>{reward}</span>
                    ) : null}
                  </span>
                </h3>
                <h3 className="total primary-btn-large">
                  {formatCurrency(_.get(result, 'pricing.total'))}
                </h3>
              </div>
            );
          })}
          {!this.props.fullRunComplete ? (
            <h5 className="finding-more bold">
              Finding more offers{' '}
              <div className="wave">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </h5>
          ) : null}
          <div className="rule" />
          <h5 style={{textAlign: 'center', marginTop: '10px'}}>
            <span
              className="primary-link"
              onClick={e => {
                e.preventDefault();
                this.props.viewProductPage('view');
              }}>
              View all offers
            </span>
          </h5>
        </div>
      </AnnotationTooltip>
    );
  }
  visitMerchant(result) {
    showFollow({details: result, run: this.props.run, productData: result.product});
    const preventFollow = true;
    this.props.visitMerchant(result, preventFollow);
  }
}
