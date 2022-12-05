
function consolePrint() {
  console.log("Hello World (via js)!");
}

function createParagraph() {
  const para = document.createElement('p');
  para.textContent = 'You clicked a button!';
  document.body.appendChild(para);
}

document.addEventListener('DOMContentLoaded', () => {
  const console_buttons = document.querySelectorAll('console_button');
  const paragraph_buttons = document.querySelectorAll('paragraph_button');

  for (const console_button of console_buttons) {
    console_button.addEventListener('click', consolePrint);
  }

  for (const paragraph_button of paragraph_buttons) {
    paragraph_button.addEventListener('click', createParagraph);
  }
});  
