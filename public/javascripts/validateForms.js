// Function for disabling form submissions if there are 
// invalid fields 

(function () {
'use strict'

// Fetch all the forms we want to apply custom Bootstrap validation styles to
const forms = document.querySelectorAll('.validated-form')

// Loop over the forms and prevent submission (if not valid)
Array.from(forms) // 'make an array from forms'
    .forEach(function (form) {
    form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
        }
        form.classList.add('was-validated')
    }, false)
    })
})()

