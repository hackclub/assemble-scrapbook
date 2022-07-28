
export default async function handler(req, res){
  let sounds = [
    '/sounds/909-drums.mp3',
    '/sounds/bite.mp3',
    '/sounds/boop.mp3',
    '/sounds/disable-sound.mp3',
    '/sounds/dun-dun-dun.mp3',
    '/sounds/enable-sound.mp3',
    '/sounds/fanfare.mp3',
    '/sounds/glug-a.mp3',
    '/sounds/glug-b.mp3',
    '/sounds/glug.mp3',
    '/sounds/menu-open.mp3',
    '/sounds/meow.mp3',
    '/sounds/pfff.mp3',
    '/sounds/plunger-immediate.mp3',
    '/sounds/plunger.mp3',
    '/sounds/pop-down.mp3',
    '/sounds/pop-off.mp3',
    '/sounds/pop-on.mp3',
    '/sounds/pop-up-off.mp3',
    '/sounds/pop-up-on.mp3',
    '/sounds/pop.mp3',
    '/sounds/rising-pops.mp3',
    '/sounds/switch-off.mp3',
    '/sounds/switch-on.mp3'
  ]
  let sound = [sounds[Math.floor(Math.random() * sounds.length)]]
  res.redirect(sound[0])
}