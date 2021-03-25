
function Table({ data, columns, onClick = () => { } }) {

  if (_.isEmpty(data)) {
    return 'No se encontraron resultados.';
  }

  const $table = template('table');
  const $thead = $table.find('thead');
  const $tbody = $table.find('tbody');

  $thead.html(
    $('<tr></tr>').html(
      _.map(columns, function (column) {
        return $('<th class="table-header-' + column.source + '"></th>')
          .html(column.transformHeader ? column.transformHeader(column.header) : column.header);
      })
    )
  );

  $tbody.html(
    _.map(data, function (item) {
      return $('<tr></tr>').html(
        _.map(columns, function (column) {
          const data = item[column.source];
          return $('<td class="table-data-' + column.source + '"></td>')
            .html(column.transformData ? column.transformData(data, item) : data)
            .on('click', function (e) {
              // $table.trigger('data.click', data);
              onClick(item, column.source);
            });
        })
      );
    })
  );

  // console.log($tbody.html());
  // console.log($table.html());

  return $table;
}

function Card({ item, $state, $bonuses, $liquidations }) {
  const $card = template('card', {
    code: item.code,
    name: item.name || 'Sin nombre',
    description: item.description || 'Sin descripción',
    created: moment(item.created).format('LL'),
    owner: item.owner.toLowerCase(),
    state: item.state,
    pending: item.pending,
    overdue: item.overdue,
    //test
    realOverdue: item.realOverdue,
    //endtest
    life: {
      start: moment(item.life.start).format('LL'),
      end: moment(item.life.end).format('LL'),
    },
    supplier: {
      name: item.supplier.name
    }
  });

  $card.find('.agreement-header').on('click', function (e) {
    e.preventDefault();
    $card.toggleClass('open');
  });

  $card.find('#bonuses').html($bonuses);
  $card.find('#liquidations').html($liquidations);

  // $card.find('#state').html($state);
  $card.find('.state-container').html($state);

  // $card.find('.xtable-owner').on('click', function () {
  //   $('#owner-filter').val($(this).text()).trigger('input');
  // });
  return $card;
}

function Indicator(props) {
  const name = props.name.replace('state-', '');

  const $wrapper = template('indicator', _.extend({}, props, {
    title: locale(name) + 's',
    pending: currency(props.pending),
    overdue: currency(props.overdue)
  }));

  const $point = $('<div class="indicator-point"></div>');
  if (name === 'pending') {
    $point.addClass('indicator-point-pending color-pending');
  }
  else if (name === 'paid') {
    $point.addClass('indicator-point-paid color-paid');
  }
  else if (name === 'overpaid') {
    $point.addClass('indicator-point-overpaid color-overpaid');
  }
  else if (name === 'overdue') {
    $point.addClass('indicator-point-overdue color-overdue');
  }

  $wrapper.find('.heading').before($point);
  // $wrapper.find('.heading').css('background', 'red');

  // $wrapper.find('.box').click(function (e) {
  //   // print table totals row
  //   // console.log(subfilters);
  //   toggleSubfilter('indicator', props.name);
  //   $('#pending').text(currency(props.pending));
  //   $('#overdue').text(currency(props.overdue));
  // });

  return $wrapper;
}

function Field(props) {
  const $wrapper = template('settings-field', props);
  // $wrapper.find('').on('input', function () {});
  return $wrapper;
}



