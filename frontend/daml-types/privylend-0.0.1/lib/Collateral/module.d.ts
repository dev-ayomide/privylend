// Generated from Collateral.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

export declare type UpdatePrice = {
  newPrice: damlTypes.Numeric;
};

export declare const UpdatePrice:
  damlTypes.Serializable<UpdatePrice> & {
  }
;


export declare type UnlockCollateral = {
};

export declare const UnlockCollateral:
  damlTypes.Serializable<UnlockCollateral> & {
  }
;


export declare type LockCollateral = {
  loanId: string;
};

export declare const LockCollateral:
  damlTypes.Serializable<LockCollateral> & {
  }
;


export declare type CollateralAccount = {
  owner: damlTypes.Party;
  assetType: string;
  quantity: damlTypes.Numeric;
  marketPrice: damlTypes.Numeric;
  haircut: damlTypes.Numeric;
  effectiveValue: damlTypes.Numeric;
  isLocked: boolean;
  depositTimestamp: damlTypes.Time;
};

export declare interface CollateralAccountInterface {
  LockCollateral: damlTypes.Choice<CollateralAccount, LockCollateral, damlTypes.ContractId<CollateralAccount>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<CollateralAccount, undefined>>;
  UnlockCollateral: damlTypes.Choice<CollateralAccount, UnlockCollateral, damlTypes.ContractId<CollateralAccount>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<CollateralAccount, undefined>>;
  Archive: damlTypes.Choice<CollateralAccount, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<CollateralAccount, undefined>>;
  UpdatePrice: damlTypes.Choice<CollateralAccount, UpdatePrice, damlTypes.ContractId<CollateralAccount>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<CollateralAccount, undefined>>;
}
export declare const CollateralAccount:
  damlTypes.Template<CollateralAccount, undefined, '62cadf4e59b40316f2db227451d3372d780ff562659bb9b4101528d04621e9e3:Collateral:CollateralAccount'> &
  damlTypes.ToInterface<CollateralAccount, never> &
  CollateralAccountInterface;

export declare namespace CollateralAccount {
  export type CreateEvent = damlLedger.CreateEvent<CollateralAccount, undefined, typeof CollateralAccount.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<CollateralAccount, typeof CollateralAccount.templateId>
  export type Event = damlLedger.Event<CollateralAccount, undefined, typeof CollateralAccount.templateId>
  export type QueryResult = damlLedger.QueryResult<CollateralAccount, undefined, typeof CollateralAccount.templateId>
}


