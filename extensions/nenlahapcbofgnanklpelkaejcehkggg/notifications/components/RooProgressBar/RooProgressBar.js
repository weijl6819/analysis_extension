import {React} from 'utility/css-ns';
import './roo-progress-bar.less';

class ProgressBar extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      progress: 0,
      end: 0
    };
  }

  componentWillMount() {
    const couponLength = this.props.coupons.length || 0;
    let newProgress;
    let newEnd;
    if (this.props.currentCodeIndex === -1) {
      newProgress = 0;
      newEnd = (1 / couponLength) * 100;
    } else {
      newEnd = ((this.props.currentCodeIndex + 1) / couponLength) * 100;
      if (this.props.currentCodeIndex === 0) {
        newProgress = 15;
      } else {
        newProgress = (this.props.currentCodeIndex / couponLength) * 100;
      }
    }
    if (newProgress > this.state.progress) {
      this.setState({progress: Math.round(newProgress)});
      this.setState({end: Math.round(newEnd)});
      this.initInterval();
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.complete && nextProps && nextProps.complete) {
      clearInterval(this.intervalId);
      this.setState({progress: 100});
    } else if (!this.props.complete && nextProps && nextProps.currentCodeIndex) {
      clearInterval(this.intervalId);
      if (this.props.coupons.length) {
        const newProgress = (nextProps.currentCodeIndex / this.props.coupons.length) * 100;
        if (newProgress > this.state.progress) {
          const newEnd = ((nextProps.currentCodeIndex + 1) / this.props.coupons.length) * 100;
          this.setState({progress: Math.round(newProgress)});
          this.setState({end: Math.round(newEnd)});
        }
      }
      this.initInterval();
    }
  }

  initInterval() {
    const interval = Math.round((this.props.runTimePerCoupon * this.props.coupons.length) / 100);
    this.intervalId = setInterval(() => {
      if (this.state.progress < this.state.end) {
        this.setState({progress: this.state.progress + 1});
      } else {
        clearInterval(this.intervalId);
      }
    }, interval);
  }

  render() {
    return (
      <div className={this.props.rounded ? 'rounded progress-bar' : 'progress-bar'}>
        <div className="progress" style={{width: `${Math.min(this.state.progress || 10, 100)}%`}} />
      </div>
    );
  }
}

ProgressBar.defaultProps = {
  estimatedDuration: 3000
};

export default ProgressBar;
