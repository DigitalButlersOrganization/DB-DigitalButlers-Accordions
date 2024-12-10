var D = Object.defineProperty;
var y = (d, e, t) => e in d ? D(d, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : d[e] = t;
var i = (d, e, t) => (y(d, typeof e != "symbol" ? e + "" : e, t), t);
const g = (d = 5) => {
  let e = "";
  const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", r = t.length;
  let n = 0;
  for (; n < d; )
    e += t.charAt(Math.floor(Math.random() * r)), n += 1;
  return e;
}, s = "_accordion";
var o;
(function(d) {
  d.IS_SINGLE = "isSingle", d.IS_OPEN = "isOpen", d.ACCORDION_ID = "accordionId", d.ITEM_ID = "itemId", d.ITEMS_IDS = "itemsIds", d.SUMMARY_ELEMENT = "summaryElement", d.DETAILS_ELEMENT = "detailsElement";
})(o || (o = {}));
const S = {
  MANUAL: "manual",
  BREAKPOINT: "breakpoint"
}, p = "data-accordion-", A = {
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
      var r;
      return ((r = t[s]) == null ? void 0 : r[o.ITEM_ID]) === e;
    }));
    i(this, "getAccordionById", (e) => this.elements.find((t) => {
      var r;
      return ((r = t[s]) == null ? void 0 : r[o.ACCORDION_ID]) === e;
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
      const r = (l = e.closest(this.itemSelector)) != null ? l : void 0;
      r && !r[s] && (r[s] = {});
      const n = r && r[s][o.ITEM_ID], u = e.hasAttribute(A.IS_SINGLE) ? e.getAttribute(A.IS_SINGLE) === "true" : this.isSingle;
      e[s] = {}, e[s][o.ACCORDION_ID] = String(t), e[s][o.ITEMS_IDS] = [], e[s][o.IS_SINGLE] = u, e.id = this.generateAccordionId(t), e.dataset.accordionRole = "parent";
      const c = Array.from(e.children).filter((h) => h.matches(this.itemSelector));
      if (c.length === 0 && this.devMode)
        throw new Error(`Accordion items not found. Check the selector ${this.itemSelector} | \u042D\u043B\u0435\u043C\u0435\u043D\u0442\u044B \u0430\u043A\u043A\u043E\u0440\u0434\u0438\u043E\u043D\u0430 \u043D\u0435 \u043D\u0430\u0438\u0306\u0434\u0435\u043D\u044B. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0441\u0435\u043B\u0435\u043A\u0442\u043E\u0440 ${this.itemSelector}`);
      c.forEach((h, E) => {
        const f = `${t}-${E}`;
        this.initItem({
          itemElement: h,
          itemId: f,
          accordionId: t,
          parentItemId: n
        }), e[s][o.ITEMS_IDS].push(f);
      });
    });
    i(this, "initItem", ({ itemElement: e, itemId: t, accordionId: r, parentItemId: n }) => {
      var h, E;
      if (e[s])
        return;
      const u = (h = e.querySelector(this.summarySelector)) != null ? h : void 0;
      if (!u && this.devMode)
        throw new Error(`Accordion summary not found. Check the selector ${this.summarySelector} | \u0421\u0430\u043C\u043C\u0430\u0440\u0438 \u0430\u043A\u043A\u043E\u0440\u0434\u0438\u043E\u043D\u0430 \u043D\u0435 \u043D\u0430\u0438\u0306\u0434\u0435\u043D. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0441\u0435\u043B\u0435\u043A\u0442\u043E\u0440 ${this.summarySelector}`);
      const a = (E = e.querySelector(this.detailsSelector)) != null ? E : void 0;
      if (!a && this.devMode)
        throw new Error(`Accordion details not found. Check the selector ${this.detailsSelector} | \u041A\u043E\u043D\u0442\u0435\u043D\u0442 \u0430\u043A\u043A\u043E\u0440\u0434\u0438\u043E\u043D\u0430 \u043D\u0435 \u043D\u0430\u0438\u0306\u0434\u0435\u043D. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0441\u0435\u043B\u0435\u043A\u0442\u043E\u0440 ${this.detailsSelector}`);
      const c = this.generateSummaryId(t), l = this.generateDetailsId(t);
      e.id = this.generateItemId(t), e[s] = {}, e[s][o.ITEM_ID] = t, e[s][o.ACCORDION_ID] = String(r), e[s][o.SUMMARY_ELEMENT] = u, e[s][o.DETAILS_ELEMENT] = a, e.dataset.accordionRole = "item", this.itemElements.push(e), u.dataset.accordionRole = "summary", u.dataset.test = "summary", u.setAttribute("tabindex", "0"), u.setAttribute("id", c), u.setAttribute("aria-controls", l), u[s] = {}, u[s][o.ITEM_ID] = t, a.dataset.accordionRole = "details", a.setAttribute("id", l), a.setAttribute("aria-labelledby", c), a[s] = {}, a[s][o.ITEM_ID] = t, n && this.on.detailsTransitionEnd && a.addEventListener("transitionend", () => {
        this.on.detailsTransitionEnd(this);
      }), u.addEventListener("click", this.onSummaryClick);
    });
    i(this, "destroyAccordion", (e) => {
      const t = typeof e == "string" ? this.getAccordionById(e) : e;
      if (!t || !t[s])
        return;
      this.itemElements.filter((n) => !n[s] || !t[s] ? !1 : n[s][o.ACCORDION_ID] === t[s][o.ACCORDION_ID]).forEach((n) => {
        this.destroyItem(n);
      }), this.elements = this.elements.filter((n) => !n[s] || !t[s] ? !1 : n[s][o.ACCORDION_ID] !== t[s][o.ACCORDION_ID]), delete t[s], t.removeAttribute("id");
    });
    i(this, "destroyItem", (e) => {
      var u, a;
      const t = typeof e == "string" ? this.getItemById(e) : e;
      if (!t || !t[s])
        return;
      const r = (u = t[s][o.SUMMARY_ELEMENT]) != null ? u : void 0, n = (a = t[s][o.DETAILS_ELEMENT]) != null ? a : void 0;
      this.itemElements = this.itemElements.filter((c) => !c[s] || !t[s] ? !1 : c[s][o.ITEM_ID] !== t[s][o.ITEM_ID]), delete t[s], t.removeAttribute("id"), r && (r[s] && delete r[s], r.removeAttribute("id"), r.removeAttribute("aria-controls"), r.removeAttribute("aria-expanded")), delete n[s], n.removeAttribute("id"), n.removeAttribute("aria-labelledby"), n.removeAttribute("inert"), r.removeEventListener("click", this.onSummaryClick);
    });
    i(this, "onSummaryClick", (e) => {
      var r;
      if (!this.breakpoint.matches)
        return;
      const t = (r = e.currentTarget[s]) == null ? void 0 : r[o.ITEM_ID];
      t && this.toggle(t);
    });
    i(this, "onBreakpointChange", () => {
      this.breakpoint.matches ? this.isDestroyed && this.destroyedBy === S.BREAKPOINT && this.init() : this.isDestroyed || this.destroy(S.BREAKPOINT);
    });
    i(this, "init", () => {
      this.on.beforeInit && this.on.beforeInit(this), this.updateInstanceId(), this.initAccordions(), this.isDestroyed = !1, this.destroyedBy = void 0, this.breakpoint.addEventListener("change", this.onBreakpointChange), this.onBreakpointChange(), this.closeAll(), this.on.afterInit && this.on.afterInit(this);
    });
    i(this, "destroy", (e = S.MANUAL) => {
      this.elements.forEach((t) => {
        this.destroyAccordion(t);
      }), this.isDestroyed = !0, this.destroyedBy = e;
    });
    i(this, "open", (e) => {
      var n, u, a;
      const t = typeof e == "string" ? this.getItemById(e) : e;
      if (!t || !t[s])
        return;
      if (t ? !t.classList.contains(this.openClass) : !1) {
        const c = this.getAccordionById((u = (n = t[s]) == null ? void 0 : n[o.ACCORDION_ID]) != null ? u : ""), l = t[s][o.DETAILS_ELEMENT], h = t[s][o.SUMMARY_ELEMENT];
        (a = c == null ? void 0 : c[s]) != null && a[o.IS_SINGLE] && this.closeAccordion(c), t[s][o.IS_OPEN] = !0, t.classList.add(this.openClass), h == null || h.setAttribute("aria-expanded", "true"), l == null || l.removeAttribute("inert"), this.on.open && this.on.open(this), this.on.toggle && this.on.toggle(this);
      }
    });
    i(this, "close", (e) => {
      var n, u;
      const t = typeof e == "string" ? this.getItemById(e) : e;
      if (t && !t[s] && (t[s] = {}), t == null ? void 0 : t.classList.contains(this.openClass)) {
        const a = (n = t == null ? void 0 : t[s]) == null ? void 0 : n[o.DETAILS_ELEMENT], c = (u = t == null ? void 0 : t[s]) == null ? void 0 : u[o.SUMMARY_ELEMENT];
        if (!a)
          return;
        t[s][o.IS_OPEN] = !1, t.classList.remove(this.openClass), c == null || c.setAttribute("aria-expanded", "false"), a.setAttribute("inert", ""), this.on.close && this.on.close(this), this.on.toggle && this.on.toggle(this);
      }
    });
    i(this, "toggle", (e) => {
      const t = typeof e == "string" ? this.getItemById(e) : e;
      t && !t[s] && (t[s] = {}), t && (t[s][o.IS_OPEN] ? this.close(t) : this.open(t));
    });
    i(this, "closeAccordion", (e) => {
      var n;
      const t = typeof e == "string" ? this.getAccordionById(e) : e;
      if (!t)
        return;
      t[s] || (t[s] = {}), ((n = t[s][o.ITEMS_IDS]) != null ? n : []).forEach((u) => {
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
let m = I;
i(m, "generateInstanceId", () => {
  const e = g();
  return I.isInstanceIdUnique(e) ? e : I.generateInstanceId();
}), i(m, "isInstanceIdUnique", (e) => !document.querySelector(`[id^="accordion-${e}]"`));
export {
  m as Accordions
};
