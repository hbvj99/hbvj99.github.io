---
layout: archive
title: "Posts"
permalink: /posts/
author_profile: false
---

<div class="posts-filter">
  <div class="posts-filter-row">
    <select id="category-select" class="posts-filter-select" aria-label="Filter by category">
      <option value="">All categories</option>
      {%- for category in site.categories -%}
      <option value="{{ category[0] | slugify }}">{{ category[0] }}</option>
      {%- endfor -%}
    </select>
    <select id="tag-select" class="posts-filter-select" aria-label="Filter by tag">
      <option value="">All tags</option>
      {%- for tag in site.tags -%}
      <option value="{{ tag[0] | slugify }}">{{ tag[0] }}</option>
      {%- endfor -%}
    </select>
  </div>
</div>

<p class="posts-count" id="posts-count" aria-live="polite" aria-atomic="true"></p>

<div id="posts-list" class="entries-list">
  {%- for post in site.posts -%}
  <div class="post-card" data-categories="{% for category in post.categories %}{{ category | slugify }} {% endfor %}" data-tags="{% for tag in post.tags %}{{ tag | slugify }} {% endfor %}">
    <div class="list__item">
      <article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">
        <h2 class="archive__item-title" itemprop="headline">
          <a href="{{ post.url | relative_url }}" rel="permalink">{{ post.title }}</a>
        </h2>
        <p class="page__meta">
          <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d, %Y" }}</time>
          {%- if post.read_time -%}
            <span class="posts-meta-sep" aria-hidden="true">|</span>
            {% include read-time.html %}
          {%- endif -%}
        </p>
        {%- if post.excerpt -%}
          <p class="archive__item-excerpt" itemprop="description">{{ post.excerpt | markdownify | strip_html | truncate: 160 }}</p>
        {%- endif -%}
      </article>
    </div>
  </div>
  {%- endfor -%}
</div>

<div id="no-posts" class="posts-none" style="display: none;">
  <p>No posts match your filters.</p>
</div>

<nav class="pagination" id="posts-pagination" style="display: none;" aria-label="Posts pagination">
  <ul></ul>
</nav>

<script>
document.addEventListener("DOMContentLoaded", function() {
  var PER_PAGE = 5;
  var page = 1, cat = "", tag = "";

  var catEl = document.getElementById("category-select");
  var tagEl = document.getElementById("tag-select");
  var items = Array.from(document.querySelectorAll(".post-card"));
  var pagWrap = document.getElementById("posts-pagination");
  var pagList = pagWrap.querySelector("ul");
  var noneEl = document.getElementById("no-posts");
  var countEl = document.getElementById("posts-count");

  function filter() {
    return items.filter(function(item) {
      var c = item.getAttribute("data-categories") || "";
      var tg = item.getAttribute("data-tags") || "";
      return (!cat || c.indexOf(cat) !== -1) &&
             (!tag || tg.indexOf(tag) !== -1);
    });
  }

  function render() {
    var matched = filter();
    var total = matched.length;

    if (total === 0) {
      noneEl.style.display = "block";
      pagWrap.style.display = "none";
      items.forEach(function(el) { el.style.display = "none"; });
      countEl.textContent = "";
      return;
    }
    noneEl.style.display = "none";

    var pages = Math.ceil(total / PER_PAGE);
    if (page > pages) page = Math.max(1, pages);
    var start = (page - 1) * PER_PAGE;
    var end = Math.min(start + PER_PAGE, total);

    items.forEach(function(el) { el.style.display = "none"; });
    matched.slice(start, end).forEach(function(el) { el.style.display = ""; });

    countEl.textContent = "Showing " + (start + 1) + "\u2013" + end + " of " + total;

    renderPagination(pages);
  }

  function renderPagination(pages) {
    pagList.innerHTML = "";
    if (pages <= 1) { pagWrap.style.display = "none"; return; }
    pagWrap.style.display = "block";

    function add(label, disabled, fn) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#";
      a.textContent = label;
      if (disabled) a.classList.add("disabled");
      else a.addEventListener("click", function(e) { e.preventDefault(); fn(); render(); scroll(); });
      li.appendChild(a);
      pagList.appendChild(li);
    }

    add("Previous", page === 1, function() { page--; });
    for (var i = 1; i <= pages; i++) {
      (function(p) {
        add(p, p === page, function() { page = p; });
      })(i);
    }
    add("Next", page === pages, function() { page++; });
  }

  function scroll() {
    var el = document.getElementById("page-title");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  catEl && catEl.addEventListener("change", function() {
    cat = this.value;
    page = 1;
    render();
  });
  tagEl && tagEl.addEventListener("change", function() {
    tag = this.value;
    page = 1;
    render();
  });

  render();
});
</script>
