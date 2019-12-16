---
title: "Liquid Whitespaces in Jekyll"
excerpt: "Guide on removing extra whitespaces in Jekyll"
tags:
  - Jekyll
  - Liquid
categories:
  - Guides
---

# Whitespaces and Liquid template

Whitespaces are common blank spaces that you would see in the HTML document when rendered, it can be horizontal or vertical. You may not have noticed whitespaces when using Jekyll unless you view source, it by default uses <a target="_blank" href="https://jekyllrb.com/docs/liquid/">Liquid</a> templating language to process document like this blog which runs in <a target="_blank" href="https://github.com/mmistakes/minimal-mistakes">minimial-mistakes</a> for Jekyll. Liquid version 4 tags eliminate this behavior.


For example, In ```_layouts > home.html```, we run simple {% raw %}```{{ content }}```{% endraw %} tag to output whitespaces in HTML.

Code:
{% raw %}```
  {{ content }}
  <h3 class="archive__subtitle">{{ site.data.ui-text[site.locale].recent_posts | default: "Recent Posts" }}</h3>
  {% for post in paginator.posts %}
    {% include archive-single.html %}
  {% endfor %}
  {% include paginator.html %}
```{% endraw %}

Output:
```ruby
<h3 class="archive__subtitle">{{ site.data.ui-text[site.locale].recent_posts | default: "Recent Posts" }}</h3>

{% for post in paginator.posts %}
  {% include archive-single.html %}
{% endfor %}

{% include paginator.html %}

```
<br>
# What causes this issue?

The liquid version 3 generates whitespaces between {% raw %}```{{ content }}```{% endraw %} tag even when any conditional statement might be true or false. There are lots of such statements in ```_layouts```, ```_includes``` folder which results in occasional whitespaces between any tags used.

<br>
# The Fix?
Liquid 4 has whitespace control to fix this error by updating tags. You are in luck if you already host Jekyll blog in GitHub Pages, its <a target="_blank" href="https://pages.github.com/versions/"> dependency</a> already use liquid version 4.

Simply update all { } tags inside ```_layouts```, ```_includes``` folder. You can use, find in folder option and replace all old tags with new one if your are using Visual Studio Code referring <a target="_blank" href="https://shopify.github.io/liquid/basics/whitespace/"> whitespace control</a> docs. 

Push your blog to GitHub pages to see changes or run ```update bundler```, if your use Jekyll with bundler.

<br>
# Conclusion
The above simple method upgrades your Liquid templating in Jekyll. Your HTML file size decreases by slightly and you would expect to increase performance although the noticeable difference is smaller.