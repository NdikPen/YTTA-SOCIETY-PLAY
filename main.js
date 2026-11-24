const STORAGE_KEY = "ytta_society_custom_playlists_v1";
const PLAY_ICON = '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
const PAUSE_ICON = '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
const VOL_ON_ICON = '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
const VOL_MUTE_ICON = '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"/></svg>';
const REPEAT_ICON = '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>';

/** @type {Array<{ id: number, title: string, artist: string, duration?: string, src: string }>} */
let playlist = [];
/** @type {Array<{ id: string, name: string, trackIds: number[] }>} */
let customPlaylists = loadCustomPlaylists();
/** @type {string | null} */
let activePlaylistId = customPlaylists.length ? customPlaylists[0].id : null;
/** @type {"home" | "search" | "playlist" | "settings"} */
let currentView = "home";
/** @type {{ id: number, title: string, artist: string, duration?: string, src: string } | null} */
let currentTrack = null;
let isPlaying = false;
let isSeeking = false;
let isShuffle = false;
/** @type {"all" | "one"} */
let repeatMode = "all";
let searchQuery = "";
/** @type {number | null} */
let assigningTrackId = null;

const menuToggleBtn = /** @type {HTMLButtonElement} */ (document.getElementById("menu-toggle-btn"));
const sidebar = /** @type {HTMLElement} */ (document.getElementById("sidebar"));
const sidebarBackdrop = /** @type {HTMLElement} */ (document.getElementById("sidebar-backdrop"));
const navHome = /** @type {HTMLButtonElement} */ (document.getElementById("nav-home"));
const navSearch = /** @type {HTMLButtonElement} */ (document.getElementById("nav-search"));
const navPlaylist = /** @type {HTMLButtonElement} */ (document.getElementById("nav-playlist"));
const navSettings = /** @type {HTMLButtonElement} */ (document.getElementById("nav-settings"));

const headerSectionLabel = /** @type {HTMLElement} */ (document.getElementById("header-section-label"));
const panelTitle = /** @type {HTMLElement} */ (document.getElementById("panel-title"));
const playlistSection = /** @type {HTMLElement} */ (document.getElementById("playlist-section"));
const playlistCardsGrid = /** @type {HTMLElement} */ (document.getElementById("playlist-cards-grid"));
const searchSection = /** @type {HTMLElement} */ (document.getElementById("search-section"));
const settingsSection = /** @type {HTMLElement} */ (document.getElementById("settings-section"));
const settingShuffleBtn = /** @type {HTMLButtonElement} */ (document.getElementById("setting-shuffle-btn"));
const settingRepeatBtn = /** @type {HTMLButtonElement} */ (document.getElementById("setting-repeat-btn"));
const settingClearPlBtn = /** @type {HTMLButtonElement} */ (document.getElementById("setting-clear-pl-btn"));

const container = /** @type {HTMLElement} */ (document.getElementById("playlist-container"));
const statusInfo = /** @type {HTMLElement} */ (document.getElementById("status-info"));
const trackCount = /** @type {HTMLElement} */ (document.getElementById("track-count"));
const activePlDesc = /** @type {HTMLElement} */ (document.getElementById("active-pl-desc"));
const deletePlBtn = /** @type {HTMLButtonElement} */ (document.getElementById("delete-pl-btn"));
const searchInput = /** @type {HTMLInputElement} */ (document.getElementById("search-input"));

const createModal = /** @type {HTMLElement} */ (document.getElementById("create-modal"));
const newPlNameInput = /** @type {HTMLInputElement} */ (document.getElementById("new-pl-name"));
const cancelCreateBtn = /** @type {HTMLButtonElement} */ (document.getElementById("cancel-create-btn"));
const confirmCreateBtn = /** @type {HTMLButtonElement} */ (document.getElementById("confirm-create-btn"));

const assignModal = /** @type {HTMLElement} */ (document.getElementById("assign-modal"));
const assignTrackTitle = /** @type {HTMLElement} */ (document.getElementById("assign-track-title"));
const assignChoiceList = /** @type {HTMLElement} */ (document.getElementById("assign-choice-list"));
const quickNewPlBtn = /** @type {HTMLButtonElement} */ (document.getElementById("quick-new-pl-btn"));
const closeAssignBtn = /** @type {HTMLButtonElement} */ (document.getElementById("close-assign-btn"));

const footerTrackInfo = /** @type {HTMLElement} */ (document.getElementById("footer-track-info"));
const nowTitle = /** @type {HTMLElement} */ (document.getElementById("now-title"));
const nowArtist = /** @type {HTMLElement} */ (document.getElementById("now-artist"));
const modeStatus = /** @type {HTMLElement} */ (document.getElementById("mode-status"));
const shuffleBtn = /** @type {HTMLButtonElement} */ (document.getElementById("shuffle-btn"));
const prevBtn = /** @type {HTMLButtonElement} */ (document.getElementById("prev-btn"));
const toggleBtn = /** @type {HTMLButtonElement} */ (document.getElementById("toggle-btn"));
const nextBtn = /** @type {HTMLButtonElement} */ (document.getElementById("next-btn"));
const repeatBtn = /** @type {HTMLButtonElement} */ (document.getElementById("repeat-btn"));
const muteBtn = /** @type {HTMLButtonElement} */ (document.getElementById("mute-btn"));
const volumeBar = /** @type {HTMLInputElement} */ (document.getElementById("volume-bar"));
const audioPlayer = /** @type {HTMLAudioElement} */ (document.getElementById("audio-player"));
const seekBar = /** @type {HTMLInputElement} */ (document.getElementById("seek-bar"));
const currentTimeEl = /** @type {HTMLElement} */ (document.getElementById("current-time"));
const totalDurationEl = /** @type {HTMLElement} */ (document.getElementById("total-duration"));

const nowPopup = /** @type {HTMLElement} */ (document.getElementById("now-popup"));
const popupCloseBtn = /** @type {HTMLButtonElement} */ (document.getElementById("popup-close-btn"));
const popupTrackPos = /** @type {HTMLElement} */ (document.getElementById("popup-track-pos"));
const vinylDisc = /** @type {HTMLElement} */ (document.getElementById("vinyl-disc"));
const popupTitle = /** @type {HTMLElement} */ (document.getElementById("popup-title"));
const popupArtist = /** @type {HTMLElement} */ (document.getElementById("popup-artist"));
const popupSeekBar = /** @type {HTMLInputElement} */ (document.getElementById("popup-seek-bar"));
const popupCurrentTime = /** @type {HTMLElement} */ (document.getElementById("popup-current-time"));
const popupTotalDuration = /** @type {HTMLElement} */ (document.getElementById("popup-total-duration"));
const popupShuffleBtn = /** @type {HTMLButtonElement} */ (document.getElementById("popup-shuffle-btn"));
const popupPrevBtn = /** @type {HTMLButtonElement} */ (document.getElementById("popup-prev-btn"));
const popupToggleBtn = /** @type {HTMLButtonElement} */ (document.getElementById("popup-toggle-btn"));
const popupNextBtn = /** @type {HTMLButtonElement} */ (document.getElementById("popup-next-btn"));
const popupRepeatBtn = /** @type {HTMLButtonElement} */ (document.getElementById("popup-repeat-btn"));
const popupMuteBtn = /** @type {HTMLButtonElement} */ (document.getElementById("popup-mute-btn"));
const popupVolumeBar = /** @type {HTMLInputElement} */ (document.getElementById("popup-volume-bar"));

function openSidebar() {
  sidebar.classList.add("open");
  sidebarBackdrop.classList.add("open");
}

function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarBackdrop.classList.remove("open");
}

/** @param {"home" | "search" | "playlist" | "settings"} view */
function switchView(view) {
  currentView = view;
  closeSidebar();

  navHome.classList.toggle("active", view === "home");
  navSearch.classList.toggle("active", view === "search");
  navPlaylist.classList.toggle("active", view === "playlist");
  navSettings.classList.toggle("active", view === "settings");

  const titles = {
    home: "Home",
    search: "Search",
    playlist: "Playlist",
    settings: "Pengaturan"
  };

  headerSectionLabel.textContent = titles[view];
  panelTitle.textContent = titles[view];

  playlistSection.style.display = view === "playlist" ? "flex" : "none";
  searchSection.style.display = view === "search" ? "block" : "none";
  settingsSection.style.display = view === "settings" ? "flex" : "none";
  container.style.display = view === "settings" ? "none" : "flex";

  if (view === "search") {
    setTimeout(() => searchInput.focus(), 50);
  }

  render();
}

/** @returns {Array<{ id: string, name: string, trackIds: number[] }>} */
function loadCustomPlaylists() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCustomPlaylists() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customPlaylists));
  } catch {
    // Abaikan jika penyimpanan penuh
  }
}

/** @returns {Array<{ id: number, title: string, artist: string, duration?: string, src: string }>} */
function getActiveQueue() {
  if (currentView === "playlist") {
    if (!activePlaylistId) return [];
    const found = customPlaylists.find((p) => p.id === activePlaylistId);
    if (!found) return [];
    return found.trackIds
      .map((id) => playlist.find((t) => t.id === id))
      .filter(/** @param {any} t */ (t) => Boolean(t));
  }
  return playlist;
}

/** @param {number} trackId @returns {string[]} */
function getTrackPlaylistNames(trackId) {
  return customPlaylists
    .filter((p) => p.trackIds.includes(trackId))
    .map((p) => p.name);
}

function openCreateModal() {
  newPlNameInput.value = "";
  createModal.classList.add("open");
  createModal.setAttribute("aria-hidden", "false");
  setTimeout(() => newPlNameInput.focus(), 50);
}

function closeCreateModal() {
  createModal.classList.remove("open");
  createModal.setAttribute("aria-hidden", "true");
}

function createPlaylistFromInput() {
  const name = newPlNameInput.value.trim();
  if (!name) return;
  const newPl = {
    id: "pl_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    name,
    trackIds: []
  };
  customPlaylists.push(newPl);
  saveCustomPlaylists();
  activePlaylistId = newPl.id;
  closeCreateModal();
  render();
  if (assigningTrackId !== null) {
    renderAssignChoices();
  }
}

/** @param {number} trackId */
function openAssignModal(trackId) {
  const track = playlist.find((t) => t.id === trackId);
  if (!track) return;
  assigningTrackId = trackId;
  assignTrackTitle.textContent = track.title;
  renderAssignChoices();
  assignModal.classList.add("open");
  assignModal.setAttribute("aria-hidden", "false");
}

function closeAssignModal() {
  assigningTrackId = null;
  assignModal.classList.remove("open");
  assignModal.setAttribute("aria-hidden", "true");
  render();
}

function renderAssignChoices() {
  assignChoiceList.innerHTML = "";
  if (assigningTrackId === null) return;

  if (!customPlaylists.length) {
    assignChoiceList.innerHTML =
      '<div class="info-text">Belum ada playlist. Klik "+ Playlist Baru" di bawah untuk membuat.</div>';
    return;
  }

  customPlaylists.forEach((pl) => {
    const isIn = assigningTrackId !== null && pl.trackIds.includes(assigningTrackId);
    const item = document.createElement("div");
    item.className = isIn ? "pl-choice-item selected" : "pl-choice-item";
    item.innerHTML =
      "<span>" + pl.name + " (" + pl.trackIds.length + ")</span>" +
      "<span>" + (isIn ? "✓ Di dalam" : "+ Tambah") + "</span>";
    item.onclick = () => {
      if (assigningTrackId === null) return;
      if (pl.trackIds.includes(assigningTrackId)) {
        pl.trackIds = pl.trackIds.filter((id) => id !== assigningTrackId);
      } else {
        pl.trackIds.push(assigningTrackId);
      }
      saveCustomPlaylists();
      renderAssignChoices();
    };
    assignChoiceList.appendChild(item);
  });
}

/** @param {number} seconds */
function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
}

function openPopup() {
  const queue = getActiveQueue();
  if (!currentTrack && queue.length) {
    playTrack(queue[0], false);
  }
  nowPopup.classList.add("open");
  nowPopup.setAttribute("aria-hidden", "false");
}

function closePopup() {
  nowPopup.classList.remove("open");
  nowPopup.setAttribute("aria-hidden", "true");
}

function resetSeek() {
  seekBar.value = "0";
  seekBar.max = "100";
  popupSeekBar.value = "0";
  popupSeekBar.max = "100";
  currentTimeEl.textContent = "00:00";
  totalDurationEl.textContent = "00:00";
  popupCurrentTime.textContent = "00:00";
  popupTotalDuration.textContent = "00:00";
}

/**
 * @param {{ id: number, title: string, artist: string, duration?: string, src: string }} track
 * @param {boolean} [autoPlay=true]
 */
function playTrack(track, autoPlay = true) {
  currentTrack = track;
  audioPlayer.src = track.src;
  audioPlayer.load();
  resetSeek();

  if (!autoPlay) {
    isPlaying = false;
    updateFooter();
    render();
    return;
  }

  const playPromise = audioPlayer.play();
  if (playPromise && typeof playPromise.then === "function") {
    playPromise
      .then(() => {
        isPlaying = true;
        statusInfo.textContent = "Memutar: " + track.title;
        updateFooter();
        render();
      })
      .catch(() => {
        isPlaying = false;
        statusInfo.textContent = "Gagal memutar file: " + track.src;
        updateFooter();
        render();
      });
  } else {
    isPlaying = !audioPlayer.paused;
    updateFooter();
    render();
  }
}

function playNext() {
  const queue = getActiveQueue();
  if (!queue.length) return;
  if (!currentTrack) {
    playTrack(queue[0], true);
    return;
  }
  if (isShuffle && queue.length > 1) {
    const candidates = queue.filter((t) => currentTrack !== null && t.id !== currentTrack.id);
    const pool = candidates.length ? candidates : queue;
    const randomTrack = pool[Math.floor(Math.random() * pool.length)];
    playTrack(randomTrack, true);
    return;
  }
  const idx = queue.findIndex((t) => currentTrack !== null && t.id === currentTrack.id);
  const nextTrack = queue[(idx + 1 + queue.length) % queue.length];
  playTrack(nextTrack, true);
}

function playPrev() {
  const queue = getActiveQueue();
  if (!queue.length) return;
  if (!currentTrack) {
    playTrack(queue[0], true);
    return;
  }
  if (audioPlayer.currentTime > 3) {
    audioPlayer.currentTime = 0;
    return;
  }
  const idx = queue.findIndex((t) => currentTrack !== null && t.id === currentTrack.id);
  const prevTrack = queue[(idx - 1 + queue.length) % queue.length];
  playTrack(prevTrack, true);
}

function togglePlayPause() {
  const queue = getActiveQueue();
  if (!currentTrack && queue.length) {
    playTrack(queue[0], true);
    return;
  }
  if (!currentTrack) return;

  if (audioPlayer.paused) {
    const p = audioPlayer.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        isPlaying = true;
        updateFooter();
        render();
      }).catch(() => {
        isPlaying = false;
        statusInfo.textContent = "Gagal memutar audio.";
        updateFooter();
        render();
      });
    } else {
      isPlaying = true;
      updateFooter();
      render();
    }
  } else {
    audioPlayer.pause();
    isPlaying = false;
    updateFooter();
    render();
  }
}

function renderPlaylistCards() {
  playlistCardsGrid.innerHTML = "";

  const createCard = document.createElement("button");
  createCard.type = "button";
  createCard.className = "pl-card create-card";
  createCard.innerHTML =
    '<div class="pl-card-icon">+</div>' +
    '<div class="pl-card-title">Create Playlist</div>' +
    '<div class="pl-card-meta">Buat playlist baru</div>';
  createCard.onclick = () => openCreateModal();
  playlistCardsGrid.appendChild(createCard);

  customPlaylists.forEach((pl) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = activePlaylistId === pl.id ? "pl-card active" : "pl-card";
    card.innerHTML =
      '<div class="pl-card-icon">★</div>' +
      '<div>' +
        '<div class="pl-card-title">' + pl.name + "</div>" +
        '<div class="pl-card-meta">' + pl.trackIds.length + " lagu</div>" +
      "</div>";
    card.onclick = () => {
      activePlaylistId = pl.id;
      render();
    };
    playlistCardsGrid.appendChild(card);
  });

  const currentPl = customPlaylists.find((p) => p.id === activePlaylistId) || null;
  if (currentPl) {
    activePlDesc.textContent = "Playlist terbuka: " + currentPl.name;
    deletePlBtn.style.display = "inline-block";
  } else {
    activePlDesc.textContent = customPlaylists.length
      ? "Pilih salah satu kartu playlist di atas"
      : "Belum ada playlist dibuat";
    deletePlBtn.style.display = "none";
  }
}

function updateSettingsUI() {
  settingShuffleBtn.textContent = isShuffle ? "ON" : "OFF";
  settingShuffleBtn.classList.toggle("active", isShuffle);
  settingRepeatBtn.textContent = repeatMode === "one" ? "1 LAGU" : "ALL";
  settingRepeatBtn.classList.toggle("active", repeatMode === "one");
}

function render() {
  renderPlaylistCards();
  updateSettingsUI();

  if (currentView === "settings") {
    trackCount.textContent = customPlaylists.length + " Playlist";
    return;
  }

  const baseList = getActiveQueue();
  const keyword = currentView === "search" ? searchQuery.trim().toLowerCase() : "";
  const filtered = keyword
    ? baseList.filter(
        (t) =>
          t.title.toLowerCase().includes(keyword) ||
          t.artist.toLowerCase().includes(keyword)
      )
    : baseList;

  trackCount.textContent =
    currentView === "playlist"
      ? customPlaylists.length + " Playlist"
      : baseList.length + " Lagu";

  container.innerHTML = "";

  if (!filtered.length) {
    const msg =
      currentView === "playlist" && !customPlaylists.length
        ? 'Klik kartu "Create Playlist" di atas untuk membuat playlist pertamamu.'
        : currentView === "playlist" && !keyword
          ? 'Playlist ini belum ada lagunya. Klik tombol "+" di lagu mana saja untuk memasukkan.'
          : baseList.length
            ? "Lagu tidak ditemukan untuk pencarian tersebut."
            : "Belum ada lagu yang terbaca.";
    container.innerHTML = '<div class="info-text">' + msg + "</div>";
    return;
  }

  filtered.forEach((track, idx) => {
    const isActive = currentTrack !== null && track.id === currentTrack.id;
    const card = document.createElement("div");
    card.className = isActive ? "track-card active" : "track-card";

    const indexContent = isActive
      ? '<span class="eq-bars' + (isPlaying ? "" : " paused") + '"><span></span><span></span><span></span></span>'
      : String(idx + 1).padStart(2, "0");

    const durLabel = track.duration && track.duration !== "Audio" ? track.duration : "--:--";
    const plTags = getTrackPlaylistNames(track.id);
    const metaText = plTags.length
      ? track.artist + " • " + plTags.join(", ")
      : track.artist;

    card.innerHTML =
      '<div class="track-left">' +
        '<div class="track-index">' + indexContent + "</div>" +
        '<div class="track-texts">' +
          '<div class="track-title">' + track.title + "</div>" +
          '<div class="track-meta">' + metaText + "</div>" +
        "</div>" +
      "</div>" +
      '<div class="track-right">' +
        '<span class="track-duration">' + durLabel + "</span>" +
        '<button class="add-pl-btn" aria-label="Masukkan ke playlist" title="Masukkan ke playlist">+</button>' +
        '<button class="card-play-btn" aria-label="Putar lagu">' +
          (isActive && isPlaying ? PAUSE_ICON : PLAY_ICON) +
        "</button>" +
      "</div>";

    const addBtn = /** @type {HTMLButtonElement | null} */ (card.querySelector(".add-pl-btn"));
    if (addBtn) {
      addBtn.onclick = (e) => {
        e.stopPropagation();
        openAssignModal(track.id);
      };
    }

    const cardBtn = /** @type {HTMLButtonElement | null} */ (card.querySelector(".card-play-btn"));
    if (cardBtn) {
      cardBtn.onclick = (e) => {
        e.stopPropagation();
        if (isActive && isPlaying) {
          audioPlayer.pause();
          isPlaying = false;
          updateFooter();
          render();
        } else if (isActive) {
          togglePlayPause();
        } else {
          playTrack(track, true);
        }
      };
    }

    card.onclick = () => {
      if (!isActive) {
        playTrack(track, true);
      } else if (audioPlayer.paused) {
        const p = audioPlayer.play();
        if (p && typeof p.then === "function") {
          p.then(() => {
            isPlaying = true;
            updateFooter();
            render();
          }).catch(() => {});
        } else {
          isPlaying = true;
          updateFooter();
          render();
        }
      }
      openPopup();
    };

    container.appendChild(card);
  });
}

function updateFooter() {
  const queue = getActiveQueue();
  const iconHtml = isPlaying ? PAUSE_ICON : PLAY_ICON;
  if (!currentTrack) {
    nowTitle.textContent = "Belum ada lagu";
    nowArtist.textContent = "YTTA SOCIETY";
    popupTitle.textContent = "Belum ada lagu";
    popupArtist.textContent = "YTTA SOCIETY";
    popupTrackPos.textContent = "0 / " + queue.length;
  } else {
    const idx = queue.findIndex((t) => currentTrack !== null && t.id === currentTrack.id);
    nowTitle.textContent = currentTrack.title;
    nowArtist.textContent = currentTrack.artist;
    popupTitle.textContent = currentTrack.title;
    popupArtist.textContent = currentTrack.artist;
    popupTrackPos.textContent = (idx >= 0 ? idx + 1 : 1) + " / " + Math.max(queue.length, 1);
  }

  toggleBtn.innerHTML = iconHtml;
  popupToggleBtn.innerHTML = iconHtml;
  vinylDisc.classList.toggle("spinning", isPlaying);

  shuffleBtn.classList.toggle("active", isShuffle);
  popupShuffleBtn.classList.toggle("active", isShuffle);

  const repeatHtml = repeatMode === "one" ? REPEAT_ICON + '<span class="badge-one">1</span>' : REPEAT_ICON;
  repeatBtn.classList.toggle("active", repeatMode === "one");
  popupRepeatBtn.classList.toggle("active", repeatMode === "one");
  repeatBtn.innerHTML = repeatHtml;
  popupRepeatBtn.innerHTML = repeatHtml;

  const labels = [];
  if (isShuffle) labels.push("Acak");
  if (repeatMode === "one") labels.push("Ulang 1 Lagu");
  modeStatus.textContent = labels.length ? "Mode: " + labels.join(" • ") : "Ketuk kartu untuk buka player";
  updateSettingsUI();
}

/** @param {number} val */
function syncSeekValue(val) {
  seekBar.value = String(val);
  popupSeekBar.value = String(val);
  const formatted = formatTime(val);
  currentTimeEl.textContent = formatted;
  popupCurrentTime.textContent = formatted;
}

/** @param {number} vol */
function syncVolume(vol) {
  audioPlayer.volume = vol;
  audioPlayer.muted = vol === 0;
  volumeBar.value = String(vol);
  popupVolumeBar.value = String(vol);
  const volIcon = audioPlayer.muted ? VOL_MUTE_ICON : VOL_ON_ICON;
  muteBtn.innerHTML = volIcon;
  popupMuteBtn.innerHTML = volIcon;
}

menuToggleBtn.onclick = () => openSidebar();
sidebarBackdrop.onclick = () => closeSidebar();
navHome.onclick = () => switchView("home");
navSearch.onclick = () => switchView("search");
navPlaylist.onclick = () => switchView("playlist");
navSettings.onclick = () => switchView("settings");

settingShuffleBtn.onclick = () => {
  isShuffle = !isShuffle;
  updateFooter();
};

settingRepeatBtn.onclick = () => {
  repeatMode = repeatMode === "all" ? "one" : "all";
  updateFooter();
};

settingClearPlBtn.onclick = () => {
  customPlaylists = [];
  saveCustomPlaylists();
  activePlaylistId = null;
  render();
};

cancelCreateBtn.onclick = () => closeCreateModal();
confirmCreateBtn.onclick = () => createPlaylistFromInput();
newPlNameInput.onkeydown = (e) => {
  if (e.key === "Enter") createPlaylistFromInput();
};

quickNewPlBtn.onclick = () => openCreateModal();
closeAssignBtn.onclick = () => closeAssignModal();

deletePlBtn.onclick = () => {
  if (!activePlaylistId) return;
  customPlaylists = customPlaylists.filter((p) => p.id !== activePlaylistId);
  saveCustomPlaylists();
  activePlaylistId = customPlaylists.length ? customPlaylists[0].id : null;
  render();
};

footerTrackInfo.onclick = () => openPopup();
popupCloseBtn.onclick = () => closePopup();

searchInput.oninput = () => {
  searchQuery = searchInput.value;
  render();
};

const handleShuffleToggle = () => {
  isShuffle = !isShuffle;
  updateFooter();
};
shuffleBtn.onclick = handleShuffleToggle;
popupShuffleBtn.onclick = handleShuffleToggle;

const handleRepeatToggle = () => {
  repeatMode = repeatMode === "all" ? "one" : "all";
  updateFooter();
};
repeatBtn.onclick = handleRepeatToggle;
popupRepeatBtn.onclick = handleRepeatToggle;

const handleMuteToggle = () => {
  audioPlayer.muted = !audioPlayer.muted;
  const volIcon = audioPlayer.muted ? VOL_MUTE_ICON : VOL_ON_ICON;
  muteBtn.innerHTML = volIcon;
  popupMuteBtn.innerHTML = volIcon;
};
muteBtn.onclick = handleMuteToggle;
popupMuteBtn.onclick = handleMuteToggle;

volumeBar.oninput = () => syncVolume(Number(volumeBar.value));
popupVolumeBar.oninput = () => syncVolume(Number(popupVolumeBar.value));

audioPlayer.onloadedmetadata = () => {
  if (Number.isFinite(audioPlayer.duration)) {
    const dur = String(audioPlayer.duration);
    const formattedDur = formatTime(audioPlayer.duration);
    seekBar.max = dur;
    popupSeekBar.max = dur;
    totalDurationEl.textContent = formattedDur;
    popupTotalDuration.textContent = formattedDur;
    if (currentTrack) {
      currentTrack.duration = formattedDur;
      render();
    }
  }
};

audioPlayer.onerror = () => {
  isPlaying = false;
  statusInfo.textContent = "Error memuat audio. Cek path/format file di folder musik.";
  updateFooter();
  render();
};

audioPlayer.ontimeupdate = () => {
  if (!isSeeking && Number.isFinite(audioPlayer.currentTime)) {
    syncSeekValue(audioPlayer.currentTime);
  }
};

const handleSeekInput = (/** @type {HTMLInputElement} */ el) => {
  isSeeking = true;
  const val = Number(el.value);
  seekBar.value = String(val);
  popupSeekBar.value = String(val);
  const formatted = formatTime(val);
  currentTimeEl.textContent = formatted;
  popupCurrentTime.textContent = formatted;
};

const handleSeekChange = (/** @type {HTMLInputElement} */ el) => {
  audioPlayer.currentTime = Number(el.value);
  isSeeking = false;
};

seekBar.oninput = () => handleSeekInput(seekBar);
popupSeekBar.oninput = () => handleSeekInput(popupSeekBar);
seekBar.onchange = () => handleSeekChange(seekBar);
popupSeekBar.onchange = () => handleSeekChange(popupSeekBar);

prevBtn.onclick = () => playPrev();
popupPrevBtn.onclick = () => playPrev();
nextBtn.onclick = () => playNext();
popupNextBtn.onclick = () => playNext();
toggleBtn.onclick = () => togglePlayPause();
popupToggleBtn.onclick = () => togglePlayPause();

audioPlayer.onended = () => {
  if (repeatMode === "one" && currentTrack) {
    audioPlayer.currentTime = 0;
    audioPlayer.play();
    return;
  }
  playNext();
};

fetch("./playlist.json")
  .then((res) => {
    if (!res.ok) throw new Error("playlist.json tidak ditemukan");
    return res.json();
  })
  .then((data) => {
    if (Array.isArray(data) && data.length > 0) {
      playlist = data;
      statusInfo.textContent = playlist.length + " lagu siap diputar";
      playTrack(playlist[0], false);
    } else {
      statusInfo.textContent = "Daftar lagu kosong";
    }
  })
  .catch(() => {
    statusInfo.textContent = "Buka lewat server/preview agar playlist.json terbaca";
  });