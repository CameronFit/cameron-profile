import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { GridStack, GridStackNode, GridStackOptions } from 'gridstack';

type W = {
  id: string;
  title: string;
  icon: string; // Material symbol name
  description: string;
  hue?: number;
  x: number;
  y: number;
  w: number;
  h: number; // grid pos
};

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('grid', { static: true }) gridEl!: ElementRef<HTMLElement>;
  private grid!: GridStack;

  private readonly initial: W[] = [
    {
      id: 'sig',
      title: 'Signals',
      icon: 'bolt',
      description: 'Local & global state without Subjects.',
      hue: 200,
      x: 0,
      y: 0,
      w: 4,
      h: 2,
    },
    {
      id: 'drag',
      title: 'Drag & Drop',
      icon: 'pan_tool',
      description: 'Collision-free reorder.',
      hue: 45,
      x: 4,
      y: 0,
      w: 2,
      h: 1,
    },
    {
      id: 'mat',
      title: 'Material M3',
      icon: 'palette',
      description: 'Design tokens, elevation, density.',
      hue: 280,
      x: 6,
      y: 0,
      w: 3,
      h: 2,
    },
    {
      id: 'nav',
      title: 'Guards/Routes',
      icon: 'admin_panel_settings',
      description: 'canMatch + role control.',
      hue: 12,
      x: 9,
      y: 0,
      w: 3,
      h: 1,
    },
    {
      id: 'int',
      title: 'Interceptors',
      icon: 'tune',
      description: 'Auth header & error hooks.',
      hue: 160,
      x: 4,
      y: 1,
      w: 2,
      h: 1,
    },
    {
      id: 'doc',
      title: 'Docs Token',
      icon: 'description',
      description: 'Centralised résumé/letter URLs.',
      hue: 320,
      x: 9,
      y: 1,
      w: 3,
      h: 1,
    },
  ];

  readonly vivid = signal(true);
  readonly locked = signal(false);
  readonly widgets = signal<W[]>(this.load() ?? this.initial);

  ngAfterViewInit(): void {


    const opts: GridStackOptions = {
  column: 12,
  cellHeight: 105,   // controls row height
  margin: 12,
  float: true,
  animate: true,
  draggable: { handle: '.drag-handle', scroll: true },
  resizable: { handles: 'e, se, s' },
};


    this.grid = GridStack.init(opts, this.gridEl.nativeElement);

    // Build items from current state with real HTMLElements
    this.widgets().forEach((w) => this.addOne(w));

    // Persist on changes
    this.grid.on('change', (_e, items?: GridStackNode[]) => {
      if (!items?.length) return;
      const map = new Map(this.widgets().map((w) => [w.id, w]));
      items.forEach((n) => {
        if (!n.id) return;
        const w = map.get(String(n.id));
        if (!w) return;
        w.x = n.x ?? w.x;
        w.y = n.y ?? w.y;
        w.w = n.w ?? w.w;
        w.h = n.h ?? w.h;
      });
      this.widgets.set(Array.from(map.values()));
      this.save();
    });

    this.applyVivid();
  }

  ngOnDestroy(): void {
    this.grid?.destroy(false);
  }

  toggleVivid() {
    this.vivid.update((v) => !v);
    this.applyVivid();
  }
  toggleLock() {
    this.locked.update((v) => !v);
    const lock = this.locked();
    this.grid.setStatic(lock);
    this.grid.engine.nodes.forEach((n) => {
      this.grid.movable(n.el!, !lock);
      this.grid.resizable(n.el!, !lock);
    });
  }

  reset() {
    this.grid.removeAll();
    this.widgets.set([...this.initial]);
    this.widgets().forEach((w) => this.addOne(w));
    this.save();
  }

  /** Add a widget using an HTMLElement to avoid HTML-as-text issues */
  private addOne(w: W) {
    const el = this.makeWidgetEl(w);
    // In v9+, you can pass the element and position via attributes:
    el.setAttribute('gs-id', w.id);
    el.setAttribute('gs-x', String(w.x));
    el.setAttribute('gs-y', String(w.y));
    el.setAttribute('gs-w', String(w.w));
    el.setAttribute('gs-h', String(w.h));
    this.grid.addWidget(el);
  }

  /** Create the grid item element (outer + content) */
  private makeWidgetEl(w: W): HTMLElement {
    const wrapper = document.createElement('div'); // .grid-stack-item
    wrapper.className = 'grid-stack-item';

    const content = document.createElement('div'); // .grid-stack-item-content
    content.className = 'grid-stack-item-content card p-card';
    content.style.setProperty('--hue', String(w.hue ?? 220));
    content.innerHTML = `
      <div class="drag-handle" aria-label="Drag handle">
        <span class="material-icons">drag_indicator</span>
      </div>
      <header class="p-header">
        <span class="p-icon material-symbols-outlined">${w.icon}</span>
        <h3>${w.title}</h3>
      </header>
      <p class="p-desc">${w.description}</p>
    `;
    wrapper.appendChild(content);
    return wrapper;
  }

  private applyVivid() {
    this.gridEl.nativeElement.classList.toggle('vivid', this.vivid());
  }

  // Persistence (localStorage) — swap to your service/backend later
  private save() {
    localStorage.setItem('playground.widgets', JSON.stringify(this.widgets()));
  }
  private load(): W[] | null {
    try {
      const raw = localStorage.getItem('playground.widgets');
      return raw ? (JSON.parse(raw) as W[]) : null;
    } catch {
      return null;
    }
  }
}
