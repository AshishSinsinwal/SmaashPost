// Character counter for username
        const usernameInput = document.getElementById('user');
        const usernameCount = document.getElementById('username-count');
        
        usernameInput.addEventListener('input', function() {
            const remaining = 10 - this.value.length;
            usernameCount.textContent = remaining;
            
            if (remaining < 3) {
                usernameCount.style.color = '#e74c3c';
            } else {
                usernameCount.style.color = '';
            }
        });