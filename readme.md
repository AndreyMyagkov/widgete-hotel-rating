# Виджет рейтинга отеля на сервисе Booking.com
Выводит на странице сайта виджет, который отображает название отеля и рейтинг отеля на сервисе https://booking.com. Размеры вджета 150х150 px. В виджете настраивается позиция его вывода. При необходимости виджет можно закрыть кнопкой сроком на 1 неделю.


![Widgete preview](preview.png)

## Установка

Разместите на странице следующий код:
```html
<!-- BEGIN BOOKING RATING CODE {literal} -->
<script>
    _7vBR = {
        id: 211,
        position: 'left bottom'
    };
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'loader.js';
    var ss = document.getElementsByTagName('script')[0];
    ss.parentNode.insertBefore(s, ss);
</script>
<!-- {/literal} END JBOOKING RATING CODE  -->
```

Где:

**id** — id отеля
**position** — позиция вывода виджета 

### Позиции вывода виджета
left top|center|bottom
center bottom
right top|center|bottom

## Регистрация виджета

Для получения **id** виджета необходимо зарегистрироваться на сервисе http://reviews.tourhotel24.ru/admin/login

