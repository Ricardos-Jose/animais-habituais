export default function debounce(callback, delay) {
  let timer = 0;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      console.log('teste');
      callback(...args);
      timer = null;
    }, delay);
  };
}
