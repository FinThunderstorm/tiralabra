# Määrittelydokumentti (TKT, suomi)

## Ohjelmointikieli

Projektissa on tarkoitus käyttää ohjelmointikielenä _Javascriptiä_ ajaen sitä _Docker_-kontissa. Vertaisarviointi onnistuu luonteviten JS, Python ja Java.

## Käytettävät algoritmit ja tietorakenteet

Projektissa on tarkoitus käyttää _A\*_-reitinhakualgoritmiä ja sen toteutukseen tarvitaan _prioriteettijono_-tietorakenne.

## Ratkaistava ongelma ja algoritmien sekä tietorakenteiden valinnan perustelut

Projektissa on tarkoitus toteuttaa reittiopas löytääkseni nopeimman reittiyhteyden käyttäen tausta-aineistona HSL:n tarjoamaa avointa aikatauludataa Digitransitin API:n kautta. Reittihaku on tarkoitus toteuttaa nopeimman reitin löytäminen ajan suhteen kahden pisteen väliltä.

Alunperin ajatus oli vertailla Djikstra vs. IDA\*. Kuitenkin sähköpostiviestien vaihdon yhteydessä liittyen ohjelmointikielivalintaan sain suosituksen _A\*_:n sopivuudesta tähän ongelmaan, ja sen pohjalta lähdin tutkimaan toteuttamista. Kun algoritmiksi valikoitui _A\*_, niin tietorakenteiden valinta pohjautui siihen. Djikstran algoritmiin pohjautuvana _A\*_ tarvitsee tietorakenteekseen _prioriteettijonon_.

A\*:n tehokkuus pohjautuu siihen, että verrattuna Djikstraan se ei tee niin paljoa etsimistyötä suhteessa mahdollisiin esteisiin ja ahneeseen paras-ensin hakuun ettei yritä tehdä reittiä, joka törmää esteeseen ja pituutta tulee sitä kautta lisää.

Sivujuonteena olen jo pitkään halunnut tutustua HSL:n tarjoamaan avoimeen aineistoon, ja sen tarjoamiin mahdollisuuksiin. Samalla pääsen ymmärtämään tarkemmin kuinka sovelluslogiikka Reittioppaan takana toimii.

## Ohjelman syötteet ja niiden käyttö

Ensimmäisessä vaiheessa reititys tapahtuu käyttäen lähtöpisteenä ja kohdepisteenä jotain joukkoliikenteen pysäkkiä (pysäkkikoodia), mutta lopputuotteen tavoitteena on toteuttaa lähtö- ja kohdeosoitteen perusteella. Näitä lähtö- ja kohdepisteitä käytetään reitin määrittämiseen.

## Tavoitteena olevat aika- ja tilavaativuudet (m.m. O-analyysit)

A\*-algoritmin osalta aikavaativuus on riippuvainen heurestisesta laskusta, mutta pahimmillaan se voi olla O(n^x), missä n solmujen määrä ja x lyhyimmän reitin pituus (Santoso et al, 2010). Optimitilanteessa se voi olla O(log h(x)), missä h on käytetty heuristinen funktio ja x tarkka reitin arvo. Tilavaatimus noudattelee aikavaativuuksia.

Prioriteettijonossa aikavaativuudet noudattelevat minimikeon aikavaatimuksia eli lisääminen ja poistaminen on O(log n) (Laaksonen, 2021). Tilavaatimus vastaa taulukon pituutta eli siellä olevien alkioiden määrää, O(n).

## Lähteet

- Laaksonen A, 2021, "Tietorakenteet ja algoritmit", luettu 6.11.2021. Saatavilla: [https://www.cs.helsinki.fi/u/ahslaaks/tirakirja/](https://www.cs.helsinki.fi/u/ahslaaks/tirakirja/)
- Santoso L, Setiawan A & Prajogo A, 2010, "Performance Analysis of Dijkstra, A\* and Ant Algorithm for Finding Optimal Path Case Study: Surabaya CityMap", luettu 6.11.2021. Saatavilla [http://fportfolio.petra.ac.id/user_files/04-021/MICEEI2010.pdf](http://fportfolio.petra.ac.id/user_files/04-021/MICEEI2010.pdf)
- Patel A, vuosi ei tiedossa, "Introduction to A\*", luettu 6.11.2021. Saatavilla: [http://theory.stanford.edu/~amitp/GameProgramming/AStarComparison.html](http://theory.stanford.edu/~amitp/GameProgramming/AStarComparison.html)
- Patel A, 2014, "Introduction to A\* Algorithm", luettu 6.11.2021. Saatavilla [https://www.redblobgames.com/pathfinding/a-star/introduction.html](https://www.redblobgames.com/pathfinding/a-star/introduction.html)
- Hart P, Nilsson N & Raphael B, 1968, "A Formal Basis for the Heuristic Determination of Minimum Cost Paths", luettu 6.11.2021. Saatavilla: [https://ieeexplore.ieee.org/document/4082128](https://ieeexplore.ieee.org/document/4082128) (alkuperäinen A\* paperi muistiin tutkittavaksi)
