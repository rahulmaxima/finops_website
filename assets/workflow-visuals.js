/* Maxima Enterprise visuals. Drop-in, no dependencies.
   [data-mx-viz="flow"]    : four-frame "How it works" picture. On desktop it follows the
                             steps list named in data-mx-steps; under 961px, with no steps
                             list, or with data-mx-autoplay="true", it autoplays.
   [data-mx-viz="signoff"] : signed payment batch; stamps land once when it scrolls into view. */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  var wide=window.matchMedia('(min-width: 961px)');

  function initFlow(fig){
    var frames=[].slice.call(fig.querySelectorAll('.mx-fr'));
    var ticks=[].slice.call(fig.querySelectorAll('.mx-flow-ticks button'));
    var sel=fig.getAttribute('data-mx-steps');
    var steps=sel?[].slice.call(document.querySelectorAll(sel)):[];
    var capN=fig.querySelector('.mx-flow-cap .mx-cap-n'),capT=fig.querySelector('.mx-flow-cap .mx-ct');
    var always=fig.getAttribute('data-mx-autoplay')==='true'||!steps.length;
    if(!always&&steps[0].parentElement){steps[0].parentElement.classList.add('mx-steps-synced');fig.classList.add('mx-pinned');}
    var DWELL=5200,cur=-1,timer=null,held=false,seen=false,visible=false;
    fig.style.setProperty('--dwell',DWELL+'ms');

    function play(f){f.classList.remove('mx-play');void f.offsetWidth;f.classList.add('mx-play');}
    function auto(){return (always||!wide.matches)&&!reduce.matches&&!held&&visible;}
    function schedule(){
      clearTimeout(timer);fig.classList.toggle('mx-auto',auto());
      if(auto()) timer=setTimeout(function(){show((cur+1)%frames.length);},DWELL);
    }
    function show(i,force){
      if(i===cur&&!force) return; cur=i;
      frames.forEach(function(f,k){var on=k===i;f.classList.toggle('mx-on',on);if(on&&seen)play(f);else if(!on)f.classList.remove('mx-play');});
      ticks.forEach(function(t,k){
        t.classList.toggle('mx-on',k===i);t.classList.toggle('mx-done',k<i);
        if(k===i)t.setAttribute('aria-current','step');else t.removeAttribute('aria-current');
        var bar=t.querySelector('i');bar.style.animation='none';void bar.offsetWidth;bar.style.animation='';
      });
      steps.forEach(function(s,k){s.classList.toggle('mx-on',k===i);});
      if(capN){capN.textContent='0'+(i+1);var lbl=ticks[i]&&ticks[i].getAttribute('aria-label');capT.textContent=lbl?lbl.replace(/^Step \d+: /,'')+'.':'';}
      schedule();
    }
    function mid(el){var b=el.getBoundingClientRect();return b.top+b.height/2;}
    function sync(){
      if(always||!wide.matches) return;
      var c=mid(fig),best=0,bd=1e9;
      steps.forEach(function(s,k){var d=Math.abs(mid(s)-c);if(d<bd){bd=d;best=k;}});
      show(best);
    }
    ticks.forEach(function(t,k){t.addEventListener('click',function(){
      if(!always&&wide.matches&&steps[k]) window.scrollBy({top:mid(steps[k])-mid(fig),behavior:reduce.matches?'auto':'smooth'});
      else{held=true;show(k,true);}
    });});
    new IntersectionObserver(function(es){es.forEach(function(e){
      visible=e.isIntersecting;
      if(visible&&!seen){seen=true;if(cur>=0)play(frames[cur]);}
      schedule();
    });},{threshold:0.35}).observe(fig);
    var raf=0;
    window.addEventListener('scroll',function(){if(!raf)raf=requestAnimationFrame(function(){raf=0;sync();});},{passive:true});
    window.addEventListener('resize',function(){sync();schedule();});
    if(wide.addEventListener) wide.addEventListener('change',function(){sync();schedule();});
    show(0,true);sync();
  }

  function initSignoff(so){
    if(reduce.matches) return;
    so.classList.add('mx-arm');
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){so.classList.add('mx-stamped');so.classList.remove('mx-arm');io.disconnect();}
    });},{threshold:0.5});
    io.observe(so);
  }

  function boot(){
    if(!('IntersectionObserver' in window)) return;
    [].forEach.call(document.querySelectorAll('[data-mx-viz="flow"]'),initFlow);
    [].forEach.call(document.querySelectorAll('[data-mx-viz="signoff"]'),initSignoff);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
