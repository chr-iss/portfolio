// ================================
// ================================
document.addEventListener('DOMContentLoaded', function () {

  // Fade-in animation
  const fadeElements = document.querySelectorAll('.fade-in');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  fadeElements.forEach(element => fadeObserver.observe(element));

  // ================================
  // SMOOTH SCROLL
  // ================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });

  // ================================
  // ACTIVE NAV ON SCROLL
  // ================================
  window.addEventListener('scroll', function () {
    const scrollPos = window.scrollY + 100;
    document.querySelectorAll('.section').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const sectionId = section.getAttribute('id');
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-links a').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // ================================
  // CERTIFICATE MODAL (PDF VIEWER)
  // ================================
  const modal = document.getElementById("certModal");
  const pdfViewer = document.getElementById("certPdfViewer");
  const downloadLink = document.getElementById("certDownloadLink");
  let currentPdfUrl = '';

  window.openCertModal = function(pdfUrl) {
    console.log('Opening PDF:', pdfUrl); // Debug log
    
    if (modal && pdfViewer) {
      currentPdfUrl = pdfUrl;
      
      // Try to load the PDF
      pdfViewer.src = pdfUrl;
      
      if (downloadLink) {
        downloadLink.href = pdfUrl;
      }
      
      modal.style.display = "block";
      document.body.style.overflow = "hidden";
      
      // Check if PDF loaded successfully
      pdfViewer.onload = function() {
        console.log('PDF loaded successfully');
      };
      
      pdfViewer.onerror = function() {
        console.error('Failed to load PDF:', pdfUrl);
        alert('Failed to load PDF. Make sure you are running on a local server (like Live Server) and the file exists.');
      };
    }
  };

  window.closeCertModal = function() {
    if (modal) {
      modal.style.display = "none";
      if (pdfViewer) {
        pdfViewer.src = "";
      }
      document.body.style.overflow = "auto";
    }
  };

  // Add click event to all view-cert buttons
  document.querySelectorAll(".btn-view-cert").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const certUrl = this.getAttribute("data-cert");
      
      if (certUrl) {
        console.log('Certificate button clicked, URL:', certUrl); // Debug log
        
        // Check if running on local server
        if (window.location.protocol === 'file:') {
          alert('⚠️ You are opening this file directly from your computer.\n\nPlease use a local server (like Live Server in VS Code) to view PDFs.\n\nRight-click index.html → Open with Live Server');
          return;
        }
        
        openCertModal(certUrl);
      } else {
        console.error('No data-cert attribute found');
        alert('Certificate URL not found');
      }
    });
  });

  // Close modal with X button
  const closeBtn = document.querySelector(".close-modal");
  if (closeBtn) closeBtn.onclick = closeCertModal;

  // Close modal when clicking outside
  window.onclick = function(event) {
    if (event.target === modal) closeCertModal();
  };

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.style.display === 'block') {
      closeCertModal();
    }
  });

  // Check if running on local server and show warning if not
  if (window.location.protocol === 'file:') {
    console.warn('⚠️ Running from file:// protocol. PDF viewing may not work properly.');
    const warning = document.createElement('div');
    warning.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #ff0055;
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 9999;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    warning.innerHTML = '⚠️ Use Live Server to view PDFs | Click to dismiss';
    warning.onclick = () => warning.remove();
    document.body.appendChild(warning);
    
    setTimeout(() => {
      if (warning.parentNode) warning.remove();
    }, 8000);
  } else {
    console.log('✅ Running on local server, PDF viewing should work');
  }

  // ================================
  // FORM SUBMISSION
  // ================================
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const submitBtn = form.querySelector("button[type='submit']");
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
      submitBtn.disabled = true;

      const formData = new FormData(form);
      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          formStatus.textContent = "✓ Message sent successfully!";
          formStatus.style.color = "#00cc88";
          formStatus.style.display = "block";
          form.reset();
        } else {
          throw new Error("Form submission failed");
        }
      } catch (error) {
        formStatus.textContent = "✗ Oops! There was a problem. Please try again.";
        formStatus.style.color = "#ff0055";
        formStatus.style.display = "block";
      } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        setTimeout(() => {
          formStatus.style.display = "none";
        }, 5000);
      }
    });
  }

  // ================================
  // UPDATE COPYRIGHT YEAR
  // ================================
  const copyrightElement = document.querySelector('.copyright');
  if (copyrightElement) {
    copyrightElement.innerHTML = `© ${new Date().getFullYear()} Cresjan Sithole. All rights reserved.`;
  }
});
