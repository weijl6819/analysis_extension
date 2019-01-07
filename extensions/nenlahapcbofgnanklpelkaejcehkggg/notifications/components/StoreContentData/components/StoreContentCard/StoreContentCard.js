import {React} from 'utility/css-ns';
import {Component} from 'react';
import _ from 'lodash';
import './store-content-card.less';

class StoreContentCard extends Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  render() {
    const imageStyles = _.get(this.props, 'image.style', {});
    return (
      <div
        style={this.props.style || {}}
        onClick={this.props.onClickContentCard.bind(this, this.props)}
        className="store-content-card">
        <div className="flex">
          <div className="image-wrapper">
            <div
              className={`image ${_.get(this.props, 'image.className', '')}`}
              style={{
                ...imageStyles,
                ...{backgroundImage: `url("${_.get(this.props, 'image.url') || this.props.image}")`}
              }}
            />
          </div>
          <div className="content">
            <h4
              className={`${_.get(this.props, 'title.className', '')} charcoal`}
              style={_.get(this.props, 'title.style', {})}>
              {_.get(this.props, 'title.value')}
            </h4>

            <h5
              className={`silver ${_.get(this.props, 'subtitle.className', '')}`}
              style={_.get(this.props, 'subtitle.style', {})}>
              {_.get(this.props, 'subtitle.value')}
            </h5>

            <h6
              className={`palmetto ${_.get(this.props, 'cta.className', '')}`}
              style={_.get(this.props, 'cta.style', {})}>
              {_.get(this.props, 'cta.value')}
            </h6>
          </div>
        </div>
      </div>
    );
  }
}

export default StoreContentCard;
