import {React} from 'utility/css-ns';
import {Component} from 'react';
import hasFeature from 'utility/hasFeature';
import _ from 'lodash';
import sendMetric from 'utility/sendMetric';
import Star from 'components/Star';

class ReviewWikibuy extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      deduction: 5
    };
  }

  componentDidMount() {
    sendMetric('track', 'reviewWikibuyVisible', {});
  }

  render() {
    return !this.state.confirmation ? (
      <div className="review-wrapper">
        <h4 className="bold charcoal" style={{textAlign: 'center', marginBottom: 15}}>
          How would you rate Wikibuy?
        </h4>
        <div className="review-wikibuy">
          {_.map(new Array(5), (it, i) => {
            return (
              <Star
                onClick={this.starWikibuy.bind(this, i)}
                rating={i}
                key={i}
                type={this.state.deduction <= i ? 'fill' : 'empty'}
              />
            );
          })}
        </div>
      </div>
    ) : (
      <span />
    );
  }

  starWikibuy(deduction) {
    if (this.props.demo) {
      return;
    }
    this.setState({deduction});
    this.rateWikibuy('star', deduction);
  }

  checkStars(label) {
    // 0 == 5 because the stars are reversed. 0 === 5 stars. think 5 - rating
    const deduction = this.state.deduction;
    if (deduction === 0) {
      this.rateWikibuy(label, deduction);
    } else {
      this.rateWikibuy(label, deduction);
    }
  }

  rateWikibuy(label, deduction) {
    const savings = this.props.savings;
    sendMetric('trackClick', 'rateWikibuy', label, {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname,
      savings,
      rating: 5 - deduction
    });

    if (deduction === 0) {
      if (hasFeature('rw_control')) {
        window.open(
          'https://chrome.google.com/webstore/detail/wikibuy/nenlahapcbofgnanklpelkaejcehkggg/reviews?hl=en-US',
          '_blank'
        );
      } else if (hasFeature('rw_reviewopedia')) {
        window.open('http://www.reviewopedia.com/wikibuy-reviews#addreview', '_blank');
      } else if (hasFeature('rw_trust_pilot')) {
        window.open('https://www.trustpilot.com/review/wikibuy.com', '_blank');
      } else {
        window.open(
          'https://chrome.google.com/webstore/detail/wikibuy/nenlahapcbofgnanklpelkaejcehkggg/reviews?hl=en-US',
          '_blank'
        );
      }
    }

    this.props.onClosePopup('rate wikibuy');
  }
}

export default ReviewWikibuy;
