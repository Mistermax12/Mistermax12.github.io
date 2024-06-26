document.querySelector('.claim-button').addEventListener('click', function() {
  alert('Claim button clicked!');
});

document.querySelectorAll('.circle-button').forEach(button => {
  button.addEventListener('click', function() {
    alert(`${button.textContent} button clicked!`);
  });
});

