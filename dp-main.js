// Direct Pumping - Main JavaScript

function dpInit() {

  // ── Quote Modal ──
  function openQuoteModal(type) {
    var modal = document.getElementById('quoteModal');
    if (!modal) return;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setType(type || 'residential');
  }

  function closeQuoteModal() {
    var modal = document.getElementById('quoteModal');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  function setType(type) {
    var title = document.getElementById('modalTitle');
    var badge = document.getElementById('modalBadge');
    var btnR = document.getElementById('btnResidential');
    var btnC = document.getElementById('btnCommercial');
    if (!title) return;
    if (type === 'residential') {
      title.textContent = 'Residential Service Quote';
      if (badge) badge.textContent = 'RESIDENTIAL';
      if (btnR) { btnR.style.background='#F5A800'; btnR.style.color='#1e1e1e'; }
      if (btnC) { btnC.style.background='rgba(255,255,255,0.05)'; btnC.style.color='#aaa'; }
    } else {
      title.textContent = 'Commercial Service Quote';
      if (badge) badge.textContent = 'COMMERCIAL';
      if (btnC) { btnC.style.background='#F5A800'; btnC.style.color='#1e1e1e'; }
      if (btnR) { btnR.style.background='rgba(255,255,255,0.05)'; btnR.style.color='#aaa'; }
    }
  }

  function submitQuoteForm() {
    var modal = document.getElementById('quoteModal');
    if (!modal) return;
    var inner = modal.querySelector('div[style*="max-width:480px"]') ||
                modal.querySelector('div[style*="max-width: 480px"]') ||
                modal.querySelector('div[style*="border-top:4px solid #F5A800"]') ||
                modal.lastElementChild;
    if (inner) {
      inner.innerHTML =
        '<div style="text-align:center;padding:40px 20px;">' +
        '<div style="font-size:3rem;margin-bottom:16px;">&#x2705;</div>' +
        '<h3 style="font-family:Barlow Condensed,sans-serif;font-weight:900;font-size:1.8rem;text-transform:uppercase;color:#ffffff;margin-bottom:12px;">Request Received!</h3>' +
        '<p style="color:#aaa;font-size:0.95rem;line-height:1.7;margin-bottom:24px;">Thanks! We'll be in touch within the hour.<br>For immediate help: <a href="tel:+18176680442" style="color:#F5A800;">(817) 668-0442</a></p>' +
        '<button id="dpCloseBtn" style="background:#F5A800;color:#1e1e1e;font-family:Barlow Condensed,sans-serif;font-weight:800;font-size:1rem;letter-spacing:0.1em;text-transform:uppercase;padding:14px 36px;border:none;border-radius:3px;cursor:pointer;">Close</button>' +
        '</div>';
      var cb = document.getElementById('dpCloseBtn');
      if (cb) cb.addEventListener('click', closeQuoteModal);
    }
  }

  // ── Service Area Map ──
  function openServiceAreaMap() {
    var modal = document.getElementById('serviceAreaModal');
    if (!modal) return;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(drawServiceMap, 100);
  }

  function closeServiceAreaMap() {
    var modal = document.getElementById('serviceAreaModal');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  function drawServiceMap() {
    var canvas = document.getElementById('serviceMapCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;
    var LAT_MIN=30.5, LAT_MAX=34.5, LON_MIN=-100.5, LON_MAX=-95.5;
    function toXY(lat,lon){return[(lon-LON_MIN)/(LON_MAX-LON_MIN)*W,(LAT_MAX-lat)/(LAT_MAX-LAT_MIN)*H];}
    var BLat=32.5421,BLon=-97.3208;
    var rx=(100/57/(LON_MAX-LON_MIN))*W;
    var ry=(100/69/(LAT_MAX-LAT_MIN))*H;
    var bg=ctx.createLinearGradient(0,0,W,H);
    bg.addColorStop(0,'#1a1a2e');bg.addColorStop(1,'#16213e');
    ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='rgba(255,255,255,0.04)';ctx.lineWidth=1;
    for(var lt=31;lt<=34;lt++){var y=toXY(lt,0)[1];ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    for(var ln=-100;ln<=-96;ln++){var x=toXY(0,ln)[0];ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    var tx=[[36.5,-103],[36.5,-100],[34,-100],[33.8,-99.8],[33.4,-99.5],[33.2,-99.3],[32.8,-99.2],[32,-99.1],[31.5,-100],[30.6,-104],[29.7,-104.5],[29.3,-103.5],[29,-102],[28.8,-100.5],[28.2,-99.5],[27.8,-99],[26.5,-99.1],[26,-97.5],[25.9,-97.4],[26,-97],[27,-97],[28,-96.5],[28.5,-96],[29,-95.2],[29.4,-94.8],[29.8,-93.9],[30,-93.5],[30.3,-93.7],[31,-93.5],[31.5,-93.8],[33,-94],[33.5,-94],[33.8,-94.5],[34,-94.6],[34.5,-94.6],[36.5,-94.6],[36.5,-103]];
    ctx.beginPath();
    tx.forEach(function(p,i){var xy=toXY(p[0],p[1]);if(i===0)ctx.moveTo(xy[0],xy[1]);else ctx.lineTo(xy[0],xy[1]);});
    ctx.closePath();ctx.fillStyle='rgba(255,255,255,0.04)';ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.12)';ctx.lineWidth=1.5;ctx.stroke();
    var c=toXY(BLat,BLon);
    var gr=ctx.createRadialGradient(c[0],c[1],rx*0.3,c[0],c[1],rx*1.1);
    gr.addColorStop(0,'rgba(245,168,0,0.15)');gr.addColorStop(0.7,'rgba(245,168,0,0.06)');gr.addColorStop(1,'rgba(245,168,0,0)');
    ctx.fillStyle=gr;ctx.beginPath();ctx.ellipse(c[0],c[1],rx*1.15,ry*1.15,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(c[0],c[1],rx,ry,0,0,Math.PI*2);
    ctx.fillStyle='rgba(245,168,0,0.13)';ctx.fill();
    ctx.strokeStyle='#F5A800';ctx.lineWidth=2.5;ctx.setLineDash([8,5]);ctx.stroke();ctx.setLineDash([]);
    var cities=[[32.5421,-97.3208,'Burleson (HQ)',true],[32.7555,-97.3308,'Fort Worth',false],[32.7767,-96.797,'Dallas',false],[32.7357,-97.1081,'Arlington',false],[31.5493,-97.1467,'Waco',false],[32.3479,-97.386,'Cleburne',false],[32.0079,-97.1322,'Hillsboro',false],[32.7596,-98.1114,'Weatherford',false],[32.0954,-96.4678,'Corsicana',false],[33.2148,-97.1331,'Denton',false],[32.9254,-96.6389,'Garland',false],[33.0137,-96.9989,'Lewisville',false],[32.4357,-96.8422,'Waxahachie',false],[33.1581,-97.0641,'McKinney',false],[32.5007,-97.6527,'Granbury',false]];
    cities.forEach(function(city){
      var xy=toXY(city[0],city[1]);
      if(city[3]){
        ctx.beginPath();ctx.arc(xy[0],xy[1],14,0,Math.PI*2);ctx.fillStyle='rgba(245,168,0,0.2)';ctx.fill();
        ctx.beginPath();ctx.arc(xy[0],xy[1],8,0,Math.PI*2);ctx.fillStyle='#F5A800';ctx.fill();
        ctx.beginPath();ctx.arc(xy[0],xy[1],4,0,Math.PI*2);ctx.fillStyle='#1e1e1e';ctx.fill();
        ctx.font='bold 11px sans-serif';ctx.fillStyle='#F5A800';ctx.textAlign='center';ctx.fillText(city[2],xy[0],xy[1]+24);
      } else {
        ctx.beginPath();ctx.arc(xy[0],xy[1],4,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.7)';ctx.fill();
        ctx.font='10px sans-serif';ctx.textAlign='left';
        var tw=ctx.measureText(city[2]).width;
        ctx.fillStyle='rgba(0,0,0,0.55)';ctx.fillRect(xy[0]+7,xy[1]-9,tw+6,14);
        ctx.fillStyle='#ddd';ctx.fillText(city[2],xy[0]+10,xy[1]+2);
      }
    });
    ctx.font='bold 11px sans-serif';ctx.fillStyle='#F5A800';ctx.textAlign='center';
    ctx.fillText('100 mi radius',c[0]+rx*0.72,c[1]-ry*0.72);
  }

  // ── Email links ──
  var emailLinks = document.querySelectorAll('.email-link');
  emailLinks.forEach(function(el) {
    el.setAttribute('href', 'mailto:service@directpumping.com');
  });

  // ── Event Delegation ──
  document.addEventListener('click', function(e) {
    var el = e.target.closest('[data-modal],[data-action],[data-type]');
    if (!el) return;
    var modal = el.getAttribute('data-modal');
    var action = el.getAttribute('data-action');
    var type = el.getAttribute('data-type');
    if (modal)  { e.preventDefault(); openQuoteModal(modal); }
    if (type)   { e.preventDefault(); setType(type); }
    if (action === 'close-quote')  { e.preventDefault(); closeQuoteModal(); }
    if (action === 'close-map')    { 
      e.preventDefault(); 
      closeServiceAreaMap(); 
      var afterModal = el.getAttribute('data-modal-after');
      if (afterModal) { setTimeout(function(){ openQuoteModal(afterModal); }, 200); }
    }
    if (action === 'submit-quote') { e.preventDefault(); submitQuoteForm(); }
    if (action === 'open-map')     { e.preventDefault(); openServiceAreaMap(); }
  });

  // Overlay clicks
  document.addEventListener('click', function(e) {
    var qm = document.getElementById('quoteModal');
    var sm = document.getElementById('serviceAreaModal');
    if (qm && e.target === qm) closeQuoteModal();
    if (sm && e.target === sm) closeServiceAreaMap();
  });

  // Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeQuoteModal(); closeServiceAreaMap(); }
  });
}

// Run on DOMContentLoaded AND immediately (handles both cases)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', dpInit);
} else {
  dpInit();
}
