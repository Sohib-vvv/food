window.addEventListener('DOMContentLoaded', () => {

  // Tabs
  let tabs = document.querySelectorAll('.tabheader__item'),
      tabContent = document.querySelectorAll('.tabcontent'),
      tabsParent = document.querySelector('.tabheader__items'); 
      

   function hideTabContent () {
      tabContent.forEach(item => {
        item.classList.add('hide');
        item.classList.remove('show', 'fade');
      });

      tabs.forEach(item => {
        item.classList.remove('tabheader__item_active');
      });
   };
   
   
   function showTabContent (i = 0) {
      tabContent[i].classList.add('show', 'fade');
      tabContent[i].classList.remove('hide');
      tabs[i].classList.add('tabheader__item_active');
   };

   hideTabContent();
   showTabContent();

   tabsParent.addEventListener('click', (event) => {
      let target = event.target;

      if(target && target.classList.contains('tabheader__item')){
        tabs.forEach((item, i) => {
          if(item == target){
            hideTabContent();
            showTabContent(i);
          }
        });
      }
   });

   //Timer

   let deadline = '2023-03-29';

   function getTimeRemaining(endtime) {
    let t = Date.parse(endtime) - Date.parse(new Date()),
        days = Math.floor(t / (1000 * 60 * 60 *24 )),
        hours = Math.floor((t / (1000 * 60 * 60)) %24 ),
        minutes = Math.floor((t / 1000 / 60) % 60),
        seconds = Math.floor((t / 1000) % 60);

        return {
          'total': t,
          'days' : days,
          'hours' : hours,
          'minutes' : minutes,
          'seconds' : seconds
        }

   };

   function getZero (num) {

    if(num >= 0 && num < 10){
      return `0${num}`
    }else {
      return num
    }
   };

   function setClock(selector, endtime) {

      let timer = document.querySelector(selector),
          days = timer.querySelector('#days'),
          hours = timer.querySelector('#hours'),
          minutes = timer.querySelector('#minutes'),
          seconds = timer.querySelector('#seconds'),
          timeInterval = setInterval(updateClock, 1000);

          updateClock();

          function updateClock() {

            let t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if(t.total <= 0){
              clearInterval(timeInterval);
            }
          }
   };

    setClock('.timer', deadline);

    //Modal

    let modalTrigger = document.querySelectorAll  ('[data-modal]'),
        modal = document.querySelector('.modal')
    function openModal () {
      modal.classList.add('show');
      modal.classList.remove('hide');
      document.body.style.overflow = 'hidden';
      clearInterval(modalTimerId);
    };              
                 
                
    modalTrigger.forEach(btn => {
      btn.addEventListener('click', () => {
        openModal();
      });
  
    });

   
    function closeModal() {
      modal.classList.add('hide');
      modal.classList.remove('show');
      document.body.style.overflow = '';
    };

   

    modal.addEventListener('click', (e) => {
      if(e.target === modal || e.target.getAttribute('data-close') == ''){
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if(e.code === 'Escape' && modal.classList.contains('show')){
        closeModal();
      }
    });

    let modalTimerId = setTimeout(openModal, 3000);

    function showModalByScroll (){
      if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
        openModal();
        window.removeEventListener('scroll', showModalByScroll)
      }
    };

    window.addEventListener('scroll', showModalByScroll);

    // Class for cards
    

    class menuCArd {

      constructor(src, alt, title, desc, price, parentSelector, ...classes) {
        
        this.src = src;
        this.alt = alt;
        this.title = title;
        this.desc = desc;
        this.price = price;
        this.classes = classes;
        this.transfer = 27;
        this.parent = document.querySelector(parentSelector);
        this.changeToUAH();
      }

      changeToUAH (){
        this.price = this.price * this.transfer;
      }

      render() {
        let element = document.createElement('div');

        if(this.classes.length === 0){
          this.element = 'menu__item';
          element.classList.add(this.element);
        } else {
          this.classes.forEach(className => element.classList.add(className));
        }
       
        element.innerHTML = `

        <img src=${this.src} alt=${this.alt}>
        <h3 class="menu__item-subtitle">${this.title}</h3>
        <div class="menu__item-descr">${this.desc}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
        </div>

        `;
        this.parent.append(element);
      }
    };

    new menuCArd(
      "img/tabs/vegy.jpg",
      "vegy",
      'Меню "Фитнес"',
      'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
      9,
      '.menu .container'
    ).render();

    new menuCArd(
      "img/tabs/elite.jpg",
      "elite",
      'Меню “Премиум”',
      'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
      14,
      '.menu .container'
    ).render();


    new menuCArd(
      "img/tabs/post.jpg",
      "post",
      'Меню "Постное"',
      'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
      11,
      '.menu .container'
    ).render();

    //Forms

    let forms = document.querySelectorAll('form');

    let message = {
      loading : 'img/spinner/spinner.svg',
      success : 'success',
      failure : 'fail...'
    };

    forms.forEach(item  => {
      postData(item);
    });

    function postData (form) {
      form.addEventListener('submit', (e) => {
         e.preventDefault();

         let statusMessage = document.createElement('img');
         statusMessage.src = message.loading;
         statusMessage.style.cssText = `
         display: block;
         margin: 0 auto;
         `;
         
         form.insertAdjacentElement('afterend', statusMessage);

         let request = new XMLHttpRequest();
         request.open('POST', 'server.php');
         request.setRequestHeader('Content-type', 'application/json');

         let formData = new FormData(form); 

         let object = {};

         formData.forEach(function(value, key) {
          object[key] = value;
         });

         let json = JSON.stringify(object);

         request.send(json);

         request.addEventListener('load', () => {
          
          if(request.status === 200){
            console.log(request.response);
            showThanksModal(message.success);
            form.reset();
         
              statusMessage.remove();
         
          } else {
            showThanksModal(message.failure);
          }

         });
      });
    }

    // success form

    function showThanksModal(message){
      let prevModalDialog = document.querySelector('.modal__dialog');

      prevModalDialog.classList.add('hide');
      openModal();

      let thanksModal = document.createElement('div');
      thanksModal.classList.add('modal__dialog');
      thanksModal.innerHTML = `
      <div class="modal__content">
        <div class="modal__close" data-close>×</div>
        <div class= "modal__title">${message}</div>
      </div>

      `;
      
      document.querySelector('.modal').append(thanksModal);
      setTimeout(() => {
        thanksModal.remove();
        prevModalDialog.classList.add('show');
        prevModalDialog.classList.remove('hide');
        closeModal();
      },4000);

    };

});