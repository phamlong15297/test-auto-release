const pingButton = document.getElementById('ping-button');
const pingResult = document.getElementById('ping-result');

pingButton?.addEventListener('click', () => {
  const response = window.sampleApi?.ping();
  pingResult.textContent = response
    ? `Main process responded with: ${response}`
    : 'The preload API is unavailable.';
});
