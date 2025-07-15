var y = Object.defineProperty;
var g = (d, e, t) => e in d ? y(d, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : d[e] = t;
var i = (d, e, t) => (g(d, typeof e != "symbol" ? e + "" : e, t), t);
const p = (d = 5) => {
  let e = "";
  const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", n = t.length;
  let o = 0;
  for (; o < d; )
    e += t.charAt(Math.floor(Math.random() * n)), o += 1;
  return e;
}, A = {
  END: "End",
  HOME: "Home",
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  DELETE: "Delete",
  ENTER: "Enter",
  SPACE: " "
}, s = "_accordion";
var r;
(function(d) {
  d.IS_SINGLE = "isSingle", d.IS_OPEN = "isOpen", d.ACCORDION_ID = "accordionId", d.ITEM_ID = "itemId", d.ITEMS_IDS = "itemsIds", d.SUMMARY_ELEMENT = "summaryElement", d.DETAILS_ELEMENT = "detailsElement";
})(r || (r = {}));
const m = {
  MANUAL: "manual",
  BREAKPOINT: "breakpoint"
}, T = "data-accordion-", D = {
  IS_SINGLE: `${T}is-single`
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
  isKeyboardTriggerAllowed: !1,
  on: {}
}, E = class {
  constructor(e = {}) {
    i(this, "instanceId");
    i(this, "openClass");
    i(this, "accordionSelector");
    i(this, "itemSelector");
    i(this, "summarySelector");
    i(this, "detailsSelector");
    i(this, "isSingle");
    i(this, "isKeyboardTriggerAllowed");
    i(this, "breakpoint");
    i(this, "parentElement");
    i(this, "elements");
    i(this, "itemElements");
    i(this, "isDestroyed");
    i(this, "destroyedBy");
    i(this, "devMode");
    i(this, "on");
    i(this, "updateInstanceId", () => {
      this.instanceId = E.generateInstanceId();
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
      var h;
      if (e[s])
        return;
      const n = (h = e.closest(this.itemSelector)) != null ? h : void 0;
      n && !n[s] && (n[s] = {});
      const o = n && n[s][r.ITEM_ID], u = e.hasAttribute(D.IS_SINGLE) ? e.getAttribute(D.IS_SINGLE) === "true" : this.isSingle;
      e[s] = {}, e[s][r.ACCORDION_ID] = String(t), e[s][r.ITEMS_IDS] = [], e[s][r.IS_SINGLE] = u, e.id = this.generateAccordionId(t), e.dataset.accordionState = "initialized", e.dataset.accordionRole = "parent";
      const a = Array.from(e.children).filter((l) => l.matches(this.itemSelector));
      if (a.length === 0 && this.devMode)
        throw new Error(`Accordion items not found. Check the selector ${this.itemSelector} | \u042D\u043B\u0435\u043C\u0435\u043D\u0442\u044B \u0430\u043A\u043A\u043E\u0440\u0434\u0438\u043E\u043D\u0430 \u043D\u0435 \u043D\u0430\u0438\u0306\u0434\u0435\u043D\u044B. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0441\u0435\u043B\u0435\u043A\u0442\u043E\u0440 ${this.itemSelector}`);
      a.forEach((l, S) => {
        const I = `${t}-${S}`;
        this.on.detailsTransitionEnd && l.addEventListener("transitionend", () => {
          this.on.detailsTransitionEnd(this);
        }), this.initItem({
          itemElement: l,
          itemId: I,
          accordionId: t,
          parentItemId: o
        }), e[s][r.ITEMS_IDS].push(I);
      });
    });
    i(this, "initItem", ({
      itemElement: e,
      itemId: t,
      accordionId: n
    }) => {
      var h, l;
      if (e[s])
        return;
      const o = (h = e.querySelector(this.summarySelector)) != null ? h : void 0;
      if (!o && this.devMode)
        throw new Error(`Accordion summary not found. Check the selector ${this.summarySelector} | \u0421\u0430\u043C\u043C\u0430\u0440\u0438 \u0430\u043A\u043A\u043E\u0440\u0434\u0438\u043E\u043D\u0430 \u043D\u0435 \u043D\u0430\u0438\u0306\u0434\u0435\u043D. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0441\u0435\u043B\u0435\u043A\u0442\u043E\u0440 ${this.summarySelector}`);
      const u = (l = e.querySelector(this.detailsSelector)) != null ? l : void 0;
      if (!u && this.devMode)
        throw new Error(`Accordion details not found. Check the selector ${this.detailsSelector} | \u041A\u043E\u043D\u0442\u0435\u043D\u0442 \u0430\u043A\u043A\u043E\u0440\u0434\u0438\u043E\u043D\u0430 \u043D\u0435 \u043D\u0430\u0438\u0306\u0434\u0435\u043D. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0441\u0435\u043B\u0435\u043A\u0442\u043E\u0440 ${this.detailsSelector}`);
      const c = this.generateSummaryId(t), a = this.generateDetailsId(t);
      if (e.id = this.generateItemId(t), e[s] = {}, e[s][r.ITEM_ID] = t, e[s][r.ACCORDION_ID] = String(n), e[s][r.SUMMARY_ELEMENT] = o, e[s][r.DETAILS_ELEMENT] = u, e.dataset.accordionRole = "item", this.itemElements.push(e), o.dataset.accordionRole = "summary", o.dataset.test = "summary", o.setAttribute("tabindex", "0"), o.setAttribute("id", c), o.setAttribute("aria-controls", a), o[s] = {}, o[s][r.ITEM_ID] = t, u.dataset.accordionRole = "details", u.setAttribute("inert", ""), u.setAttribute("id", a), u.setAttribute("aria-labelledby", c), u[s] = {}, u[s][r.ITEM_ID] = t, o.addEventListener("click", this.onSummaryClick), this.isKeyboardTriggerAllowed) {
        const S = /* @__PURE__ */ new Set([A.ENTER, A.SPACE]);
        o.addEventListener("keydown", (I) => {
          !S.has(I.key) || (I.preventDefault(), I.stopImmediatePropagation(), this.onSummaryClick(I));
        });
      }
    });
    i(this, "destroyAccordion", (e) => {
      const t = typeof e == "string" ? this.getAccordionById(e) : e;
      if (!t || !t[s])
        return;
      this.itemElements.filter((o) => !o[s] || !t[s] ? !1 : o[s][r.ACCORDION_ID] === t[s][r.ACCORDION_ID]).forEach((o) => {
        this.destroyItem(o);
      }), this.elements = this.elements.filter((o) => !o[s] || !t[s] ? !1 : o[s][r.ACCORDION_ID] !== t[s][r.ACCORDION_ID]), delete t[s], t.removeAttribute("id"), t.dataset.accordionState = "destroyed";
    });
    i(this, "destroyItem", (e) => {
      var u, c;
      const t = typeof e == "string" ? this.getItemById(e) : e;
      if (!t || !t[s])
        return;
      const n = (u = t[s][r.SUMMARY_ELEMENT]) != null ? u : void 0, o = (c = t[s][r.DETAILS_ELEMENT]) != null ? c : void 0;
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
      this.on.beforeDestroy && this.on.beforeDestroy(this), this.elements.forEach((t) => {
        this.destroyAccordion(t);
      }), this.isDestroyed = !0, this.destroyedBy = e, this.on.afterDestroy && this.on.afterDestroy(this);
    });
    i(this, "open", (e) => {
      var o, u, c;
      const t = typeof e == "string" ? this.getItemById(e) : e;
      if (!t || !t[s])
        return;
      if (t ? !t.classList.contains(this.openClass) : !1) {
        const a = this.getAccordionById((u = (o = t[s]) == null ? void 0 : o[r.ACCORDION_ID]) != null ? u : ""), h = t[s][r.DETAILS_ELEMENT], l = t[s][r.SUMMARY_ELEMENT];
        (c = a == null ? void 0 : a[s]) != null && c[r.IS_SINGLE] && this.closeAccordion(a), t[s][r.IS_OPEN] = !0, t.classList.add(this.openClass), l == null || l.setAttribute("aria-expanded", "true"), h == null || h.removeAttribute("inert"), this.on.open && this.on.open(this), this.on.toggle && this.on.toggle(this);
      }
    });
    i(this, "close", (e) => {
      var o, u;
      const t = typeof e == "string" ? this.getItemById(e) : e;
      if (t && !t[s] && (t[s] = {}), t == null ? void 0 : t.classList.contains(this.openClass)) {
        const c = (o = t == null ? void 0 : t[s]) == null ? void 0 : o[r.DETAILS_ELEMENT], a = (u = t == null ? void 0 : t[s]) == null ? void 0 : u[r.SUMMARY_ELEMENT];
        if (!c)
          return;
        t[s][r.IS_OPEN] = !1, t.classList.remove(this.openClass), a == null || a.setAttribute("aria-expanded", "false"), c.setAttribute("inert", ""), this.on.close && this.on.close(this), this.on.toggle && this.on.toggle(this);
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
    this.instanceId = void 0, this.openClass = t.openClass, this.accordionSelector = t.accordionSelector, this.itemSelector = t.itemSelector, this.summarySelector = t.summarySelector, this.detailsSelector = t.detailsSelector, this.isSingle = t.isSingle, this.isKeyboardTriggerAllowed = t.isKeyboardTriggerAllowed, this.breakpoint = t.breakpoint, this.parentElement = t.parentElement, this.elements = [], this.itemElements = [], this.isDestroyed = !0, this.destroyedBy = void 0, this.devMode = t.devMode, this.on = t.on, this.init();
  }
};
let f = E;
i(f, "generateInstanceId", () => {
  const e = p();
  return E.isInstanceIdUnique(e) ? e : E.generateInstanceId();
}), i(f, "isInstanceIdUnique", (e) => !document.querySelector(`[id^="accordion-${e}]"`));
export {
  f as Accordions
};
