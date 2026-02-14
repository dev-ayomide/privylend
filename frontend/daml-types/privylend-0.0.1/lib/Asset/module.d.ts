// Generated from Asset.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

export declare type Transfer = {
  newOwner: damlTypes.Party;
};

export declare const Transfer:
  damlTypes.Serializable<Transfer> & {
  }
;


export declare type AssetToken = {
  owner: damlTypes.Party;
  assetType: string;
  quantity: damlTypes.Numeric;
  issuer: damlTypes.Party;
};

export declare interface AssetTokenInterface {
  Archive: damlTypes.Choice<AssetToken, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<AssetToken, undefined>>;
  Transfer: damlTypes.Choice<AssetToken, Transfer, damlTypes.ContractId<AssetToken>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<AssetToken, undefined>>;
}
export declare const AssetToken:
  damlTypes.Template<AssetToken, undefined, '62cadf4e59b40316f2db227451d3372d780ff562659bb9b4101528d04621e9e3:Asset:AssetToken'> &
  damlTypes.ToInterface<AssetToken, never> &
  AssetTokenInterface;

export declare namespace AssetToken {
  export type CreateEvent = damlLedger.CreateEvent<AssetToken, undefined, typeof AssetToken.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<AssetToken, typeof AssetToken.templateId>
  export type Event = damlLedger.Event<AssetToken, undefined, typeof AssetToken.templateId>
  export type QueryResult = damlLedger.QueryResult<AssetToken, undefined, typeof AssetToken.templateId>
}


