import {React} from 'utility/css-ns';
import {Component} from 'react';
import _ from 'lodash';
import sendMetric from 'utility/sendMetric';
import isFullAccount from 'utility/isFullAccount';
import {WIKIBUY_URL} from 'constants';
import AnnotationTooltip from '../AnnotationTooltip';
import './watchlist-details.less';

const WatchlistSVG = () => (
  <svg width="75px" height="76px" viewBox="0 0 75 76">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <path
        d="M35.7954545,53.7511333 C37.0329545,53.2480667 38.1784091,52.5704667 39.2045455,51.744 L39.2045455,30.3910444 C38.1784091,29.5645778 37.0329545,28.8852667 35.7954545,28.3839111 L35.7954545,53.7511333 Z M42.6136364,47.6886667 C43.6977273,45.7260222 44.3181818,43.4690667 44.3181818,41.0666667 C44.3181818,38.6642667 43.6977273,36.4073111 42.6136364,34.4446667 L42.6136364,47.6886667 Z M20.4545455,50.0996222 L20.4545455,32.0337111 C18.3392045,34.4446667 17.0454545,37.6016667 17.0454545,41.0666667 C17.0454545,44.5316667 18.3392045,47.6886667 20.4545455,50.0996222 L20.4545455,50.0996222 Z M23.8636364,29.2240667 L23.8636364,52.9092667 C25.8715909,54.0762444 28.1948864,54.7555556 30.6818182,54.7555556 C31.2596591,54.7555556 31.8272727,54.7093556 32.3863636,54.6392 L32.3863636,27.4958444 C31.8272727,27.4256889 31.2596591,27.3777778 30.6818182,27.3777778 C28.1948864,27.3777778 25.8715909,28.0553778 23.8636364,29.2240667 L23.8636364,29.2240667 Z M71.5909091,0 L68.1818182,0 L68.1818182,54.7555556 L71.5909091,54.7555556 C73.4727273,54.7555556 75,53.2241111 75,51.3333333 L75,3.42222222 C75,1.53144444 73.4727273,0 71.5909091,0 L71.5909091,0 Z M30.6818182,61.6 C19.3857955,61.6 10.2272727,52.4079111 10.2272727,41.0666667 C10.2272727,29.7271333 19.3857955,20.5333333 30.6818182,20.5333333 C41.9778409,20.5333333 51.1363636,29.7271333 51.1363636,41.0666667 C51.1363636,52.4079111 41.9778409,61.6 30.6818182,61.6 L30.6818182,61.6 Z M48.7039773,56.7370222 C52.3346591,52.5362444 54.5454545,47.0658222 54.5454545,41.0666667 C54.5454545,27.8363556 43.8613636,17.1111111 30.6818182,17.1111111 C17.5022727,17.1111111 6.81818182,27.8363556 6.81818182,41.0666667 C6.81818182,54.2969778 17.5022727,65.0222222 30.6818182,65.0222222 C36.6579545,65.0222222 42.1073864,62.8012 46.29375,59.1582444 L61.8630682,74.7875333 C62.1715909,75.0989556 62.5977273,75.2906 63.0681818,75.2906 C64.0090909,75.2906 64.7727273,74.5240222 64.7727273,73.5777778 C64.7727273,73.1072222 64.5818182,72.6794444 64.2732955,72.3680222 L48.7039773,56.7370222 Z M61.3636364,54.7555556 L64.7727273,54.7555556 L64.7727273,0 L61.3636364,0 L61.3636364,54.7555556 Z M57.9545455,54.7555556 L57.9545455,41.0700889 C57.9545455,46.0596889 56.6028409,50.7258889 54.2761364,54.7555556 L57.9545455,54.7555556 Z M57.9545455,0 L49.4318182,0 L49.4318182,21.2194889 C54.6698864,26.2073778 57.9545455,33.2451778 57.9545455,41.0649556 L57.9545455,0 Z M39.2045455,0 L35.7954545,0 L35.7954545,14.1868222 C36.9613636,14.4092667 38.0965909,14.707 39.2045455,15.0714667 L39.2045455,0 Z M6.81818182,54.7555556 L7.0875,54.7555556 C7.00056818,54.6049778 6.90170455,54.4629556 6.81818182,54.3106667 L6.81818182,54.7555556 Z M46.0227273,0 L42.6136364,0 L42.6136364,16.478 C43.7965909,17.0580667 44.94375,17.6963111 46.0227273,18.4338 L46.0227273,0 Z M32.3863636,13.7761556 L32.3863636,0 L23.8636364,0 L23.8636364,14.5855111 C26.0471591,14.0208444 28.3227273,13.6888889 30.6818182,13.6888889 C31.2579545,13.6888889 31.81875,13.7402222 32.3863636,13.7761556 L32.3863636,13.7761556 Z M20.4545455,0 L17.0454545,0 L17.0454545,17.3814667 C18.1380682,16.7466444 19.2732955,16.1785556 20.4545455,15.6977333 L20.4545455,0 Z M0,3.42222222 L0,51.3333333 C0,53.2241111 1.52727273,54.7555556 3.40909091,54.7555556 L3.40909091,0 C1.52727273,0 0,1.53144444 0,3.42222222 L0,3.42222222 Z M13.6363636,19.7137111 L13.6363636,0 L6.81818182,0 L6.81818182,27.8226667 C8.54829545,24.6913333 10.8715909,21.9398667 13.6363636,19.7137111 L13.6363636,19.7137111 Z"
        id="Fill-1"
        fill="#C7C7C7"
      />
    </g>
  </svg>
);

const WatchlistSuccessSVG = () => (
  <svg width="60px" height="60px" viewBox="0 0 60 60">
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <circle id="Oval" stroke="#C7C7C7" strokeWidth="3" fill="#F4F4F4" cx="30" cy="30" r="28" />
      <polygon
        fill="#C7C7C7"
        points="39.1981947 19 24.9669675 33.9890107 18.8018053 27.4966755 15 31.5004002 24.9669675 42 43 23.0051407"
      />
    </g>
  </svg>
);

class WatchlistDetails extends Component {
  componentDidMount() {
    sendMetric('page', 'watchlistDetailsTooltip', {
      view: 'addWatchlistNotification',
      type: 'notificationHover',
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    });
  }

  render() {
    const watching = this.props.watching;
    const hasAccount = isFullAccount();
    return (
      <AnnotationTooltip
        onCloseTooltip={this.props.onCloseTooltip}
        classes="watchlist-details-tooltip">
        {_.isUndefined(watching) ? (
          <div style={{textAlign: 'center'}}>Loading...</div>
        ) : !watching ? (
          <div>
            <div className="svg-graphic">
              <WatchlistSVG />
            </div>
            <h2>Watch this item for price drops.</h2>
            {hasAccount ? (
              <h5>
                Add this item to your watchlist. We’ll watch for price drops over the next 60 days
                and email you with the best deal.
              </h5>
            ) : (
              <h5>
                Sign in with Wikibuy to add this item to your watchlist. We’ll watch for price drops
                over the next 60 days and email you with the best deal.
              </h5>
            )}
            {hasAccount ? (
              <button
                className="button-style primary-btn-large"
                onClick={() => this.props.addToWatchlist('tooltipButton')}>
                Add to watchlist
              </button>
            ) : (
              <button
                className="button-style primary-btn-large"
                onClick={() => window.open(`${WIKIBUY_URL}/sign-in`)}>
                Sign in
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="svg-graphic">
              <WatchlistSuccessSVG />
            </div>
            <h2>The item has been added to your watchlist.</h2>
            <h5>
              Feel free to continue shopping or we can show you which items you have been watching
              by clicking the button below.
            </h5>
            <button
              className="button-style primary-btn-large"
              onClick={() => this.props.viewWatchlist('tooltipButton')}>
              View watchlist
            </button>
          </div>
        )}
      </AnnotationTooltip>
    );
  }
}

export default WatchlistDetails;
