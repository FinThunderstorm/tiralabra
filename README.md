# Tiralabra

![Github Actions](https://github.com/FinThunderstorm/tiralabra/workflows/Build&Test/badge.svg) [![codecov](https://codecov.io/gh/FinThunderstorm/tiralabra/branch/master/graph/badge.svg?token=agzbQdgG0v)](https://codecov.io/gh/FinThunderstorm/tiralabra) [![Maintainability](https://api.codeclimate.com/v1/badges/ba0b31f0815473265922/maintainability)](https://codeclimate.com/github/FinThunderstorm/tiralabra/maintainability)

## Käyttöohjeet

Sovelluksen voi käynnistää komennolla `docker-compose up -d`.

Sovellus on käytettävissä hetken jälkeen `http://localhost:3000/`.

HOX! Taustapalvelimena API-kutsuille käytettävä OTP:lle on allogoitu enimmillään 7 gigaa muistia Javan virtuaalikoneelle välttääkseen sen äkkinäiset kaatumisen muistin loppumisen takia.

Logit reitinhakusovelluksesta ja redis-cachesta komennolla `docker-compose logs -f app cache`.
OTP:n logit `docker-compose logs -f otp`.

Sulje sovellukset komennolla `docker-compose down -v`.

## Dokumentaatio

-   [Määrittelydokumentti](./docs/maarittelydokumentti.md)
-   [Testausdokumentti](./docs/testausdokumentti.md)
-   [Toteutusdokumentti](./docs/toteutusdokumentti.md)

## Viikkoraportit

-   [Viikko 1](./docs/viikkoraportit/viikko1.md)
-   [Viikko 2](./docs/viikkoraportit/viikko2.md)
-   [Viikko 3](./docs/viikkoraportit/viikko3.md)
-   [Viikko 4](./docs/viikkoraportit/viikko4.md)
-   [Viikko 5](./docs/viikkoraportit/viikko5.md)
-   [Viikko 6](./docs/viikkoraportit/viikko6.md)
