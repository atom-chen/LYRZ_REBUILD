import { UserData } from "./UserData";

const { ccclass, property } = cc._decorator;

@ccclass
export class SoundManager extends cc.Component {

    @property({
        type: [cc.AudioClip]
    })
    protected gameSoundArray: cc.AudioClip[] = new Array();

    protected static readonly gameSoundMap: Map<string, cc.AudioClip> = new Map();

    protected static readonly _dic: Map<cc.AudioClip, number> = new Map();

    onLoad() {
        for (var gameSound of this.gameSoundArray) {
            var name = gameSound.name;
            SoundManager.gameSoundMap.set(name, gameSound);
        }
    }

    /**
     * 获取音效对应的AudioClip
     * @param audioName 音效的名称，在编辑器中的名称
     */
    protected static getAudioByName(audioName: string): cc.AudioClip {
        if (audioName == null) {
            return;
        }
        return this.gameSoundMap.get(audioName);
    }

    /**
     * 播放音效 只播放一次
     * @param audioName 音效的名称，在编辑器中的名称
     */
    public static playAudio(audioName: string): void {

        if (!UserData.data.gameSound) {
            return;
        }

        var audioClip = this.getAudioByName(audioName);

        if (audioClip == null) {
            return;
        }

        if (this._dic.has(audioClip)) {
            var id = this._dic.get(audioClip);
            var audio = cc.audioEngine._id2audio[id];
            if (audio != null) {
                audio.destroy();
            }
        }

        var id = cc.audioEngine.playEffect(audioClip, false);
        this._dic.set(audioClip, id);
    }

    /**
     * 停止播放音效
     * @param audioName 音效的名称，在编辑器中的名称
     */
    public static stop(audioName: string): void {

        var audioClip = this.getAudioByName(audioName);

        if (audioClip == null) {
            return;
        }

        if (this._dic.has(audioClip)) {
            var id = this._dic.get(audioClip);
            var audio = cc.audioEngine._id2audio[id];
            if (audio) {
                audio.stop();
            }
        }
    }
}