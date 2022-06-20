import { Component, Element, Event, EventEmitter, h, Method, Prop, Watch } from '@stencil/core';
import { Options } from 'masonry-layout';
import MasonryLayout from 'masonry-layout';


// custom imports
import Tunnel from './data/masonry';


@Component({
  tag: 'lan-masonry',
  styleUrl: 'masonry.css',
  shadow: true
})
export class MasonryX {

  private didInit: boolean = false;
  private _masonry: any;


  @Element() el: HTMLElement;

  // @Prop() win!: Window;

  @Prop() options: Options;

  @Watch('options')
  optionsChanged() {
    if (this.didInit) {

      this._createNewMasonry();
    }
  }

  @Prop() useImagesLoaded: boolean = false;

  @Event() layoutComplete: EventEmitter;
  @Event() removeComplete: EventEmitter;



  @Method()
  async masonry() {
    this._createNewMasonry();
  }

  @Method()
  async layout() {
    this._layout();
  }

  @Method()
  async appended(element: HTMLElement) {
    this._appended(element);
  }

  @Method()
  async rm(element: HTMLElement) {
    this._rm(element);
  }

  @Method()
 async  reloadItems() {
    this._reloadItems();
  }

  @Method()
  async destroy() {
    this._destroy();
  }

  @Method()
  async getItemElements() {
    return this._getItemElements();
  }


  componentDidLoad() {
    // console.log('Masonry#componentDidLoad');

    this._createNewMasonry();
    this.didInit = true;
  }

  disconnectedCallback() {
    this._destroy();
  }

  private _layoutComplete(items) {
    // console.log('Masonry_layoutComplete; itmes', items);

    this.layoutComplete.emit(items);
  }

  private _removeComplete(items) {
    // console.log('Masonry_removeComplete; itmes', items);

    this.removeComplete.emit(items);
  }


  /** When HTML in brick changes dinamically, observe that and change layout */
  // private watchForHtmlChanges(): void {
  //   MutationObserver = this.win['MutationObserver'] || this.win['WebKitMutationObserver'];

  //   if (MutationObserver) {
  //     /** Watch for any changes to subtree */
  //     const observer = new MutationObserver((mutations: MutationRecord[]) => {
  //       console.log('mutations => ', mutations);

  //       mutations.forEach(
  //         ((mutation: MutationRecord) => {
  //           if (mutation.addedNodes.length > 0) {
  //             this.add(mutation.addedNodes);
  //           }
  //           if (mutation.removedNodes.length > 0) {
  //             this.rm(mutation.removedNodes);
  //           }
  //         }

  //       ))
  //     });

  //     // define what element should be observed by the observer
  //     // and what types of mutations trigger the callback
  //     observer.observe(this.el, {
  //       subtree: false,
  //       childList: true
  //     });
  //   }
  // }


  private _createNewMasonry = () => {

    this._destroy();

    const _options = Object.assign({ itemSelector: 'lan-masonry-item' }, this.options);
    // console.log('Masonry#_createNewMasonry; _options:', _options);

    this._masonry = new MasonryLayout(this.el, _options);
    // this._masonry = this.win['Masonry'](this.el, _options);

    // this.watchForHtmlChanges();

    this._masonry.on('layoutComplete', this._layoutComplete.bind(this));
    this._masonry.on('removeComplete', this._layoutComplete.bind(this));

    this._layout();
  }

  private _layout = () => {
    //  console.log('Masonry#_layout; this._masonry:', this._masonry);

    if (!this._masonry) {
      return;
    }

    // setTimeout(() => {
      // console.log('Masonry#_layout; ', this._masonry['items'].length, this._masonry.cols, this._masonry.size);
      this._masonry.layout();
    // });
  }

  private add = (element: HTMLElement) => {
    if (!this._masonry) {
      return;
    }

    let elements: any[] = [];
    elements.push(element);

    if (this.useImagesLoaded) {

    } else {
      // Tell Masonry that a child element has been added
      this._masonry.appended(elements);
    }
  }

  private _appended = (element: HTMLElement) => {
    if (!this._masonry) {
      return;
    }

    this.el.appendChild(element);
  }

  private _rm = (element: HTMLElement) => {
    if (!this._masonry) {
      return;
    }

    let elements: any[] = [];
    elements.push(element);

    this._masonry.remove(elements);
  }

  private _reloadItems = () => {
    if (!this._masonry) {
      return;
    }

    this._masonry.reloadItems();
  }

  private _destroy = () => {
    if (!this._masonry) {
      return;
    }

    this._masonry.destroy();

    this._masonry.on('layoutComplete', this._layoutComplete.bind(this));
    this._masonry.on('removeComplete', this._removeComplete.bind(this));
  }

  private _getItemElements = () => {
    if (!this._masonry) {
      return;
    }

    return Promise.resolve(this._masonry.getItemElements());
  }


  render() {
    // console.log('Masonryrender');

    const tunnelState = {
      layout: this._layout,
      add: this.add,
      rm: this._rm
    };

    return (
      <Tunnel.Provider state={tunnelState}>
        <slot></slot>
      </Tunnel.Provider>
    );
  }
}
