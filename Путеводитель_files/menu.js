!function(e){"function"!=typeof e.matches&&(e.matches=e.msMatchesSelector||e.mozMatchesSelector||e.webkitMatchesSelector||function(e){for(var t=this,o=(t.document||t.ownerDocument).querySelectorAll(e),n=0;o[n]&&o[n]!==t;)++n;return Boolean(o[n])}),"function"!=typeof e.closest&&(e.closest=function(e){for(var t=this;t&&1===t.nodeType;){if(t.matches(e))return t;t=t.parentNode}return null})}(window.Element.prototype);


document.addEventListener('DOMContentLoaded', function() {

   /* Записываем в переменные массив элементов-кнопок и подложку.
      Подложке зададим id, чтобы не влиять на другие элементы с классом overlay*/
   var modalButtons = document.querySelectorAll('.mob-menu'),
       overlay      = document.querySelector('.js-overlay-modal'),
       closeButtons = document.querySelectorAll('.close__menu');


   /* Перебираем массив кнопок */
   modalButtons.forEach(function(item){

      /* Назначаем каждой кнопке обработчик клика */
      item.addEventListener('click', function(e) {

         /* Предотвращаем стандартное действие элемента. Так как кнопку разные
            люди могут сделать по-разному. Кто-то сделает ссылку, кто-то кнопку.
            Нужно подстраховаться. */
         e.preventDefault();

         /* При каждом клике на кнопку мы будем забирать содержимое атрибута data-modal
            и будем искать модальное окно с таким же атрибутом. */
         var modalId = this.getAttribute('data-modal'),
             modalElem = document.querySelector('.menu_el[data-modal="' + modalId + '"]');

         if (!modalElem) {
            return;
         }


         /* После того как нашли нужное модальное окно, добавим классы
            подложке и окну чтобы показать их. */
         modalElem.classList.add('active');
         if (overlay) {
            overlay.classList.add('active');
         }
      }); // end click

   }); // end foreach


   closeButtons.forEach(function(item){

      item.addEventListener('click', function(e) {
         var parentModal = this.closest('.menu_el');

         if (parentModal) {
            parentModal.classList.remove('active');
         }
         if (overlay) {
            overlay.classList.remove('active');
         }
      });

   }); // end foreach


    document.body.addEventListener('keyup', function (e) {
        var key = e.keyCode;

        if (key == 27) {
            var activeMenu = document.querySelector('.menu_el.active');
            var activeOverlay = document.querySelector('.overlay');

            if (activeMenu) {
                activeMenu.classList.remove('active');
            }
            if (activeOverlay) {
                activeOverlay.classList.remove('active');
            }
        };
    }, false);


    if (overlay) {
        overlay.addEventListener('click', function() {
            var activeMenu = document.querySelector('.menu_el.active');
            if (activeMenu) {
                activeMenu.classList.remove('active');
            }
            this.classList.remove('active');
        });
    }
}); // end ready
