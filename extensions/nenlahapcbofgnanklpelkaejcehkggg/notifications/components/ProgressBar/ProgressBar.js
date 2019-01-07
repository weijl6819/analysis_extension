import {React} from 'utility/css-ns';
import './progress-bar.less';

let progressInterval;
class ProgressBar extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      progress: 0
    };
  }

  componentWillMount() {
    this.setInt(this.props.estimatedDuration);
  }

  setInt(estimatedTimeLeft, progressLeft = 100) {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      if (this.props.pause) {
        return;
      } else {
        if (this.state.progress < 100) {
          this.setState({progress: this.state.progress + 1});
        } else {
          clearInterval(this.intervalId);
        }
      }
    }, Math.round(estimatedTimeLeft / progressLeft));
    progressInterval = this.intervalId;
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.complete && nextProps && nextProps.complete) {
      clearInterval(this.intervalId);
      this.setState({progress: 100});
    }

    if (nextProps.estimatedTimeLeft) {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      this.setInt(nextProps.estimatedTimeLeft, 100 - this.state.progress);
    } else if (nextProps.estimatedDuration) {
      clearInterval(progressInterval);
      this.setInt(nextProps.estimatedDuration, 100 - this.state.progress);
    }
  }
  render() {
    const {progress} = this.state;
    const scaledProgress = 10 + (progress / 100) * 90;
    const progressForRender = Math.min(scaledProgress, 100);
    return (
      <div
        id="progress-bar-wrapper"
        className={this.props.rounded ? 'rounded progress-bar' : 'progress-bar'}>
        <div className="progress" style={{width: `${progressForRender}%`}} />
      </div>
    );
  }
}

ProgressBar.defaultProps = {
  estimatedDuration: 60000
};

export default ProgressBar;
