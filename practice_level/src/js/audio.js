/*
 * @Author: Hamletbat 1125051234@qq.com
 * @Date: 2023-05-02 19:20:15
 * @LastEditors: Hamletbat 1125051234@qq.com
 * @LastEditTime: 2023-05-08 15:55:07
 * @FilePath: \CHEC_Advanture_server\src\js\audio.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Howl } from 'howler'
import audioCompleteLevel from '../audio/audioCompleteLevel.mp3'
import audioDescend from '../audio/audioDescend.mp3'
import audioDie from '../audio/audioDie.mp3'
import audioFireFlowerShot from '../audio/audioFireFlowerShot.mp3'
import audioFireworkBurst from '../audio/audioFireworkBurst.mp3'
import audioFireworkWhistle from '../audio/audioFireworkWhistle.mp3'
import audioGameOver from '../audio/audioGameOver.mp3'
import audioJump from '../audio/audioJump.mp3'
import audioLosePowerUp from '../audio/audioLosePowerUp.mp3'
import audioMusicLevel1 from '../audio/audioMusicLevel.mp3'
//import audioWinLevel from '../audio/audioWinLevel.mp3'
import audioObtainPowerUp from '../audio/audioWinLevel.mp3'
import audioCockroachSquash from '../audio/audioCockroachSquash.mp3'

export const audio = {
  completeLevel: new Howl({
    src: [audioCompleteLevel],
    volume: 0.1
  }),
  descend: new Howl({
    src: [audioDescend],
    volume: 0.1
  }),
  die: new Howl({
    src: [audioDie],
    volume: 0.1
  }),
  fireFlowerShot: new Howl({
    src: [audioFireFlowerShot],
    volume: 0.1
  }),
  fireworkBurst: new Howl({
    src: [audioFireworkBurst],
    volume: 0.1
  }),

  fireworkWhistle: new Howl({
    src: [audioFireworkWhistle],
    volume: 0.1
  }),
  gameOver: new Howl({
    src: [audioGameOver],
    volume: 0.1
  }),
  jump: new Howl({
    src: [audioJump],
    volume: 0.1
  }),
  losePowerUp: new Howl({
    src: [audioLosePowerUp],
    volume: 0.1
  }),
  musicLevel1: new Howl({
    src: [audioMusicLevel1],
    volume: 0.1,
    loop: true,
    autoplay: true
  }),
  obtainPowerUp: new Howl({
    src: [audioObtainPowerUp],
    volume: 0.1
  }),
  cockroachSquash: new Howl({
    src: [audioCockroachSquash],
    volume: 0.1
  })
}