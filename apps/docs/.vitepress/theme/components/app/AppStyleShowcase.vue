<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { kebabCase } from 'change-case';
import Prando from 'prando';
import { ArrowRight, ArrowLeft } from '@lucide/vue';
import { UiAvatar, UiButton, UiContainer, UiSection, UiSectionHeader } from '../ui';
import { useVisibility } from '../../composables/useVisibility';
import { useAvatarStyleList } from '../../composables/avatar';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { once: false, threshold: 0.1 });
const avatarStyleList = useAvatarStyleList();

const seeds = ['Felix', 'Aneka', 'Milo', 'Luna', 'Max', 'Sophie', 'Leo', 'Emma', 'Noah', 'Aria', 'Zoe', 'Oscar'];

const showcaseAvatars = computed(() => {
  const prng = new Prando(42);
  const avatars: Array<{ style: string; seed: string }> = [];

  for (const style of avatarStyleList.value) {
    const seed = seeds[prng.nextInt(0, seeds.length - 1)];
    avatars.push({
      style: kebabCase(style),
      seed,
    });
  }

  return avatars;
});

const doubledAvatars = computed(() => [...showcaseAvatars.value, ...showcaseAvatars.value]);

const trackRef = ref<HTMLElement>();
let scrollPosition = 0;
let animationFrame: number | null = null;
let isPaused = false;
let scrollDirection = 1;

// Smooth scroll animation state
let isManualScrolling = false;
let scrollStartPosition = 0;
let scrollTargetPosition = 0;
let scrollStartTime = 0;
const scrollDuration = 400; // ms

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function getTotalWidth() {
  const itemWidth = 140;
  return showcaseAvatars.value.length * itemWidth;
}

function updateTrackTransform() {
  if (trackRef.value) {
    trackRef.value.style.transform = `translateX(-${scrollPosition}px)`;
  }
}

function animate() {
  if (!isVisible.value) {
    animationFrame = null;
    return;
  }

  if (isManualScrolling) {
    const elapsed = Date.now() - scrollStartTime;
    const progress = Math.min(elapsed / scrollDuration, 1);
    const easedProgress = easeOutCubic(progress);

    scrollPosition = scrollStartPosition + (scrollTargetPosition - scrollStartPosition) * easedProgress;

    if (progress >= 1) {
      isManualScrolling = false;
      // Normalize position after manual scroll
      const totalWidth = getTotalWidth();
      if (scrollPosition >= totalWidth) {
        scrollPosition = scrollPosition % totalWidth;
      }
      if (scrollPosition < 0) {
        scrollPosition = totalWidth + (scrollPosition % totalWidth);
      }
    }
  } else if (!isPaused) {
    scrollPosition += 0.5 * scrollDirection;
    const totalWidth = getTotalWidth();
    if (scrollPosition >= totalWidth) {
      scrollPosition = 0;
    }
    if (scrollPosition < 0) {
      scrollPosition = totalWidth;
    }
  }
  updateTrackTransform();
  animationFrame = requestAnimationFrame(animate);
}

function startAnimation() {
  if (animationFrame === null && isVisible.value) {
    animationFrame = requestAnimationFrame(animate);
  }
}

function pauseAnimation() {
  isPaused = true;
}

function resumeAnimation() {
  isPaused = false;
}

function smoothScroll(delta: number) {
  scrollStartPosition = scrollPosition;
  scrollTargetPosition = scrollPosition + delta;
  scrollStartTime = Date.now();
  isManualScrolling = true;
}

function scrollLeft() {
  smoothScroll(-300);
}

function scrollRight() {
  smoothScroll(300);
}

watch(isVisible, (visible) => {
  if (visible) {
    startAnimation();
  }
});

onMounted(() => {
  if (isVisible.value) {
    startAnimation();
  }
});

onUnmounted(() => {
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame);
  }
});
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" no-padding divider>
    <template #background>
      <div class="app-style-showcase-gradient"></div>
    </template>
    <UiContainer class="app-style-showcase-header">
      <UiSectionHeader
        badge="Explore the Collection"
        description="From cute characters to abstract patterns, pixel art to professional illustrations. Our avatar library features styles crafted by talented artists and designers."
      >
        <template #headline><strong>30+</strong> Unique Avatar Styles</template>
      </UiSectionHeader>
    </UiContainer>

    <div class="app-style-showcase-outer">
      <button class="app-style-showcase-scroll-btn app-style-showcase-scroll-btn-left" @click="scrollLeft" aria-label="Scroll left">
        <ArrowLeft />
      </button>

      <div class="app-style-showcase-wrapper">
        <div
          class="app-style-showcase-scroll"
          @mouseenter="pauseAnimation"
          @mouseleave="resumeAnimation"
          @touchstart="pauseAnimation"
          @touchend="resumeAnimation"
        >
          <div
            ref="trackRef"
            class="app-style-showcase-track"
          >
            <a
              v-for="(avatar, index) in doubledAvatars"
              :key="`${avatar.style}-${index}`"
              :href="`/styles/${avatar.style}/`"
              class="app-style-showcase-item"
            >
              <div class="app-style-showcase-avatar">
                <UiAvatar :style-name="avatar.style" :style-options="{ seed: avatar.seed, size: 120 }" :alt="`${avatar.style} style`" />
                <div class="app-style-showcase-avatar-glow"></div>
              </div>
              <span class="app-style-showcase-label">{{ avatar.style }}</span>
            </a>
          </div>
        </div>
      </div>

      <button class="app-style-showcase-scroll-btn app-style-showcase-scroll-btn-right" @click="scrollRight" aria-label="Scroll right">
        <ArrowRight />
      </button>
    </div>


    <UiContainer class="app-style-showcase-cta">
      <UiButton href="/styles/">
        Browse All Styles
        <ArrowRight :size="20" />
      </UiButton>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-style-showcase {
  &-gradient {
    background:
      radial-gradient(ellipse 60% 80% at 0% 50%, color-mix(in srgb, var(--vp-c-purple-1) 6%, transparent), transparent),
      radial-gradient(ellipse 60% 80% at 100% 50%, color-mix(in srgb, var(--vp-c-indigo-1) 5%, transparent), transparent);
  }

  &-header {
    padding: 0 24px;
    opacity: 0;
    transform: translateY(30px);
    transition: all var(--duration-reveal) var(--ease-smooth);

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &-outer {
    position: relative;
    padding: 0 60px;
  }

  &-wrapper {
    overflow-x: clip;
    overflow-y: visible;
    mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
    -webkit-mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
  }

  &-scroll-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--vp-c-bg);
    border: 2px solid var(--vp-c-border);
    border-radius: 50%;
    cursor: pointer;
    z-index: 10;
    transition: all var(--duration-fast) var(--ease-smooth);
    box-shadow: var(--vp-shadow-2);

    &:hover {
      border-color: var(--vp-c-brand-1);
      background: var(--vp-c-brand-soft);

      svg {
        color: var(--vp-c-brand-1);
      }
    }

    svg {
      width: 20px;
      height: 20px;
      color: var(--vp-c-text-2);
      transition: color var(--duration-fast) ease;
    }

    &-left {
      left: 24px;
    }

    &-right {
      right: 24px;
    }
  }

  &-scroll {
    overflow: visible;
    padding: 30px 0;
    margin: -30px 0;
  }

  &-track {
    display: flex;
    gap: 24px;
    width: max-content;
    will-change: transform;
    transform: translateZ(0);
  }

  &-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    transition: transform var(--duration-mid) var(--ease-spring);

    &:hover {
      transform: translateY(-4px) scale(1.02);

      .app-style-showcase-avatar {
        box-shadow:
          var(--vp-shadow-5),
          0 0 40px -10px var(--vp-c-brand-1);
      }

      .app-style-showcase-avatar-glow {
        opacity: 1;
      }

      .app-style-showcase-label {
        color: var(--vp-c-brand-1);
      }
    }

    &::after {
      display: none !important;
    }
  }

  &-avatar {
    width: 116px;
    height: 116px;
    border-radius: var(--vp-radius-xl);
    overflow: hidden;
    background: var(--vp-c-bg-soft);
    box-shadow: var(--vp-shadow-3);
    transition: all var(--duration-mid) var(--ease-smooth);
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &-glow {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, transparent 40%, rgba(22, 137, 204, 0.2));
      opacity: 0;
      transition: opacity var(--duration-mid) ease;
    }
  }

  &-label {
    font-size: 13px;
    color: var(--vp-c-text-3);
    font-weight: 500;
    max-width: 116px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color var(--duration-mid) ease;
  }

  &-cta {
    text-align: center;
    margin-top: 40px;
  }
}

@media (max-width: 768px) {
  .app-style-showcase {
    &-outer {
      padding: 0;
    }

    &-scroll-btn {
      display: none;
    }

    &-avatar {
      width: 88px;
      height: 88px;
      border-radius: var(--vp-radius-md);
    }

    &-track {
      gap: 16px;
    }

    &-label {
      max-width: 88px;
      font-size: 11px;
    }
  }
}
</style>
