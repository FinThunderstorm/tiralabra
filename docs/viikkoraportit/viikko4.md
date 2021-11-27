# Viikkoraportti 4

## Mitä olen tehnyt tällä viikolla?

Korjannut bugeja reitinhausta ja etsinyt sekä lukenut kirjallisuutta prioriteettijonon toteuttamista varten, sekä aloittanut toteuttamaista. Yliopiston kirjasto on yliveto, kun Steinin _Introduction to algorithms_ oli tarjolla e-kirjana ilman vierailua kampuskirjastolle.

Suunnitellut suorituskykytestien tekemistä. Tämän hetkinen suunnitelma on ajaa suorituskykytestit kaksi kertaa. Ensimmäisellä kerralla ajetaan redis-cacheen tarvittava aineisto taustapalvelimelta ja vasta tämän jälkeen ajetaan itse aikamitattava testi, jotta poissuljetaan vaikuttamasta aineiston noutamisesta johtuva viive tilastoja vääristämästä.

## Miten ohjelma on edistynyt?

Ei niin paljon näkyvää. Tälle viikolle on sattunut muiden kurssien osalta sen verta aktiviteettiä (Ohtun miniprojektien alkaminen), sekä muuta yleistä aktiviteettiä.

Ohjelmiston verkkoversion pyörimään laittaminen odottaa - ratkaisua etsitään OTP:n lokaalin version muistintarpeelle 4GB VPS-palvelimella - mahdollisesti pyöritän 1GB muistilla. Ongelmaksi muodostuu se, että OTP ei osaa kaatua sopivalla koodilla Javan muistin loppuessa, eikä täten pysty laittamaan Dockeria uudelleenkäynnistymään.

## Mitä opin tällä viikolla / tänään?

Tarkasta, että mistä muuttujasta haet aikaa - viime viikon aikamatkustaminen johtui väärästä kellon ajasta tämän hetkisen tiedon valossa. Seuraavalle pysäkille haettiin aika edellsen pysäkin saapumisajalla.

## Mikä jäi epäselväksi tai tuottanut vaikeuksia? Vastaa tähän kohtaan rehellisesti, koska saat tarvittaessa apua tämän kohdan perusteella.

Tämän viikon haasteet ovat olleet löytää kunnollista materiaalia minimikeon toteuttamiseen - Steinin kirja oli paras löytämäni, mutta siinäkin asia esitetään maksimikeon kautta pääosin. Siinä kuitenkin viitataan minimikeon toimintaan kappaleessa 6 useammankin kerran, niin saatuani toteutettua maksimikeon toimivaksi, pystyn kääntämään sen helposti minimikeoksi.

## Mitä teen seuraavaksi?

-   Minimikeko toimivaksi + toimivat testit
-   Reitinhaun parantamista (suosi samaa linjaa, jos sama lähtöaika) + toimivat testit
-   Suorituskykytestien aloittaminen

## Työajat

| SU  | MA  | TI  | KE  | TO  |  PE | LA  |
| --- | --- | --- | --- | --- | --- | --- |
| 5h  |  0h |  0h | 5h  | 3h  | 2h  | 3h  |
