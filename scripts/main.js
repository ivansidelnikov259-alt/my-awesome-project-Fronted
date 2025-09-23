const dlg = document.getElementById('contact-dialog');
const openBtn = document.getElementById('feedback__open-dialog');
const closeBtn = document.getElementById('form-actions__close-dialog');
const form = document.getElementById('contact-form');
const phone = document.getElementById('phone'); 
let lastActive = null;

openBtn.addEventListener('click', () => {
    lastActive = document.activeElement;
    dlg.showModal(); // Модальный режим + затемнение
    dlg.querySelector('input,select,textarea,button'?.focus());
});

closeBtn.addEventListener('click', () => dlg.close('cancel'));

phone?.addEventListener('input', () => { 
    const digits = phone.value.replace(/\D/g, '').slice(0,11); // Можно ввести номер исключительно до 11 цифр 
    const d = digits.replace(/^8/, '7');                       // Нормализуем с 8 на 7 
    const parts = [];

    if (d.length > 0) parts.push('+7'); 
    if (d.length > 1) parts.push(' (' + d.slice(1,4)); 
    if (d.length >= 4) parts[parts.length - 1] += ')'; 
    if (d.length >= 5) parts.push(' ' + d.slice(4,7)); 
    if (d.length >= 8) parts.push('-' + d.slice(7,9)); 
    if (d.length >= 10) parts.push('-' + d.slice(9,11)); 
    phone.value = parts.join(''); 
});

form?.addEventListener('submit', (e) => {
    // Сброс кастомных сообщений
    [...form.elements].forEach(el => el.setCustomValidity?.(''));

    // Проверка встроенных ограничений
    if (!form.checkValidity()) {
        e.preventDefault();

        // Таргетированное сообщение
        const email = form.elements.email;
        if (email?.validity.typeMismatch) {
            email.setCustomValidity('Введите корректный e-mail, например name@example.com');
        }
        form.reportValidity(); // Показать браузерные подсказки

        // Подсветка проблемных полей 
        [...form.elements].forEach(el => {
            el.setAttribute("aria-invalid", "true");
            if (el.willValidate) el.toggleAttribute('aria-invalid', !el.checkValidity()); 
        }); 
        return; 
    }

    // Успешная отправка формы
    e.preventDefault();
    document.getElementById('contact-form')?.close('success');
    form.reset();
});

dlg.addEventListener('close', () => { lastActive?.focus(); }); // закрытие <dialog>