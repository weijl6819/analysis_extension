import {React} from 'utility/css-ns';
import uuid from 'node-uuid';
import _ from 'lodash';
import {logImpression} from 'actions/contentApiActions';

class ImpressionComponent extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {};
    this.impressionMap = [];
  }

  componentWillMount() {
    if (_.get(this.props, 'children.length') && !this.props.ignoreImpression) {
      this.setState({children: this.attachProps(this.props.children)});
    }
  }

  componentDidMount() {
    if (this.props.logOnMount) {
      this.logImpression(
        _.map(this.state.children, (item, i) => {
          return {
            type: 'impression',
            props: {
              ...item.mirageData.trackProps,
              displayIndex: String(i)
            }
          };
        })
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      !this.props.ignoreImpression &&
      (_.get(nextProps.children, 'length') &&
        !_.get(this.props.children, 'length') &&
        !this.state.children)
    ) {
      this.setState({children: this.attachProps(nextProps.children)});
    }
  }

  render() {
    let children = this.props.children;
    if (this.state.children) {
      children = this.state.children;
      return _.map(children, item => {
        return item.component;
      });
    }
    return children;
  }

  attachProps(children) {
    const logImpressionFunction = this.logImpression.bind(this);
    return _.map(children, item => {
      if (!item || !item.props) {
        throw new Error('Children Must Be A Component');
      }
      const mirageData = _.clone(_.get(item.props, '__mirage', {}));
      mirageData.trackProps.view_id = uuid.v4();
      const propsAdded = {
        ...item.props,
        __mirage: mirageData,
        logImpression: logImpressionFunction
      };
      return {mirageData, component: React.cloneElement(item, propsAdded)};
    });
  }

  logImpression(data) {
    data = _.isArray(data) ? data : [data];
    const newImpressions = _.filter(data, d => {
      return !_.find(this.impressionMap, {
        type: d.type,
        props: {contentInstanceId: d.props.contentInstanceId}
      });
    });
    if (newImpressions.length) {
      this.impressionMap = this.impressionMap.concat(newImpressions);
      logImpression(data);
    }
  }
}

export default ImpressionComponent;
