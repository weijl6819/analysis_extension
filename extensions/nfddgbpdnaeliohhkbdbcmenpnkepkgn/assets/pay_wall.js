
var onParentMessage = function (e) {
    if (!e.data ||
        !e.data.src ||
        !e.data.event ||
        e.data.src !== 'NET')
        return;
    if (e.data.event === 'NET_load') {
        document.getElementById('NET_OK').style.display = 'none';
        document.getElementById('NET_PROCESSING_PAYMENT').style.display = 'none';
        document.getElementById('NET_CREDIT_USED').innerHTML = e.data.credits.creditUsed;
        document.getElementById('NET_CREDIT_TOTAL').innerHTML = e.data.credits.planCredit;
        document.getElementById('NET_PLAN_DESC').innerHTML = e.data.credits.planDesc;
        document.getElementById('NET_EXTNAME').innerHTML = e.data.extName + ': You\'re a power user!';
        window.NET_load_data = e.data;
    }
};
addEventListener('message', onParentMessage, false);


document.querySelector('.inboxsdk__modal_close').addEventListener('click', function (e) {
    parent.postMessage({
        src:        'NET',
        event:      'NET_close'
    }, '*');
});


document.getElementById('NET_STAY_FREE').addEventListener('click', function (e) {
    parent.postMessage({
        src:        'NET',
        event:      'NET_stayFree'
    }, '*');
});


var choosenStripePlan;
var checkCycle = function (e) {
    var id = e.target.id;
    document.getElementById(id).checked = true;
    var pricing = '$5/mo paid monthly';
    if (id === 'NET_CYCLE_MONTHLY') {
        choosenStripePlan = 'TTIp1';
    } else if (id === 'NET_CYCLE_ANNUAL') {
        choosenStripePlan = 'TTIp1A';
        pricing = '$4/mo paid annually';
    }
    document.getElementById('NET_PRICING_1').innerHTML = pricing;
};

document.getElementById('NET_CYCLE_MONTHLY').addEventListener('click', checkCycle);
document.getElementById('NET_CYCLE_ANNUAL').addEventListener('click', checkCycle);
checkCycle({target: {id: 'NET_CYCLE_ANNUAL'}});


var _stripeTokenReceived = function () {
    return function (stripeToken) {
        document.getElementById('NET_PROCESSING_PAYMENT').style.display = '';

        var payload = {
            client:         window.NET_load_data.client,
            token:          window.NET_load_data.token,
            stripeToken:    stripeToken,
            stripePlanId:   choosenStripePlan
        };
        simpleXHR({
            url:        window.NET_load_data.apis.pay_subscribe,
            payload:    payload
        }, function (status, response) {
            document.getElementById('NET_PROCESSING_PAYMENT').style.display = 'none';
            document.getElementById('NET_OK').style.display = '';
            document.getElementById('NET_PROCESSING_ERROR').style.display = '';
            document.getElementById('NET_PROCESSING_ERROR').innerHTML = '<i class="fa fa-check fa-fw"></i> Your payment was successful.';
            document.getElementById('NET_CHOOSE2').style.display = 'none';
            document.getElementById('NET_OK').addEventListener('click', function (e) {
                parent.postMessage({
                    src:        'NET',
                    event:      'NET_purchased'
                }, '*');
            });
        }, function (status, response) {
            document.getElementById('NET_PROCESSING_PAYMENT').style.display = 'none';
            document.getElementById('NET_PROCESSING_ERROR').style.display = '';
            document.getElementById('NET_PROCESSING_ERROR').innerHTML = '<i class="fa fa-close fa-fw"></i> Error: ' + response.error;
        });
    };
};


document.getElementById('NET_CHOOSE_PLAN').addEventListener('click', function (e) {

    document.getElementById('NET_STAY_FREE').style.display = 'none';
    document.getElementById('NET_CHOOSE_PLAN').style.display = 'none';

    var payload = {
        client:     window.NET_load_data.client,
        token:      window.NET_load_data.token
    };

    simpleXHR({
        url:        window.NET_load_data.apis.pay_plans,
        payload:    payload
    }, function (status, response) {

        var key = 'unlimited';
        document.getElementById('NET_PLANS').className = 'net_plans';

        var stripeHandler = StripeCheckout.configure({
            key:    window.NET_load_data.stripeKey,
            email:  response.user.email,
            locale: 'auto',
            token:  _stripeTokenReceived()
        });

        var _planChosen = function (num) {
            return function (e) {
                var table = document.getElementById('NET_PLANS');
                // for (var i = 1; i < table.children[0].children.length - 1; i++) {
                //     var c = table.children[0].children[i].children[1].className;
                //     c = c.replace('net-plans-selected', '');
                //     table.children[0].children[i].children[1].className = c;
                //     c = table.children[0].children[i].children[2].className;
                //     c = c.replace('net-plans-selected', '');
                //     table.children[0].children[i].children[2].className = c;
                //     table.children[0].children[i].children[num].className += ' net-plans-selected';
                // }
                document.getElementById('NET_PROCESSING_ERROR').style.display = 'none';
                document.getElementById('NET_PROCESSING_ERROR').innerHTML = '';
                var amountNum = 0;
                for (var k in response.plans) {
                    if (response.plans.hasOwnProperty(k) &&
                        response.plans[k].stripeId === choosenStripePlan)
                        amountNum = response.plans[k].amountNum;
                }
                stripeHandler.open({
                    name:           window.NET_load_data.extName,
                    description:    'Support us by subscribing!',
                    amount:         amountNum
                });
            };
        };
        document.getElementById('NET_CHOOSE2').addEventListener('click', _planChosen(2));

    });

});
