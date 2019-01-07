import {React} from 'utility/css-ns';
import {Component} from 'react';
import _ from 'lodash';
import formatCurrency from 'utility/formatCurrency';
import sendMetric from 'utility/sendMetric';
import numeral from 'numeral';
import AnnotationTooltip from '../AnnotationTooltip';
import './savings-details.less';

// <div className="breakdown-item">
//   <div className="label">Fulfilled by Amazon:</div>
//   <div className="value">{vendor === 'Amazon' ? <span>&#10003;</span> : <span>&#8212;</span>}</div>
// </div>
// <div className="breakdown-item">
//   <div className="label">Prime Shipping:</div>
//   <div className="value">{vendor === 'Amazon' ? <span>&#10003;</span> : <span>&#8212;</span>}</div>
// </div>

const CompareItem = ({classes, result, hasReward}) => {
  const vendor = _.get(result, 'origin') ? 'Amazon' : 'Wikibuy';
  const shipping = _.get(result, 'pricing.shipping');
  const tax = _.get(result, 'pricing.tax');
  const shippingAndTax = !shipping && !tax ? 'Included' : formatCurrency(shipping + tax);
  const minDays = _.get(result, 'details.estimatedDeliveryMinDays');
  const maxDays = _.get(result, 'details.estimatedDeliveryMaxDays');
  const deliveryInDays =
    minDays && maxDays && minDays !== maxDays
      ? `${minDays} - ${maxDays}`
      : minDays || maxDays
        ? `${minDays || maxDays}`
        : null;
  const shippingSpeed = _.get(result, 'pricing.shippingSpeed');
  const reward = _.get(result, 'pricing.reward.amount');
  // TODO handle marketplace sellers and marketplace comparison
  return (
    <div className={`${classes} compare-item`}>
      <h2>{vendor} Total</h2>
      <div className="breakdown">
        <div className="breakdown-item price">
          <div className="label">Price:</div>
          <div className="value">{formatCurrency(_.get(result, 'pricing.subtotal'))}</div>
        </div>
        <div className="breakdown-item tax">
          <div className="label">Shipping & Tax:</div>
          <div className="value">{shippingAndTax}</div>
        </div>
        {hasReward ? (
          <div className="breakdown-item tax">
            <div className="label">Credit:</div>
            {reward ? (
              <div className="value green">{reward / 100}% back</div>
            ) : (
              <div className="value">
                <span>&#8212;</span>
              </div>
            )}
          </div>
        ) : null}
      </div>
      <div className="summary">
        <div>
          <h1>
            {reward
              ? formatCurrency(_.get(result, 'pricing.afterRewardTotal'))
              : formatCurrency(_.get(result, 'pricing.total'))}
          </h1>
          {deliveryInDays ? (
            <h6>
              Arrives in{' '}
              {deliveryInDays === '1' ? `${deliveryInDays} day` : `${deliveryInDays} days`}
            </h6>
          ) : shippingSpeed ? (
            <h6>{shippingSpeed} Shipping</h6>
          ) : null}
        </div>
      </div>
    </div>
  );
};

class SavingsDetails extends Component {
  componentDidMount() {
    sendMetric('page', 'savingsDetailsTooltip', {
      view: 'quoteCompleteNotification',
      type: 'notificationHover',
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    });
  }

  render() {
    const run = this.props.run;
    const result = _.find(_.get(run, 'results'), {heroOffer: true});
    const originResult = _.find(_.get(run, 'results'), {origin: true});
    const resultIsAmazonMarketplace = _.get(result, 'product.vendor') === 'amazon.com';
    const savings = _.get(result, 'savings') > 0 ? _.get(result, 'savings') : 0;
    const reward = _.get(result, 'pricing.reward.amount');
    const percentOff = _.get(originResult, 'pricing.total')
      ? savings / _.get(originResult, 'pricing.total')
      : 0;
    const percentOffPercent = numeral(percentOff).format('0,0%');
    return (
      <AnnotationTooltip
        onCloseTooltip={this.props.onCloseTooltip}
        classes="savings-details-tooltip">
        {resultIsAmazonMarketplace ? (
          <h2>
            Save <span className="bold">{formatCurrency(_.get(result, 'savings'))}</span> buying
            from a different <br />Amazon seller.
          </h2>
        ) : savings ? (
          <h2>
            Save <span className="bold">{formatCurrency(_.get(result, 'savings'))}</span> buying
            from a different seller.
          </h2>
        ) : reward ? (
          <h2>
            Get <span className="bold">{reward / 100}%</span> back buying from a different seller.
          </h2>
        ) : null}
        <div className="comparison" onClick={() => this.props.viewProductPage()}>
          <CompareItem classes="origin-result" result={originResult} hasReward={!!reward} />
          <CompareItem classes="wikibuy-result" result={result} hasReward={!!reward} />
        </div>
        {resultIsAmazonMarketplace ? (
          <button
            className="button-style primary-btn-large"
            onClick={this.props.addToAmazonCart.bind(this, result)}>
            Add item to Amazon Cart{' '}
            {percentOff && percentOffPercent !== '0%' ? (
              <span>
                <span className="pipe">|</span>
                {`${numeral(percentOff).format('0,0%')}`} off
              </span>
            ) : null}
          </button>
        ) : (
          <button
            className="button-style primary-btn-large"
            onClick={() => this.props.viewProductPage()}>
            Continue to Wikibuy{' '}
            {percentOff && percentOffPercent !== '0%' ? (
              <span>
                <span className="pipe">|</span>
                {`${numeral(percentOff).format('0,0%')}`} off
              </span>
            ) : null}
          </button>
        )}
      </AnnotationTooltip>
    );
  }
}

export default SavingsDetails;
