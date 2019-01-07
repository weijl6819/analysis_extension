import {React} from 'utility/css-ns';
import sendMetric from 'utility/sendMetric';
import currency from 'utility/currency';
import './credits-redemption-prompt.less';

class CreditsRedemptionPrompt extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  componentDidMount() {
    sendMetric('track', 'creditsRedemptionPromptVisible', {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname,
      rewardAmount: this.props.rewardAmount,
      userCreditAmount: _.get(this.props, 'userCreditAmount.amount')
    });
  }

  render() {
    let amount = _.get(this.props, 'userCreditAmount.amount');
    let round;
    let needed;
    if (amount) {
      round = this.round5(amount);
      needed = round - amount;
    } else if (amount === 0) {
      round = 500;
      needed = 500;
    }

    if (!round || !needed) {
      return <div />;
    }
    return (
      <div className="credits-redemption-prompt">
        <h3 className="bold">
          You're only <span className="palmetto">{currency(needed)}</span> from a {currency(round)}{' '}
          gift card.
        </h3>
        <div
          id="progress-bar-wrapper-redemption"
          className={this.props.rounded ? 'rounded progress-bar' : 'progress-bar'}>
          <div className="progress" style={{width: `${(amount / round) * 100 || 10}%`}} />
          <div className="tick one">
            <h5 className="amount">{currency(Math.round(round * 0.15), true)}</h5>
            <div className="line" />
          </div>
          <div className="tick two">
            <h5 className="amount">{currency(Math.round(round * 0.5), true)}</h5>
            <div className="line" />
          </div>
          <div className="tick three">
            <h5 className="amount">{currency(Math.round(round * 0.85), true)}</h5>
            <div className="line" />
          </div>
        </div>
      </div>
    );
  }
  round5(x) {
    const value = Math.ceil(x / 500) * 500;
    return value === x ? value + 500 : value;
  }
}

export default CreditsRedemptionPrompt;
