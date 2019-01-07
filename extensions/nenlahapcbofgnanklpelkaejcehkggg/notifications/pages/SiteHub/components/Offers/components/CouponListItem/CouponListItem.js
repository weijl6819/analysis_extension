import {React} from 'utility/css-ns';
import {Component} from 'react';
import copyToClip from 'utility/copyToClip';
import InfoIcon from 'components/InfoIcon';
import {copyCode} from 'actions/couponActions';
import './coupon-list-item.less';

class CouponListItem extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      copied: false,
      showRestrictions: false
    };
  }

  render() {
    let {code, restrictions = null} = this.props.coupon;
    return (
      <div className={`wb-CouponListItem ${this.state.copied ? 'copied' : ''}`}>
        <div className="item-container" onClick={this.onClickCopy.bind(this)}>
          <div className="details">
            <span>
              <h4 className="code">{code}</h4>
              {restrictions ? (
                <span className="info-icon">
                  <InfoIcon onClick={this.toggleTerms.bind(this)} />
                </span>
              ) : null}
            </span>
          </div>
          <div className="copied">
            {this.state.copied ? <h4 className="copied-text">copied</h4> : null}
          </div>
        </div>
        {restrictions && this.state.showRestrictions ? (
          <h5 className="restrictions">{restrictions}</h5>
        ) : null}
      </div>
    );
  }

  onClickCopy() {
    this.setState({copied: copyToClip(this.props.coupon.code)}, () => {
      this.timeoutId = setTimeout(() => {
        this.setState({copied: false});
        copyCode(this.props.coupon.code);
      }, 1000);
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  toggleTerms() {
    this.setState({showRestrictions: !this.state.showRestrictions});
  }
}

export default CouponListItem;
