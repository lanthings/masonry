import { ResizeObserver } from '@juggle/resize-observer';
import { Component, Element, h, Host, Prop} from '@stencil/core';


// custom imports
import Tunnel from './../masonry/data/masonry';


@Component({
  tag: 'lan-masonry-item',
  styleUrl: 'masonry-item.css',
  shadow: true
})
export class MasonryItem {

  @Element() el: HTMLElement;


  @Prop() size?: string;

  @Prop() sizeXs?: string;

  @Prop() sizeSm?: string;

  @Prop() sizeMd?: string;

  @Prop() sizeLg?: string;

  @Prop() sizeXl?: string;


  @Prop() add: (el: HTMLElement) => void;
  @Prop() rm: (el: HTMLElement) => void;
  @Prop() layout: () => void;


  componentDidLoad() {
    // console.log('MasonryItem#componentDidLoad');

    this.add(this.el);

    this.watchForHtmlChanges();
  }

  disconnectedCallback() {
    // console.log('MasonryItem#disconnectedCallback');

    this.rm(this.el);
    this.layout();
  }

  private watchForHtmlChanges(): void {
    const ro = new ResizeObserver(() => {

      this.layout();

    });

    ro.observe(this.el);
  }


  render() {
    // console.log('MasonryItem#render', this.el);

    return (
      <Host
        style={{
          '--lan-masonry-item-size': (this.size ? this.size : null),
          '--lan-masonry-item-size-xs': (this.sizeXs ? this.sizeXs : null),
          '--lan-masonry-item-size-sm': (this.sizeSm ? this.sizeSm : null),
          '--lan-masonry-item-size-md': (this.sizeMd ? this.sizeMd : null),
          '--lan-masonry-item-size-lg': (this.sizeLg ? this.sizeLg : null),
          '--lan-masonry-item-size-xl': (this.sizeXl ? this.sizeXl : null)
        }}
      >
        <div class="container">
          <slot></slot>
        </div>
      </Host>
    );
  }
}

Tunnel.injectProps(MasonryItem, ['layout', 'add', 'rm']);
