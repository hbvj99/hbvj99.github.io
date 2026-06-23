---
layout: single
title: "Contact"
permalink: /contact/
author_profile: false
---

Thanks for stopping by! Whether you have a question, suggestions for my articles, a business query, or just want to discuss system engineering and backend design, feel free to reach out. 

You can connect with me through the following channels:

<div class="contact-grid">
  <div class="contact-card">
    <div class="contact-icon"><i class="fas fa-envelope"></i></div>
    <h4>Email</h4>
    <p>
      <a href="#" id="email-link">Click to reveal</a>
      <noscript>vijay [at] vijaypathak.com.np</noscript>
    </p>
  </div>
  <div class="contact-card">
    <div class="contact-icon"><i class="fab fa-linkedin"></i></div>
    <h4>LinkedIn</h4>
    <p><a href="https://linkedin.com/in/hbvj99" target="_blank" rel="noopener">in/hbvj99</a></p>
  </div>
  <div class="contact-card">
    <div class="contact-icon"><i class="fab fa-github"></i></div>
    <h4>GitHub</h4>
    <p><a href="https://github.com/hbvj99" target="_blank" rel="noopener">github.com/hbvj99</a></p>
  </div>
</div>

<script>
  (function() {
    var link = document.getElementById('email-link');
    if (link) {
      var encoded = "dmlqYXlAdmlqYXlwYXRoYWsuY29tLm5w"; // base64 encoded vijay@vijaypathak.com.np
      
      link.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = "mailto:" + atob(encoded);
      });
      
      link.addEventListener('mouseover', function() {
        link.setAttribute('href', 'mailto:' + atob(encoded));
      });
      
      link.innerText = "Send Email";
    }
  })();
</script>