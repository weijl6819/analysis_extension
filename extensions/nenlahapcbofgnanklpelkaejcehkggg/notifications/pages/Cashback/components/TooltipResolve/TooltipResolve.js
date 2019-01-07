import {React} from 'utility/css-ns';
import Tooltip from 'components/Tooltip';

function TooltipResolve({
  offerSignUp,
  storeName,
  hideNotification,
  showOnTop,
  showOnRight,
  onDismissTooltip,
  hasSeenCashbackSignupTip,
  hasSeenCashbackActivateTip
}) {
  return (
    <div>
      {!hasSeenCashbackSignupTip && offerSignUp && !hideNotification ? (
        <Tooltip
          tip={true}
          message={
            <span>
              Wikibuy can help you save <br />on {storeName} today, just click activate. It's easy
              and free money.
            </span>
          }
          delay={'1500ms'}
          style={{
            top: showOnTop ? '15px' : 'auto',
            bottom: showOnTop ? 'auto' : '15px',
            width: '461px',
            left: showOnRight ? 'auto' : '320px',
            right: showOnRight ? '320px' : 'auto'
          }}
          onDismissTooltip={onDismissTooltip.bind(null, 'hasSeenCashbackSignupTip')}
        />
      ) : null}
      {!hasSeenCashbackActivateTip && !offerSignUp && !hideNotification ? (
        <Tooltip
          tip={true}
          tipLabel={'wikibuy tip:'}
          message={
            <span>
              Just click when you see <br />this to get free money, seriously.
            </span>
          }
          delay={'1500ms'}
          style={{
            top: showOnTop ? '15px' : 'auto',
            bottom: showOnTop ? 'auto' : '15px',
            width: '468px',
            left: showOnRight ? 'auto' : '320px',
            right: showOnRight ? '320px' : 'auto'
          }}
          onDismissTooltip={onDismissTooltip.bind(null, 'hasSeenCashbackActivateTip')}
        />
      ) : null}
    </div>
  );
}

export default TooltipResolve;
