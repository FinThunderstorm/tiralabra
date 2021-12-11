# Viikkoraportti 6

## Mitä olen tehnyt tällä viikolla?

Kirjoillut yksikkötestejä maailman rakoon. Luovuttanut Mock-olion käytön kanssa ja tehnyt paluun yhtä nopeasti.

Asia, jota en aikaisemmin tajunnut oli kellon aikojen muuttamisen tarve. Mock-olio sai kellon ajat tekstimuotoisena päiväys-olion sijasta. Samalla huomasin ongelmia käytetysssä tiedonkeräysmuodossa kovakoodatulle testausdatalle.

Kun ongelmat sai ratkottua, niin yksikkötestit alkavat luistamaan. Tällä viikolla myös tarkennettu testauskattavuuden tarkastelun aluetta jättämään sovelluksen backendin puolelta epärelevantteja osia pois, joiden tehtävä oli lähinnä toimia rajapintana sovelluksen käyttämiselle tai tiedon hakemiselle taustapalvelimelta. API:sta tulevan tiedon uudelleenmuotoilulle on vielä tarkoitus toteuttaa oikeellisuuden varmistamista yksikkötestien muodossa.

Todennut myös, että OpenTripPlanerin tietoja vasten ei voi rakentaa yksikkötestausta, koska se ei kykene hakemaan yli päivän menneisyydessä oleville kellon ajoille lähtötietoja.

## Miten ohjelma on edistynyt?

Koko ajan lähestytään lähemmäs maalia.

Yksikkötestaus on taustapalveimelta tulevien tietojen muuntamisen oikeellisuuden tarkastamista vaille valmista. Yksikkötesteissä nyt neljä erilaista reittiä testattavana. Nämä on vähän "kerman kuorimista kakun päältä" tavalla hankittuja HSL:n reittioppaan avulla oman haarukoinnin kanssa. Syynä on se, että algoritmi ei saa sellasita dataa, jonka pohjalta se osaisi esimerkiksi vaihtaa viereiselle pysäkille isommissa pysäkkikokonaisuuksissa, vaan se osaa kulkea vain pysäkiltä toiselle käyttäen jotain julkisen liikenteen kulkuvälinettä. Tämä rajoittaa helposti saatavien viisaiden testaustapauksien saamista.

Suorituskykytestaus on jo mahdollista, ja nyt lähinnä hiotaan enää käyttöliittymän kautta viisaammin toteutettaviksi kuin pelkkä HTTP-POST pyyntö. Samassa yhteydessä kasvatetaan suorituskykytestien laajuutta suorittamalla kymmenelle eri reitille yhden tunnin sisällä viiden minuutin välein reitin hakeminen. Samassa yhteydessä pohditaan, onko mielekästä vertailla OpenTripPlanerin käyttämään A\*-algoritmiin haun tehokkuutta ensin saamani ajatuksen pohjalta, kun siitä en pysty tekemään sellaista hakua, joka käyttäisi välimuistiin ladattuja tietoja - en saa muodostettua vertailukelpoista dataa.

Suorituskykytestien toteutustapa tulee olemaan se, että ensin reitti ajetaan siten, että käytettävät reittipisteet ajetaan välimuistiin ja vasta tämän jälkeen suoritetaan itse reitinhaku. Täten eliminodaan suorituskyvystä taustapalvelimen kanssa asioimiseen kuluva aika, ja saadaan rehellisemmin algoritmin suorituskykyä kuvaava tulos aikaiseksi.

## Mitä opin tällä viikolla / tänään?

Vaikka OpenTripPlaneria ajetaan lokaalisti, on suorituskykyero valtava verrattaessa lennosta tiedon hakua välimuistista haetulla tiedolla tehtävään reitinhakuun.

Esimerkkinä haku, jossa lähtöpysäkkinä Urheilutie (V6205) ja kohdepysäkkinä Kumpulan kampus (H3028) lähtöajalla 15.12.2021 klo 1215.

```
{
    "startStop": "HSL:4620205",
    "endStop": "HSL:1240118",
    "startTime": "2021-12-15T12:15:00.000Z"
}
```

Tulos on seuraava:

```
"took": {
        "otp": 0.5100736999958754,
        "uncachedPathfinder": 3.420064499989152,
        "pathfinder": 0.020371199995279313,
        "resultText": "OTP took 0.510 seconds and PathFinder took 0.020 seconds",
        "comparation": "PathFinder was -2403.896% slower than optimized OpenTripPlanner\n -> Time difference was -0.490 seconds."
    }
```

Tästä erottuu hyvin API:in tehtävien pyyntöjen vaikutus. Jokainen pyyntö API:in aiheutti yhteensä noin vajaan 3,5 sekunttia viivettä, kun haetulla lopullisella reitillä käytiin 12 pysäkillä yhdellä linjalla. Kun ero on näin merkittävä OpenTripPlanerin reitinhaulle tehtävään pyyntöön vertailudatan saamiseksi, ei sitä mielestäni voi pitää relevanttina vertailukohteena johtuen juurikin tästä API:iin tehtävien pyyntöjen viiveestä.

## Mikä jäi epäselväksi tai tuottanut vaikeuksia? Vastaa tähän kohtaan rehellisesti, koska saat tarvittaessa apua tämän kohdan perusteella.

Millainen on reitinhaulle sopiva empiirisen tutkimuksen kohde, josta tämä graafinen esitys kannattaisi toteuttaa? Tämä jäi vähän mysteeriseksi.

## Mitä teen seuraavaksi?

-   Viimeistelyä.
-   Suorituskykytestauksen viimeiseen timanttiin hiomista.
-   Dokumentaation kirjoittelemista.

## Työajat

| SU  | MA  | TI  | KE  | TO  |  PE | LA  |
| --- | --- | --- | --- | --- | --- | --- |
| 2h  | 0 h |  2h | 4h  | 5h  | 4h  | 6h  |
