const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-nav");
const contactForm = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");
const successDialog = document.querySelector("#success-dialog");
const successCloseButton = successDialog.querySelector(".success-close");
const submitButton = contactForm.querySelector('button[type="submit"]');
const defaultButtonText = submitButton.innerHTML;

const emailJsConfig = {
  publicKey: "Dp1RcgY63Vetua_6L",
  serviceId: "service_2ri97ec",
  templateId: "template_ui5ghl6",
};

document.querySelector("#year").textContent = new Date().getFullYear();

if (window.emailjs) {
  window.emailjs.init({ publicKey: emailJsConfig.publicKey });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  const revealTargets = document.querySelectorAll(
    ".hero-copy > *, .hero-art, .ticker, .section-heading, .service-card, .work-copy, .work-preview, .concept-note, .process-intro, .steps article, .price-card, .pricing-footnote, .contact-copy, .contact-form, .footer > *",
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
    );

    revealTargets.forEach((element, index) => {
      element.classList.add("motion-reveal");
      element.style.setProperty("--reveal-delay", `${(index % 4) * 85}ms`);
      revealObserver.observe(element);
    });
  }
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  });
});

successCloseButton.addEventListener("click", () => {
  successDialog.close();
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!window.emailjs) {
    formNote.textContent = "Email service could not be loaded. Please check your internet connection and try again.";
    return;
  }

  if (emailJsConfig.templateId === "YOUR_EMAILJS_TEMPLATE_ID") {
    formNote.textContent = "EmailJS is almost ready. Add your EmailJS template ID in script.js before sending enquiries.";
    return;
  }

  const formData = new FormData(contactForm);
  const templateParams = {
    from_name: formData.get("name"),
    reply_to: formData.get("email"),
    phone_number: formData.get("phone"),
    project_type: formData.get("project"),
    message: formData.get("message") || "No additional project details provided.",
  };

  submitButton.disabled = true;
  submitButton.textContent = "Sending enquiry...";
  formNote.textContent = "Sending your enquiry securely. Please wait.";

  try {
    await window.emailjs.send(emailJsConfig.serviceId, emailJsConfig.templateId, templateParams);
    contactForm.reset();
    formNote.textContent = "Thank you. Your project enquiry has been sent successfully.";
    successDialog.showModal();
  } catch (error) {
    console.error("EmailJS could not send the project enquiry:", error);
    formNote.textContent = "Your enquiry could not be sent. Please try again in a moment or contact me directly.";
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = defaultButtonText;
  }
});
