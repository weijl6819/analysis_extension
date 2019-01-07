import {React} from 'utility/css-ns';
import {Component} from 'react';
import isFullAccount from 'utility/isFullAccount';
import {WIKIBUY_URL} from 'constants';
import sendMetric from 'utility/sendMetric';
import * as actions from 'actions/notificationActions';

class AddToWatchlist extends Component {
  state = {
    watching: false
  };

  render() {
    const hasAccount = isFullAccount();
    return (
      <div className="wb-add-to-watchlist-component">
        {!this.state.watching ? (
          <div>
            <h2>Get notified when the price drops.</h2>
            {hasAccount ? (
              <button
                className="full-button btn-primary-outline"
                onClick={() => this.addToWatchlist('sitehubButton')}>
                Add to watchlist
              </button>
            ) : (
              <button
                className="full-button btn-primary-outline"
                onClick={() => window.open(`${WIKIBUY_URL}/sign-in`)}>
                Sign in to add
              </button>
            )}
          </div>
        ) : (
          <div>
            <h2>The item has been added to your watchlist.</h2>
            <button
              className="full-button btn-primary-outline"
              onClick={() => this.viewWatchlist('sitehubButton')}>
              View watchlist
            </button>
          </div>
        )}
      </div>
    );
  }

  viewWatchlist(label) {
    sendMetric('trackClick', 'viewWatchlist', '', {
      view: 'sitehub',
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname,
      pageLocation: 'sitehub',
      label
    });
    window.open(`${WIKIBUY_URL}/watchlist`);
  }

  async addToWatchlist(label) {
    const deal = this.props.communityDeal;
    sendMetric('trackClick', 'addTowWatchlist', '', {
      view: 'sitehub',
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname,
      pageLocation: 'sitehub',
      label
    });
    try {
      await actions.updateFavorite({id: deal.id});
    } catch (e) {}
    this.setState({watching: true});
  }
}

export default AddToWatchlist;
