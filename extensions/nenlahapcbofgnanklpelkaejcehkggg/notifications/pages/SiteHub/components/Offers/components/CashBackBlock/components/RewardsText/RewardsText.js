import {React} from 'utility/css-ns';

function RewardsText({reward, storeName}) {
  return (
    <div>
      {reward.type === 'percentage' ? (
        <h2>
          Get <span className="green">{reward.amount / 100}%</span> back
        </h2>
      ) : (
        <h2>
          Get <span className="green">${reward.amount / 100}</span> in credit
        </h2>
      )}
      <h4 className="bold">on {storeName}.</h4>
    </div>
  );
}

export default RewardsText;
