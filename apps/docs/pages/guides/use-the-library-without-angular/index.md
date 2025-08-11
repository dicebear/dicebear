# How to use the library with Angular?

avatar.component.ts

```

import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-avatar',
  template: `
    <div class="h-9 w-9 flex-shrink-0 rounded-full overflow-hidden bg-gray-200">
    <img [src]="generateAvatar('shadrack')" alt="Avatar" class="w-full h-full object-cover">
    </div>`,
})
export class AvatarComponent {
  constructor(private sanitizer: DomSanitizer) {}

  generateAvatar(seedName: string): SafeUrl | null {
    try {
        const avatar = createAvatar(openPeeps, {
          seed: seedName,
          //other options
        }).toString();
        return this.sanitizer.bypassSecurityTrustUrl(`data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`);
      }
    } catch (error) {
      console.error('Failed to generate avatar:', error);
    }
    return null; 
  }
```