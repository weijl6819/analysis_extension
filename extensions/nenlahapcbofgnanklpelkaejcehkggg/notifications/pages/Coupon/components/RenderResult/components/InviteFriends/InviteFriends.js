import {React} from 'utility/css-ns';
import {Component} from 'react';
import {findDOMNode} from 'react-dom';
import copyToClip from 'utility/copyToClip';
import hasFeature from 'utility/hasFeature';
import _ from 'lodash';
import sendMetric from 'utility/sendMetric';
import Loader from 'components/Loader';
import * as actions from 'actions/inviteFriendsActions';
import OptionSelectInput from './components/OptionSelectInput';
import {WIKIBUY_URL} from 'constants';
import {getContactsFromBg} from 'actions/oauthActions';

import InviteTest from './InviteTest';

const emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class InviteFriends extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      success: false,
      referral_emails: [],
      firstname: null,
      lastname: null
    };
  }

  componentDidMount() {
    sendMetric('track', 'referWikibuyVisible', {});
  }

  render() {
    return !this.state.success && !this.state.addName ? (
      <div className="invite-wrapper">
        <h2>invite friends to save</h2>
        <div className="invite-friends">
          <OptionSelectInput
            valid={this.state.valid}
            onValidEdit={this.onValidEdit.bind(this)}
            placeholder="enter recipient email addresses"
            inputItems={this.state.referral_emails}
            validation={this.emailValidation.bind(this)}
            onAddEmail={this.addEmails.bind(this)}
            page={'inviteFriendsPage'}
            autoCompleteData={[]}
            autoCompleteFilter={() => {}}
          />

          <div onClick={this.importGoogle.bind(this)} className="import-google-contacts">
            <span className="gmail-logo" />
            <h4 className="bold">import Google contacts</h4>
          </div>

          <button
            onClick={
              this.props.firstname || this.state.firstname
                ? this.inviteFriends.bind(this)
                : this.addName.bind(this)
            }
            className={`primary-btn-large`}
            disabled={!this.state.valid || this.state.sendingInvites}>
            {this.state.sendingInvites ? (
              <Loader color="#ccc" size={20} direction="left">
                sending
              </Loader>
            ) : (
              'invite'
            )}
          </button>

          {hasFeature('notif_invite_friends') ? (
            <h4
              onClick={this.copyReferral.bind(this, 'text')}
              className="copy-referral-link tertiary-link">
              {this.state.copied ? 'copied' : 'copy invite link'}
            </h4>
          ) : (
            <button
              onClick={this.copyReferral.bind(this, 'button')}
              className={`primary-btn-large green-outline-button`}>
              {this.state.copied ? 'copied' : 'copy invite link'}
            </button>
          )}

          {this.state.error === false ? (
            <h4 className="bold note error">there was an error sending invites</h4>
          ) : null}
        </div>
      </div>
    ) : this.state.addName ? (
      <div className="invite-wrapper add-name">
        <div className="designed-form">
          <h2>Tell your friends who invited them to Wikibuy.</h2>
          <input
            placeholder="your name"
            ref={r => (this.nameInput = findDOMNode(r))}
            type="input"
            value={this.state.firstname || ''}
            onChange={this.onChangeName.bind(this)}
            autoFocus={true}
          />
          <button
            onClick={this.inviteFriends.bind(this)}
            className={`primary-btn-large`}
            disabled={!this.state.firstname || this.state.sendingInvites}>
            {this.state.sendingInvites ? (
              <Loader color="#ccc" size={20} direction="left">
                Sending
              </Loader>
            ) : (
              'Invite'
            )}
          </button>
        </div>
      </div>
    ) : this.state.success ? (
      <div className="invite-wrapper success" />
    ) : null;
  }

  async importGoogle() {
    sendMetric('trackClick', 'importGoogleContactsLink', 'import Gmail contacts');
    window.open(`${WIKIBUY_URL}/account-settings/invite-friends`, '_blank');
  }

  onChangeName(e) {
    const value = this.nameInput.value;
    this.setState({firstname: value});
  }

  copyReferral(type) {
    sendMetric('trackClick', 'copyReferralLink', type);

    const link = `${WIKIBUY_URL}/referral-code/${this.props.shortCode}`;
    this.setState({copied: copyToClip(link)}, () => {
      this.timeoutId = setTimeout(() => {
        this.setState({copied: false});
      }, 1000);
    });
  }

  addName() {
    sendMetric('trackClick', 'addNameToInvite', 'invite');
    this.setState({addName: true});
  }

  async inviteFriends() {
    const emails = _.map(this.state.referral_emails, email => {
      return email.value;
    });

    if (this.state.validEdit) {
      emails.push(this.state.validEdit);
    }

    this.setState({sendingInvites: true});

    sendMetric('trackClick', 'submitInvite', 'invite', {
      numberOfInvites: _.get(emails, 'length')
    });

    const success = await actions.sendInvites({
      referral_emails: emails,
      first_name: this.props.firstname || this.state.firstname,
      last_name: this.props.lastname || this.state.lastname
    });

    if (success) {
      this.props.onClosePopup();
      // this.addEmails([]);
      return;
    }
    this.setState({sendingInvites: false, success, addName: false});
  }

  addEmails(emails) {
    if (emails && emails.length) {
      this.setState({referral_emails: emails, validEdit: false}, () => {
        this.validateEmails();
      });
    } else {
      this.setState({referral_emails: [], valid: false});
    }
  }

  onValidEdit(email) {
    const invalid = _.filter(this.state.referral_emails, email => {
      return !email.valid;
    });
    this.setState({valid: !invalid.length && email, validEdit: email});
  }

  emailValidation(value) {
    return emailValidation.test(value);
  }

  validateEmails() {
    const emails = this.state.referral_emails;
    const invalid = _.filter(emails, email => {
      return !email.valid;
    });
    this.setState({
      valid: !invalid.length && emails.length
    });
  }
}

export default InviteFriends;
