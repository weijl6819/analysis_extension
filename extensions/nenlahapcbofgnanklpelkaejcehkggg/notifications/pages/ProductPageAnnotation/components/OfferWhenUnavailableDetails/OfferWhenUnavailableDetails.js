import {React} from 'utility/css-ns';
import {Component} from 'react';
import _ from 'lodash';
import formatCurrency from 'utility/formatCurrency';
import sendMetric from 'utility/sendMetric';
import AnnotationTooltip from '../AnnotationTooltip';
import './offer-when-unavailable-details.less';

const CompareItem = ({className, result, hasReward}) => {
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
    <div className={`${className} compare-item`}>
      <h2>Available on Wikibuy</h2>
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

class OfferWhenUnavailableDetails extends Component {
  componentDidMount() {
    sendMetric('page', 'offerWhenUnavailableDetailsTooltip', {
      view: 'quoteCompleteNotification',
      type: 'notificationHover',
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    });
  }

  render() {
    const run = this.props.run;
    const result = _.get(run, 'results[1]');
    return (
      <AnnotationTooltip
        onCloseTooltip={this.props.onCloseTooltip}
        classes="offer-when-unavailable-details">
        <div className="comparison" onClick={() => this.props.viewProductPage(result.resultId)}>
          <CompareItem className="wikibuy-result" result={result} hasReward={false} />
        </div>
        <button
          className="button-style primary-btn-large"
          onClick={() => this.props.viewProductPage(result.resultId)}>
          Continue to Wikibuy
        </button>
      </AnnotationTooltip>
    );
  }
}

export default OfferWhenUnavailableDetails;
