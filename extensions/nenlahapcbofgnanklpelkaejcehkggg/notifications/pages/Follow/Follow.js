import {React} from 'utility/css-ns';
import {Component} from 'react';
import {Motion, spring} from 'react-motion';
import {branch} from 'higher-order/baobab';
import {addVote} from 'actions/feedbackActions';
import sendMetric from 'utility/sendMetric';
import _ from 'lodash';

import toggleMatchSurvey from 'messenger/outbound/toggleMatchSurvey';
import './follow.less';

class Follow extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      title: 'Was this a good result?',
      subtitle: 'Your feedback helps other wikibuyers.',
      hideNotification: true,
      showReasons: false,
      showComment: false,
      selectedReasons: [],
      reasonText: '',
      dismiss: false
    };
  }

  componentDidMount() {
    sendMetric('page', 'matchSurvey', {
      view: 'matchSurvey',
      type: 'notification',
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname,
      offerSignUp: _.get(this.props.view, 'offerSignUp'),
      qualified: _.get(this.props.view, 'qualified', false),
      balance: _.get(this.props.view, 'balance', 0)
    });
    setTimeout(() => {
      this.setState({hideNotification: false});
    }, 1000);
  }

  componentWillReceiveProps(nextProps) {
    if (_.get(nextProps, 'view.hiddenFromWebApp') && !_.get(this.props, 'view.hiddenFromWebApp')) {
      this.setState({hideNotification: true});
    }
  }
  onChange(reason, e) {
    if (e.type === 'input') {
      return;
    }
    const selectedReasons = this.state.selectedReasons;
    const index = selectedReasons.indexOf(reason);
    if (index === -1) {
      selectedReasons.push(reason);
    } else {
      selectedReasons.splice(index, 1);
    }
    this.setState({selectedReasons});
  }
  onTextUpdate(e) {
    const reasonText = e.target.value;
    this.setState({reasonText});
  }
  renderReasons() {
    const reasons = [
      'Not the same product',
      'Price is incorrect',
      'Out of stock',
      'Item condition',
      'Bad seller',
      'Other'
    ];
    let reasonDivs;
    if (this.state.showReasons) {
      reasonDivs = _.map(reasons, (reason, i) => {
        const checked = this.state.selectedReasons.indexOf(reason) !== -1;
        return (
          <div className="reason" key={_.kebabCase(reason)}>
            <input
              type="checkbox"
              checked={checked}
              onChange={this.onChange.bind(this, reason)}
              id={_.kebabCase(reason)}
            />
            <label htmlFor={_.kebabCase(reason)}>
              <h5 className="text">{reason}</h5>
            </label>
          </div>
        );
      });
    }
    return (
      <div className="reasons-wrapper">
        {reasonDivs}
        <textarea
          placeholder="tell us more"
          value={this.state.reasonText}
          onChange={this.onTextUpdate.bind(this)}
        />
        <button className="primary-btn-small" onClick={this.onSubmit.bind(this)}>
          Submit
        </button>
      </div>
    );
  }

  render() {
    const {hideNotification} = this.state;
    const title = this.state.title;
    const subtitle = this.state.subtitle;
    const showOnTop = false;
    const showOnRight = false;
    let content;

    if (this.state.showReasons || this.state.showComment) {
      content = this.renderReasons();
    } else if (this.state.dismiss || this.state.buttonsHidden) {
      content = <div className="thanks-wrapper" />;
    } else {
      content = (
        <div className="button-wrapper">
          <button className="secondary-btn-small" onClick={this.onYes.bind(this)}>
            Yes
          </button>
          <button className="secondary-btn-small" onClick={this.onNo.bind(this)}>
            No
          </button>
        </div>
      );
    }
    return (
      <div
        className={hideNotification ? 'disabled follow-page' : 'follow-page'}
        style={{
          top: showOnTop ? '0' : 'auto',
          bottom: showOnTop ? 'auto' : '0',
          left: showOnRight ? 'auto' : '0',
          right: showOnRight ? '0' : 'auto'
        }}>
        <Motion
          style={{
            opacity: spring(hideNotification ? 0 : 1, {stiffness: 180, damping: 20}),
            y: spring(hideNotification ? (showOnTop ? -100 : 100) : 0, {
              stiffness: 180,
              damping: 20
            })
          }}>
          {({opacity, y}) => (
            <div
              className="follow-notification"
              style={{
                transform: `translate3d(0,${y}%,0)`,
                opacity: `${opacity}`
              }}>
              <header>
                <div className="w-icon-logo" style={{height: '40px', width: '60px'}}>
                  {this.renderWIcon()}
                </div>
                <div className="close icon-x" onClick={this.onClosePopup.bind(this, 'x')} />
              </header>
              <section>
                <h2>{title}</h2>
                {subtitle ? <h4>{subtitle}</h4> : null}
                {content}
              </section>
            </div>
          )}
        </Motion>
      </div>
    );
  }

  onYes() {
    const data = _.get(this.props, 'view.resultData');
    addVote({
      up_votes: 0,
      down_votes: 0,
      id: `product.${_.get(data, 'details.product.wbpid')}`,
      wbpid: _.get(data, 'run.originResult.product.wbpid'),
      match_wbpid: _.get(data, 'details.product.wbpid'),
      upVote: true
    });
    this.onNotificationInteraction();
    // Log yes, show reasons
    this.setState({
      match: true,
      title: 'Thanks!',
      subtitle: 'Your vote helps improve results for everyone on Wikibuy.',
      buttonsHidden: true
    });

    this.timeout = setTimeout(() => {
      this.setState({hideNotification: true});
    }, 2500);

    const metricData = {
      match: true,
      quoteId: data.run.id,
      matchId: data.details.id,
      notification: true
    };
    sendMetric('track', 'matchSurvey', metricData);
  }

  onNo() {
    const data = _.get(this.props, 'view.resultData');
    addVote({
      up_votes: 0,
      down_votes: 0,
      id: `product.${_.get(data, 'details.product.wbpid')}`,
      wbpid: _.get(data, 'run.originResult.product.wbpid'),
      match_wbpid: _.get(data, 'details.product.wbpid'),
      upVote: false
    });
    this.onNotificationInteraction();
    // Log no, show reasons
    this.setState({
      match: false,
      showReasons: true,
      showComment: true,
      title: 'Uh oh!',
      subtitle: 'What was wrong with this result?'
    });
    const metricData = {
      match: false,
      quoteId: data.run.id,
      matchId: data.details.id,
      notification: true
    };
    sendMetric('track', 'matchSurvey', metricData);
  }

  onSubmit() {
    this.onNotificationInteraction();
    const data = _.get(this.props, 'view.resultData');
    const metricData = {
      match: this.state.match,
      quoteId: data.run.id,
      matchId: data.details.id,
      notification: true
    };
    if (this.state.reasonText) {
      metricData.text = this.state.reasonText;
    }
    if (this.state.selectedReasons && this.state.selectedReasons.length) {
      metricData.reason = _.get(this.state.selectedReasons, '[0]');
      metricData.reasons = this.state.selectedReasons;
    }
    sendMetric('track', 'matchSurveyReason', metricData);

    this.setState({
      dismiss: true,
      showReasons: false,
      showComment: false,
      title: 'Thanks for helping!',
      subtitle: 'The next wikibuyer will benefit from your contribution.'
    });
    const t = this;
    setTimeout(() => {
      t.onClosePopup('submit');
    }, 3200);
  }

  onClosePopup(label) {
    this.onNotificationInteraction();
    this.setState({hideNotification: true});
    sendMetric('trackClick', 'dismissMatchSurvey', label, {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    });
  }

  onNotificationInteraction() {
    toggleMatchSurvey(_.get(this.props, 'view.resultData'));
  }

  renderWIcon() {
    return (
      <svg id="Layer_1" x="0px" y="0px" viewBox="0 0 60 45">
        <g>
          <path
            d="M39.4,35.9h-9L25,19.1h-0.1l-5.2,16.8h-9L1.3,8.8h9.6L15.7,26h0.1l4.9-17.2h8.9l5,17.2h0.1l4.8-17.2h9.3
          L39.4,35.9z M57.7,31.6c0,0.7-0.1,1.4-0.4,2c-0.2,0.6-0.6,1.1-1,1.6c-0.4,0.4-1,0.8-1.7,1s-1.3,0.3-2,0.3c-1.5,0-2.7-0.5-3.7-1.4
          c-1-0.9-1.4-2-1.4-3.5c0-0.7,0.1-1.3,0.4-1.8c0.2-0.7,0.6-1.3,1-1.6c0.8-0.7,1.4-1,1.7-1.1c0.9-0.3,1.6-0.4,2-0.4
          c0.7,0,1.4,0.1,2,0.4c0.7,0.2,1.2,0.6,1.7,1c0.3,0.3,0.7,0.8,1.1,1.6C57.6,30.2,57.7,30.8,57.7,31.6z"
          />
        </g>
      </svg>
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
}

export default branch(
  {
    view: ['followView'],
    events: ['events'],
    session: ['session']
  },
  Follow
);
