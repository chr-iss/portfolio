// Scroll animations
document.addEventListener('DOMContentLoaded', function() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  fadeElements.forEach(element => {
    fadeObserver.observe(element);
  });
  
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Update copyright year
  document.querySelector('.copyright').innerHTML = 
    `© ${new Date().getFullYear()} Cresjan Sithole. All rights reserved.`;
});

// Handle form submission with Formspree
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

form.addEventListener("submit", async function(event) {
  event.preventDefault();

  // Show loading state
  const submitBtn = form.querySelector("button[type='submit']");
  submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
  submitBtn.disabled = true;

  // Send form data
  const formData = new FormData(form);
  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      formStatus.textContent = " Message sent successfully!";
      formStatus.style.color = "var(--success)";
      formStatus.style.display = "block";
      form.reset();
    } else {
      throw new Error("Form submission failed");
    }
  } catch (error) {
    formStatus.textContent = " Oops! There was a problem. Please try again.";
    formStatus.style.color = "var(--primary)";
    formStatus.style.display = "block";
  } finally {
    // Reset button
    submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
    submitBtn.disabled = false;

    // Hide status after 5s
    setTimeout(() => { formStatus.style.display = "none"; }, 5000);
  }
});
