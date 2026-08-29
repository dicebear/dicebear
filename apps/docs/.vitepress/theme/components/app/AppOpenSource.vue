<script setup lang="ts">
import { ref, computed } from 'vue';
import { Star, Heart } from '@lucide/vue';
import { siGithub } from 'simple-icons';
import { kebabCase } from 'change-case';
import Prando from 'prando';
import Button from 'primevue/button';
import {
  UiAvatar,
  UiHeadline,
  UiDescription,
  UiContainer,
  UiSection,
  UiIcon,
} from '../ui';
import { useVisibility } from '../../composables/useVisibility';
import { useAvatarStyleList } from '../../composables/avatar';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef);

const avatarStyleList = useAvatarStyleList();

// Generate scattered avatars around the star CTA
const scatteredAvatars = computed(() => {
  const prng = new Prando(555);
  const avatars = [];
  const seeds = [
    'OpenSource',
    'Community',
    'Stars',
    'Love',
    'Code',
    'Free',
    'MIT',
    'GitHub',
  ];

  for (let i = 0; i < 8; i++) {
    const style = kebabCase(
      avatarStyleList.value[i % avatarStyleList.value.length],
    );
    const angle = (i / 8) * Math.PI * 2;
    const radius = 38 + prng.next() * 10;
    avatars.push({
      style,
      seed: seeds[i],
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
      size: 40 + prng.next() * 24,
      delay: i * 0.15,
      rotation: prng.next() * 20 - 10,
    });
  }
  return avatars;
});
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider center>
    <template #background>
      <div class="app-open-source-gradient"></div>
      <!-- Scattered avatar decorations -->
      <div
        v-for="(avatar, index) in scatteredAvatars"
        :key="index"
        class="app-open-source-bg-avatar"
        :style="{
          left: `${avatar.x}%`,
          top: `${avatar.y}%`,
          width: `${avatar.size}px`,
          height: `${avatar.size}px`,
          '--rotation': `${avatar.rotation}deg`,
          animationDelay: `${avatar.delay}s`,
        }"
      >
        <UiAvatar
          :style-name="avatar.style"
          :style-options="{ seed: avatar.seed, size: 80 }"
          :alt="avatar.style"
        />
      </div>
    </template>
    <UiContainer class="app-open-source-container">
      <!-- Animated star icon -->
      <div class="app-open-source-star-wrapper">
        <div class="app-open-source-star-ring"></div>
        <div
          class="app-open-source-star-ring app-open-source-star-ring-2"
        ></div>
        <div class="app-open-source-star-icon">
          <Star :size="36" />
        </div>
      </div>

      <UiHeadline
        >Free and <strong>Open Source</strong>.<br />Forever.</UiHeadline
      >

      <UiDescription class="app-open-source-description">
        DiceBear is built in the open. Our core library is MIT licensed, and we
        believe in transparent development. Join thousands of developers who
        already love DiceBear.
      </UiDescription>

      <div class="app-open-source-actions">
        <Button
          as="a"
          href="https://github.com/dicebear/dicebear"
          target="_blank"
          rel="noopener"
          size="large"
          severity="contrast"
          class="app-open-source-star-btn"
        >
          <UiIcon :path="siGithub.path" :size="20" />
          Star on GitHub
        </Button>
        <Button
          as="a"
          href="/contribute/library/"
          size="large"
          severity="secondary"
          variant="outlined"
          class="app-open-source-contribute"
        >
          <Heart :size="20" />
          Contribute
        </Button>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss">
:root {
  --app-open-source-star-color: #f59e0b;
  --app-open-source-ring-color: rgba(245, 158, 11, 0.15);
}
.dark {
  --app-open-source-star-color: #fbbf24;
  --app-open-source-ring-color: rgba(251, 191, 36, 0.12);
}
</style>

<style lang="scss" scoped>
.app-open-source {
  &-gradient {
    background:
      radial-gradient(
        ellipse 60% 60% at 50% 50%,
        color-mix(in srgb, var(--app-open-source-star-color) 6%, transparent),
        transparent
      ),
      radial-gradient(
        ellipse 50% 80% at 50% 0%,
        color-mix(in srgb, var(--vp-c-brand-1) 4%, transparent),
        transparent
      );
  }

  &-bg-avatar {
    position: absolute;
    border-radius: var(--vp-radius-sm);
    overflow: hidden;
    opacity: 0;
    pointer-events: none;

    .visible & {
      animation: app-open-source-avatar-float 0.6s var(--ease-spring) forwards;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &-container {
    opacity: 0;
    transform: translateY(40px);
    transition: all var(--duration-reveal) var(--ease-smooth);

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Star wrapper with animated rings */
  &-star-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    margin-bottom: 32px;
  }

  &-star-ring {
    position: absolute;
    inset: 0;
    border: 2px solid var(--app-open-source-ring-color);
    border-radius: 50%;
    animation: app-open-source-ring-pulse 3s ease-in-out infinite;

    &-2 {
      inset: -12px;
      border-width: 1px;
      animation-delay: -1.5s;
    }
  }

  &-star-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      var(--app-open-source-star-color),
      #f97316
    );
    color: white;
    box-shadow: 0 8px 24px
      color-mix(in srgb, var(--app-open-source-star-color) 40%, transparent);
    z-index: 1;
    animation: app-open-source-star-bounce 2s ease-in-out infinite;

    svg {
      fill: currentColor;
    }
  }

  &-description {
    margin-bottom: 40px;
    max-width: 600px;
  }

  &-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
  }

  &-heart-icon {
    color: #f43f5e;
  }
}

@keyframes app-open-source-ring-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.4;
  }
}

@keyframes app-open-source-star-bounce {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-4px) rotate(-3deg);
  }
  75% {
    transform: translateY(2px) rotate(2deg);
  }
}

@keyframes app-open-source-avatar-float {
  from {
    opacity: 0;
    transform: scale(0.5) rotate(var(--rotation, 0deg));
  }
  to {
    opacity: 0.08;
    transform: scale(1) rotate(var(--rotation, 0deg));
  }
}

@media (max-width: 768px) {
  .app-open-source {
    &-bg-avatar {
      display: none;
    }

    &-actions {
      flex-direction: column;
    }
  }
}
</style>
