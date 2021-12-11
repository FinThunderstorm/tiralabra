# Toteutusdokumentti

## Käytettävät tietorakenteet ja algoritmit

Reitinhaku on toteutettu käyttäen A\*-algoritmiä. A\*-algoritmin tarvitsema prioriteettijono on toteutettu käyttäen minimikekoa.

## Käytettävät tekniikat

Ohjelmisto on toteutettu käyttäen Javascriptiä. Ohjelmistoa pyöritetään Docker-konteissa.

-   Reitinhaku: NodeJS
-   Välimuisti: Redis
-   Tietolähde: OpenTripPlanner

## Ohjelmiston yleinen rakenne

Docker-ympäristössä on kolme konttia, itse reitinhaku, Redis-cache ja OTP, joka toimii sovelluksen tietolähteenä. OTP tarjoaa lokaalin API-väylän HSL:n avoimeen dataan.

Reitinhaku on toteutettu siten, että reitinhakukontissa on erikseen frontend ja backend. Frontend kutsuu backendia RESTful API:n ylitse. Backend hakee GraphQL-muotoisesta API-väylästä tietoa OTP:sta.

## Saavutetut aika- ja tilavaativuudet (m.m. O-analyysit pseudokoodista)

## Suorituskyky- ja O-analyysivertailu (mikäli työ vertailupainotteinen)

## Työn mahdolliset puutteet ja parannusehdotukset

## Lähteet
