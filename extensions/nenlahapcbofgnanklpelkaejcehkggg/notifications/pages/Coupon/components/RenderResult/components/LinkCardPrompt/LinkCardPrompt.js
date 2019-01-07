import {React} from 'utility/css-ns';
import hasFeature from 'utility/hasFeature';
import {Component} from 'react';
import {WIKIBUY_URL} from 'constants';
import _ from 'lodash';
import sendMetric from 'utility/sendMetric';
import './link-card-prompt.less';

class LinkCardPrompt extends Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  componentDidMount() {
    sendMetric('track', 'linkCardVisible', {});
  }

  render() {
    if (hasFeature('celebrate_link_card')) {
      return this.renderNew();
    } else {
      return this.renderOld();
    }
  }

  renderOld() {
    return (
      <div className="link-card-prompt">
        <div className="link-card-wrapper">
          <h4 className="bold charcoal">Automatically save on in store purchases.</h4>
          <h5 className="silver bold">
            Connect your credit and debit cards to Wikibuy and earn up to 10% back.
          </h5>
          <button onClick={this.openLink.bind(this)} className="green primary-btn-large">
            Connect your card - it's free.
          </button>
        </div>
      </div>
    );
  }

  renderNew() {
    return (
      <div className="link-card-prompt new">
        <div className="link-card-wrapper">
          <div className="background">
            <div className="illustration-wrapper">
              <div className="table" />
              <div className="confetti" />
              <div className="illustration" />
            </div>
          </div>

          <div className="content">
            <h4 className="bold charcoal">Automatically save on in store purchases.</h4>
            <h5 className="silver bold">
              Connect your credit and debit cards to Wikibuy and earn up to 10% back.
            </h5>
            <button onClick={this.openLink.bind(this)} className="green primary-btn-large">
              Connect your card - it's free.
            </button>
          </div>
        </div>
      </div>
    );
  }

  openLink(e) {
    sendMetric('trackClick', 'connectYouCard');
    window.open(`${WIKIBUY_URL}/linked-cards`, '_blank');
  }
}

export default LinkCardPrompt;
