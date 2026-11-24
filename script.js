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


/* Homepage featured projects: cards are generated from one editable data collection. */
(function () {
  var root = document.querySelector("[data-featured-carousel]");
  if (!root) return;
  var track = root.querySelector(".featured-track");
  var dotsHost = document.getElementById("featured-dots");
  var prevButton = document.getElementById("featured-prev");
  var nextButton = document.getElementById("featured-next");
  var counter = document.getElementById("featured-counter");
  if (!track || !dotsHost || !prevButton || !nextButton || !counter) return;

  var projects = [
    { id:"enemy-ai", type:"Published asset", organization:"2 Dude Studios", title:"Enemy AI",
      description:"Reusable FSM enemy AI for single-player and Photon Fusion 2 multiplayer.",
      contribution:"Shared patrol, chase and attack behaviours, target detection, and an enemy configurator.",
      tags:["Unity","C#","Photon Fusion 2"], image:"assets/enemy-ai.webp", alt:"Enemy AI concept artwork", imageNote:"Concept artwork",
      videoId:"c7iCqUvTtb0", videoTitle:"Enemy AI gameplay video",
      detailsUrl:"projects.html#enemy-ai",
      externalUrl:"https://assetstore.unity.com/packages/tools/behavior-ai/enemy-ai-for-photon-fusion-2-networked-fsm-413184",
      externalLabel:"Unity Asset Store" },
    { id:"lbe-vr", type:"Company project", organization:"2 Dude Studios", title:"LBE VR",
      description:"A shared-space multiplayer VR arena for team combat against players and AI.",
      contribution:"Operator UI, match management, arena setup, and networked combat.",
      tags:["Unity","Photon Fusion","VR"], image:"assets/lbe-vr.webp", alt:"LBE VR illustrative artwork", imageNote:"Illustrative concept art",
      detailsUrl:"projects.html#lbe-vr",
      externalUrl:"https://2dudestudios.com/industries/lbe", externalLabel:"Studio project" },
    { id:"fight-arena", type:"Personal project", organization:"Independent", title:"Fight Arena",
      description:"A Tekken-inspired 3D fighter prototype built around responsive combat.",
      contribution:"Character movement, animation, camera control, and arena boundaries.",
      tags:["Unity","C#","Gameplay"], image:"assets/fight-arena.webp", alt:"Fight Arena reference artwork", imageNote:"Reference artwork",
      videoId:"J4aup5Nu9pI", videoTitle:"Fight Arena gameplay video",
      detailsUrl:"projects.html#fight-arena",
      externalUrl:"https://github.com/utsavagarwal28/FightArena", externalLabel:"GitHub repository" }
  ];

  function renderCard(project) {
    var card = document.createElement("article");
    card.className = "featured-card";
    card.dataset.projectId = project.id;
    card.innerHTML =
      '<div class="featured-media' + (project.videoId ? ' has-video' : '') + '">' +
        '<img src="' + project.image + '" alt="' + project.alt + '" loading="lazy" decoding="async">' +
        '<span class="featured-media-note">' + (project.videoId ? 'Playable video' : project.imageNote) + '</span>' +
        (project.videoId ? '<button class="featured-play" type="button" aria-label="Play ' + project.title + ' video" title="Play video"><span aria-hidden="true">▶</span></button>' : '') +
      '</div>' +
      '<div class="featured-card-body">' +
        '<div class="featured-card-meta"><span class="featured-card-type">' + project.type + '</span><span class="featured-card-org">' + project.organization + '</span></div>' +
        '<h3>' + project.title + '</h3>' +
        '<p class="featured-card-description">' + project.description + '</p>' +
        '<p class="featured-contribution"><b>My contribution</b>' + project.contribution + '</p>' +
        '<div class="featured-card-tags">' + project.tags.map(function (tag) { return '<span>' + tag + '</span>'; }).join("") + '</div>' +
        '<div class="featured-card-actions"><a class="featured-card-details" href="' + project.detailsUrl + '">Project details <span aria-hidden="true">→</span></a><a class="featured-card-external" href="' + project.externalUrl + '" target="_blank" rel="noopener noreferrer">' + project.externalLabel + ' <span aria-hidden="true">↗</span></a></div>' +
      '</div>';
    var image = card.querySelector("img");
    image.addEventListener("error", function () {
      if (image.dataset.fallbackApplied === "true") return;
      image.dataset.fallbackApplied = "true";
      image.src = "assets/muted-landscape.webp";
      image.alt = "Atmospheric portfolio landscape";
    });

    if (project.videoId) {
      var playButton = card.querySelector(".featured-play");
      playButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        requestProjectVideo(card, project, "manual");
      });
    }
    return card;
  }

  track.replaceChildren();
  projects.forEach(function (project) { track.appendChild(renderCard(project)); });
  var cards = Array.prototype.slice.call(track.querySelectorAll(".featured-card"));

  /*
   * Featured-card video controller.
   * - Desktop: a 2-second hover or an explicit card click starts playback.
   * - Touch/mobile: the centred card in the horizontal track controls playback.
   * - Only one player may play at a time.
   * - A user pause suppresses future automatic starts until an explicit play action.
   */
  var projectById = {};
  projects.forEach(function (project) { projectById[project.id] = project; });

  var videoStates = {};
  var activeVideoState = null;
  var youtubeApiRequested = false;
  var youtubeApiCallbacks = [];
  var mobileQuery = window.matchMedia("(max-width:760px)");
  var hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  var mobileFocusCard = null;
  var mobileFocusFrame = 0;

  function getVideoState(project, card) {
    var state = videoStates[project.id];
    if (!state) {
      state = videoStates[project.id] = {
        project: project,
        card: card,
        player: null,
        host: null,
        ready: false,
        pending: false,
        wantsPlay: false,
        lastStartMode: "auto",
        manuallyPaused: false,
        ignoreProgrammaticPause: false,
        ignorePauseTimer: 0,
        readyTimer: 0
      };
    }
    state.card = card || state.card;
    return state;
  }

  function ensureYouTubeApi(callback) {
    if (window.YT && window.YT.Player) {
      callback(true);
      return;
    }

    youtubeApiCallbacks.push(callback);
    if (youtubeApiRequested) return;
    youtubeApiRequested = true;

    var previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (typeof previousReady === "function") {
        try { previousReady(); } catch (error) { /* Keep featured playback independent. */ }
      }
      var callbacks = youtubeApiCallbacks.slice();
      youtubeApiCallbacks.length = 0;
      callbacks.forEach(function (waiter) { waiter(true); });
    };

    var api = document.createElement("script");
    api.src = "https://www.youtube.com/iframe_api";
    api.async = true;
    api.onerror = function () {
      youtubeApiRequested = false;
      var callbacks = youtubeApiCallbacks.slice();
      youtubeApiCallbacks.length = 0;
      callbacks.forEach(function (waiter) { waiter(false); });
    };
    document.head.appendChild(api);
  }

  function clearPlayerHost(state) {
    if (state.readyTimer) {
      window.clearTimeout(state.readyTimer);
      state.readyTimer = 0;
    }
    if (state.host && state.host.parentNode) {
      state.host.parentNode.removeChild(state.host);
    }
    state.host = null;
    state.player = null;
    state.ready = false;
    state.pending = false;
    if (state.card) {
      var media = state.card.querySelector(".featured-media");
      if (media) media.classList.remove("is-playing");
    }
    if (activeVideoState === state) activeVideoState = null;
  }

  function pauseProgrammatically(state) {
    if (!state) return;
    state.wantsPlay = false;

    if (!state.player || !state.ready || !window.YT || !window.YT.PlayerState) return;

    var currentState;
    try { currentState = state.player.getPlayerState(); } catch (error) { return; }

    if (currentState === window.YT.PlayerState.PLAYING ||
        currentState === window.YT.PlayerState.BUFFERING) {
      state.ignoreProgrammaticPause = true;
      if (state.ignorePauseTimer) window.clearTimeout(state.ignorePauseTimer);
      state.ignorePauseTimer = window.setTimeout(function () {
        state.ignoreProgrammaticPause = false;
        state.ignorePauseTimer = 0;
      }, 3000);
      try { state.player.pauseVideo(); } catch (error) { /* Player may be unloading. */ }
    } else if (activeVideoState === state) {
      activeVideoState = null;
    }
  }

  function pauseOtherVideos(exceptState) {
    Object.keys(videoStates).forEach(function (id) {
      var state = videoStates[id];
      if (state !== exceptState) pauseProgrammatically(state);
    });
  }

  function applyPlaybackIntent(state) {
    if (!state || !state.player || !state.ready) return;
    if (!state.wantsPlay || state.manuallyPaused) {
      pauseProgrammatically(state);
      return;
    }

    try {
      if (state.lastStartMode === "manual") state.player.unMute();
      else state.player.mute();
      state.player.playVideo();
    } catch (error) {
      /* Leave the poster/button fallback available if the player cannot start. */
    }
  }

  function createYouTubePlayer(state) {
    var card = state.card;
    var project = state.project;
    var media = card && card.querySelector(".featured-media");
    if (!media) {
      state.pending = false;
      return;
    }

    var host = document.createElement("div");
    host.className = "featured-player-host";
    var playerNode = document.createElement("div");
    playerNode.id = "featured-player-" + project.id;
    host.appendChild(playerNode);
    media.appendChild(host);
    state.host = host;
    state.pending = true;

    try {
      state.player = new window.YT.Player(playerNode.id, {
        width: 640,
        height: 360,
        videoId: project.videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          origin: window.location.origin
        },
        events: {
          onReady: function (event) {
            state.player = event.target;
            state.ready = true;
            state.pending = false;
            if (state.readyTimer) {
              window.clearTimeout(state.readyTimer);
              state.readyTimer = 0;
            }

            if (!state.wantsPlay || state.manuallyPaused) {
              try { state.player.destroy(); } catch (error) { /* Ignore teardown errors. */ }
              clearPlayerHost(state);
              return;
            }

            media.classList.add("is-playing");
            applyPlaybackIntent(state);
          },
          onStateChange: function (event) {
            if (!window.YT || !window.YT.PlayerState) return;

            if (event.data === window.YT.PlayerState.PLAYING) {
              state.manuallyPaused = false;
              state.wantsPlay = true;
              activeVideoState = state;
              pauseOtherVideos(state);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              if (state.ignoreProgrammaticPause) {
                state.ignoreProgrammaticPause = false;
                if (state.ignorePauseTimer) {
                  window.clearTimeout(state.ignorePauseTimer);
                  state.ignorePauseTimer = 0;
                }
                if (activeVideoState === state) activeVideoState = null;
                return;
              }
              state.manuallyPaused = true;
              state.wantsPlay = false;
              if (activeVideoState === state) activeVideoState = null;
            } else if (event.data === window.YT.PlayerState.ENDED) {
              state.wantsPlay = false;
              if (activeVideoState === state) activeVideoState = null;
            }
          },
          onError: function () {
            clearPlayerHost(state);
          }
        }
      });

      state.readyTimer = window.setTimeout(function () {
        if (!state.ready) clearPlayerHost(state);
      }, 12000);
    } catch (error) {
      clearPlayerHost(state);
    }
  }

  function requestProjectVideo(card, project, mode) {
    if (!project || !project.videoId) return;
    var state = getVideoState(project, card);

    if (mode !== "manual" && state.manuallyPaused) return;

    if (mode === "manual") state.manuallyPaused = false;
    state.lastStartMode = mode;
    state.wantsPlay = true;
    pauseOtherVideos(state);

    if (state.player && state.ready) {
      applyPlaybackIntent(state);
      return;
    }
    if (state.pending) return;

    state.pending = true;
    ensureYouTubeApi(function (loaded) {
      state.pending = false;
      if (!loaded || !state.wantsPlay || state.manuallyPaused) return;
      if (state.player && state.ready) {
        applyPlaybackIntent(state);
        return;
      }
      if (!state.player) createYouTubePlayer(state);
    });
  }

  cards.forEach(function (card) {
    var project = projectById[card.dataset.projectId];
    if (!project || !project.videoId) return;

    card.addEventListener("click", function (event) {
      if (event.target.closest("a")) return;
      if (event.target.closest("iframe")) return;
      requestProjectVideo(card, project, "manual");
    });

    card.addEventListener("mouseenter", function () {
      if (!hoverQuery.matches) return;
      if (card._videoHoverTimer) window.clearTimeout(card._videoHoverTimer);
      card._videoHoverTimer = window.setTimeout(function () {
        requestProjectVideo(card, project, "auto");
      }, 2000);
    });

    card.addEventListener("mouseleave", function () {
      if (card._videoHoverTimer) {
        window.clearTimeout(card._videoHoverTimer);
        card._videoHoverTimer = 0;
      }
    });
  });

  function setMobileFocus(card) {
    if (mobileFocusCard === card) return;
    mobileFocusCard = card;

    if (!card) {
      pauseOtherVideos(null);
      return;
    }

    var project = projectById[card.dataset.projectId];
    if (!project || !project.videoId) {
      pauseOtherVideos(null);
      return;
    }

    var state = getVideoState(project, card);
    pauseOtherVideos(state);
    if (!state.manuallyPaused) requestProjectVideo(card, project, "auto");
  }

  function updateMobileFocus() {
    if (!mobileQuery.matches) {
      if (mobileFocusCard) setMobileFocus(null);
      return;
    }

    var trackRect = track.getBoundingClientRect();
    if (document.hidden || trackRect.bottom <= 0 || trackRect.top >= window.innerHeight) {
      setMobileFocus(null);
      return;
    }

    var trackCenter = trackRect.left + trackRect.width / 2;
    var bestCard = null;
    var bestDistance = Infinity;

    cards.forEach(function (card) {
      var rect = card.getBoundingClientRect();
      var visibleWidth = Math.max(0, Math.min(rect.right, trackRect.right) - Math.max(rect.left, trackRect.left));
      var visibleRatio = rect.width ? visibleWidth / rect.width : 0;
      if (visibleRatio < 0.5) return;

      var distance = Math.abs((rect.left + rect.right) / 2 - trackCenter);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestCard = card;
      }
    });

    setMobileFocus(bestCard);
  }

  function scheduleMobileFocusUpdate() {
    if (mobileFocusFrame) return;
    mobileFocusFrame = window.requestAnimationFrame(function () {
      mobileFocusFrame = 0;
      updateMobileFocus();
    });
  }


  var pageStops = [0], activePage = 0, scrollFrame = 0, resizeFrame = 0, suppressClickUntil = 0, drag = null;
  var desktopQuery = window.matchMedia("(min-width: 1024px)");
  var reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function collectPageStops() {
    if (desktopQuery.matches || !cards.length) return [0];

    var maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    var trackRect = track.getBoundingClientRect();
    var trackLeft = trackRect.left;
    var positions = [];

    cards.forEach(function (card) {
      var cardRect = card.getBoundingClientRect();
      var cardLeft = cardRect.left - trackLeft + track.scrollLeft;
      var position = mobileQuery.matches
        ? cardLeft + cardRect.width / 2 - track.clientWidth / 2
        : cardLeft;

      position = Math.max(0, Math.min(Math.round(position), Math.round(maxScroll)));
      positions.push(position);
    });

    /* Tablet keeps its two-card, start-aligned layout and trailing scroll stop. */
    if (!mobileQuery.matches && maxScroll > 1) positions.push(Math.round(maxScroll));

    positions.sort(function (a,b) { return a-b; });
    return positions.filter(function (value,index) {
      return index===0 || value-positions[index-1]>2;
    });
  }

  function nearestPage() {
    var nearest=0, distance=Infinity;
    pageStops.forEach(function (position,index) {
      var delta=Math.abs(position-track.scrollLeft);
      if(delta<distance){distance=delta;nearest=index;}
    });
    return nearest;
  }
  function updateControls() {
    activePage=nearestPage();
    var total=Math.max(1,pageStops.length);
    counter.textContent=String(activePage+1).padStart(2,"0")+" / "+String(total).padStart(2,"0");
    prevButton.disabled=desktopQuery.matches || activePage<=0;
    nextButton.disabled=desktopQuery.matches || activePage>=total-1;
    Array.prototype.forEach.call(dotsHost.children,function(dot,index){
      dot.setAttribute("aria-pressed",index===activePage?"true":"false");
    });
  }
  function goToPage(index) {
    if(!pageStops.length)return;
    var target=Math.max(0,Math.min(index,pageStops.length-1));
    track.scrollTo({left:pageStops[target],behavior:reducedMotionQuery.matches?"auto":"smooth"});
    activePage=target; updateControls();
  }
  function rebuildPagination(keepCurrent) {
    var oldPage=activePage;
    pageStops=collectPageStops();
    dotsHost.replaceChildren();
    pageStops.forEach(function(_position,index){
      var dot=document.createElement("button");
      dot.type="button";dot.className="featured-dot";
      dot.setAttribute("aria-label","Show featured project view "+(index+1));
      dot.setAttribute("aria-pressed","false");
      dot.addEventListener("click",function(){goToPage(index);});
      dotsHost.appendChild(dot);
    });
    activePage=keepCurrent?Math.min(oldPage,pageStops.length-1):0;
    track.scrollLeft=pageStops[activePage]||0;
    updateControls();
    scheduleMobileFocusUpdate();
  }

  prevButton.addEventListener("click",function(){goToPage(activePage-1);});
  nextButton.addEventListener("click",function(){goToPage(activePage+1);});
  track.addEventListener("scroll",function(){
    if(scrollFrame)return;
    scrollFrame=window.requestAnimationFrame(function(){scrollFrame=0;updateControls();scheduleMobileFocusUpdate();});
  },{passive:true});
  track.addEventListener("keydown",function(event){
    if(event.target.closest("a,button"))return;
    if(event.key==="ArrowRight"){event.preventDefault();goToPage(activePage+1);}
    else if(event.key==="ArrowLeft"){event.preventDefault();goToPage(activePage-1);}
  });

  /* Mouse grab-drag supplements native touch and trackpad scrolling. */
  track.addEventListener("pointerdown",function(event){
    if(event.pointerType!=="mouse"||event.button!==0||event.target.closest("a,button"))return;
    drag={x:event.clientX,scrollLeft:track.scrollLeft,moved:false,pointerId:event.pointerId};
    track.setPointerCapture(event.pointerId);
  });
  track.addEventListener("pointermove",function(event){
    if(!drag||event.pointerId!==drag.pointerId)return;
    var delta=event.clientX-drag.x;
    if(Math.abs(delta)>5)drag.moved=true;
    if(drag.moved){track.classList.add("is-dragging");track.scrollLeft=drag.scrollLeft-delta;event.preventDefault();}
  });
  function finishDrag(event){
    if(!drag||(event&&event.pointerId!==drag.pointerId))return;
    var moved=drag.moved;drag=null;track.classList.remove("is-dragging");
    if(moved){suppressClickUntil=Date.now()+250;goToPage(nearestPage());}
  }
  track.addEventListener("pointerup",finishDrag);
  track.addEventListener("pointercancel",finishDrag);
  track.addEventListener("lostpointercapture",finishDrag);
  track.addEventListener("click",function(event){
    if(Date.now()<suppressClickUntil){event.preventDefault();event.stopPropagation();}
  },true);

  function handleResize(){
    if(resizeFrame)return;
    resizeFrame=window.requestAnimationFrame(function(){resizeFrame=0;rebuildPagination(true);});
  }
  window.addEventListener("resize",handleResize,{passive:true});
  window.addEventListener("orientationchange",handleResize,{passive:true});
  window.addEventListener("scroll",scheduleMobileFocusUpdate,{passive:true});
  document.addEventListener("visibilitychange",function(){
    if(document.hidden) pauseOtherVideos(null);
    else scheduleMobileFocusUpdate();
  });
  if(mobileQuery.addEventListener)mobileQuery.addEventListener("change",scheduleMobileFocusUpdate);
  else if(mobileQuery.addListener)mobileQuery.addListener(scheduleMobileFocusUpdate);
  if(window.ResizeObserver){var observer=new ResizeObserver(handleResize);observer.observe(track);}
  if(desktopQuery.addEventListener)desktopQuery.addEventListener("change",handleResize);
  else if(desktopQuery.addListener)desktopQuery.addListener(handleResize);
  rebuildPagination(false);
  window.requestAnimationFrame(function(){rebuildPagination(true);});
})();
