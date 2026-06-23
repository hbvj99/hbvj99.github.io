---
layout: archive
title: "Posts"
permalink: /posts/
author_profile: false
---

<!-- Search box -->
<div class="posts-filter-container">
  <div class="search-box-wrapper">
    <input type="text" id="post-search" placeholder="Search posts by title or description..." />
    <i class="fas fa-search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 0.9rem;"></i>
  </div>
</div>

<!-- Posts list -->
<div id="posts-list" class="entries-list">
  {%- for post in site.posts -%}
    <div class="list__item post-card-item" data-tags="{% for tag in post.tags %}{{ tag | slugify }} {% endfor %}" data-title="{{ post.title | downcase | escape }}" data-excerpt="{{ post.excerpt | markdownify | strip_html | truncate: 160 | downcase | escape }}">
      <article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">
        <h2 class="archive__item-title" itemprop="headline">
          <a href="{{ post.url | relative_url }}" rel="permalink">{{ post.title }}</a>
        </h2>
        <p class="page__meta" style="margin-top: 0.25rem; margin-bottom: 0.5rem;">
          <i class="far fa-calendar-alt" aria-hidden="true"></i> {{ post.date | date: "%B %d, %Y" }}
          {%- if post.read_time -%}
            <span style="margin: 0 8px; color: var(--border);">|</span>
            <i class="far fa-clock" aria-hidden="true"></i> {% include read-time.html %}
          {%- endif -%}
        </p>
        {%- if post.excerpt -%}
          <p class="archive__item-excerpt" itemprop="description" style="margin-top: 0.5rem;">{{ post.excerpt | markdownify | strip_html | truncate: 160 }}</p>
        {%- endif -%}
      </article>
    </div>
  {%- endfor -%}
</div>

<!-- No results message -->
<div id="no-posts-message" style="display: none; text-align: center; padding: 2rem; color: var(--muted);">
  <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
  No posts match your search.
</div>

<!-- Pagination -->
<nav class="pagination" id="posts-pagination" style="margin-top: 2.5rem; display: none;">
  <ul style="display: flex; list-style: none; padding: 0; margin: 0; gap: 0.25rem;">
    <!-- Will be populated dynamically by JS -->
  </ul>
</nav>

<script>
document.addEventListener("DOMContentLoaded", function() {
  const postsPerPage = 5;
  let currentPage = 1;
  let filteredPosts = [];

  const searchInput = document.getElementById("post-search");
  const postItems = Array.from(document.querySelectorAll(".post-card-item"));
  const paginationContainer = document.querySelector("#posts-pagination ul");
  const paginationNav = document.getElementById("posts-pagination");
  const noResultsMessage = document.getElementById("no-posts-message");

  let searchQuery = "";

  function filterAndPaginate() {
    // Filter
    filteredPosts = postItems.filter(item => {
      const title = item.getAttribute("data-title");
      const excerpt = item.getAttribute("data-excerpt");
      const matchesSearch = !searchQuery || title.includes(searchQuery) || excerpt.includes(searchQuery);
      return matchesSearch;
    });

    // Handle no results
    if (filteredPosts.length === 0) {
      noResultsMessage.style.display = "block";
      paginationNav.style.display = "none";
      postItems.forEach(item => item.style.display = "none");
      return;
    } else {
      noResultsMessage.style.display = "none";
    }

    // Paginate
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    if (currentPage > totalPages) currentPage = Math.max(1, totalPages);

    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;

    // Show/hide posts
    postItems.forEach(item => item.style.display = "none");
    filteredPosts.slice(startIndex, endIndex).forEach(item => {
      item.style.display = "block";
    });

    // Render pagination
    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    paginationContainer.innerHTML = "";
    if (totalPages <= 1) {
      paginationNav.style.display = "none";
      return;
    }
    paginationNav.style.display = "block";

    // Previous button
    const prevLi = document.createElement("li");
    const prevA = document.createElement("a");
    prevA.href = "#";
    prevA.textContent = "Previous";
    if (currentPage === 1) {
      prevA.classList.add("disabled");
    } else {
      prevA.addEventListener("click", function(e) {
        e.preventDefault();
        currentPage--;
        filterAndPaginate();
        scrollToTop();
      });
    }
    prevLi.appendChild(prevA);
    paginationContainer.appendChild(prevLi);

    // Page buttons
    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.textContent = i;
      if (i === currentPage) {
        a.classList.add("disabled", "current");
      } else {
        a.addEventListener("click", function(e) {
          e.preventDefault();
          currentPage = i;
          filterAndPaginate();
          scrollToTop();
        });
      }
      li.appendChild(a);
      paginationContainer.appendChild(li);
    }

    // Next button
    const nextLi = document.createElement("li");
    const nextA = document.createElement("a");
    nextA.href = "#";
    nextA.textContent = "Next";
    if (currentPage === totalPages) {
      nextA.classList.add("disabled");
    } else {
      nextA.addEventListener("click", function(e) {
        e.preventDefault();
        currentPage++;
        filterAndPaginate();
        scrollToTop();
      });
    }
    nextLi.appendChild(nextA);
    paginationContainer.appendChild(nextLi);
  }

  function scrollToTop() {
    const titleEl = document.getElementById("page-title");
    if (titleEl) {
      titleEl.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Search input event listener
  if (searchInput) {
    searchInput.addEventListener("input", function(e) {
      searchQuery = e.target.value.toLowerCase().trim();
      currentPage = 1;
      filterAndPaginate();
    });
  }

  // Initial render
  filterAndPaginate();
});
</script>
