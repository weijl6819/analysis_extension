import OptionPage from './optionPage.js';
export default class OptionAuth {
    authenticate(evt) {
        let passwordInput = document.getElementById('passwordInput');
        if (passwordInput.value == this.password) {
            this.authenticated = true;
            OptionPage.closeModal('passwordModal');
            OptionPage.show(document.getElementById('main'));
            OptionPage.hideInputError(passwordInput);
        }
        else {
            OptionPage.showInputError(passwordInput);
        }
    }
    constructor(password) {
        this.password = password;
        this.authenticated = false;
    }
    setPassword(optionPage) {
        var password = document.getElementById('setPassword');
        optionPage.cfg.password = password.value;
        optionPage.saveProp('password');
        password.value = '';
        this.setPasswordButton(optionPage);
    }
    setPasswordButton(optionPage) {
        let passwordText = document.getElementById('setPassword');
        let passwordBtn = document.getElementById('setPasswordBtn');
        if (optionPage.cfg.password) { // Password already set
            OptionPage.enableBtn(passwordBtn);
            if (passwordText.value) { // Password field filled
                passwordBtn.innerText = 'SET';
            }
            else { // Empty password field
                passwordBtn.innerText = 'REMOVE';
            }
        }
        else { // Password not already set
            passwordBtn.innerText = 'SET';
            if (passwordText.value) { // Password field filled
                OptionPage.enableBtn(passwordBtn);
            }
            else { // Empty password field
                OptionPage.disableBtn(passwordBtn);
            }
        }
    }
}
