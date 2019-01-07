//console.log('executing disconnect_injected_script.js');

if (fdWebExtension) {
  if (fdWebExtension.fdDisconnect) {
    fdWebExtension.fdDisconnect();
  }
}