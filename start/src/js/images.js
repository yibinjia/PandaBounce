/*
 * @Author: Hamletbat 1125051234@qq.com
 * @Date: 2023-05-08 15:24:41
 * @LastEditors: Hamletbat 1125051234@qq.com
 * @LastEditTime: 2023-05-08 15:27:08
 * @FilePath: \CHEC_Advanture_server\src\js\images.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import backgroundLevel2 from '../img/level2/background.jpg'
import mountains from '../img/level2/mountains.png'
import lgPlatformLevel2 from '../img/level2/lgPlatform.png'
import mdPlatformLevel2 from '../img/level2/mdPlatform.png'


export const images = {
  levels: {
    1: {
      background: ''
    },
    2: {
      background: backgroundLevel2,
      mountains,
      lgPlatform: lgPlatformLevel2,
      mdPlatform: mdPlatformLevel2
    }
  }
}