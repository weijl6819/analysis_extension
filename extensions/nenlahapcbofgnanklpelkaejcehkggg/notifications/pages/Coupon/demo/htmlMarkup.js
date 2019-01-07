export default function htmlMarkup() {
  return `
          <div id="subContainer">
            <form id="frmOrderReview" name="frm_order_review" method="POST" action="https://www.jcrew.com/checkout2/review.jsp">
              <section class="checkout-container">
                <div id="breadCrumbs">
                  <ul class="crumbs clearfix">
                    <li id="nav-shipping" class="crumbs-item "><a href="/checkout2/shipping.jsp" class="crumbs-link" name="&amp;lpos=progress">Shipping Address</a></li>
                    <li id="nav-method" class="crumbs-item"><a href="/checkout2/shippingmethod.jsp" class="crumbs-link" name="&amp;lpos=progress">Shipping &amp; Gift Options</a></li>
                    <li id="nav-billing" class="crumbs-item "><a href="/checkout2/billing.jsp" class="crumbs-link" name="&amp;lpos=progress">Billing</a></li>
                    <li id="nav-review" class="crumbs-item is-current-item ">Review<span class="crumbs-progress">4 of 4</span></li>
                  </ul>
                </div>
                <h2 id="confirmOrder" class="page-msg">Please confirm your order</h2>
                <div id="billing-details" class="clearfix">
                  <h2 class="page-subtitle">
                    Billing Details
                    <a href="/checkout2/billing.jsp" class="item-button item-change" name="&amp;lpos=change">Change</a>
                  </h2>
                  <div class="payment-cards first-card-address clearfix">
                    <div class="payment-method first-card same-billing last">
                      <input type="hidden" name="bmHidden" value="CREDIT_CARD_ARRAY<>cardVerifyNum"><input type="hidden" name="CREDIT_CARD_ARRAY<>cardVerifyNum" value="222">
                      <div class="wallet notranslate">
                        <div class="wallet-cards">
                          <span class="wallet-brand wallet-line">Visa</span>
                          <span class="wallet-line">
                          <span class="wallet-cardnumber">**********4242</span>
                          <span class="wallet-card credit-card-icon cc-visa-id"></span>
                          </span>
                          <span class="wallet-expiration wallet-line">
                          05 / 22
                          </span>
                          <span class="wallet-name wallet-line">Wikibuy Saver</span>
                          <span class="wallet-price wallet-line">  $118.00</span>
                        </div>
                      </div>
                      <div class="clearfix"></div>
                    </div>
                    <div class="billing-address notranslate">
                      Wikibuy Saver<br>3030 Saving Ave<br>Austin, TX 78733-2220<br>United States<br>5123940404
                      <br>
                      saver@wikibuy.com
                    </div>
                  </div>
                </div>
                <div id="shipping-details" class="clearfix">
                  <h2 class="page-subtitle">
                    Shipping Details
                    <a href="/checkout2/shipping.jsp" class="item-button item-change" name="&amp;lpos=change">Change</a>
                  </h2>
                  <div class="shipping-address notranslate">
                    Wikibuy Saver<br>3030 Saving Ave<br>Austin, TX 78733-2220<br>United States<br>5123940404
                  </div>
                  <div class="shipping-method notranslate">
                    Economy  –
                    Delivered on or before
                    <b>Thursday</b><br>
                    <span class="shipping-price notranslate">  $0.00</span>
                  </div>
                </div>
                <div id="gifting-details" class="clearfix">
                  <h2 class="page-subtitle">
                    Gift Options
                    <a href="/checkout2/shippingmethod.jsp" class="item-button item-change" name="&amp;lpos=change">Change</a>
                  </h2>
                  <div class="gifting-options">
                    <div class="options-none">
                      <span class="gifting-type">
                      No gift options have been selected
                      </span>
                    </div>
                  </div>
                </div>
                <div id="order-listing">
                  <h2 class="page-subtitle">
                    Items (1)
                    <a href="/checkout2/shoppingbag.jsp" class="item-button item-change" name="&amp;lpos=change">Change</a>
                  </h2>
                  <div class="item-row clearfix">
                      <div class="item-image">
                        <img src="https://www.jcrew.com/s7-img-facade/E3680_EF5354?$bag_tn150$" alt="" width="150" height="150" border="0" class="item-img">          
                      </div>
                      <div class="item-row-multi clearfix">
                        <div class="item-product">
                          <h3 class="item-name notranslate">
                            Irving sunglasses        
                          </h3>
                          <ul class="item-description">
                            <li class="item-label">Item <span class="item-value notranslate">E3680</span></li>
                            <li class="item-label">Size: <span class="item-value notranslate">ONE SIZE</span></li>
                            <li class="item-label">Color: <span class="item-value notranslate">SOFT TORTOISE</span></li>
                            <li class="item-status js-orderitem-stock-display" id="js-orderitem-stock-display1">
                              In Stock 
                              <span class="item-value"></span>
                            </li>
                          </ul>
                        </div>
                        <div class="item-group-price notranslate">
                          <div class="item-price">
                            $118.00
                          </div>
                          <div class="item-multiplier">x</div>
                          <div class="item-quantity">
                            <span class="item-quantity-amount">1</span>
                          </div>
                          <div class="item-total">  $118.00</div>
                        </div>
                      </div>
                    </div>
                </div>
              </section>
              <aside id="checkoutSlider">
                <div id="slidertrack" class="slider-top">
                  <div class="slider">
                    <div class="slider-wrapper">
                      <div id="order-summary" class="monetate-LargerPlaceOrder">
                        <div id="orderSummaryContainer" class="summary-container">
                          <h2 class="page-subtitle">Summary</h2>
                          <ul class="summary clearfix">
                            <li class="summary-item summary-subtotal clearfix">
                              <span class="summary-label">SUBTOTAL </span>
                              <span class="summary-value notranslate">  $118.00</span>
                            </li>
                            <li class="summary-item summary-shipping clearfix">
                              <span class="summary-label">Shipping</span>
                              <span class="summary-value notranslate">  $0.00</span>
                            </li>
                            <li class="summary-item clearfix">
                              <span class="summary-label">Tax</span>
                              <span class="summary-value notranslate">  $0.00</span>
                            </li>
                            <input type="hidden" name="bmEditable" value="jc_country"><input type="hidden" name="bmHidden" value="jc_country"><input name="jc_country" id="jc_country" value="US" type="hidden">
                            <li class="summary-item summary-total clearfix">
                              <span class="summary-label">Total</span>
                              <span class="summary-value notranslate">  $118.00</span>
                            </li>
                          </ul>
                          <div class="button-actions">
                            <a data-bma="submit_order" data-jsfunction="isValidReview" data-settimeout="true" href="#;" class="item-link-submit button-general button-submit-bg off-monetateLPO">Place My Order</a>
                          </div>
                        </div>
                        <div class="on-monetateLPO">
                          <a id="button-submitorder" data-bma="submit_order" data-jsfunction="isValidReview" data-settimeout="true" href="#;" class="item-link-submit button-general button-submit-bg">
                            Place My Order 
                            <div class="arrow-right">&nbsp;</div>
                          </a>
                          <div class="tou-pp">By placing your order, you agree to our <a href="/help/terms_of_use.jsp" target="_blank">Terms of Use</a> and <a href="/help/privacy_policy.jsp" target="_blank">Privacy Policy</a>.</div>
                        </div>
                      </div>
                      <div id="promoCodeContainer" class="module-section">
                        <div id="summary-promo-header" class="module-header clearfix">
                          <h3 class="module-headline">Have a promo code?</h3>
                          <span id="hasPromo" class="module-closed"></span>
                        </div>
                        <div id="summary-promo-form" class="module-content clearfix">
                          <input type="hidden" name="bmText" value="promotionCode1"><input type="text" data-textboxid="promoCode" data-optfield="true" data-marginbottom="10" name="promotionCode1" id="promotionCode1" placeholder="Promo Code" autocorrect="off" class="textbox-wide textbox-manager" maxlength="19" aria-label="promo code">
                          <div class="giftcard-warning">
                          </div>
                          <a id="promoApply" data-bma="add_promo_code_update_order" data-jsfunction="isValidPromo" data-settimeout="true" href="javascript:CheckOutPage.applyDiscount('promoApply');" class="item-button discount-apply" aria-label="apply">Apply</a>
                        </div>
                      </div>
                      <div id="giftCardContainer" class="module-section">
                        <div id="summary-gift-card-header" class="module-header clearfix">
                          <h3 class="module-headline">Gift or Rewards Card?</h3>
                          <span id="hasGiftCard" class="module-closed"></span>
                        </div>
                        <div id="summary-gift-card-form" class="module-content clearfix">
                          <input type="hidden" name="bmText" value="ACCOUNT<>accountNumber"><input type="text" data-textboxid="giftCard" data-isfirstgroup="true" data-optfield="true" data-marginbottom="5" name="ACCOUNT<>accountNumber" id="giftCard" placeholder="Gift Card Number" autocorrect="off" class="textbox textbox-manager" pattern="[0-9]*" maxlength="19" aria-label="gift card number">
                          <input type="hidden" name="bmText" value="ACCOUNT<>pinNumber"><input type="text" data-textboxid="giftCardPin" name="ACCOUNT<>pinNumber" id="giftCardPin" placeholder="PIN" autocorrect="off" class="form-input textbox-manager" pattern="[0-9]*" maxlength="4">
                          <a id="giftApply" data-bma="apply_gift_card_update_order" data-jsfunction="isValidGiftCard" data-settimeout="true" href="javascript:CheckOutPage.applyDiscount('giftApply');" class="item-button discount-apply" aria-label="apply">Apply</a>
                        </div>
                      </div>
                      <div id="help-header" class="module-section">
                        <div class="module-header clearfix" style="cursor: default;">
                          <div class="help-modules clearfix">
                            <h3 class="module-headline">Have a Question?</h3>
                            <div class="help-phone">
                              800 562 0258
                            </div>
                            <div id="lpButtonCart" class="help-chat">
                              <div id="LPMcontainer-1515451489702-0" class="LPMcontainer LPMoverlay" role="button" tabindex="0" style="margin: 0px; padding: 0px; border-style: solid; border-width: 0px; font-style: normal; font-weight: normal; font-variant: normal; list-style: none outside none; letter-spacing: normal; line-height: normal; text-decoration: none; vertical-align: baseline; white-space: normal; word-spacing: normal; background-repeat: repeat-x; background-position: left bottom; cursor: auto; display: block; position: relative; top: 0px; left: 0px;">
                                <div><img id="lp_footerButtonImg" src="https://images.jcrew.com/fsi/livechat/button2/cart/repoffline.gif"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="module-content clearfix">
                          <a href="#" class="item-link item-first">What is your return policy?</a>
                          <a href="#" class="item-link item-middle">When can I expect my order?</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
              <input type="hidden" name="bmFields" value="bmText,bmEditable,bmPrevTemplate,bmForm,bmIsForm,bmUID,bmHidden,bmArch,bmFormID">
            </form>
          </div>
    `;
}
