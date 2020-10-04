import gsap from 'gsap';

export const rotateY = (elem1, duration = 1) => {
  return gsap.to(elem1, duration, {
    rotationY: 360,
  })
}
export const show = (elem1, duration = 1) => {
  return gsap.fromTo(elem1, duration, {
    opacity: 0,
  }, {
    opacity: 1,
  });
}
export const hide = (elem1, duration = 1) => {
  return gsap.fromTo(elem1, duration, {
    opacity: 1,
  }, {
    opacity: 0,
  });
}
export const goRed = (elem1, duration = 1) => {
  return gsap.fromTo(elem1, {
    backgroundColor: '#FF0000',
  }, {
    backgroundColor: '#3e4153',
    duration
  });
}
export const goGreen = (elem1, duration = 1) => {
  return gsap.fromTo(elem1, {
    backgroundColor: '#00FF00',
  }, {
    backgroundColor: '#3e4153',
    duration
  });
}
export const goColor = (elem1, duration = 1, color: "#00FF00") => {
  return gsap.to(elem1, duration, {
    backgroundColor: color,
  });
}
