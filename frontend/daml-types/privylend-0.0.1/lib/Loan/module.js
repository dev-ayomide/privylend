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


exports.TriggerLiquidation = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.MakePayment = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({paymentAmount: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    paymentAmount: damlTypes.Numeric(10).encode(__typed__.paymentAmount),
  };
}
,
};



exports.UpdateCollateralValue = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newCollateralValue: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    newCollateralValue: damlTypes.Numeric(10).encode(__typed__.newCollateralValue),
  };
}
,
};



exports.ActiveLoan = damlTypes.assembleTemplate(
{
  templateId: '62cadf4e59b40316f2db227451d3372d780ff562659bb9b4101528d04621e9e3:Loan:ActiveLoan',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({borrower: damlTypes.Party.decoder, lender: damlTypes.Party.decoder, loanAsset: damlTypes.Text.decoder, principal: damlTypes.Numeric(10).decoder, outstandingBalance: damlTypes.Numeric(10).decoder, collateralValue: damlTypes.Numeric(10).decoder, currentLTV: damlTypes.Numeric(10).decoder, interestRate: damlTypes.Numeric(10).decoder, startDate: damlTypes.Time.decoder, dueDate: damlTypes.Time.decoder, status: damlTypes.Text.decoder, marginCallThreshold: damlTypes.Numeric(10).decoder, liquidationThreshold: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    borrower: damlTypes.Party.encode(__typed__.borrower),
    lender: damlTypes.Party.encode(__typed__.lender),
    loanAsset: damlTypes.Text.encode(__typed__.loanAsset),
    principal: damlTypes.Numeric(10).encode(__typed__.principal),
    outstandingBalance: damlTypes.Numeric(10).encode(__typed__.outstandingBalance),
    collateralValue: damlTypes.Numeric(10).encode(__typed__.collateralValue),
    currentLTV: damlTypes.Numeric(10).encode(__typed__.currentLTV),
    interestRate: damlTypes.Numeric(10).encode(__typed__.interestRate),
    startDate: damlTypes.Time.encode(__typed__.startDate),
    dueDate: damlTypes.Time.encode(__typed__.dueDate),
    status: damlTypes.Text.encode(__typed__.status),
    marginCallThreshold: damlTypes.Numeric(10).encode(__typed__.marginCallThreshold),
    liquidationThreshold: damlTypes.Numeric(10).encode(__typed__.liquidationThreshold),
  };
}
,
  UpdateCollateralValue: {
    template: function () { return exports.ActiveLoan; },
    choiceName: 'UpdateCollateralValue',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.UpdateCollateralValue.decoder; }),
    argumentEncode: function (__typed__) { return exports.UpdateCollateralValue.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.ActiveLoan).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.ActiveLoan).encode(__typed__); },
  },
  MakePayment: {
    template: function () { return exports.ActiveLoan; },
    choiceName: 'MakePayment',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.MakePayment.decoder; }),
    argumentEncode: function (__typed__) { return exports.MakePayment.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.ActiveLoan).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.ActiveLoan).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.ActiveLoan; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  TriggerLiquidation: {
    template: function () { return exports.ActiveLoan; },
    choiceName: 'TriggerLiquidation',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.TriggerLiquidation.decoder; }),
    argumentEncode: function (__typed__) { return exports.TriggerLiquidation.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.ActiveLoan, ['62cadf4e59b40316f2db227451d3372d780ff562659bb9b4101528d04621e9e3', '62cadf4e59b40316f2db227451d3372d780ff562659bb9b4101528d04621e9e3']);



exports.ApproveLoan = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.LoanRequest = damlTypes.assembleTemplate(
{
  templateId: '62cadf4e59b40316f2db227451d3372d780ff562659bb9b4101528d04621e9e3:Loan:LoanRequest',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({borrower: damlTypes.Party.decoder, lendingPool: damlTypes.Party.decoder, collateralId: damlTypes.Text.decoder, requestedAsset: damlTypes.Text.decoder, requestedAmount: damlTypes.Numeric(10).decoder, collateralValue: damlTypes.Numeric(10).decoder, interestRate: damlTypes.Numeric(10).decoder, status: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    borrower: damlTypes.Party.encode(__typed__.borrower),
    lendingPool: damlTypes.Party.encode(__typed__.lendingPool),
    collateralId: damlTypes.Text.encode(__typed__.collateralId),
    requestedAsset: damlTypes.Text.encode(__typed__.requestedAsset),
    requestedAmount: damlTypes.Numeric(10).encode(__typed__.requestedAmount),
    collateralValue: damlTypes.Numeric(10).encode(__typed__.collateralValue),
    interestRate: damlTypes.Numeric(10).encode(__typed__.interestRate),
    status: damlTypes.Text.encode(__typed__.status),
  };
}
,
  ApproveLoan: {
    template: function () { return exports.LoanRequest; },
    choiceName: 'ApproveLoan',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveLoan.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveLoan.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.ActiveLoan).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.ActiveLoan).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.LoanRequest; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.LoanRequest, ['62cadf4e59b40316f2db227451d3372d780ff562659bb9b4101528d04621e9e3', '62cadf4e59b40316f2db227451d3372d780ff562659bb9b4101528d04621e9e3']);

