import {React} from 'utility/css-ns';
import {Component} from 'react';
import {root} from 'higher-order/baobab';
import tree from 'state';

class Root extends Component {
  render() {
    return this.props.children;
  }
}

export default root(tree, Root);
