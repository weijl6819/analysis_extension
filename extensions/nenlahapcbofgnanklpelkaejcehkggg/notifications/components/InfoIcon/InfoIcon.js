import {React} from 'utility/css-ns';

class InfoIcon extends React.Component {
  render() {
    return (
      <svg
        viewBox="0 0 110 110.2"
        style={{width: '15px', display: 'inline-block', height: '20px'}}
        onClick={this.props.onClick}>
        <circle style={{fill: '#C7C9CD'}} cx="54.8" cy="55.4" r="50.9" />
        <g>
          <rect x="46.8" y="50" style={{fill: '#FFFFFF'}} width="16.1" height="37.1" />
          <circle style={{fill: '#FFFFFF'}} cx="54.8" cy="31.7" r="8.1" />
        </g>
      </svg>
    );
  }
}

export default InfoIcon;
