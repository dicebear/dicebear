<script setup lang="ts">
import { ref } from 'vue';
import { UiContainer, UiSection, UiSectionHeader } from '../ui';
import AppUseCasesCard from './AppUseCasesCard.vue';
import { getAvatarApiUrl } from '@theme/utils/avatar/api';
import { PALETTE, type Pastel } from '@theme/utils/palette';
import { useVisibility } from '../../composables/useVisibility';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.15 });

function avatar(
  styleName: string,
  seed: string,
  size: number,
  background?: Pastel,
): string {
  return getAvatarApiUrl(styleName, {
    seed,
    size,
    ...(background ? { backgroundColor: background } : {}),
  });
}
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider>
    <template #background>
      <div class="app-use-cases-gradient-top"></div>
      <div class="app-use-cases-gradient-bottom"></div>
    </template>
    <UiContainer>
      <UiSectionHeader
        class="app-use-cases-header"
        description="From two-person side projects to global platforms, DiceBear powers the avatar layer wherever identity needs a face."
      >
        <template #headline
          >Built for <strong>every</strong> application.</template
        >
      </UiSectionHeader>

      <div class="app-use-cases-grid">
        <AppUseCasesCard
          title="User Profiles"
          description="Give every user a unique avatar from day one. No upload, no Gravatar fallback, no awkward gray silhouette."
        >
          <div class="uc-stack">
            <img
              :src="avatar('lorelei', 'Mia', 96, PALETTE.rose)"
              alt=""
              width="80"
              height="80"
              loading="lazy"
              decoding="async"
            />
            <img
              :src="avatar('notionists', 'Bee', 96, PALETTE.amber)"
              alt=""
              width="80"
              height="80"
              loading="lazy"
              decoding="async"
            />
            <img
              :src="avatar('adventurer', 'Theo', 96, PALETTE.cyan)"
              alt=""
              width="80"
              height="80"
              loading="lazy"
              decoding="async"
            />
            <img
              :src="avatar('personas', 'Sage', 96, PALETTE.peach)"
              alt=""
              width="80"
              height="80"
              loading="lazy"
              decoding="async"
            />
          </div>
        </AppUseCasesCard>

        <AppUseCasesCard
          title="Chat Applications"
          description="Instantly recognizable participants. Deterministic from a user ID, so the same person looks the same on every device."
        >
          <div class="uc-bubbles">
            <div class="uc-bubble uc-bubble-light uc-bubble-pink">
              <img
                :src="avatar('fun-emoji', 'Hi', 48, PALETTE.pink)"
                alt=""
                width="24"
                height="24"
                loading="lazy"
                decoding="async"
              />
              <span>Hey 👋</span>
            </div>
            <div class="uc-bubble uc-bubble-dark">
              <span>How's the launch?</span>
              <img
                :src="avatar('lorelei', 'Otis', 48, PALETTE.amber)"
                alt=""
                width="24"
                height="24"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div class="uc-bubble uc-bubble-light uc-bubble-green">
              <img
                :src="avatar('big-smile', 'Ari', 48, PALETTE.green)"
                alt=""
                width="24"
                height="24"
                loading="lazy"
                decoding="async"
              />
              <span>Going great!</span>
            </div>
          </div>
        </AppUseCasesCard>

        <AppUseCasesCard
          title="Gaming"
          description="Generate millions of unique player identities, NPCs and bots. The same seed gives the same character every session."
        >
          <div class="uc-roster">
            <div class="uc-player">
              <img
                :src="avatar('bottts', 'Zap', 160)"
                alt=""
                width="160"
                height="160"
                loading="lazy"
                decoding="async"
              />
              <span class="uc-rank">LV 47</span>
            </div>
            <div class="uc-player">
              <img
                :src="avatar('pixel-art', 'Nyx', 160)"
                alt=""
                width="160"
                height="160"
                loading="lazy"
                decoding="async"
              />
              <span class="uc-rank">LV 32</span>
            </div>
            <div class="uc-player">
              <img
                :src="avatar('bottts-neutral', 'Rex', 160)"
                alt=""
                width="160"
                height="160"
                loading="lazy"
                decoding="async"
              />
              <span class="uc-rank">LV 88</span>
            </div>
          </div>
        </AppUseCasesCard>

        <AppUseCasesCard
          title="Forums &amp; Communities"
          description="Distinct identities help build community trust. New users feel welcome with a face from the very first post."
        >
          <div class="uc-thread">
            <div class="uc-post">
              <img
                :src="avatar('notionists', 'Posy', 56, PALETTE.lime)"
                alt=""
                width="28"
                height="28"
                loading="lazy"
                decoding="async"
              />
              <div>
                <strong>posy</strong>
                <em>Anyone tried the new beta?</em>
              </div>
            </div>
            <div class="uc-post">
              <img
                :src="avatar('lorelei', 'Ren', 56, PALETTE.cyan)"
                alt=""
                width="28"
                height="28"
                loading="lazy"
                decoding="async"
              />
              <div>
                <strong>ren</strong>
                <em>Yep, runs 2× faster.</em>
              </div>
            </div>
            <div class="uc-post">
              <img
                :src="avatar('open-peeps', 'Ivo', 56, PALETTE.amber)"
                alt=""
                width="28"
                height="28"
                loading="lazy"
                decoding="async"
              />
              <div>
                <strong>ivo</strong>
                <em>Submitted a PR for the bug.</em>
              </div>
            </div>
          </div>
        </AppUseCasesCard>

        <AppUseCasesCard
          title="Team Tools"
          description="Visual distinction for team members in collaborative apps. In cursors, mentions, and sidebars, every face stays consistent."
        >
          <div class="uc-team">
            <div class="uc-pill">
              <img
                :src="avatar('personas', 'Lex', 52)"
                alt=""
                width="26"
                height="26"
                loading="lazy"
                decoding="async"
              />
              <span>Lex Hart</span>
              <em>Design</em>
            </div>
            <div class="uc-pill">
              <img
                :src="avatar('personas', 'Mae', 52)"
                alt=""
                width="26"
                height="26"
                loading="lazy"
                decoding="async"
              />
              <span>Mae Park</span>
              <em>Engineering</em>
            </div>
            <div class="uc-pill">
              <img
                :src="avatar('personas', 'Sam', 52)"
                alt=""
                width="26"
                height="26"
                loading="lazy"
                decoding="async"
              />
              <span>Sam Ito</span>
              <em>Product</em>
            </div>
            <div class="uc-pill">
              <img
                :src="avatar('personas', 'Avery', 52)"
                alt=""
                width="26"
                height="26"
                loading="lazy"
                decoding="async"
              />
              <span>Avery Lin</span>
              <em>Marketing</em>
            </div>
          </div>
        </AppUseCasesCard>

        <AppUseCasesCard
          title="Placeholder Images"
          description="Beautiful default profile pictures while users set up their account, and a graceful fallback when uploads fail."
        >
          <div class="uc-grid-mini">
            <img
              :src="avatar('shapes', 'A', 160, PALETTE.rose)"
              alt=""
              width="160"
              height="160"
              loading="lazy"
              decoding="async"
            />
            <img
              :src="avatar('shapes', 'B', 160, PALETTE.amber)"
              alt=""
              width="160"
              height="160"
              loading="lazy"
              decoding="async"
            />
            <img
              :src="avatar('shapes', 'C', 160, PALETTE.green)"
              alt=""
              width="160"
              height="160"
              loading="lazy"
              decoding="async"
            />
            <img
              :src="avatar('shapes', 'D', 160, PALETTE.cyan)"
              alt=""
              width="160"
              height="160"
              loading="lazy"
              decoding="async"
            />
            <img
              :src="avatar('shapes', 'E', 160, PALETTE.blue)"
              alt=""
              width="160"
              height="160"
              loading="lazy"
              decoding="async"
            />
            <img
              :src="avatar('shapes', 'F', 160, PALETTE.peach)"
              alt=""
              width="160"
              height="160"
              loading="lazy"
              decoding="async"
            />
          </div>
        </AppUseCasesCard>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-use-cases {
  &-gradient-top {
    top: 0;
    bottom: auto;
    height: 50%;
    background: radial-gradient(
      ellipse 100% 100% at 20% 0%,
      color-mix(in srgb, var(--vp-c-brand-1) 7%, transparent),
      transparent
    );
  }

  &-gradient-bottom {
    top: auto;
    bottom: 0;
    height: 50%;
    background: radial-gradient(
      ellipse 100% 100% at 80% 100%,
      color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent),
      transparent
    );
  }

  &-header {
    opacity: 0;
    transform: translateY(30px);
    transition: all var(--duration-reveal) var(--ease-smooth);

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }
}

.uc-stack {
  position: relative;
  height: 100px;
  margin-top: 4px;

  img {
    position: absolute;
    width: 80px;
    height: 80px;
    border-radius: 22px;
    box-shadow: 0 6px 14px rgba(15, 23, 42, 0.1);
    transition: transform var(--duration-mid) ease;

    &:nth-child(1) {
      left: 0;
      top: 6px;
      transform: rotate(-7deg);
    }
    &:nth-child(2) {
      left: 60px;
      top: 0;
      transform: rotate(3deg);
    }
    &:nth-child(3) {
      left: 120px;
      top: 8px;
      transform: rotate(-3deg);
    }
    &:nth-child(4) {
      left: 180px;
      top: 2px;
      transform: rotate(6deg);
    }
  }

  .uc-card:hover & img:nth-child(1) {
    transform: rotate(-12deg) translateY(-4px);
  }

  .uc-card:hover & img:nth-child(4) {
    transform: rotate(11deg) translateY(-4px);
  }
}

.uc-bubbles {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.uc-bubble {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px 8px 8px;
  border-radius: 18px;
  max-width: 80%;
  box-shadow: 0 3px 10px rgba(15, 23, 42, 0.06);

  &-pink,
  &-green {
    align-self: flex-start;
    color: #18181b;
  }

  &-pink {
    background: #ffe4f1;
  }
  &-green {
    background: #dcfce7;
  }

  &-dark {
    align-self: flex-end;
    padding: 8px 8px 8px 12px;
    background: #18181b;
    color: #fafafa;
  }

  :global(.dark .uc-bubble-dark) {
    background: #fafafa;
    color: #18181b;
  }

  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  span {
    font-size: 12.5px;
    font-weight: 600;
  }
}

.uc-roster {
  display: flex;
  gap: 10px;
}

.uc-player {
  position: relative;
  flex: 1;
  aspect-ratio: 1;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(180deg, #1e293b, #0f172a);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.uc-rank {
  position: absolute;
  left: 6px;
  bottom: 6px;
  background: #facc15;
  color: #422006;
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  font-weight: 800;
  padding: 3px 6px;
  border-radius: 5px;
  letter-spacing: 0.3px;
}

.uc-thread {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.uc-post {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;

  img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  strong {
    display: block;
    font-size: 12.5px;
    font-weight: 700;
    color: var(--vp-c-text-1);
  }

  em {
    font-size: 11.5px;
    font-style: normal;
    color: var(--vp-c-text-2);
  }
}

.uc-team {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.uc-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 12px 7px 7px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;

  img {
    width: 26px;
    height: 26px;
    border-radius: 50%;
  }

  span {
    font-size: 13px;
    font-weight: 700;
    color: var(--vp-c-text-1);
  }

  em {
    margin-left: auto;
    font-style: normal;
    font-size: 11px;
    color: var(--vp-c-text-2);
    font-family: var(--vp-font-family-mono);
  }
}

.uc-grid-mini {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;

  img {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 10px;
  }
}

@media (max-width: 900px) {
  .app-use-cases-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .app-use-cases-grid {
    grid-template-columns: 1fr;
  }
}
</style>
