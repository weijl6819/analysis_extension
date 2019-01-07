import {React} from 'utility/css-ns';
import TWEEN from 'tween.js';
import tree from 'state';
import _ from 'lodash';
const browser = tree.select('browser');

export default function scrollToNode(Component) {
  class ScrollToNode extends React.Component {
    scrollToNode(node, {offset = 0, duration = 500} = {}, scrollEl) {
      if (!node) {
        return;
      }
      this.setupTween();
      this.scrollTween = new TWEEN.Tween({
        top: scrollEl.scrollTop
      })
        .to({top: node.offsetTop - offset}, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function() {
          scrollEl.scrollTop = this.top;
        })
        .onComplete(
          function() {
            this.cleanUpTween();
          }.bind(this)
        )
        .start();
    }

    setupTween() {
      this.rafEnabled = true;
      this.animate();
    }

    animate(time) {
      if (this.rafEnabled) {
        requestAnimationFrame(this.animate.bind(this));
        TWEEN.update(time);
      }
    }

    cleanUpTween() {
      this.rafEnabled = false;
      TWEEN.remove(this.scrollTween);
    }

    render() {
      return <Component scrollToNode={this.scrollToNode.bind(this)} {...this.props} />;
    }
  }

  return ScrollToNode;
}
