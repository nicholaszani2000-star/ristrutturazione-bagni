/* =============================================================================
   EASY-BAGNO.IT — LOGICA DEL SITO
   =============================================================================
   Legge i dati da js/config.js e li mette nella pagina.
   Non serve modificare questo file per cambiare testi o numeri: si fa in config.js.

   Contenuto:
     1. Utility            6. Slider prima/dopo
     2. Tracking           7. FAQ
     3. Iniezione config   8. Form e invio lead
     4. Liste dinamiche    9. Avvio
     5. Calcolatore detrazione
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.CONFIG || {};

  /* ===========================================================================
     1. UTILITY
     ======================================================================== */

  /** Un valore tipo "[META PIXEL ID]" è un segnaposto: va ignorato. */
  function isPlaceholder(v) {
    return typeof v !== "string" || v.trim() === "" ||
           (v.trim().charAt(0) === "[" && v.trim().slice(-1) === "]");
  }

  /** Legge "business.phoneDisplay" dentro all'oggetto CONFIG. */
  function get(path) {
    return String(path).split(".").reduce(function (o, k) {
      return (o === null || o === undefined) ? undefined : o[k];
    }, CFG);
  }

  /** Rende sicuro un testo prima di inserirlo come HTML. */
  function esc(s) {
    return String(s === null || s === undefined ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function euro(n) {
    return "€ " + new Intl.NumberFormat("it-IT", { maximumFractionDigits: 0 }).format(Math.round(n));
  }

  /** "9.490" -> 9490 (il punto in italiano separa le migliaia). */
  function parseAmount(str) {
    var intPart = String(str).split(",")[0];
    var digits = intPart.replace(/[^\d]/g, "");
    return digits ? parseInt(digits, 10) : 0;
  }

  /** Mappa i nomi icona di config.js sugli id della libreria SVG nell'HTML. */
  var ICONS = {
    survey: "i-search", design: "i-pencil", demo: "i-hammer",
    plumbing: "i-wrench", tiles: "i-grid", keys: "i-key",
    price: "i-lock", cert: "i-cert", clock: "i-clock",
    shield: "i-users", local: "i-pin", receipt: "i-receipt"
  };
  function iconSvg(name, cls) {
    var id = ICONS[name] || "i-check";
    return '<svg viewBox="0 0 24 24" aria-hidden="true" class="' + (cls || "") + '"><use href="#' + id + '"/></svg>';
  }

  /* ===========================================================================
     2. TRACKING
     ===========================================================================
     Regola d'oro: si attiva SOLO con ID veri in config.js.
     Finché sono segnaposto, ogni evento finisce in console e nient'altro.
     Così non si "sporcano" i dati e non si rischia il problema classico:
     campagne che girano su un pixel sbagliato e conversioni a zero.
     ======================================================================== */

  var TRACK = { meta: false, ga4: false };

  function initTracking() {
    var pixelId = get("integrations.metaPixelId");
    var ga4Id   = get("integrations.ga4Id");

    // --- Meta Pixel ---
    if (!isPlaceholder(pixelId)) {
      /* eslint-disable */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
      (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      window.fbq("init", pixelId);
      window.fbq("track", "PageView");
      TRACK.meta = true;
    }

    // --- Google Analytics 4 ---
    if (!isPlaceholder(ga4Id)) {
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ga4Id);
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", ga4Id);
      TRACK.ga4 = true;
    }

    if (!TRACK.meta && !TRACK.ga4) {
      console.info("[track] Nessun ID di tracciamento configurato: gli eventi restano in console.");
    }
  }

  /**
   * Invia un evento a Meta e GA4.
   * @param {string} name   nome evento (es. "Lead")
   * @param {object} params dati aggiuntivi
   * @param {string} metaAs nome standard Meta, se diverso (es. "Contact")
   */
  function track(name, params, metaAs) {
    params = params || {};

    if (TRACK.meta) {
      var metaName = metaAs || name;
      var STANDARD = ["PageView", "ViewContent", "Lead", "Contact", "CompleteRegistration", "Schedule"];
      if (STANDARD.indexOf(metaName) !== -1) window.fbq("track", metaName, params);
      else window.fbq("trackCustom", metaName, params);
    }

    if (TRACK.ga4) {
      // GA4 vuole nomi in minuscolo con underscore
      window.gtag("event", name.toLowerCase().replace(/\s+/g, "_"), params);
    }

    if (!TRACK.meta && !TRACK.ga4) console.log("[track]", name, params);
  }

  /* --- Provenienza del visitatore (per capire quale campagna porta i lead) --- */
  function getSource() {
    var p = new URLSearchParams(window.location.search);
    var src = p.get("utm_source");
    var camp = p.get("utm_campaign");
    if (!src && p.get("fbclid")) src = "meta";         // click da Facebook/Instagram
    if (!src && document.referrer) {
      try { src = new URL(document.referrer).hostname.replace(/^www\./, ""); } catch (e) { /* referrer non valido */ }
    }
    return { fonte: src || "diretto", campagna: camp || "" };
  }

  /* --- Click tracciati tramite attributo data-track --- */
  function bindTrackedClicks() {
    $$("[data-track]").forEach(function (el) {
      el.addEventListener("click", function () {
        var evt = el.getAttribute("data-track");
        var pos = el.getAttribute("data-track-pos") || "";
        // phone_click e whatsapp_click valgono come "Contact" per Meta
        var metaAs = (evt === "phone_click" || evt === "whatsapp_click") ? "Contact" : null;
        track(evt, { posizione: pos }, metaAs);
      });
    });
  }

  /* --- ViewContent quando l'utente vede davvero la sezione offerta --- */
  function bindViewContent() {
    var target = $("[data-view-content]");
    if (!target || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          track("ViewContent", {
            content_name: get("offer.title") || "Offerta bagno",
            value: parseAmount(get("offer.price")),
            currency: "EUR"
          });
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(target);
  }

  /* ===========================================================================
     3. INIEZIONE DEI VALORI DI CONFIG
     ======================================================================== */

  function injectValues() {
    $$("[data-cfg]").forEach(function (el) {
      var val = get(el.getAttribute("data-cfg"));
      if (val === undefined || val === null) return;
      // I segnaposto non vengono scritti: resta il testo di riserva nell'HTML.
      if (typeof val === "string" && isPlaceholder(val)) {
        if (el.hasAttribute("hidden") === false && el.dataset.hideIfPlaceholder === "true") el.hidden = true;
        return;
      }
      el.textContent = val;
      if (el.hasAttribute("hidden")) el.hidden = false;
    });

    // Prezzo barrato: appare solo se è stato inserito un prezzo davvero praticato
    var wasEl = $(".price-was");
    if (wasEl) {
      var orig = get("offer.priceOriginal");
      if (isPlaceholder(orig)) wasEl.hidden = true;
      else { wasEl.textContent = get("offer.currency") + " " + orig; wasEl.hidden = false; }
    }
  }

  function injectLinks() {
    var b = CFG.business || {};

    $$("[data-tel]").forEach(function (a) { if (b.phoneRaw) a.href = "tel:" + b.phoneRaw; });

    if (b.whatsappNumber) {
      var wa = "https://wa.me/" + b.whatsappNumber +
               (b.whatsappMessage ? "?text=" + encodeURIComponent(b.whatsappMessage) : "");
      $$("[data-wa]").forEach(function (a) {
        a.href = wa; a.target = "_blank"; a.rel = "noopener";
      });
    }

    if (b.email && !isPlaceholder(b.email)) {
      var subj = encodeURIComponent("Richiesta preventivo ristrutturazione bagno");
      $$("[data-mail]").forEach(function (a) { a.href = "mailto:" + b.email + "?subject=" + subj; });
    }

    var legal = CFG.legal || {};
    if (legal.privacyUrl) $$("[data-privacy]").forEach(function (a) { a.href = legal.privacyUrl; });
    if (legal.cookieUrl)  $$("[data-cookie]").forEach(function (a) { a.href = legal.cookieUrl; });

    var y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ===========================================================================
     4. LISTE DINAMICHE
     ======================================================================== */

  /** Elenchi "cosa comprende" / "cosa non comprende". */
  function renderChecklists() {
    [["offer.included", "i-check"], ["offer.excluded", "i-dash"]].forEach(function (pair) {
      var ul = $('[data-list="' + pair[0] + '"]');
      if (!ul) return;
      var items = (get(pair[0]) || []).filter(function (t) { return !isPlaceholder(t); });
      if (!items.length) { ul.closest(".inclusions__col").hidden = true; return; }
      ul.innerHTML = items.map(function (t) {
        return '<li><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#' + pair[1] + '"/></svg><span>' + esc(t) + "</span></li>";
      }).join("");
    });
  }

  /** I 6 passaggi del processo. */
  function renderProcess() {
    var el = $("#process-grid");
    var items = get("process") || [];
    if (!el || !items.length) return;
    el.innerHTML = items.map(function (s, i) {
      return '<article class="card step">' +
        '<div><span class="ico-circle ico-circle--grad" aria-hidden="true">' + iconSvg(s.icon) + "</span>" +
        '<p class="step__n" style="margin:var(--sp-2) 0 0">' + ("0" + (i + 1)) + "</p></div>" +
        "<div><h3>" + esc(s.title) + "</h3><p>" + esc(s.text) + "</p></div>" +
        "</article>";
    }).join("");
  }

  /** I punti di forza rispetto alla concorrenza. */
  function renderDifferentiators() {
    var el = $("#diff-grid");
    var items = get("differentiators") || [];
    if (!el || !items.length) return;
    el.innerHTML = items.map(function (d) {
      return '<article class="card feature">' +
        '<span class="ico-circle ico-circle--soft" aria-hidden="true">' + iconSvg(d.icon) + "</span>" +
        "<div><h3>" + esc(d.title) + "</h3><p>" + esc(d.text) + "</p></div>" +
        "</article>";
    }).join("");
  }

  /** Recensioni: la sezione compare solo se in config.js ce ne sono di vere. */
  function renderReviews() {
    var section = $("[data-reviews-section]");
    var grid = $("#reviews-grid");
    var items = get("reviews") || [];
    if (!section || !grid || !items.length) return;

    grid.innerHTML = items.map(function (r) {
      var rating = Math.max(0, Math.min(5, parseInt(r.rating, 10) || 5));
      var stars = "";
      for (var i = 0; i < rating; i++) {
        stars += '<svg viewBox="0 0 24 24" style="width:18px;height:18px;color:#F0A93A" aria-hidden="true"><use href="#i-star"/></svg>';
      }
      return '<article class="card">' +
        '<div style="display:flex;gap:2px;margin-bottom:var(--sp-3)" aria-label="' + rating + ' stelle su 5">' + stars + "</div>" +
        "<p>" + esc(r.text) + "</p>" +
        '<p class="small muted" style="margin-top:var(--sp-3)"><strong>' + esc(r.name) + "</strong>" +
        (r.city ? " · " + esc(r.city) : "") + "</p></article>";
    }).join("");
    section.hidden = false;
  }

  /** Voci del menu a tendina "Cosa ti serve". */
  function renderFormOptions() {
    var sel = $("#f-tipo");
    var opts = get("form.interventionTypes") || [];
    if (!sel || !opts.length) return;
    sel.innerHTML = opts.map(function (o) {
      return '<option value="' + esc(o) + '">' + esc(o) + "</option>";
    }).join("");

    var inc = $("[data-incentive]");
    if (inc && get("form.emailIncentive.enabled") === true) inc.hidden = false;
  }

  /* ===========================================================================
     5. CALCOLATORE DETRAZIONE
     ======================================================================== */

  function initCalculator() {
    var amountEl = $("#calc-amount");
    var tc = CFG.taxCredit;
    if (!amountEl || !tc || tc.enabled !== true) return;

    var out = {
      spend: $("#calc-spend"), rate: $("#calc-rate"),
      credit: $("#calc-credit"), perYear: $("#calc-peryear"), real: $("#calc-real")
    };

    function update() {
      var type = ($('input[name="calc-type"]:checked') || {}).value || "primary";
      var rate = type === "primary" ? tc.ratePrimary : tc.rateSecondary;

      var spend = parseAmount(amountEl.value);
      // La detrazione si calcola al massimo sul tetto di spesa previsto
      var eligible = Math.min(spend, tc.maxSpend || spend);
      var credit = eligible * (rate / 100);

      out.spend.textContent   = euro(spend);
      out.rate.textContent    = rate;
      out.credit.textContent  = euro(credit);
      out.perYear.textContent = euro(credit / (tc.years || 10));
      out.real.textContent    = euro(spend - credit);
    }

    amountEl.addEventListener("input", update);
    // Riscrive l'importo in formato italiano quando l'utente esce dal campo
    amountEl.addEventListener("blur", function () {
      var n = parseAmount(amountEl.value);
      if (n) amountEl.value = new Intl.NumberFormat("it-IT").format(n);
    });
    $$('input[name="calc-type"]').forEach(function (r) { r.addEventListener("change", update); });

    // Parte dal prezzo dell'offerta
    var price = get("offer.price");
    if (!isPlaceholder(price)) amountEl.value = price;
    update();
  }

  /* ===========================================================================
     6. SLIDER PRIMA / DOPO
     ======================================================================== */

  function initBeforeAfter() {
    var box = $("#beforeAfter");
    var handle = $("#baHandle");
    if (!box || !handle) return;

    var pos = 50;

    function set(p) {
      pos = Math.max(0, Math.min(100, p));
      box.style.setProperty("--pos", pos + "%");
      handle.setAttribute("aria-valuenow", Math.round(pos));
    }

    function fromPointer(clientX) {
      var r = box.getBoundingClientRect();
      if (!r.width) return;
      set(((clientX - r.left) / r.width) * 100);
    }

    var dragging = false;

    box.addEventListener("pointerdown", function (e) {
      dragging = true;
      // Prima si sposta, poi si cattura il puntatore: su touch setPointerCapture
      // puo' fallire e non deve impedire allo slider di rispondere al tocco.
      fromPointer(e.clientX);
      try { box.setPointerCapture(e.pointerId); } catch (err) { /* touch: non supportato */ }
    });
    box.addEventListener("pointermove", function (e) {
      if (dragging) { e.preventDefault(); fromPointer(e.clientX); }
    });
    ["pointerup", "pointercancel"].forEach(function (evt) {
      box.addEventListener(evt, function () { dragging = false; });
    });

    // Tastiera: frecce, Home e Fine
    handle.addEventListener("keydown", function (e) {
      var step = e.shiftKey ? 10 : 2;
      var map = { ArrowLeft: -step, ArrowRight: step, ArrowDown: -step, ArrowUp: step, Home: -100, End: 100 };
      if (!(e.key in map)) return;
      e.preventDefault();
      set(e.key === "Home" ? 0 : e.key === "End" ? 100 : pos + map[e.key]);
    });
    // Il click sulla maniglia non deve far saltare il cursore
    handle.addEventListener("click", function (e) { e.preventDefault(); });

    set(50);
  }

  /* ===========================================================================
     7. FAQ (accordion accessibile)
     ======================================================================== */

  function renderFaq() {
    var wrap = $("#faqList");
    var items = (get("faq") || []).filter(function (f) { return f && f.q; });
    if (!wrap || !items.length) return;

    wrap.innerHTML = items.map(function (f, i) {
      return '<div class="faq__item">' +
        '<h3 style="margin:0">' +
        '<button class="faq__q" type="button" aria-expanded="false" aria-controls="faq-a-' + i + '" id="faq-q-' + i + '">' +
        "<span>" + esc(f.q) + "</span>" +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-chev"/></svg>' +
        "</button></h3>" +
        '<div class="faq__a" id="faq-a-' + i + '" role="region" aria-labelledby="faq-q-' + i + '" hidden>' +
        "<p>" + esc(f.a) + "</p></div></div>";
    }).join("");

    $$(".faq__q", wrap).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        $("#" + btn.getAttribute("aria-controls")).hidden = open;
      });
    });
  }

  /* ===========================================================================
     8. FORM E INVIO DEL LEAD
     ======================================================================== */

  /**
   * SALVATAGGIO DEL LEAD — FASE 2
   * -----------------------------------------------------------------------
   * Oggi questa funzione NON invia niente: gli endpoint in config.js sono
   * ancora segnaposto, quindi il payload finisce solo in console.
   *
   * Appena incolli un valore vero in config.js, il ramo corrispondente si
   * attiva da solo:
   *   A) integrations.leadsEndpoint -> POST al tuo webhook (n8n / Edge Function)
   *   B) integrations.supabaseUrl + supabaseAnonKey -> insert nella tabella
   *
   * Istruzioni passo-passo nel README.md.
   */
  function saveLead(payload) {
    var I = CFG.integrations || {};

    // --- A) Webhook (n8n oppure Supabase Edge Function) -------------------
    if (!isPlaceholder(I.leadsEndpoint)) {
      return fetch(I.leadsEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).then(function (r) {
        if (!r.ok) throw new Error("Endpoint ha risposto " + r.status);
        return true;
      });
    }

    // --- B) Inserimento diretto su tabella Supabase -----------------------
    if (!isPlaceholder(I.supabaseUrl) && !isPlaceholder(I.supabaseAnonKey)) {
      var url = I.supabaseUrl.replace(/\/+$/, "") + "/rest/v1/" + (I.supabaseTable || "leads");
      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": I.supabaseAnonKey,
          "Authorization": "Bearer " + I.supabaseAnonKey,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(payload)
      }).then(function (r) {
        if (!r.ok) throw new Error("Supabase ha risposto " + r.status);
        return true;
      });
    }

    // --- Nessuna integrazione attiva: modalità prova ---------------------
    console.groupCollapsed("%c[lead] Nuovo lead (non inviato: integrazioni non collegate)", "color:#1B84DD;font-weight:bold");
    console.table(payload);
    console.groupEnd();
    return Promise.resolve(false);
  }

  /* ---------------------------------------------------------------------------
     HOOK META CAPI (CONVERSIONS API) — DA COLLEGARE IN FASE 2
     ---------------------------------------------------------------------------
     Il pixel nel browser da solo perde molte conversioni: adblocker, iOS,
     cookie di terze parti. La Conversions API manda l'evento Lead anche dal
     server, e i due si uniscono grazie a event_id uguale (deduplica).

     Serve una funzione serverless (Netlify Function o Supabase Edge Function)
     che riceva questi dati e chiami la Graph API di Meta con l'access token.
     Il token NON va MAI messo qui: sta nelle variabili d'ambiente del server.

     Per attivarlo: togli i commenti qui sotto e chiama sendLeadToCapi(payload,
     eventId) dentro al blocco di successo dell'invio del form.

  function sendLeadToCapi(payload, eventId) {
    return fetch("/.netlify/functions/meta-capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: "Lead",
        event_id: eventId,                          // stesso id passato al pixel
        event_source_url: window.location.href,
        user_data: {                                // il server deve fare l'hash SHA-256
          em: payload.email || null,
          ph: payload.telefono || null
        },
        custom_data: { content_name: payload.tipo_intervento, currency: "EUR" }
      })
    }).catch(function (e) { console.warn("CAPI non raggiungibile", e); });
  }
  --------------------------------------------------------------------------- */

  function initForm() {
    var form = $("#leadForm");
    var success = $("#formSuccess");
    if (!form || !success) return;

    var btn = $("#submitBtn");
    var started = false;

    // "form_start": la prima volta che l'utente tocca il modulo
    form.addEventListener("input", function () {
      if (started) return;
      started = true;
      track("form_start", {});
    }, { once: false });

    function setError(field, msg) {
      var input = $("#f-" + field);
      var err = $("#e-" + field);
      if (err) err.textContent = msg || "";
      if (input) {
        if (msg) input.setAttribute("aria-invalid", "true");
        else input.removeAttribute("aria-invalid");
      }
      return !msg;
    }

    function validate() {
      var ok = true;
      var v = function (id) { var el = $("#f-" + id); return el ? el.value.trim() : ""; };

      ok = setError("nome", v("nome").length < 2 ? "Scrivi il tuo nome." : "") && ok;

      // Numero italiano: almeno 8 cifre, accetta spazi, punti, +39
      var tel = v("telefono").replace(/[\s.\-()]/g, "");
      ok = setError("telefono", !/^(\+?\d{8,15})$/.test(tel) ? "Inserisci un numero di telefono valido." : "") && ok;

      var mail = v("email");
      ok = setError("email", mail && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(mail) ? "Controlla l'indirizzo email." : "") && ok;

      ok = setError("comune", v("comune").length < 2 ? "Indica il comune o il CAP." : "") && ok;

      var privacy = $("#f-privacy");
      var privacyOk = privacy && privacy.checked;
      var pErr = $("#e-privacy");
      if (pErr) pErr.textContent = privacyOk ? "" : "Devi accettare l'informativa privacy per proseguire.";
      if (!privacyOk) ok = false;

      return ok;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Trappola anti-spam: se è compilata, è un bot. Fingiamo che sia andata bene.
      if ($("#f-website") && $("#f-website").value) { form.hidden = true; success.hidden = false; return; }

      if (!validate()) {
        var firstBad = $('[aria-invalid="true"]') || $("#f-privacy");
        if (firstBad) firstBad.focus();
        return;
      }

      var src = getSource();
      var payload = {
        data: new Date().toISOString(),
        nome: $("#f-nome").value.trim(),
        telefono: $("#f-telefono").value.trim(),
        email: $("#f-email").value.trim(),
        comune: $("#f-comune").value.trim(),
        tipo_intervento: $("#f-tipo").value,
        messaggio: $("#f-messaggio").value.trim(),
        consenso_marketing: $("#f-marketing").checked,
        fonte: src.fonte,
        campagna: src.campagna,
        stato: "Nuovo",
        pagina: window.location.href
      };

      btn.disabled = true;
      btn.textContent = "Invio in corso…";

      saveLead(payload)
        .catch(function (err) {
          // Il lead non deve andare perso: lo registriamo e mostriamo comunque
          // la conferma, così l'utente può passare a WhatsApp o telefono.
          console.error("[lead] invio fallito:", err);
          console.table(payload);
        })
        .then(function () {
          // Conversione principale
          track("Lead", {
            content_name: payload.tipo_intervento,
            value: parseAmount(get("offer.price")),
            currency: "EUR",
            fonte: payload.fonte,
            campagna: payload.campagna
          });

          // FASE 2: qui va la chiamata a sendLeadToCapi(payload, eventId)

          form.hidden = true;
          success.hidden = false;
          success.setAttribute("tabindex", "-1");
          success.focus();
          success.scrollIntoView({ block: "center", behavior: "smooth" });
        });
    });
  }

  /* ===========================================================================
     9. AVVIO
     ======================================================================== */

  function init() {
    initTracking();
    injectValues();
    injectLinks();
    renderChecklists();
    renderProcess();
    renderDifferentiators();
    renderReviews();
    renderFormOptions();
    renderFaq();
    initCalculator();
    initBeforeAfter();
    initForm();
    bindTrackedClicks();
    bindViewContent();
    track("PageView", { pagina: document.title });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
