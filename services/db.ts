import { Client, ClientPoints, Reward, Database, ClientType, OrderLog } from '../types';

const DB_KEY = 'gulf_prolub_db_v12'; // Incremented to v7 to add new rewards
const DEFAULT_POINTS = 0; 

const RAW_CLIENTS_CSV = `Tipo de cliente;Id;Punto de venta;Contraseña
Normal;3648;COLMENARES CELY MARIA DE JESUS;362
Normal;2288;TECNILUBRICANTES GYG S.A.S;167
Normal;2816;AGROFILTER LTDA;439
Normal;3415;SMART & GREEN ENERGY S.A.S.;402
Normal;7400;CARO CASTELBLANCO LUIS ALEJANDRO;178
Normal;9309;HUERTAS ORTEGA CESAR MANUEL;238
Normal;5663;JEREZ BUITRAGO JHON FREDY;223
Normal;3005;DACAR FILTROS S.A.S.;494
Normal;9643;PRIETO CARDENAS RONAL FABIAN;209
Normal;2744;ANAYA OLIVEROS DIANA FERNANDA;126
Normal;5489;FC POWER SOLUTIONS SAS;318
Normal;8915;SILVA VARGAS FABIO EDUARDO;126
Normal;7209;COMERCIALIZADORA FILT REP LTDA;463
Normal;2431;RIVAS MARTINEZ CARLOS EDUARDO;425
Normal;1358;MATALLANA BALLESTEROS MAURICIO ANTONIO;417
Normal;3886;DOSMOPAR SOCIEDAD POR ACCIONES SIMPLIFICADA;286
Normal;1533;MOLANO BARRIOS LAURA MELISSA;114
Normal;7869;GARCIA REYES GONZALO EDUARDO;179
Normal;1666;BERNAL PACHON GERMAN ALONSO;328
Normal;7882;LUBRISERVICIOS RETEN SUR S.A.S;350
Normal;2407;TECNI.MOTOS GL S.A.S.;284
Normal;7261;COMERCIALIZADORA INTERNACIONAL CALITRADE SOCIEDAD POR ACCIONES S;265
Normal;6100;AGROFILTRACIONES R.M. SAS;296
Normal;8254;FILTROS Y ACEITES SANTA MARTA S.A.S.;498
Normal;9279;GOMEZ RODRIGUEZ FERNANDO;376
Normal;3573;MELO OLMOS SERGIO ANDRES;442
Normal;3484;AMERICAN FILTERS OIL SAS;247
Normal;5373;ROZO MORA JORGE ALGEMIRO;297
Normal;8124;GRAND FILTERS EU;114
Normal;1370;CALDERON URREGO ANDRES ARTURO;313
Normal;4003;TECNIAUTOAMERICANA S.A.S.;388
Normal;9600;LUBRICANTES VALLADOLID S.A.S.;417
Normal;3582;COLOMBIANA DE ACEITES Y FILTROS INDUSTRIALES S.A.S;368
Normal;6150;ROJAS PEREZ JOSE ORLANDO;278
Normal;5306;BRAVO GRISALES LUZ DERLY;221
Normal;2444;PIRACOCA JIMENEZ HECTOR EMILIO;105
Normal;9766;GUALTEROS LOVERA FERNANDO;225
Normal;1561;MURCIA ALBORNOZ JUAN PABLO;137
Normal;6041;LUBRICANTES GARCIA NOPE SAS;156
Normal;5451;DONDE ALEJO LUBRICENTRO SAS;231
Normal;5102;CORO JORGE IVAN;344
Normal;5898;PAULO RICHARD RAMOS DAZA;257
Normal;9856;OSCAR FERNANDO PEÑA GUTIERREZ;446
Normal;1625;GOMEZ CERON ARCELINA MARGOTH;133
Normal;3861;SUAREZ OJEDA IVAN RICARDO;440
Normal;2618;RAMIREZ MIRQUEZ MOISES;149
Normal;5535;SILVA LOPEZ OSCAR IVAN;257
Normal;2253;HERNANDEZ SACRISTAN FABIAN ROLANDO;136
Normal;1968;SALINAS REYES GESLY YURANY;308
Normal;1621;BIOFILTER LTDA;174
Normal;4791;RODRIGUEZ PULIDO LUZ DARY;411
Normal;4290;QUINTANA RIASCOS JOSE FERNANDO;330
Normal;2335;MONTACARGAS EN SIBERIA S A S;351
Normal;4435;LUBRICANTES LA ROCA S.A.S;229
Normal;2720;DOCEL RAMIREZ JUAN CARLOS;210
Normal;1886;SANCHEZ PALACIO ANGEL HUMBERTO;443
Normal;4368;LUBRICANTES Y FILTROS LA SEXTA AVENIDA S.A.S.;163
Normal;9164;MASFILTER Y LUBRICANTES SAS;115
Normal;6783;DIRECCIONES HIDRAULICAS EL MONO SAS;317
Normal;1069;JARAMILLO QUINTERO JAIRO;474
Normal;1055;FIZA S A S;296
Normal;5963;VALLES ABELLO ARMANDO;208
Normal;3051;LUBRIMOTOR GRASAS Y ACEITES S.A.S LUBRIMOTOR S.A.S;260
Normal;1247;PEREZ BAUTISTA FRANCISCO ALEJANDRO;253
Normal;8989;GONZALEZ MATAMOROS MARIA DEL TRANSITO;441
Normal;8437;DISTRIBUIDORA DE FILTROS Y LUBRICANTES SR LTDA;104
Normal;7501;PARADA BEATRIZ;480
Normal;7247;GALARZA CARDONA ANDRES FELIPE;446
Normal;6276;RODRIGUEZ TROCHEZ ENELIA;175
Normal;1202;LUBRICENTRO SANTA ROSA SAS;364
Normal;8287;ALBERTO TORRES CARLOS ALFREDO;294
Normal;8658;DIAZ PINZON LUIS FERNANDO;296
Normal;4896;TRANSPORTES Y SERVICIOS INTEGRAL S.A.S;120
Normal;4658;ELECTRICOS Y FERRETERIA GERVEL & COMPAÑIA LTDA;193
Normal;3629;MERCADO RAMIREZ JHON WAYNER;454
Normal;6542;FILTROS Y LUBRICANTES H Y H SAS;148
Normal;8832;VILLANUEVA JAMIR;155
Normal;1922;S.S. UP INVERSIONES SAS;300
Normal;9997;G & O CAMBIO Y DISTRIBUCION DE ACEITE MONTALLANTAS SAS;174
Normal;2810;COMERCIALIZADORA FILT REP LTDA;189
Normal;7887;ESCOBAR CARDONA CESAR AUGUSTO;166
Normal;9054;HERNANDO RINCON CABRA;403
Normal;3330;CASA DEL FILTRO CHÍA S.A.S;430
Normal;3984;RINCON MORENO BRAYAN EDUARDO;477
Normal;7129;LUBRIMARKET FILTROS Y LUBRICANTES SAS;380
Normal;7515;AREVALO CABRA WILMER;489
Normal;9702;TRATERCOL INGENIERIA DE TRATAMIENTOS TERMICOS S.A.S.;395
Normal;8403;MORALES MARTINEZ LEIDY MARCELA;392
Normal;2884;REPRESENTANTE SEGURIDAD GAS S. A. S.;491
Normal;2589;GUERRERO DIAZ CARLOS AUGUSTO;302
Normal;1452;INDUSTRIAS CARDENAS FIRE SAS;435
Normal;6586;SALAS ROSERO EDITH LUCIA;197
Normal;2378;FERRETERIA INDUSTRIAL SOLUFER S.A.S.;282
Normal;6216;LINARES CABRA RUTH ADRIANA;395
Normal;2253;RODRIGUEZ PULIDO ANA BELISA;280
Normal;3795;ALVAREZ RUIZ LILIANA;295
Normal;8697;TECNOLUBES SAS;222
Normal;7064;CRUZ AVILA JOSE JOAQUIN;307
Normal;6295;ZAPATA GIRALDO MARTHA ROCIO;373
Normal;4343;CIFUENTES SABOGAL PLUTARCO;327
Normal;5266;MONTES GUILLERMO ALVARO JOSE;321
Normal;3497;CORTES SANCHEZ GUSTAVO ADOLFO;183
Normal;8886;PEREZ SEGURA JOSE EDUARDO;435
Normal;7761;CENTRO DE MANTENIMIENTO AUTOMOTRIZ RD S.A.S.;275
Normal;3616;COOPERATIVA DE TRANSPORTADORES FLOTA PALMIRA;105
Normal;9104;DISTRIGAUSDA SAS;349
Normal;5834;MOLINA TORRES NIDIA ESPERANZA;243
Normal;1462;RIGO AUTOS CALI S.A.S;165
Normal;4743;SERVITECA LUBRITECA 15 B S.A.S.;159
Normal;6132;MERLO VANEGAS FLOR CRISTINA;320
Normal;8399;CERON BUITRON PASTOR;133
Normal;9577;LYC LUBRICANTES SAS;292
Normal;3880;PRIETO CANTE CRISTIAN CAMILO;122
Normal;4854;LOPEZ DIAZ GUSTAVO;250
Normal;9881;HERNANDEZ ORTIZ LISSETTE;133
Normal;3978;ROJAS GUATUSMAL BRENDA JOHANA;122
Normal;2941;RIVERA BRAVA S.A.S.;321
Normal;4619;OCAMPO BARRAGAN YESMIN CRISTINA;361
Normal;3645;BECERRA LEON LUZ DARY;439
Normal;2456;TRIANA ROJAS ANA CLOVIS;392
Normal;3169;MUNDIAL DE FILTROS Y AUTOPARTESSAGA SAS;288
Normal;8975;BEJARANO RAMOS LUZ ANGELICA;277
Normal;9874;SERVICIOS INTEGRALES EN LUBRICACIÓN DE MAQUINARIA S.A.S.;481
Normal;5859;BAREÑO FRANCO ELVER RICARDO;496
Normal;5634;GUZMAN GOMEZ NESTOR DARIO;477
Normal;1276;NEWMAN´S CARS SAS;421
Normal;8593;SAAVEDRA GONZALEZ JHON JAIRO;337
Normal;3951;SU PROVEEDOR SUMINISTROS Y FERRETERIA S.A.S;378
Normal;2093;ARIESCA FILTROS & LUBRICANTES S.A.S;458
Normal;7655;DAZA GOMEZ JONATHAN SMITH;430
Normal;1644;RINCON RIVEROS ORLANDO;411
Normal;1139;GONZALEZ SALINAS JEIMMY CAROLINA;109
Normal;7395;HIDRAULICOS J R S A S;413
Normal;6673;AUTOPARTES J&M SUÁREZ S.A.S;335
Normal;3925;HC SERVICE ´S SAS;418
Normal;5440;FORTALEZA CENTRO DE LUBRICACION SAS;466
Normal;5378;ZAPATA GAMBINO WILSON JAVIER;417
Normal;9175;GOMEZ ESPITIA NELSON ARMANDO;451
Normal;6885;TRANSPORTES LIMICIO LTDA;161
Normal;1135;AGROFILTER DE LA SABANA SAS;194
Normal;3829;GUTIERREZ ROJAS JOHAN FELIPE;395
Normal;9771;LEON MOYANO JAVIER MAURICIO;373
Normal;2688;LUBRICANTES SAN ANTONIO SAS;305
Normal;9084;OCCIDENTAL DE SERVICIOS Y REPUESTOS AAA SAS;315
Normal;9493;GALEANO VELASQUEZ MARIA DACIER;145
Normal;4604;RAUL CASAÑAS PALACIOS;377
Normal;6131;FLOREZ VENEGAS JUAN CARLOS;398
Normal;8742;SIERRA MARTINEZ JOHN ALEJANDRO;460
Normal;9905;VILLAMIL MARTINEZ JONATHAN;495
Normal;5078;ABASTECEDORA NACIONAL DE ESTIBAS ANALDES S A;401
Normal;3026;HERNANDEZ NIÑO LEOPOLDO;387
Normal;4045;EDS TISQUESUSA S.A.S;412
Normal;3837;VARGAS VASQUEZ MARY LUZELLA;237
Normal;9146;MORALES GONZALEZ OCTAVIO;154
Normal;4337;PRADA EDWIN CAMILO;481
Normal;1480;TORNIFRENOS Y REPUESTOS OSORIO S.A.S.;248
Normal;3793;RODRIGUEZ QUIROGA JOSE ALEXANDER;197
Normal;1479;GUZMAN ROJAS JUAN SEBASTIAN;128
Normal;6714;RODRIGUEZ ROMERO TANIA MARCELA;171
Normal;3901;GOMEZ LEDESMA LUIS ARMANDO;356
Normal;2614;COLOMBIANA DISTRIBUIDORA DE LUBRICANTES SAS;121
Normal;4187;CRUZ OCHOA JULIO CESAR;394
Normal;7573;LUBRICANTES Y BATERIAS WILCARS SAS;134
Normal;2321;CAPERA LIDIA;221
Normal;2443;SALDARRIAGA & CIA LTDA;129
Normal;2991;CAICEDO CAÑON INGRID MADALAIN;178
Normal;9218;INSTITUTO TECNICO DE EDUCACION LABORAL Y MECANICO DE OCCIDENTE S;236
Normal;6403;GONZALEZ SUAREZ LUIS ALFREDO;435
Normal;1646;VISUM Y CIA LTDA;404
Normal;6401;TRUCK FILERS JM S.A.S;185
Normal;5581;QUINTERO KAREN ARABELLY;427
Normal;3488;NIÑO ZAPATA BRYANT ESTIVEN;143
Normal;6602;BOBCAT SERVICE SAS;214
Normal;2901;ARMERO MORALES SANDRA MILENA;210
Normal;4393;TIBAVISCO VELOZA SERGIO LEONARDO;336
Normal;9719;FILTROS AYZ S.A.S.;336
Normal;1211;PARRA GOMEZ SERGIO GIOVANY;324
Normal;9164;NEIRA LOPEZ LEONARDO MIGUEL;245
Normal;4480;NELCAR DE OCCIDENTE S.A.S;120
Normal;6361;VARGAS MARTINEZ ISMAEL ANTONIO;404
Normal;8314;CENTRO DE LUBRICACION AUTOMOTRIZ S.A.S.;375
Normal;7680;DIAZ MORENO OLGA PATRICIA;312
Normal;5630;TORRES MORALES PAOLA ANDREA;315
Normal;3115;BARRETO OCHOA ROBERT ALBERTO;347
Normal;3234;RODRIGUEZ SILVA JAZMIN LORENA;468
Normal;8959;BAQUERO LARA SILVIA NOHELBA;477
Normal;6465;NUÑEZ MONROY ARMANDO;281
Normal;4844;RODRIGUEZ BONILLA SORAIDA;452
Normal;3291;LUBRIMARKAS R&D S.A.S;211
Normal;5061;GARCIA MARTINEZ EDWIN ALEXANDER;402
Normal;2538;DAZA BARBOSA CRISTIAN CAMILO;352
Normal;5338;CUTA QUINTANA PEDRO ALONSO;153
Normal;2709;MONGUI MEDINA JUAN CARLOS;229
Normal;5984;SANCHEZ BARON MIGUEL ANTONIO;115
Normal;8790;CARDENAS LOPEZ VIVIANA ANDREA;282
Normal;7453;GUZMAN PINEDA YENIFFER;484
Normal;1398;ALONSO GONZALEZ GONZALEZ;414
Normal;2245;LOPEZ GONZALEZ LUIS FERNANDO;299
Normal;3397;PANQUEVA MONTOYA PATRICIO JAVIER;184
Normal;4998;RINCON MONTOYA NELSON ENRIQUE;427
Normal;1899;SANCHEZ AMAGUAÑA FABIAN JAIR;136
Normal;5812;MONTACARGAS HARD CARGO SAS;107
Normal;9261;MKTRONICA CAR SERVICE S.A.S;316
Normal;3827;SERRANO CELY VELKYS SARIMA;273
Normal;2520;AREVALO LOPEZ WALTER;395
Normal;9304;OPERADOR LOGISTICO DG S.A.S;421
Normal;9959;GUAYACAN GUEVARA ALBA INES;342
Normal;4546;VARGAS GONZALEZ LUIS NELSON;319
Normal;8115;SILVA BARBOSA BRIYITH NATALY;423
Normal;4963;CONTRERAS MORENO LUZ ANGELA;342
Normal;9699;TECNIPLANTAS AIRES Y BOMBAS SAS;137
Normal;8419;LOSADA VALLEJO NICXON ALEJANDRO;332
Normal;5145;MONTAÑO BAHAMON JULIAN DAVID;280
Normal;6365;GOMEZ SALAZAR JOHN EDGAR;127
Normal;8972;QUIROGA LEON RUTH NEYLA;406
Normal;5982;ESCOBAR FRANCO JORGE HERMINSUL;172
Normal;8032;GALINDO JULIO CESAR;203
Normal;5534;GOMEZ MESSA JULIAN;221
Normal;6735;GALEANO ALARCON MARCELA;268
Normal;6169;CARDENAS MUÑOZ FLOR DE MARIA;474
Normal;5726;MORENO CABALLERO NINA;286
Normal;2916;CASTRO PARADA HELMER ERNESTO;402
Normal;7844;LOSADA PACHON JOSE DANIEL;445
Normal;7095;ARAGON HENAO FERNANDO ANDRES;146
Normal;3527;ZAMORA VASQUEZ ELIECER;192
Normal;1417;CUEVAS RODRIGUEZ YESID ADRIAN;474
Normal;9031;LUBRIFILTROS MJ SAS;261
Normal;5549;UMAÑA MARTINEZ VICTOR SAMIR;309
Normal;9949;SERVICIOS AUTOMOTORES FLORIDA S.A.S.;387
Normal;8166;FERNANDEZ PAYA ROSO FRANCISCO;457
Normal;1094;NIETO SOLANO LIZETH PAOLA;261
Normal;7012;GONZALEZ SANNA ERICK;356
Normal;9608;BENAVIDES SIERRA DANIEL ANDRES;283
Normal;4532;AUTOVOL PROFESSIONAL S.A.S;493
Normal;5090;LUBRICANTES G.V. SAS;261
Normal;7795;MORENO CUCAITA JHON FREDDY;316
Normal;1766;QUIROGA PAEZ NORBEY ALBERTO;158
Normal;3289;AYALA BERNAL JOSE MESIAS;136
Normal;6776;SERVITECH GROUP SAS;232
Normal;9300;LOPEZ FORERO CRISTIAN CAMILO;127
Pareto;4781;LUBRICANTES LA ESTRELLA FACA S.A.S.;701
Pareto;2842;COOPERATIVA VALLECAUCANA DE TRANSPORTADORES;855
Pareto;7436;LUBRICANTES CZ S.A.S.;558
Pareto;3141;FILTROS Y FILTROS S.A.S.;800
Pareto;6102;GRISALES MESA EDWARD HERNAN;637
Pareto;6761;ROMERO BONILLA MARIN;535
Pareto;9598;DISTRIBUIDORA HERCA ASOCIADOS SAS;951
Pareto;5628;COOPERATIVA INTEGRAL DE TRANSPORTADORES TAXIS EL TRIUNFO;501
Pareto;5953;HOLGIN DIAZ ADALBERTO;822
Pareto;8458;WM FILTERS SAS;961
Pareto;9951;FILCENTER S A S;959
Pareto;5891;PRO-MOTORS S A S;740
Pareto;8677;PEREZ PLAZAS YILMER;538
Pareto;8170;LUBRIREPUESTOS YUMBO JRC S.A.S;723
Pareto;4397;RATIVA ORLANDO ALBERTO;795
Pareto;1142;TRACTOCAD S EN C S;777
Pareto;4517;AMAYA BERNAL VICTOR ANTONIO;930
Pareto;9097;GOMEZ CERON LUDIVIA;874
Pareto;2071;DISTRIBUCIONES ALVARO CORREA S.A.S.;747
Pareto;7832;LUBRICANTES PEPO S.A.S;697
Pareto;8143;INDUSTRIA SUPERFILT S.A.S;909
Pareto;7191;CERON OCHOA MAGNOLIA;912
Pareto;2133;LUBRICANTES Y FILTROS J J S.A.S;857
Pareto;9931;DISTRIBUIDORA IMALBESTOS SAS;823
Pareto;2822;LUBRIKARS S.A.S;604
Pareto;2799;VELASCO VEGA AURA STELLA;858
Pareto;2929;MAX OIL SAS;597
Pareto;5550;GASODISEL SABANA S.A.S;870
Pareto;2468;G C FILTERS SAS;530
Pareto;3793;GONZALEZ SALINAS EDWIN ARLEY;558
Pareto;6300;LUBRIPARTS LYL S.A.S;891
Pareto;6800;AUTOFILTROS Y PARTES GONZA MOTORS SAS;807
Pareto;4374;SERVILLANTAS JAMUNDI S.A.S;745
Pareto;4903;INGEFILTERS COLOMBIA SAS;885
Pareto;9808;HERRERA QUINTERO VICTOR ALONSO;684
Pareto;3237;LUBRICANTES DIDAMAR S.A.S;749
Pareto;3456;VARGAS SALAMANCA LUIS ANGEL;927
Pareto;9790;MARTEXA C I S A S;920
Pareto;7561;DACAR FILTROS S.A.S.;978
Pareto;6931;INVERSIONES BOGOTA MOTORS SAS;876
Pareto;9731;IBAÑEZ ALFONSO EFRAIN;821`;

const RAW_POINTS_CSV = `Punto de venta;Puntos disponibles
COLMENARES CELY MARIA DE JESUS;207
TECNILUBRICANTES GYG S.A.S;88
AGROFILTER LTDA;0
SMART & GREEN ENERGY S.A.S.;0
CARO CASTELBLANCO LUIS ALEJANDRO;73
HUERTAS ORTEGA CESAR MANUEL;101
JEREZ BUITRAGO JHON FREDY;70
DACAR FILTROS S.A.S.;114
PRIETO CARDENAS RONAL FABIAN;0
ANAYA OLIVEROS DIANA FERNANDA;0
FC POWER SOLUTIONS SAS;40
SILVA VARGAS FABIO EDUARDO;0
COMERCIALIZADORA FILT REP LTDA;54
RIVAS MARTINEZ CARLOS EDUARDO;34
MATALLANA BALLESTEROS MAURICIO ANTONIO;43,5
DOSMOPAR SOCIEDAD POR ACCIONES SIMPLIFICADA;0
MOLANO BARRIOS LAURA MELISSA;24
GARCIA REYES GONZALO EDUARDO;71
BERNAL PACHON GERMAN ALONSO;19
LUBRISERVICIOS RETEN SUR S.A.S;60
TECNI.MOTOS GL S.A.S.;0
COMERCIALIZADORA INTERNACIONAL CALITRADE SOCIEDAD POR ACCIONES S;0
AGROFILTRACIONES R.M. SAS;0
FILTROS Y ACEITES SANTA MARTA S.A.S.;60
GOMEZ RODRIGUEZ FERNANDO;0
MELO OLMOS SERGIO ANDRES;27
AMERICAN FILTERS OIL SAS;0
ROZO MORA JORGE ALGEMIRO;0
GRAND FILTERS EU;0
CALDERON URREGO ANDRES ARTURO;0
TECNIAUTOAMERICANA S.A.S.;0
LUBRICANTES VALLADOLID S.A.S.;0
COLOMBIANA DE ACEITES Y FILTROS INDUSTRIALES S.A.S;0
ROJAS PEREZ JOSE ORLANDO;0
BRAVO GRISALES LUZ DERLY;22,75
PIRACOCA JIMENEZ HECTOR EMILIO;0
GUALTEROS LOVERA FERNANDO;0
MURCIA ALBORNOZ JUAN PABLO;0
LUBRICANTES GARCIA NOPE SAS;58
DONDE ALEJO LUBRICENTRO SAS;0
CORO JORGE IVAN;19,17006
PAULO RICHARD RAMOS DAZA;0
OSCAR FERNANDO PE A GUTIERREZ;0
GOMEZ CERON ARCELINA MARGOTH;59
SUAREZ OJEDA IVAN RICARDO;55
RAMIREZ MIRQUEZ MOISES;7
SILVA LOPEZ OSCAR IVAN;0
HERNANDEZ SACRISTAN FABIAN ROLANDO;0
SALINAS REYES GESLY YURANY;0
BIOFILTER LTDA;10
RODRIGUEZ PULIDO LUZ DARY;0
QUINTANA RIASCOS JOSE FERNANDO;16
MONTACARGAS EN SIBERIA S A S;0
LUBRICANTES LA ROCA S.A.S;10
DOCEL RAMIREZ JUAN CARLOS;0
SANCHEZ PALACIO ANGEL HUMBERTO;0
LUBRICANTES Y FILTROS LA SEXTA AVENIDA S.A.S.;21
MASFILTER Y LUBRICANTES SAS;0
DIRECCIONES HIDRAULICAS EL MONO SAS;0
JARAMILLO QUINTERO JAIRO;7
FIZA S A S;0
VALLES ABELLO ARMANDO;0
LUBRIMOTOR GRASAS Y ACEITES S.A.S LUBRIMOTOR S.A.S;0
PEREZ BAUTISTA FRANCISCO ALEJANDRO;0
GONZALEZ MATAMOROS MARIA DEL TRANSITO;0
DISTRIBUIDORA DE FILTROS Y LUBRICANTES SR LTDA;0
PARADA BEATRIZ;0
GALARZA CARDONA ANDRES FELIPE;0
RODRIGUEZ TROCHEZ ENELIA;0
LUBRICENTRO SANTA ROSA SAS;0
ALBERTO TORRES CARLOS ALFREDO;20
DIAZ PINZON LUIS FERNANDO;13
TRANSPORTES Y SERVICIOS INTEGRAL S.A.S;0
ELECTRICOS Y FERRETERIA GERVEL & COMPA IA LTDA;0
MERCADO RAMIREZ JHON WAYNER;17
FILTROS Y LUBRICANTES H Y H SAS;22
VILLANUEVA JAMIR;31,02036
S.S. UP INVERSIONES SAS;0
G & O CAMBIO Y DISTRIBUCION DE ACEITE MONTALLANTAS SAS;0
COMERCIALIZADORA FILT REP LTDA;54
ESCOBAR CARDONA CESAR AUGUSTO;0
HERNANDO RINCON CABRA;4
CASA DEL FILTRO CH A S.A.S;0
RINCON MORENO BRAYAN EDUARDO;0
LUBRIMARKET FILTROS Y LUBRICANTES SAS;0
AREVALO CABRA WILMER;0
TRATERCOL INGENIERIA DE TRATAMIENTOS TERMICOS S.A.S.;0
MORALES MARTINEZ LEIDY MARCELA;0
REPRESENTANTE SEGURIDAD GAS S. A. S.;55
GUERRERO DIAZ CARLOS AUGUSTO;60
INDUSTRIAS CARDENAS FIRE SAS;0
SALAS ROSERO EDITH LUCIA;0
FERRETERIA INDUSTRIAL SOLUFER S.A.S.;0
LINARES CABRA RUTH ADRIANA;0
RODRIGUEZ PULIDO ANA BELISA;35
ALVAREZ RUIZ LILIANA;0
TECNOLUBES SAS;0
CRUZ AVILA JOSE JOAQUIN;0
ZAPATA GIRALDO MARTHA ROCIO;0
CIFUENTES SABOGAL PLUTARCO;24,5
MONTES GUILLERMO ALVARO JOSE;9,25
CORTES SANCHEZ GUSTAVO ADOLFO;0
PEREZ SEGURA JOSE EDUARDO;0
CENTRO DE MANTENIMIENTO AUTOMOTRIZ RD S.A.S.;0
COOPERATIVA DE TRANSPORTADORES FLOTA PALMIRA;0
DISTRIGAUSDA SAS;17
MOLINA TORRES NIDIA ESPERANZA;0
RIGO AUTOS CALI S.A.S;8
SERVITECA LUBRITECA 15 B S.A.S.;0
MERLO VANEGAS FLOR CRISTINA;0
CERON BUITRON PASTOR;0
LYC LUBRICANTES SAS;0
PRIETO CANTE CRISTIAN CAMILO;8
LOPEZ DIAZ GUSTAVO;0
HERNANDEZ ORTIZ LISSETTE;0
ROJAS GUATUSMAL BRENDA JOHANA;0
RIVERA BRAVA S.A.S.;0
OCAMPO BARRAGAN YESMIN CRISTINA;0
BECERRA LEON LUZ DARY;11
TRIANA ROJAS ANA CLOVIS;0
MUNDIAL DE FILTROS Y AUTOPARTESSAGA SAS;18
BEJARANO RAMOS LUZ ANGELICA;0
SERVICIOS INTEGRALES EN LUBRICACI N DE MAQUINARIA S.A.S.;0
BARE O FRANCO ELVER RICARDO;0
GUZMAN GOMEZ NESTOR DARIO;0
NEWMAN S CARS SAS;0
SAAVEDRA GONZALEZ JHON JAIRO;0
SU PROVEEDOR SUMINISTROS Y FERRETERIA S.A.S;0
ARIESCA FILTROS & LUBRICANTES S.A.S;0
DAZA GOMEZ JONATHAN SMITH;0
RINCON RIVEROS ORLANDO;0
GONZALEZ SALINAS JEIMMY CAROLINA;0
HIDRAULICOS J R S A S;22,89
AUTOPARTES J&M SU REZ S.A.S;0
HC SERVICE  S SAS;0
FORTALEZA CENTRO DE LUBRICACION SAS;0
ZAPATA GAMBINO WILSON JAVIER;5,17006
GOMEZ ESPITIA NELSON ARMANDO;0
TRANSPORTES LIMICIO LTDA;0
AGROFILTER DE LA SABANA SAS;0
GUTIERREZ ROJAS JOHAN FELIPE;0
LEON MOYANO JAVIER MAURICIO;55
LUBRICANTES SAN ANTONIO SAS;0
OCCIDENTAL DE SERVICIOS Y REPUESTOS AAA SAS;0
GALEANO VELASQUEZ MARIA DACIER;55
RAUL CASA AS PALACIOS;0
FLOREZ VENEGAS JUAN CARLOS;0
SIERRA MARTINEZ JOHN ALEJANDRO;0
VILLAMIL MARTINEZ JONATHAN;0
ABASTECEDORA NACIONAL DE ESTIBAS ANALDES S A;0
HERNANDEZ NI O LEOPOLDO;0
EDS TISQUESUSA S.A.S;0
VARGAS VASQUEZ MARY LUZELLA;0
MORALES GONZALEZ OCTAVIO;0
PRADA EDWIN CAMILO;0
TORNIFRENOS Y REPUESTOS OSORIO S.A.S.;0
RODRIGUEZ QUIROGA JOSE ALEXANDER;0
GUZMAN ROJAS JUAN SEBASTIAN;0
RODRIGUEZ ROMERO TANIA MARCELA;0
GOMEZ LEDESMA LUIS ARMANDO;0
COLOMBIANA DISTRIBUIDORA DE LUBRICANTES SAS;0
CRUZ OCHOA JULIO CESAR;0
LUBRICANTES Y BATERIAS WILCARS SAS;0
CAPERA LIDIA;0
SALDARRIAGA & CIA LTDA;0
CAICEDO CA ON INGRID MADALAIN;0
INSTITUTO TECNICO DE EDUCACION LABORAL Y MECANICO DE OCCIDENTE S;3
GONZALEZ SUAREZ LUIS ALFREDO;0
VISUM Y CIA LTDA;0
TRUCK FILERS JM S.A.S;13
QUINTERO KAREN ARABELLY;0
NI O ZAPATA BRYANT ESTIVEN;0
BOBCAT SERVICE SAS;46
ARMERO MORALES SANDRA MILENA;0
TIBAVISCO VELOZA SERGIO LEONARDO;14,51018
FILTROS AYZ S.A.S.;0
PARRA GOMEZ SERGIO GIOVANY;0
NEIRA LOPEZ LEONARDO MIGUEL;0
NELCAR DE OCCIDENTE S.A.S;4
VARGAS MARTINEZ ISMAEL ANTONIO;0
CENTRO DE LUBRICACION AUTOMOTRIZ S.A.S.;0
DIAZ MORENO OLGA PATRICIA;0
TORRES MORALES PAOLA ANDREA;0
BARRETO OCHOA ROBERT ALBERTO;0
RODRIGUEZ SILVA JAZMIN LORENA;0
BAQUERO LARA SILVIA NOHELBA;0
NU EZ MONROY ARMANDO;0
RODRIGUEZ BONILLA SORAIDA;0
LUBRIMARKAS R&D S.A.S;0
GARCIA MARTINEZ EDWIN ALEXANDER;0
DAZA BARBOSA CRISTIAN CAMILO;0
CUTA QUINTANA PEDRO ALONSO;0
MONGUI MEDINA JUAN CARLOS;0
SANCHEZ BARON MIGUEL ANTONIO;0
CARDENAS LOPEZ VIVIANA ANDREA;0
GUZMAN PINEDA YENIFFER;5,17006
ALONSO GONZALEZ GONZALEZ;0
LOPEZ GONZALEZ LUIS FERNANDO;0
PANQUEVA MONTOYA PATRICIO JAVIER;0
RINCON MONTOYA NELSON ENRIQUE;0
SANCHEZ AMAGUA A FABIAN JAIR;0
MONTACARGAS HARD CARGO SAS;0
MKTRONICA CAR SERVICE S.A.S;0
SERRANO CELY VELKYS SARIMA;0
AREVALO LOPEZ WALTER;0
OPERADOR LOGISTICO DG S.A.S;0
GUAYACAN GUEVARA ALBA INES;0
VARGAS GONZALEZ LUIS NELSON;0
SILVA BARBOSA BRIYITH NATALY;0
CONTRERAS MORENO LUZ ANGELA;0
TECNIPLANTAS AIRES Y BOMBAS SAS;0
LOSADA VALLEJO NICXON ALEJANDRO;0
MONTA O BAHAMON JULIAN DAVID;0
GOMEZ SALAZAR JOHN EDGAR;0
QUIROGA LEON RUTH NEYLA;0
ESCOBAR FRANCO JORGE HERMINSUL;0
GALINDO JULIO CESAR;0
GOMEZ MESSA JULIAN;0
GALEANO ALARCON MARCELA;0
CARDENAS MU OZ FLOR DE MARIA;0
MORENO CABALLERO NINA;0
CASTRO PARADA HELMER ERNESTO;0
LOSADA PACHON JOSE DANIEL;0
ARAGON HENAO FERNANDO ANDRES;0
ZAMORA VASQUEZ ELIECER;9
CUEVAS RODRIGUEZ YESID ADRIAN;0
LUBRIFILTROS MJ SAS;0
UMA A MARTINEZ VICTOR SAMIR;0
SERVICIOS AUTOMOTORES FLORIDA S.A.S.;4
FERNANDEZ PAYA ROSO FRANCISCO;0
NIETO SOLANO LIZETH PAOLA;5,17006
GONZALEZ SANNA ERICK;0
BENAVIDES SIERRA DANIEL ANDRES;0
AUTOVOL PROFESSIONAL S.A.S;0
LUBRICANTES G.V. SAS;0
MORENO CUCAITA JHON FREDDY;0
QUIROGA PAEZ NORBEY ALBERTO;0
AYALA BERNAL JOSE MESIAS;0
SERVITECH GROUP SAS;0
LOPEZ FORERO CRISTIAN CAMILO;0
LUBRICANTES LA ESTRELLA FACA S.A.S.;303
COOPERATIVA VALLECAUCANA DE TRANSPORTADORES;892
LUBRICANTES CZ S.A.S.;116,1003
FILTROS Y FILTROS S.A.S.;0
GRISALES MESA EDWARD HERNAN;0
ROMERO BONILLA MARIN;550
DISTRIBUIDORA HERCA ASOCIADOS SAS;0
COOPERATIVA INTEGRAL DE TRANSPORTADORES TAXIS EL TRIUNFO;195
HOLGIN DIAZ ADALBERTO;60
WM FILTERS SAS;843
FILCENTER S A S;696
PRO-MOTORS S A S;0
PEREZ PLAZAS YILMER;40
LUBRIREPUESTOS YUMBO JRC S.A.S;149,25
RATIVA ORLANDO ALBERTO;0
TRACTOCAD S EN C S;74
AMAYA BERNAL VICTOR ANTONIO;145
GOMEZ CERON LUDIVIA;166,8503
DISTRIBUCIONES ALVARO CORREA S.A.S.;0
LUBRICANTES PEPO S.A.S;139,34012
INDUSTRIA SUPERFILT S.A.S;0
CERON OCHOA MAGNOLIA;32,5
LUBRICANTES Y FILTROS J J S.A.S;69
DISTRIBUIDORA IMALBESTOS SAS;110
LUBRIKARS S.A.S;0
VELASCO VEGA AURA STELLA;0
MAX OIL SAS;55
GASODISEL SABANA S.A.S;4
G C FILTERS SAS;84
GONZALEZ SALINAS EDWIN ARLEY;0
LUBRIPARTS LYL S.A.S;155
AUTOFILTROS Y PARTES GONZA MOTORS SAS;46
SERVILLANTAS JAMUNDI S.A.S;23
INGEFILTERS COLOMBIA SAS;74
HERRERA QUINTERO VICTOR ALONSO;40
LUBRICANTES DIDAMAR S.A.S;0
VARGAS SALAMANCA LUIS ANGEL;0
MARTEXA C I S A S;0
DACAR FILTROS S.A.S.;114
INVERSIONES BOGOTA MOTORS SAS;275
IBA EZ ALFONSO EFRAIN;0`;

// Función para normalizar claves de búsqueda
const normalizeKey = (str: string) => {
  return str.toUpperCase().replace(/[^A-Z0-9]/g, '');
};

const parseDataFromCSVs = (): { clients: Client[], points: ClientPoints[] } => {
  const clientsLines = RAW_CLIENTS_CSV.trim().split('\n');
  const pointsLines = RAW_POINTS_CSV.trim().split('\n');
  
  const clients: Client[] = [];
  const pointsMap = new Map<string, number>();

  const pointsStart = pointsLines[0].startsWith('Punto de venta') ? 1 : 0;
  for (let i = pointsStart; i < pointsLines.length; i++) {
    const line = pointsLines[i].trim();
    if (!line) continue;
    const parts = line.split(';');
    if (parts.length >= 2) {
      const posName = parts[0].trim();
      const pts = parseInt(parts[1].trim()) || 0;
      pointsMap.set(normalizeKey(posName), pts);
    }
  }

  const clientsStart = clientsLines[0].startsWith('Tipo de cliente') ? 1 : 0;
  const points: ClientPoints[] = [];

  for (let i = clientsStart; i < clientsLines.length; i++) {
    const line = clientsLines[i].trim();
    if (!line) continue;
    
    const parts = line.split(';');
    if (parts.length >= 4) {
      const type = parts[0].trim() as ClientType;
      const businessId = parts[1].trim();
      const pointOfSale = parts[2].trim();
      const password = parts[3].trim();
      
      if (pointOfSale && password) {
        clients.push({
          id: `c_${i}`,
          businessId,
          pointOfSale,
          password,
          type
        });
        
        const normalizedPOS = normalizeKey(pointOfSale);
        const pts = pointsMap.get(normalizedPOS);

        points.push({
          pointOfSale,
          points: pts !== undefined ? pts : DEFAULT_POINTS
        });
      }
    }
  }
  return { clients, points };
};

const { clients: parsedClients, points: parsedPoints } = parseDataFromCSVs();

// Initial Seed Data
const INITIAL_DATA: Database = {
  clients: parsedClients,
  points: parsedPoints,
  rewards: [
  {
    "id": "rw_001",
    "name": "Camisetas COL",
    "description": "Póntela con orgullo, porque el partido también se juega con el corazón.\nVestirse de selección es parte del ritual.",
    "pointsPareto": 444,
    "pointsNormal": 222,
    "imageUrls": [
      "https://i.postimg.cc/QNp3mpDs/Camiseta-Seleccion-COL.avif"
    ],
    "category": "Ropa",
    "popularity": 90,
    "dateAdded": "2024-01-01"
  },
  {
    "id": "rw_002",
    "name": "Gorra GULF - Prolub",
    "description": "Porque el hincha se reconoce desde el primer sorbo y hasta el último minuto.\nPara vivir el partido como se debe",
    "pointsPareto": 17,
    "pointsNormal": 8,
    "imageUrls": [
      "https://i.postimg.cc/DzwhcvnQ/Gorra_Cerrada_gulf_prolub.png"
    ],
    "category": "Accesorios",
    "popularity": 70,
    "dateAdded": "2024-01-02"
  },
  {
    "id": "rw_003",
    "name": "Balón original Selección Colombia",
    "description": "El balón que despierta sueños, pasiones y recuerdos de Mundial.\nEmocional y aspiracional.",
    "pointsPareto": 256,
    "pointsNormal": 128,
    "imageUrls": [
      "https://i.postimg.cc/FRnFD78g/Balon-3.webp",
      "https://i.postimg.cc/sX0fwvqJ/Balon-4.webp",
      "https://i.postimg.cc/pT1Vqp4Z/Balon1.webp",
      "https://i.postimg.cc/85nktj9Z/Balon2.webp"
    ],
    "category": "Deportes",
    "popularity": 95,
    "dateAdded": "2024-01-03"
  },
  {
    "id": "rw_004",
    "name": "Sanduchera",
    "description": "Mientras rueda el balón, prepárate el sánduche del gol.\nTal cual tu idea, perfecta y muy memorable.",
    "pointsPareto": 144,
    "pointsNormal": 72,
    "imageUrls": [
      "https://i.postimg.cc/SQMjDGQJ/Sandwinch-1.webp",
      "https://i.postimg.cc/j2P52RkK/Sandwinch-2.webp",
      "https://i.postimg.cc/7P2bmNPb/Sandwinch-3.webp",
      "https://i.postimg.cc/L41hNV45/Sandwinch-4.webp"
    ],
    "category": "Hogar",
    "popularity": 50,
    "dateAdded": "2024-01-04"
  },
  {
    "id": "rw_006",
    "name": "Hielera",
    "description": "Que nada se caliente… ni el partido ni la bebida.\nMuy fútbol, muy reunión.",
    "pointsPareto": 63,
    "pointsNormal": 32,
    "imageUrls": [
      "https://i.postimg.cc/x1HzsXRS/Hielera.webp"
    ],
    "category": "Accesorios",
    "popularity": 65,
    "dateAdded": "2024-01-06"
  },
  {
    "id": "rw_007",
    "name": "Parlante Bluetooth",
    "description": "Que el grito de gol retumbe en cada rincón. Lleva la emoción del estadio a donde vayas.",
    "pointsPareto": 78,
    "pointsNormal": 39,
    "imageUrls": [
      "https://i.postimg.cc/MZPW3jvZ/Parlante.png"
    ],
    "category": "Tecnología",
    "popularity": 80,
    "dateAdded": "2024-01-07"
  },
  {
    "id": "rw_008",
    "name": "Barra de sonido",
    "description": "Escucha el cántico de la hinchada y el silbato del árbitro como si estuvieras allí.",
    "pointsPareto": 1507,
    "pointsNormal": 753,
    "imageUrls": [
      "https://i.postimg.cc/tCDb516f/Barra-de-sonido-1.webp",
      "https://i.postimg.cc/c4TWmK3z/Barra-de-sonido-2.webp",
      "https://i.postimg.cc/ncTxksmd/Barra-de-sonido-3.webp",
      "https://i.postimg.cc/J4K8qyX6/Barra-de-sonido-4.webp"
    ],
    "category": "Tecnología",
    "popularity": 85,
    "dateAdded": "2024-01-08"
  },
  {
    "id": "rw_009",
    "name": "Televisor 43\"",
    "description": "Vive cada partido como si estuvieras en la tribuna.\nPerfecta, directa y poderosa.",
    "pointsPareto": 1000,
    "pointsNormal": 500,
    "imageUrls": [
      "https://i.postimg.cc/BQ7yb2Dh/Tv-43-1.jpg",
      "https://i.postimg.cc/pXc7rK86/Tv-43-2.webp",
      "https://i.postimg.cc/pXc7rK8S/Tv-43-3.webp",
      "https://i.postimg.cc/jd392yNk/Tv-43-4.webp"
    ],
    "category": "Tecnología",
    "popularity": 90,
    "dateAdded": "2024-01-09"
  },
  {
    "id": "rw_010",
    "name": "Televisor 55” – Gran premio",
    "description": "El Mundial no se mira… se vive en grande.\nFrase estrella, muy aspiracional.",
    "pointsPareto": 1667,
    "pointsNormal": 833,
    "imageUrls": [
      "https://i.postimg.cc/CxfvKXwH/tv-55-1.webp",
      "https://i.postimg.cc/mgFdrJT3/tv-55-2.webp",
      "https://i.postimg.cc/Z5yfq2Jr/tv-55-3.webp",
      "https://i.postimg.cc/jSJ8jmRP/tv-55-4.webp"
    ],
    "category": "Tecnología",
    "popularity": 100,
    "dateAdded": "2024-01-10"
  },
  {
    "id": "rw_011",
    "name": "Camiseta Gulf MCO",
    "description": "Camiseta negra de algodón premium con diseño icónico de Gulf. Combina la herencia del motociclismo con la comodidad que necesitas para apoyar a tu equipo en este Mundial",
    "pointsPareto": 50,
    "pointsNormal": 25,
    "imageUrls": [
      "https://i.postimg.cc/wB7Pv76d/Camiste_moto_Model.png"
    ],
    "category": "Ropa",
    "popularity": 88,
    "dateAdded": "2024-01-11"
  },
  {
    "id": "rw_012",
    "name": "Camiseta Gulf PCMO",
    "description": "Vístete con los colores de la victoria. Ideal para alentar a tu equipo en cada partido del Mundial.",
    "pointsPareto": 50,
    "pointsNormal": 25,
    "imageUrls": [
      "https://i.postimg.cc/tgYfTY9K/Camiste_Carro_Model.png"
    ],
    "category": "Ropa",
    "popularity": 77,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_013",
    "name": "Licuadora 6 Velocidades",
    "description": "Prepara los mejores batidos y cócteles para celebrar cada victoria de tu selección.",
    "pointsPareto": 320,
    "pointsNormal": 160,
    "imageUrls": [
      "https://i.postimg.cc/t4wbb0K4/Gemini_Generated_Image_7q90b27q90b27q90.png' }"
    ],
    "category": "Electrodomésticos",
    "popularity": 60,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_014",
    "name": "Picatodo Negro",
    "description": "Pica los ingredientes para tus pasabocas tan rápido como un contragolpe letal.",
    "pointsPareto": 147,
    "pointsNormal": 73,
    "imageUrls": [
      "https://i.postimg.cc/qMS8yH1v/Gemini_Generated_Image_fn5hqtfn5hqtfn5h.png' }"
    ],
    "category": "Electrodomésticos",
    "popularity": 63,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_015",
    "name": "Freidora de aire 4 Litros",
    "description": "Snacks crujientes y saludables para el medio tiempo, sin perderte ni un segundo del partido.",
    "pointsPareto": 463,
    "pointsNormal": 231,
    "imageUrls": [
      "https://i.postimg.cc/wMJBmtpj/FREIDORA_AIRE.png' }"
    ],
    "category": "Electrodomésticos",
    "popularity": 62,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_016",
    "name": "Cafetera Eléctrica 12 Tazas He7031a Negro",
    "description": "Mantente despierto en todos los partidos, incluso en los de la madrugada. Energía para gritar gol.",
    "pointsPareto": 349,
    "pointsNormal": 175,
    "imageUrls": [
      "https://i.postimg.cc/HLMgsZmk/Gemini_Generated_Image_ps3dg1ps3dg1ps3d.png' }"
    ],
    "category": "Electrodomésticos",
    "popularity": 87,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_017",
    "name": "Olla Arrocera 1",
    "description": "El acompañamiento perfecto para el asado del domingo de fútbol. Rinde para toda la hinchada.",
    "pointsPareto": 213,
    "pointsNormal": 107,
    "imageUrls": [
      "https://i.postimg.cc/BQkxHfm4/Gemini_Generated_Image_kx16k9kx16k9kx16_(1).png' }"
    ],
    "category": "Electrodomésticos",
    "popularity": 54,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_018",
    "name": "Olla Eléctrica Multifunción",
    "description": "Prepara un banquete de campeones mientras disfrutas de la final del Mundial.",
    "pointsPareto": 533,
    "pointsNormal": 267,
    "imageUrls": [
      "https://i.postimg.cc/WzX9LHN7/Gemini_Generated_Image_vikqelvikqelvikq.png' }"
    ],
    "category": "Electrodomésticos",
    "popularity": 81,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_019",
    "name": "Sanduchera Panini",
    "description": "Sándwiches calientes y listos para el pitazo inicial. El mejor refuerzo para tu hambre.",
    "pointsPareto": 133,
    "pointsNormal": 66,
    "imageUrls": [
      "https://i.postimg.cc/wjNDk4rM/Gemini_Generated_Image_dgqorzdgqorzdgqo.png' }"
    ],
    "category": "Electrodomésticos",
    "popularity": 69,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_020",
    "name": "Sanduchera Eléctrica 2 Puestos",
    "description": "Doble porción para compartir con tu compañero de tribuna en casa.",
    "pointsPareto": 107,
    "pointsNormal": 53,
    "imageUrls": [
      "https://i.postimg.cc/GmDvjgfY/Gemini_Generated_Image_rdwum1rdwum1rdwu_(1).png' }"
    ],
    "category": "Electrodomésticos",
    "popularity": 71,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_021",
    "name": "Horno Electrico",
    "description": "Calienta tus snacks y mantén la temperatura del partido al máximo nivel.",
    "pointsPareto": 295,
    "pointsNormal": 147,
    "imageUrls": [
      "https://i.postimg.cc/jj01vsVJ/Gemini_Generated_Image_l69j03l69j03l69j.png' }"
    ],
    "category": "Electrodomésticos",
    "popularity": 80,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_022",
    "name": "Horno Microondas de Mesa",
    "description": "Comida lista en tiempo récord, para que no te pierdas ni una jugada de peligro.",
    "pointsPareto": 492,
    "pointsNormal": 246,
    "imageUrls": [
      "https://i.postimg.cc/PJJy4jqW/HORNO_MICROHONDAS_25LT.png' }"
    ],
    "category": "Electrodomésticos",
    "popularity": 83,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_023",
    "name": "Ventilador De Piso",
    "description": "Mantén la frescura cuando el partido se ponga candente en los últimos minutos.",
    "pointsPareto": 332,
    "pointsNormal": 166,
    "imageUrls": [
      "https://i.postimg.cc/8CvSPKGJ/Gemini_Generated_Image_yzmjqayzmjqayzmj.png' }"
    ],
    "category": "Electrodomésticos",
    "popularity": 51,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_024",
    "name": "Ventilador 3 en 1",
    "description": "Refresca el ambiente en la sala mientras tu equipo suda la camiseta en la cancha.",
    "pointsPareto": 267,
    "pointsNormal": 133,
    "imageUrls": [
      "https://i.postimg.cc/fbnP5w4b/Gemini_Generated_Image_plm36cplm36cplm3.png' }"
    ],
    "category": "Electrodomésticos",
    "popularity": 65,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_025",
    "name": "Plancha Para Ropa vertical",
    "description": "Tu camiseta de la selección siempre impecable, lista para salir a celebrar.",
    "pointsPareto": 244,
    "pointsNormal": 122,
    "imageUrls": [
      "https://i.postimg.cc/MG2LtWkR/Gemini_Generated_Image_h03fi0h03fi0h03f.png' }"
    ],
    "category": "Electrodomésticos",
    "popularity": 77,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_026",
    "name": "Plancha De Vapor Ligera",
    "description": "Elimina las arrugas de tu uniforme de hincha con la precisión de un tiro libre.",
    "pointsPareto": 147,
    "pointsNormal": 73,
    "imageUrls": [
      "https://i.postimg.cc/SN3WCbgQ/Gemini_Generated_Image_11h0pr11h0pr11h0.png' }"
    ],
    "category": "Electrodomésticos",
    "popularity": 74,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_027",
    "name": "Wafflera",
    "description": "Desayunos de campeones para los partidos mañaneros del Mundial.",
    "pointsPareto": 147,
    "pointsNormal": 73,
    "imageUrls": [
      "https://i.postimg.cc/Qxwp1Zfx/Gemini_Generated_Image_9c59889c59889c59.png' }"
    ],
    "category": "Electrodomésticos",
    "popularity": 81,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_028",
    "name": "Nevera Convencional 211 Litros Brutos",
    "description": "Mantén tus bebidas heladas para celebrar cada gol como se debe.",
    "pointsPareto": 1733,
    "pointsNormal": 867,
    "imageUrls": [
      "https://i.postimg.cc/fWKq9Jx1/Gemini_Generated_Image_8ptxku8ptxku8ptx.png' }"
    ],
    "category": "Electrodomésticos",
    "popularity": 76,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_029",
    "name": "Nevera No Frost 249 L",
    "description": "Espacio de sobra para las provisiones de toda la fase de grupos.",
    "pointsPareto": 2133,
    "pointsNormal": 1067,
    "imageUrls": [
      "https://i.postimg.cc/kMcYbBxY/Gemini_Generated_Image_6jmybw6jmybw6jmy.png' }"
    ],
    "category": "Electrodomésticos",
    "popularity": 51,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_030",
    "name": "Nevera No Frost 389 L",
    "description": "El estadio de tus bebidas. Capacidad gigante para la gran final.",
    "pointsPareto": 2533,
    "pointsNormal": 1267,
    "imageUrls": [
      "https://i.postimg.cc/sgskYBrH/NEVERA_NO_FROST_389_L.png' }"
    ],
    "category": "Electrodomésticos",
    "popularity": 63,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_031",
    "name": "Lavadora Carga Superior 15 kg",
    "description": "Lava las camisetas de toda la hinchada después de una celebración épica.",
    "pointsPareto": 3873,
    "pointsNormal": 1937,
    "imageUrls": [
      "https://i.postimg.cc/4yN55Q64/Gemini_Generated_Image_oabxktoabxktoabx.png' }"
    ],
    "category": "Electrodomésticos",
    "popularity": 66,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_032",
    "name": "Lavadora Carga Superior 11 kg (24lb)",
    "description": "Tu uniforme de la suerte siempre limpio y listo para el próximo encuentro.",
    "pointsPareto": 2444,
    "pointsNormal": 1222,
    "imageUrls": [
      "https://i.postimg.cc/SQr1MJWt/Gemini_Generated_Image_hpdidehpdidehpdi.png' }"
    ],
    "category": "Electrodomésticos",
    "popularity": 85,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_033",
    "name": "Sofá cama",
    "description": "El mejor asiento del estadio está en tu sala. Comodidad total para ver el Mundial.",
    "pointsPareto": 944,
    "pointsNormal": 472,
    "imageUrls": [
      "https://i.postimg.cc/2SBCyqwN/Captura-de-pantalla-2026-03-06-144427.jpg' }"
    ],
    "category": "Hogar",
    "popularity": 52,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_034",
    "name": "Juego de comedor 6 puestos",
    "description": "Reúne a tu equipo titular para disfrutar de una buena comida antes del partido.",
    "pointsPareto": 1111,
    "pointsNormal": 556,
    "imageUrls": [
      "https://i.postimg.cc/2j1SPKg0/comedor_6_puestos.png' }"
    ],
    "category": "Hogar",
    "popularity": 86,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_035",
    "name": "Juego de vajilla 4 puestos",
    "description": "Sirve la pasión del fútbol en cada comida con tu familia.",
    "pointsPareto": 133,
    "pointsNormal": 67,
    "imageUrls": [
      "https://i.postimg.cc/ZKPBH1rs/Vajilla_4_puestos.png' }"
    ],
    "category": "Hogar",
    "popularity": 87,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_036",
    "name": "Batería de ollas",
    "description": "Equipa tu cocina como un verdadero director técnico prepara su estrategia.",
    "pointsPareto": 267,
    "pointsNormal": 133,
    "imageUrls": [
      "https://i.postimg.cc/h4XtH5Nz/BATERIA_DE_OLLAS.png' }"
    ],
    "category": "Electrodomésticos",
    "popularity": 63,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_037",
    "name": "Reloj Garmin Vivoactive 5 Marfil",
    "description": "Mide tus pulsaciones en la tanda de penales y controla tu rendimiento como un profesional.",
    "pointsPareto": 2132,
    "pointsNormal": 1066,
    "imageUrls": [
      "https://i.postimg.cc/CL4PRTHs/Garmin_vivoactive_5.png' }"
    ],
    "category": "Tecnología",
    "popularity": 68,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_038",
    "name": "Televisor Challenger 32” LED",
    "description": "No te pierdas ningún detalle del partido desde la comodidad de tu cuarto.",
    "pointsPareto": 949,
    "pointsNormal": 475,
    "imageUrls": [
      "https://i.postimg.cc/zvv7jrf0/TELEVISOR_SAMSUNG_50_LED_UHD.png' }"
    ],
    "category": "Tecnología",
    "popularity": 71,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_039",
    "name": "Televisor 40” LED UHD 4K",
    "description": "Resolución de campeonato para ver cada jugada polémica con claridad.",
    "pointsPareto": 2000,
    "pointsNormal": 1000,
    "imageUrls": [
      "https://i.postimg.cc/76mX06qt/FREIDOREA_6L_DIGITAL_OSTER.png' }"
    ],
    "category": "Tecnología",
    "popularity": 77,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_040",
    "name": "Televisor 43” LED UHD 4K",
    "description": "Siente que estás en el estadio con colores vivos y definición de primera.",
    "pointsPareto": 2667,
    "pointsNormal": 1333,
    "imageUrls": [
      "https://i.postimg.cc/2SrsQqDM/TELEVISOR_SAMSUNG_65_LED_UHD_4K.png' }"
    ],
    "category": "Tecnología",
    "popularity": 88,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_041",
    "name": "Televisor 50” LED UHD 4K",
    "description": "Una pantalla gigante para vivir la emoción del Mundial en tamaño real.",
    "pointsPareto": 3467,
    "pointsNormal": 1733,
    "imageUrls": [
      "https://i.postimg.cc/2SrsQqDM/TELEVISOR_SAMSUNG_65_LED_UHD_4K.png' }"
    ],
    "category": "Tecnología",
    "popularity": 52,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_042",
    "name": "Televisor 65” LED UHD 4K",
    "description": "El estadio en tu sala. La experiencia definitiva para la final del mundo.",
    "pointsPareto": 4444,
    "pointsNormal": 2222,
    "imageUrls": [
      "https://i.postimg.cc/2SrsQqDM/TELEVISOR_SAMSUNG_65_LED_UHD_4K.png' }"
    ],
    "category": "Tecnología",
    "popularity": 89,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_043",
    "name": "Barra de sonido",
    "description": "Barra de sonido",
    "pointsPareto": 133,
    "pointsNormal": 67,
    "imageUrls": [
      "https://i.postimg.cc/Wb7WdL6Z/Barra_de_sonido_500.png' }"
    ],
    "category": "Tecnología",
    "popularity": 54,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_044",
    "name": "Parlante Clip 5 JBL",
    "description": "Lleva la fiesta del fútbol a cualquier parte. Pequeño pero con potencia de goleador.",
    "pointsPareto": 378,
    "pointsNormal": 189,
    "imageUrls": [
      "https://i.postimg.cc/fR0zwyZK/parlante_JBL.png' }"
    ],
    "category": "Tecnología",
    "popularity": 60,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_045",
    "name": "Parlante K-SPK300D Negro",
    "description": "Potencia de estadio para que tus celebraciones se escuchen en todo el barrio.",
    "pointsPareto": 1107,
    "pointsNormal": 553,
    "imageUrls": [
      "https://i.postimg.cc/Dwbv20nk/Parlante_torre.png' }"
    ],
    "category": "Tecnología",
    "popularity": 55,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_046",
    "name": "Audífonos Deportivos Inalámbricos Bluetooth 5.3",
    "description": "Concéntrate en el partido o en tu entrenamiento con la mejor tecnología.",
    "pointsPareto": 133,
    "pointsNormal": 67,
    "imageUrls": [
      "https://i.postimg.cc/ZRksrQKK/Captura-de-pantalla-2026-02-19-205312.png' }"
    ],
    "category": "Tecnología",
    "popularity": 76,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_047",
    "name": "Audífonos Diadema Bluetooth con SD y Radio",
    "description": "Sintoniza los partidos en la radio y no te pierdas ni un minuto de la acción.",
    "pointsPareto": 133,
    "pointsNormal": 67,
    "imageUrls": [
      "https://i.postimg.cc/MTR4NSrD/Gemini_Generated_Image_b7pr7wb7pr7wb7pr.png' }"
    ],
    "category": "Tecnología",
    "popularity": 54,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_048",
    "name": "Audífonos de diadema JBL Bluetooth",
    "description": "Aíslate del ruido y vive la narración del partido con calidad de estudio.",
    "pointsPareto": 377,
    "pointsNormal": 188,
    "imageUrls": [
      "https://i.postimg.cc/7ZpL77mb/audifonos_bluetooh.png' }"
    ],
    "category": "Tecnología",
    "popularity": 74,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_049",
    "name": "Mini Proyector WiFi y Bluetooth - Resolución nativa 1080P",
    "description": "Proyecta el partido en la pared y convierte tu casa en una fan zone.",
    "pointsPareto": 389,
    "pointsNormal": 194,
    "imageUrls": [
      "https://i.postimg.cc/kMLg9ydj/VIDEO_PROYECTOR.png' }"
    ],
    "category": "Tecnología",
    "popularity": 69,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_050",
    "name": "Amazon Alexa",
    "description": "Pídele a Alexa los resultados del Mundial y controla tu casa inteligente sin soltar la cerveza.",
    "pointsPareto": 400,
    "pointsNormal": 200,
    "imageUrls": [
      "https://i.postimg.cc/g082KJTX/Alexa_bluetooh.png' }"
    ],
    "category": "Tecnología",
    "popularity": 57,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_051",
    "name": "Aspiradora Robot",
    "description": "Que ella limpie la sala mientras tú no despegas los ojos del televisor.",
    "pointsPareto": 980,
    "pointsNormal": 490,
    "imageUrls": [
      "https://i.postimg.cc/ZRVjpRJF/APIRADORA_ROBOTSMART_ESTACIÓN_TP_LINK_TAPO_RV_20_MAX_PLUS.png' }"
    ],
    "category": "Electrodomésticos",
    "popularity": 82,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_052",
    "name": "Patineta eléctrica Xiaomi Scooter 5 Max",
    "description": "Llega a tiempo para el pitazo inicial, esquivando el tráfico como un crack.",
    "pointsPareto": 3667,
    "pointsNormal": 1833,
    "imageUrls": [
      "https://i.postimg.cc/5Ndg6WXq/Captura-de-pantalla-2026-02-23-080440.png' }"
    ],
    "category": "Deportes",
    "popularity": 85,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_053",
    "name": "Bicicleta Eléctrica 35kmh",
    "description": "Muévete por la ciudad con la velocidad de un extremo por la banda.",
    "pointsPareto": 3222,
    "pointsNormal": 1611,
    "imageUrls": [
      "https://i.postimg.cc/CMRxWQ9n/BICICLETA_ELECTRICA_PINGUI.png' }"
    ],
    "category": "Deportes",
    "popularity": 89,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_054",
    "name": "Portátil HP 14”",
    "description": "Sigue las estadísticas del Mundial y trabaja sin perder el ritmo.",
    "pointsPareto": 2199,
    "pointsNormal": 1099,
    "imageUrls": [
      "https://i.postimg.cc/ZKL7WtFp/computador_inter_14.png' }"
    ],
    "category": "Tecnología",
    "popularity": 51,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_055",
    "name": "Tablet SAMSUNG",
    "description": "Lleva el partido a cualquier habitación de la casa. Tu segunda pantalla ideal.",
    "pointsPareto": 2133,
    "pointsNormal": 1067,
    "imageUrls": [
      "https://i.postimg.cc/J43Dx9b6/table_samsung.png' }"
    ],
    "category": "Tecnología",
    "popularity": 53,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_056",
    "name": "Tablet Lenovo",
    "description": "Analiza las jugadas y revisa el VAR desde la palma de tu mano.",
    "pointsPareto": 1333,
    "pointsNormal": 667,
    "imageUrls": [
      "https://i.postimg.cc/jjDvDHbY/Captura-de-pantalla-2026-02-23-083618.png' }"
    ],
    "category": "Tecnología",
    "popularity": 50,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_057",
    "name": "Samsung Galaxy A16 · 256 GB · 8 GB RAM",
    "description": "Captura los mejores momentos de tus celebraciones con calidad de primera.",
    "pointsPareto": 1200,
    "pointsNormal": 600,
    "imageUrls": [
      "https://i.postimg.cc/90jQRHrP/a16.png }"
    ],
    "category": "Tecnología",
    "popularity": 50,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_058",
    "name": "Samsung Galaxy A36 · 256 GB · 8 GB RAM",
    "description": "Rendimiento de alto nivel para seguir el Mundial en tus redes sociales.",
    "pointsPareto": 1667,
    "pointsNormal": 833,
    "imageUrls": [
      "https://i.postimg.cc/ydRN88Yn/a36.png"
    ],
    "category": "Tecnología",
    "popularity": 58,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_059",
    "name": "iPhone 13 · 128 GB",
    "description": "Graba tus reacciones a los goles con la mejor cámara del mercado.",
    "pointsPareto": 4000,
    "pointsNormal": 2000,
    "imageUrls": [
      "https://i.postimg.cc/rz6dGZQ5/iphone_13.png"
    ],
    "category": "Tecnología",
    "popularity": 51,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_060",
    "name": "iPhone 15 · 128 GB",
    "description": "Tecnología de punta para el hincha más exigente. Sigue el Mundial con estilo.",
    "pointsPareto": 5067,
    "pointsNormal": 2533,
    "imageUrls": [
      "https://i.postimg.cc/CdyZCrmD/iphone_15.png"
    ],
    "category": "Tecnología",
    "popularity": 70,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_061",
    "name": "Celular SAMSUNG Galaxy A17 256 GB 8 GB RAM Azul",
    "description": "Un equipo titular en tu bolsillo. Batería para todo el día de partidos.",
    "pointsPareto": 1333,
    "pointsNormal": 667,
    "imageUrls": [
      "https://i.postimg.cc/Y9FSCCqX/a17.png"
    ],
    "category": "Tecnología",
    "popularity": 81,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_062",
    "name": "Celular MOTOROLA G55",
    "description": "Conectividad rápida para que no te pierdas ninguna notificación de gol.",
    "pointsPareto": 1333,
    "pointsNormal": 667,
    "imageUrls": [
      "https://i.postimg.cc/qqdvhHz8/g55.png"
    ],
    "category": "Tecnología",
    "popularity": 64,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_063",
    "name": "Celular MOTOROLA G56 5G 256 GB 8 GB RAM Azul Marino",
    "description": "Velocidad 5G para ver los partidos en streaming sin interrupciones.",
    "pointsPareto": 1444,
    "pointsNormal": 722,
    "imageUrls": [
      "https://i.postimg.cc/K4XK7pJB/g56.png"
    ],
    "category": "Tecnología",
    "popularity": 74,
    "dateAdded": "2026-03-12"
  },
  {
    "id": "rw_064",
    "name": "Ahumador y Asador de Barril Mediano 20 Lbs",
    "description": "El MVP del tercer tiempo. Prepara los mejores asados para celebrar con tu hinchada.",
    "pointsPareto": 667,
    "pointsNormal": 333,
    "imageUrls": [
      "https://i.postimg.cc/vZTNpPzv/Captura-de-pantalla-2026-02-23-120541.png"
    ],
    "category": "Hogar",
    "popularity": 56,
    "dateAdded": "2026-03-12"
  }
],
  orders: []
};

// Helper to load/save from localStorage
export const getDatabase = (): Database => {
  const stored = localStorage.getItem(DB_KEY);
  if (!stored) {
    localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  const db = JSON.parse(stored);
  // Ensure orders array exists if migrating from old DB version
  if (!db.orders) {
      db.orders = [];
  }
  return db;
};

export const saveDatabase = (data: Database) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

export const resetDatabase = (): Database => {
  localStorage.removeItem(DB_KEY);
  return getDatabase();
};

export const updateClientPoints = (pointOfSale: string, newPoints: number) => {
  const db = getDatabase();
  const index = db.points.findIndex(p => p.pointOfSale === pointOfSale);
  if (index !== -1) {
    db.points[index].points = newPoints;
    saveDatabase(db);
  }
};

export const deductPoints = (pointOfSale: string, amount: number): boolean => {
  const db = getDatabase();
  const clientPoints = db.points.find(p => p.pointOfSale === pointOfSale);
  
  if (clientPoints && clientPoints.points >= amount) {
    clientPoints.points -= amount;
    saveDatabase(db);
    return true;
  }
  return false;
};

export const addOrder = (order: OrderLog) => {
    const db = getDatabase();
    if (!db.orders) db.orders = [];
    db.orders.push(order);
    saveDatabase(db);
};

export const getClients = () => getDatabase().clients;
export const getPoints = (pointOfSale: string) => getDatabase().points.find(p => p.pointOfSale === pointOfSale)?.points || 0;
export const getRewards = () => getDatabase().rewards;
export const getOrders = () => getDatabase().orders;