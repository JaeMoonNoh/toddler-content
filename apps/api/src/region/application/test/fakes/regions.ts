import { NATIONWIDE_CODE, type Region } from '../../../domain/region';

// 테스트에서 함께 쓰는 작은 지역 트리: 전국 > 충북 > 청주시 > 상당구, 전국 > 세종
export const NATIONWIDE: Region = { code: NATIONWIDE_CODE, name: '전국', fullName: '전국', parentCode: null };
export const CHUNGBUK: Region = { code: '4300000000', name: '충청북도', fullName: '충청북도', parentCode: NATIONWIDE_CODE };
export const CHEONGJU: Region = { code: '4311000000', name: '청주시', fullName: '충청북도 청주시', parentCode: CHUNGBUK.code };
export const SANGDANG: Region = { code: '4311100000', name: '상당구', fullName: '충청북도 청주시 상당구', parentCode: CHEONGJU.code };
export const SEJONG: Region = { code: '3611000000', name: '세종특별자치시', fullName: '세종특별자치시', parentCode: NATIONWIDE_CODE };

export const SAMPLE_REGIONS = [NATIONWIDE, CHUNGBUK, CHEONGJU, SANGDANG, SEJONG];
