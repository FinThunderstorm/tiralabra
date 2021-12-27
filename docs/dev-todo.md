Julkisen liikenteen keskinopeudet:

-   runkobussi 29 km/h (https://yle.fi/uutiset/3-9367000)
-   bussi 20-23 km/h, runkobussi 26-28 km/h (http://jlf.fi/f12/1209-bussi-jokeri/index32.html#post161012)
-   ratikka 14 km/h (https://www.helsinginuutiset.fi/paikalliset/1199214)
-   metro 44 km/h (http://jlf.fi/f29/3408-joukkoliikennevalineiden-keskinopeudet/) & (https://fi.wikipedia.org/wiki/Helsingin_metro)
-   juna 54 km/h (http://junakalusto.fi/fi/lahijunaliikenne)
-   suomenlinnan lautta ~9 solmua eli ~17km/h (https://turvallisuustutkinta.fi/material/attachments/otkes/tutkintaselostukset/fi/vesiliikenneonnettomuuksientutkinta/2016/UfLyPxJPF/M2016-02_Suomenlinnan_lautan_ja_purjeveneen_yhteentormays_Helsingissa_2.9.2016.pdf)

departures.departures PriorityQueueksi?

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

--uusia

28.12.2021 klo 1205 // 1640685900000
Rautatieasema - (H0302 / HSL:1020454)
Länsiterm. T1 - (H0235 / HSL:1203409)
Should be TRAM 7
-> testien vertailulopputulos ok

28.12.2021 klo 1205 // 1640685900000
Kumpulan kampus - (H0326 / HSL:1240419)
Erottaja - (H0802 / HSL:1040445)
Should be TRAM 6
-> testien vertailulopputulos ok

28.12.2021 klo 1205 // 1640685900000
Herttoniemi - (H0030 / HSL:1431602)
Kumpulan kampus - (H3029 / HSL:1240103)
Should be M2 -> Walk -> 56
-> testien vertailulopputulos ok

28.12.2021 klo 1200 // 1640685600000
Tikkurila - (V0618 / HSL:4610553)
Ilmalantori - (H2087 / HSL:1171180)
Should be R -> 23
-> testien vertailulopputulos ok

28.12.2021 klo 1210 // 1640686200000
Ruoholahti - (H0015 / HSL:1201601)
Kaivopuisto - (H0437 / HSL:1070418)
Should be M2 -> Walk -> TRAM 3
-> testien vertailulopputulos ok

28.12.2021 klo 1210 // 1640686200000
Matinkylä - (E0011 / HSL:2314601)
Koivusaarentie - (H1039 / HSL:1310119)
Should be M1 -> Walk -> 22B
-> testien vertailulopputulos ok
