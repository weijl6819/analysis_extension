import Baobab from 'baobab';

let baobab = Baobab;

if (window.Baobab) {
  baobab = window.Baobab;
} else {
  window.Baobab = Baobab;
}

export default baobab;
