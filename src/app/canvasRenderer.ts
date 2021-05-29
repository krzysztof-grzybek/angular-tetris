import {NgZone, Renderer2, RendererStyleFlags2} from '@angular/core';
import {EventManager} from '@angular/platform-browser';

interface Node {
  render(canvasEl: HTMLCanvasElement, parent: Node): void;
}
class ContainerNode implements Node {
  children: Node[] = [];
  position = {
    x: 0,
    y: 0
  }
  appendChild(child: Node) {
    this.children.push(child);
  }
  insertBefore(newChild, refChild) {
    const index = this.children.find(c => c === refChild);
    this.children.splice(index, 0 , newChild);
    newChild.parentNode = this
    return newChild;
  }
  removeChild(child) {
    const index = this.children.find(c => c === child);
    this.children.splice(index, 1   )
  }
  render(canvasEl: HTMLCanvasElement, parent: Node) {
    this.children.forEach((child) => {
      child.render(canvasEl, parent)
    })
  }
}
class BoxNode extends ContainerNode {
  private color = 'black';
  children: Node[] = [];

  border = 1;
  position = {
    x: 0,
    y: 0,
  }

  size = {
    width: 100,
    height: 100,
  }

  setColor(color: string): void {
    this.color = color;
  }


  appendChild(child: Node) {
    this.children.push(child);
  }
  render(canvasEl: HTMLCanvasElement, parentOrNull: Node | null) {
    if (parentOrNull === null) {
      this.children.forEach(child => {
        child.render(canvasEl, this)
      });
      return;
    }
    const ctx = canvasEl.getContext('2d')!;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.border;
    ctx.beginPath();
    const x= this.position.x + parentOrNull.position.x;
    const y= this.position.y + parentOrNull.position.y;
    ctx.rect(x, y, this.size.width, this.size.height);
    ctx.stroke();
    // ctx.fill();
    ctx.closePath();

    this.children.forEach(child => {
      child.render(canvasEl, { position: { x, y }})
    })
  }
}

class TextNode extends ContainerNode {
  position = {
    top: 0,
    left: 0,
  }
  constructor(private readonly val) {
    super();
  }
  appendChild(child: Node) {
    this.children.push(child);
  }

  render(canvasEl: HTMLCanvasElement) {
    const ctx = canvasEl.getContext('2d');

    ctx.font = '50px serif';
    ctx.fillText(this.val, 50, 90);
  }
}


export class CanvasRenderer implements Renderer2 {
  data: {[key: string]: any} = Object.create(null);
  rootNode = new BoxNode();

  constructor(
    private eventManager: EventManager,
    private readonly canvasEl: HTMLCanvasElement,
    private ngZone: NgZone
  ) {
    console.log(this.ngZone)
    this.ngZone.onStable.subscribe(() => {
      if (this.rootNode.children.length) {

      this.canvasEl.getContext('2d').clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      this.rootNode.render(this.canvasEl, null);
      }

      console.log(this.rootNode);
    })

  }

  destroy(): void {}

  destroyNode: null;

  createElement(name: string, namespace?: string): any {

    if (name === 'rectangle') {


      return new BoxNode();
    }

    return new ContainerNode();
  }

  createComment(value: string): any {
    return new ContainerNode();
    // return document.createComment(value);
  }

  createText(value: string): any {

    return new TextNode(value);
  }

  appendChild(parent: any, newChild: any): void {
    if (newChild.nodeType === Node.COMMENT_NODE)  {
      newChild.parentNode = parent
      return; }
    parent.appendChild(newChild);
    newChild.parentNode = parent
  }

  insertBefore(parent: any, newChild: any, refChild: any): void {
    if (parent) {
      parent.insertBefore(newChild, refChild);
    }
  }

  removeChild(parent: any, oldChild: any): void {
    if (parent) {
      parent.removeChild(oldChild);
    }
  }

  selectRootElement(selectorOrNode: string|any, preserveContent?: boolean): any {
    return this.rootNode;
    // let el: any = typeof selectorOrNode === 'string' ? document.querySelector(selectorOrNode) :
    //   selectorOrNode;
    // if (!el) {
    //   throw new Error(`The selector "${selectorOrNode}" did not match any elements`);
    // }
    // if (!preserveContent) {
    //   el.textContent = '';
    // }
    // return el;
  }

  parentNode(node: any): any {
    return node.parentNode;
  }

  nextSibling(node: any): any {
    return node.nextSibling;
  }

  setAttribute(el: any, name: string, value: string, namespace?: string): void {
    if (name === 'color') {
      el.setColor(value);
    }

    if (name === 'width') {
      el.size.width =Number(value);
    }
    if (name === 'height') {
      el.size.height = Number(value);
    }

    if (name === 'top') {
      el.position.y =Number(value);
    }

    if (name === 'left') {
      el.position.x =Number(value);
    }

    if (name === 'border') {
      el.border =Number(value);
    }
    // if (namespace) {
    //   name = namespace + ':' + name;
    //   // TODO(FW-811): Ivy may cause issues here because it's passing around
    //   // full URIs for namespaces, therefore this lookup will fail.
    //   const namespaceUri = NAMESPACE_URIS[namespace];
    //   if (namespaceUri) {
    //     el.setAttributeNS(namespaceUri, name, value);
    //   } else {
    //     el.setAttribute(name, value);
    //   }
    // } else {
    //   el.setAttribute(name, value);
    // }
  }

  removeAttribute(el: any, name: string, namespace?: string): void {
    // if (namespace) {
    //   // TODO(FW-811): Ivy may cause issues here because it's passing around
    //   // full URIs for namespaces, therefore this lookup will fail.
    //   const namespaceUri = NAMESPACE_URIS[namespace];
    //   if (namespaceUri) {
    //     el.removeAttributeNS(namespaceUri, name);
    //   } else {
    //     // TODO(FW-811): Since ivy is passing around full URIs for namespaces
    //     // this could result in properties like `http://www.w3.org/2000/svg:cx="123"`,
    //     // which is wrong.
    //     el.removeAttribute(`${namespace}:${name}`);
    //   }
    // } else {
      el.removeAttribute(name);
    // }
  }

  addClass(el: any, name: string): void {
    el.classList.add(name);
  }

  removeClass(el: any, name: string): void {
    el.classList.remove(name);
  }

  setStyle(el: any, style: string, value: any, flags: RendererStyleFlags2): void {
    if (flags & (RendererStyleFlags2.DashCase | RendererStyleFlags2.Important)) {
      el.style.setProperty(style, value, flags & RendererStyleFlags2.Important ? 'important' : '');
    } else {
      el.style[style] = value;
    }
  }

  removeStyle(el: any, style: string, flags: RendererStyleFlags2): void {
    if (flags & RendererStyleFlags2.DashCase) {
      el.style.removeProperty(style);
    } else {
      // IE requires '' instead of null
      // see https://github.com/angular/angular/issues/7916
      el.style[style] = '';
    }
  }

  setProperty(el: any, name: string, value: any): void {
    if (name === 'attr.color') {
      el.setColor(value);
    }

    if (name === 'width') {
      el.size.width = (value);
    }
    // NG_DEV_MODE && checkNoSyntheticProp(name, 'property');
    el[name] = value;
  }

  setValue(node: any, value: string): void {
    node.nodeValue = value;
  }

  listen(target: 'window'|'document'|'body'|any, event: string, callback: (event: any) => boolean):
    () => void {
    // NG_DEV_MODE && checkNoSyntheticProp(event, 'listener');
    if (typeof target === 'string') {
      return <() => void>this.eventManager.addGlobalEventListener(
        target, event, decoratePreventDefault(callback));
    }
    return <() => void>this.eventManager.addEventListener(
      target, event, decoratePreventDefault(callback)) as () => void;
  }
}

function decoratePreventDefault(eventHandler: Function): Function {
  // `DebugNode.triggerEventHandler` needs to know if the listener was created with
  // decoratePreventDefault or is a listener added outside the Angular context so it can handle the
  // two differently. In the first case, the special '__ngUnwrap__' token is passed to the unwrap
  // the listener (see below).
  return (event: any) => {
    // Ivy uses '__ngUnwrap__' as a special token that allows us to unwrap the function
    // so that it can be invoked programmatically by `DebugNode.triggerEventHandler`. The debug_node
    // can inspect the listener toString contents for the existence of this special token. Because
    // the token is a string literal, it is ensured to not be modified by compiled code.
    if (event === '__ngUnwrap__') {
      return eventHandler;
    }

    const allowDefaultBehavior = eventHandler(event);
    if (allowDefaultBehavior === false) {
      // TODO(tbosch): move preventDefault into event plugins...
      event.preventDefault();
      event.returnValue = false;
    }

    return undefined;
  };
}
