import { common } from './common';

interface ExtendedWindow extends Window { decodeURIComponent(s: string): string; }
declare var window: ExtendedWindow;

export class Uri {
    public source: string;
    public protocol: string;
    public host: string;
    public port: string;
    public query: string;
    public params: { [key: string]: string };
    public hash: string;
    public hashParams: { [key: string]: string };
    public path: string;
    public segments: string[];

    public static parse(url: string): Uri {
        var uri = new Uri();

        let a = document.createElement('a');
        a.href = url;

        uri.source = url;
        uri.protocol = a.protocol.replace(':', '');
        uri.host = a.hostname;
        uri.port = a.port;
        uri.query = a.search;
        uri.params = Uri.parseParams(uri.query);
        uri.hash = a.hash.replace('#', '');
        uri.hashParams = Uri.parseParams(uri.hash);
        uri.path = a.pathname.charAt(0) === '/' ? a.pathname.substring(1) : a.pathname;
        uri.segments = uri.path.split('/');

        return uri;
    }

    private static parseParams(query: string): { [key: string]: string } {
        let result: { [key: string]: string } = {};
        let segments = query.replace('?', '').split('&');
        let len = segments.length;
        for (let i = 0; i < len; i++) {
            if (!segments[i]) {
                continue;
            }
            let parts = segments[i].split('=');
            result[window.decodeURIComponent(parts[0])] = window.decodeURIComponent(parts[1]);
        }
        return result;
    }
}

export module browserHelpers {

    export function getActiveTabUrl(): Promise<Uri> {
        return getActiveTab().then(tab => {
            return Uri.parse(tab.url);
        });
    }

    export function getActiveTab(): Promise<chrome.tabs.Tab> {
        return new Promise<any>((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                //workaround for debugging - while debugging if we lose focus we can no longer find the active tab
                //so we store the last used tab id and use it if we can't find the active tab
                if (tabs.length > 0) {
                    common.Globals.TabId = tabs[0].id;
                    resolve(tabs[0]);
                    return;
                }

                chrome.tabs.get(common.Globals.TabId, tab => {
                    if (!tab) {
                        reject("active tab not found");
                    }

                    resolve(tab);
                });
            });
        });
    }

    export function openTab(url: string): Promise<chrome.tabs.Tab> {
        return new Promise<chrome.tabs.Tab>((resolve, reject) => {
            chrome.tabs.create({ url: url }, t => { resolve(t); });
        });
    }

    export function openSettings() {
        let settingsUrl = chrome.extension.getURL("settings.html");
        browserHelpers.openTab(settingsUrl);
    }

    export function getOrOpenTab(url: string): Promise<chrome.tabs.Tab> {
        let uri = Uri.parse(url);
        return getTab(uri).then(tab => tab, () => openTab(url));
    }

    export function getTab(uri: Uri): Promise<chrome.tabs.Tab> {
        return new Promise<any>((resolve, reject) => {
            chrome.tabs.query({}, (tabs) => {
                let tab = tabs.find((tab: chrome.tabs.Tab) => {
                    let tabUri = Uri.parse(tab.url);
                    var isMatch = tabUri.protocol == uri.protocol
                        && tabUri.host == uri.host
                        && tabUri.path == uri.path;

                    for (let param in uri.params) {
                        isMatch = isMatch && tabUri.params[param] === uri.params[param];
                    }

                    return isMatch;
                });

                if (tab) {
                    resolve(tab);
                }
                else {
                    reject();
                }
            });
        });
    }


}

