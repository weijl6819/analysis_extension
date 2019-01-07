import createCssNs from 'css-ns';
import {default as RealReact} from 'react';

const cssConfig = createCssNs({
  namespace: 'wbext',
  React: RealReact,
  exclude: /^icon-/
});

export const React = cssConfig.React;
