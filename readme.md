# Виджет рейтинга отеля на сервисах Booking.com и tripadvisor.ru
Выводит на странице сайта виджет, который отображает название отеля и рейтинг отеля на сервисе https://booking.com и/или https://www.tripadvisor.ru/. Размеры вджета 150х170 px. При необходимости виджет можно закрыть кнопкой сроком на сессию браузера.

В виджете настраивается позиция его вывода, рейтинг от Booking и/или Tripadvisor


![Widgete preview](preview.gif)

## Установка

Разместите на странице следующий код:
```html
<!-- BEGIN WIDGETE RATING CODE {literal} -->
<script>
    _7vBR = {
        id: 211,
        position: 'left bottom',
        mode: 'all',
        nocopy: false
    };
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'loader.js';
    var ss = document.getElementsByTagName('script')[0];
    ss.parentNode.insertBefore(s, ss);
</script>
<!-- {/literal} END WIDGETE RATING CODE  -->
```

Где:

**id** — id отеля

**position** — позиция вывода виджета 

**mode** - all | booking | tripadvisor

**nocopy** - скрыть копирайт внизу виджета: true | false

### Позиции вывода виджета
left top|center|bottom

center bottom

right top|center|bottom

## Регистрация виджета

Для получения **id** виджета необходимо зарегистрироваться на сервисе http://reviews.tourhotel24.ru/admin/login

