// Direct Pumping - Main JavaScript
// All interactive functionality

(function() {

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
    var inner = modal.querySelector('[style*="max-width:480px"]');
    if (!inner) inner = modal.querySelector('[style*="max-width: 480px"]');
    if (inner) {
      inner.innerHTML = '<div style="text-align:center;padding:40px 20px;">' +
        '<div style="font-size:3rem;margin-bottom:16px;">&#x2705;</div>' +
        '<h3 style="font-family:Barlow Condensed,sans-serif;font-weight:900;font-size:1.8rem;text-transform:uppercase;color:#ffffff;margin-bottom:12px;">Request Received!</h3>' +
        '<p style="color:#aaa;font-size:0.95rem;line-height:1.7;margin-bottom:24px;">Thanks for reaching out. We'll be in touch within the hour.<br>For immediate help call <a href="tel:+18176680442" style="color:#F5A800;">(817) 668-0442</a></p>' +
        '<button id="closeAfterSubmit" style="background:#F5A800;color:#1e1e1e;font-family:Barlow Condensed,sans-serif;font-weight:800;font-size:1rem;letter-spacing:0.1em;text-transform:uppercase;padding:14px 36px;border:none;border-radius:3px;cursor:pointer;">Close</button>' +
        '</div>';
      document.getElementById('closeAfterSubmit').addEventListener('click', closeQuoteModal);
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

    var LAT_MIN = 30.5, LAT_MAX = 34.5, LON_MIN = -100.5, LON_MAX = -95.5;

    function toXY(lat, lon) {
      var x = (lon - LON_MIN) / (LON_MAX - LON_MIN) * W;
      var y = (LAT_MAX - lat) / (LAT_MAX - LAT_MIN) * H;
      return [x, y];
    }

    var BURLESON_LAT = 32.5421, BURLESON_LON = -97.3208;
    var RADIUS_LAT_DEG = 100 / 69;
    var RADIUS_LON_DEG = 100 / 57;

    // Background
    var bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#1a1a2e');
    bgGrad.addColorStop(1, '#16213e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (var lat = 31; lat <= 34; lat++) {
      var y = toXY(lat, 0)[1];
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    for (var lon = -100; lon <= -96; lon++) {
      var x = toXY(0, lon)[0];
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }

    // Texas outline
    var texasPoints = [
      [36.5,-103],[36.5,-100],[34.0,-100],[33.8,-99.8],[33.4,-99.5],
      [33.2,-99.3],[32.8,-99.2],[32.0,-99.1],[31.5,-100.0],[30.6,-104.0],
      [29.7,-104.5],[29.3,-103.5],[29.0,-102.0],[28.8,-100.5],[28.2,-99.5],
      [27.8,-99.0],[26.5,-99.1],[26.0,-97.5],[25.9,-97.4],[26.0,-97.0],
      [27.0,-97.0],[28.0,-96.5],[28.5,-96.0],[29.0,-95.2],[29.4,-94.8],
      [29.8,-93.9],[30.0,-93.5],[30.3,-93.7],[31.0,-93.5],[31.5,-93.8],
      [33.0,-94.0],[33.5,-94.0],[33.8,-94.5],[34.0,-94.6],[34.5,-94.6],
      [36.5,-94.6],[36.5,-103]
    ];
    ctx.beginPath();
    texasPoints.forEach(function(p, i) {
      var xy = toXY(p[0], p[1]);
      if (i === 0) ctx.moveTo(xy[0], xy[1]);
      else ctx.lineTo(xy[0], xy[1]);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Service radius
    var center = toXY(BURLESON_LAT, BURLESON_LON);
    var rx = (RADIUS_LON_DEG / (LON_MAX - LON_MIN)) * W;
    var ry = (RADIUS_LAT_DEG / (LAT_MAX - LAT_MIN)) * H;

    var grad = ctx.createRadialGradient(center[0], center[1], rx*0.3, center[0], center[1], rx*1.1);
    grad.addColorStop(0, 'rgba(245,168,0,0.15)');
    grad.addColorStop(0.7, 'rgba(245,168,0,0.06)');
    grad.addColorStop(1, 'rgba(245,168,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(center[0], center[1], rx*1.15, ry*1.15, 0, 0, Math.PI*2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(center[0], center[1], rx, ry, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(245,168,0,0.13)';
    ctx.fill();
    ctx.strokeStyle = '#F5A800';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Cities
    var cities = [
      [32.5421, -97.3208, 'Burleson (HQ)', true],
      [32.7555, -97.3308, 'Fort Worth', false],
      [32.7767, -96.7970, 'Dallas', false],
      [32.7357, -97.1081, 'Arlington', false],
      [31.5493, -97.1467, 'Waco', false],
      [32.3479, -97.3860, 'Cleburne', false],
      [32.0079, -97.1322, 'Hillsboro', false],
      [32.7596, -98.1114, 'Weatherford', false],
      [32.0954, -96.4678, 'Corsicana', false],
      [33.2148, -97.1331, 'Denton', false],
      [32.9254, -96.6389, 'Garland', false],
      [33.0137, -96.9989, 'Lewisville', false],
      [32.4357, -96.8422, 'Waxahachie', false],
      [33.1581, -97.0641, 'McKinney', false],
      [32.5007, -97.6527, 'Granbury', false],
    ];

    cities.forEach(function(city) {
      var xy = toXY(city[0], city[1]);
      var isMain = city[3];
      var name = city[2];

      if (isMain) {
        ctx.beginPath();
        ctx.arc(xy[0], xy[1], 14, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(245,168,0,0.2)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(xy[0], xy[1], 8, 0, Math.PI*2);
        ctx.fillStyle = '#F5A800';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(xy[0], xy[1], 4, 0, Math.PI*2);
        ctx.fillStyle = '#1e1e1e';
        ctx.fill();
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#F5A800';
        ctx.textAlign = 'center';
        ctx.fillText(name, xy[0], xy[1] + 24);
      } else {
        ctx.beginPath();
        ctx.arc(xy[0], xy[1], 4, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fill();
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'left';
        var tw = ctx.measureText(name).width;
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(xy[0]+7, xy[1]-9, tw+6, 14);
        ctx.fillStyle = '#ddd';
        ctx.fillText(name, xy[0]+10, xy[1]+2);
      }
    });

    // 100 mi label
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#F5A800';
    ctx.textAlign = 'center';
    ctx.fillText('100 mi radius', center[0] + rx * 0.72, center[1] - ry * 0.72);
  }

  // ── Event Delegation - handles ALL buttons ──
  document.addEventListener('click', function(e) {
    var el = e.target.closest('[data-modal],[data-action],[data-type]');
    if (!el) return;

    var modal = el.getAttribute('data-modal');
    var action = el.getAttribute('data-action');
    var type = el.getAttribute('data-type');

    if (modal) { e.preventDefault(); openQuoteModal(modal); }
    if (type) { e.preventDefault(); setType(type); }
    if (action === 'close-quote') { e.preventDefault(); closeQuoteModal(); }
    if (action === 'close-map') { e.preventDefault(); closeServiceAreaMap(); }
    if (action === 'submit-quote') { e.preventDefault(); submitQuoteForm(); }
    if (action === 'open-map') { e.preventDefault(); openServiceAreaMap(); }
  });

  // Overlay click to close
  document.addEventListener('click', function(e) {
    var qm = document.getElementById('quoteModal');
    var sm = document.getElementById('serviceAreaModal');
    if (qm && e.target === qm) closeQuoteModal();
    if (sm && e.target === sm) closeServiceAreaMap();
  });

  // Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeQuoteModal();
      closeServiceAreaMap();
    }
  });

})();
