import {React} from 'utility/css-ns';
import currency from 'utility/currency';
import ProductImage from 'components/ProductImage';
import shippingAndReturnsHelper from 'utility/shippingAndReturnsHelper';
import _ from 'lodash';
import moment from 'moment';
import {visitMerchant} from 'actions/notificationActions';
import './affiliate-item.less';

class ProductCard extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  render() {
    const offerId = _.get(this.props, 'offer.id', null);
    const savings = _.get(this.props, 'offer.savings', 0);

    const pricing = _.get(this.props, 'offer.pricing', null);
    const total = _.get(pricing, 'total', 0);

    const originImage = _.get(this.props, 'offer.product.image');
    const vendor =
      _.get(this.props, 'offer.vendor') ||
      _.get(this.props, 'offer.details.vendor') ||
      _.get(this.props, 'offer.product.vendor');
    const returns = shippingAndReturnsHelper(
      _.get(this.props, 'offer.details.shippingAndReturns', [])
    );

    const isOriginResult = _.get(this.props, 'originResult.product.vendor') === vendor;

    let arrivalDate = _.get(this.props, 'offer.details.arrival_date');
    arrivalDate = /(^[A-Z]+\.+ [A-Z]+\.+ [0-9]+)/gi.test(arrivalDate)
      ? arrivalDate
      : moment(arrivalDate).format('ddd. MMM. D');

    const layout = this.props.totalsLayout;
    const h4Classes = !layout ? 'bold' : '';
    const cta = layout ? `${vendor} →` : vendor;
    const vendorName =
      _.get(this.props, 'offer.product.vendorName') ||
      (vendor === 'amazon.com' ? 'Amazon' : vendor);
    const productFeedbackId =
      _.get(this.props, 'productFeedback.id') ||
      `product.${_.get(this.props, 'offer.product.wbpid')}`;
    const productFeedback = {
      up_votes: _.get(this.props, 'productFeedback.up_votes') || 0,
      down_votes: _.get(this.props, 'productFeedback.down_votes') || 0,
      id: productFeedbackId,
      wbpid:
        _.get(this.props, 'productFeedback.wbpid') ||
        _.get(this.props, 'originResult.product.wbpid') ||
        `amazon.com_${_.get(this.props, 'inputData.asin')}`,
      vote_selection: _.get(this.props, 'productFeedback.vote_selection'),
      match_wbpid: _.get(this.props, 'offer.product.wbpid')
    };

    return (
      <div className={`${this.props.sidebarLayout ? 'sidebar-layout' : ''} other-offer-tile-run`}>
        <div className="flex" onClick={this.onClickOffer.bind(this)}>
          <div className="flex">
            {!this.props.totalsLayout ? <ProductImage image={originImage} /> : null}
            <div>
              {this.props.sidebarLayout && savings > 0 ? (
                <h5 className="bold">
                  <span className="palmetto">Save {currency(savings, savings >= 100)}</span>{' '}
                  <span className="with-vendor">
                    with{' '}
                    <span
                      className="bold midnight"
                      style={{color: vendorName === 'Amazon' ? '#ff9900' : '#273c46'}}>
                      {vendorName}
                    </span>
                  </span>
                </h5>
              ) : this.props.sidebarLayout && savings <= 0 ? (
                <h5 className="bold">
                  <span className="with-vendor">
                    available from{' '}
                    <span
                      className="bold midnight"
                      style={{color: vendorName === 'Amazon' ? '#ff9900' : '#273c46'}}>
                      {vendorName}
                    </span>
                  </span>
                </h5>
              ) : null}
              {vendor === 'amazon.com' && this.props.totalsLayout && !this.props.sidebarLayout ? (
                <h4 className="bold" style={{color: '#ff9900'}}>
                  best Amazon offer
                </h4>
              ) : null}
              {this.props.sidebarLayout ? (
                <span className="group">
                  <h4 className="inline">
                    {total
                      ? currency(total)
                      : isOriginResult
                        ? currency(_.get(this.props, 'inputData.price'))
                        : '--'}
                  </h4>
                  <h4> est. arrival {arrivalDate}</h4>
                </span>
              ) : (
                <span className="group">
                  <h2 className="inline bold midnight">
                    {total
                      ? currency(total)
                      : isOriginResult
                        ? currency(_.get(this.props, 'inputData.price'))
                        : '--'}
                  </h2>
                  <h5 className="bold"> est. arrival {arrivalDate}</h5>
                </span>
              )}
              {!pricing ? (
                <h4 className={h4Classes} />
              ) : pricing.total === pricing.subtotal ? (
                <h4 className={h4Classes}>no tax, free shipping.</h4>
              ) : (
                <h4 className={h4Classes}>
                  includes tax and{pricing.shipping > 0 ? ' ' : ' free '}shipping.
                </h4>
              )}
              {!isOriginResult && _.get(this.props, 'offer.details.shippingAndReturns') ? (
                <h4 className={h4Classes}>
                  {returns.returnPeriod && returns.returnPeriod !== 'no returns'
                    ? `${returns.returnPeriod} returns.`
                    : 'returns are not offered.'}
                </h4>
              ) : null}
            </div>
          </div>

          {this.props.sidebarLayout ? (
            <div className="actions">
              <div className="button-wrapper">
                {vendor === 'amazon.com' ? (
                  <button
                    onClick={this.onATC.bind(this)}
                    className="green-outline-button tertiary-btn-small"
                    disabled={this.state.addingToCart}>
                    <span className="cta">
                      {this.state.addingToCart ? 'adding to cart' : 'add to cart'}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={this.openLink.bind(this, offerId, vendor)}
                    className={
                      savings <= 0
                        ? 'tertiary-btn-small'
                        : 'green-outline-button tertiary-btn-small'
                    }>
                    <span className="cta">view offer</span>
                  </button>
                )}
              </div>
            </div>
          ) : !layout ? (
            <div className="button-wrapper">
              {!isOriginResult && savings ? (
                <button
                  onClick={this.openLink.bind(this, offerId, vendor)}
                  className="green primary-btn-medium">
                  save {currency(savings, true)}
                </button>
              ) : null}
              <h4 className="bold vendor">{vendor}</h4>
            </div>
          ) : (
            <div className="button-wrapper">
              {vendor === 'amazon.com' ? (
                <button
                  onClick={this.onATC.bind(this)}
                  className="green-outline-button tertiary-btn-medium"
                  disabled={this.state.addingToCart}>
                  <span className="cta">
                    {this.state.addingToCart ? 'adding to cart' : 'add to Amazon cart'}
                  </span>
                </button>
              ) : (
                <button
                  onClick={this.openLink.bind(this, offerId, vendor)}
                  className="green-outline-button tertiary-btn-medium">
                  <span className="cta">{cta}</span>
                </button>
              )}
              <h4 className="bold savings-amount">
                <span> save {currency(savings, true)} </span>
                {pricing && pricing.coupons && pricing.coupons.length ? (
                  <span>
                    {' '}
                    with {pricing.coupons.length === 1 ? 'coupon code' : 'coupon codes'}{' '}
                    <span className="uppercase">{pricing.coupons.join(', ')}</span>
                  </span>
                ) : null}
              </h4>
            </div>
          )}
        </div>
      </div>
    );
  }

  onClickOffer(e) {
    if (!this.props.sidebarLayout || e.isPropagationStopped === true) return;
    const offerId = _.get(this.props, 'offer.id', null);
    const vendor =
      _.get(this.props, 'offer.vendor') ||
      _.get(this.props, 'offer.details.vendor') ||
      _.get(this.props, 'offer.product.vendor');
    if (vendor === 'amazon.com') {
      return;
    }
    this.openLink(offerId, vendor);
  }

  openLink(offerId, vendor, e) {
    if (e) {
      e.stopPropagation();
    }
    this.props.offer.redirectUrl = `https://wikibuy.com/api/v1/redirect?r=true&url=${encodeURIComponent(
      _.get(this.props.offer, 'product.url')
    )}&clickId=mock_click_id`;
    visitMerchant({
      details: this.props.offer,
      cartPricing: {paymentsSupport: false},
      run: {runId: this.props.runId},
      title: false,
      meta: {
        index: this.props.index,
        otherOffers: true
      }
    });
  }

  onATC(e) {
    if (e) {
      e.stopPropagation();
    }
    if (this.state.addingToCart) {
      return;
    }
    this.setState(
      {
        addingToCart: true
      },
      async () => {
        try {
          await this.props.onPay(_.get(this.props, 'offer'), '', true);
        } catch (e) {}
        this.setState({
          addingToCart: false
        });
      }
    );
  }
}

export default ProductCard;
