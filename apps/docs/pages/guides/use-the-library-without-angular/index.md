# How to use the library with Angular?

**Step 1: Install DiceBear**
Choose your package manager:

npm

```
npm install @dicebear/core @dicebear/collection --save
```

pnpm

```
pnpm install @dicebear/core @dicebear/collection --save

```

**Step 2: Generate Avatars in Angular**

```
import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';
```

Then in your component

```
generateAvatar(StudentName: string): SafeUrl | null {
    try {
      if (typeof createAvatar === 'function' && openPeeps) {  
        console.log('name passed to dicebear:', StudentName);
        const avatar = createAvatar(openPeeps, //pass the avatar style here e.g openPeeps, Adventurer,Big Ears, etc {  
          seed: StudentName, // the names you want to use to generate the icons
          backgroundColor: ['#E7EDF4'],
          scale: 80
        }).toString();
        return this.sanitizer.bypassSecurityTrustUrl(`data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`);
      }
    } catch (error) {
      console.error('Failed to generate avatar:', error);
      // Fallback to empty or default avatar
      // this.myAvatar = this.sanitizer.bypassSecurityTrustUrl('path/to/default-avatar.svg');
    }
    return null; // Return null if avatar generation fails 
  }

```
  
Template Usage

```
<div class="h-9 w-9 flex-shrink-0 rounded-full overflow-hidden bg-gray-200">
<img [src]="generateAvatar(name)" alt="Avatar" class="w-full h-full object-cover">
</div>
```

**Step 3: sanitize the url**
import the safeurl or use it as a pipe if you have it(custom one its not a core pipe).

```
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

```

```
return this.sanitizer.bypassSecurityTrustUrl(`data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`);
```

# Full Implementation
avatar.component.ts

```

import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
})
export class AvatarComponent {


  constructor(private sanitizer: DomSanitizer) {}

  seedName = 'shadrack'

  generateAvatar(seedName: string): SafeUrl | null {
    try {
      if (typeof createAvatar === 'function' && openPeeps) {
        console.log('name passed to dicebear:', seedName);
        const avatar = createAvatar(openPeeps, {
          seed: seedName,
          backgroundColor: ['#E7EDF4'],
          scale: 80,
          //other options
        }).toString();
        return this.sanitizer.bypassSecurityTrustUrl(`data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`);
      }
    } catch (error) {
      console.error('Failed to generate avatar:', error);
      // Fallback to empty or default avatar
      // this.myAvatar = this.sanitizer.bypassSecurityTrustUrl('path/to/default-avatar.svg');
    }
    return null; // Return null if avatar generation fails 
  }
}

```

avatar.component.html

```
<div class="h-9 w-9 flex-shrink-0 rounded-full overflow-hidden bg-gray-200">
<img [src]="generateAvatar(seedName)" alt="Avatar" class="w-full h-full object-cover">
</div>

```

or 

```
<div class="h-9 w-9 flex-shrink-0 rounded-full overflow-hidden bg-gray-200">
<img [src]="generateAvatar('some-other-name')" alt="Avatar" class="w-full h-full object-cover">
</div>
```
