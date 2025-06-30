# Right Sidebar DOM Targeting (May 2025+)

This document provides a quick-reference guide to the stable DOM selectors for Spotify's right sidebar, also known as the "Now Playing" view. Use these selectors for CSS theming and JavaScript observation.

> **Note:** These selectors are based on the May 2025 Spotify UI refresh. Legacy selectors from older versions have been removed for clarity but can be found in the Git history if needed.

---

### Selector Cheat-Sheet

These selectors map to the _current_ Spotify right-sidebar and are the recommended targets for any new development.

- `div.Root__right-sidebar[data-testid="right-sidebar"]` – Root container for the entire right sidebar panel.
- `div[data-testid="NPV_Panel_OpenDiv"]` – Primary "Now Playing" panel wrapper that becomes visible when the sidebar is open.
  - `div.main-nowPlayingView-nowPlayingWidget` – Widget wrapper.
  - `div.main-nowPlayingView-nowPlayingGrid` – Two-column grid that houses artwork + context info.
    - `div.main-nowPlayingView-coverArtContainer` – Large cover-art container.
      - `div[data-testid="track-visual-enhancement"]` – Animated / video overlay.
      - `div.main-nowPlayingView-coverArt` – Static artwork element.
    - `div.main-nowPlayingView-contextItemInfo` – Metadata & control column.
      - `div.main-trackInfo-container` – Title / artist block.
      - `[data-encore-id="buttonTertiary"]` – Tertiary action buttons (copy link, add to playlist, …).

#### Sidebar Sections

All sections are contained within `div.main-nowPlayingView-section`.

- **About Artist:** `div.main-nowPlayingView-section` where the header text equals _"About the artist"_.
- **Credits:** `div.main-nowPlayingView-section.main-nowPlayingView-credits`.
- **Queue:** `div.main-nowPlayingView-section.main-nowPlayingView-queue`.
  - **Queue Items:** `li.main-useDropTarget-base` rows inside the queue’s `<ul>`.

> **Tip:** Prefer attribute selectors such as `[data-testid]` or `[data-encore-id]` when possible. They survive minor layout or class-name tweaks better than pure class selectors.

---

<details>
<summary>Raw DOM Snapshot (May 2025)</summary>

```html
<div
  data-overlayscrollbars-initialize="true"
  class="cZCuJDjrGA2QMXja_Sua ZjfaJlGQZ42nCWjD3FDm"
  data-overlayscrollbars="host"
>
  <div
    class=""
    data-overlayscrollbars-viewport="scrollbarHidden overflowXHidden overflowYHidden"
    tabindex="-1"
    style="margin-right: 0px; margin-bottom: 0px; margin-left: 0px; top: 0px; right: auto; left: 0px; width: calc(100% + 0px); padding: 0px;"
  >
    <div class="AAdBM1nhG73supMfnYX7 zduvaX0Ioxqd5ypeWoAf IkRGajTjItEFQkRMeH6v">
      <div class="nw2W4ZMdICuBo08Tzxg9" data-testid="NPV_Panel_OpenDiv">
        <div class="main-nowPlayingView-nowPlayingWidget">
          <div class="main-nowPlayingView-nowPlayingGrid">
            <div
              class="main-nowPlayingView-coverArtContainer hCImOEZCJwYaSy2r1Xgx pUIBQ9cykHKYx2A2ZIPA"
            >
              <div
                class="ylBRlfNqGnzVa4kjUQGP"
                aria-hidden="false"
                data-testid="track-visual-enhancement"
              >
                <div draggable="true" class="URfgKDbFQpKuN8ZjGdui">
                  <a
                    draggable="false"
                    data-testid="context-link"
                    data-context-item-type="track"
                    aria-label="Now playing: 2017 Toyota Corolla by 2003 Toyota Corolla"
                    href="/album/1Ec0kr9sH3WUDGtF3D77Lr?uid=6ef517fbdb471215a547&amp;uri=spotify%3Atrack%3A1T1UPEkNg0x0GlOshyWdch&amp;page=0&amp;index=48"
                    style="border: none;"
                    ><div
                      class="main-nowPlayingView-coverArt SwS3WdCPfdr1uOOksVEB"
                    >
                      <div
                        class="cover-art cover-art-auto-height"
                        aria-hidden="true"
                      >
                        <div class="cover-art-icon">
                          <svg
                            data-encore-id="icon"
                            role="img"
                            aria-hidden="true"
                            class="e-9960-icon e-9960-baseline"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5z"
                            ></path>
                          </svg>
                        </div>
                        <img
                          aria-hidden="false"
                          draggable="false"
                          loading="eager"
                          src="https://i.scdn.co/image/ab67616d0000b27362507f51b4875d4d6b2136e7"
                          alt=""
                          class="main-image-image cover-art-image main-image-loaded"
                        />
                      </div></div
                  ></a>
                </div>
              </div>
              <div
                class="E08D6ucrHuPJYzzGO7HG S6W0kreMgaIXYWSEYHya"
                aria-hidden="true"
              >
                <div draggable="true"></div>
              </div>
              <div
                id="VideoPlayerNpv_ReactPortal"
                class="KrBYgWLGb5aRHjoD_prX"
              ></div>
            </div>
            <div class="main-nowPlayingView-contextItemInfo">
              <div
                class="KHaAkbA62j5I7pcLsDAx"
                data-testid="minimized-track-visual-enhancement"
              >
                <div draggable="true">
                  <a
                    draggable="false"
                    data-testid="context-link"
                    data-context-item-type="track"
                    aria-label="Now playing: 2017 Toyota Corolla by 2003 Toyota Corolla"
                    href="/album/1Ec0kr9sH3WUDGtF3D77Lr?uid=6ef517fbdb471215a547&amp;uri=spotify%3Atrack%3A1T1UPEkNg0x0GlOshyWdch&amp;page=0&amp;index=48"
                    style="border: none;"
                    ><div class="jKvr1cqkZZXpH5z92z9b peN_VMHSmvTVUx9rneyY">
                      <div
                        class="cover-art cover-art-auto-height"
                        aria-hidden="true"
                      >
                        <div class="cover-art-icon">
                          <svg
                            data-encore-id="icon"
                            role="img"
                            aria-hidden="true"
                            class="e-9960-icon e-9960-baseline"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5z"
                            ></path>
                          </svg>
                        </div>
                        <img
                          aria-hidden="false"
                          draggable="false"
                          loading="eager"
                          src="https://i.scdn.co/image/ab67616d0000485162507f51b4875d4d6b2136e7"
                          alt=""
                          class="main-image-image cover-art-image main-image-loaded"
                        />
                      </div></div
                  ></a>
                </div>
              </div>
              <div
                class="main-nowPlayingView-trackInfo main-trackInfo-container"
                data-sn-glyph=""
              >
                <div class="main-trackInfo-name">
                  <div class="main-trackInfo-overlay">
                    <span class="cpltqpeZsQmmXy7qZgb9"
                      ><span
                        class="main-trackInfo-contentWrapper"
                        style="--marquee-width: 358px;"
                        ><div
                          class="e-9960-text encore-text-title-small K9Nj3oI7bTNFh5AGp5GA"
                          data-encore-id="text"
                          dir="auto"
                        >
                          <span draggable="true"
                            ><a
                              draggable="false"
                              href="/album/1Ec0kr9sH3WUDGtF3D77Lr"
                              >2017 Toyota Corolla</a
                            ></span
                          >
                        </div></span
                      ></span
                    >
                  </div>
                </div>
                <div class="main-trackInfo-enhanced"></div>
                <div class="main-trackInfo-artists">
                  <div class="main-trackInfo-overlay">
                    <span class="cpltqpeZsQmmXy7qZgb9"
                      ><span
                        class="main-trackInfo-contentWrapper"
                        style="--marquee-width: 157px;"
                        ><div
                          class="e-9960-text encore-text-body-medium encore-internal-color-text-subdued main-trackInfo-artists"
                          data-encore-id="text"
                        >
                          <span
                            ><a
                              draggable="true"
                              dir="auto"
                              href="/artist/6FYMANNdpYv2Y9prysxwCW"
                              >2003 Toyota Corolla</a
                            ></span
                          >
                        </div></span
                      ></span
                    >
                  </div>
                </div>
              </div>
              <button
                tabindex="0"
                class="Button-sc-1dqy6lx-0 Button-buttonTertiary-medium-iconOnly-useBrowserDefaultFocusStyle-condensed-condensedAll e-9960-overflow-wrap-anywhere e-9960-button-tertiary--icon-only e-9960-button-tertiary--condensed pvGZ831aNzHTQMZ8CA_u DFvRASpHOFAoziM4w7En sJHheSrjFUt_MAcNrUXQ"
                aria-label="Copy link to Song"
                aria-hidden="false"
                data-encore-id="buttonTertiary"
              >
                <span aria-hidden="true" class="e-9960-button__icon-wrapper"
                  ><svg
                    data-encore-id="icon"
                    role="img"
                    aria-hidden="true"
                    class="e-9960-icon e-9960-baseline"
                    viewBox="0 0 24 24"
                    style=""
                  >
                    <path
                      d="M3 8a1 1 0 0 1 1-1h3.5v2H5v11h14V9h-2.5V7H20a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"
                    ></path>
                    <path
                      d="M12 12.326a1 1 0 0 0 1-1V3.841l1.793 1.793a1 1 0 1 0 1.414-1.414L12 .012 7.793 4.22a1 1 0 1 0 1.414 1.414L11 3.84v7.485a1 1 0 0 0 1 1z"
                    ></path></svg
                ></span>
              </button>
              <div class="O5NOY8Xw4NH0IhBZu8tm">
                <button
                  aria-checked="true"
                  class="Button-sc-1dqy6lx-0 Button-buttonTertiary-textBrightAccent-medium-iconOnly-useBrowserDefaultFocusStyle-condensed e-9960-overflow-wrap-anywhere e-9960-button-tertiary--icon-only e-9960-button-tertiary--condensed hhFdIYRyHsqlCHy7T_8A"
                  aria-label="Add to playlist"
                  data-encore-id="buttonTertiary"
                >
                  <span aria-hidden="true" class="e-9960-button__icon-wrapper"
                    ><svg
                      data-encore-id="icon"
                      role="img"
                      aria-hidden="true"
                      class="e-9960-icon e-9960-baseline"
                      viewBox="0 0 24 24"
                      style="--encore-icon-fill: var(--text-bright-accent, #107434);"
                    >
                      <path
                        d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12m16.398-2.38a1 1 0 0 0-1.414-1.413l-6.011 6.01-1.894-1.893a1 1 0 0 0-1.414 1.414l3.308 3.308z"
                      ></path></svg
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="main-nowPlayingView-section QR9JmVmX9LYwo62NRtew">
          <button
            type="button"
            aria-label="2003 Toyota Corolla"
            class="k90FaSa2GhsINq5izwhz"
            tabindex="0"
          >
            <div class="XxNYTMMTOE82fg4VfwMu">
              <div class="Rol5Gmuk1O2tMw7NMtxF">
                <div class="BNUKh7vF7Z90gfa0YoHu">
                  <div class="main-nowPlayingView-sectionHeader">
                    <h2
                      class="e-9960-text encore-text-body-medium-bold encore-internal-color-text-base"
                      data-encore-id="text"
                    >
                      <div class="main-nowPlayingView-sectionHeaderText">
                        About the artist
                      </div>
                    </h2>
                  </div>
                </div>
                <figure
                  class="main-avatar-avatar"
                  title="2003 Toyota Corolla"
                  style="width: 80px; height: 80px;"
                >
                  <div
                    class=""
                    style="width: 80px; height: 80px; inset-inline-start: 0px;"
                  >
                    <img
                      aria-hidden="false"
                      draggable="false"
                      loading="eager"
                      src="https://i.scdn.co/image/ab6761610000101f84a4c933c84418a9b19a64f2"
                      alt="2003 Toyota Corolla"
                      class="main-image-image main-avatar-image main-image-loaded"
                    />
                  </div>
                </figure>
              </div>
              <div class="CvxzmyND_aGd2RR8ZoSr">
                <a href="/artist/6FYMANNdpYv2Y9prysxwCW"
                  ><span
                    class="e-9960-text encore-text-body-medium-bold"
                    data-encore-id="text"
                    dir="auto"
                    >2003 Toyota Corolla</span
                  ></a
                >
                <div class="main-nowPlayingView-aboutArtistV2Listeners">
                  <div
                    class="e-9960-text encore-text-body-medium encore-internal-color-text-subdued EUZ35kQ5pEz50WCc4OwW"
                    data-encore-id="text"
                  >
                    218,962 monthly listeners
                  </div>
                  <div
                    tabindex="0"
                    class="Button-sc-y0gtbx-0 Button-buttonSecondary-small-useBrowserDefaultFocusStyle encore-text-body-small-bold e-9960-button--small HfjKySFpamYeN3Ya5lZA"
                    data-encore-id="buttonSecondary"
                  >
                    Follow
                  </div>
                </div>
                <span
                  class="e-9960-text encore-text-body-small encore-internal-color-text-subdued r8e3SfYjm_1JbXLXV3YP"
                  data-encore-id="text"
                  >funny car vaporwave she/her/it/its
                  https://cherryhayhay.neocities.org/</span
                >
              </div>
            </div>
          </button>
        </div>
        <!-- truncated for brevity -->
      </div>
    </div>
  </div>
</div>
```

</details>
