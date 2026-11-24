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
      description:"Modular finite-state-machine enemy AI for standalone Unity games and Photon Fusion 2 multiplayer.",
      contribution:"FSM architecture, target perception, reusable patrol / chase / attack behaviours, and the enemy configurator.",
      tags:["Unity","C#","Photon Fusion 2"], image:"assets/enemy-ai.webp", alt:"Enemy AI concept artwork", imageNote:"Concept artwork",
      detailsUrl:"projects.html#enemy-ai",
      externalUrl:"https://assetstore.unity.com/packages/tools/behavior-ai/enemy-ai-for-photon-fusion-2-networked-fsm-413184",
      externalLabel:"Unity Asset Store" },
    { id:"lbe-vr", type:"Company project", organization:"2 Dude Studios", title:"LBE VR",
      description:"A shared-space multiplayer VR arena with operator tools, arena configuration, and networked combat.",
      contribution:"Operator and host UI, match management, arena setup, Photon Fusion integration, and networked enemy AI.",
      tags:["Unity","Photon Fusion","VR"], image:"assets/lbe-vr.webp", alt:"LBE VR illustrative artwork", imageNote:"Illustrative concept art",
      detailsUrl:"projects.html#lbe-vr",
      externalUrl:"https://2dudestudios.com/industries/lbe", externalLabel:"Studio project" },
    { id:"fight-arena", type:"Personal project", organization:"Independent", title:"Fight Arena",
      description:"A Tekken-inspired 3D fighting prototype focused on movement, combat mechanics, and animation.",
      contribution:"Character movement, animation control, camera behaviour, arena boundaries, and gameplay UI.",
      tags:["Unity","C#","Gameplay"], image:"assets/fight-arena.webp", alt:"Fight Arena reference artwork", imageNote:"Reference artwork",
      detailsUrl:"projects.html#fight-arena",
      externalUrl:"https://github.com/utsavagarwal28/FightArena", externalLabel:"GitHub repository" }
  ];

  function renderCard(project) {
    var card = document.createElement("article");
    card.className = "featured-card";
    card.dataset.projectId = project.id;
    card.innerHTML =
      '<div class="featured-media"><img src="' + project.image + '" alt="' + project.alt + '" loading="lazy" decoding="async"><span class="featured-media-note">' + project.imageNote + '</span></div>' +
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
    return card;
  }

  track.replaceChildren();
  projects.forEach(function (project) { track.appendChild(renderCard(project)); });
  var cards = Array.prototype.slice.call(track.querySelectorAll(".featured-card"));
  var pageStops = [0], activePage = 0, scrollFrame = 0, resizeFrame = 0, suppressClickUntil = 0, drag = null;
  var desktopQuery = window.matchMedia("(min-width: 1024px)");
  var reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function collectPageStops() {
    if (desktopQuery.matches || !cards.length) return [0];
    var maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    var trackLeft = track.getBoundingClientRect().left;
    var positions = [0];
    cards.slice(1).forEach(function (card) {
      var position = Math.round(card.getBoundingClientRect().left - trackLeft + track.scrollLeft);
      if (position > 1 && position <= maxScroll + 1) positions.push(Math.min(position, Math.round(maxScroll)));
    });
    if (maxScroll > 1) positions.push(Math.round(maxScroll));
    positions.sort(function (a,b) { return a-b; });
    return positions.filter(function (value,index) { return index===0 || value-positions[index-1]>2; });
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
  }

  prevButton.addEventListener("click",function(){goToPage(activePage-1);});
  nextButton.addEventListener("click",function(){goToPage(activePage+1);});
  track.addEventListener("scroll",function(){
    if(scrollFrame)return;
    scrollFrame=window.requestAnimationFrame(function(){scrollFrame=0;updateControls();});
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
  if(window.ResizeObserver){var observer=new ResizeObserver(handleResize);observer.observe(track);}
  if(desktopQuery.addEventListener)desktopQuery.addEventListener("change",handleResize);
  else if(desktopQuery.addListener)desktopQuery.addListener(handleResize);
  rebuildPagination(false);
  window.requestAnimationFrame(function(){rebuildPagination(true);});
})();
