// Generated from LendingPool.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

export declare type ProvideLiquidity = {
  asset: string;
  amount: damlTypes.Numeric;
};

export declare const ProvideLiquidity:
  damlTypes.Serializable<ProvideLiquidity> & {
  }
;


export declare type Pool = {
  poolOperator: damlTypes.Party;
  availableUSDC: damlTypes.Numeric;
  availableCBTC: damlTypes.Numeric;
  totalLoaned: damlTypes.Numeric;
};

export declare interface PoolInterface {
  Archive: damlTypes.Choice<Pool, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<Pool, undefined>>;
  ProvideLiquidity: damlTypes.Choice<Pool, ProvideLiquidity, damlTypes.ContractId<Pool>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<Pool, undefined>>;
}
export declare const Pool:
  damlTypes.Template<Pool, undefined, '62cadf4e59b40316f2db227451d3372d780ff562659bb9b4101528d04621e9e3:LendingPool:Pool'> &
  damlTypes.ToInterface<Pool, never> &
  PoolInterface;

export declare namespace Pool {
  export type CreateEvent = damlLedger.CreateEvent<Pool, undefined, typeof Pool.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Pool, typeof Pool.templateId>
  export type Event = damlLedger.Event<Pool, undefined, typeof Pool.templateId>
  export type QueryResult = damlLedger.QueryResult<Pool, undefined, typeof Pool.templateId>
}


