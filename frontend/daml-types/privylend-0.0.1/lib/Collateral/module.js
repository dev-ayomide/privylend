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


exports.UpdatePrice = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newPrice: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    newPrice: damlTypes.Numeric(10).encode(__typed__.newPrice),
  };
}
,
};



exports.UnlockCollateral = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.LockCollateral = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({loanId: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    loanId: damlTypes.Text.encode(__typed__.loanId),
  };
}
,
};



exports.CollateralAccount = damlTypes.assembleTemplate(
{
  templateId: '62cadf4e59b40316f2db227451d3372d780ff562659bb9b4101528d04621e9e3:Collateral:CollateralAccount',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({owner: damlTypes.Party.decoder, assetType: damlTypes.Text.decoder, quantity: damlTypes.Numeric(10).decoder, marketPrice: damlTypes.Numeric(10).decoder, haircut: damlTypes.Numeric(10).decoder, effectiveValue: damlTypes.Numeric(10).decoder, isLocked: damlTypes.Bool.decoder, depositTimestamp: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    owner: damlTypes.Party.encode(__typed__.owner),
    assetType: damlTypes.Text.encode(__typed__.assetType),
    quantity: damlTypes.Numeric(10).encode(__typed__.quantity),
    marketPrice: damlTypes.Numeric(10).encode(__typed__.marketPrice),
    haircut: damlTypes.Numeric(10).encode(__typed__.haircut),
    effectiveValue: damlTypes.Numeric(10).encode(__typed__.effectiveValue),
    isLocked: damlTypes.Bool.encode(__typed__.isLocked),
    depositTimestamp: damlTypes.Time.encode(__typed__.depositTimestamp),
  };
}
,
  LockCollateral: {
    template: function () { return exports.CollateralAccount; },
    choiceName: 'LockCollateral',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.LockCollateral.decoder; }),
    argumentEncode: function (__typed__) { return exports.LockCollateral.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.CollateralAccount).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.CollateralAccount).encode(__typed__); },
  },
  UnlockCollateral: {
    template: function () { return exports.CollateralAccount; },
    choiceName: 'UnlockCollateral',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.UnlockCollateral.decoder; }),
    argumentEncode: function (__typed__) { return exports.UnlockCollateral.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.CollateralAccount).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.CollateralAccount).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.CollateralAccount; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  UpdatePrice: {
    template: function () { return exports.CollateralAccount; },
    choiceName: 'UpdatePrice',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.UpdatePrice.decoder; }),
    argumentEncode: function (__typed__) { return exports.UpdatePrice.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.CollateralAccount).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.CollateralAccount).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.CollateralAccount, ['62cadf4e59b40316f2db227451d3372d780ff562659bb9b4101528d04621e9e3', '62cadf4e59b40316f2db227451d3372d780ff562659bb9b4101528d04621e9e3']);

