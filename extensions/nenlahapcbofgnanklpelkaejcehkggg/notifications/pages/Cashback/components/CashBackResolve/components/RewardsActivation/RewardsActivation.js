import {React} from 'utility/css-ns';
import WarnAboutCashback from 'components/WarnAboutCashback';
import CashbackSectionSimple from './components/CashbackSectionSimple';

function RewardsActivation(props) {
  const {
    hasActivated,
    warnAboutStandDown,
    onActivate,
    onSignup,
    activated,
    activating,
    activate,
    showInitialSignup,
    session,
    view,
    onActivateWarn,
    reward,
    innerCopy,
    outerCopy,
    mousedOver,
    userCreditAmount,
    deweyResult
  } = props;

  return (
    <div className="rewards-activation">
      {hasActivated && warnAboutStandDown ? (
        <WarnAboutCashback
          reward={reward}
          activated={activated}
          activating={activating}
          onActivateWarn={onActivateWarn}
        />
      ) : (
        <CashbackSectionSimple
          userCreditAmount={userCreditAmount}
          view={view}
          session={session}
          showInitialSignup={showInitialSignup}
          activate={activate}
          activating={activating}
          activated={activated}
          onSignup={onSignup}
          onActivate={onActivate}
          innerCopy={innerCopy}
          outerCopy={outerCopy}
          mousedOver={mousedOver}
          deweyResult={deweyResult}
        />
      )}
    </div>
  );
}

export default RewardsActivation;
