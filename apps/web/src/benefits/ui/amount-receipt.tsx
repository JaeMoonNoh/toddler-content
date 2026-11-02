import { formatRange, type AmountReceipt as Receipt } from '../domain/amount';

// 프로토타입의 영수증 모양. 받을 수 있는 현금·이용권을 더해서 보여준다
export function AmountReceipt({ receipt, birthOrderKnown }: { receipt: Receipt; birthOrderKnown: boolean }) {
  if (receipt.lines.length === 0) return null;
  const hasUnverified = receipt.lines.some(({ benefit }) => benefit.reviewStatus !== 'VERIFIED');
  return (
    <section className="receipt" aria-labelledby="receipt-title">
      <h2 id="receipt-title">받을 수 있는 금액</h2>
      <p className="sub">{birthOrderKnown ? '현금·이용권 합계 (예상)' : '몇째인지에 따라 달라서 범위로 보여드려요'}</p>
      <hr />
      {receipt.lines.map(({ benefit, range, onlyIf }) => (
        <div key={benefit.slug} className="rline">
          <span>
            {benefit.name}
            {onlyIf.length > 0 && <small className="onlyif">{onlyIf.join(', ')}</small>}
          </span>
          <span>{formatRange(range)}</span>
        </div>
      ))}
      <hr />
      <div className="rtotal">
        <span>합계 (예상)</span>
        <strong>{formatRange(receipt.total)}</strong>
      </div>
      <p className="foot">
        금액을 정리한 혜택만 더했어요.
        {receipt.notCounted.length > 0 && ` 휴가 급여·진료비 지원처럼 사람마다 금액이 다른 ${receipt.notCounted.length}건은 빼고 계산했어요.`}
        {hasUnverified && ' 검증 전 금액이 섞여 있어요.'}
      </p>
    </section>
  );
}
