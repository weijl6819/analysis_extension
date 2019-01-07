import {React} from 'utility/css-ns';
import './product-image.less';

class ProductImage extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  componentWillMount() {
    this.preloadImage(this.props.image);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.image !== nextProps.image) {
      this.setState({image: null, error: false});
      setTimeout(() => this.preloadImage(nextProps.image), 100);
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
    if (!this.props.fadeIn) {
      this.setState({image: this.props.image});
      return;
    }
    this.image = new Image();
    this.onLoad = this.onImageLoad.bind(this, imageSrc);
    this.onError = this.onImageError.bind(this);
    this.image.addEventListener('load', this.onLoad);
    this.image.addEventListener('error', this.onError);
    this.image.src = imageSrc;
  }

  render() {
    const {subtitle, cursor, missingRelAvatar, rel} = this.props;
    const {image, error} = this.state;
    return (
      <div className="product-image-component product-image-wrapper">
        {error ? (
          <div className="image-error">
            {missingRelAvatar ? (
              <div className="product-image rel-avatar">{rel ? rel[0].toUpperCase() : 'U'}</div>
            ) : (
              <div
                className="product-image"
                style={{
                  backgroundImage:
                    'url("https://cdn.ivaws.com/wikibuy-assets/images/noimage-medium.svg")',
                  cursor
                }}
              />
            )}
            {subtitle ? <h3>image not found</h3> : null}
          </div>
        ) : image ? (
          <div
            className={this.props.fadeIn ? 'product-image in' : 'product-image'}
            style={{backgroundImage: 'url("' + image + '")', cursor}}
          />
        ) : (
          <div className="product-image pad" />
        )}
      </div>
    );
  }

  onImageLoad(imageSrc) {
    this.setState({image: imageSrc});
  }

  onImageError() {
    this.setState({error: true});
  }
}

ProductImage.defaultProps = {
  cursor: 'auto',
  fadeIn: true
};

export default ProductImage;
