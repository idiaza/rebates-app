

function bonusesMapper() {
  return
}

function liquidationsMapper() {
  return
}





function agreementMapper(items, { filters }) {

  return [

    {
      source: 'code',
      header: 'Acuerdo'
    },

    {
      source: 'owner',
      header: 'Dueño'
    },

    // {
    //   header: 'Bonificaciones',
    //   transformData: function (data, { bonuses }) {
    //     const { year, month } = filters;
    //     return currency(
    //       total(
    //         _.filter(bonuses, { month: `${year}-${month}` }),
    //         'total'
    //       )
    //     );
    //   },
    // },

    {
      header: 'Saldo',
      transformData: function (data, { bonuses, liquidations }) {
        const { year, month } = filters;
        return currency(total(
          _.filter(bonuses, { month: `${year}-${month}` }),
          'pending'
        ));
      },
    },

    // {
    //   header: 'Pendiente',
    //   transformData: function (data, { bonuses, liquidations }) {

    //     const { year, month } = filters;
    //     let type = 'success';

    //     const pendingTotal = total(
    //       _.filter(bonuses, { month: `${year}-${month}` }),
    //       'pending'
    //     );

    //     if (pendingTotal > 0) {
    //       type = 'warning';

    //       if (moment(`${year}-${month}`).isSameOrBefore(moment().subtract(2, 'month').format('yyyy-MM'), 'month')) {
    //         type = 'danger';
    //       }
    //     }

    //     return $(
    //       `<span class="tag is-${type}">
    //         <b>${currency(pendingTotal)}</b>
    //       </span>`
    //     );

    //   },
    // },

    // {
    //   header: 'Pendiente',
    //   transformData: function (data, { bonuses, liquidations }) {

    //     const { year, month } = filters;
    //     let type = 'success';

    //     const pendingTotal = total(
    //       _.filter(bonuses, { month: `${year}-${month}` }),
    //       'pending'
    //     );

    //     if (pendingTotal > 0) {
    //       type = 'warning';

    //       if (moment(`${year}-${month}`).isSameOrBefore(moment().subtract(2, 'month').format('yyyy-MM'), 'month')) {
    //         type = 'danger';
    //       }
    //     }

    //     return $(
    //       `<span class="tag is-${type}">
    //         <b>${currency(pendingTotal)}</b>
    //       </span>`
    //     );

    //   },
    // },

  ];

  // return [















  //   {
  //     source: 'code',
  //     header: 'Por vencer Mes',
  //     transformHeader: function (data) {
  //       return data;
  //     },
  //     transformData: function (data, { bonuses }) {
  //       const { year, month } = filters;
  //       let total = 0;
  //       _.each(_.filter(bonuses, { month: `${year}-${month}` }), function (bonus) {
  //         total += bonus.total;
  //       });

  //       return currency(total);
  //     },
  //   },
  //   {
  //     source: 'bonuses',
  //     header: 'Bonificaciones Mes',
  //     transformHeader: function (data) {
  //       return data;
  //     },
  //     transformData: function (data, { bonuses }) {
  //       const { year, month } = filters;
  //       let total = 0;
  //       _.each(_.filter(bonuses, { month: `${year}-${month}` }), function (bonus) {
  //         total += bonus.total;
  //       });

  //       return currency(total);
  //     },
  //   },















  //   {
  //     source: 'code',
  //     header: 'Número',
  //     transformHeader: function (data) {
  //       return data;
  //     },
  //     transformData: function (data) {
  //       return data;
  //     },
  //   },
  //   // {
  //   //   source: 'name',
  //   //   header: 'Nombre',
  //   //   transformHeader: function (data) {
  //   //     return data;
  //   //   },
  //   //   transformData: function (data) {
  //   //     return data;
  //   //   },
  //   // },
  //   // {
  //   //   source: 'description',
  //   //   header: 'Descripción',
  //   //   transformHeader: function (data) {
  //   //     return data;
  //   //   },
  //   //   transformData: function (data) {
  //   //     return data;
  //   //   },
  //   // },
  //   {
  //     source: 'created',
  //     header: 'Creación',
  //     transformHeader: function (data) {
  //       return data;
  //     },
  //     transformData: function (data) {
  //       return moment(data).format('L'); // 'DD/MM/YYYY'
  //     },
  //   },
  //   {
  //     source: 'owner',
  //     header: 'Usuario',
  //     transformHeader: function (data) {
  //       return data;
  //     },
  //     transformData: function (data) {
  //       return data;
  //     },
  //   },

  //   {
  //     source: 'life',
  //     header: 'Desde',
  //     transformHeader: function (data) {
  //       return data;
  //     },
  //     transformData: function (data) {
  //       return moment(
  //         // excelDateToJSDate(data['start'])
  //         data['start']
  //       ).format('DD/MM/YYYY');
  //       // return moment(new Date(parseDateExcel(data['start']))).format('yyyy-mm-dd');
  //     },
  //   },
  //   {
  //     source: 'life',
  //     header: 'Hasta',
  //     transformHeader: function (data) {
  //       return data;
  //     },
  //     transformData: function (data) {
  //       return moment(
  //         // excelDateToJSDate(data['end'])
  //         data['end']
  //       ).format('DD/MM/YYYY');
  //     },
  //   },


  //   {
  //     source: 'supplier',
  //     header: 'Proveedor',
  //     transformHeader: function (data) {
  //       return data;
  //     },
  //     transformData: function (data) {
  //       return data['name'];
  //     },
  //   },
  //   {
  //     source: 'supplier',
  //     header: 'RUT',
  //     transformHeader: function (data) {
  //       return data;
  //     },
  //     transformData: function (data) {
  //       return data['code'];
  //     },
  //   },





  //   {
  //     source: 'state',
  //     header: 'Estado', // Mes
  //     transformHeader: function (data) {
  //       return data;
  //     },
  //     transformData: function (state, item) {

  //       const { year, month } = filters;

  //       _.each(_.filter(item.bonuses, { month: `${year}-${month}` }), function (bonus) {
  //         // if (bonus.state == 'pending') {
  //         //   state = 'pending';
  //         // }
  //         state = bonus.state;
  //       });

  //       const type = state === 'paid' ? 'success' : (state === 'pending' ? 'warning' : 'danger');
  //       return $(
  //         `<span class="tag is-${type}">
  //           <b>${state.toUpperCase()}</b>
  //         </span>`
  //       );
  //     },
  //   },

  //   // en caso de 'pending', cuanto falta?
  //   {
  //     source: 'code',
  //     header: 'Pendiente', // Total
  //     transformHeader: function (data) { return data; },
  //     transformData: function (data, { state, bonuses, liquidations }) {
  //       let bonusesTotal = 0;
  //       _.each(bonuses, (bonus) => {
  //         bonusesTotal += bonus.total;
  //       });

  //       let liquidationsTotal = 0;
  //       _.each(liquidations, (liquidation) => {
  //         liquidationsTotal += liquidation.total;
  //       });

  //       const total = bonusesTotal - liquidationsTotal;
  //       const type = state === 'paid' ? 'success' : (state === 'pending' ? 'warning' : 'danger');
  //       return $(
  //         `<span class="tag is-${type}">
  //           <b>${currency(total)}</b>
  //         </span>`
  //       );
  //     },
  //   }



  //   // {
  //   //   source: 'liquidations',
  //   //   header: 'Liquidaciones',
  //   //   transformHeader: function (data) {
  //   //     return data;
  //   //   },
  //   //   transformData: function (payments) {
  //   //     let total = 0;
  //   //     _.each(payments, (payment) => {
  //   //       total += payment['total'];
  //   //     });
  //   //     // return 'S/' + total;
  //   //     return (new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(total));
  //   //   },
  //   // },


  // ];








}












// borrar
function agreementMapperTest(items) {
  return [
    {
      source: '_id',
      header: 'Número',
      transformHeader: function (data) {
        return data;
      },
      transformData: function (data) {
        return data;
      },
    },
    {
      source: 'name',
      header: 'Nombre',
      transformHeader: function (data) {
        return data;
      },
      transformData: function (data) {
        return data;
      },
    },
    {
      source: 'description',
      header: 'Descripción',
      transformHeader: function (data) {
        return data;
      },
      transformData: function (data) {
        return data;
      },
    },
    {
      source: 'state',
      header: 'Estado',
      transformHeader: function (data) {
        return data;
      },
      transformData: function (state) {
        const type = state === 'pending' ? 'warning' : 'danger';
        return $(
          `<span class="tag is-${type}">
            <b>${state.toUpperCase()}</b>
          </span>`
        );
      },
    },
    {
      source: 'start',
      header: 'Inicio',
      transformHeader: function (data) {
        return data;
      },
      transformData: function (data) {
        return data;
      },
    },
    {
      source: 'end',
      header: 'Fin',
      transformHeader: function (data) {
        return data;
      },
      transformData: function (data) {
        return data;
      },
    },
    {
      source: 'supplier',
      header: 'Proveedor',
      transformHeader: function (data) {
        return data;
      },
      transformData: function (supplier) {
        return supplier.name;
      },
    },
    {
      source: 'debts',
      header: 'Bonificación',
      transformHeader: function (data) {
        return data;
      },
      transformData: function (debts) {
        let total = 0;
        _.each(debts, (debt) => {
          total += debt;
        });
        return total;
      },
    },
    {
      source: 'payments',
      header: 'Liquidación',
      transformHeader: function (data) {
        return data;
      },
      transformData: function (payments) {
        let total = 0;
        _.each(payments, (payment) => {
          total += payment.amount;
        });
        return total;
      },
    },
  ];
}