import "./output.css";

const urlInput = document.getElementById("url-input"),
  submitBtn = document.getElementById("shorten-it"),
  invalidMessage = document.getElementById("invalid-message"),
  urlsComponent = document.querySelector(".urls"),
  burgerMenu = document.getElementById("burger-menu"),
  closeMenu = document.getElementById("close-menu"),
  headerNav = document.querySelector(".header-nav");

urlInput.addEventListener("input", (e) => {
  urlInput.classList.remove("invalid");
  invalidMessage.style.display = "none";
});

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  if (urlInput.value.trim() === "") {
    urlInput.classList.add("invalid");
    invalidMessage.style.display = "block";
    return;
  }

  const url = urlInput.value.trim();
  const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`);
  const data = await response.json();
  const shortUrl = data.result.full_short_link2;
  const obj = {
    url,
    shortUrl,
    copied: false,
  };
  localStorage.setItem(
    `url-${shortUrl.split("/")[shortUrl.split("/").length - 1]}`,
    JSON.stringify(obj)
  );
  const savedUrls = { ...localStorage };

  urlsComponent.innerHTML = "";
  Object.entries(savedUrls).forEach((item) => {
    const resultObj = JSON.parse(item[1]);
    urlsComponent.innerHTML += `
        <div class="url-wrapper">
          <div class="original-url">${resultObj.url}</div>
          <div class="result">
            <div class="shortened-url">${resultObj.shortUrl}</div>
            ${
              resultObj.copied
                ? '<button class="btn clicked">Copied!</button>'
                : '<button class="btn">Copy</button>'
            }
          </div>
        </div>
    `;
  });
});

urlsComponent.addEventListener("click", (e) => {
  const target = e.target.closest(".url-wrapper button");

  if (target) {
    const url = target.parentNode.querySelector(".shortened-url").textContent;
    const urlCode = url.split("/")[url.split("/").length - 1];
    const urlObj = localStorage.getItem(`url-${urlCode}`)
      ? JSON.parse(localStorage.getItem(`url-${urlCode}`))
      : null;

    localStorage.setItem(
      `url-${urlCode}`,
      JSON.stringify({ ...urlObj, copied: true })
    );

    const currentBtn = target.parentNode.querySelector("button");
    const copiedBtn = document.createElement("button");
    copiedBtn.innerText = "Copied!";
    copiedBtn.classList.add("btn");
    copiedBtn.classList.add("clicked");
    currentBtn.replaceWith(copiedBtn);

    navigator.clipboard.writeText(url);
  }
});

burgerMenu.addEventListener("click", () => {
  headerNav.classList.add("open");
  burgerMenu.style.display = "none";
  closeMenu.style.display = "block";
});

closeMenu.addEventListener("click", () => {
  headerNav.classList.remove("open");
  burgerMenu.style.display = "block";
  closeMenu.style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
  const savedUrls = { ...localStorage };

  urlsComponent.innerHTML = "";
  Object.entries(savedUrls).forEach((item) => {
    const resultObj = JSON.parse(item[1]);
    urlsComponent.innerHTML += `
        <div class="url-wrapper">
          <div class="original-url">${resultObj.url}</div>
          <div class="result">
            <div class="shortened-url">${resultObj.shortUrl}</div>
            ${
              resultObj.copied
                ? '<button class="btn clicked">Copied!</button>'
                : '<button class="btn">Copy</button>'
            }
          </div>
        </div>
    `;
  });
});
