document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    
    // Password visibility toggle - daha basit ve güvenilir yaklaşım
    function initPasswordToggle() {
        const togglePasswordBtn = document.getElementById("toggle-password");
        const passwordInput = document.getElementById("password");
        const eyeClosedIcon = document.getElementById("eye-closed");
        const eyeOpenIcon = document.getElementById("eye-open");
        
        console.log("Register Password Toggle Elements:", {
            toggleBtn: !!togglePasswordBtn,
            passwordInput: !!passwordInput,
            eyeClosed: !!eyeClosedIcon,
            eyeOpen: !!eyeOpenIcon
        });
        
        if (togglePasswordBtn && passwordInput && eyeClosedIcon && eyeOpenIcon) {
            // Click event'i direkt olarak ekle
            togglePasswordBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log("Toggle button clicked!");
                
                const isCurrentlyPassword = passwordInput.type === "password";
                console.log("Current password type:", passwordInput.type);
                
                if (isCurrentlyPassword) {
                    // Şifreyi göster
                    passwordInput.type = "text";
                    eyeClosedIcon.style.display = "none";
                    eyeOpenIcon.style.display = "block";
                    console.log("Password shown");
                } else {
                    // Şifreyi gizle
                    passwordInput.type = "password";
                    eyeClosedIcon.style.display = "block"; 
                    eyeOpenIcon.style.display = "none";
                    console.log("Password hidden");
                }
                
                return false;
            };
            
            console.log("Password toggle initialized successfully!");
        } else {
            console.error("Password toggle elements not found!");
        }
    }
    
    // Hemen initialize et
    initPasswordToggle();
    
    // Biraz bekleyip tekrar dene (eğer elementler henüz hazır değilse)
    setTimeout(initPasswordToggle, 100);
    
    // Global fonksiyon - inline onclick için backup
    window.togglePasswordVisibility = function() {
        console.log("Global togglePasswordVisibility called!");
        const passwordInput = document.getElementById("password");
        const eyeClosedIcon = document.getElementById("eye-closed");
        const eyeOpenIcon = document.getElementById("eye-open");
        
        if (passwordInput && eyeClosedIcon && eyeOpenIcon) {
            const isCurrentlyPassword = passwordInput.type === "password";
            
            if (isCurrentlyPassword) {
                passwordInput.type = "text";
                eyeClosedIcon.style.display = "none";
                eyeOpenIcon.style.display = "block";
            } else {
                passwordInput.type = "password";
                eyeClosedIcon.style.display = "block";
                eyeOpenIcon.style.display = "none";
            }
            
            console.log("Password toggled to:", passwordInput.type);
        }
    };

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        try {
            const data = await registerUser(username, email, password);
            alert(data.message || 'Kayıt başarılı! Lütfen giriş yapın.');
            // Kayıt sonrası giriş sayfasına yönlendir
            window.location.href = 'login.html';
        } catch (error) {
            alert(error.message);
        }
    });
});
