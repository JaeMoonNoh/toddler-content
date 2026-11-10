'use client';

import { useEffect, useRef, useState } from 'react';
import { drawGiftCard, type GiftCardArt } from './gift-card-image';

const FILE_NAME = '우리-아이-축하-선물.png';

// 누르면 그 자리에서 이미지를 그려 미리 보여주고, 휴대폰은 공유 창으로, 그 밖에는 파일로 저장한다
export function GiftCardButton({ art }: { art: GiftCardArt }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [image, setImage] = useState<{ file: File; url: string } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!image) return;
    return () => URL.revokeObjectURL(image.url);
  }, [image]);

  const open = async () => {
    setFailed(false);
    try {
      const file = new File([await drawGiftCard(art)], FILE_NAME, { type: 'image/png' });
      setImage({ file, url: URL.createObjectURL(file) });
      dialogRef.current?.showModal();
    } catch {
      setFailed(true);
    }
  };

  const canShare = image !== null && typeof navigator.canShare === 'function' && navigator.canShare({ files: [image.file] });
  const share = () => image && navigator.share({ files: [image.file] }).catch(() => undefined);

  return (
    <>
      <button type="button" className="btn gift-open" onClick={open}>
        {art.callName} 축하 선물 카드 만들기
      </button>
      {failed && <p className="hint">카드를 만들지 못했어요. 다시 눌러 주세요.</p>}
      <dialog ref={dialogRef} className="gift" aria-label="축하 선물 카드">
        {image && <img src={image.url} alt={`${art.callName} 축하 선물 카드`} width={1080} height={1350} />}
        <div className="gift-actions">
          {canShare && (
            <button type="button" className="btn" onClick={share}>
              공유하기
            </button>
          )}
          <a className={canShare ? 'linkbtn' : 'btn'} href={image?.url} download={FILE_NAME}>
            이미지 저장
          </a>
          <button type="button" className="linkbtn" onClick={() => dialogRef.current?.close()}>
            닫기
          </button>
        </div>
      </dialog>
    </>
  );
}
