import {React} from 'utility/css-ns';
import {Component} from 'react';
import ProductPageAnnotation from 'pages/ProductPageAnnotation';
import {branch} from 'higher-order/baobab';
import _ from 'lodash';
import './app.less';

class App extends Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }
  render() {
    const notification = this.props.notification || {};
    const runId = _.get(notification, 'run.runId');
    return (
      <div className={runId ? `wb-run run-${runId}` : ''}>
        <ProductPageAnnotation />
      </div>
    );
  }
}

export default branch(
  {
    notification: ['notification']
  },
  App
);
