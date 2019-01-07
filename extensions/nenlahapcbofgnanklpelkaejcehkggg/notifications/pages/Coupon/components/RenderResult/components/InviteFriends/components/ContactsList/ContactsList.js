import {React} from 'utility/css-ns';
import _ from 'lodash';
import sendMetric from 'utility/sendMetric';
import {sendContactsInvite} from 'actions/inviteFriendsActions';
import Loader from 'components/Loader';
import Fuse from 'fuse.js';
import './contacts-list.less';

const options = {
  keys: ['email', 'name'],
  threshold: 0.3
};
const f = new Fuse([], options);
function transformContacts(contacts, query) {
  f.set(contacts);
  if (query && query.length < 32) {
    // 32 is fuse max query length
    return f.search(query);
  } else {
    return null;
  }
}

class ContactsList extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      active: -1
    };
  }

  componentDidMount() {
    this.setContacts(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (
      _.isEqual(
        _.get(nextProps, 'googleContacts.contact'),
        _.get(this.props, 'googleContacts.contact')
      )
    ) {
      this.setContacts(nextProps);
    }
  }

  setContacts(props) {
    const contacts = _.get(props, 'googleContacts.contacts', []);
    const frequentContacts = _.get(props, 'googleContacts.frequentContacts', []);
    this.setState({contacts: [].concat(frequentContacts, contacts)});
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.query !== this.state.query) {
      const filteredContacts = transformContacts(this.state.contacts, this.state.query);
      this.setState({filteredContacts});
      this.selectAll.checked = false;
    }
  }

  render() {
    const numberAdded = this.props.addedToInvite.length;
    const inviteFriends = _.get(this.props, 'inviteFriendsView', {});
    const awaitingSave = inviteFriends.awaitingContactSave;
    const error = inviteFriends.error;
    const success = inviteFriends.success;

    const contacts = this.state.filteredContacts || this.state.contacts;
    return (
      <div className="contact-list">
        <div className={`search ${this.props.hideFooter ? 'overlay' : ''}`}>
          <span className="icon icon-search" />
          <input
            className="search-input"
            onChange={this.handleChangeSearch.bind(this)}
            onBlur={this.blurField.bind(this)}
            onFocus={this.focusField.bind(this)}
            placeholder="Search contacts"
            type="text"
            ref={r => {
              if (r) {
                this.input = r;
              }
            }}
          />
          {this.props.hideFooter ? (
            <div className="flex">
              <input
                type="checkbox"
                ref={r => {
                  if (r) {
                    this.selectAll = r;
                  }
                }}
                className="send-invite"
                id={`select-all`}
                onChange={this.onClickSelectAll.bind(this)}
              />
              <label htmlFor={`select-all`}>Select All</label>
            </div>
          ) : null}
        </div>
        <ul
          onMouseLeave={this.setActive.bind(this, -1)}
          ref="contactScrollList"
          className="contacts">
          {_.map(contacts, (contact, i) => {
            const active = this.state.active === i;
            return (
              <li
                key={`contact-${i}`}
                ref={active ? 'activeContactItem' : null}
                onMouseOver={this.setActive.bind(this, i)}
                className={active ? 'active' : ''}
                key={'contact-' + i}>
                <div className="flex space">
                  <input
                    disabled={contact.invited}
                    type="checkbox"
                    className="send-invite"
                    id={`send-invite-${i}`}
                    checked={_.find(this.props.addedToInvite, {email: contact.email})}
                    onChange={this.props.onAddContact.bind(this, contact)}
                  />
                  <label htmlFor={`send-invite-${i}`}>
                    <div className="flex space">
                      <h5 className="one">{contact.name || contact.email}</h5>
                      {contact && contact.name ? <h4 className="two">{contact.email}</h4> : null}
                    </div>
                  </label>
                </div>
              </li>
            );
          })}
        </ul>
        {this.props.hideFooter ? null : (
          <footer className="flex space">
            <div className="flex">
              <input
                type="checkbox"
                className="send-invite"
                id={`select-all`}
                onChange={this.onClickSelectAll.bind(this)}
              />
              <label htmlFor={`select-all`}>Select All</label>
            </div>
            {success ? (
              <button className="primary-btn-large sent" disabled>
                <span className="icon-circle-check" />Sent
              </button>
            ) : awaitingSave ? (
              <button className={`primary-btn-large`} disabled={true}>
                <Loader light={true} scale={0.5}>
                  Sending
                </Loader>
              </button>
            ) : (
              <button
                onClick={this.onClickInvites.bind(this)}
                className="primary-btn-large"
                disabled={numberAdded === 0}>
                Send {numberAdded > 0 ? numberAdded : ''} {numberAdded === 1 ? 'invite' : 'Invites'}
              </button>
            )}
          </footer>
        )}
        {error ? <h3 className="error">There was an error, please try again</h3> : null}
      </div>
    );
  }

  onClickSelectAll(e) {
    if (this.selectAll.checked) {
      const contacts = this.state.filteredContacts || this.state.contacts;
      const uniq = _.uniqBy([...contacts, ...this.props.addedToInvite], 'email');
      this.props.onAddAllContacts(uniq);
    } else {
      this.props.onAddAllContacts([]);
    }
  }

  blurField() {
    this.setState({inputFocus: false, active: -1});
  }

  focusField() {
    this.setState({inputFocus: true});
  }

  setActive(index) {
    this.setState({active: index});
  }

  onClickInvites() {
    sendContactsInvite(_.map(this.props.addedToInvite, contact => contact.email));
    sendMetric('trackClick', 'submitInvite', 'import Gmail contacts', {
      numberOfInvites: _.get(this.props.addedToInvite, 'length')
    });
    if (this.props.onAdded) {
      this.props.onAdded(_.get(this.props.addedToInvite, 'length'));
    }
  }

  handleChangeSearch(e) {
    this.setActive(-1);
    this.setState({query: this.input.value});
  }
}

export default ContactsList;
