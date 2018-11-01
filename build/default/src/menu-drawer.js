import { LitElement, html } from "../node_modules/@polymer/lit-element/lit-element.js";
import { afterNextRender } from "../node_modules/@polymer/polymer/lib/utils/render-status.js";
import throttle from "../node_modules/lodash-es/throttle.js";
import { brightnessFromElementBackground } from "../js/utils.js";

class MenuDrawer extends LitElement {
  constructor() {
    super();
    this.open = false;
    afterNextRender(this, () => {
      this.removeAttribute('unresolved');
      this._links = this.shadowRoot.getElementById('links');
      /* SETUP FOR CHANGING COLOR OF NAV BUTTON */
      // get and save position and size of nav button

      this.__navButton = this.shadowRoot.children[2].children[0];
      this.__navButtonBoundingRect = this.__navButton.getBoundingClientRect();
      const sections = Array.from(document.querySelectorAll(`
        body > header,
        body > section,
        body > footer
      `)); // map colors to specific sections

      this.__sectionColors = new Map(sections.map(el => [el, brightnessFromElementBackground(el) > 200 ? 'black' : 'white']));
      window.addEventListener('scroll', throttle(this.updateColorOnScroll.bind(this), 200));
      this.updateColorOnScroll();
    });
  }

  updateColorOnScroll() {
    const sections = Array.from(document.querySelectorAll(`
      body > header,
      body > section,
      body > footer
    `));
    const {
      y,
      height
    } = this.__navButtonBoundingRect;
    sections.some(section => {
      const {
        y: sectionY,
        height: sectionHeight
      } = section.getBoundingClientRect();

      if (y >= sectionY && y + height < sectionY + sectionHeight) {
        const color = this.__sectionColors.get(section);

        if (!color) {
          return false;
        }

        this.__navButton.style.color = color;
        return true;
      }

      return false;
    });
  }

  static get properties() {
    return {
      open: Boolean
    };
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('open')) {
      document.body.style.overflow = this.open === true ? 'hidden' : '';
    }
  }

  toggle() {
    this.open = !this.open;
  }

  render() {
    return html`
      <input type='checkbox' id='menu__checkbox'
        @change=${e => this.open = e.target.checked}
        .checked=${this.open}
      />
      <label class='hamburger' for='menu__checkbox' aria-label='menu'>
        <svg class='hamburger__icon' xmlns='https://www.w3.org/2000/svg' viewBox='0 0 24 24'>
          <path class='bar' d='M4,8h12c1,0,2,0,2,-2s-1,-2,-2,-2h-12c-1,0,-2,0,-2,2s1,2,2,2z' />
          <path class='bar' d='M0,10h4c-1,0,-2,0,-2,2s1,2,2,2h16c1,0,2,0,2,-2s-1,-2,-2,-2z' />
          <path class='bar' d='M4,20h12c1,0,2,0,2,-2s-1,-2,-2,-2h-12c-1,0,-2,0,-2,2s1,2,2,2z' />
        </svg>
      </label>

      <section class='menu__links' id='links'
        @click=${e => e.target !== this._links && this.toggle()}
      >
        <slot></slot>
      </section>

      <style>
        :host {
          contain: strict;
        }

        .menu__links {
          position: fixed;
          top: 0;
          left: -24rem;

          width: 16rem;
          height: calc(100% - 9rem);
          padding: 9rem 4rem 0;

          display: flex;
          flex-direction: column;
          align-items: center;

          background-color: rgba(254, 215, 102, 0.95);

          transition: left 0.2s;
          z-index: 998;

        }

        #menu__checkbox {
          display: none;
        }

        #menu__checkbox:checked~.menu__links {
          left: 0;
        }

        .hamburger {
          position: fixed;
          top: 1rem;
          left: 1rem;

          width: 3rem;
          height: 3rem;

          display: block;

          transition: left 0.2s, transform 0.2s;
          cursor: pointer;
          z-index: 999;
        }

        .hamburger__icon {
          width: 100%;
          height: 100%;

          cursor: pointer;

          color: white;
          transition: color 0.2s;
        }

        .bar {
          color: inherit;
          fill: currentColor;

          transform: translate(0);
          transform-origin: center;

          transition: fill 0.2s, transform 0.4s cubic-bezier(.45, .98, .38, 1.52);
        }

        .bar:nth-child(2) {
          transition-delay: 0s, 0.05s;
        }

        .bar:last-child {
          transition-delay: 0s, 0.1s;
        }

        #menu__checkbox:checked+.hamburger {
          left: 16rem;
        }

        #menu__checkbox:checked+.hamburger:hover .bar {
          fill: #444 !important;
        }

        #menu__checkbox:checked+.hamburger .bar {
          fill: #222 !important;
        }

        .hamburger__icon:active>.bar,
        #menu__checkbox:checked+.hamburger .bar {
          fill: #ccc;
        }

        .hamburger__icon:active>.bar:first-child,
        #menu__checkbox:checked+.hamburger .bar:first-child,
        .hamburger__icon:active>.bar:last-child,
        #menu__checkbox:checked+.hamburger .bar:last-child {
          transform: translate(5px);
        }

        .hamburger__icon:active>.bar:nth-child(2),
        #menu__checkbox:checked+.hamburger .bar:nth-child(2) {
          transform: translate(1px);
        }

        @media (hover: hover) {
          .hamburger__icon:hover>.bar {
            fill: #ccc;
          }

          .hamburger__icon:hover>.bar:first-child,
          .hamburger__icon:hover>.bar:last-child {
            transform: translate(5px);
          }

          .hamburger__icon:hover>.bar:nth-child(2) {
            transform: translate(1px);
          }
        }

        @media (max-device-width: 500px) {
          .menu__links {
            left: -100vw;

            width: 100vw;
            height: 100vh;
            padding: 0;

            justify-content: center;
          }

          #menu__checkbox:checked+.hamburger {
            left: 50%;
            transform: translateX(calc(-50% - 0px)) scaleX(1.25);
          }

          .hamburger__icon:active>.bar:first-child,
          #menu__checkbox:checked+.hamburger .bar:first-child,
          .hamburger__icon:active>.bar:last-child,
          #menu__checkbox:checked+.hamburger .bar:last-child {
            transform: translate(2px);
          }

          .hamburger__icon:active>.bar:nth-child(2),
          #menu__checkbox:checked+.hamburger .bar:nth-child(2) {
            transform: translate(0);
          }

          @media (hover: hover) {

            .hamburger__icon:hover>.bar:first-child,
            .hamburger__icon:hover>.bar:last-child {
              transform: translate(2px);
            }

            .hamburger__icon:hover>.bar:nth-child(2) {
              transform: translate(0);
            }
          }
        }

      </style>
    `;
  }

}

window.customElements.define('menu-drawer', MenuDrawer);