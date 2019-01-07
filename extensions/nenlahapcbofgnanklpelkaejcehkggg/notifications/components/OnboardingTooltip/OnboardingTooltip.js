import {React} from 'utility/css-ns';
import ReactDOM from 'react-dom';
import './onboarding-tooltip.less';

class OnboardingTooltip extends React.Component {
  state = {
    isTooltipActive: true,
    elements: {
      findCodes: {
        pulse: true,
        selector: '.__wikibuy div.coupon-notification div.button-wrapper',
        title: 'One click saves you a lot.',
        content:
          "If there's a working code, Wikibuy will try to find it. All it takes is one click.",
        position: {
          top: '0px'
        }
      },
      couponRunning: {
        pulse: false,
        selector: '.__wikibuy div.coupon-notification .progress-bar',
        title: 'The best coupon code, automatically.',
        content:
          'Wikibuy searches the web for the best codes, and tries working codes from other Wikibuyers.',
        button: (
          <button className="primary-btn-small" onClick={this.props.continueDemo.bind(this)}>
            Got It
          </button>
        ),
        position: {
          top: '0px'
        }
      },
      result: {
        pulse: false,
        selector: '.__wikibuy div.coupon-notification .result-column',
        title: "It's essentially free money.",
        content: `Don't forget to click on Wikibuy before buying. It's a magic button for shopping.`,
        button: (
          <button className="primary-btn-small" onClick={this.props.continueDemo.bind(this)}>
            Got It
          </button>
        ),
        position: {
          top: '0px'
        }
      }
    }
  };
  componentDidMount() {
    const styleElem = document.head.appendChild(document.createElement('style'));
    styleElem.textContent =
      '#checkout:before {content: ""; background: rgba(18, 18, 18, 0.47); position: fixed; top: 0; bottom: 0; right: 0; left: 0; display: block; z-index: 9999;}';
    this.timeout = setTimeout(() => {
      this.setState({isTooltipActive: true});
    }, 500);
  }

  showTooltip() {
    this.setState({isTooltipActive: true});
  }

  hideTooltip() {
    this.setState({isTooltipActive: false});
  }

  render() {
    const {title, content, selector, button, pulse} =
      this.state.elements[this.props.demoState] || {};
    this.el = document
      .querySelector('div[style="all: initial;"]')
      .shadowRoot.querySelector(selector);
    const mm = (
      <div className="tooltip-wrapper">
        {pulse ? (
          <div className="c">
            <div />
            <div />
            <div />
          </div>
        ) : null}
        <div className={`${this.props.demoState} tooltip-content`}>
          <div className={this.props.demoState === 'findCodes' ? 'arrow-right' : 'arrow-top'}>
            <div className="arrow" />
          </div>
          <h3 className="bold">{title}</h3>
          <h4>{content}</h4>
          {!!button ? button : null}
        </div>
      </div>
    );
    if (this.el && this.state.isTooltipActive) {
      return ReactDOM.createPortal(mm, this.el);
    } else {
      return <div />;
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
}

export default OnboardingTooltip;
