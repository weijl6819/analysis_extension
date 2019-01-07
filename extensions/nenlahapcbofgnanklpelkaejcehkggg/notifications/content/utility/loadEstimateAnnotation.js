import {React} from 'utility/css-ns';
import ProductEstimateAnnotation from 'pages/ProductEstimateAnnotation';
import Root from 'components/Root';
import loadApp from 'utility/loadApp';

export default function loadEstimateAnnotaion(
  {insertAfterElement, additionalClass, cssUrl},
  options = {}
) {
  function createApp(options) {
    return (
      <Root>
        <ProductEstimateAnnotation {...options} />
      </Root>
    );
  }
  return loadApp(
    {
      initialRoute: '/offers',
      cssUrl: cssUrl || 'GENERATED/offers.css',
      disableDelay: true,
      waitForElement: true,
      maxWaitAttemps: 20,
      additionalClass: `__product-estimate-annotation ${additionalClass || ''}`,
      insertAfterElement,
      app: createApp(options)
    },
    () => {}
  );
}
