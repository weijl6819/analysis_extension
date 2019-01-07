import {React} from 'utility/css-ns';
import {Component} from 'react';
import _ from 'lodash';
import formatCurrency from 'utility/formatCurrency';
import ProductImage from 'components/ProductImage';
import FiveStarRating from 'components/FiveStarRating';

class ProductOffer extends Component {
  render() {
    let savings;
    let reward;
    let originResult;
    let bestResult;

    if (_.get(this.props, 'notification.run.status') === 'complete') {
      originResult = _.get(this.props, 'notification.run.originResult');
      bestResult = _.find(_.get(this.props, 'notification.run.results'), {heroOffer: true});
      savings = _.get(bestResult, 'savings');
      reward = _.get(bestResult, 'pricing.reward.amount');
    }

    if (!originResult) {
      return null;
    }

    let originShipping = originResult.pricing.shipping
      ? formatCurrency(originResult.pricing.shipping)
      : 'Free';
    let originTax = originResult.pricing.tax ? formatCurrency(originResult.pricing.tax) : 'No Tax';

    let bestShipping = _.get(bestResult, 'pricing.shipping')
      ? formatCurrency(bestResult.pricing.shipping)
      : 'Free';
    let bestTax = _.get(bestResult, 'pricing.tax')
      ? formatCurrency(bestResult.pricing.tax)
      : 'No Tax';

    const vendor = 'Wikibuy';
    const deal = this.props.communityDeal;
    const title = _.get(deal, 'product.title');
    return (
      <div className="primary-deal-wrapper">
        <h2>
          {reward
            ? `Get ${reward / 100}%back with Wikibuy.`
            : savings
              ? `Save ${formatCurrency(savings, {removeCents: savings >= 100})} with Wikibuy.`
              : 'Is this the best time to buy?'}
        </h2>
        {deal ? (
          <div className="product-wrapper">
            <div className="offer-content">
              {title ? (
                <div className="offer-product-title">
                  <h5>{title}</h5>
                </div>
              ) : null}

              {this.props.rating ? (
                <FiveStarRating count={this.props.ratingCount} rating={this.props.rating} />
              ) : null}
            </div>
          </div>
        ) : null}
        {bestResult && savings ? (
          <div className="offer-wrapper">
            <div className="breakdown-wrapper">
              <div className="row merchant">
                <h2 className="name" />
                <h5 className="merchant origin">Amazon</h5>
                <h5 className="merchant match">{vendor}</h5>
              </div>
              <div className="row">
                <h5 className="name">Price</h5>
                <h5 className="origin">{formatCurrency(originResult.pricing.subtotal)}</h5>
                <h5 className="match">{formatCurrency(bestResult.pricing.subtotal)}</h5>
              </div>
              <div className="row">
                <h5 className="name">Shipping</h5>
                <h5 className="origin">{originShipping}</h5>
                <h5 className="match">{bestShipping}</h5>
              </div>
              <div className="row">
                <h5 className="name">Tax</h5>
                <h5 className="origin">{originTax}</h5>
                <h5 className="match">{bestTax}</h5>
              </div>
              {bestResult.pricing.discount ? (
                <div className="row">
                  <h5 className="name">Discount</h5>
                  <h5 className="origin">-</h5>
                  <h5 className="match">-{formatCurrency(bestResult.pricing.discount)}</h5>
                </div>
              ) : null}
              <div className="row total">
                <h5 className="name">Estimated total</h5>
                <h5 className="origin bold">{formatCurrency(originResult.pricing.total)}</h5>
                <h5 className="match bold">{formatCurrency(bestResult.pricing.total)}</h5>
              </div>
              <div
                className="buttons-wrapper"
                onClick={this.props.onVisitMerchant.bind(this, bestResult)}>
                <button className="primary-btn-large full-button">{`Save ${formatCurrency(savings, {
                  removeCents: savings >= 100
                })}`}</button>
              </div>
              <h5
                className="primary-text-link palmetto"
                onClick={e => this.props.onVisitMerchant(bestResult, e)}>
                View Price History
              </h5>
            </div>
          </div>
        ) : (
          <div>
            <button
              className="primary-btn-large full-button"
              onClick={e => this.props.onVisitMerchant(bestResult, e)}>
              View Price History
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default ProductOffer;
