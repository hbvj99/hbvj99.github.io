---
title: "Internet Explorer detection using javascript"
excerpt: "Guide on detecting IE browser and adding custom warning message"
tags:
  - JavaScript
  - Browser
categories:
  - Guides
---

# Internet Explorer
Back in the early days when using Dail-up or ADSL connections, Internet Explorer browser was well liked browser offered by Microsoft to the Windows line of operating systems which were started in 1995. It is still present in most of the Windows Operating System like Windows 10 and now replaced by Edge browser which is the sucessor to IE.

## Modern applications and IE
Most of the present-day application relays on JavaScript frameworks like Angular or React for better UI/UX handling and to minimize the load time to the server. Also your modern app/website will likely to work in IE, but with the catch that some of the design or features might not operate as your client wish. To fix this issue, we could include Conditional [comments](https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/ms537512(v=vs.85)?redirectedfrom=MSDN#examples) that only IE can understand and are ignored by any other modern browsers like Google Chrome, Safari, Firefox. However, using such conditional comments is [not supported](https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/hh801214(v=vs.85)?redirectedfrom=MSDN) by all IE [versions](https://en.wikipedia.org/wiki/Internet_Explorer_version_history), it works in IE <= 9 but version 10 and 11 aren't supported. This is the reason why our ```code``` targeted to IE browsers doesn't work.

We need to detect specific features of the browsers to display custom message to each browser. To do this, we could use browser [feature detection](https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/samples/hh273397(v=vs.85)?redirectedfrom=MSDN) using JavaScript.

# Browser detection

There are various ways to detect browser through features, user agent or even prefix detection which all have limations that isn't reliable. For instance, you could disable user agent through browser plugins or extension, detecting WebKit engine version to specify browser isn't reliable either beacause Chrome, Safari, and Opera are [WebKit-based](https://en.wikipedia.org/wiki/List_of_web_browsers).

> "If it walks like a duck, swims like a duck, and quacks like a duck, then it probably is a duck."

We could relay on something like [Duck Typing](https://devopedia.org/duck-typing) for browser detection which works on all versions of IE, i.e 6-11. The idea is very simple, in duck typing, an object's suitability is determined by the presence of certain methods and properties. We will detect certian feature that are unqiue to the browser.

# Development

To start, we can simply use  ```isIE = /*@cc_on!@*/false```, this will set  ```isIE``` to ```false``` in all browser and they will ignore it as a comment beacause only IE detects ```!``` (negation) in the conditional comment. The IE would sees it as; ```isIE=!false``` which the statment will be true, explained in book JavaScript Pattern by Stoyan Stefanov [section](https://books.google.com.np/books?id=WTZqecc9olUC&pg=PA206&lpg=PA206&dq=isIE+%3D+/*@cc_on!@*/false&source=bl&ots=KcKmYhpNUu&sig=ACfU3U0DcTj7kvOjtp1TaiEJKJ1mQmcTJA&hl=en&sa=X&ved=2ahUKEwiOnc27trPnAhXQyjgGHWbJBBUQ6AEwBHoECAoQAQ#v=onepage&q=isIE%20%3D%20%2F*%40cc_on!%40*%2Ffalse&f=false).

We change the ```display``` property to ```block``` and whenever IE browser is detected through duck typing, this way the ```div``` block holding browser message appears in block style.

  ```javascript
    function checkIE() {
      if (isIE = /*@cc_on!@*/false) {
        document.getElementById("detectIE").style.display = "block";
      }
```

Finally, we create a simple block of html and name the ID ```detectIE``` for the main div container. Then we simply add CSS style ```display``` property to ```none```, this will disable message for other browsers.

```html
  <div id="detectIE" style="display: none;">
      <h2>Browser is not supported</h2>
      <p>{Your browser is not supported by Energidata Portal (EDP). This may mean that there are important features that you do not have access to. We recommend using one of the following browsers: Google Chrome, Microsoft Edge, Apple Safari, Morzilla Firefox.</p>
  </div>
  ```

# At last

This might be the most realiable way to detect IE browser if you wish to accomplish small tasks such as displaying alert message for IE browser users.

You can use similar tools like [browser-update](https://browser-update.org/) to notify visitors about their web browser versions in order to use your web application.
