import {React} from 'utility/css-ns';
import {findDOMNode} from 'react-dom';
import classNames from 'classnames';
import './loader.less';

class Loader extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  componentDidMount() {
    if (!this.props.loaded) {
      const width = findDOMNode(this.refs.spinner).clientWidth || this.props.size;
      const height = findDOMNode(this.refs.spinner).clientHeight || this.props.size;
      this.setState({width, height});
    }
  }

  render() {
    if (this.props.loaded) {
      return false;
    }
    const styles = {
      fontSize: this.props.size,
      width: this.props.size,
      height: this.props.size,
      color: this.props.color
    };
    const margins = {
      marginLeft: this.props.disableAutoMargins ? 0 : -this.state.width / 2,
      marginTop: this.props.disableAutoMargins ? 0 : -this.state.height / 2,
      width: this.state.width
    };
    const classes = classNames(this.props.classNames, this.props.direction, 'loader');
    return (
      <div ref="spinner" style={this.state.width ? margins : null} className={classes}>
        <div className="spin icon-refresh" style={styles} />
        {this.props.children}
      </div>
    );
  }
}

Loader.defaultProps = {
  size: 29
};

export default Loader;
