import {React} from 'utility/css-ns';
import {Component} from 'react';
import uuid from 'node-uuid';
import _ from 'lodash';
import ImpressionComponent from 'components/ImpressionComponent';
import StoreContentCard from './components/StoreContentCard/StoreContentCard';
import './store-content-data.less';

class StoreContentData extends Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  render() {
    return (
      <div className="store-content-data">
        <div>
          <h2 className="bold">Personalized Offers</h2>
        </div>
        <ImpressionComponent logOnMount={true}>
          {_.map(_.get(this.props.data, 'items'), (d, i) => {
            return (
              <StoreContentCard
                onClickContentCard={this.onClickContentCard.bind(this)}
                index={i}
                key={i}
                {...d}
              />
            );
          })}
        </ImpressionComponent>
      </div>
    );
  }

  onClickContentCard(card) {
    const clickId = uuid.v4();
    const trackProps = _.get(card, '__mirage.trackProps', {});
    card.logImpression({
      type: 'click',
      props: {
        ...trackProps,
        clickId,
        displayIndex: String(card.index)
      }
    });

    if (card.actions) {
      _.forEach(card.actions, e => {
        if (e.type === 'openUrl') {
          const url = _.get(e.props, 'href').replace('__WBCLICKID__', clickId);
          window.open(url, _.get(e.props, 'target', '_blank'));
        }
      });
    }
  }
}

export default StoreContentData;
