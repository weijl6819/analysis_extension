import {branch as ogBranch, root as ogRoot} from 'baobab-react/higher-order';

let branch = ogBranch;
let root = ogRoot;
if (window.branch) {
  branch = window.branch;
  root = window.root;
} else {
  window.branch = branch;
  window.root = root;
}

export {branch, root};
