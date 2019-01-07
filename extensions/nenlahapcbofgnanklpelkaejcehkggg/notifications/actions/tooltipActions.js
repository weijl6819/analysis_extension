import tree from 'state';
export function toggleTooltip(id) {
  tree.set('tooltip', {active: id});
}
