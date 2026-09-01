---
title: Angular Avatar Library – DiceBear Integration
description: >
  Integrate DiceBear SVG profile pictures into Angular applications via the
  JavaScript avatar library or avatar API.
---

# Angular avatar library: using DiceBear with Angular

DiceBear can be integrated into Angular components using Signals (Angular 17+)
or the `OnChanges` lifecycle hook. Use the JavaScript library for client-side
SVG avatar generation, or the HTTP API as a simple `<img>` source with no
additional dependencies.

## With the JS library

::: code-group

```typescript [Angular 17+]
import { Component, input, computed } from '@angular/core';
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);

@Component({
  selector: 'app-avatar',
  template: `<img [src]="avatarUrl()" alt="Avatar" />`,
})
export class AvatarComponent {
  seed = input('Alice');

  avatarUrl = computed(() =>
    new Avatar(style, {
      seed: this.seed(),
      size: 128,
      // ... other options
    }).toDataUri(),
  );
}
```

```typescript [Angular 16 and earlier]
import { Component, Input, OnChanges } from '@angular/core';
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `<img [src]="avatarUrl" alt="Avatar" />`,
})
export class AvatarComponent implements OnChanges {
  @Input() seed: string = 'Alice';
  avatarUrl: string = '';

  ngOnChanges() {
    this.avatarUrl = new Avatar(style, {
      seed: this.seed,
      size: 128,
      // ... other options
    }).toDataUri();
  }
}
```

:::

## With the HTTP API

::: code-group

```typescript [Angular 17+]
import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-avatar',
  template: `<img [src]="avatarUrl()" alt="Avatar" />`,
})
export class AvatarComponent {
  seed = input('Alice');

  avatarUrl = computed(() => {
    const url = new URL('https://api.dicebear.com/11.x/lorelei/svg');
    url.searchParams.set('seed', this.seed());
    url.searchParams.set('size', '128');
    // ... other options
    return url.href;
  });
}
```

```typescript [Angular 16 and earlier]
import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `<img [src]="avatarUrl" alt="Avatar" />`,
})
export class AvatarComponent implements OnChanges {
  @Input() seed: string = 'Alice';
  avatarUrl: string = '';

  ngOnChanges() {
    const url = new URL('https://api.dicebear.com/11.x/lorelei/svg');
    url.searchParams.set('seed', this.seed);
    url.searchParams.set('size', '128');
    // ... other options
    this.avatarUrl = url.href;
  }
}
```

:::
