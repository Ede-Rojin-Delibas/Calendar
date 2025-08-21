document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    
    // Password visibility toggle - daha basit ve güvenilir yaklaşım
    function initPasswordToggle() {
        const togglePasswordBtn = document.getElementById("toggle-password");
        const passwordInput = document.getElementById("password");
        const eyeClosedIcon = document.getElementById("eye-closed");
        const eyeOpenIcon = document.getElementById("eye-open");
        
        console.log("Login Password Toggle Elements:", {
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

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Formun sayfayı yenilemesini engelle
    
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            console.log('Giriş denemesi:', email);
            const data = await loginUser(email, password);
            console.log('Giriş başarılı:', data);
            
            // Başarılı girişte token'ı ve kullanıcı bilgilerini tarayıcı hafızasında sakla
            localStorage.setItem("authToken", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));
            
            console.log('Token ve kullanıcı bilgileri kaydedildi');
            
            // Ana takvim sayfasına yönlendir
            window.location.href = "index.html";
        } catch (error) {
            console.error('Giriş hatası:', error);
            
            // Daha detaylı hata mesajı
            let errorMessage = error.message;
            if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Sunucuya bağlanılamıyor. Lütfen backend sunucusunun çalıştığından emin olun.';
                console.log('API Base URL:', 'http://127.0.0.1:5002/api');
            } else if (error.message.includes('Bad email or password')) {
                errorMessage = 'E-posta veya şifre hatalı. Test için: test@test.com / test123';
            }
            
            alert(errorMessage);
        }
    });
});
