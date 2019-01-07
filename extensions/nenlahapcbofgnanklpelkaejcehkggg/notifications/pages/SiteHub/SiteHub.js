import {React} from 'utility/css-ns';
import {Component} from 'react';
import {branch} from 'higher-order/baobab';
import _ from 'lodash';
import tree from 'state';
import {WIKIBUY_URL} from 'constants';
import sendMetric from 'utility/sendMetric';
import Gear from 'components/Gear';
import isSuspendedAccount from 'utility/isSuspendedAccount';
import './site-hub.less';

function CloseIcon(props) {
  return <div {...props} className="icon-x" />;
}

function Logo(props) {
  return (
    <div className="w-icon-logo" style={{height: '40px', width: '60px'}} {...props}>
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
    </div>
  );
}

class SiteHub extends Component {
  render() {
    const visible = !!_.get(this.props, 'view.visible');
    const noMinHeight = location.hostname === 'www.ebay.com';
    const isSuspended = isSuspendedAccount();
    return (
      <div
        className={`wb-SiteHub ${visible ? 'visible' : ''} ${
          isSuspended && visible ? 'suspended' : ''
        }`}>
        <div className="header">
          <a href={WIKIBUY_URL} target="_blank">
            <Logo />
          </a>
          {!isSuspended ? (
            <Gear onClick={this.onSettings} style={{top: '12px', right: '50px'}} />
          ) : null}
          <CloseIcon onClick={this.onClosePopup.bind(this)} />
        </div>
        <div
          className="container"
          ref={n => (this.scrollContainer = n)}
          style={noMinHeight ? {minHeight: '0px'} : null}>
          {this.props.children}
        </div>
      </div>
    );
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

  onSettings() {
    const url = `${WIKIBUY_URL}/account-settings/notifications`;
    sendMetric('trackClick', 'showSettingSiteHub', 'x', {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    });
    window.open(url, '_blank');
  }

  onClosePopup() {
    tree.set(['siteHubView', 'visible'], false);
    sendMetric('trackClick', 'hideSitehub', 'x', {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    });
  }

  onClickProfile() {
    sendMetric('trackClick', 'sitehubProfile', 'profile', {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname
    });
  }
}

export default branch(
  {
    view: ['siteHubView']
  },
  SiteHub
);
