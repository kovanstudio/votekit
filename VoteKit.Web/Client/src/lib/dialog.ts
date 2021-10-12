export function confirmDialog(message) {
  return new Promise((res) => {
    res(window.confirm(message));
  });
}
