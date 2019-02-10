import { Mosaic, MosaicHttp, MosaicId, PublicAccount, XEM, NetworkType, TransactionType, AccountHttp, MosaicInfo, TransferTransaction } from 'nem2-sdk';
import { Observable } from 'rxjs';

const accountHttp = new AccountHttp('http://192.168.11.77:3000');
const mosaicHttp = new MosaicHttp('http://192.168.11.77:3000');

function formatMosaics(mosaics: Mosaic[]): Observable<{ mosaic: Mosaic, mosaicInfo: MosaicInfo }[]> {
    return Observable.from(mosaics)
        .flatMap(mosaic => {
            return mosaicHttp.getMosaic(mosaic.id).map(mosaicInfo => {
                return { 'mosaic': mosaic, 'mosaicInfo': mosaicInfo }
            })
        }).toArray();
}

const publicKey = '3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57';
const account = PublicAccount.createFromPublicKey(publicKey, NetworkType.MIJIN_TEST);

const transactionObservable = accountHttp.transactions(account)
    .flatMap(_ => _);

Observable.zip(
    transactionObservable
        .filter(_ => _.type != TransactionType.TRANSFER)
        .toArray(),
    transactionObservable
        .filter(_ => _.type == TransactionType.TRANSFER)
        .map(_ => _ as TransferTransaction)
        .flatMap(_ => formatMosaics(_.mosaics)
            .map((mosaics) => Object.assign({}, _, { mosaics })))
        .toArray()
).flatMap(_ => _)
    .subscribe(x => console.log(x), err => console.error(err))