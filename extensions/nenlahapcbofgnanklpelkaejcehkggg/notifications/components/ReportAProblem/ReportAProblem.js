import {React} from 'utility/css-ns';
import sendMetric from 'utility/sendMetric';
import reportIssue from 'messenger/outbound/reportIssue';
import _ from 'lodash';
import OptionSelect from 'components/OptionSelect';
import './report-a-problem.less';

class ReportAProblem extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      step: 'problem'
    };
  }

  componentWillMount() {}

  render() {
    const email =
      this.props.email && this.props.email.indexOf('shadow.wikibuy.com') === -1
        ? this.props.email
        : '';
    return (
      <div className={`report-a-problem ${this.state.flow || ''}`}>
        {this.state.step === 'problem' ? (
          <div className="coupon-check-wrapper">
            <h4 className="bold charcoal">We're always looking to improve Wikibuy.</h4>
            <h5 className="light silver">Could you share what went wrong today?</h5>
            <div className="problem-wrapper">
              <OptionSelect
                native={true}
                value={this.state.value}
                id={this.state.value ? 'valid' : 'invalid'}
                instanceId="searchSort"
                onSelectOption={this.onChangeSort.bind(this)}
                default="Select an issue"
                options={[
                  {label: 'Missed a working coupon code', value: 'missedCode'},
                  {label: 'Testing codes took too long', value: 'tooLong'},
                  {label: 'Reported incorrect savings', value: 'incorrectSavings'},
                  {label: 'Problems checking out', value: 'checkoutIssues'},
                  {label: 'Too many notifications', value: 'tooManyNotifs'},
                  {label: 'Other', value: 'other'}
                ]}
              />
              <div className="email">
                <form onSubmit={this.submitFeedback.bind(this)}>
                  {!email ? (
                    <input
                      placeholder="Your email (optional)"
                      defaultValue={email || ''}
                      ref={r => (this.email = r)}
                    />
                  ) : null}
                  {this.state.value === 'other' ? (
                    <textarea
                      placeholder="Any additional comments (optional)"
                      onChange={() => this.forceUpdate()}
                      ref={r => {
                        this.comments = r;
                      }}
                    />
                  ) : null}
                  <button
                    disabled={
                      this.state.value === 'other'
                        ? !_.get(this.comments, 'value')
                        : !this.state.value
                    }
                    className="primary-btn-large">
                    Share Feedback
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : this.state.step === 'confirm' ? (
          <div className="problem-wrapper">{this.determineMessage()}</div>
        ) : null}
      </div>
    );
  }

  submitFeedback(e) {
    e.preventDefault();
    e.stopPropagation();
    let email = this.props.email;
    let comments = '';
    if (this.email) {
      email = this.email.value;
    }
    if (this.comments) {
      comments = this.comments.value;
    }
    sendMetric('trackClick', 'reportIssue', {
      issue: this.state.value,
      issueType: 'couponsCredits',
      issueLong: comments || '',
      emailAddress: email || ''
    });

    if (email && comments) {
      reportIssue({
        type: 'REPORT_OTHER_ISSUE',
        data: {subject: 'Report a Coupon Problem', type: 'couponsCredits', email, message: comments}
      });
    }

    this.setState({step: 'confirm'});
  }

  onChangeSort({value}) {
    this.setState({value});
  }

  renderMarkup() {
    return (
      <div>
        {!this.state.couponSubmitted ? (
          <form onSubmit={this.shareCode.bind(this)}>
            <input
              onChange={() => this.forceUpdate()}
              placeholder="Coupon Code"
              ref={r => (this.code = r)}
            />
            <textarea placeholder="Description (optional)" ref={r => (this.description = r)} />
            <button disabled={!_.get(this.code, 'value')} className="primary-btn-large">
              Share Code
            </button>
          </form>
        ) : (
          <div>
            <h4 style={{marginBottom: 5}} className="bold charcoal">
              Thanks for the help.
            </h4>
            <h5 style={{marginBottom: 11}} className="light silver">
              Our goal is to make it so when one person finds a great deal, it helps everyone else
              save money.
            </h5>
            <h5 style={{marginBottom: 16}} className="light silver">
              Every time you share, Wikibuy gets smarter.
            </h5>
            <button onClick={this.done.bind(this)} className="primary-btn-large">
              Done
            </button>
          </div>
        )}
      </div>
    );
  }

  done() {
    this.setState({couponSubmitted: false, value: null, step: 'problem'});
  }

  shareCode(e) {
    e.preventDefault();
    e.stopPropagation();
    sendMetric('trackClick', 'shareCouponCode', {
      code: this.code.value || '',
      description: this.description.value || ''
    });
    this.setState({couponSubmitted: true});
  }
  closeModal() {
    this.props.onClosePopup();
  }

  determineMessage() {
    const value = this.state.value;
    let headline;
    let subhead;
    let render;
    let cta;
    let action;

    if (value === 'missedCode') {
      headline = 'Wikibuy relies on customers like you.';
      subhead = 'Could you share the working code you found with other Wikibuyers?';
      render = this.renderMarkup();
      if (this.state.couponSubmitted) {
        headline = null;
        subhead = null;
      }
    } else if (value === 'tooLong') {
      headline = 'Thanks for your help!';
      subhead =
        "We're sorry it took so long to test codes here. We are always working to speed things up, so it's helpful to know when a site is running slowly.";
      cta = 'Continue to Checkout';
      action = this.closeModal.bind(this);
    } else if (value === 'tooManyNotifs') {
      headline = 'Thanks for your feedback!';
      subhead = (
        <span>
          We only want Wikibuy to pop up when you want to see it. Did you know you can adjust how
          often notifications are shown by clicking{' '}
          <a target="_blank" href="https://wikibuy.com/account-settings/notifications">
            here?
          </a>
        </span>
      );
      cta = 'Continue to Checkout';
      action = this.closeModal.bind(this);
    } else {
      headline = ' Thanks for your feedback!';
      subhead =
        'Our goal is for Wikibuy to make savings simple. Your feedback is extremely helpful in guiding where we need to invest more time.';
      cta = 'Continue to Checkout';
      action = this.closeModal.bind(this);
    }

    return (
      <div className="coupon-check-wrapper">
        {headline ? <h4 className="bold charcoal">{headline}</h4> : null}
        {subhead ? <h5 className="light silver">{subhead}</h5> : null}
        {render || null}
        {cta ? (
          <button onClick={action} disabled={!this.state.value} className="primary-btn-large">
            {cta}
          </button>
        ) : null}
      </div>
    );
  }
}

export default ReportAProblem;
