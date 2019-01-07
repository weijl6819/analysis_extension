//console.log('executing connect_injected_script.js');

if (fdWebExtension) {
  if (fdWebExtension.fdInitializeApi) {
    fdWebExtension.fdInitializeApi();
  }

  if (fdWebExtension.fdConnect) {
    fdWebExtension.fdConnect();
  }
}