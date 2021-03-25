

function openSettings() {
  $('#settings-popup').addClass('is-active');
}

function closeSettings() {
  $('#settings-popup').removeClass('is-active');
}




filters = {
  // sublines: [],
  // months: [],
  // payment: [],
};
function setFilter(key, value, shouldBeSetted) {

  // multiple filters

  if (key === 'sublines') {
    if (!filters[key]) { filters[key] = [] }
    if (shouldBeSetted) {
      filters[key].push(value);
    } else {
      filters[key] = _.pull(filters[key], value);
    }
  }

  else if (key === 'months') {
    if (!filters[key]) { filters[key] = [] }
    if (shouldBeSetted) {
      filters[key].push(value);
    } else {
      filters[key] = _.pull(filters[key], value);
    }
  }

  else if (key === 'payment') {
    if (!filters[key]) { filters[key] = [] }
    if (shouldBeSetted) {
      filters[key].push(value);
    } else {
      filters[key] = _.pull(filters[key], value);
    }
  }

  // single filter

  else {
    filters[key] = value;
    if (value === 'all') {
      delete filters[key];
    }
  }

  subfilters = {};
  showDashboard();
}

subfilters = {};
function setSubfilter(key, value, shouldBeSetted) {
  // if (key === 'months') {
  //   if (shouldBeSetted) {
  //     subfilters[key].push(value);
  //   } else {
  //     subfilters[key] = _.pull(subfilters[key], value);
  //   }
  // } else {
  subfilters[key] = value;
  if (value === 'all') {
    delete subfilters[key];
  }
  // }

  getPage();
}
function toggleSubfilter(key, value) {
  $('#indicators .indicator .box').removeClass('active');
  if (subfilters[key] && subfilters[key] === value) {
    setSubfilter(key, 'all');
  } else {
    setSubfilter(key, value);
    $('#indicators .indicator.indicator-' + value + ' .box').addClass('active');
  }
}

const showDashboard = _.debounce(function (initialize) {

  block('Obteniendo estadisticas...', function (unblock) {

    if (initialize) {
      filters = {};
    }

    // Get statistics from backend passing filters.
    // 
    // Each statistic have 3 properties:
    // count, facet/indicator, overdue, pending
    //
    // 4 of this statistics are indicators/headers:
    // pending, paid, overpaid and overdue
    api.invoke('APP_STATISTICS', { filters }).then(function (statistics) {

      console.log('statistics:');
      console.log(statistics);

      unblock();

      // build some filters: months & sublines
      if (initialize) {

        $('#subline-filter').html(
          _.map(

            _.sortBy(
              _.filter(statistics, function (stat) {
                return /subline-/.test(stat.name);
              }),

              'name'
            ),

            function (subline) {
              // A veces las sublineas  #N/D
              const x = subline.name.replace('subline-', '');
              if (x !== 'undefined') {
                return template('subline-filter', {
                  count: subline.count,
                  value: x,
                  title: sublineToString(x)
                });
              }
            }

          )
        );

        $('#month-filter').html(
          _.map(
            _.sortBy(
              _.filter(statistics, function (stat) {
                return /month-/.test(stat.name);
              }),

              'name'
            ),

            function (month) {
              // quick component implementation
              const x = month.name.replace('month-', '');
              return template('month-filter', {
                count: month.count,
                value: x,
                title: monthToString(x)
              });
            }
          )
        );

      }

      // build top indicators/headers with total numbers
      const indicators = _.filter(statistics, function (stat) {
        return _.includes([
          'state-pending',
          'state-paid',
          'state-overpaid',
          'state-overdue',
        ], stat.name);
      });

      $('#indicators').html(
        _.map(indicators, function (indicator) {
          return render(Indicator, indicator);
        })
      );







      //test
      // graphics
      // var ctx = document.getElementById('myChart').getContext('2d');
      asdfw($('#myChart1')[0].getContext('2d'));
      asdfw($('#myChart2')[0].getContext('2d'))
      function asdfw(ctx) {
        var chart = new Chart(ctx, {
          // The type of chart we want to create
          type: 'horizontalBar',

          // The data for our dataset
          data: {
            labels: ['Audio', 'Video', 'Cocina', 'Electrodomesticos'],
            datasets: [{
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              // backgroundColor: [
              //   'rgba(255, 99, 132, 0.2)',
              //   'rgba(54, 162, 235, 0.2)',
              //   'rgba(255, 206, 86, 0.2)',
              //   'rgba(75, 192, 192, 0.2)',
              //   'rgba(153, 102, 255, 0.2)',
              //   'rgba(255, 159, 64, 0.2)'
              // ],
              // borderColor: [
              //   'rgba(255, 99, 132, 1)',
              //   'rgba(54, 162, 235, 1)',
              //   'rgba(255, 206, 86, 1)',
              //   'rgba(75, 192, 192, 1)',
              //   'rgba(153, 102, 255, 1)',
              //   'rgba(255, 159, 64, 1)'
              // ],
              borderWidth: 1
            }]
          },

          // Configuration options go here
          // options: {
          //   scales: {
          //     yAxes: [{
          //       ticks: {
          //         beginAtZero: true
          //       }
          //     }]
          //   }
          // }
        });
      }
      //endtest

      getPage();

    });

  });

  view('dashboard');

}, .4 * 1000);


var pageToExport = [];


function getPage(pageNumber = 1, pageSize = 20) {

  block('Obteniendo acuerdos...', function (unblock) {

    api.invoke('APP_PAGE', {
      page: pageNumber,
      size: pageSize,
      filters: _.extend({}, filters, subfilters),
    }).then(function ({ totalItems, items, pending, overdue }) {

      console.log('Total Pendiente: ' + pending);

      unblock();

      // console.log('-- get page --');
      // console.log('with this filters:');
      // console.log(_.extend(filters));
      // console.log('with this subfilters:');
      // console.log(_.extend(subfilters));
      console.log('items:');
      console.log(items);
      pageToExport = items;

      // print table items rows
      $('#result').html(
        _.map(items, function (item) {

          const overdue = totalex(
            _.filter(item.bonuses, function (bonus) {
              return moment(bonus.month)
                .isSameOrBefore(
                  moment().subtract(2, 'month').format('yyyy-MM'),
                  'month'
                );
            }),
            'pending'
          );

          // const state = (overdue > 0) ? 'overdue' : item.state;
          const state = item.state;

          // //test
          // // $state = $('<div style="display: flex;align-items: center;height: 100%;width: 100%;justify-content: space-around;"></div>');
          // $state = $('<div style="display: flex;"></div>');
          // $state.append($('<div class="indicator-point indicator-point-pending"></div>'));
          // $state.append($('<div class="indicator-point indicator-point-paid"></div>'));
          // $state.append($('<div class="indicator-point indicator-point-overpaid"></div>'));
          // $state.append($('<div class="indicator-point indicator-point-overdue"></div>'));
          // //endtest

          return render(Card, {

            // $state: $(
            //   `<span class="tag is-${
            //   (state === 'paid' ? 'success' : (state === 'overpaid' ? 'danger' : (state === 'pending' ? 'warning' : (state === 'overdue' ? 'danger' : 'warning'))))
            //   }">
            //     <b>${locale(state).toUpperCase()}</b>
            //   </span>`
            // ),
            $state: $(
              `<span class="tag color-${state}">
                <b>${locale(state).toUpperCase()}</b>
              </span>`
            ),
            // $state,

            item: _.assign(item, {
              pending: item.pending ? currency(item.pending, true) : '-',
              overdue: item.overdue ? currency(item.overdue, true) : '-',
              //test
              realOverdue: overdue ? currency(overdue) : '-',
              //endtest
            }),

            $bonuses: render(Table, {
              data: item.bonuses,
              columns: [
                {
                  source: 'month',
                  header: 'Mes',
                  transformData: function (month) {
                    return monthToString(month);
                  }
                },
                {
                  source: 'type',
                  header: 'Tipo',
                  transformData: function (type) {
                    return _.capitalize(type);
                  }
                },
                {
                  source: 'code',
                  header: 'Código',
                  transformData: function (code, item) {
                    if (item.type === 'sublínea') {
                      // return code + ' - ' + sublineToString(code);
                      return code === '' ? '---' : sublineToString(code);
                    }
                    return code;
                  }
                },
                {
                  source: 'total',
                  header: 'Monto',
                  transformData: function (data) {
                    return currency(data);
                  }
                },
                {
                  source: 'state',
                  header: 'Estado',
                  transformData: function (state, bonus) {

                    if (moment(bonus.month)
                      .isSameOrBefore(
                        moment().subtract(2, 'month').format('yyyy-MM'),
                        'month'
                      )) {
                      state = (bonus.pending > 0) ? 'overdue' : state;
                    }

                    // const type = state === 'paid' ? 'success' : (state === 'pending' ? 'warning' : 'danger');
                    return $(
                      `<span class="tag color-${state}">
                        <b>${locale(state).toUpperCase()}</b>
                      </span>`
                    );

                  }
                },
                {
                  source: 'pending',
                  header: 'Saldo',
                  transformData: function (data) {
                    if (data) {
                      return currency(data);
                    }
                    return '-';
                  }
                },
              ]
            }),

            $liquidations: render(Table, {
              data: item.liquidations,
              columns: [
                {
                  source: 'month',
                  header: 'Mes',
                  transformData: function (month) {
                    return monthToString(month);
                  }
                },
                {
                  source: 'type',
                  header: 'Tipo',
                  transformData: function (type) {
                    return _.capitalize(type);
                  }
                },
                {
                  source: 'code',
                  header: 'Código'
                },
                {
                  source: 'total',
                  header: 'Monto',
                  transformData: function (data) {
                    return currency(data);
                  }
                },
              ]
            }),

          });

        })
      );

      // print table totals row
      $('#pending').text(currency(pending));
      $('#overdue').text(currency(overdue));

      $('#xyz').text(totalItems + ' acuerdo' + (totalItems > 1 ? 's' : '') + ' (Mostrando ' + pageSize + ' por página)');

      // print pagination
      $('#pagination').pagination({
        items: totalItems,
        itemsOnPage: pageSize,
        currentPage: pageNumber,
        prevText: 'Anterior',
        nextText: 'Siguiente',
        // cssStyle: 'compact-theme',
        onPageClick: function (pageNumber) {
          getPage(pageNumber, pageSize);
        }
      });

    });
  });


































  // const total = 1000;


}




api.on('APP_INIT', async ({ productName, version }) => {
  $(document).ready(function () {

    $('title').text(productName + ' v' + version);

    // keyboard shortcuts
    hotkeys('*', { keyup: true }, function (event, handler) {
      if (hotkeys.ctrl) {
        if (event.type === 'keydown') {
          $('.app').addClass('show-shortcuts');
        }

        if (event.type === 'keyup') {
          $('.app').removeClass('show-shortcuts');
        }
      }
    });

    api.invoke('APP_SETTINGS', {}).then(function (settings) {

      // set locale
      moment.locale('es-PE');

      _.each(settings, function ({ name, title, value }) {
        $('#settings-popup-fields').append(render(Field, {
          name, title, value
        }));
      });

    });

    // open/close filters button
    $('#open-filters').on('click', () => {
      $('.dashboard-filters').toggleClass('open');
      $('.dashboard-indicators').toggleClass('open');
    });

    // settings popup
    $('#open-settings').on('click', () => {
      openSettings();
    });
    $('#settings-popup-backdrop, #settings-popup-close, #settings-popup-save, #settings-popup-cancel').on('click', () => {
      closeSettings();
    });
    // $('#settings-popup-save').on('click', () => {});
    $('#settings-popup-form').on('submit', (e) => {
      e.preventDefault();
      api
        .invoke('APP_SETTINGS_SAVE', $('#settings-popup-form').serializeArray())
        .then(function () {
          console.log('Saving settings is done.');
        });
    });

    // recalculations
    $('#recalculate').on('click', function () {
      block('Calculando...', function (unblock) {
        api.invoke('APP_CALCULATE').then(function () {
          unblock();
          showDashboard(true);
        });
      });
    });

    // excels generation
    $('#export').on('click', async () => {



      // console.log(pageToExport);
      block('Exportando...', function (unblock) {
        api.invoke('APP_EXPORT').then(function (results) {
          unblock();
          // showDashboard(true);
          console.log('export done!');
          console.log(results);
        });
      });
    });

    $('.card-header').on('click', function () {
      $(this).parent('.card').toggleClass('close');
    });

    // views module
    $('.views-selector-button').on('click', function () {
      const $this = $(this);
      $this.siblings().removeClass('active');
      $this.addClass('active');
      view($this.data('view'));
    });

    // tabs module
    function tab(name) {
      $('.xtabs li').removeClass('active');
      $('.xtabs li > [data-tab="' + name + '"]').parent().addClass('active');
      $('.tabs-container .tab').removeClass('active');
      $('.tabs-container .tab#' + name + '-tab').addClass('active');
    }
    $('.xtabs > li').on('click', function (e) {
      e.preventDefault();
      tab($(this).find('>a').data('tab'));
    });
    // The default tab
    tab('agreements');
    // tab('sublines');

    // start the dashboard view with initialize param
    showDashboard(true);

  });
});