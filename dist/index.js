var D = Object.defineProperty;
var y = (c, e, t) => e in c ? D(c, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : c[e] = t;
var i = (c, e, t) => (y(c, typeof e != "symbol" ? e + "" : e, t), t);
const g = (c = 5) => {
  let e = "";
  const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", n = t.length;
  let o = 0;
  for (; o < c; )
    e += t.charAt(Math.floor(Math.random() * n)), o += 1;
  return e;
}, s = "_accordion";
var r;
(function(c) {
  c.IS_SINGLE = "isSingle", c.IS_OPEN = "isOpen", c.ACCORDION_ID = "accordionId", c.ITEM_ID = "itemId", c.ITEMS_IDS = "itemsIds", c.SUMMARY_ELEMENT = "summaryElement", c.DETAILS_ELEMENT = "detailsElement";
})(r || (r = {}));
const m = {
  MANUAL: "manual",
  BREAKPOINT: "breakpoint"
}, p = "data-accordion-", f = {
  IS_SINGLE: `${p}is-single`
}, C = {
  openClass: "js--open",
  parentElement: document,
  accordionSelector: '[data-role="accordion"]',
  itemSelector: '[data-role="accordion-item"]',
  summarySelector: '[data-role="accordion-summary"]',
  detailsSelector: '[data-role="accordion-details"]',
  breakpoint: window.matchMedia("screen"),
  isSingle: !1,
  devMode: !1,
  on: {}
}, I = class {
  constructor(e = {}) {
    i(this, "instanceId");
    i(this, "openClass");
    i(this, "accordionSelector");
    i(this, "itemSelector");
    i(this, "summarySelector");
    i(this, "detailsSelector");
    i(this, "isSingle");
    i(this, "breakpoint");
    i(this, "parentElement");
    i(this, "elements");
    i(this, "itemElements");
    i(this, "isDestroyed");
    i(this, "destroyedBy");
    i(this, "devMode");
    i(this, "on");
    i(this, "updateInstanceId", () => {
      this.instanceId = I.generateInstanceId();
    });
    i(this, "generateAccordionId", (e) => `accordion-${this.instanceId}-${e}`);
    i(this, "generateItemId", (e) => `accordion-item-${this.instanceId}-${e}`);
    i(this, "generateSummaryId", (e) => `accordion-summary-${this.instanceId}-${e}`);
    i(this, "generateDetailsId", (e) => `accordion-details-${this.instanceId}-${e}`);
    i(this, "getItemById", (e) => this.itemElements.find((t) => {
      var n;
      return ((n = t[s]) == null ? void 0 : n[r.ITEM_ID]) === e;
    }));
    i(this, "getAccordionById", (e) => this.elements.find((t) => {
      var n;
      return ((n = t[s]) == null ? void 0 : n[r.ACCORDION_ID]) === e;
    }));
    i(this, "initAccordions", () => {
      if (this.devMode && !this.parentElement)
        throw new Error("Parent element is not defined | \u0420\u043E\u0434\u0438\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0439 \u044D\u043B\u0435\u043C\u0435\u043D\u0442 \u043D\u0435 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D");
      if (this.elements = Array.from(this.parentElement.querySelectorAll(this.accordionSelector)), this.elements.length === 0 && this.devMode)
        throw new Error(`Accordions not found. Check the selector ${this.accordionSelector} | \u0410\u043A\u043A\u043E\u0440\u0434\u0438\u043E\u043D\u044B \u043D\u0435 \u043D\u0430\u0438\u0306\u0434\u0435\u043D\u044B. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0441\u0435\u043B\u0435\u043A\u0442\u043E\u0440 ${this.accordionSelector}`);
      this.elements.forEach((e, t) => {
        this.initAccordion(e, t);
      });
    });
    i(this, "initAccordion", (e, t) => {
      var l;
      if (e[s])
        return;
      const n = (l = e.closest(this.itemSelector)) != null ? l : void 0;
      n && !n[s] && (n[s] = {});
      const o = n && n[s][r.ITEM_ID], u = e.hasAttribute(f.IS_SINGLE) ? e.getAttribute(f.IS_SINGLE) === "true" : this.isSingle;
      e[s] = {}, e[s][r.ACCORDION_ID] = String(t), e[s][r.ITEMS_IDS] = [], e[s][r.IS_SINGLE] = u, e.id = this.generateAccordionId(t), e.dataset.accordionRole = "parent";
      const a = Array.from(e.children).filter((h) => h.matches(this.itemSelector));
      if (a.length === 0 && this.devMode)
        throw new Error(`Accordion items not found. Check the selector ${this.itemSelector} | \u042D\u043B\u0435\u043C\u0435\u043D\u0442\u044B \u0430\u043A\u043A\u043E\u0440\u0434\u0438\u043E\u043D\u0430 \u043D\u0435 \u043D\u0430\u0438\u0306\u0434\u0435\u043D\u044B. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0441\u0435\u043B\u0435\u043A\u0442\u043E\u0440 ${this.itemSelector}`);
      a.forEach((h, A) => {
        const S = `${t}-${A}`;
        this.on.detailsTransitionEnd && h.addEventListener("transitionend", () => {
          this.on.detailsTransitionEnd(this);
        }), this.initItem({
          itemElement: h,
          itemId: S,
          accordionId: t,
          parentItemId: o
        }), e[s][r.ITEMS_IDS].push(S);
      });
    });
    i(this, "initItem", ({
      itemElement: e,
      itemId: t,
      accordionId: n
    }) => {
      var l, h;
      if (e[s])
        return;
      const o = (l = e.querySelector(this.summarySelector)) != null ? l : void 0;
      if (!o && this.devMode)
        throw new Error(`Accordion summary not found. Check the selector ${this.summarySelector} | \u0421\u0430\u043C\u043C\u0430\u0440\u0438 \u0430\u043A\u043A\u043E\u0440\u0434\u0438\u043E\u043D\u0430 \u043D\u0435 \u043D\u0430\u0438\u0306\u0434\u0435\u043D. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0441\u0435\u043B\u0435\u043A\u0442\u043E\u0440 ${this.summarySelector}`);
      const u = (h = e.querySelector(this.detailsSelector)) != null ? h : void 0;
      if (!u && this.devMode)
        throw new Error(`Accordion details not found. Check the selector ${this.detailsSelector} | \u041A\u043E\u043D\u0442\u0435\u043D\u0442 \u0430\u043A\u043A\u043E\u0440\u0434\u0438\u043E\u043D\u0430 \u043D\u0435 \u043D\u0430\u0438\u0306\u0434\u0435\u043D. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0441\u0435\u043B\u0435\u043A\u0442\u043E\u0440 ${this.detailsSelector}`);
      const d = this.generateSummaryId(t), a = this.generateDetailsId(t);
      e.id = this.generateItemId(t), e[s] = {}, e[s][r.ITEM_ID] = t, e[s][r.ACCORDION_ID] = String(n), e[s][r.SUMMARY_ELEMENT] = o, e[s][r.DETAILS_ELEMENT] = u, e.dataset.accordionRole = "item", this.itemElements.push(e), o.dataset.accordionRole = "summary", o.dataset.test = "summary", o.setAttribute("tabindex", "0"), o.setAttribute("id", d), o.setAttribute("aria-controls", a), o[s] = {}, o[s][r.ITEM_ID] = t, u.dataset.accordionRole = "details", u.setAttribute("inert", ""), u.setAttribute("id", a), u.setAttribute("aria-labelledby", d), u[s] = {}, u[s][r.ITEM_ID] = t, o.addEventListener("click", this.onSummaryClick);
    });
    i(this, "destroyAccordion", (e) => {
      const t = typeof e == "string" ? this.getAccordionById(e) : e;
      if (!t || !t[s])
        return;
      this.itemElements.filter((o) => !o[s] || !t[s] ? !1 : o[s][r.ACCORDION_ID] === t[s][r.ACCORDION_ID]).forEach((o) => {
        this.destroyItem(o);
      }), this.elements = this.elements.filter((o) => !o[s] || !t[s] ? !1 : o[s][r.ACCORDION_ID] !== t[s][r.ACCORDION_ID]), delete t[s], t.removeAttribute("id");
    });
    i(this, "destroyItem", (e) => {
      var u, d;
      const t = typeof e == "string" ? this.getItemById(e) : e;
      if (!t || !t[s])
        return;
      const n = (u = t[s][r.SUMMARY_ELEMENT]) != null ? u : void 0, o = (d = t[s][r.DETAILS_ELEMENT]) != null ? d : void 0;
      this.itemElements = this.itemElements.filter((a) => !a[s] || !t[s] ? !1 : a[s][r.ITEM_ID] !== t[s][r.ITEM_ID]), delete t[s], t.removeAttribute("id"), n && (n[s] && delete n[s], n.removeAttribute("id"), n.removeAttribute("aria-controls"), n.removeAttribute("aria-expanded")), delete o[s], o.removeAttribute("id"), o.removeAttribute("aria-labelledby"), o.removeAttribute("inert"), n.removeEventListener("click", this.onSummaryClick);
    });
    i(this, "onSummaryClick", (e) => {
      var n;
      if (!this.breakpoint.matches)
        return;
      const t = (n = e.currentTarget[s]) == null ? void 0 : n[r.ITEM_ID];
      t && this.toggle(t);
    });
    i(this, "onBreakpointChange", () => {
      this.breakpoint.matches ? this.isDestroyed && this.destroyedBy === m.BREAKPOINT && this.init() : this.isDestroyed || this.destroy(m.BREAKPOINT);
    });
    i(this, "init", () => {
      this.on.beforeInit && this.on.beforeInit(this), this.devMode && console.log("Accordions mode is enabled. Read the Docs https://www.npmjs.com/package/@digital-butlers/accordions"), this.updateInstanceId(), this.initAccordions(), this.isDestroyed = !1, this.destroyedBy = void 0, this.breakpoint.addEventListener("change", this.onBreakpointChange), this.onBreakpointChange(), this.closeAll(), this.on.afterInit && this.on.afterInit(this);
    });
    i(this, "destroy", (e = m.MANUAL) => {
      this.elements.forEach((t) => {
        this.destroyAccordion(t);
      }), this.isDestroyed = !0, this.destroyedBy = e;
    });
    i(this, "open", (e) => {
      var o, u, d;
      const t = typeof e == "string" ? this.getItemById(e) : e;
      if (!t || !t[s])
        return;
      if (t ? !t.classList.contains(this.openClass) : !1) {
        const a = this.getAccordionById((u = (o = t[s]) == null ? void 0 : o[r.ACCORDION_ID]) != null ? u : ""), l = t[s][r.DETAILS_ELEMENT], h = t[s][r.SUMMARY_ELEMENT];
        (d = a == null ? void 0 : a[s]) != null && d[r.IS_SINGLE] && this.closeAccordion(a), t[s][r.IS_OPEN] = !0, t.classList.add(this.openClass), h == null || h.setAttribute("aria-expanded", "true"), l == null || l.removeAttribute("inert"), this.on.open && this.on.open(this), this.on.toggle && this.on.toggle(this);
      }
    });
    i(this, "close", (e) => {
      var o, u;
      const t = typeof e == "string" ? this.getItemById(e) : e;
      if (t && !t[s] && (t[s] = {}), t == null ? void 0 : t.classList.contains(this.openClass)) {
        const d = (o = t == null ? void 0 : t[s]) == null ? void 0 : o[r.DETAILS_ELEMENT], a = (u = t == null ? void 0 : t[s]) == null ? void 0 : u[r.SUMMARY_ELEMENT];
        if (!d)
          return;
        t[s][r.IS_OPEN] = !1, t.classList.remove(this.openClass), a == null || a.setAttribute("aria-expanded", "false"), d.setAttribute("inert", ""), this.on.close && this.on.close(this), this.on.toggle && this.on.toggle(this);
      }
    });
    i(this, "toggle", (e) => {
      const t = typeof e == "string" ? this.getItemById(e) : e;
      t && !t[s] && (t[s] = {}), t && (t[s][r.IS_OPEN] ? this.close(t) : this.open(t));
    });
    i(this, "closeAccordion", (e) => {
      var o;
      const t = typeof e == "string" ? this.getAccordionById(e) : e;
      if (!t)
        return;
      t[s] || (t[s] = {}), ((o = t[s][r.ITEMS_IDS]) != null ? o : []).forEach((u) => {
        this.close(u);
      });
    });
    i(this, "closeAll", () => {
      this.elements.forEach((e) => {
        this.closeAccordion(e);
      });
    });
    const t = {
      ...C,
      ...e
    };
    this.instanceId = void 0, this.openClass = t.openClass, this.accordionSelector = t.accordionSelector, this.itemSelector = t.itemSelector, this.summarySelector = t.summarySelector, this.detailsSelector = t.detailsSelector, this.isSingle = t.isSingle, this.breakpoint = t.breakpoint, this.parentElement = t.parentElement, this.elements = [], this.itemElements = [], this.isDestroyed = !0, this.destroyedBy = void 0, this.devMode = t.devMode, this.on = t.on, this.init();
  }
};
let E = I;
i(E, "generateInstanceId", () => {
  const e = g();
  return I.isInstanceIdUnique(e) ? e : I.generateInstanceId();
}), i(E, "isInstanceIdUnique", (e) => !document.querySelector(`[id^="accordion-${e}]"`));
export {
  E as Accordions
};
