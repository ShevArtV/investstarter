const texts = [
    'Сервис по поиску инвестиций и проектов',
    'Сервис по продаже франшиз',
    'Сервис по продаже готового бизнеса',
    'Сообщество инвесторов и предпринимателей'
];
let selfTypingText = document.querySelectorAll('.js-self-print-text');
if(selfTypingText.length){
    selfTypingText.forEach(el => {
        let texts = el.dataset.text.split('|');
        new Typed(el, {
            strings: texts,
            typeSpeed: 30
        });
    });
}

