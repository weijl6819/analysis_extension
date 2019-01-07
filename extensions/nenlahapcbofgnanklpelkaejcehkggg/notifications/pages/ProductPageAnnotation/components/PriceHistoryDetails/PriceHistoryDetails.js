import {React} from 'utility/css-ns';
import {Component} from 'react';
import _ from 'lodash';
import moment from 'moment';
import sendMetric from 'utility/sendMetric';
import AnnotationTooltip from '../AnnotationTooltip';
import './price-history-details.less';

const BarChartSVG = () => (
  <svg width="72px" height="59px" viewBox="0 0 72 59">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <path
        d="M62.1818182,55.7222222 L68.7272727,55.7222222 L68.7272727,3.27777778 L62.1818182,3.27777778 L62.1818182,55.7222222 Z M70.3636364,0 L60.5454545,0 C59.6421818,0 58.9090909,0.734222222 58.9090909,1.63888889 L58.9090909,57.3611111 C58.9090909,58.2674167 59.6421818,59 60.5454545,59 L70.3636364,59 C71.2669091,59 72,58.2674167 72,57.3611111 L72,1.63888889 C72,0.734222222 71.2669091,0 70.3636364,0 L70.3636364,0 Z M22.9090909,55.7222222 L29.4545455,55.7222222 L29.4545455,9.83333333 L22.9090909,9.83333333 L22.9090909,55.7222222 Z M31.0909091,6.55555556 L21.2727273,6.55555556 C20.3694545,6.55555556 19.6363636,7.28977778 19.6363636,8.19444444 L19.6363636,57.3611111 C19.6363636,58.2674167 20.3694545,59 21.2727273,59 L31.0909091,59 C31.9941818,59 32.7272727,58.2674167 32.7272727,57.3611111 L32.7272727,8.19444444 C32.7272727,7.28977778 31.9941818,6.55555556 31.0909091,6.55555556 L31.0909091,6.55555556 Z M42.5454545,55.7222222 L49.0909091,55.7222222 L49.0909091,29.5 L42.5454545,29.5 L42.5454545,55.7222222 Z M50.7272727,26.2222222 L40.9090909,26.2222222 C40.0058182,26.2222222 39.2727273,26.9564444 39.2727273,27.8611111 L39.2727273,57.3611111 C39.2727273,58.2674167 40.0058182,59 40.9090909,59 L50.7272727,59 C51.6305455,59 52.3636364,58.2674167 52.3636364,57.3611111 L52.3636364,27.8611111 C52.3636364,26.9564444 51.6305455,26.2222222 50.7272727,26.2222222 L50.7272727,26.2222222 Z M3.27272727,55.7222222 L9.81818182,55.7222222 L9.81818182,39.3333333 L3.27272727,39.3333333 L3.27272727,55.7222222 Z M11.4545455,36.0555556 L1.63636364,36.0555556 C0.733090909,36.0555556 0,36.7897778 0,37.6944444 L0,57.3611111 C0,58.2674167 0.733090909,59 1.63636364,59 L11.4545455,59 C12.3578182,59 13.0909091,58.2674167 13.0909091,57.3611111 L13.0909091,37.6944444 C13.0909091,36.7897778 12.3578182,36.0555556 11.4545455,36.0555556 L11.4545455,36.0555556 Z"
        fill="#C7C7C7"
      />
    </g>
  </svg>
);

const BestDealSVG = () => (
  <svg width="51px" height="71px" viewBox="0 0 51 71">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <path
        d="M47.8125,66.0542045 L26.6745938,48.9335227 L26.6650313,48.9432045 C26.3749688,48.6188636 25.965375,48.4090909 25.5,48.4090909 C25.034625,48.4090909 24.6250313,48.6188636 24.3349688,48.9432045 L24.3254063,48.9335227 L3.1875,66.0542045 L3.1875,3.22727273 L47.8125,3.22727273 L47.8125,66.0542045 Z M49.40625,0 L1.59375,0 C0.71240625,0 0,0.722909091 0,1.61363636 L0,69.3863636 C0,70.2787045 0.71240625,71 1.59375,71 C2.059125,71 2.46871875,70.7918409 2.760375,70.4675 L2.76834375,70.4771818 L25.5,52.0655909 L48.2316563,70.4771818 L48.2412188,70.4675 C48.5312813,70.7918409 48.940875,71 49.40625,71 C50.2875938,71 51,70.2787045 51,69.3863636 L51,1.61363636 C51,0.722909091 50.2875938,0 49.40625,0 L49.40625,0 Z M17.3240625,25.8036591 L22.9260938,25.8036591 L23.7038438,23.7107727 L25.5,18.8634091 L27.29775,23.7107727 L28.0723125,25.8036591 L33.6759375,25.8036591 L30.7259063,28.1047045 L28.9313438,29.5069545 L29.6485313,31.6821364 L31.2614063,36.5843636 L27.3854063,33.7056364 L25.5,32.3066136 L23.6145938,33.7056364 L19.7385938,36.5843636 L21.3514688,31.6821364 L22.07025,29.5069545 L20.2740938,28.1047045 L17.3240625,25.8036591 Z M13.5452813,45.1818182 L25.5,36.3068182 L37.4547188,45.1818182 L32.671875,30.6607045 L43.03125,22.5763864 L30.28125,22.5763864 L25.5,9.68181818 L20.71875,22.5763864 L7.96875,22.5763864 L18.328125,30.6607045 L13.5452813,45.1818182 Z"
        id="Fill-1"
        fill="#A1A1A1"
      />
    </g>
  </svg>
);

class PriceHistoryDetails extends Component {
  componentDidMount() {
    sendMetric('page', 'priceHistoryDetailsTooltip', {
      view: 'quoteCompleteNotification',
      type: 'notificationHover',
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    });
  }

  render() {
    const priceHistory = this.props.priceHistory;
    const changesInLast30 = _(_.get(priceHistory, 'items'))
      .filter(({date}) => {
        return date && moment(date).isAfter(moment().subtract(30, 'days'));
      })
      .reduce(
        (accum, item) => {
          if (
            !accum.previousPrices ||
            (_.get(accum, 'previousPrices.match_total_p50') !== item.match_total_p50 ||
              _.get(accum, 'previousPrices.origin_total_p50') !== item.origin_total_p50)
          ) {
            accum.changes += 1;
          }
          accum.previousPrices = {
            match_total_p50: item.match_total_p50,
            origin_total_p50: item.origin_total_p50
          };
          return accum;
        },
        {previousPrices: null, changes: 0}
      );
    const changes = _.get(changesInLast30, 'changes') || 0;
    return (
      <AnnotationTooltip
        onCloseTooltip={this.props.onCloseTooltip}
        classes="price-history-details-tooltip">
        {!priceHistory ? (
          <div style={{textAlign: 'center'}}>Loading...</div>
        ) : changes ? (
          <div>
            <div className="svg-graphic">
              <BarChartSVG />
            </div>
            <h2>Is this the best time to buy?</h2>
            <h5>
              Currently this is the best deal of all Amazon sellers. However, Wikibuy has detected{' '}
              {changes === 1 ? `${changes} price change` : `${changes} price changes`} in the last
              30 days.
            </h5>
            <button
              className="button-style primary-btn-large"
              onClick={() => this.props.viewProductPage()}>
              View price history
            </button>
          </div>
        ) : (
          <div>
            <div className="svg-graphic">
              <BestDealSVG />
            </div>
            <h2>This is the best deal of all Amazon sellers.</h2>
            <h5>
              Currently this is the best deal of all Amazon sellers. Wikibuy didn’t detect any
              changes in the last 30 days.
            </h5>
            <button
              className="button-style primary-btn-large"
              onClick={() => this.props.viewProductPage()}>
              View alternative products
            </button>
          </div>
        )}
      </AnnotationTooltip>
    );
  }
}

export default PriceHistoryDetails;
