const modal = document.getElementById('modal');
const button = document.getElementById('confirm-button');
button.addEventListener('click', () => {
    modal.style.display = 'flex';
});

const modalMessage = document.getElementById('modal-message');  
modalMessage.textContent = `Passagem comprada com sucesso!`;

const closeModal = document.getElementById('close-modal');
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });
