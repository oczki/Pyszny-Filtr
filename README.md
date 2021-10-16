# Pyszny Filtr

![image](https://user-images.githubusercontent.com/2924029/105899964-af845180-601b-11eb-8d75-057e4d99c2b3.png)

For English, scroll below.

---
---

## Opis

Skrypt do przeglądarki, dzięki któremu na Pyszne.pl możesz filtrować dania według składników.

Możesz podać kilka składników – wystarczy oddzielić je przecinkiem. Nie musisz podawać pełnych nazw; lepiej ograniczyć się do pierwszych kilku znaków, żeby uwzględnić odmienione słowa.

- Wpisanie `ceb, ruko` w polu "chcę to, to, ..." spowoduje pokazanie tylko tych dań, które **zawierają** cebulę **oraz** rukolę.
- Wpisanie `ceb, ruko` w polu "nie chcę, bleh, ..." spowoduje pokazanie tylko tych dań, które **nie zawierają** cebuli **ani** rukoli.

Po odfiltrowaniu znikną też kategorie posiłków, które okażą się puste.

Należy pamiętać, że ten skrypt szuka **składników**, a nie **nazw dań**. Składniki są pisane *kursywą* pod nazwą dania.  
Jeżeli chcesz szukać nazw dań, użyj zwykłego wyszukiwania w przeglądarce, tzn. <kbd>Ctrl</kbd>+<kbd>F</kbd>.

## Instalacja

1. **Ściągnij wtyczkę, która obsługuje skrypty użytkownika**. Ja używam [Violentmonkey](https://violentmonkey.github.io/).
2. [Otwórz plik ze skryptem (**kliknij tutaj**)](https://github.com/oczki/Pyszny-Filtr/raw/master/PysznyFiltr.user.js), żeby go zainstalować.
3. **Gotowe!** Wejdź na Pyszne.pl – na stronie z menu jakiejś restauracji powinny pojawić się dodatkowe pola, takie jak na obrazku powyżej.

## Licencja

MIT. Szczegóły w pliku LICENSE.

---
---

## Description

Userscript that lets you filter meals on Pyszne.pl by liked and disliked ingredients.

You can enter multiple ingredients by separating them with a comma.

- Entering `ceb, ruko` in "chcę to, to, ..." will show meals that have **both** cebula **and** rukola.
- Entering `ceb, ruko` in "nie chcę, bleh, ..." will show meals that have **neither** cebula **nor** rukola.

Try not to enter too much of the name, as Polish declension will make the filter not work (e.g. `cebula` will not catch "cebulę").

Empty meal categories will be hidden.

Note that this does not search for **item names**. This script only combs through their **ingredients**, which are usually *in italics*.  
To search for names, use the default search in your browser, e.g. <kbd>Ctrl</kbd>+<kbd>F</kbd>.

## Setup

1. **Get a browser extension that lets you run userscripts**. I'm using [Violentmonkey](https://violentmonkey.github.io/).
2. [Open the script file (just **click here**)](https://github.com/oczki/Pyszny-Filtr/raw/master/PysznyFiltr.user.js) to install it.
3. **Done!** Start looking for some food on Pyszne.pl. In a restaurant's menu view, you should see input fields like in the screenshot above.

## License

MIT. See the LICENSE file.
