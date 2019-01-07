import {React} from 'utility/css-ns';
import sendMetric from 'utility/sendMetric';
import {Component} from 'react';
import PartnerLogo from 'components/PartnerLogo';
import _ from 'lodash';
import './page-product-image.less';

class PageProduceImage extends Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  componentWillMount() {
    const image = this.findDeweyResult();
    this.preloadImage(image);
  }

  componentWillReceiveProps(nextProps) {
    const image = _.get(this.props.deweyResult, 'pageData.products[0].image', '').trim();
    const nextImage = _.get(nextProps.deweyResult, 'pageData.products[0].image', '').trim();
    if (nextImage !== image) {
      this.setState({image: null, error: false});
      setTimeout(() => this.preloadImage(nextImage), 20);
    }
  }

  componentWillUnmount() {
    if (this.image) {
      this.image.removeEventListener('load', this.onLoad);
      this.image.removeEventListener('error', this.onError);
    }
  }

  preloadImage(imageSrc) {
    if (!imageSrc) {
      this.onImageError();
      return;
    }
    this.image = new Image();
    this.onLoad = this.onImageLoad.bind(this, imageSrc);
    this.onError = this.onImageError.bind(this);
    this.image.addEventListener('load', this.onLoad);
    this.image.addEventListener('error', this.onError);
    this.image.src = imageSrc;
  }

  findDeweyResult() {
    const products = _.get(this.props.deweyResult, 'pageData.products');
    const pageType = _.get(this.props.deweyResult, 'pageType');
    if (products && products.length) {
      let image = _.get(this.props.deweyResult, 'pageData.products[0].image', '').trim();
      if (pageType === 'cartPage' || pageType === 'checkoutPage' || pageType === 'reviewPage') {
        image = _.get(_.sortBy(products, 'list_price').reverse(), '[0].image', '').trim();
      }
      return image;
    }
  }

  render() {
    const {image, error} = this.state;
    return (
      <div className="product-page-image-wrapper">
        {error ? (
          <PartnerLogo domain={this.props.domain} cursor={this.props.cursor} />
        ) : image ? (
          <div className={'product-page-image'} style={{backgroundImage: 'url("' + image + '")'}} />
        ) : (
          <PartnerLogo domain={this.props.domain} cursor={this.props.cursor} />
        )}
      </div>
    );
  }

  onImageLoad(imageSrc) {
    sendMetric('track', 'productImageLoaded', {
      pageType: _.get(this.props, 'deweyResult.pageType'),
      domain: this.props.domain,
      notificationType: this.props.notificationType || 'coupon'
    });
    this.setState({image: imageSrc});
  }

  onImageError() {
    this.setState({error: true});
  }
}

export default PageProduceImage;
