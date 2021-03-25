const path = require('path');
const fs = require('fs');
const { ipcMain, dialog } = require('electron');
const _ = require('lodash');
const moment = require('moment');
const settings = require('electron-settings');
const tingodb = require('tingodb');
const xlsx = require('./SheetJS.js');
const math = require('mathjs');

const PATH_SRC = path.join(__dirname, '.');
const PATH_DATA = path.join(PATH_SRC, '../data');

if (!fs.existsSync(PATH_DATA)) {
  fs.mkdirSync(PATH_DATA);
}

const db = new (tingodb({ searchInArray: true }).Db)(PATH_DATA, {});
const collection = db.collection('agreements');

moment.locale('es-PE');

function excelDateToJSDate(excel_date, time = false) {
  let day_time = excel_date % 1;
  let meridiem = 'AMPM';
  let hour = Math.floor(day_time * 24);
  let minute = Math.floor(Math.abs(day_time * 24 * 60) % 60);
  let second = Math.floor(Math.abs(day_time * 24 * 60 * 60) % 60);
  hour >= 12 ? meridiem = meridiem.slice(2, 4) : meridiem = meridiem.slice(0, 2);
  hour > 12 ? hour = hour - 12 : hour = hour;
  hour = hour < 10 ? '0' + hour : hour;
  minute = minute < 10 ? '0' + minute : minute;
  second = second < 10 ? '0' + second : second;
  let daytime = '' + hour + ':' + minute + ':' + second + ' ' + meridiem;
  return time ? daytime : (new Date(0, 0, excel_date, 0, -new Date(0).getTimezoneOffset(), 0)).toLocaleDateString('en-US', {}) + ' ' + daytime;
}

function totalex(items, x) {
  if (!items) { return 0 }
  let total = 0;
  _.each(items, function (item) {
    // total += (item[x] || 0);
    total += item[x];
  });
  return total;
}

function like(regex, toTest) {
  return (new RegExp(regex, 'i')).test(toTest);
}

function filter(filters = {}, agreement = {}) {

  let { code, owner, state, pending, supplier, description, bonuses, liquidations } = _.cloneDeep(agreement);

  // code
  if (filters.code && !like(filters.code, code)) {
    return;
  }

  // owner
  if (filters.owner && !like(filters.owner, owner)) {
    return;
  }

  // supplier
  if (filters.supplierName && !like(filters.supplierName, supplier.name)) {
    return;
  }

  // Rectification by current date.
  // All pending from 2 months ago are considered overdues.
  // This only changes the state of each bonus from "pending" to "overdue";
  if (state === 'pending') {
    const overdueMonth = moment().subtract(2, 'month').format('yyyy-MM');
    bonuses = _.map(bonuses, function (bonus) {
      if (bonus.state === 'pending') {
        if (moment(bonus.month).isSameOrBefore(overdueMonth, 'month')) {
          bonus.state = 'overdue';
        }
      }
      return bonus;
    });
  }

  bonuses = _.map(bonuses, function (bonus) {
    bonus.overdue = 0;
    if (bonus.state === 'overdue') {
      bonus.overdue = bonus.pending;
    }
    return bonus;
  });

  let filteredBonuses = [];

  // sublines
  if (!_.isEmpty(filters.sublines)) {
    filteredBonuses = _.filter(bonuses, function (bonus) {
      return bonus.type === 'sublínea' &&
        _.includes(filters.sublines, bonus.code);
    });

    if (_.isEmpty(filteredBonuses)) {
      return;
    }
  }

  // months
  if (!_.isEmpty(filters.months)) {
    if (_.isEmpty(filteredBonuses)) {
      filteredBonuses = bonuses;
    }

    filteredBonuses = _.filter(filteredBonuses, function (bonus) {
      return _.includes(filters.months, bonus.month);
    });

    // filtered by liquidations
    // const filteredLiquidations = _.filter(liquidations, function (liqui) {
    //   return _.includes(filters.months, liqui.month);
    // });

    if (_.isEmpty(filteredBonuses)/* && _.isEmpty(filteredLiquidations)*/) {
      return;
    }
  }

  // payment type
  if (!_.isEmpty(filters.payment)) {
    // Premature implementation.
    // Checks in the "description" field temporally.
    zzz = _.filter(filters.payment, function (payment) {
      return like(payment, description);
    });

    if (_.isEmpty(zzz)) {
      return;
    }
  }

  if (_.isEmpty(filteredBonuses)) {
    filteredBonuses = bonuses;
  }

  // state
  if (state !== 'overpaid') {
    const states = _.uniq(_.map(filteredBonuses, 'state'));
    if (states.length === 1) {
      state = states[0];
    }
    if (_.includes(states, 'overdue')) {
      state = 'overdue';
    }

    // FIXME - REVIEW THIS PART.
    // pending = totalex(filteredBonuses, 'pending');
    pending = totalex(filteredBonuses, 'total') - totalex(liquidations, 'total'); // based on bonus.total not bonus.pending
  }

  // Returns an Agreement that we use in the mapReduce from database.
  return {
    total: totalex(filteredBonuses, 'total'), // why this?
    state,
    pending,
    overdue: totalex(filteredBonuses, 'overdue'),
    bonuses: filteredBonuses
  };

}

function accumulate(facets, name, { total, pending, overdue }, count = 0) {
  let facet = facets[name];

  if (!facet) {
    facet = facets[name] = { name, count: 1, total: 0, pending: 0, overdue: 0 };
  }
  else {
    if (count) {
      facet.count += count;
    }
  }

  facet.total += total;
  facet.pending += pending;
  facet.overdue += overdue;
}

// NOTE: Im touch this handle for allow duplicate liquidations
ipcMain.handle('APP_CALCULATE', function () {

  return new Promise(function (resolve, reject) {

    console.log('APP_CALCULATE');

    // check workdir user setting
    const workdir = settings.getSync('workdir');

    // to read inputs:

    // first, clear cache
    xlsx.clear();

    // get details from excel
    const details = _.map(
      xlsx.get(path.join(workdir, 'Input.xlsx'), 'Detalles'),
      function (row) {
        const supplierCode = row['Proveedor'].split(' ')[0];
        const supplierName = row['Proveedor'].replace(supplierCode + ' ', '');
        return {
          code: row['Acuerdo'],
          name: row['Nombre'] || '',
          description: row['Descripción'] || '',
          created: row['Creación'],
          owner: row['Usuario'],
          life: {
            start: row['Inicio'],
            end: row['Fin']
          },
          supplier: {
            code: supplierCode,
            name: supplierName
          }
        };
      }
    );

    // get bonuses from excel
    const bonuses = _.map(
      xlsx.get(path.join(workdir, 'Input.xlsx'), 'Bonificaciones'),
      function (row) {
        return {
          code: row['Acuerdo'],
          bonuses: [
            {
              code: row['Código'],
              type: row['Tipo'],
              month: row['Mes'],
              total: math.round(row['Monto'], 2)
            }
          ]
        };
      }
    );

    // and get liquidations from excel
    const liquidations = _.map(
      xlsx.get(path.join(workdir, 'Input.xlsx'), 'Liquidaciones'),
      function (row) {
        return {
          code: row['Acuerdo'],
          liquidations: [
            {
              code: row['Código'],
              type: row['Tipo'],
              month: row['Mes'],
              total: math.round(row['Monto'], 2)
            }
          ]
        };
      }
    );


    // lets get started!

    let agreements = [];

    _.each(details, function (item) {
      const i = _.findIndex(agreements, { code: item.code });
      if (i < 0) {
        agreements.push(item);
      }
    });

    // Group and sum bonuses and liquidations

    _.each(bonuses, function (item) {

      const i = _.findIndex(agreements, { code: item.code });
      if (i > -1) {

        agreements[i] = _.mergeWith(agreements[i], item, function customizer(a, b) {

          if (_.isArray(a)) {

            const x = _.findIndex(a, {
              code: b[0].code,
              month: b[0].month,
              type: b[0].type
            });

            if (x > -1) {
              a[x].total += b[0].total;
            }

            else {
              return a.concat(b);
            }

            return a;
          }
        });

      }
    });

    _.each(liquidations, function (item) {

      const i = _.findIndex(agreements, { code: item.code });
      if (i > -1) {

        // agreements[i] = {
        //   code,
        //   name,
        //   ...,
        //   bonuses: [{}, ...],
        //   liquidations: [{}, ...]
        // }

        // agreements[i] = _.mergeWith(agreements[i], item, function customizer(a, b) {

        //   // if is liquidations array:
        //   if (_.isArray(a)) {

        //     return _.values(
        //       _.merge(
        //         _.keyBy(a, function (o) {
        //           return o.code + o.type + o.month;
        //         }),
        //         _.keyBy(b, function (o) {
        //           return o.code + o.type + o.month;
        //         }),
        //       )
        //     );

        //   }

        // });

        agreements[i] = _.mergeWith(agreements[i], item, function customizer(a, b) {
          // if is liquidations array:
          if (_.isArray(a)) {
            return a.concat(b);
          }
        });

      }

    });


    // some cleaning

    // remove duplicates liquidations

    // better formats
    agreements = _.map(agreements, function (agreement) {
      agreement.created = new Date(excelDateToJSDate(agreement.created));
      agreement.life.start = new Date(excelDateToJSDate(agreement.life.start));
      agreement.life.end = new Date(excelDateToJSDate(agreement.life.end));
      return agreement;
    });


    // Calculations.
    // Adds: agreement.pending = totalBonuses - totalLiquidations
    // Adds: bonus.pending that decreases totalLiquidations by bonus.total
    agreements = _.map(agreements, function (agreement) {

      let totalBonuses = 0;
      _.each(agreement.bonuses, function (bonus) {
        totalBonuses += bonus.total;
      });

      let totalLiquidations = 0;
      _.each(agreement.liquidations, function (liqui) {
        totalLiquidations += liqui.total;
      });

      // diff with sign
      agreement.pending = totalBonuses - totalLiquidations;

      // initialize state as pending
      agreement.state = 'pending';

      // set state to paid
      if (agreement.pending === 0) {
        // life/vigencia ends before 2 months ago
        if (agreement.life.end < moment().startOf('month')) {
          agreement.state = 'paid';
        }
      }

      // set state to overpaid
      if (agreement.pending < 0) {
        agreement.state = 'overpaid';
      }

      // order bonuses by month
      agreement.bonuses = _.sortBy(agreement.bonuses, function (bonus) {
        return new Date(bonus.month);
      });
      // order liquidations by month
      agreement.liquidations = _.sortBy(agreement.liquidations, function (liquidation) {
        return new Date(liquidation.month);
      });

      // Distribute liquidations.
      // Here we adds the "pending" property
      agreement.bonuses = _.map(agreement.bonuses, function (bonus) {
        bonus.state = 'paid';
        bonus.pending = 0;

        totalLiquidations -= bonus.total;
        // totalLiquidations = Math.abs(totalLiquidations) - bonus.total;

        // // test (borrar)
        // if (agreement.code == '14297') {
        //   // console.log('totalLiquidations:');
        //   // console.log(totalLiquidations);
        // }
        // // endtest

        if (totalLiquidations < 0) {

          bonus.state = 'pending';

          if (bonus.total > Math.abs(totalLiquidations)) {

            bonus.pending = Math.abs(totalLiquidations);
            totalLiquidations = 0;

          } else {
            bonus.pending = bonus.total;
          }

        }

        return bonus;
      });

      return agreement;
    });

    // test
    // Esto nos indica que hay un mal calculo al momento de obtener los pending de cada bonus
    let totalBonusesPending = 0;
    _.each(agreements, function (agreement) {
      totalBonusesPending += totalex(agreement.bonuses, 'pending');
    });
    console.log('---------------');
    console.log('Cant. Acuerdos: ' + agreements.length);
    console.log('Total Pendiente: ' + totalex(agreements, 'pending'));
    console.log('Total Bonificaciones Pendiente: ' + totalBonusesPending);
    console.log('---------------');
    // endtest

    // clear collection before adds new agreements
    collection.remove({});

    collection.insert(agreements, function (err) {
      // console.log(err);
      console.log('END APP_CALCULATE');
      resolve();
    });

    // // save to database
    // for (let i = 0; i < agreements.length; i++) {
    //   const agreement = agreements[i];

    //   collection.update(
    //     { code: agreement['code'] },
    //     agreement,
    //     { upsert: true },
    //     function (err) {
    //       // console.log(err);
    //       console.log('END APP_CALCULATE');
    //       resolve();
    //     }
    //   );

    // }

  });

});

ipcMain.handle('APP_STATISTICS', function (event, options) {

  console.log('APP_STATISTICS');

  return new Promise(function (resolve, reject) {

    collection.mapReduce(

      // map
      function () {

        const filtered = filter(options.filters, this);

        if (!filtered) {
          return;
        }

        const { total, state, pending, overdue, bonuses } = filtered;

        const facets = {};

        // facet by subline && month
        _.each(bonuses, function ({ code, type, month, total, pending, overdue }) {
          accumulate(facets, 'month-' + month, { total, pending, overdue });
          if (type === 'sublínea') {
            accumulate(facets, 'subline-' + code, { total, pending, overdue });
          }
        });

        // facet by state
        accumulate(facets, 'state-' + state, { total, pending, overdue });

        // emit
        _.each(facets, function (facet) {
          emit(facet.name, facet);
        });

      },

      // reduce
      function (name, facets) {
        const x = {};
        _.each(facets, function (facet) {
          accumulate(x, name, facet, 1);
        });
        return x[name];
      },

      // options
      {
        // query,
        out: {
          inline: 1, verbose: true
        },
        scope: {
          moment, totalex, options, filter, accumulate
        }
      },

      // results
      function (err, results, stats) {
        // console.log('err?');
        // console.log(err);
        console.log('END APP_STATISTICS');
        if (!err) { resolve(results); }
      }

    );

  });

});

resultsToExport = [];

ipcMain.handle('APP_PAGE', function (event, options) {

  console.log('APP_PAGE');

  return new Promise(function (resolve, reject) {

    collection.mapReduce(

      // map
      function () {

        const filters = options.filters;
        const filtered = filter(filters, this);

        if (!filtered) {
          return;
        }

        const { code } = this;
        const { total, state, pending, overdue } = filtered;

        if (filters.indicator) {
          if (filters.indicator !== 'state-' + state) {
            return;
          }
        }

        emit(code, _.assign({}, this, { total, state, pending, overdue }));

      },

      // reduce
      function () { },

      // options
      {
        out: { inline: 1 },
        scope: { moment, totalex, options, like, filter }
      },

      // results
      function (err, results, stats) {
        // console.log(stats);
        // console.log('results');
        // console.log(results);
        // console.log('error?');
        // console.log(err);
        // resolve({ total: results.length, items: results });

        // keep results in cache to export later
        resultsToExport = results;

        const { page, size } = options;
        const skip = size * (page - 1);
        const items = _.slice(results, skip, skip + size);

        // test
        console.log('-------------------');
        console.log('Selección - Cant. Acuerdos: ' + results.length);
        console.log('Selección - Total Pendiente: ' + totalex(results, 'pending'));
        console.log('-------------------');
        // endtest

        console.log('END APP_PAGE');

        resolve({
          totalItems: results.length,
          items,
          pending: totalex(results, 'pending'),
          overdue: totalex(results, 'overdue'),
        });
      }

    );

  });

});









ipcMain.handle('APP_EXPORT', function () {

  console.log('APP_EXPORT');

  return new Promise(function (resolve, reject) {

    dialog.showSaveDialog({

      // title: 'Descargar resultados',
      defaultPath: 'Reporte',
      // buttonLabel: 'Guardar',
      // Restricting the user to only Text Files. 
      filters: [
        {
          name: 'Excel',
          extensions: ['xlsx']
        },
      ],
      properties: []

    }).then(file => {

      // Stating whether dialog operation was cancelled or not. 
      // console.log(file.canceled);
      if (!file.canceled) {

        let data = [];

        // para sobrepagados
        _.each(resultsToExport, function (agreement) {

          _.each(agreement.bonuses, function (bonus) {
            data.push({
              'Mes': bonus.month,
              '#': agreement.code,
              'Proveedor': agreement.supplier.name,
              'Sublinea': bonus.code,
              'Descripción': agreement.description,
              'Comprador': agreement.owner,
              'Pendiente': bonus.pending,
            });
          });

          if (agreement.state === 'overpaid') {
            data.push({
              'Mes': moment(agreement.created).format('yyyy-MM'),
              '#': agreement.code,
              'Proveedor': agreement.supplier.name,
              'Sublinea': 'Sobrepagado',
              'Descripción': agreement.description,
              'Comprador': agreement.owner,
              'Pendiente': agreement.pending,
            });
          }

        });

        xlsx.set(file.filePath.toString()/* + '.xlsx'*/, 'Hoja1', data);

        // This resolve is not necessary
        resolve(resultsToExport);

        // test
        console.log('-------');
        console.log('Export Pendiente: ' + totalex(resultsToExport, 'pending'));
        console.log(file.filePath.toString());
        console.log('-------');
        // endtest

        console.log('END APP_EXPORT');

      }

    }).catch(err => {

      console.log(err);

    });




















  });
});

ipcMain.handle('APP_SETTINGS', function () {
  return new Promise(function (resolve, reject) {

    const workdir = settings.getSync('workdir');

    resolve([
      {
        name: 'workdir',
        title: 'Directorio de trabajo',
        value: workdir
      }
    ]);

  });
});

ipcMain.handle('APP_SETTINGS_SAVE', function (event, settingsForSave) {
  return new Promise(function (resolve, reject) {

    _.each(settingsForSave, function ({ name, value }) {
      settings.setSync(name, value);
    });
    resolve();

  });
});