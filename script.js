/* ==========================================
   1. GLOBAL STATE & SELECTORS
   ========================================== */
let recentlyPlayed = [];
let favorites = [];
let customPlaylists = {}; 
let currentSongIndex = 0;
let isRepeat = false; 
let isShuffle = false; 
let lyricInterval = null; 
let preMuteVolume = 80;
let audioCtx = null;
let sourceNode = null;
let bassFilter = null;

const audio = new Audio();
audio.crossOrigin = "anonymous"; 
audio.volume = 0.8;

const dom = {
    songContainer: document.getElementById('song-list-container'),
    playPauseBtn: document.getElementById('play-pause-btn'),
    playIcon: document.getElementById('play-icon'),
    listTitle: document.getElementById('list-title'),
    seekBar: document.getElementById('seek-bar'),
    timeDisplay: document.querySelector('.time-display'),
    bgWallpaper: document.getElementById('bg-wallpaper'),
    currentArt: document.getElementById('current-art'),
    currentTitle: document.getElementById('current-title'),
    currentArtist: document.getElementById('current-artist'),
    infoGenre: document.getElementById('info-genre'),
    infoYear: document.getElementById('info-year'),
    infoAlbum: document.getElementById('info-album'),
    modeIcon: document.getElementById('mode-icon'),
    volumeSlider: document.getElementById('volume-slider'),
    volumePercentage: document.getElementById('volume-percentage'), 
    volumeIcon: document.getElementById('volume-icon'),
    usernameText: document.getElementById('username-text'), 
    userAvatar: document.getElementById('user-avatar'),     
    shuffleBtn: document.getElementById('shuffle-btn'),
    repeatBtn: document.getElementById('repeat-btn'),
    repeatIcon: document.getElementById('repeat-icon'),
    lyricsToggleBtn: document.getElementById('lyrics-toggle-btn'),
    detailsView: document.getElementById('info-details-view'),
    lyricsView: document.getElementById('info-lyrics-view'),
    lyricTextLine: document.getElementById('lyric-text-line')
};

/* ==========================================
   2. DATA for songs
   ========================================== */
const songs = [
     {
        id: 0,
        title: "Next to you",
        artist: "Chris Brown",
        album: "F.A.M.E.",
        genre: "Pop/R&B",
        year: "2011",
        art: "assets/images/nexttoyou.jpg",
        file: "assets/audio/nexttoyou.mp3",
        lyrics: "You've got that smile<br>That only heaven can make<br>I pray to God everyday<br>To give you everything you realize<br>No matter what happens, I tell you everything<br>All the things that I'm feeling inside<br>And I just want you to know<br>That I'll never let you go<br><br>Oh, I'll be there when you're crying<br>Brave the rain, up for trying<br>No, I'll never say goodbye<br>You'll always be my girl<br><br>There's no guarantee that this life is easy<br>Yeah, I know it's a structural breakdown<br>But I'll be right next to you<br>Right next to you<br>Knowing everything's gonna be alright<br>As long as I'm right next to you"
    }, 
    {
        
        title: "Adore you",
        artist: "Harry Styles",
        album: "Fine Line",
        genre: "Pop",
        year: "2019",
        art: "assets/images/adoreyou.jpg",
        file: "assets/audio/adoreyou.mp3",
        lyrics: "Walk in your rainbow paradise<br>Strawberry lipstick state of mind<br>I get so lost inside your eyes<br>Would you believe it?<br>You don't have to say you love me<br>You don't have to say nothing<br>You don't have to say you're mine<br><br>Honey, I'd walk through fire for you<br>Just let me adore you<br>Oh, let me adore you<br>Like it's the only thing I'll ever do<br><br>Your wonder under summer skies<br>Brown skin and lemon over ice<br>Would you believe it?<br>You don't have to say you love me<br>I just wanna tell you something<br>Lately you've been on my mind<br><br>Honey, I'd walk through fire for you<br>Just let me adore you<br>Oh, let me adore you<br>Like it's the only thing I'll ever do"
    },
    {
         
        title: "Twilight Zone",
        artist: "Ariana Grande",
        album: "Eternal Sunshine Deluxe: Brighter Days Ahead",
        genre: "Synth-pop",
        year: "2025",
        art: "assets/images/twilightzone.png",
        file: "assets/audio/twilightzone.mp3",
        lyrics: "Lost inside this empty space<br>Counting steps, I trace your face<br>In the twilight, shadows fall<br>Am I hearing your voice call?<br><br>Baby, we are spinning out of control<br>Trying to hold on to what we know<br>But we're stuck in the middle dynamic range<br>Waiting for the weather to change<br><br>Can we break through the fog tonight?<br>Can we find our way back to the light?<br>Or are we trapped in the twilight zone<br>Left here wandering all alone?<br><br>Clock strikes midnight, still no sound<br>Searching for what can't be found<br>In the twilight, shadows fall<br>Yeah, we're stuck here after all"
    },
    {
         
        title: "Jane!",
        artist: "The Long Faces",
        album: "Jane! by The Long Faces.",
        genre: "Indie rock",
        year: "2018",
        art: "assets/images/jane!.jpg",
        file: "assets/audio/jane!.mp3",
        lyrics: "Jane, won't you look my way?<br>The sun has set on another day<br>The strings are pulled, the curtains close<br>Where it goes, nobody knows<br><br>Oh, sweet Jane, stay down<br>Don't let them see your crown<br>The mechanical balance is slipping away<br>Nothing left for us to say<br><br>And the night gets cold and the shadows long<br>Singing that same old repetitive song<br>Jane, don't you worry about the cost<br>Everything we had is lost<br><br>So won't you stay down, sweet Jane?<br>Let the rain wash away the pain"
    },
    {
         
        title: "Somebody That I Used To Know",
        artist: "Gotye",
        album: "Making Mirrors",
        genre: "Indie pop",
        year: "2011",
        art: "assets/images/sbtuk.jpg",
        file: "assets/audio/sbtuk.mp3",
        lyrics: "Now and then I think of when we were together<br>Like when you said you felt so happy you could die<br>Told myself that you were right for me<br>But felt so lonely in your company<br>But that was love and it's an ache I still remember<br><br>You can get addicted to a certain kind of sadness<br>Like resignation to the end, always the end<br>So when we found that we could not make sense<br>Well you said that we would still be friends<br>But I'll admit that I was glad that it was over<br><br>But you didn't have to cut me off<br>Make out like it never happened and that we were nothing<br>And I don't even need your love<br>But you treat me like a stranger and that feels so rough<br>No, you didn't have to stoop so low<br>Have your friends collect your records and then change your number<br>I guess that I don't need that though<br>Now you're just somebody that I used to know<br><br>Now you're just somebody that I used to know<br>Now you're just somebody that I used to know"
    },
    {
         
        title: "Surrender",
        artist: "Cheap Trick",
        album: "Heaven Tonight",
        genre: "Punk and heavy metal",
        year: "1978",
        art: "assets/images/surrender.jpg",
        file: "assets/audio/surrender.mp3",
        lyrics: "Mother told me, yes, she told me<br>I'd meet girls like you<br>She also told me, 'Stay away<br>You never know what they'll do'<br>'Cause they'll introduce you to their boys<br>And get you into dynamic trouble'<br><br>But a couple of days ago was chat history<br>She was sitting in a chair with a look of mystery<br>And her music was up loud, rolling down the hall<br>Lord, they were rocking out against the wall<br><br>Surrender, surrender<br>But don't give yourself away<br>Surrender, surrender<br>But don't give yourself away<br><br>Father says your mother's right<br>She's always full of advice<br>But look at them now, they're staying out all night<br>Surrender, surrender, don't give yourself away"
    },
    {
         
        title: "Blank Space",
        artist: "Taylor Swift",
        album: "Single",
        genre: "Synth-pop",
        year: "2014",
        art: "assets/images/blankspace.webp",
        file: "assets/audio/blankspace.mp3",
        lyrics: "Nice to meet you, where you been?<br>I could show you incredible things<br>Magic, madness, heaven, sin<br>Saw you there and I thought<br>'Oh, my God, look at that face<br>You look like my next mistake<br>Love's a game, wanna play?'<br>New money, suit and tie<br>I can read you like a magazine<br>Ain't it funny, rumors fly<br>And I know you heard about me<br>So hey, let's be friends<br>I'm dying to see how this one ends<br>Grab your passport and my hand<br>I can make the bad guys good for a weekend<br><br>So it's gonna be forever<br>Or it's gonna go down in flames<br>You can tell me when it's over, mm<br>If the high was worth the pain<br>Got a long list of ex-lovers<br>They'll tell you I'm insane<br>Cause you know I love the players<br>And you love the game<br><br>Cause we're young and we're reckless<br>We'll take this way too far<br>It'll leave you breathless, mm<br>Or with a nasty scar<br>Got a long list of ex-lovers<br>They'll tell you I'm insane<br>But I've got a blank space, baby<br>And I'll write your name"
    },
    {
 
        title: "XXL",
        artist: "Lany",
        album: "A Beautiful Blur",
        genre: "Synth-pop",
        year: "2023",
        art: "assets/images/xxl.webp",
        file: "assets/audio/xxl.mp3",
        lyrics: "Missing you is XXL<br>I've been going through it since you left<br>Wish I could tell you that I'm doing well<br>But honestly, it's bigger than anything else<br><br>Thinking about the way we used to talk all night<br>Everything we had felt so damn right<br>Now I'm sitting on an empty bedroom floor<br>Hoping you would walk right through that door<br><br>Yeah, it's heavy on my chest, heavy on my mind<br>Trying to leave the broken pieces all behind<br>But missing you is XXL<br>Yeah, it's a custom fit of pure personal hell<br><br>Every little place that we used to go<br>Every little lyric that we used to know<br>Reminds me that you're gone, and I'm not okay<br>Yeah, this heartbreak won't ever fade away"
    },
    {
         
        title: "Anything 4 U",
        artist: "Lany",
        album: "Mama's Boy",
        genre: "Synth-pop",
        year: "2020",
        art: "assets/images/4u.webp",
        file: "assets/audio/4u.mp3",
        lyrics: "I would pack my bags and move across the sea<br>If it meant that you'd be standing next to me<br>Yeah, I'd do anything for you<br>You've got a hold on my heart<br><br>From the very first moment, from the very start<br>Nothing in this universe could tear us apart<br>I'd chase the alignment down into the dark<br><br>Yeah, I'd do anything for you<br>Just say the word, tell me what you want me to do<br>My entire landscape belongs to you<br><br>Take my time, take my days, take my whole life too<br>There is absolutely nothing that I wouldn't do<br>'Cause girl, I'm completely, totally stuck on you"
    },
    {
         
        title: "Cause you have to",
        artist: "Lany",
        album: "A Beautiful Blur",
        genre: "Synth-pop",
        year: "2023",
        art: "assets/images/causeyou.webp",
        file: "assets/audio/causeyou.mp3",
        lyrics: "You only hold my hand cause you have to<br>You only say you care cause you feel bad<br>I don't wanna be the one who keeps you trapped<br>If you wanna leave, don't look back<br><br>I can see the hesitation in your eyes<br>Tired of the structural makeup of these lies<br>Don't stay out of pity, don't stay for show<br>If your heart isn't in it, just let me go<br><br>Yeah, if you're gonna leave, don't look back<br>Pack up your things and clear out the track<br>Don't say you love me out of standard routine<br>Let's just drop the curtain on this whole scene"
    },
    {
         
        title: "Beautiful",
        artist: "Bazzi",
        album: "Cosmic",
        genre: "Pop / R&B",
        year: "2017",
        art: "assets/images/beautiful.webp",
        file: "assets/audio/beautiful.mp3",
        lyrics: "Hey beautiful, beautiful, beautiful, beautiful angel<br>We the only ones who's left in the world<br>And I know you know that I'm crazy for you<br>Yeah, you're so beautiful<br><br>Step into the room, watch the layout shift<br>Every little flaw is a sudden gift<br>I don't care about the noise outside<br>Long as I got you right here by my side<br><br>Yeah, you're so beautiful<br>Beautiful angel, you're all that I need<br>The focus on you is completely clear<br>Everything vanishes when you are near<br><br>Hey beautiful, beautiful, beautiful, beautiful angel<br>I am completely, completely yours"
    },
    {
 
        title: "Mine",
        artist: "Bazzi",
        album: "Cosmic",
        genre: "Pop / R&B / Neo-Soul",
        year: "2017",
        art: "assets/images/mine.webp",
        file: "assets/audio/mine.mp3",
        lyrics: "You so precious when you smile<br>Hit it from the back and drive you wild<br>Girl, I lose myself up in those eyes<br>I'm so glad that you are mine<br><br>Yeah, our chemistry is perfectly in tune<br>Lighting up the dark corners of the room<br>Can't nobody else duplicate your space<br>You're a work of art, impossible to replace<br><br>I'm so glad that you are mine<br>Precious when you smile, all of the time<br>Hands on your waist, dynamic and sweet<br>You make my entire existence complete"
    },
    {
         
        title: "Why?",
        artist: "Bazzi",
        album: "Cosmic",
        genre: "Pop / R&B / Indie Pop",
        year: "2018",
        art: "assets/images/why.webp",
        file: "assets/audio/why.mp3",
        lyrics: "Tell me why, why do we fight?<br>When we could be making out all through the night<br>We waste so much time on things that don't matter<br>Why do we do this to ourselves?<br><br>Running in circles, breaking the code<br>Carrying all of this heavy load<br>We could be building a structural peace<br>Instead of waiting for the tension to increase<br><br>So tell me why, why do we fight?<br>When everything could be perfectly right<br>Just cross the floor and look in my eyes<br>Stop throwing up all these custom disguises"
    },
    {
         
        title: "Silence",
        artist: "Khalid",
        album: "Silence",
        genre: "Dance / Electronic / Future Bass",
        year: "2017",
        art: "assets/images/silence.webp",
        file: "assets/audio/silence.mp3",
        lyrics: "Yeah, I'm used to being alone<br>I never found a place to call my home<br>Until I found peace in your violence<br>I'm in need of a savior, but I'm not asking for favors<br>My whole life I've felt in the dark<br>Looking for a light, looking for a spark<br><br>I've found peace in your violence<br>Can't tell me there's no meaning in the silence<br>Yeah, I'm finding peace in your violence<br><br>I found peace in your violence<br>I'm in need of a savior, but I'm not asking for favors<br>I've been quiet for too long<br>But I found a home inside this song"
    },
    {
         
        title: "Better",
        artist: "Khalid",
        album: "Suncity (EP)",
        genre: "R&B / Soul",
        year: "2018",
        art: "assets/images/better.webp",
        file: "assets/audio/better.mp3",
        lyrics: "Nothing feels better than this<br>Nothing feels better than night with you<br>We don't gotta hide what we do<br>I love to see you shine in the room<br>We're moving through the layout of the night<br>Everything around us feeling so right<br><br>Nothing feels better than this<br>No, nothing feels better than this<br>Just holding on to you, perfectly remixed<br><br>Hear the bassline hitting low and clear<br>Whispering the things you wanna hear<br>Nothing feels better than this, my dear"
    },
    {
         
        title: "Young Dumb & Broke",
        artist: "Khalid",
        album: "American Teen",
        genre: "R&B / Soul / Pop",
        year: "2017",
        art: "assets/images/youngdumb.webp",
        file: "assets/audio/youngdumb.mp3",
        lyrics: "So you're still thinking of me<br>Just like I know you should<br>I can not give you everything<br>But I'd give you everything I could<br><br>But we're young, dumb and broke<br>Young, dumb, high school kids<br>Yeah, we're young, dumb and broke<br>Young, dumb, high school kids<br><br>We still got love to give<br>While we're running through this life we live<br>Yeah, young, dumb and broke<br>High school kids making standard mistakes<br>Chasing down whatever it takes"
    },
    {
         
        title: "OTW",
        artist: "Khalid",
        album: "Suncity (EP)",
        genre: "R&B / Contemporary R&B",
        year: "2018",
        art: "assets/images/otw.jpg",
        file: "assets/audio/otw.mp3",
        lyrics: "Put it in drive, I'll be outside on the way<br>Don't make me wait, you know I'm impatient<br>Just tap the screen, send me your location<br>I'm on the way, girl<br><br>Speeding through the cityscape updates<br>No time to waste on secondary debates<br>You know what we have is special and true<br>There is no replacement for you<br><br>Put it in drive, I'm on the way<br>Yeah, you know I'm on the way, girl<br>Leave the headlights on, open up the gate<br>I am rolling fast, I won't be late"
    },
    {
         
        title: "Eastside",
        artist: "Benny Blanco",
        album: "Friends Keep Secrets",
        genre: "Pop / Electropop",
        year: "2018",
        art: "assets/images/eastside.webp",
        file: "assets/audio/eastside.mp3",
        lyrics: "When I was seventeen, I saw the city line<br>Very first time that I ever drove a car<br>We used to meet up on the Eastside<br>In the back of your room where we would talk about everything<br><br>We can go anywhere we want<br>Drive down to the coast, jump into the sea<br>Just take my hand and come with me<br><br>Yeah, we used to meet up on the Eastside<br>Looking at the world from the alternative side<br>Thinking about the ways we would grow and change<br>Now looking back, it all feels so strange"
    },
    {
         
        title: "Make it to the Morning",
        artist: "PARTYNEXTDOOR",
        album: "PARTYNEXTDOOR 4 (P4)",
        genre: "Alternative R&B / Downtempo",
        year: "2024",
        art: "assets/images/morning.jpg",
        file: "assets/audio/morning.mp3",
        lyrics: "Whispers in the dark room, heavy breathing<br>Tell me what you need, give me a reason<br>If we can just make it to the morning light<br>Everything is gonna be alright<br><br>Slow tempo tracks looping in the background<br>Lost inside the textures that we just found<br><br>If we can just make it to the morning light<br>I promise everything is gonna be alright<br>Don't pack your things, don't walk out the door<br>Let's find out what we're fighting for"
    },
    {
     
        title: "Her Way",
        artist: "PARTYNEXTDOOR",
        album: "PARTYNEXTDOOR TWO (P2)",
        genre: "Alternative R&B / PBR&B",
        year: "2014",
        art: "assets/images/herway.webp",
        file: "assets/audio/herway.mp3",
        lyrics: "She puts her hair up, handles business<br>She doesn't need another witness<br>She gets her way, she always gets her way<br>Man, I love it when she plays<br><br>Moving through the night like a silhouette design<br>Perfect execution every single time<br>She doesn't care what the critics gotta say<br>She just switches the style and walks away<br><br>She gets her way, she always gets her way<br>And there's nothing left for me to say"
    },
    {
         
        title: "Belong to the City",
        artist: "PARTYNEXTDOOR",
        album: "PARTYNEXTDOOR TWO (P2)",
        genre: "Alternative R&B / PBR&B",
        year: "2014",
        art: "assets/images/city.webp",
        file: "assets/audio/city.mp3",
        lyrics: "You belong to the city, you belong to the night<br>Chasing after stars till the morning light<br>Don't lose your touch, don't lose your mind<br>We are running out of time<br><br>The neon reflections are starting to fade<br>Living inside of the choices we made<br>You can try to run, you can try to hide<br>But you know the rhythm pulls you back inside<br><br>You belong to the city, you belong to the night<br>Yeah, we're chasing down the morning light"
    },
    {
         
        title: "Wait",
        artist: "Maroon 5",
        album: "Red Pill Blues",
        genre: "Electropop / Pop Rock / R&B",
        year: "2017",
        art: "assets/images/wait.webp",
        file: "assets/audio/wait.mp3",
        lyrics: "Wait, thank you for your patience<br>I know that I made a mistake<br>Don't turn around, don't look away<br>Let me make it up to you today<br><br>I didn't mean to go break your trust<br>Leave our alignment turning to dust<br>Can we just reset the whole timeline?<br>Go back to when your hand was in mine<br><br>So wait, thank you for your patience<br>Let me make it up to you today<br>Don't leave me stranded out in the cold<br>With nothing but memories to hold"
    }
];

let currentList = songs; 

/* ==========================================
   3. CORE LOGICS
   ========================================== */

function displayLibrary(playlist = songs) {
    if (!dom.songContainer) return;
    dom.songContainer.innerHTML = ""; 
    
    playlist.forEach((song, targetIdx) => {
        const isFav = favorites.some(fav => fav.id === song.id);
        const songRow = document.createElement('div');
        const isCurrentlyPlaying = (targetIdx === currentSongIndex && audio.src.includes(song.file));
        songRow.className = `song-item ${isCurrentlyPlaying ? 'now-playing-track' : ''}`;
        
        songRow.innerHTML = `
            <span class="song-info"><strong>${song.title}</strong> - ${song.artist}</span>
            <div class="song-actions">
                <button class="add-btn" title="Add to Playlist">
                    <span class="material-symbols-outlined">playlist_add</span>
                </button>
                <button class="fav-btn">${isFav ? '❤️' : '♡'}</button>
            </div>
        `;

        
        songRow.querySelector('.add-btn').onclick = (e) => {
            e.stopPropagation();
            addToPlaylistPrompt(song.id);
        };

        songRow.querySelector('.fav-btn').onclick = (e) => {
            e.stopPropagation();
            toggleFav(song.id);
        };

        songRow.onclick = () => {
            
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            playSong(targetIdx);
        };
        dom.songContainer.appendChild(songRow);
    });
}

audio.onended = () => {
    if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(e => console.error("Playback loop error:", e));
    } else {
        playNext();
    }
};

function playNext() {
    if (currentList.length === 0) return;
    
    if (isShuffle) {
        currentSongIndex = Math.floor(Math.random() * currentList.length);
    } else {
        currentSongIndex = (currentSongIndex + 1) % currentList.length;
    }
    playSong(currentSongIndex);
}
// part 4 script
function playSong(index) {
    if (index < 0 || index >= currentList.length) return;
    currentSongIndex = index;
    const song = currentList[currentSongIndex];

    audio.src = song.file;
    audio.play().catch(e => console.error("Mobile Autoplay Blocked: Requires direct user interaction.", e));

    if (dom.playIcon) dom.playIcon.innerText = "pause_circle";
    if (dom.bgWallpaper) dom.bgWallpaper.style.backgroundImage = `url('${song.art}')`;
    
    if (dom.currentTitle) dom.currentTitle.innerText = song.title;
    if (dom.currentArtist) dom.currentArtist.innerText = song.artist;
    if (dom.currentArt) dom.currentArt.src = song.art;
    
    if (dom.infoGenre) dom.infoGenre.innerText = song.genre;
    if (dom.infoYear) dom.infoYear.innerText = song.year;
    if (dom.infoAlbum) dom.infoAlbum.innerText = song.album;

    // --- TRACK LIST  ---
    const trackRows = dom.songContainer ? dom.songContainer.querySelectorAll('.song-item') : [];
    trackRows.forEach((row, rowIdx) => {
        if (rowIdx === currentSongIndex) {
            row.classList.add('now-playing-track');
        } else {
            row.classList.remove('now-playing-track');
        }
    });

    // MANUAL LYRICS 
    if (dom.lyricsView && dom.lyricTextLine) {
        clearInterval(lyricInterval); 
        
        const lyricLines = song.lyrics ? song.lyrics.split('<br>').filter(line => line.trim() !== "") : ["Instrumental or lyrics unavailable."];
        let currentLineIdx = 0;
        
        dom.lyricTextLine.innerHTML = lyricLines[currentLineIdx];
        dom.lyricsView.scrollTop = 0;

        dom.lyricTextLine.style.cursor = "pointer";
        dom.lyricTextLine.title = "Tap for next line | Right-click for previous line";

        // Combined Touch/Tap Forward Control
        dom.lyricTextLine.onclick = () => {
            currentLineIdx = (currentLineIdx + 1) % lyricLines.length;
            dom.lyricTextLine.innerHTML = lyricLines[currentLineIdx];
        };

        // Right Click 
        dom.lyricTextLine.oncontextmenu = (e) => {
            e.preventDefault(); 
            currentLineIdx = (currentLineIdx - 1 + lyricLines.length) % lyricLines.length;
            dom.lyricTextLine.innerHTML = lyricLines[currentLineIdx];
        };
    }

    recentlyPlayed = [song, ...recentlyPlayed.filter(s => s.id !== song.id)];
    updateUpNext();
}

function updateUpNext() {
    const listContainer = document.getElementById('up-next-list');
    if (!listContainer) return;

    listContainer.innerHTML = "";
    const queueAhead = currentList.slice(currentSongIndex + 1);

    if (queueAhead.length === 0) {
        listContainer.innerHTML = `<div class="next-song-item" style="color: rgba(255,255,255,0.4); font-size: 0.85rem; padding: 10px; justify-content: center;">End of Queue</div>`;
        return;
    }

    queueAhead.forEach((song, inlineIdx) => {
        const absoluteIdx = currentSongIndex + 1 + inlineIdx;
        const nextItemHTML = `
            <div class="next-song-item" onclick="playSong(${absoluteIdx})" style="cursor: pointer;">
                <img src="${song.art}" class="next-art-thumb">
                <div class="next-meta">
                    <div class="next-title">${song.title}</div>
                    <div class="next-artist">${song.artist}</div>
                </div>
            </div>
        `;
        listContainer.insertAdjacentHTML('beforeend', nextItemHTML);
    });
}

function addToPlaylistPrompt(songId) {
    const playlistNames = Object.keys(customPlaylists);
    
    if (playlistNames.length === 0) {
        alert("Please create a playlist in the sidebar first!");
        return;
    }

    const target = prompt(`Enter playlist name to add to:\n(${playlistNames.join(", ")})`);
    
    if (target && customPlaylists[target]) {
        const song = songs.find(s => s.id === songId);
        if (!customPlaylists[target].some(s => s.id === songId)) {
            customPlaylists[target].push(song);
            alert(`Added "${song.title}" to ${target}`);
            refreshCurrentView();
        } else {
            alert("Song is already in this playlist.");
        }
    } else if (target) {
        alert("Playlist not found.");
    }
}

function toggleFav(id) {
    const song = songs.find(s => s.id === id);
    const favIndex = favorites.findIndex(f => f.id === id);
    
    if (favIndex > -1) {
        favorites.splice(favIndex, 1);
    } else {
        favorites.push(song);
    }
    refreshCurrentView();
}

function refreshCurrentView() {
    if (!dom.listTitle) return;
    const currentTitle = dom.listTitle.innerText;
    if (customPlaylists[currentTitle]) {
        currentList = customPlaylists[currentTitle];
    } else {
        const viewMap = {
            "Favorites": favorites,
            "Recently Played": recentlyPlayed,
            "All Songs": songs
        };
        currentList = viewMap[currentTitle] || songs;
    }
    displayLibrary(currentList);
}

/* ==========================================
   4. EVENT LISTENERS
   ========================================== */

if (dom.shuffleBtn) {
    dom.shuffleBtn.onclick = () => {
        isShuffle = !isShuffle; 
        if (isShuffle) {
            dom.shuffleBtn.classList.add('active-toggle');
            if (currentList.length > 0) {
                playNext(); 
            }
        } else {
            dom.shuffleBtn.classList.remove('active-toggle');
        }
    };
}

if (dom.repeatBtn) {
    dom.repeatBtn.onclick = () => {
        isRepeat = !isRepeat;
        
        if (isRepeat) {
            dom.repeatBtn.classList.add('active-toggle');
            if (dom.repeatIcon) dom.repeatIcon.innerText = "repeat_one";
        } else {
            dom.repeatBtn.classList.remove('active-toggle');
            if (dom.repeatIcon) dom.repeatIcon.innerText = "repeat";
        }
    };
}

if (dom.lyricsToggleBtn) {
    dom.lyricsToggleBtn.onclick = () => {
        dom.detailsView.classList.toggle('hidden');
        dom.lyricsView.classList.toggle('hidden');
        dom.lyricsToggleBtn.classList.toggle('active-lyrics-mode');
    };
}

if (dom.playPauseBtn) {
    dom.playPauseBtn.onclick = () => {
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        
        if (audio.paused) {
            if (audio.src) {
                audio.play().catch(e => console.log(e));
            } else if (currentList.length > 0) {
                playSong(0); 
            }
            if (dom.playIcon) dom.playIcon.innerText = "pause_circle";
        } else {
            audio.pause();
            if (dom.playIcon) dom.playIcon.innerText = "play_circle";
        }
    };
}

const nextBtnElement = document.getElementById('next-btn');
if (nextBtnElement) {
    nextBtnElement.onclick = () => {
        playNext();
    };
}

const prevBtnElement = document.getElementById('prev-btn');
if (prevBtnElement) {
    prevBtnElement.onclick = () => {
        if (currentList.length === 0) return;

        if (isShuffle) {
            currentSongIndex = Math.floor(Math.random() * currentList.length);
        } else {
            currentSongIndex = (currentSongIndex - 1 + currentList.length) % currentList.length;
        }
        playSong(currentSongIndex);
    };
}

audio.ontimeupdate = () => {
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        if (dom.seekBar) dom.seekBar.value = progress;
        if (dom.timeDisplay) {
            dom.timeDisplay.innerText = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
        }
    }
};

if (dom.seekBar) {
  
    dom.seekBar.oninput = () => {
        if (audio.duration) {
            audio.currentTime = (dom.seekBar.value / 100) * audio.duration;
        }
    };
}

if (dom.volumeSlider) {
    dom.volumeSlider.oninput = () => {
        const val = dom.volumeSlider.value;
        audio.volume = val / 100;
      
        if (dom.volumePercentage) dom.volumePercentage.innerText = `${val}%`;

        if (dom.volumeIcon) {
            if (val == 0) {
                dom.volumeIcon.innerText = "volume_off";
            } else if (val < 50) {
                dom.volumeIcon.innerText = "volume_down";
                audio.muted = false;
            } else {
                dom.volumeIcon.innerText = "volume_up";
                audio.muted = false;
            }
        }
    };
}

const volumeBtn = document.getElementById('volume-btn');
if (volumeBtn && dom.volumeSlider && dom.volumeIcon) {
    volumeBtn.onclick = () => {
        if (!audio.muted) {
            preMuteVolume = dom.volumeSlider.value;
            audio.muted = true;
            dom.volumeSlider.value = 0;
            dom.volumeIcon.innerText = "volume_off";
            if (dom.volumePercentage) dom.volumePercentage.innerText = "0%";
        } else {
            audio.muted = false;
            dom.volumeSlider.value = preMuteVolume;
            audio.volume = preMuteVolume / 100;
            dom.volumeIcon.innerText = preMuteVolume < 50 ? "volume_down" : "volume_up";
            if (dom.volumePercentage) dom.volumePercentage.innerText = `${preMuteVolume}%`;
        }
    };
}

const navMapping = {
    'nav-playlist': { title: 'All Songs', data: () => songs },
    'nav-recent': { title: 'Recently Played', data: () => recentlyPlayed },
    'nav-favorites': { title: 'Favorites', data: () => favorites }
};

Object.entries(navMapping).forEach(([id, config]) => {
    const btn = document.getElementById(id);
    if (btn) {
        btn.onclick = () => {
            document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active-list'));
            btn.classList.add('active-list');
            if (dom.listTitle) dom.listTitle.innerText = config.title;
            
            currentList = config.data();
            displayLibrary(currentList);
        };
    }
});

const modeToggleElement = document.getElementById('mode-toggle');
if (modeToggleElement) {
    modeToggleElement.onclick = () => {
        document.body.classList.toggle('dark-mode');
    };
}

function formatTime(secs) {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

/* ==========================================
   5. PROFILE & CUSTOM PLAYLIST 
   ========================================== */

function handleProfileRename() {
    const currentName = dom.usernameText ? dom.usernameText.innerText : "User Name";
    const newName = prompt("Enter your new profile name:", currentName);
    
    if (newName && newName.trim() !== "") {
        const cleanName = newName.trim();
        
        if (dom.usernameText) {
            dom.usernameText.innerText = cleanName;
        }

        if (dom.userAvatar) {
            dom.userAvatar.innerText = cleanName.charAt(0).toUpperCase();
        }
    }
}

function setupPlaylistCreation() {
    const playlistListContainer = document.querySelector('.playlist-list');
    if (!playlistListContainer) return;

    playlistListContainer.onclick = (e) => {
        const createBtn = e.target.closest('li');
        if (!createBtn || !createBtn.innerText.includes('Create New')) return;

        const newPlaylistName = prompt("Enter a name for your new playlist:");
        if (newPlaylistName && newPlaylistName.trim() !== "") {
            const cleanName = newPlaylistName.trim();

            if (customPlaylists[cleanName]) {
                alert("A playlist with that name already exists!");
                return;
            }

            customPlaylists[cleanName] = [];
            const newLi = document.createElement('li');
            newLi.innerHTML = `<span class="material-symbols-outlined">queue_music</span> ${cleanName}`;
            newLi.onclick = (event) => {
                event.stopPropagation(); 
                document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active-list'));
                newLi.classList.add('active-list');
                
                if (dom.listTitle) dom.listTitle.innerText = cleanName;
                currentList = customPlaylists[cleanName];
                displayLibrary(currentList);
            };

            playlistListContainer.appendChild(newLi);
        }
    };
}

// --- ALL-IN-ONE SETTINGS ---
document.addEventListener("DOMContentLoaded", () => {
    displayLibrary(songs);
    setupPlaylistCreation();

    if (dom.usernameText) {
        dom.usernameText.style.cursor = "pointer";
        dom.usernameText.onclick = handleProfileRename;
    }

    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            handleProfileRename();
        });
    }

    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.getElementById('close-settings');
    const blurSlider = document.getElementById('blur-slider');
    const blurValue = document.getElementById('blur-value');
    const bassToggle = document.getElementById('bass-toggle');
    const resetDataBtn = document.getElementById('reset-data-btn');

    if (settingsBtn && settingsModal && closeSettings) {
        settingsBtn.onclick = (e) => {
            e.stopPropagation();
            settingsModal.classList.remove('hidden');
        };

        closeSettings.onclick = () => {
            settingsModal.classList.add('hidden');
        };
        settingsModal.onclick = (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.add('hidden');
            }
        };

        if (blurSlider && blurValue) {
            blurSlider.oninput = () => {
                const pxVal = blurSlider.value;
                blurValue.innerText = `${pxVal}px`;
                if (dom.bgWallpaper) {
                    dom.bgWallpaper.style.filter = `blur(${pxVal}px)`;
                }
            };
        }

        if (bassToggle) {
            bassToggle.onchange = () => {
                if (bassToggle.checked) {
     
                    if (!audioCtx) {
                        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                        sourceNode = audioCtx.createMediaElementSource(audio);
                        bassFilter = audioCtx.createBiquadFilter();
                        
                        bassFilter.type = "lowshelf";
                        bassFilter.frequency.value = 150; 
                        sourceNode.connect(bassFilter);
                        bassFilter.connect(audioCtx.destination);
                    }
                    if (audioCtx.state === 'suspended') {
                        audioCtx.resume();
                    }
                    bassFilter.gain.value = 12; 
                } else {
                    if (bassFilter) {
                        bassFilter.gain.value = 0; 
                    }
                }
            };
        }

        if (resetDataBtn) {
            resetDataBtn.onclick = () => {
                const verify = confirm("Are you sure you want to clear your history, favorites, and custom playlists?");
                if (verify) {
                    recentlyPlayed = [];
                    favorites = [];
                    customPlaylists = {};
                    const playlistList = document.querySelector('.playlist-list');
                    if (playlistList) {
                        playlistList.innerHTML = `<li><span class="material-symbols-outlined">add_box</span> Create New</li>`;
                    }

                    if (dom.listTitle) dom.listTitle.innerText = "All Songs";
                    currentList = songs;
                    displayLibrary(songs);
                    
                    settingsModal.classList.add('hidden');
                    alert("Application storage cleared successfully.");
                }
            };
        }
    }
});