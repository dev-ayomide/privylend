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


exports.Transfer = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newOwner: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    newOwner: damlTypes.Party.encode(__typed__.newOwner),
  };
}
,
};



exports.AssetToken = damlTypes.assembleTemplate(
{
  templateId: '62cadf4e59b40316f2db227451d3372d780ff562659bb9b4101528d04621e9e3:Asset:AssetToken',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({owner: damlTypes.Party.decoder, assetType: damlTypes.Text.decoder, quantity: damlTypes.Numeric(10).decoder, issuer: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    owner: damlTypes.Party.encode(__typed__.owner),
    assetType: damlTypes.Text.encode(__typed__.assetType),
    quantity: damlTypes.Numeric(10).encode(__typed__.quantity),
    issuer: damlTypes.Party.encode(__typed__.issuer),
  };
}
,
  Archive: {
    template: function () { return exports.AssetToken; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Transfer: {
    template: function () { return exports.AssetToken; },
    choiceName: 'Transfer',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Transfer.decoder; }),
    argumentEncode: function (__typed__) { return exports.Transfer.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.AssetToken).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.AssetToken).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.AssetToken, ['62cadf4e59b40316f2db227451d3372d780ff562659bb9b4101528d04621e9e3', '62cadf4e59b40316f2db227451d3372d780ff562659bb9b4101528d04621e9e3']);

