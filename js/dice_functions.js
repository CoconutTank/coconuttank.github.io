
function helloWorld() {
  console.log("Hello World (via js)");
}

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('button');

  for (const button of buttons) {
    button.addEventListener('click', helloWorld);
  }
});  
