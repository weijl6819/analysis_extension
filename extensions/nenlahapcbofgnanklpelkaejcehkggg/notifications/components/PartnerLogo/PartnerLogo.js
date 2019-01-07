import {React} from 'utility/css-ns';
import './partner-logo.less';

class PartnerLogo extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  componentWillMount() {
    this.preloadImage(this.props.domain);
  }

  preloadImage(domain, clearbit) {
    if (!domain) {
      this.onImageError();
      return;
    }
    const imageSrc = clearbit
      ? `https://logo.clearbit.com/${domain}?size=300`
      : `https://cdn.ivaws.com/wikibuy-assets/images/merchant-logos/edit/${domain.replace(
          /\.com$|\.net$/,
          ''
        )}.png`;
    this.image = new Image();
    this.image.addEventListener('load', () => this.onImageLoad(imageSrc));
    this.image.addEventListener('error', () => {
      if (clearbit) {
        this.onImageError();
      } else {
        this.preloadImage(domain, true);
      }
    });
    this.image.src = imageSrc;
  }

  render() {
    const {cursor} = this.props;
    const {image, error} = this.state;
    return (
      <div className="partner-logo-component partner-logo-wrapper">
        {error ? (
          <div
            className="partner-logo"
            style={{
              backgroundImage: 'url("https://cdn.ivaws.com/wikibuy-assets/images/wb_credits.svg")',
              cursor
            }}
          />
        ) : image ? (
          <div className="partner-logo" style={{backgroundImage: `url("${image}")`, cursor}} />
        ) : (
          <div className="partner-logo pad" />
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

PartnerLogo.defaultProps = {
  cursor: 'auto'
};

export default PartnerLogo;
