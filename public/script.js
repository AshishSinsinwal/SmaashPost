document.addEventListener("DOMContentLoaded", function() {
  const usernameInput = document.getElementById('user');
  const usernameCount = document.getElementById('username-count');
  
  if (usernameInput && usernameCount) { 
    usernameInput.addEventListener('input', function() {
      const remaining = 15 - this.value.length;
      usernameCount.textContent = remaining;
      
      if (remaining < 3) {
        usernameCount.style.color = '#e74c3c'; 
        usernameCount.style.color = '';
      }
    });
  }



        const validationRules = {
            title: {
                minLength: 3,
                maxLength: 100,
                required: true
            },
            content: {
                minLength: 10,
                required: true
            }
        };


        const form = document.getElementById('from-authenticate');
        const titleInput = document.getElementById('title');
        const contentInput = document.getElementById('content');
        const submitBtn = document.getElementById('submitBtn');
        

        const titleError = document.getElementById('titleError');
        const contentError = document.getElementById('contentError');
        

        const titleCounter = document.getElementById('titleCounter');
        const contentCounter = document.getElementById('contentCounter');


        function validateTitle() {
            const value = titleInput.value.trim();
            const rules = validationRules.title;
            
            titleCounter.textContent = `${value.length}/${rules.maxLength} characters`;
            
            if (value.length === 0) {
                showError(titleInput, titleError, 'Title is required');
                return false;
            } else if (value.length < rules.minLength) {
                showError(titleInput, titleError, `Title must be at least ${rules.minLength} characters`);
                return false;
            } else if (value.length > rules.maxLength) {
                showError(titleInput, titleError, `Title cannot exceed ${rules.maxLength} characters`);
                return false;
            } else {
                showSuccess(titleInput, titleError);
                return true;
            }
        }

        function validateContent() {
            const value = contentInput.value.trim();
            const rules = validationRules.content;
            
            contentCounter.textContent = `${value.length} characters (minimum ${rules.minLength})`;
            
            if (value.length === 0) {
                showError(contentInput, contentError, 'Content is required');
                return false;
            } else if (value.length < rules.minLength) {
                showError(contentInput, contentError, `Content must be at least ${rules.minLength} characters`);
                return false;
            } else {
                showSuccess(contentInput, contentError);
                return true;
            }
        }

        function showError(input, errorElement, message) {
            input.classList.remove('input-valid');
            input.classList.add('input-invalid');
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }

        function showSuccess(input, errorElement) {
            input.classList.remove('input-invalid');
            input.classList.add('input-valid');
            errorElement.classList.remove('show');
        }

        function updateSubmitButton() {
            const isTitleValid = validateTitle();
            const isContentValid = validateContent();
            
            if (isTitleValid && isContentValid) {
                submitBtn.disabled = false;
            } else {
                submitBtn.disabled = true;
            }
        }


        titleInput.addEventListener('input', updateSubmitButton);
        titleInput.addEventListener('blur', updateSubmitButton);
        
        contentInput.addEventListener('input', updateSubmitButton);
        contentInput.addEventListener('blur', updateSubmitButton);


        updateSubmitButton();


        form.addEventListener('submit', function(e) {
            updateSubmitButton();
            if (submitBtn.disabled) {
                e.preventDefault();
                alert('Please fix the validation errors before submitting.');
            }
        });



});