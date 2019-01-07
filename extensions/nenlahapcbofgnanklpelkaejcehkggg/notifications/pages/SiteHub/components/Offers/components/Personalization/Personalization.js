import {React} from 'utility/css-ns';
import {Component} from 'react';
import _ from 'lodash';
import sendMetric from 'utility/sendMetric';
import {v4} from 'node-uuid';
import {WIKIBUY_API, WIKIBUY_URL} from 'constants';
import tldjs from 'tldjs';

class Personalization extends Component {
  render() {
    const promos = _.get(this.props.personalizedData, 'promotions');
    const currentStorePromo = _.find(promos, {tld: tldjs.getDomain(location.hostname)});
    return (
      <div className="wb-personalization-component">
        <h2>Today's offers from your stores.</h2>
        {currentStorePromo ? (
          <div>
            <h4 onClick={this.onViewPromotion.bind(this, currentStorePromo)}>
              <span className="store">{currentStorePromo.tld}</span>{' '}
              <span className="description">- {currentStorePromo.title}</span>
            </h4>
          </div>
        ) : null}
        {_.map(_.take(promos, 3), promo => {
          return (
            <div key={promo.id}>
              <h4 onClick={this.onViewPromotion.bind(this, promo)}>
                <span className="store">{promo.tld}</span>{' '}
                <span className="description">- {promo.title}</span>
              </h4>
            </div>
          );
        })}
        <h5 className="primary-text-link palmetto" onClick={this.onViewAll.bind(this)}>
          View all offers
        </h5>
      </div>
    );
  }

  onViewPromotion(promotion) {
    const tld = promotion.tld;
    const clickId = v4();
    sendMetric('trackClick', 'visitMerchant', 'todays promotions', {
      view: 'sitehub',
      clickId,
      tld
    });
    if (promotion.affiliateTemplate) {
      window.open(
        `${WIKIBUY_API}/redirect?r=true&url=${encodeURIComponent(
          promotion.url ? promotion.url : `http://${tld}`
        )}&t=${encodeURIComponent(promotion.affiliateTemplate)}&clickId=${clickId}`
      );
    } else {
      window.open(
        `${WIKIBUY_API}/redirect?r=true&url=${encodeURIComponent(
          promotion.url ? promotion.url : `http://${tld}`
        )}&clickId=${clickId}`
      );
    }
  }

  onViewAll() {
    window.open(`${WIKIBUY_URL}/home`);
  }
}

export default Personalization;
