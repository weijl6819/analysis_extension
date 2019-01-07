import {React} from 'utility/css-ns';
import SerpAnnotation from 'pages/SerpAnnotation';
import Root from 'components/Root';
import loadApp from 'utility/loadApp';

export default async function loadEstimateAnnotaion(
  {insertAfterElement, additionalClass, cssUrl},
  options = {}
) {
  function createApp(options) {
    return (
      <Root>
        <SerpAnnotation {...options} />
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
      additionalClass: `__serp-annotation ${additionalClass || ''}`,
      insertAfterElement,
      app: createApp(options)
    },
    () => {}
  );
  return mountPoint;
}
