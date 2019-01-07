export default function getVersion() {
  return chrome.runtime.getManifest().version;
}
