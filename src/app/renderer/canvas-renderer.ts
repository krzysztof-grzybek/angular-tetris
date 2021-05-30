import {NgZone, Renderer2, RendererStyleFlags2} from '@angular/core';
import {EventManager} from '@angular/platform-browser';
import {Subject} from 'rxjs';
import { takeUntil} from 'rxjs/operators';
import { Node } from './node';
import { BaseNode } from './base-node';
import { BoxNode } from './box-node';
import { TextNode} from './text-node';


export class CanvasRenderer implements Renderer2 {
  data = {};
  rootNode = new BoxNode();
  destroy$ = new Subject();
  destroyNode = null;

  constructor(
    private eventManager: EventManager,
    private readonly canvasEl: HTMLCanvasElement,
    private ngZone: NgZone
  ) {
    // TODO: find a better way
    this.ngZone.runOutsideAngular(() => {
      this.ngZone.onStable.pipe(takeUntil(this.destroy$)).subscribe(() => {
        if (this.rootNode.children.length) {
          const ctx = this.canvasEl.getContext('2d');
          if (ctx === null) {
            throw new Error('Context not found');
          }
          ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
          this.rootNode.render(this.canvasEl, { left: 0, top: 0});
        }
      });
    });
  }

  destroy(): void {
    this.destroy$.next();
  }

  createElement(name: string, namespace?: string): Node {
    if (name === 'rectangle') {
      return new BoxNode();
    }

    return new BaseNode();
  }

  createComment(value: string): Node {
    return new BaseNode();
  }

  createText(value: string): any {
    const textNode = new TextNode();
    textNode.textContent = value;
    return textNode;
  }

  appendChild(parent: Node, newChild: Node): void {
    parent.appendChild(newChild);
  }

  insertBefore(parent: Node, newChild: Node, refChild: Node): void {
    if (parent) {
      parent.insertBefore(newChild, refChild);
    }
  }

  removeChild(parent: Node, oldChild: Node): void {
    if (parent) {
      parent.removeChild(oldChild);
    }
  }

  selectRootElement(selectorOrNode: string|any, preserveContent?: boolean): any {
    return this.rootNode;
  }

  parentNode(node: Node): Node | null {
    return node.parentNode;
  }

  nextSibling(node: Node): Node | null {
    return node.nextSibling;
  }

  setAttribute(el: Node, name: string, value: string, namespace?: string): void {
    switch (name) {
      case 'width':
        el.size.width = Number(value);
        break;
      case 'height':
        el.size.height = Number(value);
        break;
      case 'top':
        el.position.top = Number(value);
        break;
      case 'left':
        el.position.left = Number(value);
        break;
      default:
        el.setAttribute(name, value);
    }
  }

  removeAttribute(el: Node, name: string, namespace?: string): void {
    // noop
  }

  addClass(el: Node, name: string): void {
    // noop
  }

  removeClass(el: Node, name: string): void {
    // noop
  }

  setStyle(el: any, style: string, value: any, flags: RendererStyleFlags2): void {
    // noop
  }

  removeStyle(el: any, style: string, flags: RendererStyleFlags2): void {
    // noop
  }

  setProperty(el: Node, name: string, value: any): void {
    // noop
  }

  setValue(node: any, value: string): void {
    // noop
  }

  listen(target: 'window'|'document'|'body'|any, event: string, callback: (event: any) => boolean): () => void {
    if (typeof target === 'string') {
      return this.eventManager.addGlobalEventListener(
        target, event, decoratePreventDefault(callback)
      ) as () => void;
    }

    return this.eventManager.addEventListener(
      target, event, decoratePreventDefault(callback)
    ) as () => void;
  }
}

function decoratePreventDefault(eventHandler: (event: any) => any): (event: any) => any {
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
