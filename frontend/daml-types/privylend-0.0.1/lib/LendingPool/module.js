"use strict";
/* eslint-disable-next-line no-unused-vars */
function __export(m) {
/* eslint-disable-next-line no-prototype-builtins */
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable-next-line no-unused-vars */
var jtv = require('@mojotech/json-type-validation');
/* eslint-disable-next-line no-unused-vars */
var damlTypes = require('@daml/types');
/* eslint-disable-next-line no-unused-vars */
var damlLedger = require('@daml/ledger');

var pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 = require('@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662');


exports.ProvideLiquidity = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({asset: damlTypes.Text.decoder, amount: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    asset: damlTypes.Text.encode(__typed__.asset),
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
  };
}
,
};



exports.Pool = damlTypes.assembleTemplate(
{
  templateId: '62cadf4e59b40316f2db227451d3372d780ff562659bb9b4101528d04621e9e3:LendingPool:Pool',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({poolOperator: damlTypes.Party.decoder, availableUSDC: damlTypes.Numeric(10).decoder, availableCBTC: damlTypes.Numeric(10).decoder, totalLoaned: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    poolOperator: damlTypes.Party.encode(__typed__.poolOperator),
    availableUSDC: damlTypes.Numeric(10).encode(__typed__.availableUSDC),
    availableCBTC: damlTypes.Numeric(10).encode(__typed__.availableCBTC),
    totalLoaned: damlTypes.Numeric(10).encode(__typed__.totalLoaned),
  };
}
,
  Archive: {
    template: function () { return exports.Pool; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  ProvideLiquidity: {
    template: function () { return exports.Pool; },
    choiceName: 'ProvideLiquidity',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ProvideLiquidity.decoder; }),
    argumentEncode: function (__typed__) { return exports.ProvideLiquidity.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.Pool).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.Pool).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.Pool, ['62cadf4e59b40316f2db227451d3372d780ff562659bb9b4101528d04621e9e3', '62cadf4e59b40316f2db227451d3372d780ff562659bb9b4101528d04621e9e3']);

