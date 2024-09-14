var SOUND_VOLUMES = [];

SOUND_VOLUMES['default_music'] = 0.5;
SOUND_VOLUMES['default'] = 0.5;

const DOMINO_PLAY_SOUNDS = ['Block1', 'Block2', 'Block3', 'Block4'];
const MUSIC_TRACKS_MENU = ['Music_menu_intro', 'Music_menu_loop', 'Music_menu_outro'];
const MUSIC_TRACKS_GAMEPLAY = ['Music_gameplay_intro', 'Music_gameplay_loop', 'Music_gameplay_outro'];

var currentTrackIndex = 0;
var music, curr_sound;
var playingSounds = []
const MAX_TRACK_INDEX = 3;

function getSoundVolume(sound) {
    return SOUND_VOLUMES.hasOwnProperty(sound) ? SOUND_VOLUMES[sound] : SOUND_VOLUMES['default'];
}

function handleError(error, context) {
    console.error(`${context}: ${error.message}`);
}

function stopAndDestroyMusic() {
    if (music) {
        music.stop();
        music.destroy();
        music = null;
    }
}

function playNextTrack(scene, isMenu) {
    stopAndDestroyMusic();
    currentTrackIndex = currentTrackIndex >= MAX_TRACK_INDEX ? 0 : currentTrackIndex;
    const tracks = isMenu ? MUSIC_TRACKS_MENU : MUSIC_TRACKS_GAMEPLAY;
    const track = tracks[currentTrackIndex];

    try {
        music = scene.sound.add(track);
        const volume = getSoundVolume('default_music') || 0;
        music.play({ volume });

        music.on('complete', () => {
            currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
            playNextTrack(scene, isMenu);
        });
    } catch (e) {
        handleError(e, 'playNextTrack');
    }
}

function changeMusicVolume(volume) {
    if (music) {
        music.setVolume(volume || 0);
    }
}

function playSound(scene, sound) {
    if (!scene || !sound) return;

    try {
        curr_sound = scene.sound.add(sound);
        if (!curr_sound) return;

        const volume = getSoundVolume(sound) || 0;
        curr_sound.play({ volume });

        playingSounds.push(curr_sound);
    } catch (e) {
        handleError(e, 'playSound');
    }
}

function pauseSounds(scene) {
    if (scene?.scene?.sound) {
        scene.scene.sound.setMute(true);
    }
}

function resumeSounds(scene) {
    if (scene?.scene?.sound) {
        playingSounds.forEach(sound => {
            sound.stop();
            sound.destroy();
        });
        playingSounds = [];
        setTimeout(() => {
            scene.scene.sound.setMute(false);
        }, 100);
    }
}

function pauseMusic() {
    try {
        music?.pause();
    } catch (e) {
        handleError(e, 'pauseMusic');
    }
}

function resumeMusic() {
    try {
        music?.resume();
    } catch (e) {
        handleError(e, 'resumeMusic');
    }
}

function destroyMusic(scene) {
    stopAndDestroyMusic();
}