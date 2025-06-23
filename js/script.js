document.addEventListener('DOMContentLoaded', () => {
  const toggleDarkMode = document.getElementById('toggle-dark-mode');
  const body = document.body;

  // Restaurar tema guardado
  if (localStorage.getItem('modoOscuro') === 'true') {
    body.classList.add('dark-mode');
    toggleDarkMode.checked = true;
  }

  toggleDarkMode.addEventListener('change', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('modoOscuro', body.classList.contains('dark-mode'));
  });

  
});
