import {React} from 'utility/css-ns';
import {WIKIBUY_URL} from 'constants';
import isFullAccount from 'utility/isFullAccount';
import './verify-account.less';

class VerifyAccount extends React.Component {
  state = {};
  render() {
    return (
      <div className="verify-account">
        <h2>Verify your account to see savings</h2>
        <p>
          Your account was temporarily suspended. Please login and verify your account to continue
          service.
        </p>
        <a href={`${WIKIBUY_URL}/?suspended=t`} target="_blank">
          <button className="primary-btn-large">Continue</button>
        </a>
        {!isFullAccount() ? (
          <div className="other-links">
            <h5>
              Need an account?{' '}
              <a
                href={`${WIKIBUY_URL}/onboarding?io=true`}
                className="primary-link"
                target="_blank">
                Create Account
              </a>
            </h5>
          </div>
        ) : null}
      </div>
    );
  }
}

export default VerifyAccount;
