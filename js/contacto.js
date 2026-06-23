document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (!form) return;

  // Campos requeridos
  const requiredFields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    subject: document.getElementById('subject'),
    message: document.getElementById('message')
  };

  // Validar email
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Mostrar error
  function showError(fieldName, message) {
    const field = requiredFields[fieldName];
    const errorEl = document.getElementById(`${fieldName}-error`);
    if (field && errorEl) {
      field.classList.add('error');
      errorEl.textContent = message;
      errorEl.classList.add('show');
    }
  }

  // Limpiar error
  function clearError(fieldName) {
    const field = requiredFields[fieldName];
    const errorEl = document.getElementById(`${fieldName}-error`);
    if (field && errorEl) {
      field.classList.remove('error');
      errorEl.textContent = '';
      errorEl.classList.remove('show');
    }
  }

  // Validar campo en tiempo real
  Object.values(requiredFields).forEach((field) => {
    if (field) {
      field.addEventListener('blur', () => {
        const fieldName = field.id;
        const value = field.value.trim();

        if (!value) {
          showError(fieldName, 'Este campo es requerido');
        } else if (fieldName === 'email' && !isValidEmail(value)) {
          showError(fieldName, 'Por favor ingresa un email válido');
        } else {
          clearError(fieldName);
        }
      });

      // Limpiar error al escribir
      field.addEventListener('input', () => {
        const fieldName = field.id;
        clearError(fieldName);
      });
    }
  });

  // Envío del formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Limpiar errores previos
    Object.keys(requiredFields).forEach(clearError);

    // Validar todos los campos
    let isValid = true;

    // Validar nombre
    const name = requiredFields.name.value.trim();
    if (!name) {
      showError('name', 'Por favor ingresa tu nombre');
      isValid = false;
    } else if (name.length < 3) {
      showError('name', 'El nombre debe tener al menos 3 caracteres');
      isValid = false;
    }

    // Validar email
    const email = requiredFields.email.value.trim();
    if (!email) {
      showError('email', 'Por favor ingresa tu email');
      isValid = false;
    } else if (!isValidEmail(email)) {
      showError('email', 'Por favor ingresa un email válido');
      isValid = false;
    }

    // Validar asunto
    const subject = requiredFields.subject.value.trim();
    if (!subject) {
      showError('subject', 'Por favor ingresa un asunto');
      isValid = false;
    } else if (subject.length < 5) {
      showError('subject', 'El asunto debe tener al menos 5 caracteres');
      isValid = false;
    }

    // Validar mensaje
    const message = requiredFields.message.value.trim();
    if (!message) {
      showError('message', 'Por favor ingresa un mensaje');
      isValid = false;
    } else if (message.length < 10) {
      showError('message', 'El mensaje debe tener al menos 10 caracteres');
      isValid = false;
    }

    // Si todo es válido, procesar el formulario
    if (isValid) {
      // Simular envío (aquí iría una llamada a un servidor real)
      const submitBtn = form.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;

      // Simular delay de envío
      setTimeout(() => {
        // Aquí iría la lógica de envío real (fetch a un backend)
        console.log('Formulario enviado:', {
          name,
          email,
          phone: document.getElementById('phone').value.trim(),
          subject,
          message
        });

        // Mostrar mensaje de éxito
        formSuccess.style.display = 'block';

        // Resetear formulario
        form.reset();

        // Restaurar botón
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Ocultar mensaje de éxito después de 5 segundos
        setTimeout(() => {
          formSuccess.style.display = 'none';
        }, 5000);

        // Hacer scroll hacia el mensaje de éxito
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 1000);
    } else {
      // Hacer scroll al primer error
      const firstError = document.querySelector('.form-error.show');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
});
