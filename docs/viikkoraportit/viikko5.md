# Viikkoraportti 5

## Mitä olen tehnyt tällä viikolla?

Testejä. Testejä kaikkialla. Minimikeon toteutuksen viimeistely. Kasvattanut merkittävästi koodin testauskattavuutta lisäämällä yksikkötestausta reitinhakuun ja minimikekoon. Kasvattanut dokumentaation osuutta puuttuvilta osilta. Lisännyt haversine-funktion laskemisen valmiin kirjaston sijasta.

Kirjoillut suuresti saatuani reitinhaun testit toimimaan kuvitellen sen tekevän testausta Mock-oliota vasten, mutta todellisuudessa se ajoi testit OTP instanssia vasten ja sen jälkeen jatkanut Mockin virheiden korjaamisella. Mockin virheet johtuivat osalti siitä, että käytössä oleva lähtökellonaika olikin käyttöliittymän puolella minulle näkymättömistä syistä 36 sekunttia ohitse, sekä Mock ei osannut tulkita saamiaan kellonaikoja. Korjaaminen vaatii aikaa ja menee ensi viikon palautuksen hommiksi.

## Miten ohjelma on edistynyt?

Ei näkyvää, paitsi nopeus on kasvanut hurjasti poistamalla järkyttävän purkkamallin prioriteettijonon ja korvaamalla sen suunnitellulla minimikeolla.

Hiontaa pellin alla algoritmin toimintaan mm. poistamalla mahdollisuuden hypätä bussin kyytiin pysäkiltä, joka on vain jättöpysäkki sekä poistamalla mahdollisuuden vaihtaa "lennosta" bussia - eli jos samalla kellon lyömällä lähtee kaksi bussia pysäkiltä, niin näistä ainoastaan käsitellään linja, jonka kyydissä jo valmiiksi ollaan.

## Mitä opin tällä viikolla / tänään?

Jos haluan saada minimikeosta muodostettua heapsortilla järjestyksen, joka on pienimmästä alkiosta suurimpaan, täytyy keko käyttää välillä maksimikekona ja tälle suorittaa maksimikeon heapsort.

Jest.mock('moduuli') täytyy kutsua ennen ensimmäisenkään moduulin importia. Tätä ennen piti tajuta, että testithän ei käytä mockia, vaan kutsuivat OTP-instanssia.

## Mikä jäi epäselväksi tai tuottanut vaikeuksia? Vastaa tähän kohtaan rehellisesti, koska saat tarvittaessa apua tämän kohdan perusteella.

Kaikki polttavimmat kysymykset ratkaisivat itse itsensä viikon aikana.

## Mitä teen seuraavaksi?

-   Korjaa Mock.
-   Suorituskykytestien toteuttaminen, sekä raportointi.
-   Selvitettävä miksi yksi kolmesta reitinhaun testistä tekee oudon linjan vaihdon, vaikka samalla linjalla voitaisiin jatkaa, etenkin kun linjalla jatketaan myöhemmin.
-   Repositoryn siivoamista. Viimeisten yksikkötestien tekemistä.
-   Jos aikaa jää, niin haetun reitin visualisoinnin parantamista.
-   Jos aikaa jää, niin reitinhaun viilaamista hylkäämällä kaikki yli viiden vaihdon reitit sekä lisäämällä mahdollisuuden tukea sellaisia pysäkkejä, jotka muodostuvat useammasta pysäkistä - tällä hetkellä esimerkiksi Tikkurilan matkakeskuksesta ei pysty reitittämään jatkoreittejä oikein, kun bussi saapuu terminaaliin, mutta tältä pysäkiltä ei lähdekään yhtään jatkoreittiä. Samasta syystä se ei osaa vaihtaa kulkuneuvosta toiseen (toki ei se osaa laskea niille oikeaa aika-arviotakaan heuristisen funktion ollessa kovakoodattu bussille...).

## Työajat

| SU  | MA  | TI  | KE  | TO  |  PE | LA  |
| --- | --- | --- | --- | --- | --- | --- |
| 0h  | 2 h |  0h | 1h  | 3h  | 4h  | 13h |
