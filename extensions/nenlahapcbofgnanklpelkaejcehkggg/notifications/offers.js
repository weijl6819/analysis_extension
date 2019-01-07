import initSite from 'content/utility/getSite';
import setBrowserAction from 'messenger/outbound/setBrowserAction';
import tree from 'state';

initSite();
setBrowserAction({active: true});
