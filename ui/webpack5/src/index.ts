import App from './App.svelte';

console.log('running just fine...');

export function test() {
  console.log('running test function');
}

new App({
  target: document.body,
});
