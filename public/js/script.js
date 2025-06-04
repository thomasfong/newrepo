// document.querySelector(".menu-toggle").addEventListener("click", function () {
//     document.querySelector(".nav-bar").classList.toggle("active");
// });

// document.querySelector("button").addEventListener("click", function () {
//     alert("Congratulations! You've selected the DMC Delorean.");
// });

   // Password toggle functionality
   const togglePassword = document.getElementById('togglePassword');
   const passwordInput = document.getElementById('account_password');
   togglePassword.addEventListener('click', function() {
       const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
       passwordInput.setAttribute('type', type);
       this.textContent = type === 'password' ? 'Show Password' : 'Hide Password';
   });