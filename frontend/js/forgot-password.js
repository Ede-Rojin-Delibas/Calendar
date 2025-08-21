document.addEventListener('DOMContentLoaded', () => {
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const loadingDiv = document.getElementById('loading');

    forgotPasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        
        if (!email) {
            alert('Lütfen e-posta adresinizi girin.');
            return;
        }

        try {
            // Show loading
            loadingDiv.classList.remove('hidden');
            
            console.log('Şifre sıfırlama talebi:', email);
            
            // API çağrısı
            const data = await forgotPassword(email);
            
            console.log('Şifre sıfırlama talebi başarılı:', data);
            
            // Success message
            alert('Şifre sıfırlama linki e-posta adresinize gönderildi. Lütfen e-posta kutunuzu kontrol edin.');
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } catch (error) {
            console.error('Şifre sıfırlama hatası:', error);
            
            let errorMessage = error.message;
            if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Sunucuya bağlanılamıyor. Lütfen backend sunucusunun çalıştığından emin olun.';
            } else if (error.message.includes('User not found')) {
                errorMessage = 'Bu e-posta adresi ile kayıtlı bir kullanıcı bulunamadı.';
            }
            
            alert(errorMessage);
        } finally {
            // Hide loading
            loadingDiv.classList.add('hidden');
        }
    });
});