const API = 'http://localhost:5000/api';

// Handle Contact Form
document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;
  const alertBox = document.getElementById('formAlert');

  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  const formData = {
    name: form.fullName.value,
    email: form.email.value,
    mobile: form.mobile.value,
    city: form.city.value
  };

  try {
    const res = await fetch(`${API}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    alertBox.textContent = data.message || 'Message sent!';
    alertBox.className = 'alert alert-success';
    alertBox.classList.remove('d-none');
    form.reset();
    form.classList.remove('was-validated');
  } catch (err) {
    alertBox.textContent = 'Error sending message!';
    alertBox.className = 'alert alert-danger';
    alertBox.classList.remove('d-none');
  }
});

// Handle Newsletter Form
document.getElementById('newsletterForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;
  const alertBox = document.getElementById('subscribeAlert');

  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  const email = form.email.value;

  try {
    const res = await fetch(`${API}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    alertBox.textContent = data.message || 'Subscribed!';
    alertBox.className = 'alert alert-info';
    alertBox.classList.remove('d-none');
    form.reset();
    form.classList.remove('was-validated');
  } catch (err) {
    alertBox.textContent = 'Subscription failed!';
    alertBox.className = 'alert alert-danger';
    alertBox.classList.remove('d-none');
  }
});
