document.addEventListener("click",function(e){
var b=e.target.closest(".burger");
if(b){var o=document.getElementById("links").classList.toggle("open");b.setAttribute("aria-expanded",o);return}
var l=e.target.closest(".links a");if(l)document.getElementById("links").classList.remove("open");
var m=e.target.closest(".more");
if(m){var d=m.closest(".pane").querySelector(".det"),on=d.classList.toggle("on");m.setAttribute("aria-expanded",on);m.textContent=on?"Show less":"Read more"}});
document.addEventListener("keydown",function(e){if(e.key==="Escape")document.getElementById("links").classList.remove("open")});

/* Project YouTube embeds: keep bundled artwork visible as a fallback. */
(function () {
  var containers = document.querySelectorAll(".video-vis[data-video-id]");
  if (!containers.length) return;

  /* If the project-specific Enemy AI poster fails, switch to a known bundled landscape. */
  containers.forEach(function (container) {
    var fallback = container.querySelector(".video-fallback");
    if (!fallback) return;
    fallback.addEventListener("error", function () {
      var replacement = fallback.getAttribute("data-fallback-src");
      if (!replacement || fallback.dataset.fallbackApplied === "true") return;
      fallback.dataset.fallbackApplied = "true";
      fallback.src = replacement;
    });
  });

  function keepFallback(container) {
    container.classList.remove("video-ready");
    container.classList.add("video-unavailable");
  }

  window.onYouTubeIframeAPIReady = function () {
    containers.forEach(function (container) {
      var host = container.querySelector(".youtube-player");
      if (!host || !window.YT || !window.YT.Player) {
        keepFallback(container);
        return;
      }

      try {
        new YT.Player(host, {
          width: 640,
          height: 360,
          videoId: container.dataset.videoId,
          playerVars: {
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
            origin: window.location.origin
          },
          events: {
            onReady: function () {
              container.classList.add("video-ready");
              container.classList.remove("video-unavailable");
            },
            onError: function () {
              keepFallback(container);
            }
          }
        });
      } catch (error) {
        keepFallback(container);
      }

      window.setTimeout(function () {
        if (!container.classList.contains("video-ready")) keepFallback(container);
      }, 12000);
    });
  };

  var api = document.createElement("script");
  api.src = "https://www.youtube.com/iframe_api";
  api.async = true;
  api.onerror = function () {
    containers.forEach(keepFallback);
  };
  document.head.appendChild(api);
})();
