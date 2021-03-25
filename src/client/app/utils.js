function template(name, data) {
  var source = $('script#' + name + '-template').text().trim();
  return $(Handlebars.compile(source)(data));
}

function render(Component, props = {}) {
  var $component = Component(props);
  return $component;
}

function view(name) {
  $('.view').removeClass('active');
  $(`#${name}-view`).addClass('active');
  $(`[data-view="${name}"]`).addClass('active');
}

function capitalize(str) {
  if (str) {
    return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
  }
}

function block(description, callback) {
  $('body').addClass('busy');
  const currentDescription = $('.status').text();
  $('.status').text(description);
  callback(function unblock() {
    $('.status').text(currentDescription);
    $('body').removeClass('busy');
  });
}

function currency(amount, color) {
  if (!amount) {
    return 0;
  }

  return (new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount));

  // const result = (new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount));

  // return '<span style="color:red">' + result.split(' ')[0] + '</span> ' + result.split(' ')[1];
}

function totalex(items, x) {
  let total = 0;
  _.each(items, function (item) {
    total += (item[x] || 0);
  });
  return total;
}

function locale(str) {
  switch (str) {
    case 'paid':
      return 'pagado';
      break;
    case 'overpaid':
      return 'sobrepagado';
      break;
    case 'pending':
      return 'pendiente';
      break;
    case 'overdue':
      return 'vencido';
      break;

    default:
      break;
  }
  return str;
}

function monthToString(month) {
  return capitalize(moment(month).format('MMMM YYYY'));
}

function sublineToString(sublineCode) {
  const sublines = [
    {
      "code": "J0101",
      "name": "TERNOS"
    },
    {
      "code": "J0102",
      "name": "SACO Y PANTALON VESTIR"
    },
    {
      "code": "J0104",
      "name": "BOTTOMS SPORT"
    },
    {
      "code": "J0105",
      "name": "TOPS SPORT"
    },
    {
      "code": "J0106",
      "name": "CHOMPAS, POLAR Y POLERON"
    },
    {
      "code": "J0107",
      "name": "CASACAS \/ CHALECOS SPORT"
    },
    {
      "code": "J0108",
      "name": "CAMISERÍA VESTIR"
    },
    {
      "code": "J0109",
      "name": "ACCESORIOS HOMBRE"
    },
    {
      "code": "J0110",
      "name": "ROPA INTERIOR"
    },
    {
      "code": "J0111",
      "name": "PROMOCIONES"
    },
    {
      "code": "J0103",
      "name": "ABRIGOS VESTIR"
    },
    {
      "code": "J0201",
      "name": "JEANS JUVENIL HOMBRES"
    },
    {
      "code": "J0202",
      "name": "BOTTOMS JUVENIL HOMBRES"
    },
    {
      "code": "J0203",
      "name": "TOPS JUVENIL HOMBRES"
    },
    {
      "code": "J0204",
      "name": "CHOMPAS Y POLERONES JUVENIL HOMBRES"
    },
    {
      "code": "J0205",
      "name": "OUTERWEAR JUVENIL HOMBRES"
    },
    {
      "code": "J0206",
      "name": "ACCESORIOS JUVENIL HOMBRES"
    },
    {
      "code": "J0207",
      "name": "PROMOCIONES Y CONCESIONES JUV HOMBRE"
    },
    {
      "code": "J0301",
      "name": "VESTUARIO DEPORTIVO HOMBRE"
    },
    {
      "code": "J0302",
      "name": "VESTUARIO DEPORTIVO MUJER"
    },
    {
      "code": "J0303",
      "name": "ACCESORIOS VESTUARIO DEPORTIVO"
    },
    {
      "code": "J0304",
      "name": "FUTBOL"
    },
    {
      "code": "J0305",
      "name": "CICLISMO"
    },
    {
      "code": "J0306",
      "name": "DEPORTES VARIOS"
    },
    {
      "code": "J0307",
      "name": "OUTDOOR"
    },
    {
      "code": "J0308",
      "name": "FITNESS"
    },
    {
      "code": "J0309",
      "name": "PROMOCIONES"
    },
    {
      "code": "J0310",
      "name": "ACCESORIOS DEPORTIVOS"
    },
    {
      "code": "J0401",
      "name": "TOPS SENORA"
    },
    {
      "code": "J0402",
      "name": "BOTTOMS SENORA"
    },
    {
      "code": "J0403",
      "name": "SETS Y VESTIDOS SENORA"
    },
    {
      "code": "J0404",
      "name": "SWEATER SENORA"
    },
    {
      "code": "J0405",
      "name": "OUTERWEAR SENORA"
    },
    {
      "code": "J0406",
      "name": "TOPS MUJER JOVEN"
    },
    {
      "code": "J0407",
      "name": "BOTTOMS MUJER JOVEN"
    },
    {
      "code": "J0408",
      "name": "SETS Y VESTIDOS MUJER JOVEN"
    },
    {
      "code": "J0409",
      "name": "SWEATERS MUJER JOVEN"
    },
    {
      "code": "J0410",
      "name": "OUTERWEAR MUJER JOVEN"
    },
    {
      "code": "J0411",
      "name": "TRAJES DE BAÑO"
    },
    {
      "code": "J0412",
      "name": "MERCADOS ESPECIALES"
    },
    {
      "code": "J0413",
      "name": "MNG"
    },
    {
      "code": "J0414",
      "name": "BENETTON"
    },
    {
      "code": "J0415",
      "name": "PROMOCIONES Y CONCESIONES"
    },
    {
      "code": "J0416",
      "name": "A BORRAR"
    },
    {
      "code": "J0508",
      "name": "CARTERAS"
    },
    {
      "code": "J0509",
      "name": "ACCESORIOS"
    },
    {
      "code": "J0501",
      "name": "MEZCLILLA "
    },
    {
      "code": "J0502",
      "name": "BOTTOMS  "
    },
    {
      "code": "J0503",
      "name": "TOPS "
    },
    {
      "code": "J0504",
      "name": "SWEATERS  "
    },
    {
      "code": "J0505",
      "name": "VESTIDOS  "
    },
    {
      "code": "J0506",
      "name": "OUTERWEAR  "
    },
    {
      "code": "J0507",
      "name": "PROMOCIONES Y CONCESIONES"
    },
    {
      "code": "J0601",
      "name": "CORSETERIA"
    },
    {
      "code": "J0602",
      "name": "LENCERIA"
    },
    {
      "code": "J0603",
      "name": "PANTYS Y CALCETINES"
    },
    {
      "code": "J0604",
      "name": "CONCECIONES"
    },
    {
      "code": "J0701",
      "name": "CARTERAS"
    },
    {
      "code": "J0702",
      "name": "ACCESORIOS"
    },
    {
      "code": "J0703",
      "name": "JOYERIA"
    },
    {
      "code": "J0704",
      "name": "MARROQUINERIA"
    },
    {
      "code": "J0705",
      "name": "OPTICA"
    },
    {
      "code": "J0706",
      "name": "RELOJERIA"
    },
    {
      "code": "J0707",
      "name": "CENTRO DE CAJA"
    },
    {
      "code": "J0801",
      "name": "PERFUMERIA SEMI SELECTIVA"
    },
    {
      "code": "J0802",
      "name": "PERFUMERIA SELECTIVA"
    },
    {
      "code": "J0803",
      "name": "PERFUMERIA MASIVA"
    },
    {
      "code": "J0805",
      "name": "DERMOCOSMETICA"
    },
    {
      "code": "J0804",
      "name": "CENTRO DE CAJA"
    },
    {
      "code": "J0806",
      "name": "CONCESIONES"
    },
    {
      "code": "J0907",
      "name": "ROPA INTERIOR"
    },
    {
      "code": "J0912",
      "name": "VESTUARIO DEPORTIVO NIÑOS"
    },
    {
      "code": "J0901",
      "name": "NINOS (2-6)"
    },
    {
      "code": "J0902",
      "name": "NINOS (8-16)"
    },
    {
      "code": "J0903",
      "name": "NINAS (2-6)"
    },
    {
      "code": "J0904",
      "name": "NINAS (8-16)"
    },
    {
      "code": "J0905",
      "name": "VESTUARIO BEBE"
    },
    {
      "code": "J0906",
      "name": "RECIEN NACIDO"
    },
    {
      "code": "J0908",
      "name": "RODADOS Y ACCESORIOS BEBE"
    },
    {
      "code": "J0909",
      "name": "JUGUETERIA"
    },
    {
      "code": "J0910",
      "name": "COLEGIAL"
    },
    {
      "code": "J0911",
      "name": "PROMOCIONES CONSECIONES CENTRO DE CAJAS"
    },
    {
      "code": "J0913",
      "name": "JUEGOS DE EXTERIOR"
    },
    {
      "code": "J1101",
      "name": "VIDEO"
    },
    {
      "code": "J1102",
      "name": "AUDIO"
    },
    {
      "code": "J1103",
      "name": "FOTOGRAFIA"
    },
    {
      "code": "J1104",
      "name": "COMPUTACION Y HOGAR"
    },
    {
      "code": "J1105",
      "name": "TELEFONIA"
    },
    {
      "code": "J1106",
      "name": "REFRIGERACION"
    },
    {
      "code": "J1108",
      "name": "COCINA"
    },
    {
      "code": "J1109",
      "name": "ELECTRODOMESTICOS"
    },
    {
      "code": "J1110",
      "name": "CLIMATIZACION"
    },
    {
      "code": "J1111",
      "name": "GARANTIA EXTENDIDA"
    },
    {
      "code": "J1112",
      "name": "SERVICIOS E INSTALACIONES"
    },
    {
      "code": "J1113",
      "name": "VIDEO JUEGOS"
    },
    {
      "code": "J1114",
      "name": "ACCESORIOS"
    },
    {
      "code": "J1107",
      "name": "LAVADO"
    },
    {
      "code": "J2601",
      "name": "LIBRERIA"
    },
    {
      "code": "J2602",
      "name": "MUSICA"
    },
    {
      "code": "J1901",
      "name": "LICORERIA"
    },
    {
      "code": "J1902",
      "name": "DELIKATESSEN"
    },
    {
      "code": "J1903",
      "name": "CAFETERIA"
    },
    {
      "code": "J2002",
      "name": "PROMOCIONALES TOTTUS"
    },
    {
      "code": "J2001",
      "name": "DESCONTINUADOS"
    },
    {
      "code": "J9928",
      "name": "TELAS DECO"
    },
    {
      "code": "J9920",
      "name": "FAB-TELA PLANA"
    },
    {
      "code": "J9921",
      "name": "FAB-TELA PUNTO"
    },
    {
      "code": "J9922",
      "name": "FAB-HILADO"
    },
    {
      "code": "J9923",
      "name": "FAB-AVIOS"
    },
    {
      "code": "J9924",
      "name": "FAB-ACCESORIOS"
    },
    {
      "code": "J9925",
      "name": "PRODUCTOS DE SEGUNDA"
    },
    {
      "code": "J9932",
      "name": "MATERIALES PARA GASTOS"
    },
    {
      "code": "J9959",
      "name": "SERVICIOS ASISTENCIALES FALABELLA"
    },
    {
      "code": "J9974",
      "name": "COMPRA PROTEGIDA"
    },
    {
      "code": "J9917",
      "name": "DONACIONES"
    },
    {
      "code": "J9916",
      "name": "EGRESOS"
    },
    {
      "code": "J9986",
      "name": "CAFETERIA EMPLEADOS"
    },
    {
      "code": "J9960",
      "name": "CONSTANCIAS"
    },
    {
      "code": "J9961",
      "name": "SOAT PARTICULARES DESCUENTO"
    },
    {
      "code": "J9962",
      "name": "SOAT PARTICULARES"
    },
    {
      "code": "J9963",
      "name": "SOAT CARGA NACIONAL"
    },
    {
      "code": "J9964",
      "name": "SOAT TAXI RESTO"
    },
    {
      "code": "J9965",
      "name": "SOAT TAXI LIMA TICO"
    },
    {
      "code": "J9966",
      "name": "SOAT TAXI PROVINCIAS"
    },
    {
      "code": "J9967",
      "name": "ACCIDENTES PERSONALES"
    },
    {
      "code": "J9968",
      "name": "CREDITO AUTOMOTRIZ"
    },
    {
      "code": "J9969",
      "name": "CREDITO MI VIVIENDA"
    },
    {
      "code": "J9970",
      "name": "CREDITO HIPOTECARIO"
    },
    {
      "code": "J9971",
      "name": "RIFAS"
    },
    {
      "code": "J9972",
      "name": "ENTRADAS EM"
    },
    {
      "code": "J9973",
      "name": "ENTRADAS"
    },
    {
      "code": "J9915",
      "name": "TARJETA NOVIOS"
    },
    {
      "code": "J9914",
      "name": "VALES DE CONSUMO"
    },
    {
      "code": "J9999",
      "name": "ESPECIALES"
    },
    {
      "code": "J9913",
      "name": "ENVASES"
    },
    {
      "code": "J9951",
      "name": "VENTAS DAMNIFICADOS"
    },
    {
      "code": "J9987",
      "name": "ACTIVOS"
    },
    {
      "code": "J9901",
      "name": "VENTAS"
    },
    {
      "code": "J9902",
      "name": "RECUPERACION"
    },
    {
      "code": "J9903",
      "name": "UNIFORMES"
    },
    {
      "code": "J9904",
      "name": "TURISMO"
    },
    {
      "code": "J9905",
      "name": "LISTA DE NOVIOS"
    },
    {
      "code": "J9906",
      "name": "PROMOCIONES"
    },
    {
      "code": "J9907",
      "name": "VARIOS"
    },
    {
      "code": "J9908",
      "name": "HECHURAS"
    },
    {
      "code": "J9909",
      "name": "BENEFIT"
    },
    {
      "code": "J9910",
      "name": "CORTINEROS"
    },
    {
      "code": "J9911",
      "name": "CMR PAGO CERO"
    },
    {
      "code": "J9912",
      "name": "CMR PROM CONTADO"
    },
    {
      "code": "J9950",
      "name": "SERVICIOS TELEFONICA"
    },
    {
      "code": "J9931",
      "name": "LINEA ADM. DE PRUEBA"
    },
    {
      "code": "J9930",
      "name": "SEGURO DE SEPELIO"
    },
    {
      "code": "J9926",
      "name": "FABRICACION-AJUSTES"
    },
    {
      "code": "J3002",
      "name": "LIQUIDOS"
    },
    {
      "code": "J3004",
      "name": "PERFUMERIA MASIVA"
    },
    {
      "code": "J3001",
      "name": "ABARROTES"
    },
    {
      "code": "J3003",
      "name": "LIMPIEZA"
    },
    {
      "code": "J3101",
      "name": "CARNES"
    },
    {
      "code": "J3105",
      "name": "CONGELADOS"
    },
    {
      "code": "J3106",
      "name": "PESCADOS Y MARISCOS"
    },
    {
      "code": "J3108",
      "name": "PLATOS PREPARADOS"
    },
    {
      "code": "J3103",
      "name": "FRUTAS Y VERDURAS"
    },
    {
      "code": "J3104",
      "name": "LACTEOS"
    },
    {
      "code": "J3107",
      "name": "FIAMBRES"
    },
    {
      "code": "J3109",
      "name": "PANADERIA Y PASTELERIA"
    },
    {
      "code": "J3111",
      "name": "CAFETERIA"
    },
    {
      "code": "J4001",
      "name": "CARPINTERIA"
    },
    {
      "code": "J4002",
      "name": "MECANICA"
    },
    {
      "code": "J4003",
      "name": "MATERIAL ELECTRICO"
    },
    {
      "code": "J4004",
      "name": "HERRAMIENTAS ELECTRICAS DE MANO"
    },
    {
      "code": "J4102",
      "name": "MERCADERIA DANADA"
    },
    {
      "code": "J4101",
      "name": "PINTURAS"
    },
    {
      "code": "J4201",
      "name": "AUTOMOVILES"
    },
    {
      "code": "J4202",
      "name": "LLANTAS"
    },
    {
      "code": "J1009",
      "name": "SPRING"
    },
    {
      "code": "J1008",
      "name": "ALDO"
    },
    {
      "code": "J1002",
      "name": "ZAPATOS MUJER"
    },
    {
      "code": "J1007",
      "name": "PROMOCIONES Y CONCESIONES CALZADO"
    },
    {
      "code": "J1005",
      "name": "CALZADO COLEGIAL"
    },
    {
      "code": "J1006",
      "name": "ZAPATOS INFANTIL"
    },
    {
      "code": "J1001",
      "name": "ZAPATOS HOMBRE"
    },
    {
      "code": "J1003",
      "name": "ZAPATILLAS HOMBRE"
    },
    {
      "code": "J1004",
      "name": "ZAPATILLAS MUJER"
    },
    {
      "code": "J1201",
      "name": "ROPA DE CAMA"
    },
    {
      "code": "J1202",
      "name": "ROPA DE BAÑO"
    },
    {
      "code": "J1203",
      "name": "DECO INFANTIL"
    },
    {
      "code": "J1204",
      "name": "COJINES DECORATIVOS"
    },
    {
      "code": "J1206",
      "name": "PLAYA"
    },
    {
      "code": "J1207",
      "name": "PROMOCIONES"
    },
    {
      "code": "J1208",
      "name": "IMPULSORES BLANCO"
    },
    {
      "code": "J1308",
      "name": "PROMOCIONES"
    },
    {
      "code": "J1301",
      "name": "TAPICERIA"
    },
    {
      "code": "J1302",
      "name": "COMEDOR"
    },
    {
      "code": "J1303",
      "name": "MESAS DE COMPLEMENTO"
    },
    {
      "code": "J1304",
      "name": "COMPLEMENTOS"
    },
    {
      "code": "J1305",
      "name": "ESTANTERIA Y RTA"
    },
    {
      "code": "J1306",
      "name": "HOME OFFICE"
    },
    {
      "code": "J1307",
      "name": "TERRAZA"
    },
    {
      "code": "J1309",
      "name": "MUEBLES DE NIÑOS"
    },
    {
      "code": "J1401",
      "name": "MUEBLES DORMITORIO"
    },
    {
      "code": "J1402",
      "name": "COLCHONES"
    },
    {
      "code": "J1403",
      "name": "CAMA AMERICANA"
    },
    {
      "code": "J1404",
      "name": "BOX SPRING"
    },
    {
      "code": "J1405",
      "name": "ACCESORIOS COLCHONES"
    },
    {
      "code": "J1406",
      "name": "PROMOCIONES COLCHONES"
    },
    {
      "code": "J1501",
      "name": "COCINA"
    },
    {
      "code": "J1502",
      "name": "COMEDOR"
    },
    {
      "code": "J1503",
      "name": "ROPA DE MESA"
    },
    {
      "code": "J1504",
      "name": "PROMOCIONES MENAJE"
    },
    {
      "code": "J1505",
      "name": "IMPULSORES MENAJE"
    },
    {
      "code": "J1601",
      "name": "ALFOMBRAS"
    },
    {
      "code": "J1602",
      "name": "MALETERIA"
    },
    {
      "code": "J1603",
      "name": "CORTINAS"
    },
    {
      "code": "J1604",
      "name": "ORGANIZACION"
    },
    {
      "code": "J1605",
      "name": "IMPULSORES DECORACION"
    },
    {
      "code": "J1701",
      "name": "REGALERIA"
    },
    {
      "code": "J1702",
      "name": "NAVIDAD"
    },
    {
      "code": "J1703",
      "name": "EVENTO PAIS"
    },
    {
      "code": "J1704",
      "name": "IMPULSORES REGALOS"
    },
    {
      "code": "J1801",
      "name": "GOURMET"
    },
    {
      "code": "J1802",
      "name": "MUSICA Y LIBROS"
    },
    {
      "code": "J1803",
      "name": "CONCESIONES"
    },
    {
      "code": "J1804",
      "name": "JUAN VALDEZ"
    },
    {
      "code": "J1805",
      "name": "IMPULSORES GOURMET"
    },
    {
      "code": "J3299",
      "name": "MATERIALES"
    },
    {
      "code": "J3290",
      "name": "PARTES DE REPUESTO"
    },
    {
      "code": "J3201",
      "name": "COCINA"
    },
    {
      "code": "J3202",
      "name": "DECORACION"
    },
    {
      "code": "J3203",
      "name": "TEXTILES"
    },
    {
      "code": "J3205",
      "name": "ENTRETENIMIENTO"
    },
    {
      "code": "J3211",
      "name": "UTILIDAD"
    },
    {
      "code": "J3222",
      "name": "PROMOCIONALES Y LIQUIDACION"
    },
    {
      "code": "J3225",
      "name": "ACCESORIOS"
    },
    {
      "code": "J3250",
      "name": "MUEBLES"
    },
    {
      "code": "J2301",
      "name": "MATERIALES PARA VENTA"
    },
    {
      "code": "J2389",
      "name": "ACTIVOS"
    },
    {
      "code": "J2302",
      "name": "BOLSAS  CAJAS PAPEL PARA VENTA"
    },
    {
      "code": "J2399",
      "name": "SUMINISTROS DE TIENDA"
    },
    {
      "code": "J2303",
      "name": "OTROS GASTOS DE MATERIALES"
    },
    {
      "code": "J3304",
      "name": "SERVICIOS FOTOGRAFÍA"
    },
    {
      "code": "J2101",
      "name": "SALUD Y EQUIPAMIENTO MEDICO"
    },
    {
      "code": "J2102",
      "name": "SUPLEMENTOS & VITAMINAS"
    },
    {
      "code": "J2103",
      "name": "VEHICULOS Y REPUESTOS"
    },
    {
      "code": "J2104",
      "name": "ARTE Y OCIO"
    },
    {
      "code": "J2106",
      "name": "HERRAMIENTAS - FERRETERIA"
    },
    {
      "code": "J2107",
      "name": "MASCOTAS"
    }
  ];

  const subline = _.find(sublines, { code: sublineCode });
  if (subline) {
    return capitalize(subline.name);
  }

  return capitalize(sublineCode);
}