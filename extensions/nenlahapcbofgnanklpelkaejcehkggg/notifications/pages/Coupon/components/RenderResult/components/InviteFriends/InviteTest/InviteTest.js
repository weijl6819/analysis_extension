import {React} from 'utility/css-ns';
import {Component} from 'react';
import currency from 'utility/currency';
import {findDOMNode} from 'react-dom';
import copyToClip from 'utility/copyToClip';
import hasFeature from 'utility/hasFeature';
import _ from 'lodash';
import sendMetric from 'utility/sendMetric';
import Loader from 'components/Loader';
import * as actions from 'actions/inviteFriendsActions';
import OptionSelectInput from '../components/OptionSelectInput';
import ContactsList from '../components/ContactsList';
import {WIKIBUY_URL} from 'constants';
import {getContactsFromBg} from 'actions/oauthActions';
import './invite-test.less';

const emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class InviteFriends extends Component {
  constructor(...args) {
    super(...args);
    this.winWidth = 520;
    this.winHeight = 400;
    this.state = {
      success: false,
      referral_emails: [],
      google_contacts_added: [],
      firstname: null,
      lastname: null
    };
  }

  componentWillMount() {
    getContactsFromBg({contacts: true});
  }

  componentDidMount() {
    sendMetric('track', 'referWikibuyVisible', {});
  }

  toggleContact(contact) {
    let contacts = _.clone(this.state.google_contacts_added);
    if (_.find(contacts, contact)) {
      contacts = _.pull(contacts, contact);
    } else {
      contacts.push(contact);
    }
    this.setState({google_contacts_added: contacts});
  }

  addAllContacts(contacts) {
    this.setState({google_contacts_added: contacts});
  }

  render() {
    const referralEmails = _.filter(this.state.referral_emails, {valid: true});
    let added = [].concat(this.state.google_contacts_added).concat(referralEmails);
    added = _.uniqBy(added, c => {
      const v = c.email || c.value || c.name;
      return v;
    });
    added = added.length;

    const url = this.props.shortCode
      ? `${WIKIBUY_URL}/referral-code/${this.props.shortCode}`
      : 'https://wikibuy.com/instant';
    const campaign = 'facebook_referral';
    const googleContactsLoaded =
      _.get(this.props.googleContacts, 'contacts.length') && this.state.inviteByGoogle;
    return !this.state.success && !this.state.addName ? (
      <div className={`invite-wrapper ${googleContactsLoaded ? 'google-contacts-loaded' : ''}`}>
        {!googleContactsLoaded ? (
          <span>
            <h4 className="bold charcoal">Your friends can save too.</h4>
            <h5 className="silver">Enter an email address to share with friends.</h5>
          </span>
        ) : null}

        {googleContactsLoaded ? (
          <div className="contact-list-wrapper">
            <ContactsList
              inviteFriendsView={{}}
              hideFooter={true}
              googleContacts={this.props.googleContacts}
              onAddContact={contact => this.toggleContact(contact)}
              onAddAllContacts={contacts => this.addAllContacts(contacts)}
              addedToInvite={this.state.google_contacts_added}
              sendingInvite={false}
              allContactsInvited={false}
              query={null}
            />

            <button
              onClick={
                this.props.firstname || this.state.firstname
                  ? this.inviteFriends.bind(this)
                  : this.addName.bind(this)
              }
              className={`primary-btn-large google-contacts-submit`}
              disabled={
                (!this.state.valid && !this.state.google_contacts_added.length) ||
                this.state.sendingInvites
              }>
              {this.state.sendingInvites ? <Loader color="#ccc" size={20} /> : 'Share'}
            </button>
          </div>
        ) : null}

        {!googleContactsLoaded ? (
          <div className="invite-flex-wrapper">
            <div className="invite-friends">
              <OptionSelectInput
                valid={this.state.valid}
                onValidEdit={this.onValidEdit.bind(this)}
                placeholder="Friend's email"
                inputItems={this.state.referral_emails}
                validation={this.emailValidation.bind(this)}
                onAddEmail={this.addEmails.bind(this)}
                page={'inviteFriendsPage'}
                autoCompleteData={[]}
                autoCompleteFilter={() => {}}
              />

              <h3 className="silver or">OR</h3>

              <div className="share-flex">
                <div
                  onClick={this.fbShare.bind(
                    this,
                    `${url}/?utm_campaign=${campaign}&utm_source=facebook.com`
                  )}
                  className="share-facebook r-button"
                />
                <div onClick={this.importGoogle.bind(this)} className="import-google-contacts">
                  <span className="gmail-logo" />
                  {
                    // <h4 style={{color: '#d54b3d'}} className="bold">import Google contacts</h4>
                  }
                </div>
                <div onClick={this.copyReferral.bind(this, 'text')} className="share-link r-button">
                  {this.state.copied ? <h5 className="copy a">copied!</h5> : null}
                </div>
              </div>

              <button
                onClick={
                  this.props.firstname || this.state.firstname
                    ? this.inviteFriends.bind(this)
                    : this.addName.bind(this)
                }
                className={`primary-btn-large`}
                disabled={
                  (!this.state.valid && !this.state.google_contacts_added.length) ||
                  this.state.sendingInvites
                }>
                {this.state.sendingInvites ? <Loader color="#fff" size={20} /> : 'Share'}
              </button>

              {this.state.error === false ? (
                <h4 className="bold note error">there was an error sending invites</h4>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    ) : this.state.addName ? (
      <div className="invite-wrapper add-name">
        <div className="designed-form">
          <h3 className="bold charcoal">Tell your friends who invited them to Wikibuy.</h3>
          <input
            placeholder="Your name"
            ref={r => (this.nameInput = findDOMNode(r))}
            type="input"
            value={this.state.firstname || ''}
            onChange={this.onChangeName.bind(this)}
            autoFocus={true}
          />
          <button
            onClick={this.inviteFriends.bind(this)}
            className={`primary-btn-large name-submit`}
            disabled={!this.state.firstname || this.state.sendingInvites}>
            {this.state.sendingInvites ? <Loader color="#ccc" size={20} /> : 'Share'}
          </button>
        </div>
      </div>
    ) : this.state.success ? (
      <div className="invite-wrapper success">
        <h3 style={{textAlign: 'center'}} className="bold palmetto">
          Your invites have been sent!
        </h3>
      </div>
    ) : null;
  }

  async importGoogle() {
    sendMetric('trackClick', 'importGoogleContacts', 'import Gmail contacts', {
      pageLocation: 'extension'
    });
    getContactsFromBg();
    this.setState({inviteByGoogle: true});
  }

  onChangeName(e) {
    const value = this.nameInput.value;
    this.setState({firstname: value});
  }

  copyReferral(type) {
    sendMetric('trackClick', 'copyReferralLink', type, {pageLocation: 'extension'});

    const link = `${WIKIBUY_URL}/referral-code/${this.props.shortCode}`;
    this.setState({copied: copyToClip(link)}, () => {
      this.timeoutId = setTimeout(() => {
        this.setState({copied: false});
      }, 1000);
    });
  }

  addName() {
    sendMetric('trackClick', 'addNameToInvite', 'invite', {pageLocation: 'extension'});
    this.setState({addName: true});
  }

  async inviteFriends() {
    const referalls = []
      .concat(this.state.referral_emails)
      .concat(this.state.google_contacts_added);
    const emails = _.map(referalls, email => {
      return email.value || email.email;
    });

    if (this.state.validEdit) {
      emails.push(this.state.validEdit);
    }

    sendMetric('trackClick', 'submitInvite', 'invite', {
      numberOfInvites: _.get(emails, 'length'),
      pageLocation: 'extension'
    });

    this.setState({sendingInvites: true});
    const success = await actions.sendInvites({
      referral_emails: emails,
      first_name: this.props.firstname || this.state.firstname,
      last_name: this.props.lastname || this.state.lastname
    });

    if (success) {
      this.addEmails([]);
      this.timeout = setTimeout(() => {
        this.setState({success: null, google_contacts_added: []});
      }, 3000);
    }
    this.setState({sendingInvites: false, success, addName: false, inviteByGoogle: false});
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

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  // FACEBOOK
  fbShare(url, e) {
    e.stopPropagation();
    sendMetric('trackClick', `shareFacebook`, 'Share on facebook', {pageLocation: 'extension'});
    const title = 'Wikibuy';
    const image = 'https://wikibuy.com/assets/images/wikibuy_logo.png';
    const message =
      'Get $5 towards your first purchase on Wikibuy. Save time and money when you shop on Amazon.';
    this.createPopup(
      'http://www.facebook.com/sharer.php?s=100&p[title]=' +
        title +
        '&p[summary]=' +
        message +
        '&p[url]=' +
        url +
        '&p[images][0]=' +
        image,
      'Share'
    );
  }

  createPopup(url, name) {
    const winTop = screen.height / 2 - this.winWidth / 2;
    const winLeft = screen.width / 2 - this.winWidth / 2;
    window.open(
      url,
      name,
      'top=' +
        winTop +
        ',left=' +
        winLeft +
        ',toolbar=0,status=0,width=' +
        this.winWidth +
        ',height=' +
        this.winHeight
    );
  }

  select() {
    sendMetric('trackClick', 'selectReferralLink', 'invite friends', {pageLocation: 'extension'});
    this.refs.referralInput.select();
  }
}

export default InviteFriends;
