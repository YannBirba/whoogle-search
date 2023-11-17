document.addEventListener("DOMContentLoaded", () => {
  const advSearchToggle = document.getElementById("adv-search-toggle");
  const advSearchDiv = document.getElementById("adv-search-div");
  const searchBar = document.getElementById("search-bar");
  const countrySelect = document.getElementById("result-country");
  const timePeriodSelect = document.getElementById("result-time-period");
  const resultList = document.querySelector("#main");
  const arrowKeys = [37, 38, 39, 40];
  let searchValue = searchBar.value;

  countrySelect.onchange = () => {
    let str = window.location.href;
    n = str.lastIndexOf("/search");
    if (n > 0) {
      str = str.substring(0, n) + `/search?q=${searchBar.value}`;
      str = tackOnParams(str);
      window.location.href = str;
    }
  };

  timePeriodSelect.onchange = () => {
    let str = window.location.href;
    n = str.lastIndexOf("/search");
    if (n > 0) {
      str = str.substring(0, n) + `/search?q=${searchBar.value}`;
      str = tackOnParams(str);
      window.location.href = str;
    }
  };

  function tackOnParams(str) {
    if (timePeriodSelect.value != "") {
      str = str + `&tbs=${timePeriodSelect.value}`;
    }
    if (countrySelect.value != "") {
      str = str + `&country=${countrySelect.value}`;
    }
    return str;
  }

  const toggleAdvancedSearch = (on) => {
    if (on) {
      advSearchDiv.style.maxHeight = "70px";
    } else {
      advSearchDiv.style.maxHeight = "0px";
    }
    localStorage.advSearchToggled = on;
  };

  try {
    toggleAdvancedSearch(JSON.parse(localStorage.advSearchToggled));
  } catch (error) {
    console.warn("Did not recover advanced search toggle state");
  }

  advSearchToggle.onclick = () => {
    toggleAdvancedSearch(advSearchToggle.checked);
  };

  searchBar.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      document.getElementById("search-form").submit();
    } else if (
      searchBar.value !== searchValue &&
      !arrowKeys.includes(event.keyCode)
    ) {
      searchValue = searchBar.value;
      handleUserInput();
    }
  });

  const items = document.querySelectorAll("#main > div");

  const observer = new IntersectionObserver((entries) => {
    let delay = 0;
    entries.forEach((entry) => {
      if (
        entry.intersectionRatio > 0 &&
        !entry.target.classList.contains("visible")
      ) {
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, delay);
        delay += 100;
      }
    });
  });

  items.forEach((item) => {
    observer.observe(item);
    const link = item.querySelector("a");

    if (!link) return;

    let timer = null;

    link.addEventListener("mouseover", (e) => {
      const hoveredLinkButNotThisOne = document.querySelectorAll(
        "#main > div a.hovered:not([href='" + link.href + "'])"
      );

      if (
        item.classList.contains("visible") &&
        !document.getElementById("preview-iframe") &&
        hoveredLinkButNotThisOne.length === 0
      ) {
        link.classList.add("hovered");
        timer = setTimeout(() => {
          const allPreviewIframes = document.querySelectorAll("iframe");
          allPreviewIframes.forEach((iframe) => {
            iframe.remove();
          });
          const previewIframe = document.createElement("iframe");
          previewIframe.id = "preview-iframe";
          previewIframe.allowFullscreen = true;
          previewIframe.src = link.href;
          previewIframe.style.position = "fixed";

          document.body.appendChild(previewIframe);
          previewIframe.addEventListener("mouseout", () => {
            setTimeout(() => {
              link.classList.remove("hovered");
              previewIframe.remove();
            }, 400);
          });
        }, 750);
      } else {
        link.classList.remove("hovered");
      }
    });

    link.addEventListener("mouseout", () => {
      clearTimeout(timer);
      link.classList.remove("hovered");
    });
  });
});
