import {React} from 'utility/css-ns';

class Star extends React.Component {
  render() {
    return this.props.type === 'half' ? this.half() : this.full(this.props.type);
  }

  half() {
    return (
      <svg
        className="nc-icon glyph star"
        x="0px"
        y="0px"
        width="48px"
        height="48px"
        viewBox="-281 373 48 48">
        <g>
          <path
            fill="#E8E8E8"
            stroke="#acaaaa"
            d="M-256.1,376l6.5,13.2l14.6,2.1c0.8,0.1,1.1,1.1,0.6,1.7l-10.5,10.3l2.5,14.5c0.1,0.8-0.7,1.4-1.5,1.1l-13-6.9
            l-13,6.9c-0.7,0.4-1.6-0.2-1.5-1.1l2.5-14.5l-10.5-10.3c-0.6-0.6-0.3-1.6,0.6-1.7l14.6-2.1l6.5-13.2
            C-257.5,375.2-256.5,375.2-256.1,376z"
          />
        </g>
        <g>
          <path
            fill="#F9C319"
            d="M-257,412l-13,6.9c-0.7,0.4-1.6-0.2-1.5-1.1l2.5-14.5l-10.5-10.3c-0.6-0.6-0.3-1.6,0.6-1.7l14.6-2.1l6.5-13.2
            c0.2-0.4,0.5-0.6,0.9-0.6L-257,412z"
          />
        </g>
      </svg>
    );
  }

  full(type) {
    const empty = this.props.type === 'empty';
    return (
      <svg
        onClick={this.props.onClick ? this.props.onClick.bind(this, this.props.rating) : null}
        className="nc-icon glyph star"
        x="0px"
        y="0px"
        width="48px"
        height="48px"
        viewBox="0 0 48 48">
        <g>
          <path
            fill={empty ? '#E8E8E8' : '#f9c319'}
            stroke={empty ? '#acaaaa' : '#f9c319'}
            d="M24.897,2.99l6.521,13.211l14.577,2.119c0.82,0.119,1.148,1.127,0.554,1.706L36,30.307l2.49,14.52 c0.14,0.817-0.717,1.44-1.451,1.054l-13.038-6.854l-13.04,6.856C10.227,46.27,9.37,45.647,9.51,44.83L12,30.307L1.451,20.026 c-0.594-0.578-0.266-1.587,0.554-1.706l14.577-2.119L23.103,2.99C23.47,2.247,24.53,2.247,24.897,2.99z"
          />
        </g>
      </svg>
    );
  }
}

export default Star;
