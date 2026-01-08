import "./offer-card.js";

class OffersList extends HTMLElement {
  constructor() {
    super();
    this._items = [];
    this.handleSelect = this.handleSelect.bind(this);
  }

  connectedCallback() {
    this.innerHTML = `
      <section class="offers-container">
        <div class="offers-row"></div>
      </section>
    `;
    this.addEventListener("offer-select", this.handleSelect);
  }

  disconnectedCallback() {
    this.removeEventListener("offer-select", this.handleSelect);
  }

  set items(list) {
    this._items = Array.isArray(list) ? list : [];
    const row = this.querySelector('.offers-row');
    row.innerHTML = '';
    let content = '';
    this._items.forEach(item => {
      const thumb = item.thumb || 'assets/img/box.svg';
      const title = item.title || '';
      const meta = item.meta || '';
      const price = item.price || '';
      content += `<offer-card thumb="${thumb}" title="${title}" meta="${meta}" sub='${JSON.stringify(item.sub || [])}' price="${price}" ></offer-card>`;
    });
    row.innerHTML = content;
  }

  handleSelect(event) {
    const modal = document.querySelector("offer-modal");
    if (!modal || typeof modal.show !== "function") return;

    const detail = event.detail || {};
    let sub = [];
    if (Array.isArray(detail.sub)) {
      sub = detail.sub;
    } else if (detail.sub) {
      try {
        sub = JSON.parse(detail.sub);
      } catch (e) {
        sub = [];
      }
    }

    modal.show({
      thumb: detail.thumb,
      title: detail.title,
      meta: detail.meta,
      sub,
      price: detail.price,
    });
  }
}
customElements.define('offers-list', OffersList);

// --- data ---
document.addEventListener('DOMContentLoaded', () => {
  const stored = localStorage.getItem('offers');
  if (!stored) return;
  let offers = [];
  try {
    offers = JSON.parse(stored) || [];
  } catch (e) {
    offers = [];
  }
  const offerList = document.querySelector('#offers');
  if (offerList) {
    offerList.items = offers;
  }
});
