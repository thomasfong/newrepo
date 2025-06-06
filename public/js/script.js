// document.querySelector(".menu-toggle").addEventListener("click", function () {
//     document.querySelector(".nav-bar").classList.toggle("active");
// });

// document.querySelector("button").addEventListener("click", function () {
//     alert("Congratulations! You've selected the DMC Delorean.");
// });


// TOGGLE BUTTON 
document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggleButton');
    const navMenu = document.getElementById('navMenu');

    toggleButton.addEventListener('click', function () {
      navMenu.classList.toggle('show');
      this.innerHTML = navMenu.classList.contains('show')
        ? '<i class="fa fa-x"></i>'
        : '<i class="fa fa-bars"></i>';
    });
  });
   // Password toggle functionality
   const togglePassword = document.getElementById('togglePassword');
   const passwordInput = document.getElementById('account_password');
   togglePassword.addEventListener('click', function() {
       const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
       passwordInput.setAttribute('type', type);
       this.textContent = type === 'password' ? 'Show Password' : 'Hide Password';
   });