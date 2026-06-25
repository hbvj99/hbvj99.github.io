---
layout: single
author_profile: false
---

<div class="home-hero" style="margin-top: 1.5rem; margin-bottom: 3.5rem;">
  <h1 class="hero-title" style="font-size: 2.8rem; line-height: 1.15; font-weight: 800; margin-bottom: 0.5rem; background: linear-gradient(135deg, var(--link) 0%, var(--link-hover) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.5px;">Hi, I'm Vijay <span class="wave" style="display: inline-block; -webkit-text-fill-color: initial; animation: wave-animation 2.5s infinite; transform-origin: 70% 70%;">👋</span></h1>
  <p class="hero-subtitle" style="font-size: 1.35rem; font-weight: 500; color: var(--muted); margin-top: 0; margin-bottom: 1.5rem; letter-spacing: -0.2px;">Software Engineer</p>
  
  <p class="hero-bio" style="font-size: 1.1rem; line-height: 1.65; margin-bottom: 2rem; max-width: 680px; color: var(--text);">
    I specialize in designing and building scalable backend architectures, robust APIs, and cloud-native services. Here, I write about systems engineering, cloud automation, and key engineering lessons.
  </p>

  <div class="hero-ctas" style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
    <a href="/about/" class="btn btn--primary" style="padding: 12px 24px; font-size: 0.95rem; font-weight: 600; text-decoration: none; border-radius: 6px; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;"> About My Work</a>
    <a href="/contact/" class="btn btn--outline" style="padding: 12px 24px; font-size: 0.95rem; font-weight: 600; text-decoration: none; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;"><i class="far fa-paper-plane" style="font-size: 0.9rem;"></i> Get In Touch</a>
  </div>
</div>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;" />

<div class="home-section">
  <h2>
    <i class="fas fa-cubes"></i> Core Focus & Specialties
  </h2>

  <div class="specialties-grid-minimal">
    <div class="specialty-item-minimal">
      <h3><i class="fas fa-sitemap"></i> System Design</h3>
      <p>Designing resilient RESTful microservices, event-driven data integration flows, and robust backend APIs optimized for load.</p>
    </div>
    <div class="specialty-item-minimal">
      <h3><i class="fas fa-cloud"></i> Cloud & Infrastructure</h3>
      <p>Building secure cloud automations, serverless pipelines, and containerized deployment workflows using AWS, Self hosting.</p>
    </div>
    <div class="specialty-item-minimal">
      <h3><i class="fas fa-shield-halved"></i> Reliability & Security</h3>
      <p>Implementing high-performance cache systems, security standards, and load testing pipelines to guarantee system uptime.</p>
    </div>
  </div>
</div>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;" />

<div class="home-stats">
  <div class="home-stat"><span class="home-stat-number">6+</span> <span class="home-stat-label">Years Experience</span></div>
  <div class="home-stat"><span class="home-stat-number">20+</span> <span class="home-stat-label">Projects</span></div>
  <div class="home-stat"><span class="home-stat-number">{{ site.posts | size }}</span> <span class="home-stat-label">Articles</span></div>
</div>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;" />

<div class="home-section">
  <h2>
    <i class="fas fa-feather-alt"></i> Recent Articles
  </h2>
  
  <div class="recent-posts-list" style="display: flex; flex-direction: column; gap: 1.25rem;">
    {%- for post in site.posts limit: 3 -%}
      <article class="recent-post-card">
        <h3 class="recent-post-title" style="margin: 0 0 0.5rem 0; font-size: 1.25rem; font-weight: 700;">
          <a href="{{ post.url | relative_url }}" style="color: var(--text); text-decoration: none;">{{ post.title }}</a>
        </h3>
        <div class="post-meta" style="font-size: 0.8rem; color: var(--muted); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
          <i class="far fa-calendar-alt"></i> {{ post.date | date: "%B %d, %Y" }}
          {%- if post.read_time -%}
            <span style="color: var(--border);">|</span>
            <i class="far fa-clock"></i> {% include read-time.html %}
          {%- endif -%}
        </div>
        {%- if post.excerpt -%}
          <p class="post-excerpt" style="margin: 0; font-size: 0.92rem; color: var(--muted); line-height: 1.55;">{{ post.excerpt | markdownify | strip_html | truncate: 160 }}</p>
        {%- endif -%}
      </article>
    {%- endfor -%}
  </div>

  <div style="margin-top: 2.5rem; text-align: center;">
    <a href="/posts/" class="btn btn--primary" style="padding: 12px 28px; font-size: 0.95rem; text-decoration: none; border-radius: 6px; font-weight: 600;">View All Posts <i class="fas fa-arrow-right" style="margin-left: 6px; font-size: 0.8rem;"></i></a>
  </div>
</div>
