import {React} from 'utility/css-ns';
import SerpProductAnnotation from 'pages/SerpProductAnnotation';
import Root from 'components/Root';
import loadApp from 'utility/loadApp';

export default async function loadSerpProductAnnotaion(
  {insertAfterElement, additionalClass, cssUrl},
  options = {}
) {
  function createApp(options) {
    return (
      <Root>
        <SerpProductAnnotation {...options} />
      </Root>
    );
  }
  const mountPoint = await loadApp(
    {
      initialRoute: '/offers',
      cssUrl: cssUrl || 'GENERATED/offers.css',
      disableDelay: true,
      waitForElement: true,
      maxWaitAttemps: 20,
      additionalClass: `__serp-product-annotation ${additionalClass || ''}`,
      insertAfterElement,
      app: createApp(options)
    },
    () => {}
  );
  return mountPoint;
}
