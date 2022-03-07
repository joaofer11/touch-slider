const slideContainer = document.querySelector('[data-js="slide-container"]')
const slider = slideContainer.querySelector('[data-js="slider"]')
const slides = slider.querySelectorAll('[data-js="slide"]')
const images = slider.querySelectorAll('img')
const buttons = slideContainer.querySelectorAll('button')


const dist = {
   startPos: 0,
   currentMove: 0,
   prevTranslate: 0,
   currentTranslate: 0,
   currentIndex: 0
}

let isDragging = false
let animationID = 0
let transition = true



const setSliderPosition = () => slider.style.transform = `translate3d(${dist.currentTranslate}px,0,0)`

const activeSlide = () => {
   slides.forEach(slide => slide.classList.remove('active'))
   slides[dist.currentIndex].classList.add('active')
}

const transitionSlide = active => {
   slider.style.transition = active ? 'transform .3s ease' : ''
}

const setSlideByIndex = () => {
   dist.currentTranslate = dist.currentIndex * -window.innerWidth
   dist.prevTranslate = dist.currentTranslate
   
   setSliderPosition()
}

const toggleSlide = index => event => {
   if(index === 0) {
      (dist.currentIndex > 0) ? dist.currentIndex-- : false
   } else {
      (dist.currentIndex < slides.length - 1)
         ? dist.currentIndex++
         : false
   }
   
   activeSlide()
   setSlideByIndex()
}

const animation = () => {
   setSliderPosition()
   if (isDragging) requestAnimationFrame(animation)
}

const onStart = index => event => {
   isDragging = true
   transition = false
   transitionSlide(transition)
   dist.currentIndex = index
   dist.startPos = event.touches[0].clientX
   animationID = requestAnimationFrame(animation)
}

const onMove = event => {
   if (isDragging) {
      dist.currentMove = event.touches[0].clientX
      dist.currentTranslate = dist.prevTranslate + dist.currentMove - dist.startPos
   }
}

const onEnd = () => {
   isDragging = false
   transition = true
   transitionSlide(transition)
   cancelAnimationFrame(animationID)
   const movedBy = dist.currentTranslate - dist.prevTranslate
   
   if (movedBy < -120 && dist.currentIndex < slides.length - 1) {
      dist.currentIndex++
   }
   
   if (movedBy > 120 && dist.currentIndex > 0) {
      dist.currentIndex--
   }
   
   activeSlide()
   setSlideByIndex()
}

// Events

slideContainer.addEventListener('touchstart', onStart)
slideContainer.addEventListener('touchmove', onMove)
slideContainer.addEventListener('touchend', onEnd)

slides.forEach((slide, index) => {
   slide.addEventListener('touchstart', onStart(index))
})

buttons.forEach((button, index) => {
   button.addEventListener('click', toggleSlide(index))
})
