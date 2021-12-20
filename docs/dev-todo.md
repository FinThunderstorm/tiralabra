Julkisen liikenteen keskinopeudet:

-   runkobussi 29 km/h (https://yle.fi/uutiset/3-9367000)
-   bussi 20-23 km/h, runkobussi 26-28 km/h (http://jlf.fi/f12/1209-bussi-jokeri/index32.html#post161012)
-   ratikka 14 km/h (https://www.helsinginuutiset.fi/paikalliset/1199214)
-   metro 44 km/h (http://jlf.fi/f29/3408-joukkoliikennevalineiden-keskinopeudet/) & (https://fi.wikipedia.org/wiki/Helsingin_metro)
-   juna 54 km/h (http://junakalusto.fi/fi/lahijunaliikenne)

selvitä how to prevent return of value as promise, wait for promise to resolve before return

https://www.colourlovers.com/palette/56122/Sweet_Lolly väriteema

docker run --name otp-hsl -p 9080:8080 -e ROUTER_NAME=hsl -e JAVA_OPTS=-Xmx5g -e ROUTER_DATA_CONTAINER_URL=https://api.digitransit.fi/routing-data/v2/hsl hsldevcom/opentripplanner:prod
Tällä pyörimään oma OTP Hösselistä, niin ei tarvitse prodia sekottaa. ![Vinkki täältä.](https://digitransit.fi/en/developers/architecture/x-apis/1-routing-api/)

Hylkää jos linja vaihtuu pysäkin ja pysäkin jälkeen
departures.departures PriorityQueueksi.

ke 15.12.2021 klo 1215 ->
startStop: HSL:4620205 (Urheilutie V6205)
endStop: HSL:1240118 (Kumpulan kampus H3028)
uStartTime: 1639563300000
HSL: 711 (vain bussi, vältä kävelyä)
-> testien vertailulopputulos ok

ke 15.12.2021 klo 1305 ->
startStop: HSL:9650105 (Kievari Tu6041)
endStop: HSL:4510255 (Osuustie V5155)
uStartTime: 1639566300000
HSL: 641 -> 574 (vain bussi, vältä kävelyä)
-> testien vertailulopputulos ok

ke 15.12.2021 klo 1305 ->
startStop: HSL:1361108 (Maaherrantie H3076)
endStop: HSL:1150110 (Haartmaninkatu H1322)
uStartTime: 1639566300000
HSL: 57 -> 30 (tarjoaa seuraavalle lähdölle tätä, ei algoritmin löytämäle tarjoamalle versiolle)
-> testien vertailulopputulos ok

ke 15.12.2021 klo 1300 ->
startStop: HSL:1431187 (Herttoniemi (M) H4006)
endStop: HSL:1304161 (Munkkivuoren ostosk. H1432)
uStartTime: 1639566000000
HSL: 500
-> testien vertailulopputulos ok

---

ma 6.12.2021 klo 1200 ->
startStop: HSL:9650105 (Kievari Tu6041)
endStop: HSL:1240118 (Kumpulan kampus H3028)
uStartTime: 1638784800000
HSL: 641 -> 711 (vain bussi, vältä kävelyä)
HOX! V6106 jälkeen HSL vaihtaa suoraan 711 pysäkiltä V6148 -> niin kauan kun algoritmi ei saa "STATION"-tyyppiselle pysäkkikokonaisuudelle kaikkien sen pysäkkien tietoja, ei ole relevantti.

ma 6.12.2021 klo 1200 ->
startStop: HSL:1495151 (Kutteritie H4104)
endStop: HSL:1201127 (Wavulintie H1081)
uStartTime: 1638784800000
HSL: 86 -> 500 -> 69 -> 21 (vain bussi, vältä kävelyä)
HOX! Ei toimi niin kauan, kun 'STATION' kokonaisuudesta ei osata hakea jatkoyhteyksiä

suorituskykytesti-mallia ultimate :D Hösselikin laski aikansa tätä :D
ma 6.12.2021 klo 1200 ->
startStop: HSL:9620109 (Kellokoski Tu6201)
endStop: HSL:6100206 (Upinniemen koulu Ki1006)
HSL laskee 665K -> 641 -> 717 => 192V => 173 (ilman kävelyn välttämistä ei löydy reittiä vain busseilla)

lisää linjan todellinen lähtöaika (siis jos haetaan 1200, niin matka alkaa vasta 1206 tms bussin lähtiessä)
lisää moneltako lähdettiin edelliseltä pysäkiltä matkaamaan kohti tarkasteltavaa pysäkkiä
lisää vaihtojen määrä, hylkää jos vaihtojen määrä ylittää 5 (6 ->)
