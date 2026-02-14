// Generated from Loan.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

export declare type TriggerLiquidation = {
};

export declare const TriggerLiquidation:
  damlTypes.Serializable<TriggerLiquidation> & {
  }
;


export declare type MakePayment = {
  paymentAmount: damlTypes.Numeric;
};

export declare const MakePayment:
  damlTypes.Serializable<MakePayment> & {
  }
;


export declare type UpdateCollateralValue = {
  newCollateralValue: damlTypes.Numeric;
};

export declare const UpdateCollateralValue:
  damlTypes.Serializable<UpdateCollateralValue> & {
  }
;


export declare type ActiveLoan = {
  borrower: damlTypes.Party;
  lender: damlTypes.Party;
  loanAsset: string;
  principal: damlTypes.Numeric;
  outstandingBalance: damlTypes.Numeric;
  collateralValue: damlTypes.Numeric;
  currentLTV: damlTypes.Numeric;
  interestRate: damlTypes.Numeric;
  startDate: damlTypes.Time;
  dueDate: damlTypes.Time;
  status: string;
  marginCallThreshold: damlTypes.Numeric;
  liquidationThreshold: damlTypes.Numeric;
};

export declare interface ActiveLoanInterface {
  UpdateCollateralValue: damlTypes.Choice<ActiveLoan, UpdateCollateralValue, damlTypes.ContractId<ActiveLoan>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<ActiveLoan, undefined>>;
  MakePayment: damlTypes.Choice<ActiveLoan, MakePayment, damlTypes.ContractId<ActiveLoan>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<ActiveLoan, undefined>>;
  Archive: damlTypes.Choice<ActiveLoan, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<ActiveLoan, undefined>>;
  TriggerLiquidation: damlTypes.Choice<ActiveLoan, TriggerLiquidation, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<ActiveLoan, undefined>>;
}
export declare const ActiveLoan:
  damlTypes.Template<ActiveLoan, undefined, '62cadf4e59b40316f2db227451d3372d780ff562659bb9b4101528d04621e9e3:Loan:ActiveLoan'> &
  damlTypes.ToInterface<ActiveLoan, never> &
  ActiveLoanInterface;

export declare namespace ActiveLoan {
  export type CreateEvent = damlLedger.CreateEvent<ActiveLoan, undefined, typeof ActiveLoan.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<ActiveLoan, typeof ActiveLoan.templateId>
  export type Event = damlLedger.Event<ActiveLoan, undefined, typeof ActiveLoan.templateId>
  export type QueryResult = damlLedger.QueryResult<ActiveLoan, undefined, typeof ActiveLoan.templateId>
}



export declare type ApproveLoan = {
};

export declare const ApproveLoan:
  damlTypes.Serializable<ApproveLoan> & {
  }
;


export declare type LoanRequest = {
  borrower: damlTypes.Party;
  lendingPool: damlTypes.Party;
  collateralId: string;
  requestedAsset: string;
  requestedAmount: damlTypes.Numeric;
  collateralValue: damlTypes.Numeric;
  interestRate: damlTypes.Numeric;
  status: string;
};

export declare interface LoanRequestInterface {
  ApproveLoan: damlTypes.Choice<LoanRequest, ApproveLoan, damlTypes.ContractId<ActiveLoan>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<LoanRequest, undefined>>;
  Archive: damlTypes.Choice<LoanRequest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<LoanRequest, undefined>>;
}
export declare const LoanRequest:
  damlTypes.Template<LoanRequest, undefined, '62cadf4e59b40316f2db227451d3372d780ff562659bb9b4101528d04621e9e3:Loan:LoanRequest'> &
  damlTypes.ToInterface<LoanRequest, never> &
  LoanRequestInterface;

export declare namespace LoanRequest {
  export type CreateEvent = damlLedger.CreateEvent<LoanRequest, undefined, typeof LoanRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<LoanRequest, typeof LoanRequest.templateId>
  export type Event = damlLedger.Event<LoanRequest, undefined, typeof LoanRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<LoanRequest, undefined, typeof LoanRequest.templateId>
}


