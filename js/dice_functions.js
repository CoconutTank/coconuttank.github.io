
function helloWorld() {
  console.log("Hello World (via js)!");
}

function createParagraph() {
  const para = document.createElement('p');
  para.textContent = 'You clicked a button!';
  document.body.appendChild(para);
}

document.addEventListener('DOMContentLoaded', () => {
  const hello_world_buttons = document.querySelectorAll('hello_world_button');
  const paragraph_buttons = document.querySelectorAll('button');

  for (const button of hello_world_buttons) {
    button.addEventListener('click', helloWorld);
  }

  for (const button of paragraph_buttons) {
    button.addEventListener('click', createParagraph);
  }
});  
