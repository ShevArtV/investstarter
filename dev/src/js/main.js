document.addEventListener('readystatechange', function () {
    if (document.readyState == 'complete') {
        // основной объект со всеми функциями
        const projectScripts = {
            // конфигурация
            lazyLoadAttr: 'data-src',
            selfTypingText: document.querySelectorAll('.js-self-print-text'),
            statisticCounters: document.querySelectorAll('[data-counter]'),
            cookieMsgBlock: document.querySelector('.js-cookie-block'),
            cookieBtnAgree: document.querySelector('.js-cookie-agreed'),
            navLinks: document.querySelectorAll('.nav-link'),

            // функция получения cookie по имени
          /*  getCookie: function (name) {
                let matches = document.cookie.match(new RegExp(
                    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
                ));
                return matches ? decodeURIComponent(matches[1]) : undefined;
            },
*/
            // функция установки cookie
/*            setCookie: function (name, value, options = {}) {
                options = {
                    path: '/',
                    ...options
                };

                if (options.expires instanceof Date) {
                    options.expires = options.expires.toUTCString();
                }

                let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

                for (let optionKey in options) {
                    updatedCookie += "; " + optionKey;
                    let optionValue = options[optionKey];
                    if (optionValue !== true) {
                        updatedCookie += "=" + optionValue;
                    }
                }

                document.cookie = updatedCookie;
            },*/


            // загружаем дополнительные скрипты
            loadScript: function (path, callback) {
                let done = false,
                    scr = document.createElement('script');

                scr.onload = handleLoad;
                scr.onreadystatechange = handleReadyStateChange;
                scr.onerror = handleError;
                scr.src = path;
                document.body.appendChild(scr);

                function handleLoad() {
                    if (!done) {
                        done = true;
                        callback(path, "ok");
                    }
                }

                function handleReadyStateChange() {
                    let state;

                    if (!done) {
                        state = scr.readyState;
                        if (state === "complete") {
                            handleLoad();
                        }
                    }
                }

                function handleError() {
                    if (!done) {
                        done = true;
                        callback(path, "error");
                    }
                }
            },

            // прокручиваем страницу до указанного блока
            scrollIntoView: function (anchor) {
                let blockID = anchor.getAttribute('href').substr(1);
                if (document.getElementById(blockID)) {
                    document.getElementById(blockID).scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            },

            // определение видимости элемента
            visible: function (target) {
                let targetPosition = {
                        top: window.pageYOffset + target.getBoundingClientRect().top,
                        bottom: window.pageYOffset + target.getBoundingClientRect().bottom
                    },
                    windowPosition = {
                        top: window.pageYOffset,
                        bottom: window.pageYOffset + document.documentElement.clientHeight
                    };
                if (targetPosition.bottom > windowPosition.top && targetPosition.top < windowPosition.bottom) {
                    return true;
                } else {
                    return false;
                }
            },

            // ленивая загрузка
            lazyLoad: function () {
                let media = document.querySelectorAll('[' + projectScripts.lazyLoadAttr + ']');
                media.forEach(function (elem) {
                    if (projectScripts.visible(elem)) {
                        if (elem.tagName == 'IMG' || elem.tagName == 'IFRAME') {
                            elem.src = elem.dataset.src;
                        } else {
                            elem.style.backgroundImage = 'url(' + elem.dataset.src + ')';
                        }
                        elem.removeAttribute('data-src');
                    }
                });
            },

            // инициализируем печатающийся текст
            typingTextInit: function (elems) {
                elems.forEach(el => {
                    let texts = el.dataset.text.split('|');
                    new Typed(el, {
                        strings: texts,
                        typeSpeed: 90,
                        loop: true,
                    });
                });
            },

            // инициализируем счётчики
            statisticCountersInit: function (elems) {
                elems.forEach(el => {
                    let number = el.dataset.counter,
                        numAnim = new countUp(el, 0, number, 0, 1.5, {separator: ' '});
                    numAnim.start();
                });
            }

        };

        function documentReady() {

            if(!localStorage.politics && projectScripts.cookieMsgBlock){
                projectScripts.cookieMsgBlock.classList.remove('d-none');
            }

            if(projectScripts.cookieBtnAgree){
                projectScripts.cookieBtnAgree.addEventListener('click', () => {
                    localStorage.politics = false;
                    projectScripts.cookieMsgBlock.classList.add('d-none');
                });
            }
            
            const anchors = document.querySelectorAll('a[href*="#"]');
            for (let i = 0; i < anchors.length; i++) {
                let anchor = anchors[i];
                // скрываем пункты меню без блоков
                if (anchor.getAttribute('href').length > 1 && !document.querySelector(anchor.getAttribute('href'))) {
                    anchor.parentElement.classList.add('d-none');
                }
                // Плавный скролл
                if (anchor.getAttribute('href').indexOf('http') == -1 && !anchor.getAttribute('data-bs-toggle')) {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();
                        setTimeout(function () {
                            projectScripts.scrollIntoView(anchor);
                        }, 500);
                    });
                }
            }

            // прокручиваем страницу если в адресе есть якорь
            let targetId = document.location.href.match(/#(.*)$/);
            if (targetId) {
                projectScripts.navLinks.forEach(function (link) {
                    if (targetId[0].indexOf(link.getAttribute('href')) != -1) {
                        setTimeout(function () {
                            projectScripts.scrollIntoView(link);
                        }, 1000);
                    }
                });
            }


            // Маска ввода номера телефона
            let phoneMask = document.querySelectorAll('input[type="tel"]');
            for (let i = 0; i < phoneMask.length; i++) {
                phoneMask[i].addEventListener('keydown', function (event) {
                    if (!(event.key == 'ArrowLeft' || event.key == 'ArrowRight' || event.key == 'Backspace' || event.key == 'Tab')) {
                        event.preventDefault()
                    }
                    let mask = '+7(111)111-11-11'; // Задаем маску

                    if (/[0-9\+\ \-\(\)]/.test(event.key)) {

                        let currentString = this.value;
                        let currentLength = currentString.length;

                        if (/[0-9]/.test(event.key)) {
                            for (let i = currentLength; i < mask.length; i++) {
                                let number = event.key;
                                if (mask[i] == '1') {
                                    if (i == 3 && number != '9') {
                                        number = '';
                                    }
                                    this.value = currentString + number;
                                    break;
                                }
                                currentString += mask[i];
                            }
                        }
                    }
                });
            }

            // Вставляем защитный ключ
            let antiSpamKey = document.querySelectorAll('input[name="secret"]');
            if (antiSpamKey.length) {
                //console.log("YES");
                for (let k = 0; k < antiSpamKey.length; k++) {
                    antiSpamKey[k].value = antiSpamKey[k].dataset.secret;
                }
            }

            // отслеживаем прокрутку
            window.addEventListener('scroll', function () {
                projectScripts.lazyLoad();
            });

            if (projectScripts.selfTypingText) {
                projectScripts.loadScript('/assets/project_files/js/typed.min.js', () => {
                    projectScripts.typingTextInit(projectScripts.selfTypingText)
                });
            }

            if (projectScripts.statisticCounters) {
                projectScripts.loadScript('/assets/project_files/js/count-up.min.js', () => {
                    projectScripts.statisticCountersInit(projectScripts.statisticCounters)
                });
            }
            projectScripts.loadScript('//code-ya.jivosite.com/widget/3hazSdemWg', () => {
            });
            projectScripts.lazyLoad();
        }


        projectScripts.loadScript('/assets/project_files/js/bootstrap.bundle.min.js', documentReady);
    }
});