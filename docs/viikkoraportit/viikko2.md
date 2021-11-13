# Viikkoraportti X

## Mitä olen tehnyt tällä viikolla?

Tonkinut Digitransitin API-väylää. GraphQL API tarjoaa todella paljon dataa, vain sen oikean löytäminen halutulla tavalla on oma haasteensa - kuinka saada dataa ulos niin, että se palvelee käyttötarkoitusta.

Aloittanut ohjelmakoodin kirjoittamisen ehkä huonolla tavalla, vähän useammalta eri nurkalta. Toisaalta se, että pystyn suorittamaan koodia kutsumalla HTTP endpointia selaimessa ja tarkastelemalla saatavaa JSON-tietoa sillä, ei ole yhtään huonompi ratkaisu lopulta, terminaalista on hiukan ikävää lukea GraphQL-apin tuloksia.

Docstring dokumentaatiota sekä testaamista aloitettu niiltä osin, kuin mikä on tämän hetkiseen edistymiseen nähden peilattuna järkevää ja kannattavaa.

## Miten ohjelma on edistynyt?

Ohjelma on toisaalta edistynyt, vaikka se ei koodillisesti näy - olen päässyt hahmottelemaan mielessä suunnitteluvalintoja, kuinka toteutan mitäkin toiminnallisuuksia syvemmin ajateltuna. Suunnitteluvalintojen ollessa selkiintyneitä, on helpompi lähteä rakentamaan itse ohjelmaa.

## Mitä opin tällä viikolla / tänään?

Docker voi toimia täysin eri tavoin riippuen suoritettavasta alustasta - se mikä toimii omalla Macilla, ei välttämättä toimikaan Github Actionseissa ajettaessa Ubuntun päällä (fuksiläppärillä puolestaan en törmännyt kokeillessani ongelmaan) - käyttöoikeudet kontin sisäiseen kansioon, joka on luotu samoilla oikeuksilla kuin millä yritetään ajaa kontissa ohjelmaa.

Tästä syystä Codecov ei osaa hakea testauskattavuutta vielä, kun CI-putki ei saa suoritettua itseään mystisesti konttiin kadonneen eslintin takia. Tämän tonkimiseen meni aikaa ehkä liikaakin, kun olisi jo aikaisemmassa vaiheessa voinut tehdä taikatempun ja olla ajamatta linttausta ja prettier tsekkausta kontissa, vaan tehdä sen kontin ulkopuolella Actioneissa - todo tulevalle viikolle.

## Mikä jäi epäselväksi tai tuottanut vaikeuksia? Vastaa tähän kohtaan rehellisesti, koska saat tarvittaessa apua tämän kohdan perusteella.

Tällä viikolla ei ole varsinaisia vaikeuksia, vaikka Docker-kontin sisäiset käyttöoikeudet aiheuttivat harmaita hiuksia ihan riittävästi.

## Mitä teen seuraavaksi?

Jatkan ketterin termein todettua MVP pystytystä - tavoite saada mahdollisimman nopeasti ensimmäinen versio valmiiksi, josta askel askeleelta lähteä korvaamaan palikoita tarkoituksenmukaisilla itse tehdyillä.

## Työajat

| SU  | MA  | TI  | KE  | TO  |  PE | LA  |
| --- | --- | --- | --- | --- | --- | --- |
| 7h  |  0h |  0h | 0h  | 4h  | 6h  | 6h  |
