-- 혜택의 지역을 이름(scope)에서 행정안전부 법정동코드(regionCode)로 바꾼다. 확인 기록은 그대로 둔다
ALTER TABLE "Benefit" RENAME COLUMN "scope" TO "regionCode";

UPDATE "Benefit" SET "regionCode" = CASE "regionCode"
  WHEN 'national' THEN '0000000000'
  WHEN 'chungbuk' THEN '4300000000'
  WHEN 'cheongju' THEN '4311000000'
  ELSE "regionCode"
END;
